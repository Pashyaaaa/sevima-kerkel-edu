[Uploading Dokumentasi API Koreksi.md…]()
::: top
[📘 Koreksi API]{.title} [v1.0]{.badge}
:::

::: wrap
# Dokumentasi API Koreksi

Aplikasi peer-review tugas subjektif (puisi, seni, pidato) --- siswa
saling menilai secara anonim.

::: note
**Base URL:** `http://localhost:3000/api`{.inline-code}\
**Auth:** kirim header `Authorization: Bearer <token>`{.inline-code} di
semua endpoint yang butuh login (dapat token dari login/register).\
**Semua body request pakai JSON** --- jangan lupa header
`Content-Type: application/json`{.inline-code}.
:::

::: toc
[🔄 Alur Pakai](#alur) [🔐 Auth](#auth) [🏫 Kelas](#class) [📝
Tugas](#assignment) [📤 Submission](#submission) [⭐ Review](#review)
[📦 Format Response](#response)
:::

## 🔄 Alur Pakai (urutan langkah) {#alur}

  \#   Siapa   Aksi
  ---- ------- ----------------------------------------------------------------------------
  1    Guru    Register / login sebagai `ADMIN`{.inline-code}
  2    Guru    Buat kelas → dapat **kode kelas** (6 karakter)
  3    Siswa   Register / login sebagai `STUDENT`{.inline-code}
  4    Siswa   Join kelas pakai kode
  5    Guru    Buat tugas (judul, deskripsi, deadline) di kelas
  6    Siswa   Submit jawaban sebelum deadline
  7    Siswa   Setelah deadline, lihat submission siswa lain (anonim) & beri nilai 0--100
  8    Guru    Lihat rekap nilai akhir semua submission

## 🔐 Auth

::: card
::: ep-head
[POST]{.method .POST}[/auth/register]{.path}[Public]{.role}
:::

Daftar akun baru. `role`{.inline-code} opsional, default
`STUDENT`{.inline-code}.

::: label
Body
:::

    {
      "name": "Budi",
      "email": "budi@test.com",
      "password": "rahasia123",
      "role": "STUDENT"
    }

::: label
Response 201
:::

    { "success": true, "data": { "user": {...}, "token": "eyJ..." } }
:::

::: card
::: ep-head
[POST]{.method .POST}[/auth/login]{.path}[Public]{.role}
:::

Login, dapat token JWT baru.

::: label
Body
:::

    { "email": "budi@test.com", "password": "rahasia123" }
:::

::: card
::: ep-head
[GET]{.method .GET}[/auth/me]{.path}[🔒 Login]{.role}
:::

Lihat data akun yang sedang login (cek token masih valid).
:::

## 🏫 Kelas {#class}

::: card
::: ep-head
[POST]{.method .POST}[/classes]{.path}[👩‍🏫 ADMIN]{.role}
:::

Buat kelas baru. Kode kelas ter-generate otomatis.

::: label
Body
:::

    { "name": "Kelas Puisi X", "description": "Lomba puisi kemerdekaan" }
:::

::: card
::: ep-head
[GET]{.method .GET}[/classes]{.path}[🔒 Login]{.role}
:::

List kelas milik user. ADMIN → kelas yang dibuat sendiri. STUDENT →
kelas yang sudah diikuti.
:::

::: card
::: ep-head
[POST]{.method .POST}[/classes/join]{.path}[🧑‍🎓 STUDENT]{.role}
:::

Join kelas pakai kode dari guru.

::: label
Body
:::

    { "code": "A3K9P2" }
:::

::: card
::: ep-head
[GET]{.method .GET}[/classes/:id]{.path}[🔒 Member/Creator]{.role}
:::

Detail kelas. Field `code`{.inline-code} hanya tampil kalau kamu
creator-nya.
:::

::: card
::: ep-head
[GET]{.method .GET}[/classes/:id/members]{.path}[👩‍🏫 ADMIN]{.role}
:::

Daftar siswa yang join kelas (khusus pembuat kelas).
:::

## 📝 Tugas (Assignment) {#assignment}

::: card
::: ep-head
[POST]{.method .POST}[/classes/:classId/assignments]{.path}[👩‍🏫
ADMIN]{.role}
:::

Buat tugas baru di dalam kelas. Deadline wajib di masa depan.

::: label
Body
:::

    {
      "title": "Puisi Kemerdekaan",
      "description": "Buat puisi bertema kemerdekaan",
      "deadline": "2026-10-05T23:59:00.000Z"
    }
:::

::: card
::: ep-head
[GET]{.method .GET}[/classes/:classId/assignments]{.path}[🔒
Member/Creator]{.role}
:::

List semua tugas di kelas tsb.
:::

::: card
::: ep-head
[GET]{.method .GET}[/assignments/:id]{.path}[🔒 Member/Creator]{.role}
:::

Detail tugas + status: sudah lewat deadline atau belum, dan (untuk
siswa) apakah sudah submit.
:::

::: card
::: ep-head
[PUT]{.method .PUT}[/assignments/:id]{.path}[👩‍🏫 ADMIN]{.role}
:::

Edit tugas. Semua field body opsional (isi yang mau diubah saja).
:::

::: card
::: ep-head
[DELETE]{.method .DELETE}[/assignments/:id]{.path}[👩‍🏫 ADMIN]{.role}
:::

Hapus tugas (submission & review terkait ikut terhapus).
:::

## 📤 Submission

::: card
::: ep-head
[POST]{.method .POST}[/assignments/:assignmentId/submissions]{.path}[🧑‍🎓
STUDENT]{.role}
:::

Kumpulkan jawaban. Ditolak kalau lewat deadline atau sudah pernah
submit.

::: label
Body
:::

    { "content": "Merah putih berkibar di angkasa..." }
:::

::: card
::: ep-head
[GET]{.method .GET}[/assignments/:assignmentId/submissions]{.path}[🔒
Member/Creator]{.role}
:::

**STUDENT** → semua submission tampil **tanpa identitas apapun** (anonim
total, urutan diacak), plus flag `isMine`{.inline-code} di submission
milik sendiri.\
**ADMIN** → tampil lengkap dengan identitas siswa + rata-rata skor.

::: label
Response (sisi STUDENT)
:::

    {
      "success": true,
      "data": {
        "submissions": [
          { "id": "...", "content": "...", "submittedAt": "2026-09-26", "isMine": false }
        ]
      }
    }
:::

::: card
::: ep-head
[GET]{.method .GET}[/submissions/:id]{.path}[🔒 Member/Creator]{.role}
:::

Detail 1 submission. Anonim kecuali kamu pemiliknya atau ADMIN.
:::

## ⭐ Review (Penilaian) {#review}

::: card
::: ep-head
[POST]{.method .POST}[/submissions/:submissionId/reviews]{.path}[🧑‍🎓
STUDENT]{.role}
:::

Beri nilai ke submission siswa lain. Tidak bisa nilai submission
sendiri, tidak bisa 2x, dan baru bisa **setelah deadline lewat**.

::: label
Body
:::

    { "score": 85, "feedback": "Diksi menarik, rima kurang konsisten" }
:::

::: card
::: ep-head
[GET]{.method .GET}[/submissions/:id/reviews]{.path}[🔒
ADMIN/Pemilik]{.role}
:::

Lihat semua review untuk 1 submission + rata-rata skor. Identitas
reviewer hanya tampil untuk ADMIN.
:::

::: card
::: ep-head
[GET]{.method
.GET}[/classes/:classId/assignments/:assignmentId/results]{.path}[👩‍🏫
ADMIN]{.role}
:::

Rekap nilai akhir: tiap submission + siapa pemiliknya + rata-rata skor +
jumlah review.
:::

## 📦 Format Response {#response}

::: overflow-x
    // Sukses
    { "success": true, "data": { ... } }

    // Gagal validasi input
    { "success": false, "message": "Input tidak valid.", "errors": [{ "path": "email", "message": "Invalid email" }] }

    // Gagal lainnya (401/403/404/409)
    { "success": false, "message": "Pesan errornya di sini" }
:::

::: note
💡 Testing manual paling gampang pakai **Postman** atau **Thunder
Client**. Ingat urutan: register ADMIN → buat kelas → register STUDENT →
join pakai kode → buat tugas → submit → review.
:::

Koreksi API · Dokumentasi internal
:::
