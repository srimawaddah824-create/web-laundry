<template>
  <div class="admin-page">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">🧺 <span>LaundryKu</span></div>

      <nav>
        <router-link to="/dashboard">🏠 Dashboard</router-link>
        <router-link to="/pelanggan">👥 Data Pelanggan</router-link>
        <router-link to="/layanan">🧼 Data Layanan</router-link>
        <router-link to="/pesanan" class="active">📦 Data Pesanan</router-link>
        <router-link to="/pembayaran">💳 Pembayaran</router-link>
        <router-link to="/transaksi">💰 Data Transaksi</router-link>
      </nav>

      <button class="logout" @click="logout">🚪 Logout</button>
    </aside>

    <!-- CONTENT -->
    <main class="content">

      <div class="header">
        <div>
          <h1>📦 Data Pesanan</h1>
          <p>Kelola semua pesanan laundry pelanggan</p>
        </div>

        <button class="btn-primary" @click="bukaTambah">
          + Tambah Pesanan
        </button>
      </div>

      <!-- STATISTIK -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div>
            <p>Total Pesanan</p>
            <h2>{{ pesananList.length }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div>
            <p>Menunggu</p>
            <h2>{{ jumlahStatus('Menunggu') }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div>
            <p>Diproses</p>
            <h2>{{ jumlahStatus('Diproses') + jumlahStatus('Proses') }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div>
            <p>Selesai</p>
            <h2>{{ jumlahStatus('Selesai') }}</h2>
          </div>
        </div>
      </div>

      <!-- TABEL -->
      <div class="table-card">

        <div class="table-header">
          <div>
            <h2>Daftar Pesanan</h2>
            <p>Data pesanan laundry pelanggan dari database</p>
          </div>

          <button class="btn-refresh" @click="ambilData">
            🔄 Refresh
          </button>
        </div>

        <div v-if="loading" class="empty">
          <p>Memuat data pesanan...</p>
        </div>

        <div v-else-if="pesananList.length === 0" class="empty">
          <div>📦</div>
          <h3>Belum ada pesanan</h3>
          <p>Silakan tambahkan pesanan terlebih dahulu.</p>
        </div>

        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Order</th>
                <th>ID Pelanggan</th>
                <th>Layanan</th>
                <th>Berat</th>
                <th>Total Harga</th>
                <th>Status Order</th>
                <th>Aksi / Ubah Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in pesananList"
                :key="item.id_order || item.id"
              >
                <td>{{ index + 1 }}</td>

                <td>
                  <strong>PSN-{{ item.id_order || item.id }}</strong>
                </td>

                <td>PLG-{{ item.id_pelanggan }}</td>

                <td>{{ item.layanan || (item.id_layanan ? 'LAY-' + item.id_layanan : '-') }}</td>

                <td>{{ item.total_berat || item.berat || 0 }} Kg</td>

                <td>
                  <strong>
                    Rp {{ formatRupiah(item.total_harga || item.harga || item.total) }}
                  </strong>
                </td>

                <td>
                  <span
                    class="badge"
                    :class="statusClass(item.status_order || item.status)"
                  >
                    {{ item.status_order || item.status || 'Menunggu' }}
                  </span>
                </td>

                <td>
                  <div class="actions">
                    <!-- DROPDOWN UBAH STATUS LANGSUNG KE BACKEND -->
                    <select 
                      class="select-status"
                      :value="item.status_order || item.status"
                      @change="ubahStatusOrder(item.id_order || item.id, $event.target.value)"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Proses">Proses</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Diambil">Diambil</option>
                    </select>

                    <button
                      class="btn-payment"
                      @click="kePembayaran(item)"
                      title="Proses Pembayaran"
                    >
                      💳
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </main>

    <!-- MODAL TAMBAH PESANAN -->
    <div v-if="showModal" class="modal-overlay" @click.self="tutupModal">

      <div class="modal">

        <div class="modal-header">
          <div>
            <h2>➕ Tambah Pesanan Baru</h2>
            <p>Isi data pesanan laundry ke backend</p>
          </div>

          <button class="close" @click="tutupModal">✕</button>
        </div>

        <form @submit.prevent="simpanPesanan">

          <!-- PELANGGAN -->
          <div class="form-group">
            <label>Pilih Pelanggan</label>
            <select v-model="form.id_pelanggan" required>
              <option value="">-- Pilih Pelanggan --</option>
              <option
                v-for="pelanggan in pelangganList"
                :key="pelanggan.id_pelanggan || pelanggan.id"
                :value="pelanggan.id_pelanggan || pelanggan.id"
              >
                {{ pelanggan.nama }} (PLG-{{ pelanggan.id_pelanggan || pelanggan.id }})
              </option>
            </select>
          </div>

          <!-- LAYANAN -->
          <div class="form-group">
            <label>Pilih Layanan</label>
            <select
              v-model="form.id_layanan"
              @change="pilihLayanan"
              required
            >
              <option value="">-- Pilih Layanan --</option>
              <option
                v-for="layanan in layananList"
                :key="layanan.id_layanan || layanan.id"
                :value="layanan.id_layanan || layanan.id"
              >
                {{ layanan.nama_layanan || layanan.nama }} - Rp {{ formatRupiah(layanan.harga) }}/Kg
              </option>
            </select>
          </div>

          <!-- HARGA -->
          <div class="form-group">
            <label>Harga per Kg (Rp)</label>
            <input
              v-model="form.harga"
              type="number"
              readonly
            />
          </div>

          <!-- BERAT -->
          <div class="form-group">
            <label>Berat Laundry (Kg)</label>
            <input
              v-model.number="form.total_berat"
              type="number"
              min="1"
              placeholder="Masukkan berat dalam kg"
              required
              @input="hitungTotal"
            />
          </div>

          <!-- TOTAL -->
          <div class="total-box">
            <span>Total Bayar</span>
            <strong>Rp {{ formatRupiah(form.total_harga) }}</strong>
          </div>

          <!-- BUTTON -->
          <div class="modal-actions">
            <button
              type="button"
              class="btn-cancel"
              @click="tutupModal"
            >
              Batal
            </button>

            <button
              type="submit"
              class="btn-save"
            >
              💾 Simpan Pesanan
            </button>
          </div>

        </form>

      </div>

    </div>

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
      pelangganList: [],
      layananList: [],
      loading: false,
      showModal: false,
      form: {
        id_pelanggan: '',
        id_layanan: '',
        harga: 0,
        total_berat: 1,
        total_harga: 0
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
        const resOrders = await axios.get(`${this.API_BASE_URL}/api/orders`, this.getAuthHeaders())
        const resLayanan = await axios.get(`${this.API_BASE_URL}/api/layanan`, this.getAuthHeaders())
        const resPelanggan = await axios.get(`${this.API_BASE_URL}/api/pelanggan`, this.getAuthHeaders())

        if (resOrders && resOrders.data && resOrders.data.data) {
          this.pesananList = resOrders.data.data
        } else if (resOrders && Array.isArray(resOrders.data)) {
          this.pesananList = resOrders.data
        } else {
          this.pesananList = []
        }

        this.layananList = resLayanan.data.data || resLayanan.data || []
        this.pelangganList = resPelanggan.data.data || resPelanggan.data || []

      } catch (error) {
        console.error('Gagal memuat data dari API:', error)
      } finally {
        this.loading = false
      }
    },

    bukaTambah() {
      this.form = {
        id_pelanggan: '',
        id_layanan: '',
        harga: 0,
        total_berat: 1,
        total_harga: 0
      }
      this.showModal = true
    },

    pilihLayanan() {
      const selected = this.layananList.find(
        item => String(item.id_layanan || item.id) === String(this.form.id_layanan)
      )

      if (!selected) {
        this.form.harga = 0
        this.form.total_harga = 0
        return
      }

      this.form.harga = Number(selected.harga || 0)
      this.hitungTotal()
    },

    hitungTotal() {
      const harga = Number(this.form.harga) || 0
      const berat = Number(this.form.total_berat) || 0
      this.form.total_harga = harga * berat
    },

    async simpanPesanan() {
      this.hitungTotal()
      try {
        await axios.post(
          `${this.API_BASE_URL}/api/orders`,
          {
            id_pelanggan: Number(this.form.id_pelanggan),
            id_layanan: Number(this.form.id_layanan),
            total_berat: Number(this.form.total_berat),
            total_harga: Number(this.form.total_harga)
          },
          this.getAuthHeaders()
        )

        alert('Pesanan berhasil ditambahkan! 💗')
        this.tutupModal()
        this.ambilData()
      } catch (error) {
        console.error('Gagal menyimpan pesanan:', error)
        alert('Gagal membuat pesanan baru ke server.')
      }
    },

    async ubahStatusOrder(idOrder, statusBaru) {
      try {
        await axios.put(
          `${this.API_BASE_URL}/api/orders/status/${idOrder}`,
          { status_order: statusBaru },
          this.getAuthHeaders()
        )
        alert(`Status pesanan PSN-${idOrder} berhasil diubah menjadi: ${statusBaru}`)
        this.ambilData()
      } catch (error) {
        console.error('Gagal memperbarui status order:', error)
        alert('Gagal memperbarui status ke database.')
      }
    },

    kePembayaran(item) {
      this.$router.push({
        path: '/pembayaran',
        query: {
          pesananId: item.id_order || item.id
        }
      })
    },

    tutupModal() {
      this.showModal = false
    },

    jumlahStatus(status) {
      return this.pesananList.filter(
        item => (item.status_order || item.status) === status
      ).length
    },

    statusClass(status) {
      if (status === 'Menunggu') return 'waiting'
      if (status === 'Diproses' || status === 'Proses') return 'process'
      if (status === 'Selesai') return 'done'
      if (status === 'Diambil') return 'taken'
      return 'waiting'
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

/* SIDEBAR */
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
  color: #63384a;
  padding: 9px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 12px;
}

/* CONTENT */
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
  background: #e991b5;
  color: white;
  border: none;
  border-radius: 9px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

/* STATS */
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

.stat-card p {
  margin: 0 0 4px;
  color: #999;
  font-size: 11px;
}

.stat-card h2 {
  margin: 0;
  font-size: 16px;
}

/* TABLE */
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

.btn-refresh {
  background: #fff0f5;
  border: 1px solid #f3c6d7;
  color: #9a5270;
  border-radius: 8px;
  padding: 8px 11px;
  cursor: pointer;
  font-size: 11px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
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

/* BADGES */
.badge {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
}

.waiting { background: #fff0c9; color: #9a7412; }
.process { background: #e4efff; color: #3671b8; }
.done { background: #dcf7e7; color: #27804b; }
.taken { background: #eee1ff; color: #7444a8; }

/* ACTION */
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.select-status {
  padding: 5px 8px;
  border: 1px solid #efdce5;
  border-radius: 6px;
  font-size: 11px;
  outline: none;
  background: #fffafd;
}

.actions button {
  width: 29px;
  height: 29px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13px;
}

.btn-payment { background: #e4efff; }

/* EMPTY */
.empty {
  text-align: center;
  padding: 50px 20px;
  color: #999;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(70,30,45,.35);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  background: white;
  width: 500px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.close {
  border: none;
  background: #fff0f5;
  color: #9a5270;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 13px;
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

.total-box {
  background: #fff0f5;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 13px;
}

.total-box span { font-size: 12px; color: #777; }
.total-box strong { color: #d45f8c; font-size: 16px; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
}

.btn-cancel,
.btn-save {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
}

.btn-cancel { background: #eee; color: #555; }
.btn-save { background: #e991b5; color: white; font-weight: bold; }
</style>