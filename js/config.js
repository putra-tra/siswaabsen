// Konfigurasi dan data sample
const Config = {
    sampleData: {
        users: [
            {
                username: "guru",
                password: "guru123",
                name: "Bu Sari, S.Pd",
                avatar: "S"
            }
        ],
        mapelList: [
            "PIPAS",
            "Bahasa Indonesia",
            "Agama",
            "Mapel Produktif",
            "Informatika",
            "BK",
            "Sejarah",
            "Matematika",
            "PPKN",
            "Seni",
            "Olahraga",
            "Bahasa Daerah",
            "Bahasa Inggris"
        ]
    },

    // Map untuk ikon mapel
    mapelIcons: {
        'PIPAS': 'fas fa-microscope',
        'Bahasa Indonesia': 'fas fa-book',
        'Agama': 'fas fa-pray',
        'Mapel Produktif': 'fas fa-tools',
        'Informatika': 'fas fa-laptop-code',
        'BK': 'fas fa-comments',
        'Sejarah': 'fas fa-monument',
        'Matematika': 'fas fa-calculator',
        'PPKN': 'fas fa-landmark',
        'Seni': 'fas fa-palette',
        'Olahraga': 'fas fa-running',
        'Bahasa Daerah': 'fas fa-language',
        'Bahasa Inggris': 'fas fa-globe'
    },

    // Map untuk warna mapel
    mapelColors: {
        'PIPAS': '#d4a762',
        'Bahasa Indonesia': '#e74c3c',
        'Agama': '#a8c686',
        'Mapel Produktif': '#f39c12',
        'Informatika': '#9b59b6',
        'BK': '#8bbabb',
        'Sejarah': '#d35400',
        'Matematika': '#5a4c3e',
        'PPKN': '#8e44ad',
        'Seni': '#e67e22',
        'Olahraga': '#a8c686',
        'Bahasa Daerah': '#16a085',
        'Bahasa Inggris': '#d4a762'
    },

    // Status absensi
    statusOrder: ['alpha', 'hadir', 'izin', 'sakit'],
    statusText: {
        'hadir': 'Hadir',
        'izin': 'Izin',
        'sakit': 'Sakit',
        'alpha': 'Alpha'
    },
    statusClass: {
        'hadir': 'status-hadir',
        'izin': 'status-izin',
        'sakit': 'status-sakit',
        'alpha': 'status-alpha'
    }
};
