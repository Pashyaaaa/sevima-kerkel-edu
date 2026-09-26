import { customAlphabet } from "nanoid";
import { prisma } from "../lib/prisma";

// Alphabet tanpa karakter yang gampang ketuker (0/O, 1/I) biar enak diketik siswa
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

/** Generate kode kelas 6 karakter yang dijamin unik di DB (retry kalau tabrakan) */
export async function generateUniqueClassCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = nanoid();
    const existing = await prisma.class.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Gagal generate kode kelas unik, coba lagi.");
}
