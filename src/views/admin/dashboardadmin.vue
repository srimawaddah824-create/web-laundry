<template>
  <div class="admin-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="logo">
        🧺
        <span>LaundryKu</span>
      </div>

      <nav class="menu">

        <router-link to="/dashboard" class="menu-item active">
          🏠
          <span>Dashboard</span>
        </router-link>

        <router-link to="/pelanggan" class="menu-item">
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
          <h1>Dashboard Admin</h1>
          <p>Selamat datang di sistem pengelolaan LaundryKu 👋</p>
        </div>

        <div class="admin-profile">
          👤
          <span>Admin</span>
        </div>

      </div>


      <!-- STATISTIK -->
      <div class="stats">

        <div class="stat-card">

          <div class="stat-icon">
            👥
          </div>

          <div>
            <p>Total Pelanggan</p>
            <h2>{{ totalPelanggan }}</h2>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            🧺
          </div>

          <div>
            <p>Total Layanan</p>
            <h2>{{ totalLayanan }}</h2>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            📦
          </div>

          <div>
            <p>Total Pesanan</p>
            <h2>{{ totalPesanan }}</h2>
          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            💳
          </div>

          <div>
            <p>Total Transaksi</p>
            <h2>{{ totalTransaksi }}</h2>
          </div>

        </div>

      </div>


      <!-- MENU CEPAT -->
      <div class="section-title">
        <h2>Akses Cepat</h2>
        <p>Kelola data laundry dengan mudah</p>
      </div>


      <div class="quick-menu">

        <router-link to="/pelanggan" class="quick-card">

          <div class="quick-icon">
            👥
          </div>

          <div>
            <h3>Data Pelanggan</h3>
            <p>Kelola data pelanggan</p>
          </div>

          <span class="arrow">→</span>

        </router-link>


        <router-link to="/layanan" class="quick-card">

          <div class="quick-icon">
            🧺
          </div>

          <div>
            <h3>Data Layanan</h3>
            <p>Kelola layanan laundry</p>
          </div>

          <span class="arrow">→</span>

        </router-link>


        <router-link to="/pesanan" class="quick-card">

          <div class="quick-icon">
            📦
          </div>

          <div>
            <h3>Data Pesanan</h3>
            <p>Kelola pesanan pelanggan</p>
          </div>

          <span class="arrow">→</span>

        </router-link>


        <router-link to="/pembayaran" class="quick-card">

          <div class="quick-icon">
            💳
          </div>

          <div>
            <h3>Pembayaran</h3>
            <p>Kelola pembayaran</p>
          </div>

          <span class="arrow">→</span>

        </router-link>


        <router-link to="/transaksi" class="quick-card">

          <div class="quick-icon">
            📊
          </div>

          <div>
            <h3>Data Transaksi</h3>
            <p>Lihat riwayat transaksi</p>
          </div>

          <span class="arrow">→</span>

        </router-link>

      </div>


      <!-- PESANAN TERBARU -->
      <div class="table-card">

        <div class="table-header">

          <div>
            <h2>Pesanan Terbaru</h2>
            <p>Daftar pesanan laundry terbaru</p>
          </div>

          <router-link to="/pesanan" class="see-all">
            Lihat Semua →
          </router-link>

        </div>


        <div v-if="pesananTerbaru.length === 0" class="empty">

          <div class="empty-icon">
            📦
          </div>

          <h3>Belum ada pesanan</h3>

          <p>
            Pesanan yang masuk akan tampil di sini.
          </p>

        </div>


        <div v-else class="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>No</th>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Berat</th>
                <th>Total</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(item, index) in pesananTerbaru"
                :key="item.id"
              >

                <td>
                  {{ index + 1 }}
                </td>

                <td>
                  <strong>
                    {{ item.id }}
                  </strong>
                </td>

                <td>
                  {{ item.pelanggan || '-' }}
                </td>

                <td>
                  {{ item.layanan || '-' }}
                </td>

                <td>
                  {{ item.berat || 0 }} Kg
                </td>

                <td>
                  Rp {{ formatRupiah(item.total) }}
                </td>

                <td>

                  <span
                    class="status-badge"
                    :class="getStatusClass(item.status)"
                  >
                    {{ item.status || 'Menunggu' }}
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>


      <!-- INFORMASI -->
      <div class="info-box">

        <div class="info-icon">
          💡
        </div>

        <div>

          <h3>Informasi</h3>

          <p>
            Gunakan menu di sebelah kiri untuk mengelola
            pelanggan, layanan, pesanan, pembayaran,
            dan transaksi.
          </p>

        </div>

      </div>

    </main>

  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


/* =========================
   DATA
========================= */

const pelangganList = ref([])
const layananList = ref([])
const pesananList = ref([])
const pembayaranList = ref([])


/* =========================
   LOAD DATA
========================= */

function loadData() {

  const pelanggan =
    localStorage.getItem('dataPelangganLaundry')

  const layanan =
    localStorage.getItem('dataLayananLaundry')

  const pesanan =
    localStorage.getItem('dataPesananLaundry')

  const pembayaran =
    localStorage.getItem('dataPembayaranLaundry')


  try {

    pelangganList.value =
      pelanggan ? JSON.parse(pelanggan) : []

  } catch {

    pelangganList.value = []

  }


  try {

    layananList.value =
      layanan ? JSON.parse(layanan) : []

  } catch {

    layananList.value = []

  }


  try {

    pesananList.value =
      pesanan ? JSON.parse(pesanan) : []

  } catch {

    pesananList.value = []

  }


  try {

    pembayaranList.value =
      pembayaran ? JSON.parse(pembayaran) : []

  } catch {

    pembayaranList.value = []

  }

}


/* =========================
   STATISTIK
========================= */

const totalPelanggan = computed(() => {

  return pelangganList.value.length

})


const totalLayanan = computed(() => {

  return layananList.value.length

})


const totalPesanan = computed(() => {

  return pesananList.value.length

})


const totalTransaksi = computed(() => {

  return pembayaranList.value.length

})


/* =========================
   PESANAN TERBARU
========================= */

const pesananTerbaru = computed(() => {

  return [...pesananList.value]
    .reverse()
    .slice(0, 5)

})


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(value) {

  return Number(value || 0)
    .toLocaleString('id-ID')

}


/* =========================
   STATUS
========================= */

function getStatusClass(status) {

  if (status === 'Menunggu') {
    return 'waiting'
  }

  if (status === 'Diproses') {
    return 'processing'
  }

  if (status === 'Selesai') {
    return 'finished'
  }

  if (status === 'Diambil') {
    return 'picked'
  }

  return 'waiting'

}


/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem('token')
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


/* =========================
   LAYOUT
========================= */

.admin-layout {

  min-height: 100vh;

  background: #fff7fa;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

}


/* =========================
   SIDEBAR
========================= */

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


.logo span {

  font-size: 18px;

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


.logout:hover {

  background: #fff7fa;

}


/* =========================
   CONTENT
========================= */

.content {

  margin-left: 210px;

  min-height: 100vh;

  padding: 28px 35px;

}


/* =========================
   HEADER
========================= */

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


.admin-profile {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 8px 13px;

  background: white;

  border-radius: 10px;

  color: #70495a;

  font-size: 13px;

  box-shadow:
    0 3px 12px rgba(0,0,0,0.04);

}


/* =========================
   STATS
========================= */

.stats {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 14px;

  margin-bottom: 25px;

}


.stat-card {

  background: white;

  border-radius: 14px;

  padding: 15px;

  display: flex;

  align-items: center;

  gap: 12px;

  box-shadow:
    0 3px 12px rgba(0,0,0,0.04);

}


.stat-icon {

  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #fff0f5;

  font-size: 19px;

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


/* =========================
   SECTION TITLE
========================= */

.section-title {

  margin-bottom: 12px;

}


.section-title h2 {

  margin: 0;

  color: #3f2934;

  font-size: 18px;

}


.section-title p {

  margin: 4px 0 0;

  color: #94727f;

  font-size: 12px;

}


/* =========================
   QUICK MENU
========================= */

.quick-menu {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  margin-bottom: 25px;

}


.quick-card {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 14px;

  background: white;

  border-radius: 12px;

  text-decoration: none;

  box-shadow:
    0 3px 12px rgba(0,0,0,0.04);

  transition: 0.2s;

}


.quick-card:hover {

  transform: translateY(-2px);

  box-shadow:
    0 5px 16px rgba(0,0,0,0.07);

}


.quick-icon {

  width: 38px;

  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #fff0f5;

  border-radius: 9px;

  font-size: 18px;

}


.quick-card h3 {

  margin: 0;

  color: #50333f;

  font-size: 13px;

}


.quick-card p {

  margin: 3px 0 0;

  color: #94727f;

  font-size: 10px;

}


.arrow {

  margin-left: auto;

  color: #d76891;

  font-size: 17px;

}


/* =========================
   TABLE CARD
========================= */

.table-card {

  background: white;

  border-radius: 15px;

  padding: 18px;

  box-shadow:
    0 3px 15px rgba(0,0,0,0.04);

}


.table-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

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


.see-all {

  text-decoration: none;

  color: #d05e87;

  font-size: 11px;

  font-weight: bold;

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

  border-bottom:
    1px solid #f4e5eb;

  color: #604653;

  font-size: 12px;

}


tbody tr:hover {

  background: #fffafd;

}


td strong {

  color: #c45b82;

}


/* =========================
   STATUS BADGE
========================= */

.status-badge {

  display: inline-block;

  padding: 5px 8px;

  border-radius: 8px;

  font-size: 10px;

  font-weight: bold;

}


.status-badge.waiting {

  background: #fff1c9;

  color: #927000;

}


.status-badge.processing {

  background: #e2edff;

  color: #3f70b5;

}


.status-badge.finished {

  background: #dff7e9;

  color: #348053;

}


.status-badge.picked {

  background: #eee2ff;

  color: #7047aa;

}


/* =========================
   EMPTY
========================= */

.empty {

  text-align: center;

  padding: 40px 20px;

}


.empty-icon {

  font-size: 38px;

  margin-bottom: 8px;

}


.empty h3 {

  margin: 0;

  color: #50333f;

  font-size: 15px;

}


.empty p {

  margin: 6px 0 0;

  color: #94727f;

  font-size: 11px;

}


/* =========================
   INFO
========================= */

.info-box {

  margin-top: 18px;

  padding: 13px 16px;

  border-radius: 12px;

  background: #fff0f5;

  display: flex;

  align-items: flex-start;

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

  line-height: 1.5;

}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1000px) {

  .quick-menu {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 850px) {

  .stats {

    grid-template-columns:
      repeat(2, 1fr);

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

    padding-left: 0;

    padding-right: 0;

  }

  .menu-item {

    justify-content: center;

  }

  .logout {

    justify-content: center;

  }

  .content {

    margin-left: 70px;

    padding: 20px;

  }

  .stats {

    grid-template-columns: 1fr;

  }

  .quick-menu {

    grid-template-columns: 1fr;

  }

}

</style>