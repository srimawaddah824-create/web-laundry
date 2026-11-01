<template>
  <div class="login-page">
    <div class="login-box">

      <!-- LOGO -->
      <div class="logo">
        🧺 <span>LaundryKu</span>
      </div>

      <!-- JUDUL -->
      <h1>Login Admin</h1>

      <p class="welcome">
        Selamat datang kembali 👋
      </p>

      <!-- FORM LOGIN -->
      <form @submit.prevent="loginAdmin">

        <!-- EMAIL -->
        <div class="form-group">
          <label for="email">Email Admin</label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Masukkan email admin"
            required
          />
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label for="password">Password</label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            required
          />
        </div>

        <!-- PESAN ERROR -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- TOMBOL LOGIN -->
        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>

      </form>

    </div>
  </div>
</template>


<script>
import axios from "axios"
import { useRouter } from "vue-router"

export default {
  name: "LoginAdmin",

  setup() {
    const router = useRouter()

    return {
      router
    }
  },

  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: ""
    }
  },

  methods: {

    async loginAdmin() {

      this.loading = true
      this.errorMessage = ""

      // Menggunakan IP Hotspot Gateway ASUS (192.168.137.1)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.137.1:8080"

      try {

        // =====================================
        // LOGIN KE BACKEND GO
        // =====================================

        const response = await axios.post(
          `${API_BASE_URL}/api/login/admin`,
          {
            email: this.email,
            password: this.password
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
            timeout: 10000
          }
        )

        console.log(
          "Login Admin Berhasil:",
          response.data
        )

        // =====================================
        // SIMPAN TOKEN
        // =====================================

        if (response.data.token) {

          localStorage.setItem(
            "token",
            response.data.token
          )

          localStorage.setItem(
            "admin_token",
            response.data.token
          )
        }

        // =====================================
        // SIMPAN DATA ADMIN
        // =====================================

        if (response.data.admin) {

          localStorage.setItem(
            "admin",
            JSON.stringify(response.data.admin)
          )

        } else if (response.data.data) {

          localStorage.setItem(
            "admin",
            JSON.stringify(response.data.data)
          )
        }

        // =====================================
        // PENANDA LOGIN ADMIN
        // =====================================

        localStorage.setItem(
          "admin_logged_in",
          "true"
        )

        // =====================================
        // MASUK DASHBOARD
        // =====================================

        await this.router.push("/dashboard")

      } catch (error) {

        console.error(
          "Detail Error Login:",
          error
        )

        // =====================================
        // ERROR DARI BACKEND
        // =====================================

        if (error.response) {

          console.error(
            "Response Backend:",
            error.response.data
          )

          if (error.response.data.message) {

            this.errorMessage =
              error.response.data.message

          } else if (error.response.data.error) {

            this.errorMessage =
              error.response.data.error

          } else {

            this.errorMessage =
              "Email atau password admin salah."
          }

        }

        // =====================================
        // BACKEND TIDAK BISA DIHUBUNGI
        // =====================================

        else if (error.request) {

          this.errorMessage =
            "Backend tidak dapat dihubungi. Pastikan server Go sedang berjalan."

        }

        // =====================================
        // ERROR LAIN
        // =====================================

        else {

          this.errorMessage =
            "Terjadi kesalahan saat login."
        }

      } finally {

        this.loading = false

      }
    }
  }
}
</script>


<style scoped>

* {
  box-sizing: border-box;
}


/* ================================
   HALAMAN LOGIN
================================ */

.login-page {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #fff7fa;

  font-family: Arial, Helvetica, sans-serif;

  padding: 20px;
}


/* ================================
   BOX LOGIN
================================ */

.login-box {
  width: 380px;

  background: #ffffff;

  padding: 35px;

  border-radius: 18px;

  box-shadow:
    0 8px 25px rgba(228, 81, 150, 0.12);
}


/* ================================
   LOGO
================================ */

.logo {
  text-align: center;

  font-size: 23px;

  font-weight: 700;

  color: #29344d;

  margin-bottom: 20px;
}

.logo span {
  color: #e45196;
}


/* ================================
   JUDUL
================================ */

h1 {
  margin: 0;

  text-align: center;

  font-size: 22px;

  font-weight: 700;

  color: #29344d;
}

.welcome {
  margin-top: 8px;

  margin-bottom: 28px;

  text-align: center;

  font-size: 13px;

  color: #888888;
}


/* ================================
   FORM
================================ */

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;

  margin-bottom: 7px;

  font-size: 13px;

  font-weight: 600;

  color: #29344d;
}

input {
  width: 100%;

  height: 44px;

  padding: 0 13px;

  border: 1px solid #e4e4e4;

  border-radius: 8px;

  outline: none;

  background: #ffffff;

  color: #29344d;

  font-size: 13px;
}

input::placeholder {
  color: #aaaaaa;
}

input:focus {
  border-color: #e45196;

  box-shadow:
    0 0 0 3px rgba(228, 81, 150, 0.08);
}


/* ================================
   ERROR
================================ */

.error-message {
  margin-bottom: 15px;

  padding: 10px;

  border-radius: 7px;

  background: #fff0f4;

  color: #d83b70;

  text-align: center;

  font-size: 12px;

  line-height: 1.4;
}


/* ================================
   BUTTON
================================ */

.login-button {
  width: 100%;

  height: 44px;

  border: none;

  border-radius: 8px;

  background: #e45196;

  color: #ffffff;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.login-button:hover {
  background: #d83f87;
}

.login-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}


/* ================================
   RESPONSIVE
================================ */

@media (max-width: 450px) {

  .login-box {
    width: 100%;

    padding: 28px 22px;
  }

}

</style>