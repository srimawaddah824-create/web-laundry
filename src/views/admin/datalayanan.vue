<template>
  <div class="admin-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="logo">
        🧺
        <span>LaundryKu</span>
      </div>

      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">
          🏠
          <span>Dashboard</span>
        </router-link>

        <router-link to="/pelanggan" class="menu-item">
          👥
          <span>Data Pelanggan</span>
        </router-link>

        <router-link to="/layanan" class="menu-item active">
          🧺
          <span>Data Layanan</span>
        </router-link>

        <router-link to="/pesanan" class="menu-item">
          📦
          <span>Data Pesanan</span>
        </router-link>

        <router-link to="/pembayaran" class="menu-item">
          💳
          <span>Pembayaran</span>
        </router-link>

        <router-link to="/transaksi" class="menu-item">
          📊
          <span>Data Transaksi</span>
        </router-link>
      </nav>

      <button class="logout" @click="logout">
        🚪
        <span>Logout</span>
      </button>
    </aside>

    <!-- CONTENT -->
    <main class="content">

      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1>🧺 Data Layanan</h1>
          <p>Lihat daftar seluruh layanan laundry</p>
        </div>

        <button class="add-btn" @click="openTambah">
          + Tambah Layanan
        </button>
      </div>

      <!-- STATISTIK -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">🧺</div>
          <div>
            <p>Total Layanan</p>
            <h2>{{ layananList.length }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏷️</div>
          <div>
            <p>Harga Terendah</p>
            <h2>Rp {{ minHarga.toLocaleString('id-ID') }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💎</div>
          <div>
            <p>Harga Tertinggi</p>
            <h2>Rp {{ maxHarga.toLocaleString('id-ID') }}</h2>
          </div>
        </div>
      </div>

      <!-- TABLE CARD -->
      <div class="table-card">
        <div class="table-header">
          <div>
            <h2>Daftar Layanan</h2>
            <p>Kelola jenis paket dan harga layanan</p>
          </div>
        </div>

        <!-- SEARCH -->
        <div class="search-box">
          <span>🔍</span>
          <input
            v-model="search"
            type="text"
            placeholder="Cari layanan..."
          />
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="empty">
          <p>Memuat data layanan...</p>
        </div>

        <!-- EMPTY -->
        <div
          v-else-if="filteredLayanan.length === 0"
          class="empty"
        >
          <div class="empty-icon">🧺</div>
          <h3>
            {{
              layananList.length === 0
                ? 'Belum ada layanan'
                : 'Layanan tidak ditemukan'
            }}
          </h3>
          <p>
            {{
              layananList.length === 0
                ? 'Silakan tambahkan layanan terlebih dahulu.'
                : 'Coba gunakan kata pencarian lain.'
            }}
          </p>
        </div>

        <!-- TABLE -->
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Layanan</th>
                <th>Harga</th>
                <th>Estimasi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in filteredLayanan"
                :key="item.id_layanan || item.id"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ item.nama_layanan || item.nama }}</strong>
                </td>
                <td>Rp {{ Number(item.harga || 0).toLocaleString('id-ID') }}</td>
                <td>{{ item.estimasi || '-' }}</td>
                <td>
                  <div class="actions">
                    <button
                      class="edit-btn"
                      @click="openEdit(item)"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      class="delete-btn"
                      @click="hapusLayanan(item.id_layanan || item.id, item.nama_layanan || item.nama)"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- INFO -->
      <div class="info-box">
        <div class="info-icon">💡</div>
        <div>
          <h3>Informasi Layanan</h3>
          <p>Daftar harga dan estimasi waktu pengerjaan untuk setiap jenis layanan laundry.</p>
        </div>
      </div>

    </main>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal">
        <div class="modal-header">
          <div>
            <h2>{{ editMode ? 'Edit Layanan' : 'Tambah Layanan' }}</h2>
            <p>{{ editMode ? 'Ubah detail layanan' : 'Masukkan layanan baru' }}</p>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="simpanLayanan">
          <div class="form-group">
            <label>Nama Layanan</label>
            <input
              v-model="form.nama_layanan"
              type="text"
              placeholder="Contoh: Cuci Komplit / Cuci Kering"
              required
            />
          </div>

          <div class="form-group">
            <label>Harga (Rp)</label>
            <input
              v-model.number="form.harga"
              type="number"
              placeholder="Masukkan harga layanan"
              required
            />
          </div>

          <div class="form-group">
            <label>Estimasi Waktu</label>
            <input
              v-model="form.estimasi"
              type="text"
              placeholder="Contoh: 1-2 Hari / 6 Jam"
            />
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="cancel-btn"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="save-btn"
            >
              {{ editMode ? 'Simpan Perubahan' : 'Simpan Layanan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// BASE URL DENGAN IP HOTSPOT ASUS (192.168.137.1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080'

/* =========================
   DATA STATE
========================= */
const layananList = ref([])
const search = ref('')
const loading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const editId = ref(null)

const form = ref({
  nama_layanan: '',
  harga: '',
  estimasi: ''
})

/* =========================
   GET HEADER AUTHORIZATION
========================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

/* =========================
   FETCH DATA LAYANAN
========================= */
async function fetchLayanan() {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/api/layanan`, getAuthHeaders())
    
    if (response.data && response.data.data) {
      layananList.value = response.data.data
    } else if (Array.isArray(response.data)) {
      layananList.value = response.data
    } else {
      layananList.value = []
    }
  } catch (error) {
    console.error('Gagal mengambil data layanan:', error)
  } finally {
    loading.value = false
  }
}

/* =========================
   STATISTIK HARGA
========================= */
const minHarga = computed(() => {
  if (layananList.value.length === 0) return 0
  return Math.min(...layananList.value.map(item => Number(item.harga) || 0))
})

const maxHarga = computed(() => {
  if (layananList.value.length === 0) return 0
  return Math.max(...layananList.value.map(item => Number(item.harga) || 0))
})

/* =========================
   FILTER PENCARIAN
========================= */
const filteredLayanan = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  if (!keyword) return layananList.value

  return layananList.value.filter(item => {
    const nama = String(item.nama_layanan || item.nama || '').toLowerCase()
    const estimasi = String(item.estimasi || '').toLowerCase()
    return nama.includes(keyword) || estimasi.includes(keyword)
  })
})

/* =========================
   RESET FORM & MODAL
========================= */
function resetForm() {
  form.value = {
    nama_layanan: '',
    harga: '',
    estimasi: ''
  }
  editId.value = null
}

function openTambah() {
  resetForm()
  editMode.value = false
  showModal.value = true
}

function openEdit(item) {
  editId.value = item.id_layanan || item.id
  form.value = {
    nama_layanan: item.nama_layanan || item.nama || '',
    harga: item.harga || '',
    estimasi: item.estimasi || ''
  }
  editMode.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editMode.value = false
  resetForm()
}

/* =========================
   SIMPAN (CREATE / UPDATE)
========================= */
async function simpanLayanan() {
  if (!form.value.nama_layanan.trim()) {
    alert('Nama layanan wajib diisi!')
    return
  }

  try {
    if (editMode.value) {
      await axios.put(
        `${API_BASE_URL}/api/layanan/${editId.value}`,
        {
          nama_layanan: form.value.nama_layanan.trim(),
          harga: Number(form.value.harga),
          estimasi: form.value.estimasi.trim()
        },
        getAuthHeaders()
      )
      alert('Layanan berhasil diperbarui!')
    } else {
      await axios.post(
        `${API_BASE_URL}/api/layanan`,
        {
          nama_layanan: form.value.nama_layanan.trim(),
          harga: Number(form.value.harga),
          estimasi: form.value.estimasi.trim()
        },
        getAuthHeaders()
      )
      alert('Layanan berhasil ditambahkan!')
    }

    closeModal()
    fetchLayanan()
  } catch (error) {
    console.error('Gagal menyimpan layanan:', error)
    alert('Gagal menyimpan data layanan.')
  }
}

/* =========================
   HAPUS LAYANAN
========================= */
async function hapusLayanan(id, nama) {
  const yakin = confirm(`Hapus layanan "${nama}"?`)
  if (!yakin) return

  try {
    await axios.delete(`${API_BASE_URL}/api/layanan/${id}`, getAuthHeaders())
    alert('Layanan berhasil dihapus!')
    fetchLayanan()
  } catch (error) {
    console.error('Gagal menghapus layanan:', error)
    alert('Gagal menghapus data layanan.')
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('admin_token')
  router.push('/loginadmin')
}

/* =========================
   MOUNTED
========================= */
onMounted(() => {
  fetchLayanan()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.admin-layout {
  min-height: 100vh;
  background: #fff7fa;
  font-family: Arial, Helvetica, sans-serif;
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
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 8px 25px;
  color: #5d3445;
  font-size: 19px;
  font-weight: bold;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 9px;
  text-decoration: none;
  color: #70495a;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.55);
}

.menu-item.active {
  background: #e88caf;
  color: white;
}

.logout {
  margin-top: auto;
  border: none;
  border-radius: 9px;
  padding: 10px;
  background: white;
  color: #70495a;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.content {
  margin-left: 210px;
  min-height: 100vh;
  padding: 28px 35px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.page-header h1 {
  margin: 0;
  font-size: 25px;
  color: #3f2934;
}

.page-header p {
  margin: 5px 0 0;
  color: #94727f;
  font-size: 13px;
}

.add-btn {
  border: none;
  background: #e88caf;
  color: white;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.add-btn:hover {
  background: #db789f;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #fff0f5;
  font-size: 18px;
}

.stat-card p {
  margin: 0 0 4px;
  color: #94727f;
  font-size: 11px;
}

.stat-card h2 {
  margin: 0;
  color: #3f2934;
  font-size: 18px;
}

.table-card {
  background: white;
  border-radius: 15px;
  padding: 18px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.04);
}

.table-header {
  margin-bottom: 15px;
}

.table-header h2 {
  margin: 0;
  color: #3f2934;
  font-size: 18px;
}

.table-header p {
  margin: 4px 0 0;
  color: #94727f;
  font-size: 12px;
}

.search-box {
  width: 100%;
  max-width: 350px;
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  margin-bottom: 15px;
  border: 1px solid #f0dce4;
  border-radius: 9px;
  background: #fffafd;
}

.search-box span {
  font-size: 13px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #50333f;
  font-size: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 10px;
  background: #fff0f5;
  color: #70495a;
  text-align: left;
  font-size: 11px;
  white-space: nowrap;
}

td {
  padding: 10px;
  border-bottom: 1px solid #f4e5eb;
  color: #604653;
  font-size: 12px;
}

tbody tr:hover {
  background: #fffafd;
}

td strong {
  color: #c45b82;
}

.actions {
  display: flex;
  gap: 6px;
}

.edit-btn,
.delete-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.edit-btn {
  background: #eee2ff;
}

.delete-btn {
  background: #ffe1e8;
}

.empty {
  text-align: center;
  padding: 45px 20px;
}

.empty-icon {
  font-size: 40px;
}

.empty h3 {
  margin: 10px 0 5px;
  color: #50333f;
  font-size: 15px;
}

.empty p {
  margin: 0;
  color: #94727f;
  font-size: 12px;
}

.info-box {
  margin-top: 18px;
  padding: 13px 16px;
  border-radius: 12px;
  background: #fff0f5;
  display: flex;
  gap: 12px;
}

.info-icon {
  font-size: 20px;
}

.info-box h3 {
  margin: 0 0 5px;
  color: #70495a;
  font-size: 13px;
}

.info-box p {
  margin: 0;
  color: #86616f;
  font-size: 11px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(70, 40, 55, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #3f2934;
  font-size: 19px;
}

.modal-header p {
  margin: 5px 0 0;
  color: #94727f;
  font-size: 11px;
}

.close-btn {
  border: none;
  background: #fff0f5;
  color: #c45b82;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #604653;
  font-size: 12px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #efdce5;
  border-radius: 8px;
  outline: none;
  color: #50333f;
  background: #fffafd;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

.form-group input:focus {
  border-color: #e88caf;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.cancel-btn,
.save-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.cancel-btn {
  background: #f4eef1;
  color: #70495a;
}

.save-btn {
  background: #e88caf;
  color: white;
}

@media (max-width: 850px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 70px;
    padding: 18px 8px;
  }

  .logo span,
  .menu-item span,
  .logout span {
    display: none;
  }

  .content {
    margin-left: 70px;
    padding: 20px;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>