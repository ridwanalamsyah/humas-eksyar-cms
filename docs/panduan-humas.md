# Panduan tim Humas Eksyar

Hal-hal yang tidak bisa dikerjakan lewat kode dan perlu dilakukan tim. Urutannya sesuai prioritas.

## 0. Wajib sebelum menggabungkan pembaruan keamanan login

Login email CMS sekarang memakai **kata sandi tim**, dan kunci sesi tidak lagi memakai nilai cadangan yang tertulis di kode (repo ini publik). Isi dua variabel ini di Vercel → project → Settings → Environment Variables (Production), lalu deploy ulang:

| Nama | Isi |
|---|---|
| `AUTH_SECRET` | Teks acak panjang. Buat dengan perintah `openssl rand -base64 32`, atau pakai generator kata sandi minimal 32 karakter. |
| `CMS_LOGIN_PASSWORD` | Kata sandi tim untuk login email. Bagikan hanya ke pengurus Humas, jangan di grup publik. |

Tanpa `CMS_LOGIN_PASSWORD`, login email dimatikan dan hanya login Google yang bisa dipakai. Tanpa `AUTH_SECRET`, login tetap aman, tapi pengguna bisa sering keluar sendiri.

## Aktifkan Vercel Analytics

Kodenya sudah terpasang. Di Vercel → project website → tab **Analytics** → tekan **Enable**. Setelah deploy berikutnya, jumlah kunjungan per halaman muncul di tab itu.

## 1. Sambungkan Instagram resmi (@eksyaruinsgd)

Bagian Instagram di beranda **hanya muncul kalau Instagram sudah tersambung**. Selama belum, bagian itu disembunyikan. Website tidak lagi menampilkan foto lain seolah-olah dari Instagram.

Jangan memakai scraping (mengambil foto dari halaman Instagram tanpa izin): melanggar ketentuan Instagram, sering diblokir, dan bisa membuat akun bermasalah. Pakai cara resmi:

1. Di aplikasi Instagram, ubah @eksyaruinsgd menjadi **akun profesional** (Kreator atau Bisnis): Pengaturan → Jenis akun dan alat → Beralih ke akun profesional.
2. Buka developers.facebook.com (masuk dengan akun Facebook pengelola), tekan **Buat aplikasi**, pilih jenis **Bisnis**, lalu tambahkan produk **Instagram** dengan pilihan **API setup with Instagram login**.
3. Di bagian **Generate access tokens**, tambahkan akun @eksyaruinsgd, izinkan aksesnya, lalu tekan **Generate token**.
4. Masuk CMS sebagai admin → **Pengaturan → Instagram** → tempel token di kotak **Sambungkan Instagram resmi** → tekan **Sambungkan**. Sistem mengecek token ke Instagram dan menampilkan nama akunnya kalau berhasil.

Setelah itu, kode memperpanjang token sendiri setiap 7 hari, jadi tidak perlu diulang. (Cara lama lewat variabel `INSTAGRAM_ACCESS_TOKEN` di Vercel tetap bisa dipakai.)

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

## 5. Pindah ke domain resmi es.uinsgd.ac.id

Kode website sudah siap memakai **es.uinsgd.ac.id**. Langkah yang perlu dilakukan:

1. **Vercel → project website → Settings → Domains → Add**, ketik `es.uinsgd.ac.id`. Vercel menampilkan satu rekaman DNS (biasanya `CNAME es → cname.vercel-dns.com`, atau sebuah alamat IP untuk rekaman `A`).
2. **Kirim rekaman DNS itu ke Pusat TIK/PTIPD UIN SGD** dan minta dipasang di DNS `uinsgd.ac.id`. Tunggu sampai di Vercel statusnya **Valid Configuration** (sertifikat HTTPS dibuat otomatis).
3. Di Vercel, jadikan `es.uinsgd.ac.id` sebagai domain utama, lalu alihkan `eksyar-cms.vercel.app` ke sana (Domains → Edit → Redirect to `es.uinsgd.ac.id`, 308).
4. **Settings → Environment Variables (Production)**, tambahkan `NEXT_PUBLIC_SITE_URL` = `https://es.uinsgd.ac.id`, lalu **Redeploy**. Ini dipakai untuk pratinjau tautan di WhatsApp/Instagram, sitemap Google, dan tautan di email notifikasi.
5. **Login Google CMS:** di Google Cloud Console → APIs & Services → Credentials → OAuth client yang dipakai CMS, tambahkan:
   - Authorized JavaScript origins: `https://es.uinsgd.ac.id`
   - Authorized redirect URIs: `https://es.uinsgd.ac.id/api/auth/callback/google`
6. Daftarkan `https://es.uinsgd.ac.id` di Google Search Console dan kirim `https://es.uinsgd.ac.id/sitemap.xml`.

Selama langkah 1–4 belum selesai, website tetap berjalan di `eksyar-cms.vercel.app`.

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
