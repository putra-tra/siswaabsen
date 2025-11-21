// Absensi management functions
const Absensi = {
    // Fungsi untuk render halaman absensi
    renderAbsensiPage() {
        const selectedKelas = Utils.getSelectedKelas();
        const selectedMapel = Utils.getSelectedMapel();
        const siswaData = Utils.getSiswaData();
        const absensiData = Utils.getAbsensiData();

        document.getElementById('absensi-mapel-name').textContent = `Absensi - ${selectedMapel}`;

        const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);
        document.getElementById('absensi-total-siswa').textContent = siswaDiKelas.length;

        const today = new Date().toISOString().split('T')[0];
        const key = `${selectedKelas.id}-${selectedMapel}-${today}`;
        const todayAbsensi = absensiData[key] || { siswa: [] };

        let hadirCount = 0;
        const siswaListElement = document.getElementById('siswa-list');
        siswaListElement.innerHTML = '';

        siswaDiKelas.forEach((siswa, index) => {
            const absensiSiswa = todayAbsensi.siswa.find(s => s.siswaId === siswa.id) || {
                status: 'alpha',
                waktu: null,
                keterangan: ''
            };

            if (absensiSiswa.status === 'hadir') hadirCount++;

            const statusText = Utils.getStatusText(absensiSiswa.status);
            const statusClass = Utils.getStatusClass(absensiSiswa.status);
            const waktuText = absensiSiswa.waktu ?
            new Date(absensiSiswa.waktu).toLocaleTimeString('id-ID') : '-';

            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${siswa.nis}</td>
            <td>${siswa.name}</td>
            <td>
            <span class="status-badge ${statusClass}" data-siswa-id="${siswa.id}" data-status="${absensiSiswa.status}">
            ${statusText}
            </span>
            </td>
            <td>${waktuText}</td>
            <td>
            ${absensiSiswa.keterangan || '-'}
            ${absensiSiswa.status !== 'hadir' && absensiSiswa.status !== 'alpha' ?
                `<button class="btn btn-small btn-info mt-1" onclick="modal.bukaModalKeterangan(${siswa.id}, '${siswa.name}', '${absensiSiswa.status}')">
                <i class="fas fa-edit"></i> Edit Keterangan
                </button>` : ''
            }
            </td>
            `;

            siswaListElement.appendChild(row);
        });

        document.getElementById('absensi-hadir').textContent = hadirCount;

        // Event listener untuk status badge
        this.attachStatusEventListeners();
    },

    // Fungsi untuk menambahkan event listener ke status badge
    attachStatusEventListeners() {
        document.querySelectorAll('.status-badge').forEach(badge => {
            badge.addEventListener('click', function() {
                const siswaId = parseInt(this.getAttribute('data-siswa-id'));
                const currentStatus = this.getAttribute('data-status');
                const nextStatus = Utils.getNextStatus(currentStatus);

                this.setAttribute('data-status', nextStatus);
                this.textContent = Utils.getStatusText(nextStatus);
                this.className = `status-badge ${Utils.getStatusClass(nextStatus)}`;

                // Update waktu jika status menjadi hadir
                const row = this.closest('tr');
                const waktuCell = row.querySelector('td:nth-child(5)');
                const keteranganCell = row.querySelector('td:nth-child(6)');

                if (nextStatus === 'hadir') {
                    waktuCell.textContent = new Date().toLocaleTimeString('id-ID');
                    // Hapus tombol edit keterangan jika status menjadi hadir
                    keteranganCell.innerHTML = '-';
                } else {
                    waktuCell.textContent = '-';
                    // Tambah tombol edit keterangan untuk status izin/sakit
                    if (nextStatus !== 'alpha') {
                        const siswaName = row.querySelector('td:nth-child(3)').textContent;
                        keteranganCell.innerHTML = `-
                        <button class="btn btn-small btn-info mt-1" onclick="modal.bukaModalKeterangan(${siswaId}, '${siswaName}', '${nextStatus}')">
                        <i class="fas fa-edit"></i> Edit Keterangan
                        </button>`;
                    } else {
                        keteranganCell.innerHTML = '-';
                    }
                }

                this.updateHadirCounter();
            });
        });
    },

    // Fungsi untuk update counter hadir
    updateHadirCounter() {
        const badges = document.querySelectorAll('.status-badge');
        let hadirCount = 0;

        badges.forEach(badge => {
            if (badge.getAttribute('data-status') === 'hadir') {
                hadirCount++;
            }
        });

        document.getElementById('absensi-hadir').textContent = hadirCount;
    },

    // Fungsi untuk menyimpan semua absensi
    simpanSemuaAbsensi() {
        const selectedKelas = Utils.getSelectedKelas();
        const selectedMapel = Utils.getSelectedMapel();
        const today = new Date().toISOString().split('T')[0];
        const key = `${selectedKelas.id}-${selectedMapel}-${today}`;

        const absensiData = Utils.getAbsensiData();
        const siswaData = Utils.getSiswaData();
        const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);

        const absensiHariIni = {
            tanggal: today,
            siswa: []
        };

        const rows = document.querySelectorAll('#siswa-list tr');
        rows.forEach(row => {
            const siswaId = parseInt(row.querySelector('.status-badge').getAttribute('data-siswa-id'));
            const status = row.querySelector('.status-badge').getAttribute('data-status');
            const waktuCell = row.querySelector('td:nth-child(5)').textContent;
            const waktu = status === 'hadir' && waktuCell !== '-' ? new Date().toISOString() : null;

            // Ambil keterangan dari sel ke-6 (hilangkan tombol jika ada)
            let keterangan = row.querySelector('td:nth-child(6)').textContent.trim();
            // Hilangkan teks "Edit Keterangan" jika ada
            keterangan = keterangan.replace('Edit Keterangan', '').trim();
            // Jika hanya ada "-", kosongkan
            if (keterangan === '-') keterangan = '';

            absensiHariIni.siswa.push({
                siswaId: siswaId,
                status: status,
                waktu: waktu,
                keterangan: keterangan
            });
        });

        absensiData[key] = absensiHariIni;
        Utils.saveAbsensiData(absensiData);

        // Tambahkan ke riwayat
        const riwayat = Utils.getRiwayatAbsensi();
        const hadirCount = absensiHariIni.siswa.filter(s => s.status === 'hadir').length;
        const tidakHadirCount = absensiHariIni.siswa.length - hadirCount;

        // Gunakan timestamp unik untuk setiap entri riwayat
        const timestamp = new Date().getTime();

        // Cek apakah sudah ada entri untuk hari ini
        const existingTodayIndex = riwayat.findIndex(r =>
        r.kelasId === selectedKelas.id &&
        r.mapel === selectedMapel &&
        r.tanggal === today
        );

        if (existingTodayIndex !== -1) {
            // Jika sudah ada, tambahkan sebagai entri baru dengan timestamp berbeda
            riwayat.push({
                id: timestamp, // ID unik berdasarkan timestamp
                kelasId: selectedKelas.id,
                kelasName: selectedKelas.name,
                mapel: selectedMapel,
                tanggal: today,
                waktuSimpan: new Date().toLocaleTimeString('id-ID'),
                         jumlahSiswa: absensiHariIni.siswa.length,
                         hadir: hadirCount,
                         tidakHadir: tidakHadirCount
            });
        } else {
            // Jika belum ada, buat entri baru
            riwayat.push({
                id: timestamp,
                kelasId: selectedKelas.id,
                kelasName: selectedKelas.name,
                mapel: selectedMapel,
                tanggal: today,
                waktuSimpan: new Date().toLocaleTimeString('id-ID'),
                         jumlahSiswa: absensiHariIni.siswa.length,
                         hadir: hadirCount,
                         tidakHadir: tidakHadirCount
            });
        }

        Utils.saveRiwayatAbsensi(riwayat);

        alert('Data absensi berhasil disimpan!');
    }
};
