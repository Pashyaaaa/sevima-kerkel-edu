import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../model/authModel.js";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan!" });
    return;
  }

  // Pisahkan header
  const parts = authHeader.split(" ");
  const token = parts[1]; // Di sini token berpotensi undefined

  // FIX 1: Pastikan token benar-benar ada isinya
  if (!token) {
    res.status(401).json({ message: "Format token tidak valid!" });
    return;
  }

  const secret = process.env.JWT_SECRET;

  // FIX 2: Pastikan secret ada
  if (!secret) {
    console.error("CRITICAL: JWT_SECRET belum di-set di file .env");
    res.status(500).json({ message: "Terjadi kesalahan konfigurasi server." });
    return;
  }

  try {
    // Sekarang token dan secret dijamin 100% bertipe 'string'
    const decoded = jwt.verify(token, secret) as unknown as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token tidak valid atau sudah kadaluarsa!" });
  }
};
