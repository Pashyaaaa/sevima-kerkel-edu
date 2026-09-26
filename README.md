# 📘 Koreksi — API Documentation

> Dokumentasi API untuk **Koreksian** — aplikasi peer-review tugas subjektif (puisi, seni, pidato) di mana siswa saling menilai secara anonim.

![Version](https://img.shields.io/badge/version-1.0-blueviolet)
![Status](https://img.shields.io/badge/status-development-orange)
![License](https://img.shields.io/badge/license-internal-lightgrey)

---

## 📋 Daftar Isi

- [Base URL & Auth](#-base-url--auth)
- [Alur Pakai](#-alur-pakai-urutan-langkah)
- [🔐 Auth](#-auth)
- [🏫 Kelas](#-kelas)
- [📝 Tugas (Assignment)](#-tugas-assignment)
- [📤 Submission](#-submission)
- [⭐ Review (Penilaian)](#-review-penilaian)
- [📦 Format Response](#-format-response)
- [💡 Tips Testing](#-tips-testing)
- [🗂️ Ringkasan Endpoint](#️-ringkasan-endpoint)

---

## 🌐 Base URL & Auth

| Item | Value |
|---|---|
| **Base URL** | `http://localhost:3000/api` |
| **Auth** | Kirim header `Authorization: Bearer <token>` di semua endpoint yang butuh login |
| **Content-Type** | `application/json` di semua body request |

Token didapat dari endpoint **login** atau **register**.

---

## 🔄 Alur Pakai (urutan langkah)

| # | Siapa | Aksi |
|---|---|---|
| 1 | 👩‍🏫 Guru | Register / login sebagai `ADMIN` |
| 2 | 👩‍🏫 Guru | Buat kelas → dapat **kode kelas** (6 karakter) |
| 3 | 🧑‍🎓 Siswa | Register / login sebagai `STUDENT` |
| 4 | 🧑‍🎓 Siswa | Join kelas pakai kode |
| 5 | 👩‍🏫 Guru | Buat tugas (judul, deskripsi, deadline) di kelas |
| 6 | 🧑‍🎓 Siswa | Submit jawaban sebelum deadline |
| 7 | 🧑‍🎓 Siswa | Setelah deadline, lihat submission siswa lain (anonim) & beri nilai 0–100 |
| 8 | 👩‍🏫 Guru | Lihat rekap nilai akhir semua submission |

---

## 🔐 Auth

### `POST /auth/register` — `Public`

Daftar akun baru. `role` opsional, default `STUDENT`.

**Body**
```json
{
  "name": "Budi",
  "email": "budi@test.com",
  "password": "rahasia123",
  "role": "STUDENT"
}
