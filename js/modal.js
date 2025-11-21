// Modal management functions
const modal = {
    currentEditingMapel: null,
    currentEditingSiswa: null,

    // Fungsi untuk modal tambah kelas
    bukaModalTambahKelas() {
        document.getElementById('nama-kelas').value = '';
        document.getElementById('student-count').textContent = '30';
        document.getElementById('kelas-modal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('kelas-modal').style.display = 'none';
    },

    // Fungsi untuk modal tambah siswa
    bukaModalTambahSiswa(kelasId) {
        Kelas.currentKelasId = kelasId;
        document.getElementById('nis-siswa').value = '';
        document.getElementById('nama-siswa').value = '';
        document.getElementById('siswa-modal').style.display = 'flex';
    },

    closeSiswaModal() {
        document.getElementById('siswa-modal').style.display = 'none';
    },

    // Fungsi untuk modal edit mapel
    bukaModalEditMapel(mapelName) {
        const guruData = Utils.getGuruForMapel(mapelName);

        document.getElementById('edit-nama-mapel').value = mapelName;
        document.getElementById('edit-nama-guru').value = guruData.nama;
        document.getElementById('edit-inisial-guru').value = guruData.inisial;

        // Simpan mapel yang sedang diedit
        this.currentEditingMapel = mapelName;

        document.getElementById('mapel-edit-modal').style.display = 'flex';
    },

    closeMapelEditModal() {
        document.getElementById('mapel-edit-modal').style.display = 'none';
        this.currentEditingMapel = null;
    },

    // Fungsi untuk modal keterangan
    bukaModalKeterangan(siswaId, siswaName, currentStatus) {
        document.getElementById('keterangan-title').textContent = `Keterangan untuk ${siswaName}`;

        const statusDisplay = document.getElementById('keterangan-status-display');
        statusDisplay.textContent = Utils.getStatusText(currentStatus);
        statusDisplay.className = `status-badge ${Utils.getStatusClass(currentStatus)}`;

        document.getElementById('input-keterangan').value = '';

        // Simpan data siswa yang sedang diedit
        this.currentEditingSiswa = {
            id: siswaId,
            name: siswaName,
            status: currentStatus
        };

        document.getElementById('keterangan-modal').style.display = 'flex';
    },

    tutupModalKeterangan() {
        document.getElementById('keterangan-modal').style.display = 'none';
        this.currentEditingSiswa = null;
    },

    simpanKeterangan() {
        if (!this.currentEditingSiswa) return;

        const keterangan = document.getElementById('input-keterangan').value;

        // Update keterangan di tabel
        const rows = document.querySelectorAll('#siswa-list tr');
        rows.forEach(row => {
            const badge = row.querySelector('.status-badge');
            if (badge && parseInt(badge.getAttribute('data-siswa-id')) === this.currentEditingSiswa.id) {
                const keteranganCell = row.querySelector('td:nth-child(6)');
                // Hapus tombol edit yang lama
                const existingButton = keteranganCell.querySelector('button');
                if (existingButton) {
                    existingButton.remove();
                }

                // Tambahkan keterangan dan tombol edit baru
                keteranganCell.innerHTML = keterangan || '-';
                if (this.currentEditingSiswa.status !== 'hadir' && this.currentEditingSiswa.status !== 'alpha') {
                    const editButton = document.createElement('button');
                    editButton.className = 'btn btn-small btn-info mt-1';
                    editButton.innerHTML = '<i class="fas fa-edit"></i> Edit Keterangan';
                    editButton.onclick = () => this.bukaModalKeterangan(
                        this.currentEditingSiswa.id,
                        this.currentEditingSiswa.name,
                        this.currentEditingSiswa.status
                    );
                    keteranganCell.appendChild(editButton);
                }
            }
        });

        this.tutupModalKeterangan();
        alert('Keterangan berhasil disimpan!');
    }
};
