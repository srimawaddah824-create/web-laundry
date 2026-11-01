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

        <router-link to="/pelanggan" class="menu-item active">
          👥
          <span>Data Pelanggan</span>
        </router-link>

        <router-link to="/layanan" class="menu-item">
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
          <h1>👥 Data Pelanggan</h1>
          <p>Kelola data pelanggan LaundryKu</p>
        </div>

        <button class="add-btn" @click="openTambah">
          + Tambah Pelanggan
        </button>
      </div>

      <!-- STATISTIK -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div>
            <p>Total Pelanggan</p>
            <h2>{{ pelangganList.length }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div>
            <p>Pelanggan Aktif</p>
            <h2>{{ pelangganList.length }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div>
            <p>Total Pesanan</p>
            <h2>{{ totalPesanan }}</h2>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-card">
        <div class="table-header">
          <div>
            <h2>Daftar Pelanggan</h2>
            <p>Data pelanggan yang terdaftar</p>
          </div>
        </div>

        <!-- SEARCH -->
        <div class="search-box">
          <span>🔍</span>
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama pelanggan..."
          />
        </div>

        <!-- EMPTY -->
        <div
          v-if="filteredPelanggan.length === 0"
          class="empty"
        >
          <div class="empty-icon">👥</div>
          <h3>
            {{
              pelangganList.length === 0
                ? 'Belum ada pelanggan'
                : 'Pelanggan tidak ditemukan'
            }}
          </h3>
          <p>
            {{
              pelangganList.length === 0
                ? 'Silakan tambahkan pelanggan terlebih dahulu.'
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
                <th>ID Pelanggan</th>
                <th>Nama Pelanggan</th>
                <th>No. Telepon</th>
                <th>Alamat</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in filteredPelanggan"
                :key="item.id_pelanggan || item.id"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>PLG-{{ item.id_pelanggan || item.id }}</strong>
                </td>
                <td>{{ item.nama }}</td>
                <td>{{ item.no_hp || item.telepon || '-' }}</td>
                <td>{{ item.alamat || '-' }}</td>
                <td>{{ item.email || '-' }}</td>
                <td>
                  <span class="status-badge">Aktif</span>
                </td>
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
                      @click="hapusPelanggan(item.id_pelanggan || item.id, item.nama)"
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
          <h3>Informasi Pelanggan</h3>
          <p>
            Tambahkan data pelanggan dengan lengkap agar proses pemesanan laundry lebih mudah.
          </p>
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
            <h2>{{ editMode ? 'Edit Pelanggan' : 'Tambah Pelanggan' }}</h2>
            <p>
              {{
                editMode
                  ? 'Ubah data pelanggan'
                  : 'Masukkan data pelanggan baru'
              }}
            </p>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="simpanPelanggan">
          <div class="form-group">
            <label>Nama Pelanggan</label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Masukkan nama pelanggan"
              required
            />
          </div>

          <div class="form-group">
            <label>No. Telepon</label>
            <input
              v-model="form.no_hp"
              type="text"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="Masukkan email pelanggan"
            />
          </div>

          <div class="form-group">
            <label>Alamat</label>
            <textarea
              v-model="form.alamat"
              placeholder="Masukkan alamat pelanggan"
              rows="3"
            ></textarea>
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
              {{ editMode ? 'Simpan Perubahan' : 'Simpan Pelanggan' }}
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

// BASE URL MENGGUNAKAN IP HOTSPOT ASUS (192.168.137.1)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080'

/* =========================
   DATA
========================= */
const pelangganList = ref([])
const pesananList = ref([])
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const editId = ref(null)

const form = ref({
  nama: '',
  no_hp: '',
  email: '',
  alamat: ''
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
   FETCH API DATA (BACKEND GO)
========================= */
async function loadData() {
  try {
    const [resPelanggan, resOrders] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/pelanggan`, getAuthHeaders()).catch(() => null),
      axios.get(`${API_BASE_URL}/api/orders`, getAuthHeaders()).catch(() => null)
    ])

    if (resPelanggan && resPelanggan.data && resPelanggan.data.data) {
      pelangganList.value = resPelanggan.data.data
    } else if (resPelanggan && Array.isArray(resPelanggan.data)) {
      pelangganList.value = resPelanggan.data
    } else {
      pelangganList.value = []
    }

    if (resOrders && resOrders.data && resOrders.data.data) {
      pesananList.value = resOrders.data.data
    } else if (resOrders && Array.isArray(resOrders.data)) {
      pesananList.value = resOrders.data
    } else {
      pesananList.value = []
    }

  } catch (error) {
    console.error('Gagal mengambil data dari server:', error)
    if (error.response && error.response.status === 401) {
      alert('Sesi telah berakhir. Silakan login kembali.')
      router.push('/loginadmin')
    }
  }
}

/* =========================
   TOTAL PESANAN
========================= */
const totalPesanan = computed(() => pesananList.value.length)

/* =========================
   FILTER PENCARIAN
========================= */
const filteredPelanggan = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  if (!keyword) return pelangganList.value

  return pelangganList.value.filter(item => {
    const nama = String(item.nama || '').toLowerCase()
    const telepon = String(item.no_hp || item.telepon || '').toLowerCase()
    const alamat = String(item.alamat || '').toLowerCase()

    return (
      nama.includes(keyword) ||
      telepon.includes(keyword) ||
      alamat.includes(keyword)
    )
  })
})

/* =========================
   RESET FORM
========================= */
function resetForm() {
  form.value = {
    nama: '',
    no_hp: '',
    email: '',
    alamat: ''
  }
  editId.value = null
}

/* =========================
   TAMBAH
========================= */
function openTambah() {
  resetForm()
  editMode.value = false
  showModal.value = true
}

/* =========================
   EDIT
========================= */
function openEdit(item) {
  editId.value = item.id_pelanggan || item.id
  form.value = {
    nama: item.nama || '',
    no_hp: item.no_hp || item.telepon || '',
    email: item.email || '',
    alamat: item.alamat || ''
  }
  editMode.value = true
  showModal.value = true
}

/* =========================
   SIMPAN (POST / PUT API)
========================= */
async function simpanPelanggan() {
  if (!form.value.nama.trim()) {
    alert('Nama pelanggan wajib diisi!')
    return
  }

  try {
    if (editMode.value) {
      await axios.put(
        `${API_BASE_URL}/api/pelanggan/${editId.value}`,
        {
          nama: form.value.nama.trim(),
          no_hp: form.value.no_hp.trim(),
          email: form.value.email.trim(),
          alamat: form.value.alamat.trim()
        },
        getAuthHeaders()
      )
      alert('Pelanggan berhasil diperbarui!')
    } else {
      await axios.post(
        `${API_BASE_URL}/api/pelanggan`,
        {
          nama: form.value.nama.trim(),
          no_hp: form.value.no_hp.trim(),
          email: form.value.email.trim(),
          alamat: form.value.alamat.trim()
        },
        getAuthHeaders()
      )
      alert('Pelanggan berhasil ditambahkan!')
    }

    closeModal()
    loadData()
  } catch (error) {
    console.error('Gagal menyimpan pelanggan:', error)
    alert('Gagal menyimpan data ke database.')
  }
}

/* =========================
   HAPUS (DELETE API)
========================= */
async function hapusPelanggan(id, nama) {
  const yakin = confirm(`Hapus pelanggan "${nama}"?`)
  if (!yakin) return

  try {
    await axios.delete(`${API_BASE_URL}/api/pelanggan/${id}`, getAuthHeaders())
    alert('Pelanggan berhasil dihapus!')
    loadData()
  } catch (error) {
    console.error('Gagal menghapus pelanggan:', error)
    alert('Gagal menghapus data pelanggan.')
  }
}

/* =========================
   CLOSE MODAL
========================= */
function closeModal() {
  showModal.value = false
  editMode.value = false
  resetForm()
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
  loadData()
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

.search-box input::placeholder {
  color: #b59ba6;
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

.status-badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 8px;
  background: #dff7e9;
  color: #348053;
  font-size: 10px;
  font-weight: bold;
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

.form-group input,
.form-group textarea {
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

.form-group input:focus,
.form-group textarea:focus {
  border-color: #e88caf;
}

.form-group textarea {
  resize: vertical;
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

  .logo {
    justify-content: center;
  }

  .menu-item {
    justify-content: center;
  }

  .content {
    margin-left: 70px;
    padding: 20px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .page-header {
    align-items: flex-start;
    gap: 12px;
    flex-direction: column;
  }
}
</style>