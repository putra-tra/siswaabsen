// Authentication functions
const Auth = {
    // Fungsi untuk login
    login(username, password) {
        const user = Config.sampleData.users.find(u => u.username === username && u.password === password);
        return user;
    },

    // Fungsi untuk menampilkan halaman login
    showLoginPage() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('kelas-page').style.display = 'none';
        document.getElementById('mapel-page').style.display = 'none';
        document.getElementById('app-container').style.display = 'none';
    },

    // Fungsi untuk logout
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            Auth.showLoginPage();
        }
    },

    // Fungsi untuk inisialisasi event listener login
    initLogin() {
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = Auth.login(username, password);

            if (user) {
                Kelas.showKelasPage();
            } else {
                alert('Username atau password salah!');
            }
        });

        document.getElementById('logout-btn').addEventListener('click', Auth.logout);
    }
};
