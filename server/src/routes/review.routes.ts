import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { sanitizePlainText } from "../utils/sanitize";
import { requireAuth, requireRole } from "../middleware/auth";
import { ensureClassAccess } from "./class.routes";

const router = Router();

const createReviewSchema = z.object({
  score: z.coerce.number().int().min(0).max(100),
  feedback: z.string().max(3000).optional(),
});

// POST /api/submissions/:submissionId/reviews (STUDENT, bukan pemilik submission, member kelas)
router.post(
  "/submissions/:submissionId/reviews",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({ where: { id: req.params.submissionId } });
    if (!submission) throw new AppError("Submission tidak ditemukan.", 404);

    const assignment = await prisma.assignment.findUniqueOrThrow({ where: { id: submission.assignmentId } });
    await ensureClassAccess(assignment.classId, req.user!.id, req.user!.role);

    if (submission.userId === req.user!.id) {
      throw new AppError("Kamu tidak bisa menilai submission milikmu sendiri.", 403);
    }

    if (assignment.deadline.getTime() > Date.now()) {
      throw new AppError("Penilaian baru bisa dilakukan setelah deadline pengumpulan berakhir.", 403);
    }

    const existing = await prisma.review.findUnique({
      where: { submissionId_reviewerId: { submissionId: submission.id, reviewerId: req.user!.id } },
    });
    if (existing) throw new AppError("Kamu sudah menilai submission ini sebelumnya.", 409);

    const body = createReviewSchema.parse(req.body);

    const review = await prisma.review.create({
      data: {
        score: body.score,
        feedback: body.feedback ? sanitizePlainText(body.feedback) : null,
        submissionId: submission.id,
        reviewerId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: { review } });
  })
);

// GET /api/submissions/:id/reviews
// ADMIN         -> lihat semua review lengkap dengan identitas reviewer (moderasi)
// Pemilik/siswa -> hanya lihat skor + feedback + rata-rata, TANPA identitas reviewer
router.get(
  "/submissions/:id/reviews",
  requireAuth,
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({ where: { id: req.params.id } });
    if (!submission) throw new AppError("Submission tidak ditemukan.", 404);

    const assignment = await prisma.assignment.findUniqueOrThrow({ where: { id: submission.assignmentId } });
    await ensureClassAccess(assignment.classId, req.user!.id, req.user!.role);

    const isAdmin = req.user!.role === "ADMIN";
    const isOwner = submission.userId === req.user!.id;

    // Hanya admin, atau pemilik submission (untuk lihat feedback ke dirinya sendiri) yang boleh akses
    if (!isAdmin && !isOwner) {
      throw new AppError("Kamu tidak punya akses untuk melihat review ini.", 403);
    }

    const reviews = await prisma.review.findMany({
      where: { submissionId: submission.id },
      include: isAdmin ? { reviewer: { select: { id: true, name: true, email: true } } } : undefined,
      orderBy: { reviewedAt: "asc" },
    });

    const averageScore =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / reviews.length) * 10
          ) / 10
        : null;

    const shaped = isAdmin
      ? reviews
      : reviews.map((r: { score: number; feedback: string | null; reviewedAt: Date }) => ({
          score: r.score,
          feedback: r.feedback,
          reviewedAt: r.reviewedAt,
        }));

    res.json({ success: true, data: { reviews: shaped, averageScore, reviewCount: reviews.length } });
  })
);

// GET /api/classes/:classId/assignments/:assignmentId/results (ADMIN) - rekap nilai akhir
router.get(
  "/classes/:classId/assignments/:assignmentId/results",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await ensureClassAccess(req.params.classId, req.user!.id, req.user!.role);

    const submissions = await prisma.submission.findMany({
      where: { assignmentId: req.params.assignmentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviews: true,
      },
      orderBy: { submittedAt: "asc" },
    });

    const results = submissions.map(
      (s: {
        id: string;
        user: { id: string; name: string; email: string };
        submittedAt: Date;
        reviews: { score: number }[];
      }) => ({
        submissionId: s.id,
        student: s.user,
        submittedAt: s.submittedAt,
        reviewCount: s.reviews.length,
        averageScore:
          s.reviews.length > 0
            ? Math.round((s.reviews.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / s.reviews.length) * 10) / 10
            : null,
      })
    );

    res.json({ success: true, data: { results } });
  })
);

export default router;
