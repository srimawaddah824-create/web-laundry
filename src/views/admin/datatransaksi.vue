<template>
  <div class="admin-page">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="logo">
        🧺 <span>LaundryKu</span>
      </div>

      <nav>
        <router-link to="/dashboard">
          🏠 Dashboard
        </router-link>

        <router-link to="/pelanggan">
          👥 Data Pelanggan
        </router-link>

        <router-link to="/layanan">
          🧼 Data Layanan
        </router-link>

        <router-link to="/pesanan">
          📦 Data Pesanan
        </router-link>

        <router-link to="/pembayaran">
          💳 Pembayaran
        </router-link>

        <router-link
          to="/transaksi"
          class="active"
        >
          💰 Data Transaksi
        </router-link>
      </nav>

      <button
        class="logout"
        @click="logout"
      >
        🚪 Logout
      </button>

    </aside>


    <!-- CONTENT -->
    <main class="content">

      <!-- HEADER -->
      <div class="header">

        <div>
          <h1>
            💰 Data Transaksi
          </h1>
          <p>
            Kelola dan lihat seluruh transaksi laundry
          </p>
        </div>

        <router-link
          to="/pesanan"
          class="btn-primary"
        >
          + Tambah Pesanan
        </router-link>

      </div>


      <!-- STATISTIK -->
      <div class="stats">

        <!-- TOTAL -->
        <div class="stat-card">
          <div class="stat-icon">
            🧾
          </div>
          <div>
            <p>Total Transaksi</p>
            <h2>
              {{ transaksiList.length }}
            </h2>
          </div>
        </div>


        <!-- PENDAPATAN -->
        <div class="stat-card">
          <div class="stat-icon green">
            💰
          </div>
          <div>
            <p>Total Pendapatan</p>
            <h2>
              Rp {{ formatRupiah(totalPendapatan) }}
            </h2>
          </div>
        </div>


        <!-- BELUM LUNAS -->
        <div class="stat-card">
          <div class="stat-icon yellow">
            ⏳
          </div>
          <div>
            <p>Belum Lunas</p>
            <h2>
              {{ jumlahBelumLunas }}
            </h2>
          </div>
        </div>


        <!-- LUNAS -->
        <div class="stat-card">
          <div class="stat-icon blue">
            ✅
          </div>
          <div>
            <p>Sudah Lunas</p>
            <h2>
              {{ jumlahLunas }}
            </h2>
          </div>
        </div>

      </div>


      <!-- RIWAYAT TRANSAKSI -->
      <div class="table-card">

        <div class="table-header">
          <div>
            <h2>
              📊 Riwayat Transaksi
            </h2>
            <p>
              Data transaksi berdasarkan pesanan dan pembayaran dari database
            </p>
          </div>

          <button
            class="btn-refresh"
            @click="ambilData"
          >
            🔄 Refresh
          </button>
        </div>

        <div v-if="loading" class="empty">
          <p>Memuat data transaksi...</p>
        </div>

        <!-- KOSONG -->
        <div
          v-else-if="transaksiList.length === 0"
          class="empty"
        >
          <div class="empty-icon">
            📊
          </div>
          <h3>
            Belum ada transaksi
          </h3>
          <p>
            Data transaksi akan muncul setelah terdapat pesanan.
          </p>
          <router-link
            to="/pesanan"
            class="empty-button"
          >
            + Tambah Pesanan
          </router-link>
        </div>


        <!-- TABLE -->
        <div
          v-else
          class="table-wrapper"
        >
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Order</th>
                <th>ID Pelanggan</th>
                <th>ID Layanan</th>
                <th>Berat</th>
                <th>Total</th>
                <th>Status Bayar</th>
                <th>Status Laundry</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in transaksiList"
                :key="item.id_order || item.id"
              >
                <!-- NO -->
                <td>
                  {{ index + 1 }}
                </td>

                <!-- ID -->
                <td>
                  <span class="id-badge">
                    PSN-{{ item.id_order || item.id }}
                  </span>
                </td>

                <!-- PELANGGAN -->
                <td>
                  <strong>
                    PLG-{{ item.id_pelanggan }}
                  </strong>
                </td>

                <!-- LAYANAN -->
                <td>
                  {{ item.layanan || (item.id_layanan ? 'LAY-' + item.id_layanan : '-') }}
                </td>

                <!-- BERAT -->
                <td>
                  {{ item.total_berat || item.berat || 0 }} Kg
                </td>

                <!-- TOTAL -->
                <td>
                  <strong class="total">
                    Rp {{ formatRupiah(item.total_harga || item.harga || item.total) }}
                  </strong>
                </td>

                <!-- STATUS BAYAR -->
                <td>
                  <span
                    class="badge"
                    :class="item.statusPembayaran === 'Lunas' ? 'lunas' : 'belum'"
                  >
                    {{ item.statusPembayaran }}
                  </span>
                </td>

                <!-- STATUS LAUNDRY -->
                <td>
                  <span
                    class="badge"
                    :class="statusClass(item.status_order || item.status)"
                  >
                    {{ item.status_order || item.status || 'Menunggu' }}
                  </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>


      <!-- INFO -->
      <div class="info-box">
        <div class="info-icon">
          💡
        </div>
        <div>
          <strong>
            Informasi Transaksi
          </strong>
          <p>
            Data transaksi mengambil informasi riil dari database backend Go & MariaDB.
          </p>
        </div>
      </div>

    </main>

  </div>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      // Disesuaikan dengan IP Hotspot Gateway laptop ASUS (192.168.137.1)
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      pesananList: [],
      pembayaranList: [],
      loading: false
    }
  },

  computed: {
    transaksiList() {
      return this.pesananList.map(pesanan => {
        const orderId = pesanan.id_order || pesanan.id
        const adaBayar = this.pembayaranList.find(
          p => String(p.id_order) === String(orderId) && p.status === 'Lunas'
        )

        return {
          ...pesanan,
          statusPembayaran: adaBayar ? 'Lunas' : (pesanan.status_pembayaran || 'Belum Lunas')
        }
      })
    },

    totalPendapatan() {
      return this.transaksiList
        .filter(item => item.statusPembayaran === 'Lunas')
        .reduce((total, item) => total + Number(item.total_harga || item.harga || item.total || 0), 0)
    },

    jumlahBelumLunas() {
      return this.transaksiList.filter(item => item.statusPembayaran === 'Belum Lunas').length
    },

    jumlahLunas() {
      return this.transaksiList.filter(item => item.statusPembayaran === 'Lunas').length
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
        const resOrders = await axios.get(`${this.API_BASE_URL}/api/orders`, this.getAuthHeaders())
        
        if (resOrders && resOrders.data && resOrders.data.data) {
          this.pesananList = resOrders.data.data
        } else if (resOrders && Array.isArray(resOrders.data)) {
          this.pesananList = resOrders.data
        } else {
          this.pesananList = []
        }

        const resPay = await axios.get(`${this.API_BASE_URL}/api/pembayaran`, this.getAuthHeaders()).catch(() => null)
        if (resPay && resPay.data && resPay.data.data) {
          this.pembayaranList = resPay.data.data
        } else if (resPay && Array.isArray(resPay.data)) {
          this.pembayaranList = resPay.data
        } else {
          this.pembayaranList = []
        }

      } catch (error) {
        console.error('Gagal mengambil data transaksi:', error)
      } finally {
        this.loading = false
      }
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID').format(Number(angka) || 0)
    },

    statusClass(status) {
      if (status === 'Menunggu') return 'waiting'
      if (status === 'Diproses' || status === 'Proses') return 'process'
      if (status === 'Selesai') return 'done'
      if (status === 'Diambil') return 'taken'
      return 'waiting'
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

.btn-primary {
  text-decoration: none;
  background: #e991b5;
  color: white;
  border-radius: 9px;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: bold;
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

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 13px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fde4ee;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.stat-icon.green { background: #dcf7e7; }
.stat-icon.yellow { background: #fff0c9; }
.stat-icon.blue { background: #e4efff; }

.stat-card p {
  margin: 0 0 4px;
  color: #999;
  font-size: 11px;
}

.stat-card h2 {
  margin: 0;
  font-size: 16px;
}

.table-card {
  background: white;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-header h2 {
  margin: 0 0 4px;
  font-size: 18px;
}

.table-header p {
  margin: 0;
  color: #999;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 950px;
}

th {
  background: #fff1f6;
  color: #74465a;
  font-size: 11px;
  text-align: left;
  padding: 10px;
}

td {
  border-bottom: 1px solid #f5e5eb;
  padding: 10px;
  font-size: 12px;
}

tbody tr:hover {
  background: #fffafb;
}

.id-badge {
  display: inline-block;
  background: #fde4ee;
  color: #d84f89;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
}

.total {
  color: #d84f89;
}

.badge {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
}

.lunas { background: #dcf7e7; color: #27804b; }
.belum { background: #fff0c9; color: #9a7412; }

.waiting { background: #fff0c9; color: #9a7412; }
.process { background: #e4efff; color: #3671b8; }
.done { background: #dcf7e7; color: #27804b; }
.taken { background: #eee1ff; color: #7444a8; }

.empty {
  text-align: center;
  padding: 45px 20px;
  color: #999;
}

.empty-icon {
  font-size: 42px;
  margin-bottom: 10px;
}

.empty h3 {
  margin: 0 0 6px;
  color: #555;
}

.empty p {
  margin: 0 0 15px;
  font-size: 12px;
}

.empty-button {
  display: inline-block;
  text-decoration: none;
  background: #e991b5;
  color: white;
  padding: 9px 13px;
  border-radius: 8px;
  font-size: 11px;
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