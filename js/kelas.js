// Kelas management functions
const Kelas = {
    currentKelasId: null,

    // Fungsi untuk menampilkan halaman kelas
    showKelasPage() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('kelas-page').style.display = 'flex';
        document.getElementById('mapel-page').style.display = 'none';
        document.getElementById('app-container').style.display = 'none';
        this.renderKelasList();
    },

    // Fungsi untuk render daftar kelas
    renderKelasList() {
        const kelasListElement = document.getElementById('kelas-list');
        kelasListElement.innerHTML = '';

        const kelasData = Utils.getKelasData();

        // Tampilkan kelas yang tersedia
        kelasData.forEach(kelas => {
            const kelasItem = document.createElement('div');
            kelasItem.className = 'kelas-item';
            kelasItem.setAttribute('data-kelas-id', kelas.id);
            kelasItem.innerHTML = `
            <div class="kelas-actions">
            <button class="action-icon add-siswa" data-kelas-id="${kelas.id}" title="Tambah Siswa">
            <i class="fas fa-user-plus"></i>
            </button>
            <button class="action-icon delete-kelas" data-kelas-id="${kelas.id}" title="Hapus Kelas">
            <i class="fas fa-trash"></i>
            </button>
            </div>
            <div class="kelas-icon">
            <i class="fas fa-chalkboard"></i>
            </div>
            <h3 class="kelas-name">${kelas.name}</h3>
            <p class="kelas-info">Teknik Informatika</p>
            <p class="kelas-info">${kelas.jumlahSiswa} Siswa</p>
            <div class="text-center mt-3">
            <span class="status-badge status-alpha">Klik untuk memilih</span>
            </div>
            `;

            kelasListElement.appendChild(kelasItem);
        });

        // Tambahkan card untuk menambah kelas baru
        const addKelasCard = document.createElement('div');
        addKelasCard.className = 'add-card';
        addKelasCard.innerHTML = `
        <div class="add-icon">
        <i class="fas fa-plus-circle"></i>
        </div>
        <div class="add-text">Tambah Kelas Baru</div>
        `;
        addKelasCard.addEventListener('click', modal.bukaModalTambahKelas);
        kelasListElement.appendChild(addKelasCard);

        // Event listener untuk memilih kelas
        this.attachKelasEventListeners();
    },

    // Fungsi untuk menambahkan event listener ke kelas
    attachKelasEventListeners() {
        document.querySelectorAll('.kelas-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.closest('.kelas-actions')) {
                    const kelasId = parseInt(this.getAttribute('data-kelas-id'));
                    Kelas.pilihKelas(kelasId);
                }
            });
        });

        // Event listener untuk tombol tambah siswa
        document.querySelectorAll('.add-siswa').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const kelasId = parseInt(this.getAttribute('data-kelas-id'));
                modal.bukaModalTambahSiswa(kelasId);
            });
        });

        // Event listener untuk tombol hapus kelas
        document.querySelectorAll('.delete-kelas').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const kelasId = parseInt(this.getAttribute('data-kelas-id'));
                Kelas.hapusKelas(kelasId);
            });
        });
    },

    // Fungsi untuk memilih kelas
    pilihKelas(kelasId) {
        const kelasData = Utils.getKelasData();
        const kelas = kelasData.find(k => k.id === kelasId);

        if (kelas) {
            Utils.saveSelectedKelas(kelas);
            Mapel.showMapelPage();
        }
    },

    // Fungsi untuk menyimpan kelas
    simpanKelas() {
        const namaKelas = document.getElementById('nama-kelas').value;
        const jumlahSiswa = parseInt(document.getElementById('student-count').textContent);

        if (!namaKelas) {
            alert('Harap isi nama kelas!');
            return;
        }

        const kelasData = Utils.getKelasData();
        const newId = kelasData.length > 0 ? Math.max(...kelasData.map(k => k.id)) + 1 : 1;

        kelasData.push({
            id: newId,
            name: namaKelas,
            jurusan: "Teknik Informatika",
            jumlahSiswa: jumlahSiswa
        });

        Utils.saveKelasData(kelasData);
        modal.closeModal();
        this.renderKelasList();
        alert('Kelas berhasil ditambahkan!');
    },

    // Fungsi untuk menghapus kelas
    hapusKelas(kelasId) {
        const kelasData = Utils.getKelasData();
        const kelas = kelasData.find(k => k.id === kelasId);

        if (kelas && confirm(`Apakah Anda yakin ingin menghapus kelas ${kelas.name}?`)) {
            // Hapus kelas
            const updatedKelasData = kelasData.filter(k => k.id !== kelasId);
            Utils.saveKelasData(updatedKelasData);

            // Hapus siswa di kelas tersebut
            const siswaData = Utils.getSiswaData();
            const updatedSiswaData = siswaData.filter(s => s.kelasId !== kelasId);
            Utils.saveSiswaData(updatedSiswaData);

            // Hapus riwayat absensi untuk kelas ini
            const allRiwayat = Utils.getStorage('riwayatAbsensi', {});
            delete allRiwayat[kelasId];
            Utils.setStorage('riwayatAbsensi', allRiwayat);

            // Hapus data absensi untuk kelas ini
            const absensiData = Utils.getAbsensiData();
            Object.keys(absensiData).forEach(key => {
                if (key.startsWith(`${kelasId}-`)) {
                    delete absensiData[key];
                }
            });
            Utils.saveAbsensiData(absensiData);

            // Jika kelas yang dihapus sedang dipilih, reset pilihan
            const selectedKelas = Utils.getSelectedKelas();
            if (selectedKelas && selectedKelas.id === kelasId) {
                Utils.saveSelectedKelas(null);
                Utils.saveSelectedMapel(null);
            }

            this.renderKelasList();
            alert(`Kelas ${kelas.name} berhasil dihapus!`);
        }
    },

    // Fungsi untuk menyimpan siswa
    simpanSiswa() {
        const nis = document.getElementById('nis-siswa').value;
        const nama = document.getElementById('nama-siswa').value;

        if (!nis || !nama) {
            alert('Harap isi semua field!');
            return;
        }

        const siswaData = Utils.getSiswaData();
        const newId = siswaData.length > 0 ? Math.max(...siswaData.map(s => s.id)) + 1 : 1;

        siswaData.push({
            id: newId,
            nis: nis,
            name: nama,
            kelasId: this.currentKelasId
        });

        Utils.saveSiswaData(siswaData);
        modal.closeSiswaModal();
        alert('Siswa berhasil ditambahkan!');

        // Update jumlah siswa di kelas
        const kelasData = Utils.getKelasData();
        const kelasIndex = kelasData.findIndex(k => k.id === this.currentKelasId);
        if (kelasIndex !== -1) {
            const siswaDiKelas = siswaData.filter(s => s.kelasId === this.currentKelasId);
            kelasData[kelasIndex].jumlahSiswa = siswaDiKelas.length;
            Utils.saveKelasData(kelasData);
            this.renderKelasList();
        }
    }
};
