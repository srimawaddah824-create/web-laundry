<template>
  <div class="admin-page">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">
        🧺 <span>LaundryKu</span>
      </div>

      <nav>
        <router-link to="/dashboard">
          🏠 <span>Dashboard</span>
        </router-link>

        <router-link to="/pelanggan">
          👥 <span>Data Pelanggan</span>
        </router-link>

        <router-link to="/layanan">
          🧼 <span>Data Layanan</span>
        </router-link>

        <router-link to="/pesanan">
          📦 <span>Data Pesanan</span>
        </router-link>

        <router-link
          to="/pembayaran"
          class="active"
        >
          💳 <span>Pembayaran</span>
        </router-link>

        <router-link to="/transaksi">
          💰 <span>Data Transaksi</span>
        </router-link>
      </nav>

      <button
        class="logout"
        @click="logout"
      >
        🚪 <span>Logout</span>
      </button>
    </aside>

    <!-- CONTENT -->
    <main class="content">

      <!-- HEADER -->
      <div class="header">
        <div>
          <h1>💳 Pembayaran</h1>
          <p>Kelola pembayaran pesanan laundry</p>
        </div>

        <button
          class="btn-refresh"
          @click="ambilData"
        >
          🔄 Refresh
        </button>
      </div>

      <!-- CARD PEMBAYARAN -->
      <div class="payment-card">
        <div class="card-title">
          <div>
            <h2>💳 Pembayaran Laundry</h2>
            <p>Pilih pesanan untuk melakukan pembayaran</p>
          </div>
        </div>

        <!-- FORM PEMBAYARAN -->
        <form
          class="payment-form"
          @submit.prevent="simpanPembayaran"
        >

          <!-- PESANAN -->
          <div class="form-group full">
            <label>ID Pesanan</label>
            <select
              v-model="form.id_order"
              @change="pilihPesanan"
              required
            >
              <option value="">-- Pilih Pesanan --</option>
              <option
                v-for="pesanan in pesananList"
                :key="pesanan.id_order || pesanan.id"
                :value="pesanan.id_order || pesanan.id"
              >
                PSN-{{ pesanan.id_order || pesanan.id }}
                - PLG-{{ pesanan.id_pelanggan }}
                - Rp {{ formatRupiah(pesanan.total_harga || pesanan.harga || pesanan.total) }}
              </option>
            </select>
          </div>

          <!-- PELANGGAN -->
          <div class="form-group">
            <label>ID Pelanggan</label>
            <input
              v-model="form.id_pelanggan"
              type="text"
              placeholder="ID pelanggan"
              readonly
            />
          </div>

          <!-- TOTAL -->
          <div class="form-group">
            <label>Total Pembayaran</label>
            <input
              :value="'Rp ' + formatRupiah(form.total_harga)"
              type="text"
              readonly
            />
          </div>

          <!-- METODE -->
          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select
              v-model="form.metode_pembayaran"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Transfer Bank / QRIS">Transfer Bank / QRIS</option>
            </select>
          </div>

          <!-- STATUS -->
          <div class="form-group">
            <label>Status Pembayaran</label>
            <select
              v-model="form.status"
              required
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          <!-- BUTTON -->
          <div class="form-button">
            <button
              type="submit"
              class="btn-save"
            >
              💾 Simpan Pembayaran
            </button>
          </div>

        </form>
      </div>

      <!-- INFO -->
      <div class="info-box">
        <div class="info-icon">💡</div>
        <div>
          <strong>Informasi Pembayaran</strong>
          <p>
            Pembayaran dapat dilakukan menggunakan Cash atau Transfer. Data pembayaran yang sudah disimpan akan langsung masuk ke database MariaDB.
          </p>
        </div>
      </div>

    </main>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PembayaranView',

  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      pesananList: [],
      loading: false,
      form: {
        id_order: '',
        id_pelanggan: '',
        total_harga: 0,
        metode_pembayaran: 'Cash',
        status: 'Lunas'
      }
    }
  },

  mounted() {
    this.ambilData()
  },

  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    },

    async ambilData() {
      this.loading = true
      try {
        const resOrders = await axios.get(`${this.API_BASE_URL}/api/orders`, this.getAuthHeaders()).catch(() => null)
        
        if (resOrders && resOrders.data && resOrders.data.data) {
          this.pesananList = resOrders.data.data
        } else if (resOrders && Array.isArray(resOrders.data)) {
          this.pesananList = resOrders.data
        } else {
          this.pesananList = []
        }

        this.ambilPesananDariQuery()
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      } finally {
        this.loading = false
      }
    },

    ambilPesananDariQuery() {
      const pesananId = this.$route.query.pesananId
      if (!pesananId) return

      const pesanan = this.pesananList.find(
        item => String(item.id_order || item.id) === String(pesananId)
      )

      if (pesanan) {
        this.form.id_order = pesanan.id_order || pesanan.id
        this.pilihPesanan()
      }
    },

    pilihPesanan() {
      const pesanan = this.pesananList.find(
        item => String(item.id_order || item.id) === String(this.form.id_order)
      )

      if (!pesanan) {
        this.form.id_pelanggan = ''
        this.form.total_harga = 0
        return
      }

      this.form.id_pelanggan = pesanan.id_pelanggan || ''
      // Disesuaikan agar mengambil harga dari total_harga || harga || total
      this.form.total_harga = Number(pesanan.total_harga || pesanan.harga || pesanan.total || 0)
    },

    async simpanPembayaran() {
      if (!this.form.id_order) {
        alert('Silakan pilih pesanan terlebih dahulu!')
        return
      }

      try {
        await axios.post(
          `${this.API_BASE_URL}/api/pembayaran`,
          {
            id_order: Number(this.form.id_order),
            id_pelanggan: Number(this.form.id_pelanggan),
            metode_pembayaran: this.form.metode_pembayaran,
            total_harga: Number(this.form.total_harga),
            status: this.form.status
          },
          this.getAuthHeaders()
        )

        alert('Pembayaran berhasil disimpan ke database! 💗')
        this.resetForm()
        this.$router.push('/transaksi')
      } catch (error) {
        console.error('Gagal menyimpan pembayaran:', error)
        alert('Gagal memproses pembayaran ke server.')
      }
    },

    resetForm() {
      this.form = {
        id_order: '',
        id_pelanggan: '',
        total_harga: 0,
        metode_pembayaran: 'Cash',
        status: 'Lunas'
      }
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID').format(Number(angka) || 0)
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('admin_token')
      this.$router.push('/loginadmin')
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-page {
  min-height: 100vh;
  background: #fff7fa;
  font-family: Arial, sans-serif;
  color: #333;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 210px;
  height: 100vh;
  background: #fad1e1;
  padding: 22px 14px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 19px;
  font-weight: bold;
  margin-bottom: 25px;
  padding-left: 7px;
  color: #d84f89;
}

.logo span {
  margin-left: 5px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar nav a {
  text-decoration: none;
  color: #63384a;
  padding: 9px 11px;
  border-radius: 9px;
  font-size: 13px;
}

.sidebar nav a:hover {
  background: #f6b9d0;
}

.sidebar nav a.active {
  background: #e991b5;
  color: white;
  font-weight: bold;
}

.logout {
  margin-top: auto;
  border: none;
  background: white;
  color: #d84f89;
  padding: 9px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 12px;
}

.content {
  margin-left: 210px;
  padding: 24px 28px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0 0 5px;
  font-size: 25px;
}

.header p {
  margin: 0;
  color: #888;
  font-size: 13px;
}

.btn-refresh {
  background: #fff0f5;
  border: 1px solid #f3c6d7;
  color: #d84f89;
  border-radius: 8px;
  padding: 9px 13px;
  cursor: pointer;
  font-size: 11px;
}

.payment-card {
  background: white;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}

.card-title h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.card-title p {
  margin: 0;
  color: #999;
  font-size: 12px;
}

.payment-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ead7df;
  border-radius: 8px;
  outline: none;
  font-size: 12px;
  background: white;
}

.form-button {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

.btn-save {
  border: none;
  background: #e991b5;
  color: white;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.info-box {
  margin-top: 18px;
  padding: 12px 15px;
  background: #fff0f5;
  border-radius: 11px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.info-icon {
  font-size: 20px;
}

.info-box strong {
  color: #74465a;
  font-size: 12px;
}

.info-box p {
  margin: 5px 0 0;
  color: #777;
  font-size: 11px;
  line-height: 1.5;
}
</style>