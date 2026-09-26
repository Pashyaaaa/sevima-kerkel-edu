import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { sanitizePlainText } from "../utils/sanitize";
import { requireAuth, requireRole } from "../middleware/auth";
import { ensureClassAccess } from "./class.routes";

const router = Router();

const createAssignmentSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(1),
  deadline: z.coerce.date(),
});

const updateAssignmentSchema = createAssignmentSchema.partial();

/** Helper: pastikan assignment ada & ambil kelasnya, sekaligus cek akses user ke kelas tsb */
async function getAssignmentWithAccess(assignmentId: string, userId: string, role: string) {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new AppError("Tugas tidak ditemukan.", 404);

  await ensureClassAccess(assignment.classId, userId, role);
  return assignment;
}

// POST /api/classes/:classId/assignments (ADMIN, harus creator kelas)
router.post(
  "/classes/:classId/assignments",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await ensureClassAccess(req.params.classId, req.user!.id, req.user!.role);
    const body = createAssignmentSchema.parse(req.body);

    if (body.deadline.getTime() <= Date.now()) {
      throw new AppError("Deadline harus di waktu yang akan datang.", 422);
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: sanitizePlainText(body.title),
        description: body.description, // deskripsi tugas boleh mengandung formatting dasar
        deadline: body.deadline,
        classId: req.params.classId,
      },
    });

    res.status(201).json({ success: true, data: { assignment } });
  })
);

// GET /api/classes/:classId/assignments (member atau creator)
router.get(
  "/classes/:classId/assignments",
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureClassAccess(req.params.classId, req.user!.id, req.user!.role);

    const assignments = await prisma.assignment.findMany({
      where: { classId: req.params.classId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { deadline: "asc" },
    });

    res.json({ success: true, data: { assignments } });
  })
);

// GET /api/assignments/:id
router.get(
  "/assignments/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const assignment = await getAssignmentWithAccess(req.params.id, req.user!.id, req.user!.role);

    // Sertakan info kecil: apakah user (siswa) sudah submit
    let mySubmissionId: string | null = null;
    if (req.user!.role === "STUDENT") {
      const mine = await prisma.submission.findUnique({
        where: { assignmentId_userId: { assignmentId: assignment.id, userId: req.user!.id } },
        select: { id: true },
      });
      mySubmissionId = mine?.id ?? null;
    }

    res.json({
      success: true,
      data: {
        assignment,
        isPastDeadline: assignment.deadline.getTime() <= Date.now(),
        mySubmissionId,
      },
    });
  })
);

// PUT /api/assignments/:id (ADMIN, creator kelas)
router.put(
  "/assignments/:id",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await getAssignmentWithAccess(req.params.id, req.user!.id, req.user!.role);
    const body = updateAssignmentSchema.parse(req.body);

    const assignment = await prisma.assignment.update({
      where: { id: req.params.id },
      data: {
        ...(body.title && { title: sanitizePlainText(body.title) }),
        ...(body.description && { description: body.description }),
        ...(body.deadline && { deadline: body.deadline }),
      },
    });

    res.json({ success: true, data: { assignment } });
  })
);

// DELETE /api/assignments/:id (ADMIN, creator kelas)
router.delete(
  "/assignments/:id",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await getAssignmentWithAccess(req.params.id, req.user!.id, req.user!.role);
    await prisma.assignment.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Tugas berhasil dihapus." });
  })
);

export { getAssignmentWithAccess };
export default router;
