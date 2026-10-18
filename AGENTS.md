# AGENTS.md — Website Dokumentasi PAGORA

> Aturan tetap untuk semua AI agent yang mengerjakan **website dokumentasi PAGORA** (React / Next.js).
> Baca dokumen ini **dan** `context.md` sebelum menulis kode atau membuat file. Pemilik proyek (Dimas) hanya menjelaskan tugas; keputusan teknis (struktur, penamaan, pola kode, Git) mengikuti dokumen ini tanpa perlu ditanyakan ulang.

---

## 1. Tujuan Proyek

Membangun website dokumentasi yang menjelaskan proyek **PAGORA** (sistem pengadaan: Laravel + Inertia + React) kepada anggota tim dan penguji. Isi website mencakup:

- Ringkasan proyek dan stack
- Struktur folder backend & frontend
- Arsitektur MVC + Service Repository
- Alur data (data flow)
- Aturan frontend dan standar penulisan kode
- Cara membuat fitur baru + checklist
- Panduan Git tim

> Website ini adalah **project terpisah** dari project PAGORA. Jangan mengubah repository PAGORA.

## 2. Sumber Konten (Wajib)

- **`context.md` adalah satu-satunya sumber kebenaran konten.** Semua isi halaman diturunkan dari sana.
- Jangan mengarang fitur, nama file, field database, atau aturan yang tidak ada di `context.md`.
- Kode contoh yang berasal dari pola (bukan file asli proyek) wajib diberi label **"Contoh ilustrasi"** di halaman.
- Jika menemukan hal yang tidak jelas atau bertentangan di `context.md`, tulis di bagian **Asumsi** pada laporan, lalu lanjutkan dengan interpretasi paling aman. Jangan menebak lalu menuliskannya sebagai fakta.
- Jangan mengedit `context.md` kecuali diminta. Jika ada koreksi konten, sarankan di laporan.

## 3. Stack & Keputusan Teknis

| Item | Keputusan |
|---|---|
| Framework | **Next.js (App Router)** + React, versi stabil terbaru |
| Bahasa | **TypeScript** (project terpisah dari PAGORA; aturan JS/`.jsx` di PAGORA tidak berlaku di sini) |
| Styling | **Tailwind CSS**; komponen UI dasar dengan **shadcn/ui** bila perlu |
| Konten | **MDX / Markdown** per halaman, dipisah dari komponen |
| Syntax highlight | `shiki` (atau `rehype-pretty-code`) |
| Diagram | **Mermaid** atau SVG sebagai komponen; bukan screenshot |
| Ikon | `lucide-react` |
| Package manager | `npm` (ikuti lockfile yang ada) |
| Deploy | Static-friendly (Vercel atau static export); tidak butuh database/backend |

Aturan paket:
- Cek `package.json` sebelum menambah dependency; gunakan yang sudah ada.
- **Jangan install package di luar tabel di atas tanpa persetujuan Dimas.** Jika sebuah sprint jelas membutuhkan paket tambahan, tulis alasannya di laporan dan minta persetujuan.
- Tidak ada API key, secret, atau layanan eksternal berbayar.

## 4. Cara Kerja Agent

Setiap menerima tugas:

1. Baca `AGENTS.md` dan `context.md`.
2. Periksa kode yang sudah ada (layout, komponen, konten) sebelum membuat file baru; gunakan ulang, jangan duplikasi.
3. Buat branch dari `main` terbaru (lihat bagian 9).
4. Kerjakan **satu sprint / satu task per branch**; jangan mencampur pekerjaan tak terkait.
5. Jangan mengubah file di luar scope tugas.
6. Jalankan verifikasi (bagian 10) sebelum commit terakhir.
7. Commit sesuai format, push, dan siapkan Pull Request.
8. **Jangan merge ke `main`.** Hanya Dimas yang boleh merge.
9. Berikan laporan sesuai format (bagian 11).

---

## 5. Struktur Folder Website

```
pagora-docs/
├── AGENTS.md
├── context.md                      # sumber konten (jangan diubah tanpa diminta)
├── content/                        # Semua konten dokumentasi (MDX), pisah dari komponen
│   ├── index.mdx                   # Ringkasan proyek
│   ├── struktur-folder.mdx
│   ├── arsitektur-backend.mdx
│   ├── alur-data.mdx
│   ├── frontend.mdx
│   ├── standar-kode.mdx
│   ├── fitur-baru.mdx
│   └── git.mdx
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (font, theme, metadata)
│   │   ├── page.tsx                # Beranda
│   │   └── docs/
│   │       ├── layout.tsx          # Shell dokumentasi (sidebar + TOC)
│   │       └── [slug]/page.tsx     # Render halaman dari content/
│   ├── components/
│   │   ├── ui/                     # Primitive shadcn (jangan diedit tanpa alasan kuat)
│   │   ├── docs/                   # Sidebar, Toc, PageNav, Breadcrumb
│   │   ├── mdx/                    # CodeBlock, Callout, Steps, FileTree, Diagram, Tabs
│   │   └── layout/                 # Header, Footer, ThemeToggle
│   ├── lib/
│   │   ├── content.ts              # Baca & parse file MDX + frontmatter
│   │   ├── navigation.ts           # Definisi urutan & grup menu
│   │   └── utils.ts                # cn()
│   └── types/
└── public/
```

Aturan:
- Konten tidak ditulis langsung di komponen React. Teks dokumentasi ada di `content/`.
- Urutan dan pengelompokan menu didefinisikan di `lib/navigation.ts`, bukan hardcode di komponen sidebar.
- Satu file MDX = satu halaman.

### Frontmatter MDX (wajib di setiap halaman)

```mdx
---
title: Arsitektur Backend
description: MVC + Service Repository pada PAGORA
order: 3
group: Backend
---
```

---

## 6. Rencana Sprint

Satu sprint = satu atau beberapa PR kecil. Setiap sprint punya **Definition of Done (DoD)**. Agent mengerjakan sprint sesuai urutan, kecuali Dimas menentukan lain. Estimasi bersifat kasar.

### Sprint 0 — Fondasi Project
**Branch:** `feat/project-setup`
- Inisialisasi Next.js (App Router, TypeScript, Tailwind), ESLint, Prettier.
- Pasang shadcn/ui (komponen dasar saja), `lucide-react`.
- Pasang pipeline MDX + pembaca konten (`lib/content.ts`, `lib/navigation.ts`).
- Root layout, font, dark/light mode.
- Salin `context.md` ke root (jika belum ada) sebagai sumber konten.

**DoD:** `npm run dev` jalan; satu halaman MDX contoh tampil; `npm run build` lolos.

### Sprint 1 — Shell Dokumentasi
**Branch:** `feat/docs-layout`
- Header, footer, theme toggle.
- Sidebar (dari `navigation.ts`), mobile drawer, breadcrumb.
- Table of contents otomatis dari heading.
- Navigasi "Sebelumnya / Berikutnya".
- Halaman beranda dan 404.

**DoD:** navigasi berfungsi di desktop dan mobile; TOC mengikuti heading; tidak ada scroll horizontal pada body.

### Sprint 2 — Komponen MDX
**Branch:** `feat/mdx-components`
- `CodeBlock` (syntax highlight, tombol salin, label bahasa, judul file opsional).
- `Callout` (info / peringatan / larangan).
- `FileTree` (untuk struktur folder, dengan komentar tiap file).
- `Steps` (langkah bernomor), `Tabs`.
- `Diagram` (Mermaid/SVG) untuk alur request.

**DoD:** setiap komponen dipakai minimal sekali di halaman nyata; tampil benar di dark & light mode.

### Sprint 3 — Konten Inti (Arsitektur & Alur Data)
**Branch:** `feat/docs-architecture`
- Halaman: Ringkasan Proyek, Struktur Folder, Arsitektur Backend, Alur Data (`context.md` bagian 1–4).
- Tabel tanggung jawab layer, aturan dependency, diagram alur request dan alur daftar data.
- Kode contoh Komoditas diberi label "Contoh ilustrasi".

**DoD:** isi halaman cocok dengan `context.md`; tidak ada konten yang dikarang; semua diagram dan kode tampil benar.

### Sprint 4 — Konten Frontend & Standar Kode
**Branch:** `feat/docs-frontend-rules`
- Halaman: Aturan Frontend, Standar Penulisan Kode, Membuat Fitur Baru + checklist (`context.md` bagian 5–7).
- Pola input/error, Data Table, Combobox, FileDropzone, notify/suara, modal vs form page, LoadingButton.

**DoD:** semua aturan di `context.md` bagian 5–7 tercakup; checklist tampil interaktif atau mudah dibaca.

### Sprint 5 — Panduan Git
**Branch:** `feat/docs-git`
- Halaman Git (`context.md` bagian 8): aturan tim, nama branch, format commit, alur harian, stash/merge dari `main`, konflik, PR.
- Aturan Git ditampilkan **persis** seperti di `context.md` (format commit `feat : ...`, tidak ada branch `develop`, hanya Dimas yang merge ke `main`).

**DoD:** semua perintah Git dan aturan tim akurat dan konsisten dengan `context.md`.

### Sprint 6 — Polish & Rilis
**Branch:** `feat/docs-polish`
- Pencarian dokumentasi (client-side, ringan).
- Metadata SEO dan Open Graph, favicon.
- Aksesibilitas (kontras, fokus keyboard, `alt`, heading berurutan).
- Pemeriksaan responsif dan performa; perbaikan konten typo.
- Konfigurasi deploy.

**DoD:** `npm run build` dan `npm run lint` lolos; semua halaman terbuka tanpa error; Lighthouse tidak memiliki masalah besar pada aksesibilitas.

> Jika Dimas meminta sprint dibagi ulang atau dipersempit (misalnya untuk deadline), agent menyusun ulang urutan tanpa mengubah DoD, dan menulis perubahan di laporan.

---

## 7. Cara Menulis Kode

### 7.1 Umum
- Gunakan **TypeScript**; hindari `any`. Props setiap komponen diberi tipe.
- **Functional component + hooks.** Dilarang class component.
- Gunakan **Server Component** secara default; tambahkan `'use client'` hanya jika benar-benar butuh state, efek, atau event browser (contoh: tombol salin, toggle tema, sidebar mobile).
- Komponen `PascalCase`; file komponen mengikuti konvensi shadcn (`kebab-case.tsx`) di `components/ui/`, dan `PascalCase.tsx` untuk komponen buatan sendiri. Konsisten dengan yang sudah ada.
- Satu komponen satu tanggung jawab; pisahkan ke `components/` jika dipakai lebih dari sekali.
- Tidak ada `console.log`, kode mati, atau import tak terpakai.
- Komentar hanya menjelaskan **kenapa**, bukan **apa**.
- Nama variabel, fungsi, class, dan komentar kode: **Bahasa Inggris**. Teks yang tampil ke pembaca (konten, label UI): **Bahasa Indonesia**.

### 7.2 Styling
- Tailwind saja; hindari inline style. Gunakan `cn()` untuk class kondisional.
- Warna lewat token/variabel tema (CSS variables) agar dark & light mode konsisten; jangan hardcode warna di banyak tempat.
- Responsif dengan pendekatan mobile-first. Konten lebar (tabel, kode, diagram) discroll di dalam wadahnya (`overflow-x-auto`), body tidak boleh scroll horizontal.
- Gunakan komponen shadcn yang sudah terpasang; jangan membuat ulang komponen yang sudah ada di shadcn. Komponen shadcn baru boleh ditambah lewat CLI jika dibutuhkan sprint berjalan.

### 7.3 Konten & MDX
- Satu halaman = satu file di `content/` dengan frontmatter lengkap.
- Heading berurutan (`#` hanya satu per halaman, lalu `##`, `###`).
- Kode panjang memakai `CodeBlock` dengan label bahasa; struktur folder memakai `FileTree`.
- Istilah teknis, nama kode, dan nama file ditulis apa adanya (Inggris/kode); penjelasan memakai Bahasa Indonesia.
- Jangan menyalin teks mentah panjang tanpa merapikan; sesuaikan menjadi halaman yang mudah dibaca.

### 7.4 Aksesibilitas
- Elemen interaktif bisa diakses keyboard dan punya state fokus yang jelas.
- Ikon tanpa teks diberi `aria-label`; gambar/diagram punya deskripsi alternatif.
- Kontras warna memenuhi standar baca yang wajar di kedua tema.

### 7.5 Performa
- Hindari library besar untuk kebutuhan kecil.
- Muat komponen berat (misalnya Mermaid) secara lazy hanya di halaman yang memakainya.
- Gambar memakai `next/image` bila ada.

---

## 8. Keamanan & Kualitas

- Tidak ada secret atau kredensial di kode. Jangan commit `.env`.
- Jangan menyalin data sensitif dari project PAGORA (kredensial, isi `.env`, data user) ke dokumentasi.
- Tautan eksternal membuka dengan `rel="noopener noreferrer"` bila memakai `target="_blank"`.
- Jangan mengubah format atau gaya file di luar bagian yang dikerjakan.

---

## 9. Aturan Git (Wajib)

Aturan ini sama dengan `context.md` bagian 8.

1. Branch utama: **`main`**. Tidak ada `develop`.
2. Nama branch: `feat/nama-feature`. Jenis kerja lain: `fix/`, `refactor/`, `docs/`, `chore/` (huruf kecil, kebab-case, bahasa Inggris).
3. Pesan commit: **`feat : pesan commit yang jelas menggambarkan yang dikerjakan`** (spasi di kiri dan kanan titik dua). Prefix: `feat`, `fix`, `refactor`, `docs`, `chore`.
4. Setiap pekerjaan selesai dengan **Pull Request** ke `main`.
5. **Hanya Dimas yang boleh merge ke `main`.** Agent tidak boleh merge ke `main`, tidak boleh push langsung ke `main`, dan tidak boleh `push --force`.
6. Jika ada perubahan baru di `main` saat pekerjaan berjalan, bawa ke branch kerja dengan **`git stash`** dan/atau **`git merge origin/main`** (arah `main` → branch kerja saja).

Alur singkat:

```bash
git checkout main
git pull origin main
git checkout -b feat/docs-layout

# kerjakan, lalu
git add <file>
git commit -m "feat : tambah sidebar dan toc dokumentasi"
git push -u origin feat/docs-layout
# buat Pull Request ke main, jangan merge sendiri
```

Jika `main` berubah di tengah jalan:

```bash
git stash push -m "wip: docs layout"   # jika ada perubahan belum di-commit
git fetch origin
git merge origin/main
git stash pop
```

Contoh commit yang benar:

```
feat : tambah komponen codeblock dengan tombol salin
feat : tambah halaman arsitektur backend
fix : perbaiki toc yang tidak mengikuti heading
docs : perbarui deskripsi halaman git
chore : pasang plugin mdx
```

Aturan tambahan:
- Satu commit = satu perubahan logis; commit kecil dan sering.
- Judul PR mengikuti format commit. Deskripsi PR: apa yang dikerjakan, cara menguji, screenshot untuk perubahan UI.
- Jangan commit `.env`, `node_modules/`, `.next/`, atau file build.

---

## 10. Checklist Sebelum Selesai

- [ ] Branch benar (`feat/...`) dan dibuat dari `main` terbaru.
- [ ] Konten sesuai `context.md`; tidak ada yang dikarang; kode ilustrasi diberi label.
- [ ] Setiap halaman MDX punya frontmatter lengkap dan masuk ke `navigation.ts`.
- [ ] Tidak ada konten dokumentasi yang ditulis langsung di komponen React.
- [ ] Komponen bertipe (tanpa `any`); `'use client'` hanya jika perlu.
- [ ] Dark & light mode tampil benar; tidak ada scroll horizontal pada body (mobile & desktop).
- [ ] Tidak ada `console.log`, kode mati, atau import tak terpakai.
- [ ] Tidak ada dependency baru di luar yang disetujui.
- [ ] `npm run lint` dan `npm run build` berjalan tanpa error.
- [ ] Pesan commit memakai format `feat : ...`; tidak ada merge atau push ke `main`.
- [ ] Pull Request sudah disiapkan dengan deskripsi yang jelas.

---

## 11. Format Laporan Agent

Setelah selesai, berikan:

1. **Asumsi** (jika ada, termasuk hal tidak jelas di `context.md`)
2. **Sprint / task** yang dikerjakan dan status DoD
3. **Daftar file:** dibuat / diubah / dihapus
4. **Perintah** yang perlu dijalankan (`npm install`, `npm run dev`, dst.)
5. **Hasil verifikasi** sesuai checklist bagian 10
6. **Nama branch, daftar commit, dan judul PR** yang disiapkan
7. **Saran sprint berikutnya** (singkat)
