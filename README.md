# Sistem Absensi Guru

Sistem absensi digital untuk guru yang memungkinkan pengelolaan kelas, mata pelajaran, dan pencatatan kehadiran siswa secara efisien.

## Fitur Utama

### 1. Autentikasi
- Login dengan username dan password
- Default credentials: `guru` / `guru123`

### 2. Manajemen Kelas
- Tambah dan hapus kelas
- Kelas khusus Teknik Informatika
- Pengaturan jumlah siswa per kelas

### 3. Manajemen Mata Pelajaran
- 13 mata pelajaran yang telah ditentukan
- Profil guru yang dapat disesuaikan per mapel
- Ikon dan warna khusus untuk setiap mapel

### 4. Absensi Siswa
- 4 status kehadiran: Hadir, Izin, Sakit, Alpha
- Sistem klik untuk mengubah status
- Keterangan khusus untuk status Izin dan Sakit
- Pencatatan waktu otomatis untuk status Hadir

### 5. Laporan dan Ekspor
- Riwayat absensi per mapel dan tanggal
- Ekspor data ke format PDF
- Statistik kehadiran
- Tanda tangan guru otomatis

### 6. Dashboard
- Ringkasan informasi kelas dan mapel
- Statistik jumlah siswa dan mata pelajaran
- Navigasi cepat ke fitur absensi


## Cara Penggunaan

1. **Login**
   - Buka `index.html` di browser
   - Masukkan username: `guru` dan password: `guru123`

2. **Pilih Kelas**
   - Pilih kelas yang akan diajar
   - Tambah kelas baru jika diperlukan

3. **Pilih Mata Pelajaran**
   - Pilih mapel yang akan diajar
   - Edit profil guru untuk mapel tersebut

4. **Input Absensi**
   - Klik status untuk mengubah (Alpha → Hadir → Izin → Sakit)
   - Tambah keterangan untuk status Izin/Sakit
   - Simpan data absensi

5. **Lihat Laporan**
   - Akses riwayat absensi
   - Ekspor data ke PDF

## Teknologi yang Digunakan

- **HTML5**: Struktur aplikasi
- **CSS3**: Styling dengan variabel CSS dan responsive design
- **Vanilla JavaScript**: Logika aplikasi
- **LocalStorage**: Penyimpanan data lokal
- **jsPDF & AutoTable**: Ekspor data ke PDF
- **Font Awesome**: Ikon

## Browser Support

Aplikasi ini kompatibel dengan browser modern:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Catatan Pengembangan

- Data disimpan secara lokal di browser
- Tidak memerlukan server backend
- Responsive design untuk mobile dan desktop
- Aksesibilitas keyboard yang baik

## Kontribusi

Untuk pengembangan lebih lanjut, silakan fork repository dan buat pull request.
