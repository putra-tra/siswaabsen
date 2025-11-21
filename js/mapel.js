// Mapel management functions
const Mapel = {
    // Fungsi untuk menampilkan halaman mapel
    showMapelPage() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('kelas-page').style.display = 'none';
        document.getElementById('mapel-page').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
        this.renderMapelList();
    },

    // Fungsi untuk render daftar mapel
    renderMapelList() {
        const mapelListElement = document.getElementById('mapel-list');
        mapelListElement.innerHTML = '';

        const selectedKelas = Utils.getSelectedKelas();

        // Tampilkan semua mapel yang tersedia
        Config.sampleData.mapelList.forEach((mapelName, index) => {
            const guruData = Utils.getGuruForMapel(mapelName);

            const mapelItem = document.createElement('div');
            mapelItem.className = 'mapel-item';
            mapelItem.style.borderTopColor = Utils.getMapelColor(mapelName);
            mapelItem.setAttribute('data-mapel-name', mapelName);
            mapelItem.innerHTML = `
            <div class="mapel-actions">
            <button class="edit-mapel-btn" onclick="modal.bukaModalEditMapel('${mapelName}')" title="Edit Profil Mapel">
            <i class="fas fa-edit"></i>
            </button>
            </div>
            <div class="mapel-icon">
            <i class="${Utils.getMapelIcon(mapelName)}"></i>
            </div>
            <h3 class="mapel-name">${mapelName}</h3>
            <p class="mapel-info">Kelas: ${selectedKelas.name}</p>
            <div class="mapel-guru-info">
            <i class="fas fa-chalkboard-teacher"></i> ${guruData.nama}
            </div>
            <div class="text-center mt-3">
            <span class="status-badge status-alpha">Klik untuk memilih</span>
            </div>
            `;

            mapelListElement.appendChild(mapelItem);
        });

        // Event listener untuk memilih mapel
        document.querySelectorAll('.mapel-item').forEach(item => {
            item.addEventListener('click', function() {
                const mapelName = this.getAttribute('data-mapel-name');
                Mapel.pilihMapel(mapelName);
            });
        });
    },

    // Fungsi untuk memilih mapel
    pilihMapel(mapelName) {
        Utils.saveSelectedMapel(mapelName);

        // Update profil guru berdasarkan mapel yang dipilih
        const guruData = Utils.getGuruForMapel(mapelName);
        Utils.saveGuruData({
            name: guruData.nama,
            avatar: guruData.inisial
        });

        App.showAppPage();
    },

    // Fungsi untuk menyimpan profil mapel
    simpanProfilMapel() {
        const mapelName = document.getElementById('edit-nama-mapel').value;
        const namaGuru = document.getElementById('edit-nama-guru').value;
        const inisialGuru = document.getElementById('edit-inisial-guru').value;

        if (!namaGuru || !inisialGuru) {
            alert('Harap isi semua field!');
            return;
        }

        const mapelGuruData = Utils.getMapelGuruData();
        mapelGuruData[mapelName] = {
            nama: namaGuru,
            inisial: inisialGuru
        };

        Utils.saveMapelGuruData(mapelGuruData);
        modal.closeMapelEditModal();

        // Render ulang daftar mapel untuk update tampilan
        this.renderMapelList();

        alert('Profil mapel berhasil disimpan!');
    }
};
