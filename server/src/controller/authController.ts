import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../app/db.js";
import type { RegisterRequest, LoginRequest } from "../model/authModel.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // buat maxAge cookie

// helper biar ga nulis config cookie berkali-kali
function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true, // ga bisa diakses JS di browser (proteksi XSS)
    secure: process.env.NODE_ENV === "production", // https only pas production
    sameSite: "strict", // proteksi CSRF dasar
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: "/api/auth", // cookie cuma dikirim ke route auth, bukan ke semua request
  });
}

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: "Email sudah digunakan oleh instansi lain!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Registrasi berhasil! Silakan login.",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("[AUTH_REGISTER_ERROR]:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res
        .status(401)
        .json({ message: "Kredensial tidak valid (Email tidak ditemukan)." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: "Kredensial tidak valid (Password salah)." });
      return;
    }

    const accessSecret = process.env.JWT_SECRET as string;
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      accessSecret,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
      expiresIn: REFRESH_TOKEN_TTL,
    });

    // simpen HASH-nya aja di DB, bukan token mentah
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: "Login berhasil!",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[AUTH_LOGIN_ERROR]:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (!tokenFromCookie) {
      res.status(401).json({ message: "Refresh token tidak ditemukan." });
      return;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

    let payload: { userId: number };
    try {
      payload = jwt.verify(tokenFromCookie, refreshSecret) as {
        userId: number;
      };
    } catch {
      // signature invalid atau expired
      res.clearCookie("refreshToken", { path: "/api/auth" });
      res
        .status(403)
        .json({ message: "Refresh token tidak valid atau kedaluwarsa." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      res
        .status(403)
        .json({ message: "Sesi tidak ditemukan, silakan login ulang." });
      return;
    }

    // cocokin token yang dikirim sama hash yang tersimpan di DB
    const isMatch = await bcrypt.compare(tokenFromCookie, user.refreshToken);
    if (!isMatch) {
      // kemungkinan token lama/dicuri dipakai lagi -> revoke sesi demi keamanan
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
      res.clearCookie("refreshToken", { path: "/api/auth" });
      res.status(403).json({ message: "Refresh token tidak dikenali." });
      return;
    }

    const accessSecret = process.env.JWT_SECRET as string;
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      accessSecret,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // rotasi refresh token: bikin baru tiap kali dipake, biar makin susah di-replay
    const newRefreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
      expiresIn: REFRESH_TOKEN_TTL,
    });
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedNewRefreshToken },
    });
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("[AUTH_REFRESH_ERROR]:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (tokenFromCookie) {
      const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
      try {
        const payload = jwt.verify(tokenFromCookie, refreshSecret) as {
          userId: number;
        };
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      } catch {
        // token expired/invalid, ga masalah, tetep lanjut hapus cookie
      }
    }

    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.status(200).json({ message: "Logout berhasil." });
  } catch (error) {
    console.error("[AUTH_LOGOUT_ERROR]:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
