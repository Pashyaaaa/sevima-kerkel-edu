# Koreksi API

REST API untuk **Koreksi** — aplikasi peer-review tugas subjektif (puisi, seni, pidato, dll) di mana siswa saling menilai submission satu sama lain secara **anonim**, supaya penilaian tidak bias.

## Tech Stack
- Express + TypeScript
- Prisma ORM (MySQL)
- JWT untuk auth, bcrypt untuk hash password
- zod untuk validasi input
- sanitize-html untuk sanitasi konten submission (anti-XSS)

## Setup

```bash
npm install
cp .env.example .env   # isi DATABASE_URL & JWT_SECRET
npx prisma migrate dev --name init
npm run dev
```

## Alur Aplikasi

1. **ADMIN** (guru) register/login → buat kelas → dapat **kode kelas** unik (6 karakter).
2. **STUDENT** register/login → join kelas pakai kode.
3. ADMIN buat **assignment** (judul, deskripsi, deadline) di dalam kelas.
4. STUDENT submit jawaban (`content` — bebas teks/HTML dasar/URL) **sebelum deadline**. Konten disanitasi otomatis.
5. Setelah deadline lewat, semua member kelas bisa lihat daftar submission **tanpa identitas pengumpul** (nama/email disensor total, urutan diacak berdasarkan ID bukan waktu submit).
6. STUDENT menilai submission siswa lain (skor 0–100 + feedback opsional). Tidak bisa menilai submission sendiri, tidak bisa menilai 2x.
7. Reviewer juga **anonim** dari sudut pandang pemilik submission — pemilik hanya lihat skor & feedback, bukan siapa yang menilai. Hanya ADMIN yang bisa lihat identitas reviewer (untuk moderasi/anti-abuse).
8. ADMIN bisa lihat rekap nilai akhir (rata-rata skor tiap submission) lengkap dengan identitas siswa.

> **Catatan desain:** penilaian (`POST /reviews`) baru dibuka **setelah deadline assignment lewat**, supaya seluruh siswa menilai dari pool submission yang sama & lengkap. Kalau tidak diinginkan, tinggal hapus pengecekan itu di `review.routes.ts`.

## Endpoints

### Auth
| Method | Endpoint | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Daftar (name, email, password, role?) |
| POST | `/api/auth/login` | Public | Login → dapat JWT |
| GET | `/api/auth/me` | Auth | Data user yang sedang login |

### Class
| Method | Endpoint | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/classes` | ADMIN | Buat kelas → auto-generate kode |
| GET | `/api/classes` | Auth | List kelas milik user |
| POST | `/api/classes/join` | STUDENT | Join kelas pakai `{ code }` |
| GET | `/api/classes/:id` | Auth (member/creator) | Detail kelas (kode hanya tampil ke creator) |
| GET | `/api/classes/:id/members` | ADMIN (creator) | List siswa di kelas |

### Assignment
| Method | Endpoint | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/classes/:classId/assignments` | ADMIN | Buat tugas (title, description, deadline) |
| GET | `/api/classes/:classId/assignments` | Auth | List tugas di kelas |
| GET | `/api/assignments/:id` | Auth | Detail tugas + status submit sendiri |
| PUT | `/api/assignments/:id` | ADMIN | Edit tugas |
| DELETE | `/api/assignments/:id` | ADMIN | Hapus tugas |

### Submission
| Method | Endpoint | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/assignments/:assignmentId/submissions` | STUDENT | Submit (`{ content }`), sebelum deadline, sekali per siswa |
| GET | `/api/assignments/:assignmentId/submissions` | Auth | STUDENT: list **anonim**; ADMIN: list lengkap + rata-rata skor |
| GET | `/api/submissions/:id` | Auth | Detail; anonim kecuali pemilik/ADMIN |

### Review
| Method | Endpoint | Role | Deskripsi |
|---|---|---|---|
| POST | `/api/submissions/:submissionId/reviews` | STUDENT | Nilai (`{ score: 0-100, feedback? }`), bukan submission sendiri |
| GET | `/api/submissions/:id/reviews` | ADMIN / pemilik | Lihat review + rata-rata; reviewer anonim kecuali ADMIN |
| GET | `/api/classes/:classId/assignments/:assignmentId/results` | ADMIN | Rekap nilai akhir semua submission |

## Format Response

```json
{ "success": true, "data": { ... } }
```
```json
{ "success": false, "message": "...", "errors": [ { "path": "email", "message": "Invalid email" } ] }
```

Auth pakai header: `Authorization: Bearer <token>`
