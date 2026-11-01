<template>
  <div class="profil-page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="logo">Laundry<span>Ku</span></div>

      <div class="menu">
        <router-link to="/beranda">Beranda</router-link>
        <router-link to="/pemesanan">Pemesanan</router-link>
        <router-link to="/riwayat">Riwayat</router-link>
        <router-link to="/profil" class="active">Profil</router-link>
      </div>

      <button class="logout" @click="logout">
        Logout
      </button>
    </nav>

    <!-- ISI PROFIL -->
    <main class="content">

      <div class="title">
        <h1>Profil Saya</h1>
        <p>Kelola informasi akun kamu di LaundryKu</p>
      </div>

      <div class="profile-card">

        <!-- FOTO / ICON -->
        <div class="profile-header">
          <div class="avatar">
            👤
          </div>

          <div class="profile-name">
            <h2>{{ user.nama || "Pelanggan" }}</h2>
            <p>Pelanggan LaundryKu</p>
          </div>
        </div>

        <!-- DATA PROFIL -->
        <form @submit.prevent="simpanProfil" class="form-profile">

          <div class="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              v-model="user.nama"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model="user.email"
              placeholder="Masukkan email"
            />
          </div>

          <div class="form-group">
            <label>No. Handphone</label>
            <input
              type="text"
              v-model="user.no_hp"
              placeholder="Masukkan nomor handphone"
              required
            />
          </div>

          <div class="form-group">
            <label>Alamat</label>
            <textarea
              v-model="user.alamat"
              placeholder="Masukkan alamat"
              rows="3"
            ></textarea>
          </div>

          <!-- BUTTON -->
          <div class="button-area">
            <button
              type="submit"
              class="save-button"
              :disabled="loading"
            >
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>

        </form>

      </div>

    </main>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "ProfilUser",

  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      loading: false,
      user: {
        id_pelanggan: "",
        nama: "",
        email: "",
        no_hp: "",
        alamat: ""
      }
    }
  },

  mounted() {
    this.loadUser()
  },

  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('user_token') || localStorage.getItem('token')
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    },

    async loadUser() {
      const data = localStorage.getItem("user_info") || localStorage.getItem("user")

      if (data) {
        try {
          const userData = JSON.parse(data)

          this.user = {
            id_pelanggan: userData.id_pelanggan || userData.id || localStorage.getItem("id_pelanggan") || "",
            nama: userData.nama || userData.name || "",
            email: userData.email || "",
            no_hp: userData.no_hp || userData.phone || userData.telepon || "",
            alamat: userData.alamat || userData.address || ""
          }
        } catch (error) {
          console.error("Gagal membaca data user dari storage:", error)
        }
      }

      // Ambil data terbaru dari backend jika ID Pelanggan tersedia
      if (this.user.id_pelanggan) {
        try {
          const res = await axios.get(
            `${this.API_BASE_URL}/api/pelanggan/${this.user.id_pelanggan}`,
            this.getAuthHeaders()
          )

          const freshData = res.data.data || res.data
          if (freshData) {
            this.user.nama = freshData.nama || this.user.nama
            this.user.no_hp = freshData.no_hp || freshData.telepon || this.user.no_hp
            this.user.alamat = freshData.alamat || this.user.alamat
            this.user.email = freshData.email || this.user.email
          }
        } catch (err) {
          console.log("Menggunakan data profil lokal:", err)
        }
      }
    },

    async simpanProfil() {
      this.loading = true

      try {
        if (this.user.id_pelanggan) {
          await axios.put(
            `${this.API_BASE_URL}/api/pelanggan/${this.user.id_pelanggan}`,
            {
              nama: this.user.nama,
              no_hp: this.user.no_hp,
              alamat: this.user.alamat,
              email: this.user.email
            },
            this.getAuthHeaders()
          ).catch(() => null)
        }

        // Simpan ke localStorage agar komponen lain ter-update
        localStorage.setItem("user", JSON.stringify(this.user))
        localStorage.setItem("user_info", JSON.stringify(this.user))

        alert("Profil berhasil disimpan! 😊")
      } catch (error) {
        console.error("Gagal menyimpan profil:", error)
        alert("Profil tersimpan secara lokal.")
      } finally {
        this.loading = false
      }
    },

    logout() {
      localStorage.removeItem("token")
      localStorage.removeItem("user_token")
      localStorage.removeItem("user_info")
      localStorage.removeItem("id_pelanggan")
      localStorage.removeItem("user")
      localStorage.removeItem("pesanan")

      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.profil-page {
  min-height: 100vh;
  background: #fff7fa;
  font-family: Arial, sans-serif;
}

/* NAVBAR */
.navbar {
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 25px;
  font-weight: bold;
  color: #333;
}

.logo span {
  color: #e85d9e;
}

.menu {
  display: flex;
  gap: 35px;
}

.menu a {
  text-decoration: none;
  color: #777;
  font-size: 15px;
  transition: 0.3s;
}

.menu a:hover {
  color: #e85d9e;
}

.menu a.active {
  color: #e85d9e;
  font-weight: bold;
}

.logout {
  border: none;
  background: #e85d9e;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.logout:hover {
  background: #d94d8e;
}

/* CONTENT */
.content {
  max-width: 850px;
  margin: 0 auto;
  padding: 45px 25px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.title h1 {
  margin: 0;
  color: #333;
  font-size: 30px;
}

.title p {
  margin-top: 8px;
  color: #888;
  font-size: 14px;
}

/* CARD */
.profile-card {
  background: white;
  border-radius: 22px;
  padding: 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

/* HEADER PROFILE */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.avatar {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background: #ffe1ee;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.profile-name h2 {
  margin: 0 0 6px;
  color: #333;
}

.profile-name p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

/* FORM */
.form-profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group:nth-child(4) {
  grid-column: 1 / 3;
}

.form-group label {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  outline: none;
  transition: 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #e85d9e;
  box-shadow: 0 0 0 3px rgba(232, 93, 158, 0.1);
}

.form-group textarea {
  resize: vertical;
}

/* BUTTON AREA */
.button-area {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button {
  border: none;
  background: #e85d9e;
  color: white;
  padding: 13px 25px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: 0.3s;
}

.save-button:hover {
  background: #d94d8e;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .navbar {
    padding: 0 20px;
  }

  .menu {
    gap: 12px;
  }

  .menu a {
    font-size: 12px;
  }

  .profile-card {
    padding: 25px;
  }

  .form-profile {
    grid-template-columns: 1fr;
  }

  .form-group:nth-child(4) {
    grid-column: auto;
  }
}
</style>