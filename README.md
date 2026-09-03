# 📸 Face Recognition System - Frontend Repository

Repository ini berisi source code Frontend untuk **Sistem Manajemen Keamanan & Face Recognition**. Project ini dibangun menggunakan React (Vite) dan terbagi menjadi dua modul utama: **Admin Dashboard** dan **Client Application**.

Project ini dikembangkan oleh tim yang terdiri dari:
* Mobile Developer
* Frontend Developer
* Backend Developer
* System Analyst
* Quality Assurance (QA)
* AI Engineer

---

## 📂 Struktur Project

Pastikan Anda berada di direktori root yang memuat dua folder utama ini:

1.  **`BGP_Project_Admin`** (Web Dashboard untuk Administrator)
2.  **`BGP_Project_Client`** (Aplikasi Interface untuk User/Klien)

> **Catatan:** Kedua aplikasi ini beroperasi secara terpisah dan memerlukan terminal masing-masing untuk dijalankan secara bersamaan.

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum melakukan instalasi, pastikan sistem Anda telah memenuhi kebutuhan berikut:

### 1. Install Node.js
Project ini membutuhkan Node.js agar dapat berjalan.
* **Download:** [https://nodejs.org/en/download](https://nodejs.org/en/download)
* **Versi:** Disarankan menggunakan versi **LTS (Long Term Support)**.

### 2. Verifikasi Instalasi
Setelah menginstall Node.js, buka terminal (CMD, PowerShell, atau Terminal) dan jalankan perintah berikut:

```bash
node -v
npm -v

```

*Jika `npm` tidak muncul, lakukan instalasi ulang Node.js atau jalankan `npm install -g npm`.*

---

## ⚙️ Panduan Instalasi (Setup Guide)

Lakukan langkah-langkah berikut untuk **kedua folder** (`BGP_Project_Admin` dan `BGP_Client`).

### Langkah 1: Install Dependencies

Anda harus masuk ke masing-masing folder dan menginstall library.

**Untuk Admin:**

```bash
cd BGP_Project_Admin
npm install

```

**Untuk Client:**
*(Buka terminal baru atau kembali ke root folder)*

```bash
cd BGP_Project_Client
npm install

```

### Langkah 2: Konfigurasi Environment Variable (.env)

Agar frontend dapat berkomunikasi dengan Backend, Anda perlu mengatur URL API.

1. Duplikat file `.env.example` lalu ubah namanya menjadi `.env` (atau buat file `.env` baru).
2. Lakukan ini di dalam folder `BGP_Project_Admin` **DAN** `BGP_Project_Client`.
3. Isi file `.env` dengan konfigurasi berikut:

```env
# FILE: .env

# Opsi 1: Jika Backend berjalan di Local (Komputer sendiri)
VITE_API_BASE_URL=http://localhost:5500

# Opsi 2: Jika Backend sudah di-deploy (Production)
# VITE_API_BASE_URL=[https://api.domain-anda.com](https://api.domain-anda.com)

```

---

## 🚀 Cara Menjalankan Aplikasi (Run Project)

Karena ini adalah dua aplikasi berbeda, Anda perlu menjalankan **dua terminal** secara bersamaan.

### Terminal 1 - Menjalankan Admin Dashboard

```bash
cd BGP_Project_Admin
npm run dev

```

*Biasanya akan berjalan di: `http://localhost:5173*`

### Terminal 2 - Menjalankan Client App

*(Buka tab terminal baru)*

```bash
cd BGP_Project_Client
npm run dev

```

*Biasanya akan berjalan di: `http://localhost:5174` (Vite otomatis mencari port kosong)*

---

## 🐛 Troubleshooting & Notes

### Port Conflict

Jangan khawatir jika port `5173` sudah terpakai. Vite secara otomatis akan mengalihkan ke port `5174`, `5175`, dst.

* Perhatikan output di terminal setelah menjalankan `npm run dev` untuk melihat port mana yang aktif.

### API Connection Error

Jika data tidak muncul atau login gagal, lakukan pengecekan berikut:

1. **Backend Status:** Pastikan Backend Server sudah berjalan.
2. **Environment Variable:** Cek kembali `VITE_API_BASE_URL` di file `.env`. Pastikan URL-nya benar.
3. **CORS:** Pastikan tidak ada isu *Cross-Origin Resource Sharing* (CORS) di sisi Backend yang memblokir request dari Frontend.

### Production Build

Untuk melakukan build aplikasi ke tahap production (menghasilkan folder `dist` yang siap deploy), jalankan perintah berikut di masing-masing folder project:

```bash
npm run build

```

```

```
