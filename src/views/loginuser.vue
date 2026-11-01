<template>
  <div class="login-page">

    <div class="login-card">

      <h1>LOGIN</h1>

      <p class="welcome">
        Selamat Datang 👋
      </p>

      <p class="subtitle">
        Silakan masuk ke akun Anda
      </p>

      <!-- EMAIL -->
      <div class="form-group">
        <label>Email</label>

        <input
          v-model="email"
          type="email"
          placeholder="Masukkan Email Anda"
          @keyup.enter="login"
        />
      </div>

      <!-- PASSWORD -->
      <div class="form-group">
        <label>Password</label>

        <input
          v-model="password"
          type="password"
          placeholder="Masukkan Password Anda"
          @keyup.enter="login"
        />
      </div>

      <!-- TOMBOL LOGIN -->
      <button :disabled="loading" @click="login">
        {{ loading ? 'MEMPROSES...' : 'LOGIN' }}
      </button>

      <!-- REGISTER -->
      <p class="register-text">
        Belum punya akun?

        <span @click="goRegister">
          Register
        </span>
      </p>

    </div>

  </div>
</template>


<script>
import axios from 'axios'

export default {

  name: "LoginUser",

  data() {
    return {
      // Disesuaikan ke IP Hotspot laptop backend ASUS (192.168.137.1)
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      email: "",
      password: "",
      loading: false
    }
  },

  methods: {

    async login() {

      if (!this.email || !this.password) {
        alert("Email dan password harus diisi!")
        return
      }

      this.loading = true

      try {
        const response = await axios.post(`${this.API_BASE_URL}/api/login`, {
          email: this.email,
          password: this.password
        })

        if (response.data) {
          const resData = response.data
          const token = resData.token || resData.data?.token
          const user = resData.user || resData.data?.user || resData.data

          if (token) {
            localStorage.setItem('user_token', token)
          }

          if (user) {
            localStorage.setItem('user_info', JSON.stringify(user))
            const idPelanggan = user.id_pelanggan || user.id
            if (idPelanggan) {
              localStorage.setItem('id_pelanggan', idPelanggan)
            }
          }

          alert("Login berhasil! Selamat datang ✨")
          this.$router.push("/beranda")
        }
      } catch (error) {
        console.error("Gagal login:", error)
        
        if (error.response) {
          if (error.response.status === 401) {
            alert("Login Gagal: Email atau Password salah!")
          } else if (error.response.data && error.response.data.message) {
            alert("Login Gagal: " + error.response.data.message)
          } else {
            alert("Login Gagal: Silakan periksa kembali akun Anda.")
          }
        } else {
          alert("Gagal terhubung ke server backend Go.")
        }
      } finally {
        this.loading = false
      }
    },

    goRegister() {
      this.$router.push("/register")
    }

  }

}
</script>


<style scoped>

* {
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #fff4f9;
}


.login-card {
  width: 360px;

  padding: 35px 40px;

  background: #ffffff;

  border-radius: 12px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}


.login-card h1 {
  margin: 0 0 10px;

  text-align: center;

  font-size: 24px;

  font-weight: 700;

  color: #222222;
}


.welcome {
  margin: 0 0 4px;

  text-align: center;

  font-size: 14px;

  color: #333333;
}


.subtitle {
  margin: 0 0 28px;

  text-align: center;

  font-size: 11px;

  color: #999999;
}


.form-group {
  margin-bottom: 18px;
}


.form-group label {
  display: block;

  margin-bottom: 7px;

  font-size: 12px;

  color: #333333;
}


.form-group input {
  width: 100%;

  height: 42px;

  padding: 0 12px;

  border: none;

  border-radius: 5px;

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

  margin-top: 5px;

  border: none;

  border-radius: 5px;

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


.register-text {
  margin-top: 18px;

  text-align: center;

  font-size: 10px;

  color: #888888;
}


.register-text span {
  color: #ff2490;

  font-weight: bold;

  cursor: pointer;
}

</style>