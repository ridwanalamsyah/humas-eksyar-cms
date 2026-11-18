# Panduan tim Humas Eksyar

Hal-hal yang tidak bisa dikerjakan lewat kode dan perlu dilakukan tim. Urutannya sesuai prioritas.

## 1. Sambungkan Instagram resmi (@eksyaruinsgd)

Bagian Instagram di beranda **hanya muncul kalau Instagram sudah tersambung**. Selama belum, bagian itu disembunyikan. Website tidak lagi menampilkan foto lain seolah-olah dari Instagram.

Jangan memakai scraping (mengambil foto dari halaman Instagram tanpa izin): melanggar ketentuan Instagram, sering diblokir, dan bisa membuat akun bermasalah. Pakai cara resmi:

1. Di aplikasi Instagram, ubah @eksyaruinsgd menjadi **akun profesional** (Kreator atau Bisnis).
2. Buka developers.facebook.com, buat aplikasi, lalu tambahkan produk **Instagram** dengan pilihan **API setup with Instagram login**.
3. Hubungkan akun @eksyaruinsgd, lalu buat **access token** (token jangka panjang, berlaku 60 hari).
4. Di dashboard Vercel → project website → Settings → Environment Variables, tambahkan `INSTAGRAM_ACCESS_TOKEN` berisi token tadi, lalu deploy ulang.

Setelah itu, kode memperpanjang token sendiri setiap 7 hari dan menyimpannya di database, jadi tidak perlu diulang.

## 2. Impor arsip Instagram lama (opsional)

Untuk memasukkan unggahan lama ke Pustaka Media CMS:

1. Unduh data dari akun sendiri (Instagram → Pengaturan → Pusat Akun → Unduh informasi Anda), atau unduh unggahan akun sendiri dengan instaloader.
2. Jalankan `pnpm import:instagram <folder-unduhan>` (tambahkan `--dry-run` untuk mencoba tanpa menyimpan). Butuh `DATABASE_URL` dan token Vercel Blob di `.env`.

## 3. Sesi foto satu hari

Semua foto website sekarang foto bersama di acara (orang berbaris di depan spanduk). Website butuh foto suasana. Daftar foto yang dibutuhkan:

- Mahasiswa di Galeri Investasi Syariah, dengan layar harga saham terlihat.
- Diskusi kelas: dosen dan mahasiswa, dari samping, bukan dari depan.
- Perpustakaan dan ruang baca.
- Gerbang dan gedung FEBI kampus 2 Cibiru, pagi hari.
- Dosen membimbing skripsi (dua orang, satu laptop).
- Kegiatan HMJ yang sedang berlangsung, bukan foto bersama setelahnya.
- Potret setiap dosen dengan latar dan cahaya yang sama, untuk direktori dosen.

Aturannya: cahaya alami, posisi foto mendatar (landscape) untuk hero dan berita, tidak berpose berbaris, minimal 2000 piksel lebar.

## 4. Ganti foto hero dan simpan foto di Pustaka Media

- Foto hero diatur di CMS: **Isi website → Identitas → foto hero**. Pilih foto mendatar; teks ada di kiri bawah, jadi bagian kanan foto sebaiknya berisi wajah atau kegiatan.
- Unggah semua foto ke **Media** di CMS (disimpan di Vercel Blob), lalu pakai dari sana. Jangan menempel tautan foto dari situs lain (misalnya uinsgd.ac.id): kalau situs itu berubah, foto di website ikut hilang.
- Satu foto, satu tempat: jangan pakai foto yang sama di hero, kegiatan, dan galeri.
- Jangan pakai screenshot (Zoom, poster, tangkapan layar berita) sebagai foto kegiatan.

## 5. Satu alamat website

Sekarang ada dua alamat: `humas-eksyar-cms.vercel.app` (dijeda) dan `eksyar-cms.vercel.app`. Di Vercel, pilih satu sebagai alamat utama dan alihkan yang lain ke sana (Settings → Domains → Redirect). Kalau bisa, minta subdomain resmi dari UIN SGD (misalnya `eksyar.uinsgd.ac.id`).

## 6. Aturan menulis

- **Judul** maksimal 8 kata dan menyebut bendanya: "Studium Generale Wakaf Produktif 12 November", bukan "Kegiatan Inspiratif Bersama Narasumber Hebat".
- **Ringkasan** maksimal 20 kata, satu kalimat.
- **Setiap berita wajib punya satu foto bagus.** Foto bersama boleh, tapi tambahkan satu foto suasana acara.
- Tulis dalam bahasa Indonesia baku tanpa singkatan yang tidak umum.
- Jangan menulis kata "malware" atau hal teknis keamanan di halaman publik.

## 7. Jadwal rutin

- **Setiap Senin:** isi Agenda minggu ini di CMS (muncul di beranda bagian Kabar).
- **Minimal satu berita per minggu.** Dashboard memberi peringatan kalau sudah lebih dari 14 hari tanpa berita.
- **Setiap akhir semester:** pilih 20 foto terbaik semester itu, unggah ke Media dengan label nama kegiatan dan semester (misalnya `ganjil-2026`). Itu jadi bank foto untuk website dan Instagram.
