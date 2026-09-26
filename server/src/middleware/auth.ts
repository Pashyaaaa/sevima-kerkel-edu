import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "../utils/appError";
import type { Role } from "../generated/prisma";

// Perluas tipe Request supaya req.user dikenali di seluruh app
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

/** Wajib login. Menempelkan req.user = { id, role } */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Token tidak ditemukan. Silakan login.", 401));
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError("Token tidak valid atau kadaluarsa.", 401));
  }
}

/** Wajib punya salah satu role yang diizinkan. Panggil setelah requireAuth. */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Belum login.", 401));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Kamu tidak punya akses untuk aksi ini.", 403));
    }
    next();
  };
}
