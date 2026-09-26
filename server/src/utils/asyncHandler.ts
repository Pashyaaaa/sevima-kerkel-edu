import type { Request, Response, NextFunction, RequestHandler } from "express";

// Membungkus route handler async supaya error otomatis dilempar ke error middleware,
// tanpa perlu try/catch berulang di tiap controller.
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
