import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import { sanitizePlainText } from "../utils/sanitize";
import { requireAuth, requireRole } from "../middleware/auth";
import { generateUniqueClassCode } from "../utils/code";

const router = Router();

const createClassSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().max(2000).optional(),
});

const joinClassSchema = z.object({
  code: z.string().min(4).max(10),
});

/** Helper: pastikan user adalah member ATAU creator kelas ini. Melempar AppError kalau tidak. */
async function ensureClassAccess(classId: string, userId: string, role: string) {
  const kelas = await prisma.class.findUnique({
    where: { id: classId },
    include: { members: { where: { userId } } },
  });

  if (!kelas) throw new AppError("Kelas tidak ditemukan.", 404);

  const isCreator = kelas.creatorId === userId;
  const isMember = kelas.members.length > 0;

  if (role === "ADMIN" && !isCreator) {
    throw new AppError("Kamu bukan pembuat kelas ini.", 403);
  }
  if (role === "STUDENT" && !isMember) {
    throw new AppError("Kamu belum join kelas ini.", 403);
  }

  return kelas;
}

// POST /api/classes  (ADMIN only) - buat kelas baru + generate kode unik
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const body = createClassSchema.parse(req.body);
    const code = await generateUniqueClassCode();

    const kelas = await prisma.class.create({
      data: {
        name: sanitizePlainText(body.name),
        description: body.description ? sanitizePlainText(body.description) : null,
        code,
        creatorId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: { class: kelas } });
  })
);

// GET /api/classes - daftar kelas milik user (dibuat jika ADMIN, diikuti jika STUDENT)
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id, role } = req.user!;

    const classes =
      role === "ADMIN"
        ? await prisma.class.findMany({
            where: { creatorId: id },
            include: { _count: { select: { members: true, assignments: true } } },
            orderBy: { createdAt: "desc" },
          })
        : await prisma.class.findMany({
            where: { members: { some: { userId: id } } },
            include: { _count: { select: { members: true, assignments: true } } },
            orderBy: { createdAt: "desc" },
          });

    res.json({ success: true, data: { classes } });
  })
);

// POST /api/classes/join (STUDENT only) - join kelas pakai kode
router.post(
  "/join",
  requireAuth,
  requireRole("STUDENT"),
  asyncHandler(async (req, res) => {
    const body = joinClassSchema.parse(req.body);

    const kelas = await prisma.class.findUnique({ where: { code: body.code.toUpperCase() } });
    if (!kelas) throw new AppError("Kode kelas tidak valid.", 404);

    const alreadyMember = await prisma.classMember.findUnique({
      where: { userId_classId: { userId: req.user!.id, classId: kelas.id } },
    });
    if (alreadyMember) throw new AppError("Kamu sudah tergabung di kelas ini.", 409);

    await prisma.classMember.create({
      data: { userId: req.user!.id, classId: kelas.id },
    });

    res.status(201).json({ success: true, message: `Berhasil bergabung ke kelas "${kelas.name}".`, data: { class: kelas } });
  })
);

// GET /api/classes/:id - detail kelas (creator atau member saja)
router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const kelas = await ensureClassAccess(req.params.id, req.user!.id, req.user!.role);

    const detail = await prisma.class.findUnique({
      where: { id: kelas.id },
      include: {
        _count: { select: { members: true, assignments: true } },
        // Kode kelas hanya ditampilkan ke creator (ADMIN), bukan ke siswa
      },
    });

    const isCreator = kelas.creatorId === req.user!.id;

    res.json({
      success: true,
      data: {
        class: isCreator ? detail : { ...detail, code: undefined },
      },
    });
  })
);

// GET /api/classes/:id/members (ADMIN creator only) - lihat daftar siswa
router.get(
  "/:id/members",
  requireAuth,
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await ensureClassAccess(req.params.id, req.user!.id, req.user!.role);

    const members = await prisma.classMember.findMany({
      where: { classId: req.params.id },
      include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
      orderBy: { joinedAt: "asc" },
    });

    res.json({ success: true, data: { members } });
  })
);

export { ensureClassAccess };
export default router;
