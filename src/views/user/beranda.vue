<template>
  <div class="beranda-page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="logo">
        Laundry<span>Ku</span>
      </div>

      <div class="menu">
        <router-link to="/beranda" class="active">Beranda</router-link>
        <router-link to="/pemesanan">Pemesanan</router-link>
        <router-link to="/riwayat">Riwayat</router-link>
        <router-link to="/profil">Profil</router-link>
      </div>

      <button class="logout" @click="logout">Logout</button>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-text">
        <p class="small-title">Selamat Datang di LaundryKu</p>
        <h1>
          Laundry Bersih,<br>
          <span>Hidup Lebih Praktis</span>
        </h1>
        <p class="description">
          Nikmati layanan laundry yang mudah, cepat, dan terpercaya untuk kebutuhan sehari-hari kamu.
        </p>
        <button class="order-button" @click="$router.push('/pemesanan')">
          Pesan Sekarang
        </button>
      </div>

      <div class="hero-icon">🧺</div>
    </section>

    <!-- LAYANAN -->
    <section class="layanan">
      <div class="section-title">
        <h2>Layanan Kami</h2>
        <p>Pilih layanan laundry sesuai kebutuhanmu</p>
      </div>

      <div class="layanan-container">
        <div
          v-for="(item, index) in layananList"
          :key="item.id_layanan || item.id || index"
          class="layanan-card"
        >
          <div class="icon">
            {{ getIconLayanan(item.nama_layanan || item.nama, index) }}
          </div>

          <h3>{{ item.nama_layanan || item.nama }}</h3>

          <p>
            {{ item.deskripsi || item.estimasi || getDeskripsiLayanan(item.nama_layanan || item.nama) }}
          </p>

          <div class="harga">
            Rp{{ formatRupiah(item.harga) }}{{ String(item.nama_layanan || '').toLowerCase().includes('satuan') || String(item.nama_layanan || '').toLowerCase().includes('antar') ? '' : '/kg' }}
          </div>
        </div>
      </div>
    </section>

    <!-- KEUNGGULAN -->
    <section class="keunggulan">
      <div class="section-title">
        <h2>Kenapa LaundryKu?</h2>
      </div>

      <div class="keunggulan-container">
        <div class="keunggulan-card">
          <div class="keunggulan-icon">✨</div>
          <h3>Bersih</h3>
          <p>Pakaian dicuci dengan proses yang bersih dan rapi.</p>
        </div>

        <div class="keunggulan-card">
          <div class="keunggulan-icon">⚡</div>
          <h3>Cepat</h3>
          <p>Proses laundry dilakukan dengan cepat dan tepat.</p>
        </div>

        <div class="keunggulan-card">
          <div class="keunggulan-icon">💖</div>
          <h3>Terpercaya</h3>
          <p>Kami menjaga pakaian kamu dengan penuh perhatian.</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <div class="footer-logo">Laundry<span>Ku</span></div>
      <p>Solusi laundry mudah dan praktis untuk kebutuhanmu.</p>
      <p class="copyright">© 2026 LaundryKu. All Rights Reserved.</p>
    </footer>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "BerandaUser",

  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      layananList: [
        { id: 1, nama_layanan: "Cuci Reguler", harga: 7000 },
        { id: 2, nama_layanan: "Cuci Kering", harga: 8000 },
        { id: 3, nama_layanan: "Cuci Express", harga: 10000 }
      ]
    }
  },

  mounted() {
    this.ambilLayanan()
  },

  methods: {
    async ambilLayanan() {
      try {
        const res = await axios.get(`${this.API_BASE_URL}/api/layanan`)
        if (res.data && res.data.data && res.data.data.length > 0) {
          this.layananList = res.data.data
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          this.layananList = res.data
        }
      } catch (error) {
        console.error("Gagal mengambil data layanan dari backend, menggunakan data default:", error)
      }
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID').format(Number(angka) || 0)
    },

    getIconLayanan(nama, index) {
      const nameLower = String(nama || '').toLowerCase()
      if (nameLower.includes('express')) return '⚡'
      if (nameLower.includes('kering')) return '👕'
      if (nameLower.includes('bedcover') || nameLower.includes('satuan')) return '🛏️'
      if (nameLower.includes('antar') || nameLower.includes('jemput')) return '🚚'
      if (nameLower.includes('reguler') || nameLower.includes('kiloan')) return '🧺'
      
      const icons = ['🧺', '👕', '⚡', '🚚']
      return icons[index % icons.length]
    },

    getDeskripsiLayanan(nama) {
      const nameLower = String(nama || '').toLowerCase()
      if (nameLower.includes('kering')) return 'Pakaian dicuci hingga bersih dan siap digunakan kembali.'
      if (nameLower.includes('express')) return 'Pilihan cepat untuk kamu yang membutuhkan laundry segera.'
      if (nameLower.includes('antar') || nameLower.includes('jemput')) return 'Laundry kamu bisa dijemput dan diantar sampai ke rumah.'
      return 'Layanan laundry reguler dengan proses yang bersih dan rapi.'
    },

    logout() {
      localStorage.removeItem("token")
      localStorage.removeItem("user_token")
      localStorage.removeItem("user_info")
      localStorage.removeItem("id_pelanggan")
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

.beranda-page {
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

/* HERO */
.hero {
  max-width: 1050px;
  margin: 40px auto;
  padding: 50px 60px;
  background: white;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.hero-text {
  max-width: 550px;
}

.small-title {
  color: #e85d9e;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
}

.hero h1 {
  color: #333;
  font-size: 40px;
  line-height: 1.2;
  margin: 0;
}

.hero h1 span {
  color: #e85d9e;
}

.description {
  color: #777;
  line-height: 1.7;
  font-size: 15px;
  margin-top: 20px;
}

.order-button {
  margin-top: 15px;
  padding: 13px 25px;
  background: #e85d9e;
  color: white;
  border: none;
  border-radius: 11px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.order-button:hover {
  background: #d94d8e;
}

.hero-icon {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: #ffe4f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 85px;
}

/* SECTION TITLE */
.section-title {
  text-align: center;
  margin-bottom: 35px;
}

.section-title h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 8px;
}

.section-title p {
  color: #888;
  font-size: 14px;
}

/* LAYANAN (SEMPURNA DI TENGAH) */
.layanan {
  max-width: 1050px;
  margin: 60px auto;
  padding: 0 20px;
  width: 100%;
}

.layanan-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 25px;
  width: 100%;
}

.layanan-card {
  flex: 1 1 280px;
  max-width: 310px;
  background: white;
  padding: 32px 24px;
  border-radius: 22px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.layanan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 32px rgba(232, 93, 158, 0.16);
}

.icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #ffe4f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  margin-bottom: 12px;
}

.layanan-card h3 {
  color: #333;
  font-size: 18px;
  margin: 8px 0;
  font-weight: bold;
}

.layanan-card p {
  color: #888;
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 15px;
}

.harga {
  color: #e85d9e;
  font-weight: bold;
  font-size: 16px;
}

/* KEUNGGULAN */
.keunggulan {
  max-width: 1050px;
  margin: 70px auto;
  padding: 0 20px;
  width: 100%;
}

.keunggulan-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 25px;
  width: 100%;
}

.keunggulan-card {
  flex: 1 1 280px;
  max-width: 310px;
  background: white;
  padding: 30px 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
}

.keunggulan-icon {
  font-size: 35px;
  margin-bottom: 12px;
}

.keunggulan-card h3 {
  color: #333;
  margin-bottom: 8px;
}

.keunggulan-card p {
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}

/* FOOTER */
footer {
  margin-top: 70px;
  padding: 35px 20px;
  background: white;
  text-align: center;
  border-top: 1px solid #f1dce5;
}

.footer-logo {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.footer-logo span {
  color: #e85d9e;
}

footer p {
  color: #888;
  font-size: 13px;
}

.copyright {
  margin-top: 20px;
  font-size: 12px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .navbar { padding: 0 25px; }
  .menu { gap: 15px; }
  .hero { margin: 25px auto; padding: 40px 30px; }
  .hero h1 { font-size: 32px; }
  .hero-icon { width: 140px; height: 140px; font-size: 65px; }
}

@media (max-width: 600px) {
  .navbar { padding: 0 15px; }
  .menu { gap: 8px; }
  .menu a { font-size: 11px; }
  .logout { padding: 8px 12px; font-size: 11px; }
  .hero { flex-direction: column; text-align: center; }
  .hero-icon { margin-top: 25px; }
  .layanan-card, .keunggulan-card { flex: 1 1 100%; max-width: 100%; }
}
</style>