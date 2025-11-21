// Main application functions
const App = {
    // Fungsi untuk inisialisasi aplikasi
    init() {
        this.initAppData();
        Utils.updateDateTime();
        setInterval(Utils.updateDateTime, 1000);

        Auth.initLogin();
        this.initEventListeners();
        Auth.showLoginPage();
    },

    // Fungsi untuk inisialisasi data aplikasi
    initAppData() {
        // Inisialisasi data guru jika belum ada
        if (!Utils.getStorage('guruData')) {
            Utils.saveGuruData({
                name: "Bu Sari, S.Pd",
                avatar: "S"
            });
        }

        // Inisialisasi data kelas jika belum ada
        if (!Utils.getStorage('kelasData')) {
            Utils.saveKelasData([]);
        }

        // Inisialisasi data siswa jika belum ada
        if (!Utils.getStorage('siswaData')) {
            Utils.saveSiswaData([]);
        }

        // Inisialisasi data absensi jika belum ada
        if (!Utils.getStorage('absensiData')) {
            Utils.saveAbsensiData({});
        }

        // Inisialisasi data riwayat jika belum ada
        if (!Utils.getStorage('riwayatAbsensi')) {
            Utils.setStorage('riwayatAbsensi', {});
        }

        // Inisialisasi pilihan user
        if (!Utils.getStorage('selectedKelas')) {
            Utils.saveSelectedKelas(null);
        }

        if (!Utils.getStorage('selectedMapel')) {
            Utils.saveSelectedMapel(null);
        }

        // Inisialisasi data mapel guru
        Utils.initMapelGuruData();
    },

    // Fungsi untuk menampilkan halaman app
    showAppPage() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('kelas-page').style.display = 'none';
        document.getElementById('mapel-page').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        this.updateDashboard();
    },

    // Fungsi untuk update dashboard
    updateDashboard() {
        const selectedKelas = Utils.getSelectedKelas();
        const selectedMapel = Utils.getSelectedMapel();
        const guruData = Utils.getGuruData();

        // Update header
        document.getElementById('user-name').textContent = guruData.name;
        document.getElementById('user-avatar').textContent = guruData.avatar;
        document.getElementById('kelas-info-header').textContent = `Kelas: ${selectedKelas.name}`;
        document.getElementById('mapel-info-header').textContent = `Mapel: ${selectedMapel}`;

        // Update dashboard info
        document.getElementById('info-kelas-mapel').textContent = `Kelas: ${selectedKelas.name} | Mapel: ${selectedMapel}`;

        const siswaData = Utils.getSiswaData();
        const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);
        document.getElementById('info-jumlah-siswa').textContent = `Jumlah Siswa: ${siswaDiKelas.length}`;
        document.getElementById('total-siswa').textContent = siswaDiKelas.length;

        // Tampilkan nama mapel, bukan angka 1
        document.getElementById('total-mapel').textContent = selectedMapel;
    },

    // Fungsi untuk navigasi halaman
    showPage(pageName) {
        document.querySelectorAll('.content > div').forEach(page => {
            page.classList.add('d-none');
        });

        document.getElementById(`${pageName}-page`).classList.remove('d-none');

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[data-page="${pageName}"]`).classList.add('active');

        if (pageName === 'absensi') {
            Absensi.renderAbsensiPage();
        } else if (pageName === 'laporan') {
            Laporan.renderLaporanPage();
        }
    },

    // Fungsi untuk inisialisasi event listener
    initEventListeners() {
        // Event listener untuk navigasi
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const pageName = this.getAttribute('data-page');
                App.showPage(pageName);
            });
        });

        // Event listener untuk simpan kelas
        document.getElementById('simpan-kelas').addEventListener('click', () => Kelas.simpanKelas());

        // Event listener untuk simpan siswa
        document.getElementById('simpan-siswa').addEventListener('click', () => Kelas.simpanSiswa());

        // Event listener untuk counter siswa
        document.getElementById('increase-students').addEventListener('click', function() {
            const currentCount = parseInt(document.getElementById('student-count').textContent);
            document.getElementById('student-count').textContent = currentCount + 1;
        });

        document.getElementById('decrease-students').addEventListener('click', function() {
            const currentCount = parseInt(document.getElementById('student-count').textContent);
            if (currentCount > 1) {
                document.getElementById('student-count').textContent = currentCount - 1;
            }
        });

        // Event listener untuk simpan absensi
        document.getElementById('simpan-semua-btn').addEventListener('click', () => Absensi.simpanSemuaAbsensi());

        // Event listener untuk ekspor PDF di halaman absensi
        document.getElementById('export-pdf-btn').addEventListener('click', () => Laporan.exportPDF());

        // Event listener untuk ekspor semua PDF di halaman laporan
        document.getElementById('export-all-pdf-btn').addEventListener('click', () => Laporan.exportAllPDF());

        // Event listener untuk simpan profil mapel
        document.getElementById('simpan-profil-mapel').addEventListener('click', () => Mapel.simpanProfilMapel());

        // Event listener untuk simpan keterangan
        document.getElementById('simpan-keterangan').addEventListener('click', () => modal.simpanKeterangan());
    }
};

// Inisialisasi aplikasi ketika DOM siap
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
