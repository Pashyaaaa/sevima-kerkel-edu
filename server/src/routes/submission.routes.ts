import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { sanitizeContent } from "../utils/sanitize";
import { requireAuth, requireRole } from "../middleware/auth";
import { getAssignmentWithAccess } from "./assignment.routes";
import { ensureClassAccess } from "./class.routes";

const router = Router();

const createSubmissionSchema = z.object({
  content: z.string().min(1, "Konten submission tidak boleh kosong."),
});

/**
 * Bentuk submission versi "disensor" untuk ditampilkan ke sesama siswa:
 * TIDAK ADA sama sekali field yang mengarah ke identitas (userId, nama, email).
 * Hanya id submission, konten, dan waktu submit (dibulatkan ke hari agar tidak
 * bisa dipakai menebak urutan submit / identitas by timing).
 */
function toAnonymizedSubmission(s: { id: string; content: string; submittedAt: Date }) {
  return {
    id: s.id,
    content: s.content,
    submittedAt: s.submittedAt.toISOString().slice(0, 10), // hanya tanggal, bukan jam:menit
  };
}

// POST /api/assignments/:assignmentId/submissions (STUDENT, member kelas, sebelum deadline)
router.post(
  "/assignments/:assignmentId/submissions",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req, res) => {
    const assignment = await getAssignmentWithAccess(req.params.assignmentId, req.user!.id, req.user!.role);
    const body = createSubmissionSchema.parse(req.body);

    if (assignment.deadline.getTime() <= Date.now()) {
      throw new AppError("Deadline sudah lewat, submission ditolak.", 403);
    }

    const existing = await prisma.submission.findUnique({
      where: { assignmentId_userId: { assignmentId: assignment.id, userId: req.user!.id } },
    });
    if (existing) throw new AppError("Kamu sudah submit untuk tugas ini sebelumnya.", 409);

    const submission = await prisma.submission.create({
      data: {
        content: sanitizeContent(body.content),
        assignmentId: assignment.id,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: { submission } });
  })
);

// GET /api/assignments/:assignmentId/submissions
// STUDENT  -> semua submission tampil TANPA identitas (untuk dinilai), diacak urutannya
// ADMIN    -> tampil lengkap dengan identitas + rata-rata skor, untuk keperluan monitoring
router.get(
  "/assignments/:assignmentId/submissions",
  requireAuth,
  asyncHandler(async (req, res) => {
    const assignment = await getAssignmentWithAccess(req.params.assignmentId, req.user!.id, req.user!.role);

    if (req.user!.role === "ADMIN") {
      const submissions = await prisma.submission.findMany({
        where: { assignmentId: assignment.id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          reviews: { select: { score: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { submittedAt: "asc" },
      });

      const withAverage = submissions.map((s: { reviews: { score: number }[] }) => ({
        ...s,
        averageScore:
          s.reviews.length > 0
            ? Math.round(
                (s.reviews.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / s.reviews.length) * 10
              ) / 10
            : null,
        reviews: undefined, // sudah dipakai untuk hitung rata-rata, tidak perlu dikirim mentah
      }));

      return res.json({ success: true, data: { submissions: withAverage } });
    }

    // STUDENT: sensor total identitas, urutkan berdasarkan id (bukan waktu submit) agar acak
    const submissions = await prisma.submission.findMany({
      where: { assignmentId: assignment.id },
      orderBy: { id: "asc" },
    });

    const result = submissions.map((s: { id: string; content: string; submittedAt: Date; userId: string }) => ({
      ...toAnonymizedSubmission(s),
      isMine: s.userId === req.user!.id,
    }));

    res.json({ success: true, data: { submissions: result } });
  })
);

// GET /api/submissions/:id - detail satu submission
router.get(
  "/submissions/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!submission) throw new AppError("Submission tidak ditemukan.", 404);

    const assignment = await prisma.assignment.findUniqueOrThrow({ where: { id: submission.assignmentId } });
    await ensureClassAccess(assignment.classId, req.user!.id, req.user!.role);

    const isOwner = submission.userId === req.user!.id;
    const isAdmin = req.user!.role === "ADMIN";

    if (isOwner || isAdmin) {
      return res.json({ success: true, data: { submission } });
    }

    // Siswa lain hanya boleh lihat versi anonim
    res.json({ success: true, data: { submission: toAnonymizedSubmission(submission) } });
  })
);

export default router;
