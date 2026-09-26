import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/appError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukclean.`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Validasi input (zod)
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Input tidak valid.",
      errors: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  // Error unik/relasi dari Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target =
        (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return res.status(409).json({
        success: false,
        message: `Data duplikat pada: ${target}. Kemungkinan kamu sudah melakukan aksi ini sebelumnya.`,
      });
    }
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan." });
    }
  }

  // Error custom kita sendiri
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Fallback: error tak terduga
  console.error(err);
  return res
    .status(500)
    .json({ success: false, message: "Terjadi kesalahan pada server." });
}
