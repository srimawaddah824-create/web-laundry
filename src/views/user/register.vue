<template>
  <div class="register-page">
    <div class="register-card">

      <h1>REGISTER</h1>

      <p class="welcome">Buat Akun Baru 🧺</p>
      <p class="subtitle">Silakan isi data untuk mendaftar</p>

      <!-- NAMA -->
      <div class="form-group">
        <label>Nama Lengkap</label>
        <input
          v-model="nama"
          type="text"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <!-- EMAIL -->
      <div class="form-group">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Masukkan email"
        />
      </div>

      <!-- NO HP -->
      <div class="form-group">
        <label>No. Handphone</label>
        <input
          v-model="no_hp"
          type="text"
          placeholder="Masukkan nomor handphone"
        />
      </div>

      <!-- PASSWORD -->
      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Masukkan password"
        />
      </div>

      <!-- KONFIRMASI PASSWORD -->
      <div class="form-group">
        <label>Konfirmasi Password</label>
        <input
          v-model="konfirmasiPassword"
          type="password"
          placeholder="Masukkan ulang password"
        />
      </div>

      <!-- BUTTON -->
      <button :disabled="loading" @click="register">
        {{ loading ? 'MEMPROSES...' : 'DAFTAR' }}
      </button>

      <p class="login-text">
        Sudah punya akun?
        <span @click="goLogin">Login</span>
      </p>

    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "RegisterUser",

  data() {
    return {
      // Disesuaikan dengan IP Laptop Backend ASUS via Hotspot (192.168.137.1)
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      nama: "",
      email: "",
      no_hp: "",
      password: "",
      konfirmasiPassword: "",
      loading: false
    };
  },

  methods: {
    async register() {

      if (
        !this.nama ||
        !this.email ||
        !this.no_hp ||
        !this.password ||
        !this.konfirmasiPassword
      ) {
        alert("Semua data termasuk Nomor Handphone harus diisi!");
        return;
      }

      if (this.password !== this.konfirmasiPassword) {
        alert("Konfirmasi password tidak sama!");
        return;
      }

      this.loading = true;

      try {
        const payload = {
          nama: this.nama,
          email: this.email,
          no_hp: this.no_hp,
          password: this.password
        };

        const response = await axios.post(`${this.API_BASE_URL}/api/register`, payload);

        alert("Pendaftaran berhasil! Silakan login. ✨");
        this.$router.push("/login");

      } catch (error) {
        console.error("Gagal mendaftar:", error);

        if (error.response) {
          const serverData = error.response.data;
          const status = error.response.status;

          let pesanError = `HTTP ${status}: `;
          if (typeof serverData === 'string') {
            pesanError += serverData;
          } else if (serverData && (serverData.message || serverData.error)) {
            pesanError += serverData.message || serverData.error;
          } else {
            pesanError += JSON.stringify(serverData);
          }

          alert("Gagal Mendaftar dari Backend:\n" + pesanError);
        } else {
          alert("Gagal terhubung ke server backend Go.");
        }
      } finally {
        this.loading = false;
      }
    },

    goLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff4f9;
}

.register-card {
  width: 380px;
  padding: 35px 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.register-card h1 {
  margin: 0 0 10px;
  text-align: center;
  font-size: 24px;
  color: #222;
}

.welcome {
  margin: 0 0 4px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.subtitle {
  margin: 0 0 25px;
  text-align: center;
  font-size: 11px;
  color: #999;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  font-size: 12px;
  color: #333;
}

.form-group input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  background: #eeeeee;
  outline: none;
  font-size: 11px;
}

.form-group input:focus {
  box-shadow: 0 0 0 2px #ff2490;
}

button {
  width: 100%;
  height: 42px;
  margin-top: 8px;
  border: none;
  border-radius: 6px;
  background: #ff2490;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #e91e83;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-text {
  margin-top: 18px;
  text-align: center;
  font-size: 10px;
  color: #888;
}

.login-text span {
  color: #ff2490;
  font-weight: bold;
  cursor: pointer;
}
</style>