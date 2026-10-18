# CONTEXT.md — PAGORA (Sistem Pengadaan)

> Dokumen konteks proyek **PAGORA**. Tujuan: sumber utama untuk membuat `AGENTS.md` dan membangun **website dokumentasi** (React / Next.js) yang menjelaskan arsitektur, alur data, aturan penulisan kode, dan panduan Git tim.
> Sumber: struktur folder aktual proyek + `RULES.md` (standar kode). Jika ada konflik, `RULES.md` menjadi acuan aturan, struktur folder aktual menjadi acuan penamaan file.

---

## 1. Ringkasan Proyek

| Item | Keterangan |
|---|---|
| Nama | PAGORA — sistem pengadaan (procurement) berbasis web |
| Tipe | Monolith: Laravel + React dalam **satu project** (bukan repo terpisah) |
| Backend | Laravel (PHP), Laravel Fortify (login email), Laravel Socialite (Google OAuth) |
| Frontend | Inertia.js + React + Vite (JavaScript / `.jsx`) |
| UI | shadcn/ui + Tailwind CSS |
| Tabel & input | shadcn Data Table + `@tanstack/react-table`, Combobox (Popover + Command), `react-dropzone` |
| Database | PostgreSQL |
| Arsitektur backend | MVC + Service Repository Pattern |
| Modul referensi | `Komoditas` (CRUD lengkap, dipakai sebagai contoh pola) |
| Bahasa | Pesan error/validasi untuk user: **Bahasa Indonesia**. Nama class, method, variabel, komentar kode: **Bahasa Inggris** |

Inertia.js bertindak sebagai "jembatan": controller Laravel me-render halaman React lewat `Inertia::render()`, tanpa membangun API terpisah untuk halaman biasa. Endpoint JSON hanya dipakai untuk kebutuhan khusus (misalnya async search Combobox).

---

## 2. Struktur Folder

### 2.1 Backend (`app/`)

```
app/
├── Helpers/
│   └── ResponseHelper.php             # Format response seragam (JSON & Inertia)
├── Http/
│   ├── Controllers/                   # Controller tipis (Thin Controller)
│   │   ├── AuthController.php
│   │   ├── KomoditasController.php
│   │   ├── VendorRegistrationController.php
│   │   └── DashboardController.php
│   ├── Requests/                      # Validasi & otorisasi input (per domain)
│   │   ├── Auth/
│   │   │   ├── LoginRequest.php
│   │   │   └── StoreVendorRegistrationRequest.php
│   │   └── Komoditas/
│   │       ├── StoreKomoditasRequest.php
│   │       └── UpdateKomoditasRequest.php
│   └── Resources/                     # Transformasi output (field eksplisit, tanpa id)
│       └── KomoditasResource.php
├── Models/                            # Tabel, relasi, cast, scope
│   ├── User.php
│   ├── Vendor.php
│   └── Komoditas.php
├── Providers/
│   └── RepositoryServiceProvider.php  # Binding Interface -> Implementasi
├── Repositories/
│   ├── Contracts/                     # Interface (kontrak query)
│   │   ├── UserRepositoryInterface.php
│   │   ├── VendorRepositoryInterface.php
│   │   └── KomoditasRepositoryInterface.php
│   └── Eloquent/                      # Implementasi query (Eloquent)
│       ├── UserRepository.php
│       ├── VendorRepository.php
│       └── KomoditasRepository.php
└── Services/                          # Logika bisnis & transaksi
    ├── AuthService.php
    ├── KomoditasService.php
    └── VendorRegistrationService.php
```

> Catatan: folder `Http/Resources/` saat ini baru berisi `KomoditasResource.php`. Sesuai `RULES.md`, data yang dikirim ke frontend harus lewat API Resource, jadi setiap modul baru membuat Resource-nya sendiri (contoh: `VendorResource.php`).

### 2.2 Frontend (`resources/js/`)

```
resources/js/
├── app.jsx                       # Entry point: inisialisasi Inertia & progress bar
├── Layouts/
│   └── DashboardLayout.jsx       # Shell dashboard (Sidebar, Header, FlashHandler)
├── Pages/                        # Halaman yang di-render Inertia
│   ├── Home.jsx                  # Landing page
│   ├── Dashboard.jsx             # Beranda dashboard
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── RegisterVendor.jsx
│   └── Master/
│       └── Komoditas/
│           ├── Index.jsx         # List data dengan DataTable
│           ├── Create.jsx        # Halaman tambah
│           ├── Edit.jsx          # Halaman ubah
│           ├── KomoditasForm.jsx # Form reusable (Create/Edit)
│           └── columns.jsx       # Definisi kolom TanStack Table
├── Components/                   # Komponen reusable
│   ├── AppSidebar.jsx
│   ├── SidebarLink.jsx
│   ├── Navbar.jsx
│   ├── file-dropzone.jsx         # Upload dokumen (react-dropzone)
│   ├── combobox.jsx              # Searchable select (Popover + Command)
│   ├── loading-button.jsx        # Button dengan spinner
│   ├── flash-handler.jsx         # Toast + suara dari flash message
│   ├── data-table/               # Tabel generik (TanStack)
│   │   ├── data-table.jsx
│   │   ├── data-table-pagination.jsx
│   │   └── data-table-view-options.jsx
│   └── ui/                       # Primitive shadcn (button, dialog, input, dll.)
└── lib/
    ├── utils.js                  # Helper cn() (clsx + tailwind-merge)
    ├── notify.js                 # Wrapper toast Sonner + suara
    └── sound.js                  # Pemutar SFX (success.mp3 & failure.mp3)
```

**Penting — perbedaan dengan `RULES.md`:** `RULES.md` memakai contoh `pages/`, `components/`, dan `.tsx` (huruf kecil / TypeScript). Proyek aktual memakai folder `Pages/`, `Layouts/`, `Components/` (huruf kapital di awal) dan file `.jsx` (JavaScript). **Ikuti struktur dan konvensi yang sudah ada di proyek**, jangan mengganti ke TypeScript atau mengubah kapitalisasi folder. Aturan tentang tipe (TypeScript) hanya berlaku jika proyek nanti dimigrasi.

Konvensi nama yang terlihat di proyek:
- Halaman & layout & komponen fitur: `PascalCase.jsx` (`DashboardLayout.jsx`, `AppSidebar.jsx`, `KomoditasForm.jsx`).
- Komponen generik gaya shadcn dan helper: `kebab-case.jsx` / `.js` (`file-dropzone.jsx`, `loading-button.jsx`, `notify.js`).
- Halaman modul master dikelompokkan: `Pages/Master/<Modul>/` berisi `Index`, `Create`, `Edit`, `<Modul>Form`, `columns`.

---

## 3. Arsitektur Backend: MVC + Service Repository

### 3.1 Alur Request

```
Route → Controller → Service → Repository (Interface) → Model → Database
```

Response kembali dengan jalur yang sama: Model/Repository mengembalikan data, Service memprosesnya, Controller membungkus lewat `ResponseHelper` atau `Inertia::render`.

### 3.2 Tanggung Jawab Tiap Layer

| Layer | Boleh | Dilarang |
|---|---|---|
| **Route** | Memetakan URL ke method controller, memasang middleware, memberi `name()` | `return view()`, `Inertia::render()`, `Route::inertia()`, closure berisi logika |
| **Controller** | Menerima request, memanggil Service, mengembalikan response via `ResponseHelper` / `Inertia::render` | Query Eloquent, logika bisnis, validasi inline |
| **Form Request** | Aturan validasi, pesan error Bahasa Indonesia (`messages()`), otorisasi | Logika bisnis |
| **Service** | Logika bisnis, orkestrasi beberapa repository, transaksi `DB::transaction()`, melempar exception, simpan/hapus file | Mengakses `Request`, return response HTTP, query Eloquent langsung |
| **Repository** | Akses data (query Eloquent), eager loading, paginate | Logika bisnis, return response HTTP |
| **Model** | Relasi, `casts()`, `$fillable`, scope, accessor | Logika bisnis kompleks |

### 3.3 Aturan Dependency

- Controller meng-inject **Service** lewat constructor.
- Service meng-inject **Repository Interface** (bukan class konkret) lewat constructor.
- Binding interface → implementasi ada di `RepositoryServiceProvider`, didaftarkan di `bootstrap/providers.php`.
- Satu Repository untuk satu Model. Satu Service untuk satu domain (boleh memanggil Service lain).
- Satu controller per domain. Method yang me-render halaman dipisah dari method yang memproses aksi (contoh `login` vs `storeAuth`).

### 3.4 Contoh Pola (ilustrasi memakai modul Komoditas)

> Kode berikut adalah **template pola** berdasarkan `RULES.md`, bukan salinan file asli proyek. Nama kolom (`name`, dst.) hanya contoh.

**Repository Interface** — `app/Repositories/Contracts/KomoditasRepositoryInterface.php`

```php
<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Komoditas;
use Illuminate\Pagination\LengthAwarePaginator;

interface KomoditasRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator;

    public function findByUuid(string $uuid): ?Komoditas;

    public function create(array $data): Komoditas;

    public function update(Komoditas $komoditas, array $data): Komoditas;

    public function delete(Komoditas $komoditas): void;
}
```

**Repository Implementation** — `app/Repositories/Eloquent/KomoditasRepository.php`

```php
<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Komoditas;
use App\Repositories\Contracts\KomoditasRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class KomoditasRepository implements KomoditasRepositoryInterface
{
    private const SORTABLE = ['name', 'created_at']; // whitelist kolom sort

    public function __construct(private readonly Komoditas $model) {}

    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $sort = in_array($filters['sort'] ?? null, self::SORTABLE, true) ? $filters['sort'] : 'created_at';
        $direction = ($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        return $this->model
            ->when($filters['search'] ?? null, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy($sort, $direction)
            ->paginate(min($perPage, 100))
            ->withQueryString();
    }

    public function findByUuid(string $uuid): ?Komoditas
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    // create, update, delete: query Eloquent saja, tanpa logika bisnis
}
```

**Service** — `app/Services/KomoditasService.php`

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Komoditas;
use App\Repositories\Contracts\KomoditasRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class KomoditasService
{
    public function __construct(private readonly KomoditasRepositoryInterface $komoditas) {}

    public function findByUuid(string $uuid): Komoditas
    {
        return $this->komoditas->findByUuid($uuid)
            ?? throw new ModelNotFoundException('Data tidak ditemukan.');
    }

    // Operasi yang menyentuh lebih dari satu tabel dibungkus DB::transaction() di sini.
}
```

**Controller** — `app/Http/Controllers/KomoditasController.php`

```php
public function show(string $uuid): Response|JsonResponse|RedirectResponse
{
    try {
        $komoditas = $this->komoditasService->findByUuid($uuid);

        return Inertia::render('Master/Komoditas/Show', [
            'komoditas' => new KomoditasResource($komoditas),
        ]);
    } catch (ModelNotFoundException) {
        return ResponseHelper::notFound('Data tidak ditemukan.');
    } catch (Throwable $e) {
        return ResponseHelper::serverError($e);
    }
}
```

**Binding** — `app/Providers/RepositoryServiceProvider.php`

```php
public function register(): void
{
    $this->app->bind(KomoditasRepositoryInterface::class, KomoditasRepository::class);
    $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    $this->app->bind(VendorRepositoryInterface::class, VendorRepository::class);
}
```

### 3.5 Routes

```php
Route::controller(KomoditasController::class)
    ->prefix('komoditas')
    ->name('komoditas.')
    ->middleware('auth')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{uuid}/edit', 'edit')->whereUuid('uuid')->name('edit');
        Route::put('/{uuid}', 'update')->whereUuid('uuid')->name('update');
        Route::delete('/{uuid}', 'destroy')->whereUuid('uuid')->name('destroy');
    });
```

Aturan route:
- Semua route menunjuk ke method controller dan punya `name()`.
- Kelompokkan dengan `Route::middleware(...)->group(...)` dan `Route::controller(...)->group(...)`.
- Middleware: `guest` untuk login/register/Google; `auth` untuk logout dan halaman terproteksi.
- Parameter resource **wajib `{uuid}` atau `{slug}`**, dengan constraint `whereUuid()` / `where()`. Dilarang `{id}`.
- **Tidak memakai implicit route model binding**; controller menerima `string $uuid` lalu meneruskannya ke Service, supaya pola Controller → Service → Repository konsisten.
- Jika route Fortify bentrok, gunakan `Fortify::ignoreRoutes()` dan `'views' => false` di `config/fortify.php`.

### 3.6 Identifier Publik: UUID / Slug (WAJIB)

Tujuan: mencegah enumerasi data dan IDOR.

- `id` auto-increment hanya dipakai **internal backend** (relasi, join). Tidak boleh keluar ke frontend dalam bentuk apa pun: URL, props Inertia, JSON, field form/hidden input, atribut HTML, `key` list, query string.
- Identifier publik: `uuid` (default semua entitas CRUD) dan `slug` (opsional untuk konten dengan URL mudah dibaca).
- UUID/slug **bukan pengganti otorisasi**. Policy/Gate/pengecekan kepemilikan tetap wajib di setiap aksi.

Migration:

```php
Schema::create('komoditas', function (Blueprint $table) {
    $table->id();                    // internal only
    $table->uuid('uuid')->unique();  // identifier publik
    $table->string('name');
    $table->timestamps();
});
```

Model:

```php
class Komoditas extends Model
{
    use HasUuids;

    protected $hidden = ['id'];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
```

Input relasi dari frontend memakai `*_uuid` (contoh `komoditas_uuid`), divalidasi `['required', 'uuid', 'exists:komoditas,uuid']`, lalu **Service** menerjemahkan uuid → id internal lewat Repository sebelum disimpan.

### 3.7 Response Helper

Semua controller wajib memakai `App\Helpers\ResponseHelper`. Dilarang `response()->json(..., 200)` atau `abort(500)` langsung di controller.

| Method | Status |
|---|---|
| `success()` | 200 |
| `created()` | 201 |
| `badRequest()` | 400 |
| `unauthorized()` | 401 |
| `forbidden()` | 403 |
| `notFound()` | 404 |
| `validationError()` | 422 |
| `serverError()` | 500 |

Format JSON konsisten:

```json
{
  "success": true,
  "message": "Pesan untuk user",
  "data": null,
  "errors": null
}
```

Perilaku:
- `request()->expectsJson()` → JSON dengan status code sesuai.
- Request Inertia biasa:
  - Sukses → `redirect()->intended($redirectTo)` atau `back()` dengan `->with('success', $message)`.
  - Gagal validasi → `back()->withErrors($errors)` (masuk ke props `errors`, tanpa flash `error`).
  - Gagal non-validasi (400/403/404/500) → `back()->with('error', $message)`.
- Flash `success` / `error` dibagikan lewat `HandleInertiaRequests::share()` dan ditangani **satu tempat** oleh `flash-handler`.
- `serverError()` wajib `Log::error(...)` dan menampilkan pesan generik (jangan bocorkan exception, stack trace, atau query).

### 3.8 Validasi

- Backend: wajib **Form Request** (`php artisan make:request`), dikelompokkan per domain (`Requests/Komoditas/StoreKomoditasRequest.php`). Pesan error Bahasa Indonesia di `messages()`. Aturan `unique`/`exists` selalu di backend.
- Frontend: validasi sebelum submit untuk feedback cepat. Frontend **tidak menggantikan** backend; backend selalu memvalidasi ulang.
- Penamaan Form Request: `{Action}{Model}Request` (contoh `StoreKomoditasRequest`, `UpdateKomoditasRequest`).

### 3.9 Database

- Perubahan skema selalu lewat migration baru; jangan edit migration lama yang sudah dijalankan.
- Tabel plural snake_case; foreign key `{model}_id` via `foreignId()->constrained()` dengan `onDelete` yang jelas.
- Index pada kolom yang sering di-query/unik.
- `$fillable` (atau `$guarded` secara sadar) dan `casts()` pada Model.
- Operasi multi-tabel dibungkus `DB::transaction()` di **Service**.
- Hindari N+1: eager loading (`with()`) di Repository.
- Setiap tabel CRUD wajib punya kolom `uuid` (unique), dan `slug` (unique) bila perlu.

### 3.10 Autentikasi

- Login email memakai **Fortify**; login Google memakai **Socialite**.
- Login (email maupun Google) **tidak boleh membuat user baru**. Jika akun belum terdaftar, tampilkan error pada input email / tombol Google.
- Register (termasuk registrasi vendor) adalah satu-satunya jalur pembuatan user baru.
- Setelah login: `session()->regenerate()`. Saat logout: `invalidate()` session + `regenerateToken()`.
- Password selalu di-hash. Jangan log password, token, atau secret.
- *Remember me* dikirim sebagai `remember` (boolean).
- Rate limit login lewat Fortify.
- Satu `AuthController` untuk semua tipe auth: `login`, `storeAuth`, `register`, `storeRegister`, `redirectToGoogle`, `handleGoogleCallback`, `logout`.

---

## 4. Alur Data (Data Flow)

### 4.1 Alur Request Penuh (contoh: simpan Komoditas)

```
[Browser / React]
  1. User mengisi KomoditasForm → validasi frontend → useForm.post(route('komoditas.store'))
        │  (Inertia mengirim XHR dengan header X-Inertia, CSRF otomatis)
        ▼
[Laravel]
  2. Route (komoditas.store, middleware auth)
  3. StoreKomoditasRequest → validasi + pesan Indonesia
        │  gagal → redirect back dengan errors → props `errors` di React
        ▼
  4. KomoditasController@store → memanggil KomoditasService
  5. KomoditasService → logika bisnis, DB::transaction bila perlu
  6. KomoditasRepositoryInterface → KomoditasRepository → Model Komoditas → PostgreSQL
        ▼
  7. Controller → ResponseHelper::success('...', redirectTo: route('komoditas.index'))
        │  → redirect + flash 'success'
        ▼
[Browser / React]
  8. Inertia memuat halaman tujuan; HandleInertiaRequests::share() mengirim flash
  9. FlashHandler (di DashboardLayout) → notify.success() → suara + toast
```

### 4.2 Alur Menampilkan Daftar (Data Table server-side)

```
Index.jsx (state: search, sort, direction, page, per_page)
   │ router.get(route('komoditas.index'), params,
   │            { preserveState, preserveScroll, replace, only: ['komoditas','filters'] })
   ▼
KomoditasController@index ← IndexKomoditasRequest (validasi query string)
   ▼
KomoditasService::paginate($filters)
   ▼
KomoditasRepository::paginate()  (whitelist sort, per_page maks 100)
   ▼
KomoditasResource::collection()  → props { komoditas: {data, meta, links}, filters }
   ▼
DataTable (manualPagination / manualSorting / manualFiltering, getRowId = row.uuid)
```

### 4.3 Alur Data ke Frontend

Controller **tidak mengirim model mentah**. Selalu lewat API Resource dengan field eksplisit:

```php
class KomoditasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            // relasi pun lewat uuid, bukan id
        ];
    }
}
```

### 4.4 Pola Error

| Jenis error | Backend | Frontend |
|---|---|---|
| Validasi (422) | `back()->withErrors()` | Input state invalid + pesan inline, `notify.validationFailed()` (suara saja, tanpa toast) |
| Non-validasi (400/403/404/500) | `back()->with('error', ...)` | `FlashHandler` → `notify.error()` (suara + toast) |
| Sukses | `->with('success', ...)` | `FlashHandler` → `notify.success()` (suara + toast) |

---

## 5. Aturan Frontend (React + Inertia)

### 5.1 Umum

- Halaman = file di `Pages/`, dirender dari controller via `Inertia::render('Folder/Nama')` (path mengikuti folder, contoh `Master/Komoditas/Index`).
- **Functional component + hooks.** Dilarang class component.
- Pakai komponen shadcn yang sudah terinstall; jangan membuat ulang. Jika butuh komponen shadcn yang belum ada, tanyakan dulu (pengecualian: `table`, `popover`, `command`, `dialog`, `alert-dialog`, `dropdown-menu`, `sonner`).
- Tailwind saja, hindari inline style; class kondisional dengan `cn()` dari `lib/utils.js`.
- Tidak ada `console.log`, kode mati, atau import tak terpakai.
- Identifier data di frontend **hanya `uuid` / `slug`**. Tidak ada `id` auto-increment (URL, props, form, hidden input, `key`).
- Komponen yang dipakai di lebih dari satu halaman dipindah ke `Components/`.
- Package baru tidak boleh di-install tanpa persetujuan (kecuali `@tanstack/react-table`, `react-dropzone`, dan komponen shadcn pendukung).

### 5.2 Form (`useForm`)

- Selalu `useForm` dari `@inertiajs/react`.
- Nilai awal form **kosong** (`''`, `false`, `[]`). Dilarang `defaultValue` atau data dummy.
- Tombol submit di-`disable` saat `processing`.
- `clearErrors('field')` saat user mengubah input terkait.
- `<form noValidate>`; **dilarang atribut `required`, `pattern`, `minLength`, `maxLength`** untuk validasi. Penanda wajib cukup tanda `*` di label.
- Validasi frontend: panggil `setError(field, pesan)` per field gagal; jika ada error → hentikan submit, fokus ke field error pertama, panggil `notify.validationFailed()` **satu kali**.

### 5.3 Tampilan Error Input

Setiap input yang error wajib punya `aria-invalid`, class invalid, dan pesan di bawahnya:

```jsx
<div className="space-y-2">
  <Label htmlFor="name">Nama *</Label>
  <Input
    id="name"
    value={data.name}
    onChange={(e) => {
      setData('name', e.target.value);
      clearErrors('name');
    }}
    aria-invalid={!!errors.name}
    className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
  />
  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
</div>
```

Berlaku untuk `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, dan `FileDropzone`.

### 5.4 Data Table (TanStack)

- Semua halaman daftar wajib memakai `Components/data-table/`, bukan `<table>` manual.
- Kolom didefinisikan per modul di `columns.jsx`.
- **Server-side** pagination, sorting, filtering (`manualPagination`, `manualSorting`, `manualFiltering`).
- `getRowId: (row) => row.uuid`.
- Search memakai debounce ±400 ms; state tabel di query string via `router.get` dengan `preserveState`, `preserveScroll`, `replace`, `only`.
- Tampilkan loading (skeleton/overlay) dan empty state ("Belum ada data").
- Kolom aksi: `DropdownMenu` (Detail / Edit / Hapus); hapus lewat `AlertDialog` dengan tombol loading.

### 5.5 Combobox

- Satu komponen reusable `Components/combobox.jsx` (Popover + Command). Untuk 2–5 opsi statis cukup shadcn `Select`.
- Opsi `{ value: uuid, label: string }`; value yang dikirim adalah `uuid`.
- Props minimal: `options`, `value`, `onChange`, `placeholder`, `error`, `disabled`, `loading`, `clearable`.
- Trigger `Button type="button"` agar tidak men-submit form.
- Opsi ≤ ±100 → via props Inertia. Opsi banyak → async search ke endpoint JSON (debounce, maks 20–50 hasil).

### 5.6 File Upload (`FileDropzone`)

- Semua input file memakai `Components/file-dropzone.jsx`; dilarang `<input type="file">` polos.
- `accept`, `maxSize`, `maxFiles` sama dengan Form Request.
- File ditolak → state invalid pada dropzone + `setError` + `notify.validationFailed()`.
- Preview wajib `URL.revokeObjectURL` saat unmount/ganti file.
- Update dengan file: kirim `post` dengan `_method: 'put'`. Hapus file lama: flag `remove_<field>: true`.
- Backend: validasi `mimes` + `max` di Form Request, simpan di **Service** (`Storage::disk('public')`) dengan nama file **dibuat server**, hapus file lama saat diganti/dihapus, pastikan `php artisan storage:link`.

### 5.7 Notifikasi & Suara

| Event | Pemanggilan | Hasil |
|---|---|---|
| Sukses | `notify.success(message)` | Suara `success.mp3` + toast |
| Error non-validasi | `notify.error(message)` | Suara `failure.mp3` + toast |
| Error validasi | `notify.validationFailed()` | Suara `failure.mp3` saja; pesan inline di input |

- Aset: `public/assets/sounds/success.mp3` dan `failure.mp3` (sudah disediakan, jangan diganti).
- Dilarang `new Audio(...)` atau `toast.*` langsung di komponen; semua lewat `lib/sound.js` dan `lib/notify.js`.
- **Satu event = satu suara.**
- Flash dari backend ditangani satu tempat: `Components/flash-handler.jsx` yang dipasang di `DashboardLayout`.
- `playSound` harus aman SSR (`typeof window === 'undefined'`) dan menangkap error `play()`.

### 5.8 Modal vs Form Page

| Kondisi | Bentuk |
|---|---|
| ≤ 4 field sederhana, tanpa upload file | **Modal** (`Dialog`) di halaman index |
| ≥ 5 field, ada upload, textarea panjang, repeater, multi-step | **Form page** terpisah (`Create` / `Edit`) |

Jika ragu, pilih form page. Modul `Komoditas` memakai form page dengan `KomoditasForm.jsx` yang dipakai bersama `Create.jsx` dan `Edit.jsx`.

Aturan modal: tidak ditutup saat error atau saat `processing`; tutup hanya saat `onSuccess`, lalu `reset()` + `clearErrors()`; konfirmasi hapus pakai `AlertDialog`, bukan `window.confirm`.

### 5.9 Loading Button

Setiap button yang memicu proses async (submit, simpan, hapus, login, Google login, logout, export, konfirmasi dialog) wajib memakai `Components/loading-button.jsx`:

```jsx
<LoadingButton type="submit" loading={processing} loadingText="Menyimpan...">
  Simpan
</LoadingButton>
```

Saat loading, tombol lain di form/dialog yang sama juga di-`disable` agar tidak terjadi submit ganda.

---

## 6. Standar Penulisan Kode

### PHP
- Ikuti **PSR-12**; file baru memakai `declare(strict_types=1);`.
- Type hint pada semua parameter dan return type; `readonly` untuk properti hasil constructor promotion.
- Class `PascalCase`, method/variabel `camelCase`, konstanta `UPPER_SNAKE_CASE`, route name konsisten (`dot.notation`).
- PHPDoc singkat hanya jika tipe/maksud tidak jelas dari signature.
- Early return dibanding nested `if` dalam.
- Tidak ada logika bisnis di Controller, tidak ada query Eloquent di luar Repository, tidak ada status code hardcode di luar `ResponseHelper`.

### React
- Komponen `PascalCase`, hindari duplikasi, pisahkan komponen reusable ke `Components/`.
- Gunakan `useForm`, `router`, dan `usePage` dari `@inertiajs/react`.

### Umum
- Komentar menjelaskan **kenapa**, bukan **apa**.
- Satu fungsi satu tanggung jawab; DRY tetapi tanpa abstraksi prematur.
- Jangan ubah format/gaya kode di luar bagian yang dikerjakan.
- Jangan mengubah file yang tidak berkaitan dengan tugas.

### Keamanan
- Selalu Form Request; jangan percaya input user.
- Mass assignment protection; jangan `Model::create($request->all())`.
- Jangan bocorkan detail internal (exception, SQL, path).
- Otorisasi (Policy/Gate/middleware) pada setiap aksi yang membutuhkan.
- Secret hanya di `.env`, diakses lewat `config()`; jangan commit `.env`.
- CSRF jangan dinonaktifkan.
- Cegah IDOR: `uuid`/`slug` **dan** pengecekan kepemilikan.

---

## 7. Urutan Mengerjakan Fitur Baru

Urutan wajib: **Migration/Model → Repository → Service → Form Request → Controller → Route → Frontend.**

1. Pahami flow fitur; tulis asumsi jika ada yang ambigu.
2. Periksa kode yang sudah ada (model, migration, route, komponen) dan gunakan ulang; jangan membuat duplikat.
3. Buat migration (dengan `uuid`) dan Model (`HasUuids`, `uniqueIds()`, `getRouteKeyName()`, `$hidden = ['id']`).
4. Buat Repository Interface + implementasi, daftarkan binding di `RepositoryServiceProvider`.
5. Buat Service.
6. Buat Form Request (pesan Indonesia).
7. Buat API Resource.
8. Buat Controller tipis dengan `ResponseHelper`.
9. Tambahkan route (`{uuid}` + `whereUuid`).
10. Buat halaman React (`Index`, `Create`, `Edit`, `Form`, `columns`) memakai komponen reusable.
11. Jalankan verifikasi: `php artisan route:list` dan `npm run build` tanpa error.

### Checklist sebelum selesai
- [ ] Struktur folder benar; tidak ada file di tempat salah.
- [ ] Controller tipis; tidak ada query/logika bisnis.
- [ ] Service memakai Repository **interface**; binding terdaftar.
- [ ] Validasi Form Request + validasi frontend.
- [ ] Semua controller memakai `ResponseHelper`.
- [ ] Route memakai `{uuid}` + `whereUuid`; tidak ada `Inertia::render` di file route.
- [ ] Tidak ada `id` auto-increment di props, JSON, URL, atau form.
- [ ] Error validasi tampil sebagai state invalid; tanpa atribut `required`; `<form noValidate>`.
- [ ] Daftar data memakai Data Table server-side dengan sort di-whitelist.
- [ ] Notifikasi lewat `notify`; tidak ada `new Audio` / `toast.*` langsung.
- [ ] Semua button async memakai `LoadingButton`.
- [ ] Nilai awal form kosong; tidak ada data dummy.
- [ ] Tidak ada file/controller/route lama yang tertinggal.

### Format laporan akhir (untuk AI agent)
1. Asumsi (jika ada) 2. Daftar file dibuat/diubah/dihapus 3. Kode lengkap 4. Perintah yang perlu dijalankan 5. Hasil verifikasi.

---

## 8. Panduan Git untuk Tim

> Aturan Git di bagian ini ditetapkan oleh tim PAGORA. Semua anggota dan AI agent wajib mengikutinya.

### 8.1 Aturan Tim (Ringkas)

1. Branch utama adalah **`main`**. Tidak ada branch `develop`.
2. Setiap pekerjaan dikerjakan di branch sendiri dengan format **`feat/nama-feature`** (atau prefix lain sesuai jenis kerja, lihat 8.3).
3. Pesan commit memakai format **`feat : pesan commit yang jelas`** (lihat 8.4).
4. Setiap pekerjaan selesai dengan membuat **Pull Request (PR)** ke `main`.
5. **Hanya Dimas (pemilik repo) yang boleh merge ke `main`.** Anggota lain dan AI agent tidak boleh merge ke `main`. Penggabungan ke `main` hanya dilakukan oleh **Dimas (pemilik repo)** lewat PR.
6. Jika di tengah pengerjaan ada perubahan baru di `main`, gunakan **`git stash`** dan/atau **`git merge`** untuk membawa perubahan itu ke branch kerja (lihat 8.7).

### 8.2 Konsep Dasar

| Istilah | Arti |
|---|---|
| Working directory | Folder proyek di laptop; tempat mengedit file |
| Staging area | Daftar perubahan yang akan masuk commit (`git add`) |
| Local repository | Riwayat commit di laptop |
| Remote (`origin`) | Repository di GitHub/GitLab |
| Branch | Cabang kerja terpisah dari `main` |
| Pull Request (PR) | Permintaan menggabungkan branch kerja ke `main`, untuk di-review |

### 8.3 Penamaan Branch

Format: `<tipe>/<nama-fitur-kebab-case>` (huruf kecil, kata dipisah `-`, ringkas, bahasa Inggris).

| Prefix | Kapan dipakai |
|---|---|
| `feat/` | Fitur baru |
| `fix/` | Perbaikan bug |
| `refactor/` | Perapian kode tanpa mengubah perilaku |
| `docs/` | Dokumentasi |
| `chore/` | Konfigurasi, dependency, tooling |

Contoh:

```
feat/komoditas-crud
feat/vendor-registration
feat/google-login
fix/login-validation-error
refactor/komoditas-service
docs/context-md
chore/install-react-dropzone
```

Hindari: `fitur-baru`, `dimas-branch`, `test`, `perbaikan_login`, nama dengan spasi atau huruf kapital.

### 8.4 Pesan Commit

Format wajib (perhatikan spasi di kiri dan kanan tanda titik dua):

```
feat : pesan commit yang jelas menggambarkan yang dikerjakan
```

Prefix mengikuti jenis pekerjaan:

| Prefix | Kapan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `refactor` | Perubahan kode tanpa ubah perilaku |
| `docs` | Dokumentasi |
| `chore` | Dependency, config, build |

Contoh baik:

```
feat : tambah form create dan edit komoditas
feat : blokir login google untuk email yang belum terdaftar
fix : perbaiki sort kolom data table agar memakai whitelist
refactor : pindahkan logika registrasi vendor ke service
docs : tambah context.md untuk dokumentasi proyek
chore : install react-dropzone
```

Contoh buruk: `update`, `fix bug`, `revisi`, `asdf`, `final final`, `feat:tambah` (tanpa spasi).

Aturan commit:
- Pesan harus jelas menggambarkan apa yang dikerjakan (bukan "update" atau "perbaikan" saja).
- Satu commit = satu perubahan logis; jangan mencampur fitur dan perbaikan tak terkait.
- Commit kecil dan sering lebih baik daripada satu commit besar.
- Jangan commit `.env`, `vendor/`, `node_modules/`, file build, atau secret (pastikan ada di `.gitignore`).
- Pastikan `php artisan route:list` dan `npm run build` lolos sebelum push.

### 8.5 Setup Awal (sekali saja)

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"

git clone <url-repo> pagora-website
cd pagora-website

composer install
npm install
cp .env.example .env
php artisan key:generate
```

### 8.6 Alur Kerja Harian

```bash
# 1. Sinkronkan main terbaru
git checkout main
git pull origin main

# 2. Buat branch kerja dari main
git checkout -b feat/komoditas-crud

# 3. Kerjakan fitur, cek perubahan
git status
git diff

# 4. Stage & commit
git add app/Services/KomoditasService.php
git add .                       # semua perubahan (cek git status dulu)
git commit -m "feat : tambah service dan repository komoditas"

# 5. Push branch ke remote (pertama kali pakai -u)
git push -u origin feat/komoditas-crud
# push berikutnya cukup:
git push

# 6. Buat Pull Request: feat/komoditas-crud -> main
#    (jangan merge sendiri; tunggu review & merge oleh Dimas)

# 7. Setelah PR di-merge oleh Dimas, bersihkan
git checkout main
git pull origin main
git branch -d feat/komoditas-crud
```

### 8.7 Ada Perubahan Baru di `main` di Tengah Pengerjaan

Ini kasus yang sering terjadi: temanmu sudah merge PR ke `main` saat kamu masih mengerjakan branch fitur. Bawa perubahan itu ke branch kerjamu dengan salah satu cara berikut.

**Cara A — commit dulu, lalu merge (disarankan jika pekerjaan sudah layak di-commit)**

```bash
git add .
git commit -m "feat : simpan progres form komoditas"

git fetch origin
git merge origin/main            # bawa perubahan main ke branch kerja
# selesaikan konflik bila ada (lihat 8.9), lalu lanjut bekerja
```

**Cara B — stash jika pekerjaan belum siap di-commit**

```bash
git stash push -m "wip: form komoditas"   # simpan perubahan sementara
git fetch origin
git merge origin/main                      # bawa perubahan main
git stash pop                              # kembalikan perubahanmu
# selesaikan konflik bila ada
```

Catatan:
- Arah merge yang diperbolehkan: **`main` → branch kerjamu**. Arah sebaliknya (**branch kerja → `main`**) hanya lewat PR.
- Jika dari awal kamu perlu pindah branch sebentar, `git stash` juga dipakai untuk menyimpan pekerjaan yang belum di-commit.

### 8.8 Perintah Penting

**`git fetch`** — mengunduh info/commit terbaru dari remote **tanpa** mengubah file di working directory. Aman dijalankan kapan saja.

```bash
git fetch origin
git log HEAD..origin/main --oneline       # commit baru di main yang belum ada di branch kamu
git diff HEAD origin/main                 # bedanya
```

**`git pull`** — `fetch` + `merge` dari remote ke branch aktif.

```bash
git pull origin main                      # di branch main, untuk update lokal
```

Commit atau stash perubahanmu sebelum `pull`.

**`git add` / `git commit`**

```bash
git add <file>
git add .
git commit -m "feat : tambah halaman login"
git commit --amend -m "feat : pesan baru"  # ubah commit TERAKHIR (hanya jika belum di-push)
```

**`git push`**

```bash
git push -u origin feat/nama-feature      # push pertama + set upstream
git push                                  # push berikutnya
```

Dilarang `git push` langsung ke `main` dan dilarang `git push --force`.

**`git branch` / `git checkout` / `git switch`**

```bash
git branch                                # daftar branch lokal
git branch -a                             # termasuk remote
git checkout -b feat/nama-feature         # buat + pindah
git switch feat/nama-feature              # pindah branch
git branch -d feat/nama-feature           # hapus branch lokal (sudah merged)
```

**`git stash`** — menyimpan sementara perubahan yang belum di-commit.

```bash
git stash push -m "wip: komoditas form"   # simpan
git stash list                            # daftar stash
git stash pop                             # kembalikan stash terbaru & hapus dari daftar
git stash apply stash@{0}                 # kembalikan tanpa menghapus
git stash drop stash@{0}                  # hapus stash tertentu
```

**`git merge`** — hanya untuk membawa `main` ke branch kerja (bukan sebaliknya).

```bash
git checkout feat/komoditas-crud
git fetch origin
git merge origin/main
```

**Melihat riwayat & status**

```bash
git status
git log --oneline --graph --decorate -n 20
git diff                                  # perubahan belum di-stage
git diff --staged                         # perubahan yang sudah di-stage
```

**Membatalkan perubahan**

```bash
git restore <file>                        # buang perubahan di working directory
git restore --staged <file>               # batalkan stage
git revert <hash>                         # commit baru yang membatalkan commit lama (aman untuk yang sudah di-push)
git reset --soft HEAD~1                   # batalkan commit terakhir, perubahan tetap ter-stage
```

Hindari `git reset --hard` kecuali yakin perubahan lokal boleh hilang.

### 8.9 Menyelesaikan Konflik Merge

1. Jalankan `git merge origin/main`; Git menandai file yang konflik.
2. Buka file; cari penanda:

   ```
   <<<<<<< HEAD
   kode milikmu
   =======
   kode dari main
   >>>>>>> origin/main
   ```
3. Pilih/gabungkan kode yang benar, **hapus semua penanda** `<<<<<<<`, `=======`, `>>>>>>>`.
4. Jalankan ulang aplikasi/build untuk memastikan tidak rusak.
5. Selesaikan:

   ```bash
   git add <file-yang-konflik>
   git commit                              # pesan merge default boleh dipakai
   ```
6. Batalkan jika perlu: `git merge --abort`.

File yang sering konflik: `package-lock.json`, `composer.lock`, `routes/web.php`, `RepositoryServiceProvider.php`, dan file sidebar. Untuk file lock, ambil versi `main` lalu jalankan ulang `npm install` / `composer install`. Untuk `routes/web.php` dan `RepositoryServiceProvider.php`, **pertahankan kedua sisi** (route/binding milikmu dan milik teman).

### 8.10 Pull Request

- PR selalu dari branch kerja (`feat/...`, `fix/...`, dst.) ke `main`.
- Judul PR mengikuti format commit, contoh: `feat : tambah crud komoditas`.
- Deskripsi PR: apa yang dikerjakan, cara menguji, screenshot untuk perubahan UI, dan hal yang perlu diperhatikan reviewer.
- Sebelum membuat PR: checklist bagian 7 terpenuhi, `php artisan route:list` dan `npm run build` lolos, dan branch sudah membawa perubahan terbaru dari `main` (bagian 8.7).
- **Hanya Dimas yang boleh merge PR ke `main`.** Pembuat PR (selain Dimas) tidak boleh merge PR-nya sendiri.
- Setelah PR di-merge, hapus branch kerja lokal.

### 8.11 Aturan Emas Tim

1. Selalu mulai branch baru dari `main` yang terbaru.
2. Jangan bekerja atau push langsung ke `main`.
3. Jangan merge branch kerja ke `main`; semua lewat PR, merge hanya oleh Dimas.
4. Commit sering dengan pesan berformat `feat : ...` yang jelas.
5. Jangan commit file rahasia atau hasil generate.
6. Jangan `push --force`.
7. Ambil perubahan `main` secara berkala dengan stash/merge agar konflik tidak menumpuk.
8. Koordinasikan file bersama (route, provider, sidebar, lock file) dengan anggota lain.
9. Jangan mengubah file di luar scope tugas.

---

## 9. Panduan untuk `AGENTS.md` & Website Dokumentasi

### 9.1 Tujuan Website

Website dokumentasi (React / Next.js) menjelaskan PAGORA kepada anggota tim dan penguji: arsitektur, alur data, aturan kode, dan tutorial Git. Konten **bersumber dari dokumen ini**; jangan mengarang fitur atau detail yang tidak ada di sini.

### 9.2 Usulan Struktur Halaman

| Halaman | Isi (bagian dokumen ini) |
|---|---|
| Beranda | Ringkasan proyek (bagian 1) |
| Struktur Folder | Backend & frontend (bagian 2) |
| Arsitektur Backend | MVC + Service Repository, tanggung jawab layer, dependency (bagian 3) |
| Alur Data | Diagram alur request, tabel, error (bagian 4) |
| Frontend | Aturan React/Inertia, komponen reusable (bagian 5) |
| Standar Kode | PHP, React, keamanan (bagian 6) |
| Membuat Fitur Baru | Urutan kerja + checklist (bagian 7) |
| Panduan Git | Aturan tim, branch, commit, alur harian, stash/merge dari main, PR (bagian 8) |

### 9.3 Aturan Konten Dokumentasi

- Bahasa konten: Indonesia; istilah teknis, nama kode, dan nama file tetap Inggris.
- Setiap konsep disertai contoh kode atau diagram alur.
- Kode contoh memakai pola dari dokumen ini (modul `Komoditas`) dan diberi label jika hanya ilustrasi.
- Sediakan fitur salin kode (copy button), navigasi sidebar per bagian, dan pencarian bila memungkinkan.
- Diagram alur dibuat sebagai komponen/diagram (misalnya Mermaid atau SVG), bukan screenshot.
- Dokumen harus mudah dirawat: konten dipisah dari komponen (misalnya file MDX/Markdown per halaman).

### 9.4 Hal yang Perlu Dikonfirmasi Pemilik Proyek

- Versi pasti Laravel, React, Inertia, Tailwind, dan shadcn/ui yang dipakai.
- Isi aktual `ResponseHelper.php`, `HandleInertiaRequests::share()`, `KomoditasResource.php`, dan model/field `Komoditas` bila ingin contoh kode memakai kode asli, bukan ilustrasi.
- Daftar modul/fitur PAGORA selain `Komoditas`, `Auth`, `Vendor Registration`, dan `Dashboard`.
