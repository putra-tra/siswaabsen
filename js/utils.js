// Utility functions
const Utils = {
    // Fungsi untuk mendapatkan data dari localStorage
    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error parsing ${key} from localStorage:`, error);
            return defaultValue;
        }
    },

    // Fungsi untuk menyimpan data ke localStorage
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            return false;
        }
    },

    // Fungsi untuk mendapatkan data kelas
    getKelasData() {
        return this.getStorage('kelasData', []);
    },

    // Fungsi untuk menyimpan data kelas
    saveKelasData(data) {
        return this.setStorage('kelasData', data);
    },

    // Fungsi untuk mendapatkan data siswa
    getSiswaData() {
        return this.getStorage('siswaData', []);
    },

    // Fungsi untuk menyimpan data siswa
    saveSiswaData(data) {
        return this.setStorage('siswaData', data);
    },

    // Fungsi untuk mendapatkan data absensi
    getAbsensiData() {
        return this.getStorage('absensiData', {});
    },

    // Fungsi untuk menyimpan data absensi
    saveAbsensiData(data) {
        return this.setStorage('absensiData', data);
    },

    // Fungsi untuk mendapatkan data guru
    getGuruData() {
        return this.getStorage('guruData', {});
    },

    // Fungsi untuk menyimpan data guru
    saveGuruData(data) {
        return this.setStorage('guruData', data);
    },

    // Fungsi untuk mendapatkan kelas yang dipilih
    getSelectedKelas() {
        return this.getStorage('selectedKelas', null);
    },

    // Fungsi untuk menyimpan kelas yang dipilih
    saveSelectedKelas(data) {
        return this.setStorage('selectedKelas', data);
    },

    // Fungsi untuk mendapatkan mapel yang dipilih
    getSelectedMapel() {
        return this.getStorage('selectedMapel', null);
    },

    // Fungsi untuk menyimpan mapel yang dipilih
    saveSelectedMapel(data) {
        return this.setStorage('selectedMapel', data);
    },

    // Fungsi untuk mendapatkan riwayat absensi
    getRiwayatAbsensi() {
        const selectedKelas = this.getSelectedKelas();
        if (!selectedKelas) return [];

        const allRiwayat = this.getStorage('riwayatAbsensi', {});
        return allRiwayat[selectedKelas.id] || [];
    },

    // Fungsi untuk menyimpan riwayat absensi
    saveRiwayatAbsensi(data) {
        const selectedKelas = this.getSelectedKelas();
        if (!selectedKelas) return false;

        const allRiwayat = this.getStorage('riwayatAbsensi', {});
        allRiwayat[selectedKelas.id] = data;
        return this.setStorage('riwayatAbsensi', allRiwayat);
    },

    // Fungsi untuk mendapatkan data guru per mapel
    getMapelGuruData() {
        return this.getStorage('mapelGuruData', {});
    },

    // Fungsi untuk menyimpan data guru per mapel
    saveMapelGuruData(data) {
        return this.setStorage('mapelGuruData', data);
    },

    // Fungsi untuk mendapatkan profil guru untuk mapel tertentu
    getGuruForMapel(mapelName) {
        const mapelGuruData = this.getMapelGuruData();
        return mapelGuruData[mapelName] || { nama: 'Guru Mapel', inisial: 'GM' };
    },

    // Fungsi untuk inisialisasi data mapel guru
    initMapelGuruData() {
        if (!this.getStorage('mapelGuruData')) {
            const defaultGuruData = {
                'PIPAS': { nama: 'Guru PIPAS', inisial: 'GP' },
                'Bahasa Indonesia': { nama: 'Guru Bahasa Indonesia', inisial: 'BI' },
                'Agama': { nama: 'Guru Agama', inisial: 'GA' },
                'Mapel Produktif': { nama: 'Guru Produktif', inisial: 'GP' },
                'Informatika': { nama: 'Guru Informatika', inisial: 'GI' },
                'BK': { nama: 'Guru BK', inisial: 'GB' },
                'Sejarah': { nama: 'Guru Sejarah', inisial: 'GS' },
                'Matematika': { nama: 'Guru Matematika', inisial: 'GM' },
                'PPKN': { nama: 'Guru PPKN', inisial: 'GP' },
                'Seni': { nama: 'Guru Seni', inisial: 'GS' },
                'Olahraga': { nama: 'Guru Olahraga', inisial: 'GO' },
                'Bahasa Daerah': { nama: 'Guru Bahasa Daerah', inisial: 'BD' },
                'Bahasa Inggris': { nama: 'Guru Bahasa Inggris', inisial: 'GI' }
            };
            this.saveMapelGuruData(defaultGuruData);
        }
    },

    // Fungsi untuk mendapatkan ikon mapel
    getMapelIcon(mapelName) {
        return Config.mapelIcons[mapelName] || 'fas fa-book';
    },

    // Fungsi untuk mendapatkan warna mapel
    getMapelColor(mapelName) {
        return Config.mapelColors[mapelName] || '#d4a762';
    },

    // Fungsi untuk mendapatkan teks status
    getStatusText(status) {
        return Config.statusText[status] || 'Alpha';
    },

    // Fungsi untuk mendapatkan class status
    getStatusClass(status) {
        return Config.statusClass[status] || 'status-alpha';
    },

    // Fungsi untuk mendapatkan status berikutnya
    getNextStatus(currentStatus) {
        const currentIndex = Config.statusOrder.indexOf(currentStatus);
        return Config.statusOrder[(currentIndex + 1) % Config.statusOrder.length];
    },

    // Fungsi untuk update waktu
    updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('id-ID', options);
        const timeString = now.toLocaleTimeString('id-ID');

        const currentDateTimeElement = document.getElementById('current-date-time');
        const absensiDateElement = document.getElementById('absensi-date');
        const absensiTimeElement = document.getElementById('absensi-time');

        if (currentDateTimeElement) {
            currentDateTimeElement.textContent = `${dateString} - ${timeString}`;
        }
        if (absensiDateElement) {
            absensiDateElement.textContent = now.toLocaleDateString('id-ID');
        }
        if (absensiTimeElement) {
            absensiTimeElement.textContent = timeString;
        }
    }
};
