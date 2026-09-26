import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { sanitizePlainText } from "../utils/sanitize";
import { requireAuth } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  // Role bisa dipilih saat register (mis. guru daftar sebagai ADMIN).
  // Default STUDENT kalau tidak diisi.
  role: z.enum(["ADMIN", "STUDENT"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function toPublicUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}

// POST /api/auth/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) throw new AppError("Email sudah terdaftar.", 409);

    const hashed = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: sanitizePlainText(body.name),
        email: body.email.toLowerCase(),
        password: hashed,
        role: body.role ?? "STUDENT",
      },
    });

    const token = signToken({ id: user.id, role: user.role });

    res.status(201).json({ success: true, data: { user: toPublicUser(user), token } });
  })
);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user) throw new AppError("Email atau password salah.", 401);

    const match = await bcrypt.compare(body.password, user.password);
    if (!match) throw new AppError("Email atau password salah.", 401);

    const token = signToken({ id: user.id, role: user.role });

    res.json({ success: true, data: { user: toPublicUser(user), token } });
  })
);

// GET /api/auth/me
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
    res.json({ success: true, data: { user: toPublicUser(user) } });
  })
);

export default router;
