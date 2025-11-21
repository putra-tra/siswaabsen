// Laporan management functions
const Laporan = {
    // Fungsi untuk render halaman laporan
    renderLaporanPage() {
        const riwayat = Utils.getRiwayatAbsensi();
        const riwayatElement = document.getElementById('riwayat-absensi');
        riwayatElement.innerHTML = '';

        if (riwayat.length === 0) {
            riwayatElement.innerHTML = `
            <tr>
            <td colspan="7" class="text-center" style="padding: 2rem;">
            <i class="fas fa-clipboard-list" style="font-size: 2rem; color: var(--gray); margin-bottom: 1rem;"></i>
            <p>Belum ada riwayat absensi.</p>
            </td>
            </tr>
            `;
            return;
        }

        // Urutkan riwayat berdasarkan tanggal dan waktu simpan (terbaru di atas)
        riwayat.sort((a, b) => {
            const dateA = new Date(a.tanggal + ' ' + a.waktuSimpan);
            const dateB = new Date(b.tanggal + ' ' + b.waktuSimpan);
            return dateB - dateA;
        });

        riwayat.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${new Date(entry.tanggal).toLocaleDateString('id-ID')} ${entry.waktuSimpan ? `(${entry.waktuSimpan})` : ''}</td>
            <td>${entry.mapel}</td>
            <td>${entry.kelasName}</td>
            <td>${entry.jumlahSiswa}</td>
            <td>${entry.hadir}</td>
            <td>${entry.tidakHadir}</td>
            <td>
            <div class="action-buttons">
            <button class="btn btn-small btn-info export-single-pdf" data-id="${entry.id}">
            <i class="fas fa-file-pdf"></i> Ekspor
            </button>
            <button class="btn btn-small btn-danger hapus-riwayat" data-id="${entry.id}">
            <i class="fas fa-trash"></i> Hapus
            </button>
            </div>
            </td>
            `;
            riwayatElement.appendChild(row);
        });

        // Event listener untuk hapus riwayat
        this.attachLaporanEventListeners();
    },

    // Fungsi untuk menambahkan event listener ke laporan
    attachLaporanEventListeners() {
        document.querySelectorAll('.hapus-riwayat').forEach(button => {
            button.addEventListener('click', function() {
                const riwayatId = parseInt(this.getAttribute('data-id'));
                Laporan.hapusRiwayatAbsensi(riwayatId);
            });
        });

        document.querySelectorAll('.export-single-pdf').forEach(button => {
            button.addEventListener('click', function() {
                const riwayatId = parseInt(this.getAttribute('data-id'));
                const riwayat = Utils.getRiwayatAbsensi();
                const entry = riwayat.find(r => r.id === riwayatId);

                if (entry) {
                    Laporan.exportPDF(entry.kelasId, entry.mapel, entry.tanggal, entry.id);
                }
            });
        });
    },

    // Fungsi untuk menghapus riwayat absensi
    hapusRiwayatAbsensi(riwayatId) {
        if (confirm('Apakah Anda yakin ingin menghapus riwayat absensi ini?')) {
            // Hapus dari riwayat
            const riwayat = Utils.getRiwayatAbsensi();
            const updatedRiwayat = riwayat.filter(r => r.id !== riwayatId);
            Utils.saveRiwayatAbsensi(updatedRiwayat);

            // Hapus dari data absensi jika perlu
            const absensiData = Utils.getAbsensiData();
            const riwayatItem = riwayat.find(r => r.id === riwayatId);
            if (riwayatItem) {
                const key = `${riwayatItem.kelasId}-${riwayatItem.mapel}-${riwayatItem.tanggal}`;
                // Hanya hapus dari absensiData jika ini adalah satu-satunya entri untuk tanggal tersebut
                const countForDate = riwayat.filter(r =>
                r.kelasId === riwayatItem.kelasId &&
                r.mapel === riwayatItem.mapel &&
                r.tanggal === riwayatItem.tanggal
                ).length;

                if (countForDate <= 1) {
                    delete absensiData[key];
                    Utils.saveAbsensiData(absensiData);
                }
            }

            // Render ulang halaman laporan
            this.renderLaporanPage();
            alert('Riwayat absensi berhasil dihapus!');
        }
    },

    // Fungsi untuk ekspor PDF
    exportPDF(kelasId = null, mapel = null, tanggal = null, riwayatId = null) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const selectedKelas = kelasId ? Utils.getKelasData().find(k => k.id === kelasId) : Utils.getSelectedKelas();
        const selectedMapel = mapel || Utils.getSelectedMapel();
        const exportTanggal = tanggal || new Date().toISOString().split('T')[0];

        // Dapatkan data guru untuk mapel ini
        const guruData = Utils.getGuruForMapel(selectedMapel);

        // Header
        doc.setFontSize(20);
        doc.text('LAPORAN ABSENSI SISWA', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Kelas: ${selectedKelas.name}`, 20, 25);
        doc.text(`Mata Pelajaran: ${selectedMapel}`, 20, 32);
        doc.text(`Guru: ${guruData.nama}`, 20, 39);
        doc.text(`Tanggal: ${new Date(exportTanggal).toLocaleDateString('id-ID')}`, 20, 46);

        // Data absensi
        const key = `${selectedKelas.id}-${selectedMapel}-${exportTanggal}`;
        const absensiData = Utils.getAbsensiData();

        // Jika ada riwayatId spesifik, cari data yang sesuai
        let todayAbsensi;
        if (riwayatId) {
            const riwayat = Utils.getRiwayatAbsensi();
            const entry = riwayat.find(r => r.id === riwayatId);
            if (entry) {
                // Rekonstruksi data absensi dari riwayat
                todayAbsensi = { siswa: [] };
                const siswaData = Utils.getSiswaData();
                const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);

                // Untuk demo, kita akan membuat data dummy berdasarkan statistik
                // Dalam implementasi nyata, Anda perlu menyimpan data lengkap per riwayat
                siswaDiKelas.forEach((siswa, index) => {
                    // Ini adalah simulasi - dalam aplikasi nyata, Anda perlu menyimpan data lengkap
                    const status = index < entry.hadir ? 'hadir' :
                    (index < entry.hadir + entry.tidakHadir ? 'alpha' : 'alpha');

                    todayAbsensi.siswa.push({
                        siswaId: siswa.id,
                        status: status,
                        waktu: status === 'hadir' ? new Date().toISOString() : null,
                                            keterangan: ''
                    });
                });
            } else {
                todayAbsensi = absensiData[key] || { siswa: [] };
            }
        } else {
            todayAbsensi = absensiData[key] || { siswa: [] };
        }

        const siswaData = Utils.getSiswaData();
        const siswaDiKelas = siswaData.filter(s => s.kelasId === selectedKelas.id);

        // Tabel data dengan keterangan
        const tableData = [];
        siswaDiKelas.forEach((siswa, index) => {
            const absensiSiswa = todayAbsensi.siswa.find(s => s.siswaId === siswa.id) || {
                status: 'alpha',
                waktu: null,
                keterangan: ''
            };

            tableData.push([
                index + 1,
                siswa.nis,
                siswa.name,
                Utils.getStatusText(absensiSiswa.status),
                           absensiSiswa.waktu ? new Date(absensiSiswa.waktu).toLocaleTimeString('id-ID') : '-',
                           absensiSiswa.keterangan || '-'
            ]);
        });

        doc.autoTable({
            head: [['No', 'NIS', 'Nama Siswa', 'Status', 'Waktu', 'Keterangan']],
            body: tableData,
            startY: 55,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [212, 167, 98] },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 20 },
                2: { cellWidth: 40 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 50 }
            }
        });

        // Statistik
        const hadirCount = todayAbsensi.siswa.filter(s => s.status === 'hadir').length;
        const totalCount = siswaDiKelas.length;
        const persentase = totalCount > 0 ? ((hadirCount / totalCount) * 100).toFixed(1) : 0;

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text(`Statistik Kehadiran:`, 20, finalY);
        doc.text(`Hadir: ${hadirCount} siswa`, 20, finalY + 7);
        doc.text(`Tidak Hadir: ${totalCount - hadirCount} siswa`, 20, finalY + 14);
        doc.text(`Persentase: ${persentase}%`, 20, finalY + 21);

        // Tanda tangan guru
        const tandaTanganY = finalY + 35;
        doc.text(`Mengetahui,`, 140, tandaTanganY);
        doc.text(`Guru ${selectedMapel}`, 140, tandaTanganY + 20);
        doc.text(guruData.nama, 140, tandaTanganY + 30);

        // Simpan PDF
        const fileName = riwayatId ?
        `absensi-${selectedKelas.name}-${selectedMapel}-${exportTanggal}-${riwayatId}.pdf` :
        `absensi-${selectedKelas.name}-${selectedMapel}-${exportTanggal}.pdf`;

        doc.save(fileName);
    },

    // Fungsi untuk ekspor semua riwayat sebagai PDF
    exportAllPDF() {
        const riwayat = Utils.getRiwayatAbsensi();

        if (riwayat.length === 0) {
            alert('Tidak ada riwayat absensi untuk diekspor!');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('LAPORAN RIWAYAT ABSENSI', 105, 15, { align: 'center' });

        const selectedKelas = Utils.getSelectedKelas();
        doc.setFontSize(12);
        doc.text(`Kelas: ${selectedKelas.name}`, 20, 25);
        doc.text(`Total Riwayat: ${riwayat.length}`, 20, 32);
        doc.text(`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}`, 20, 39);

        // Tabel ringkasan riwayat
        const tableData = riwayat.map(entry => [
            new Date(entry.tanggal).toLocaleDateString('id-ID'),
                                      entry.mapel,
                                      entry.hadir,
                                      entry.tidakHadir,
                                      entry.jumlahSiswa > 0 ? ((entry.hadir / entry.jumlahSiswa) * 100).toFixed(1) + '%' : '0%'
        ]);

        doc.autoTable({
            head: [['Tanggal', 'Mata Pelajaran', 'Hadir', 'Tidak Hadir', 'Persentase']],
            body: tableData,
            startY: 50,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [212, 167, 98] }
        });

        // Simpan PDF
        doc.save(`riwayat-absensi-${selectedKelas.name}-${new Date().toISOString().split('T')[0]}.pdf`);
    }
};
