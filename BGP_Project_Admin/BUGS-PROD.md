# Catatan Bug FE Production

Daftar masalah yang ditemukan di kode FE production, lengkap dengan lokasi persisnya di
repo prod. Repo ini (`bima-frontend-fix-reference`) adalah **mirror** dari prod, jadi path
di bawah berlaku untuk keduanya — bedanya cuma prefix folder.

| | |
|---|---|
| Repo prod | `compro-Lorem-ipsum/FrontEnd` (branch `main`) |
| Di-pin ke commit | `d689664` — *Merge pull request #118 from fariedgunawan/main*, 6 Sep 2026 09:08 UTC |
| Prefix path di prod | `BGP_Project_Admin/` — mis. `src/services/shiftService.ts` di sini = `BGP_Project_Admin/src/services/shiftService.ts` di prod |
| Cara verifikasi | `npm run build` (strict `tsc -b`) + telusur runtime di browser dengan akun **Client** asli ke BE production `https://teambgs.ninja/api/v1` |
| Tanggal audit | 6 September 2026 |

**Status yang dipakai di dokumen ini:**

- 🟢 **SUDAH DIPERBAIKI** — sudah dibereskan di repo ini; **masih ada di prod**.
- 🔴 **BELUM** — masih ada di repo ini maupun di prod.

---

## 🟢 Sudah diperbaiki di repo ini

### BUG-01 — Halaman shift legacy bikin `tsc -b` gagal (12 error)

**Severity:** Tinggi (build strict gagal total)

**Lokasi di prod:**

| File | Baris |
|---|---|
| `BGP_Project_Admin/src/pages/AdminManageShift.tsx` | seluruh file |
| `BGP_Project_Admin/src/Components/schedule/ScheduleTable.tsx` | 75, 76, 77, 79, 82, 85 |
| `BGP_Project_Admin/src/hooks/useScheduleData.ts` | 21, 22, 23, 24 |

**Gejala:** `npm run build` gagal dengan 11 error `TS2339`:

```
ScheduleTable.tsx(75,38): Property 'tanggal' does not exist on type 'Jadwal'.
ScheduleTable.tsx(79,57): Property 'satpam_name' does not exist on type 'Jadwal'.
ScheduleTable.tsx(85,57): Property 'nama_pos' does not exist on type 'Jadwal'.
useScheduleData.ts(21,52): Property 'data' does not exist on type 'Jadwal[]'.
useScheduleData.ts(23,25): Property 'pagination' does not exist on type 'Jadwal[]'.
```

**Akar masalah:** `AdminManageShift` adalah implementasi penjadwalan versi **lama**, sudah
digantikan `ClientPenjadwalanSatpam` + `src/Components/penjadwalan/*`. Tipe `Jadwal`
sudah berubah bentuk (dulu flat `tanggal`/`satpam_name`/`nama_pos` + wrapper
`{data, pagination}`, sekarang nested `satpam.uuid`/`pos.uuid` + cursor pagination), tapi
halaman lama tidak ikut diperbarui dan tidak pernah dihapus.

Halaman ini sudah dinonaktifkan dari Sidebar (dikomentari di
`src/Components/Sidebar.tsx`) tapi route-nya masih terdaftar di `src/App.tsx`, jadi masih
bisa dibuka lewat URL langsung `/AdminManageShift`.

**Kenapa lolos di prod:** `BGP_Project_Admin/Dockerfile` baris 15–18 sengaja pakai
`npx vite build`, **bukan** `npm run build`/`tsc -b`, dengan komentar sendiri:

> *"vite build langsung (bukan `npm run build` / `tsc -b`) - kode masih ada in-progress
> work (variabel WIP, dsb) yang bikin type-check strict gagal."*

`vite build` cuma transpile TS tanpa type-check, jadi error ini tidak pernah kelihatan
di pipeline mereka.

**Perbaikan di repo ini** (commit `9d451e7`): hapus seluruh pulau legacy-nya —

- `src/pages/AdminManageShift.tsx`
- `src/hooks/useScheduleData.ts`, `useScheduleForm.ts`, `useGenerateSchedule.ts`
- `src/Components/schedule/` (`ScheduleTable.tsx`, `ScheduleFormModal.tsx`, `GenerateScheduleModal.tsx`)
- Import + `<Route>`-nya di `src/App.tsx`

Sudah dicek: tidak ada file lain yang mengimpor semua itu. Setelah dihapus,
`npm run build` (strict) lolos bersih.

---

### BUG-02 — Import tidak terpakai (`TS6133`)

**Severity:** Rendah

**Lokasi di prod:** `BGP_Project_Admin/src/Utils/activityLogFormatter.ts` baris **5**

```
activityLogFormatter.ts(5,3): error TS6133: 'AiOutlineUpload' is declared but its value is never read.
```

**Perbaikan di repo ini** (commit `9d451e7`): `AiOutlineUpload` dihapus dari daftar import
`react-icons/ai`.

---

### BUG-03 — Link menu ke halaman yang sudah dihapus + sisa komentar mati

**Severity:** Rendah (kosmetik — lihat catatan)

**Lokasi di prod:**

| File | Baris | Isi |
|---|---|---|
| `BGP_Project_Admin/src/constants/menuItems.tsx` | 27 | `path: "/AdminManageShift"` |
| `BGP_Project_Admin/src/Components/Sidebar.tsx` | 93–99 | blok `manage-shift` yang dikomentari |

**Perbaikan di repo ini** (commit `9d451e7`, `e13988e`): path diarahkan ke
`/ClientPenjadwalanSatpam`, blok komentar mati dibuang.

> **Catatan penting:** dampaknya **nol bagi pengguna**, karena `DASHBOARD_MENU_ITEMS`
> ternyata **dead code** — `AdminDashboard.tsx` dan `ClientDashboard.tsx` cuma memakai
> `{ user, greeting }` dari `useDashboard()`, sedangkan `filteredMenuItems` tidak pernah
> dirender di mana pun. Diperbaiki sekadar biar tidak menyesatkan pembaca kode.

---

## 🟢 Sudah diperbaiki di repo ini (masih ada di prod)

### BUG-04 — Activity Log: infinite fetch loop, ±84 request / 3 detik

**Severity:** KRITIS — menghajar BE production terus-menerus selama halaman dibuka

**Lokasi di prod:** `BGP_Project_Admin/src/hooks/useActivityLogData.ts`

| Baris | Isi |
|---|---|
| 61–67 | `setHistoryCursor((prev) => { const newHistory = [...prev]; ... })` |
| 79 | dependency array: `[limit, actionFilter, dateRange, currentPageIndex, historyCursor]` |
| 91–93 | `useEffect(() => { fetchData(); }, [fetchData])` |

**Gejala terukur:** membuka `/ClientActivityLog` memicu **84 request** dalam 3 detik
(seharusnya cukup 2: satu `getActions`, satu `getAll`). Request terus berjalan selama
halaman terbuka.

**Akar masalah — siklusnya:**

1. `useEffect` di baris 91–93 memanggil `fetchData()`.
2. Kalau respons punya `has_more`, baris 61–67 memanggil `setHistoryCursor` yang selalu
   membuat **array baru** (`[...prev]`) — referensinya berubah walau isinya sama persis.
3. `historyCursor` ada di dependency `useCallback` (baris 79) → identitas `fetchData`
   ikut berubah.
4. Dependency `useEffect` adalah `fetchData` → efek jalan lagi → balik ke langkah 1.

Karena `currentPageIndex` tidak berubah, yang di-fetch adalah **halaman yang sama
berulang-ulang** — bukan pagination yang maju, murni loop.

**Cakupan dampak:** menu "Activity Log" di `src/Components/Sidebar.tsx` **tidak punya flag
`hidden`**, jadi tampil dan bisa diklik oleh **Admin maupun Client**.

**Perbaikan di repo ini** (commit `708abc3`): `historyCursor` diubah dari `useState`
menjadi `useRef` — nilainya memang tidak pernah dirender, hanya dibaca di dalam
`fetchData` — lalu dikeluarkan dari dependency array. Rantai sebab-akibatnya putus tanpa
mengubah perilaku pagination.

**Terverifikasi:** buka `/ClientActivityLog`, hitung request selama 7 detik →
**4 request lalu berhenti** (2 endpoint, digandakan React StrictMode di mode dev), dari
sebelumnya 84 dan terus bertambah.

---

### BUG-05 — `shiftService`: segmen `/v1/` dobel → semua endpoint 404

**Severity:** Tinggi (satu halaman mati total)

**Lokasi di prod:** `BGP_Project_Admin/src/services/shiftService.ts` baris
**14, 22, 30, 42, 54**

```js
const res = await fetchWithAuth(`${BASE_URL_API}/v1/shifts/?pid=${page}`, { ... });
```

**Akar masalah:** `BASE_URL_API` (`VITE_API_BASE_URL`) sudah berakhiran `/api/v1`,
lalu ditambah lagi `/v1/shifts/` → URL akhirnya:

```
https://teambgs.ninja/api/v1/v1/shifts/?pid=1   →   404 Not Found
```

Terverifikasi langsung: membuka `/AdminManageWaktu` menghasilkan 2× `404`. Semua
operasi CRUD di service ini (getAll, getById, create, update, delete) kena, karena
kelimanya salah prefix.

**File yang ikut mati:**

| File | Peran |
|---|---|
| `BGP_Project_Admin/src/pages/AdminManageWaktuJadwal.tsx` | halaman "Konfigurasi Waktu", route `/AdminManageWaktu` |
| `BGP_Project_Admin/src/hooks/useShiftData.ts` | fetch on mount (baris 20, 43–45) |
| `BGP_Project_Admin/src/hooks/useShiftForm.ts` | create/update |
| `BGP_Project_Admin/src/Components/shifts/ShiftFormModal.tsx` | form modal |

**Konteks:** fungsinya sudah digantikan `ShiftConfigSection` (tab **"Atur Shift"** di
Penjadwalan Satpam) yang memakai `shiftPatternService` dengan URL yang benar. Jadi ini
pulau legacy yang polanya **persis sama dengan BUG-01** — sudah tidak ada di Sidebar
(komentar `manage-waktu` di `Sidebar.tsx` baris 86–92), tapi route-nya masih hidup di
`App.tsx` dan masih dirujuk `menuItems.tsx` baris 75.

**Perbaikan di repo ini** (commit `ae0f681`): pulaunya dihapus, konsisten dengan BUG-01.
Terverifikasi entitasnya memang sama persis (`nama` + jam mulai + jam selesai + timezone,
cuma beda nama field), form modalnya bahkan copy-paste dengan judul identik
`"Edit Waktu Jadwal"`, dan `ShiftConfigSection` adalah superset — punya search dan
page-size yang tidak dimiliki halaman lama.

Yang dihapus: `AdminManageWaktuJadwal.tsx`, `useShiftData.ts`, `useShiftForm.ts`,
`Components/shifts/ShiftTable.tsx`, `Components/shifts/ShiftFormModal.tsx`,
`services/shiftService.ts`, `types/shift.ts` — beserta route + import di `App.tsx`, kartu
menu di `menuItems.tsx`, dan komentar mati di `Sidebar.tsx`. `ShiftTableNew.tsx`
dipertahankan (masih dipakai `ShiftConfigSection`).

Sekalian: `ShiftConfigSection` sekarang mengoper `isLoading` ke `DeleteConfirmationModal`
supaya tombol hapus tidak bisa diklik dua kali.

**Terverifikasi:** `/AdminManageWaktu` jatuh ke halaman 404, dan tab "Atur Shift" tetap
berfungsi (`GET /shift-patterns → 200`, 5 baris shift tampil).

---

### BUG-06 — `GET /client` ditembak saat role Client → 403 berulang

**Severity:** Sedang

**Lokasi di prod:**

| File | Baris |
|---|---|
| `BGP_Project_Admin/src/services/userService.ts` | 17, 25 |
| `BGP_Project_Admin/src/services/satpamService.ts` | 83 |

**Gejala terukur** (login sebagai **Client**):

| Halaman | Jumlah `GET /client?limit=50 → 403` |
|---|---|
| `/AdminRepositoriDokumen` | 5× |
| `/AdminRekapAbsensi` | 2× |
| `/AdminRekapPatroli` | 2× |
| `/AdminManagePosUtama` | 2× |
| `/AdminManagePengumuman` | 1× |

**Akar masalah:** endpoint `/client` (daftar client) hanya boleh diakses role **Admin**,
tapi FE memanggilnya tanpa mengecek role — kemungkinan untuk mengisi dropdown filter
"pilih client" yang seharusnya khusus Admin. Untuk user Client, panggilan itu pasti
403 dan dropdown-nya kosong.

**Dampak:** halaman tetap render (data utamanya tetap muncul), jadi tidak fatal — tapi
tiap load menghasilkan request gagal beruntun, dan filter client-nya kosong tanpa
keterangan apa pun ke pengguna.

**Perbaikan di repo ini** (commit `ddfe6dc`): pemanggilan `/client` dijaga dengan
`getRole() !== "admin"` di lima titik — `useAttendanceData`, `usePatroliData`,
`useAnnouncementData`, `AdminRepositoriDokumen` (fetch awal + load more), dan
`useSharedDocumentForm`. Pengecekan memakai `getRole()` langsung (bukan state `userRole`)
supaya tidak ada celah waktu pada render pertama.

Titik yang **sengaja tidak** digating karena memang pemakaian sah oleh Admin:
`useApprovalAkun`, `useMitraAssignment`, `useUserManagement`.

Sekalian: `satpamService.getMitraOptions` sekarang mengecek `res.ok` dan melempar error —
sebelumnya body 403 diperlakukan seperti sukses sehingga dropdown diam-diam kosong tanpa
jejak.

**Terverifikasi** (login sebagai Client): keempat halaman di tabel atas kini **nol**
panggilan `/client`, nol request gagal, dan data utamanya tetap tampil.

---

### BUG-07 — Perbandingan role beda huruf besar/kecil (laten)

**Severity:** Rendah sekarang, **tinggi kalau kode dead-nya dihidupkan**

**Lokasi di prod:**

| File | Baris | Isi |
|---|---|---|
| `BGP_Project_Admin/src/constants/menuItems.tsx` | 20, 28, 36, 44, 52, 60, 68, 76, 84 | `allowedRoles: ["Client"]` / `["Admin"]` — **huruf besar** |
| `BGP_Project_Admin/src/hooks/useDashboard.ts` | 24 | `item.allowedRoles.includes(user.role)` |
| `BGP_Project_Admin/src/Components/Sidebar.tsx` | 50, 63, 70, 77, 84, 105, 112, 137, 144 | `role === "client"` / `role !== "admin"` / `role !== "client"` — **huruf kecil** |

**Fakta lapangan:** BE production mengirim role dalam **huruf kecil**. Diverifikasi
langsung dari sesi login asli:

```json
{ "roleCookie": "client", "tokenRole": "client" }
```

**Konsekuensi:**

- `Sidebar.tsx` → **benar**, gating-nya jalan (sudah diuji: menu Client tampil lengkap).
- `menuItems.tsx` + `useDashboard.ts` → `["Client"].includes("client")` = `false`
  **selamanya**. Kalau `filteredMenuItems` dipakai, dashboard bakal **kosong total untuk
  semua role**.

Sekarang tidak terasa **hanya karena** `filteredMenuItems` tidak pernah dirender (lihat
catatan di BUG-03). Ini ranjau yang meledak begitu ada yang memakai hook itu.

**Perbaikan di repo ini** (commit `ae0f681`): dinormalkan di sumbernya, bukan dengan
menyisir ~25 titik perbandingan.

1. `getRole()` di `Utils/helpers.ts` sekarang selalu mengembalikan huruf kecil, sehingga
   semua pemanggil yang membandingkan dengan literal huruf kecil langsung tahan casing.
   Fallback `localStorage.getItem("role")` yang mati ikut dibuang (tidak ada kode yang
   pernah menulisnya).
2. `Sidebar.tsx` tidak lagi mem-parse cookie sendiri, memakai `getRole()`.
3. `allowedRoles` di `menuItems.tsx` diturunkan jadi huruf kecil.
4. `useDashboard.ts` membandingkan dengan `user.role?.toLowerCase()` — sumbernya JWT,
   bukan cookie, jadi tetap perlu dinormalkan terpisah.
5. `Login.tsx` menulis cookie role dalam huruf kecil sejak awal.

**Terverifikasi:** sidebar role Client tetap lengkap (16 menu).

---

### BUG-08 — Tidak ada role guard di routing

**Severity:** Sedang (FE-only; BE tetap gerbang sebenarnya)

**Lokasi di prod:** `BGP_Project_Admin/src/Utils/PrivateRoute.tsx` baris 6–17

```js
const token = document.cookie...find(row => row.startsWith("token="))...
return token ? <Outlet /> : null;
```

**Masalah:** `PrivateRoute` hanya mengecek **ada tidaknya token**, sama sekali tidak
mengecek role. Semua route diletakkan di dalam satu `PrivateRoute` yang sama
(`src/App.tsx` baris 47–111), jadi user login mana pun bisa membuka halaman role lain
lewat URL langsung — misalnya akun Client membuka `/AdminManageUsers`, atau sebaliknya.

Sidebar memang menyembunyikan menunya, tapi itu cuma sembunyi tampilan, bukan proteksi.

**Mitigasi yang sudah ada:** BE menolak request-nya (terbukti dari 403 di BUG-06), jadi
data sensitif tidak bocor — halamannya cuma tampil kosong/gagal.

**Perbaikan di repo ini** (commit `ae0f681`): ditambahkan `src/Utils/RequireRole.tsx`,
komponen route-element bergaya sama dengan `PrivateRoute`, dipasang sebagai route
pembungkus di dalam `Mainlayouts` supaya sidebar tetap tampil. Role yang tidak diizinkan
dilempar ke dashboard miliknya sendiri, bukan ke halaman error, supaya tidak nyangkut.

Cakupannya sengaja **konservatif** — hanya route yang Sidebar dan `menuItems` sama-sama
sepakat:

- `allow={["admin"]}` → `/AdminDashboard`, `/AdminAprovalAkun`, `/AdminManageUsers`
- `allow={["client"]}` → `/ClientDashboard`, `/ClientPenjadwalanSatpam`,
  `/AdminManagePos`, `/AdminManagePosUtama`, `/ClientManageRadius`, `/ClientGpsTracking`,
  `/ClientRiwayatPesan`

Route yang perannya cuma tersirat (`/AdminDetailSatpam`, `/AdminEditDetailSatpam`,
`/ClientDetailSatpam`) dibiarkan shared — klasifikasinya hasil inferensi, dan risiko
salah-kunci lebih mahal daripada manfaatnya.

Ini gerbang tampilan, **bukan** pengganti otorisasi BE.

**Terverifikasi** (login sebagai Client): `/AdminManageUsers`, `/AdminAprovalAkun`, dan
`/AdminDashboard` dilempar ke `/ClientDashboard`; route client-only dan shared tetap bisa
dibuka.

---

## Halaman yang masih mockup (bukan bug — memang belum digarap)

Ditemukan lewat audit: halaman-halaman ini **tidak memanggil API sama sekali**, semua
angka/isinya hardcoded di file.

| Halaman | Lokasi di prod | Bukti |
|---|---|---|
| Dashboard Client | `BGP_Project_Admin/src/pages/ClientDashboard.tsx` baris 18–37 | `trendData` (Jan–Jun), `perhatianData` (`"Satpam 2"`, `"Satpam 3"`); **nol** `fetch`/service |
| Dashboard Admin | `BGP_Project_Admin/src/pages/AdminDashboard.tsx` baris 30–81, 304–306 | `mockDataPerhatian` (`"Budi Santoso"`, `"Siti Rahayu"`, dst), `"Summarecon Mall Serpong"` dkk |
| Panic Alert | `BGP_Project_Admin/src/pages/AdminPanicAlert.tsx` | 0 import service |
| GPS Tracking | `BGP_Project_Admin/src/pages/ClientTrackingGps.tsx` | 0 import service, 0 request |
| Activity Log (Admin) | `BGP_Project_Admin/src/pages/AdminActivityLog.tsx` | 0 import service; route `/AdminActivityLog` tidak ada di Sidebar |

Konsisten dengan dihapusnya `dashboardService.ts`, `alertService.ts`, dan
`trackingService.ts` dari prod.

---

## 🟢 Risiko desain pada PR #118 — sudah ditangani di repo ini

**Lokasi di prod:** `BGP_Project_Admin/src/services/scheduleService.ts`, cabang
`delete(..., mode: "future")` — di repo ini ada di baris **273–280**

PR #118 memperbaiki masalah nyata: hapus "ke depannya" dulu cuma PATCH `effective_to`
assignment yang diklik, sehingga assignment **penerus** (hasil edit mode "future"
sebelumnya) tidak ikut terhapus dan tetap menghasilkan jadwal — hapusnya jadi tidak
tuntas. Perbaikannya: cari assignment penerus lalu hapus juga.

**Tapi filternya cuma per satpam:**

```js
`${BASE_URL_API}/shift-assignments?satpam=${satpamUuid}&limit=50`
...
const successors = (listData.data || []).filter(
  (a) => a.uuid !== assignmentUuid && (a.effective_from || "") >= targetDateStr
);
```

Tidak menyaring `pos_uuid` maupun `pattern_uuid`. Artinya menghapus "hari ini dan
seterusnya" pada **satu** jadwal berpotensi ikut menghapus assignment satpam itu di
**pos atau shift yang sama sekali berbeda**, asalkan `effective_from`-nya >= tanggal
target. Makin sering fitur edit "mulai hari ini & seterusnya" dipakai, makin besar
peluang kejadian.

**Perbaikan di repo ini** (commit `743b5b7`): penerus disaring dengan kombinasi satpam
**+ pos + pattern**. `pos_uuid` dan `pattern_uuid` diambil dari assignment yang sedang
dihapus (sudah tersedia dari `getAssignmentById` di cabang yang sama).

---

## Catatan lingkungan build

Dua hal yang bikin bingung waktu setup, keduanya memang bawaan prod:

**1. `npm install` gagal tanpa `--legacy-peer-deps`**

```
npm error Conflicting peer dependency: react@18.3.1
npm error peer react@"^16.8.0 || 17.x || 18.x" from react-simple-maps@3.0.0
```

Proyek pakai React `^19.1.1`, sementara `react-simple-maps@3.0.0` belum menyatakan
dukungan React 19. `Dockerfile` prod baris 7 sendiri sudah memakai
`npm ci --legacy-peer-deps`. Jadi pakai:

```bash
npm install --legacy-peer-deps
```

**2. Build prod sengaja melewati type-check**

`Dockerfile` baris 18 memakai `npx vite build`, bukan `npm run build`. Konsekuensinya
error TypeScript **tidak akan ketahuan** di pipeline prod — persis yang terjadi pada
BUG-01 dan BUG-02. Untuk mengecek beneran bersih, jalankan:

```bash
npm run build
```

---

## Ringkasan

| ID | Masalah | Severity | Status |
|---|---|---|---|
| BUG-01 | Halaman shift legacy bikin `tsc -b` gagal (11 error) | Tinggi | 🟢 Diperbaiki |
| BUG-02 | Import `AiOutlineUpload` tidak terpakai | Rendah | 🟢 Diperbaiki |
| BUG-03 | Link menu ke halaman terhapus + komentar mati | Rendah | 🟢 Diperbaiki |
| BUG-04 | Activity Log infinite fetch loop (84 req/3 dtk) | **Kritis** | 🟢 Diperbaiki |
| BUG-05 | `shiftService` `/v1/` dobel → semua endpoint 404 | Tinggi | 🟢 Diperbaiki |
| BUG-06 | `GET /client` 403 berulang saat role Client | Sedang | 🟢 Diperbaiki |
| BUG-07 | Casing role tidak konsisten (laten, di dead code) | Rendah | 🟢 Diperbaiki |
| BUG-08 | Tidak ada role guard di `PrivateRoute` | Sedang | 🟢 Diperbaiki |
| — | Scoping successor PR #118 (hapus lintas pos/shift) | Sedang | 🟢 Diperbaiki |

**Status:** kedelapan bug sudah diperbaiki di repo ini; **semuanya masih ada di prod**.

**Cakupan audit runtime:** seluruh halaman yang terlihat oleh role **Client** dan role
**Admin** sudah ditelusuri langsung ke BE production, sebelum dan sesudah perbaikan.

Hasil sweep **Admin** (login asli, `role: admin`):

| Yang diuji | Hasil |
|---|---|
| 12 halaman yang terlihat Admin | **nol** request gagal, **nol** error JavaScript, data asli tampil |
| `GET /client` untuk Admin | **200** di Manage Client, Rekap Absensi, Rekap Patroli, Pengumuman, Repositori Dokumen — gating BUG-06 terbukti tidak salah blokir Admin |
| Activity Log (jendela 7 detik) | **4 request lalu berhenti**, sama seperti sesi Client — loop BUG-04 tertutup untuk kedua role |
| Route admin-only | `/AdminDashboard`, `/AdminAprovalAkun`, `/AdminManageUsers` — semua terbuka |
| Route client-only | 7 route dilempar ke `/AdminDashboard` sesuai rancangan |
| Route shared | `/AdminManageSatpam`, `/AdminDetailSatpam`, `/ClientDetailSatpam` — tetap terbuka |

**Konsekuensi BUG-08 yang perlu diketahui:** Admin sekarang tidak bisa lagi membuka
`/AdminManagePos`, `/AdminManagePosUtama`, `/ClientManageRadius`, `/ClientGpsTracking`,
`/ClientRiwayatPesan`, `/ClientPenjadwalanSatpam`, dan `/ClientDashboard` lewat URL
langsung. Ini memang sesuai klasifikasi Sidebar (`hidden: role !== "client"`) dan
`menuItems` (`allowedRoles: ["client"]`) — menunya pun tidak pernah tampil untuk Admin —
tapi tetap perubahan perilaku dibanding sebelumnya yang membiarkan siapa pun masuk.

**Catatan:** `/AdminEditDetailSatpam` ikut memantul saat dibuka langsung lewat URL, tapi
itu **bukan** karena role guard — route itu ada di grup shared. Penyebabnya logika bawaan
halaman itu sendiri: `const uuid = location.state?.uuid` lalu `if (!uuid) navigate(-1)`,
karena halaman edit memang butuh `uuid` yang dioper dari tombol pemanggilnya. Perilaku
lama, bukan regresi.

Halaman yang terverifikasi sehat (render data asli, tanpa request gagal selain BUG-06):
Manage Satpam, Manage Pos Patroli, Manage Pos Utama, Penjadwalan Satpam, Manage Radius,
Rekap Absensi, Rekap Patroli, Laporan Kejadian, Riwayat Pesan, Pengajuan, Pengumuman,
Repositori Dokumen.
