<template>
  <div class="riwayat-page">

    <!-- ================= NAVBAR ================= -->
    <nav class="navbar">

      <!-- LOGO -->
      <div class="logo">
        Laundry<span>Ku</span>
      </div>

      <!-- MENU -->
      <div class="menu">
        <router-link to="/beranda">
          Beranda
        </router-link>

        <router-link to="/pemesanan">
          Pemesanan
        </router-link>

        <router-link
          to="/riwayat"
          class="active"
        >
          Riwayat
        </router-link>

        <router-link to="/profil">
          Profil
        </router-link>
      </div>

      <!-- LOGOUT -->
      <button
        class="logout"
        @click="logout"
      >
        Logout
      </button>

    </nav>


    <!-- ================= CONTENT ================= -->
    <main class="content">

      <!-- ================= TITLE ================= -->
      <div class="title">
        <h1>
          Riwayat Pesanan
        </h1>
        <p>
          Pantau proses laundry Anda secara real-time
        </p>
      </div>


      <!-- ================= LOADING STATE ================= -->
      <div v-if="loading" class="empty-card">
        <p>Memuat data pesanan...</p>
      </div>


      <!-- ================= JIKA BELUM ADA PESANAN ================= -->
      <div
        v-else-if="!pesanan"
        class="empty-card"
      >

        <div class="empty-icon">
          🧺
        </div>

        <h2>
          Belum Ada Pesanan
        </h2>

        <p>
          Anda belum memiliki riwayat pesanan laundry.
        </p>

        <button
          class="order-button"
          @click="$router.push('/pemesanan')"
        >
          Pesan Laundry Sekarang
        </button>

      </div>


      <!-- ================= JIKA ADA PESANAN ================= -->
      <div
        v-else
        class="pesanan-card"
      >

        <!-- ================= HEADER PESANAN ================= -->
        <div class="pesanan-header">

          <div>
            <h2>
              {{ pesanan.layanan }}
            </h2>

            <p>
              ID Pesanan: PSN-{{ pesanan.id_order || '-' }} | Tanggal: {{ pesanan.tanggal }}
            </p>
          </div>

          <div class="status-badge">
            {{ statusSekarang }}
          </div>

        </div>


        <!-- ================= PROGRESS STATUS ================= -->
        <div class="progress-container">

          <!-- STEP 1 -->
          <div class="step">
            <div
              class="circle"
              :class="{
                active: statusIndex >= 0
              }"
            >
              ✓
            </div>
            <span>
              Pesanan<br>
              Diterima
            </span>
          </div>


          <!-- LINE 1 -->
          <div
            class="line"
            :class="{
              active: statusIndex >= 1
            }"
          ></div>


          <!-- STEP 2 -->
          <div class="step">
            <div
              class="circle"
              :class="{
                active: statusIndex >= 1
              }"
            >
              ✓
            </div>
            <span>
              Di Proses
            </span>
          </div>


          <!-- LINE 2 -->
          <div
            class="line"
            :class="{
              active: statusIndex >= 2
            }"
          ></div>


          <!-- STEP 3 -->
          <div class="step">
            <div
              class="circle"
              :class="{
                active: statusIndex >= 2
              }"
            >
              ✓
            </div>
            <span>
              Di Cuci
            </span>
          </div>


          <!-- LINE 3 -->
          <div
            class="line"
            :class="{
              active: statusIndex >= 3
            }"
          ></div>


          <!-- STEP 4 -->
          <div class="step">
            <div
              class="circle"
              :class="{
                active: statusIndex >= 3
              }"
            >
              ✓
            </div>
            <span>
              Di Keringkan
            </span>
          </div>


          <!-- LINE 4 -->
          <div
            class="line"
            :class="{
              active: statusIndex >= 4
            }"
          ></div>


          <!-- STEP 5 -->
          <div class="step">
            <div
              class="circle"
              :class="{
                active: statusIndex >= 4
              }"
            >
              ✓
            </div>
            <span>
              Selesai
            </span>
          </div>

        </div>


        <!-- ================= DETAIL ================= -->
        <div class="detail-title">
          Detail Pesanan
        </div>


        <div class="detail-grid">

          <!-- NAMA -->
          <div class="detail-item">
            <span>Nama Pelanggan</span>
            <strong>{{ pesanan.nama }}</strong>
          </div>

          <!-- NO HP -->
          <div class="detail-item">
            <span>No. Handphone</span>
            <strong>{{ pesanan.no_hp }}</strong>
          </div>

          <!-- LAYANAN -->
          <div class="detail-item">
            <span>Layanan</span>
            <strong>{{ pesanan.layanan }}</strong>
          </div>

          <!-- BERAT -->
          <div class="detail-item">
            <span>Berat Laundry</span>
            <strong>{{ pesanan.berat }} kg</strong>
          </div>

          <!-- ANTAR JEMPUT -->
          <div class="detail-item">
            <span>Antar Jemput</span>
            <strong>{{ pesanan.antar_jemput }}</strong>
          </div>

          <!-- ALAMAT -->
          <div
            class="detail-item"
            v-if="pesanan.antar_jemput === 'Ya'"
          >
            <span>Alamat</span>
            <strong>{{ pesanan.alamat }}</strong>
          </div>

          <!-- PEMBAYARAN -->
          <div class="detail-item">
            <span>Metode Pembayaran</span>
            <strong>{{ pesanan.pembayaran }}</strong>
          </div>

          <!-- CATATAN -->
          <div class="detail-item">
            <span>Catatan</span>
            <strong>{{ pesanan.catatan || "-" }}</strong>
          </div>

        </div>


        <!-- ================= TOTAL ================= -->
        <div class="total-box">
          <span>Total Pembayaran</span>
          <strong>{{ formatRupiah(pesanan.total) }}</strong>
        </div>


        <!-- ================= BUTTON ================= -->
        <button
          class="new-order-button"
          @click="$router.push('/pemesanan')"
        >
          Buat Pesanan Baru
        </button>

      </div>

    </main>

  </div>
</template>


<script>
import axios from 'axios'

export default {
  name: "RiwayatUser",

  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      pesanan: null,
      statusSekarang: "Pesanan Diterima",
      statusIndex: 0,
      loading: false
    }
  },

  mounted() {
    this.loadPesanan()
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

    // =========================
    // LOAD PESANAN DARI BACKEND
    // =========================
    async loadPesanan() {
      this.loading = true
      const idPelanggan = localStorage.getItem('id_pelanggan') || 1
      
      try {
        const res = await axios.get(`${this.API_BASE_URL}/api/orders`, this.getAuthHeaders())
        
        let orders = []
        if (res.data && res.data.data) {
          orders = res.data.data
        } else if (Array.isArray(res.data)) {
          orders = res.data
        }

        // Filter pesanan milik pelanggan ini
        const myOrders = orders.filter(o => String(o.id_pelanggan) === String(idPelanggan))

        if (myOrders.length > 0) {
          // Ambil pesanan paling terbaru
          const latest = myOrders[myOrders.length - 1]
          
          let userInfo = {}
          try {
            userInfo = JSON.parse(localStorage.getItem("user_info") || localStorage.getItem("user") || "{}")
          } catch (e) {
            userInfo = {}
          }

          this.pesanan = {
            id_order: latest.id_order || latest.id,
            nama: userInfo.nama || userInfo.name || latest.nama_pelanggan || "Pelanggan",
            no_hp: userInfo.no_hp || userInfo.telepon || latest.no_hp || "-",
            layanan: latest.nama_layanan || latest.layanan || (latest.id_layanan ? `Layanan #${latest.id_layanan}` : 'Cuci Laundry'),
            berat: latest.total_berat || latest.berat || 0,
            antar_jemput: latest.antar_jemput || "Tidak",
            alamat: latest.alamat || "-",
            pembayaran: latest.metode_pembayaran || latest.pembayaran || "Cash",
            catatan: latest.catatan || "-",
            total: latest.total_harga || latest.total || 0,
            tanggal: latest.created_at ? new Date(latest.created_at).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID"),
            status: latest.status_order || latest.status || "Pesanan Diterima"
          }

          this.statusSekarang = this.pesanan.status
          this.setStatusIndex(this.pesanan.status)
          this.loading = false
          return
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat dari backend, menggunakan data lokal:", error)
      } finally {
        this.loading = false
      }

      // Fallback ke localStorage
      const data = localStorage.getItem("pesanan")
      if (data) {
        try {
          this.pesanan = JSON.parse(data)
          if (this.pesanan.status) {
            this.statusSekarang = this.pesanan.status
            this.setStatusIndex(this.pesanan.status)
          }
        } catch (error) {
          console.error("Gagal membaca pesanan lokal:", error)
          this.pesanan = null
        }
      } else {
        this.pesanan = null
      }
    },

    // =========================
    // STATUS INDEX MAPPING
    // =========================
    setStatusIndex(status) {
      const s = String(status || '').toLowerCase()

      if (s.includes('selesai') || s.includes('diambil') || s.includes('lunas')) {
        this.statusIndex = 4
      } else if (s.includes('kering')) {
        this.statusIndex = 3
      } else if (s.includes('cuci')) {
        this.statusIndex = 2
      } else if (s.includes('proses') || s.includes('diproses')) {
        this.statusIndex = 1
      } else {
        this.statusIndex = 0
      }
    },

    // =========================
    // FORMAT RUPIAH
    // =========================
    formatRupiah(angka) {
      return new Intl.NumberFormat(
        "id-ID",
        {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0
        }
      ).format(angka || 0)
    },

    // =========================
    // LOGOUT
    // =========================
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

.riwayat-page {
  min-height: 100vh;
  background: #fff7fa;
  font-family: Arial, Helvetica, sans-serif;
  color: #29344d;
}

/* NAVBAR */
.navbar {
  height: 70px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  border-bottom: 1px solid #f4e2eb;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  color: #29344d;
  letter-spacing: -0.5px;
}

.logo span {
  color: #e45196;
}

.menu {
  display: flex;
  align-items: center;
  gap: 35px;
}

.menu a {
  text-decoration: none;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  transition: 0.2s;
}

.menu a:hover {
  color: #e45196;
}

.menu a.active {
  color: #e45196;
  font-weight: 700;
}

.logout {
  border: none;
  background: #e45196;
  color: white;
  padding: 10px 23px;
  border-radius: 9px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: #d94187;
}

/* CONTENT */
.content {
  min-height: calc(100vh - 70px);
  padding: 40px 60px 70px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.title h1 {
  margin: 0;
  color: #29344d;
  font-size: 30px;
  font-weight: 700;
}

.title p {
  margin: 8px 0 0;
  color: #9a8b93;
  font-size: 13px;
}

/* EMPTY CARD */
.empty-card {
  width: 100%;
  max-width: 1050px;
  min-height: 330px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 10px 35px rgba(70, 45, 60, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-icon {
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffe3ef;
  font-size: 38px;
  margin-bottom: 18px;
}

.empty-card h2 {
  margin: 0 0 10px;
  font-size: 21px;
  color: #29344d;
}

.empty-card p {
  margin: 0 0 25px;
  color: #9a8b93;
  font-size: 13px;
}

.order-button {
  width: 210px;
  height: 42px;
  border: none;
  border-radius: 9px;
  background: #e45196;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.order-button:hover {
  background: #d94187;
}

/* PESANAN CARD */
.pesanan-card {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 10px 35px rgba(70, 45, 60, 0.07);
  padding: 32px 35px;
}

.pesanan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2e3e9;
}

.pesanan-header h2 {
  margin: 0 0 6px;
  font-size: 21px;
  color: #29344d;
}

.pesanan-header p {
  margin: 0;
  color: #9a8b93;
  font-size: 13px;
}

.status-badge {
  padding: 9px 17px;
  border-radius: 20px;
  background: #ffe0ed;
  color: #df4b91;
  font-size: 12px;
  font-weight: 700;
}

/* PROGRESS */
.progress-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 35px 0 40px;
  width: 100%;
}

.step {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f1e8ec;
  color: #aaa;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 9px;
}

.circle.active {
  background: #e45196;
  color: white;
}

.step span {
  color: #8e8188;
  font-size: 10px;
  line-height: 1.4;
}

.circle.active + span {
  color: #e45196;
}

.line {
  width: 55px;
  height: 3px;
  background: #eee5e9;
  margin-top: 18px;
  border-radius: 5px;
}

.line.active {
  background: #e45196;
}

/* DETAIL */
.detail-title {
  color: #29344d;
  font-size: 17px;
  font-weight: 700;
  padding-bottom: 14px;
  border-bottom: 1px solid #f2e3e9;
  margin-bottom: 5px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 45px;
}

.detail-item {
  padding: 15px 0;
  border-bottom: 1px solid #f5eaee;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-item span {
  color: #9a8b93;
  font-size: 12px;
}

.detail-item strong {
  color: #29344d;
  font-size: 13px;
  font-weight: 700;
}

/* TOTAL */
.total-box {
  margin-top: 24px;
  padding: 17px 20px;
  border-radius: 11px;
  background: #fff0f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-box span {
  color: #29344d;
  font-size: 13px;
  font-weight: 700;
}

.total-box strong {
  color: #df4b91;
  font-size: 19px;
}

/* BUTTON */
.new-order-button {
  width: 100%;
  height: 44px;
  margin-top: 20px;
  border: none;
  border-radius: 9px;
  background: #e45196;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.new-order-button:hover {
  background: #d94187;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .navbar { padding: 0 30px; }
  .content { padding: 35px 30px 60px; }
  .menu { gap: 22px; }
  .pesanan-card { padding: 28px; }
  .line { width: 35px; }
}

@media (max-width: 700px) {
  .navbar {
    height: auto;
    min-height: 70px;
    padding: 15px 20px;
    flex-wrap: wrap;
    gap: 15px;
  }

  .menu {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 20px;
  }

  .logout { padding: 9px 17px; }
  .content { padding: 30px 15px 50px; }
  .title h1 { font-size: 26px; }
  .pesanan-card { padding: 22px 18px; }
  .pesanan-header { align-items: flex-start; gap: 15px; }
  .progress-container {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 10px;
  }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>