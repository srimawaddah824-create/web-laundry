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

        <router-link to="/status-laundry" class="menu-item active">
          🔄
          <span>Status Laundry</span>
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

      <div class="page-header">

        <div>
          <h1>📋 Status Laundry</h1>
          <p>Pantau status proses laundry pelanggan</p>
        </div>

        <button class="refresh-btn" @click="loadData">
          🔄 Refresh
        </button>

      </div>


      <!-- STATISTIK -->
      <div class="stats">

        <div class="stat-card">
          <div class="icon waiting-icon">⌛</div>
          <div>
            <p>Menunggu</p>
            <h2>{{ totalMenunggu }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon processing-icon">🔄</div>
          <div>
            <p>Diproses</p>
            <h2>{{ totalDiproses }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon finished-icon">✅</div>
          <div>
            <p>Selesai</p>
            <h2>{{ totalSelesai }}</h2>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon picked-icon">📦</div>
          <div>
            <p>Diambil</p>
            <h2>{{ totalDiambil }}</h2>
          </div>
        </div>

      </div>


      <!-- TABLE -->
      <div class="table-card">

        <div class="table-header">

          <div>
            <h2>Daftar Status Laundry</h2>
            <p>Lihat perkembangan setiap pesanan</p>
          </div>

          <router-link to="/pesanan" class="add-btn">
            + Tambah Pesanan
          </router-link>

        </div>


        <div v-if="pesananList.length === 0" class="empty">

          <div class="empty-icon">📦</div>

          <h3>Belum ada pesanan</h3>

          <p>
            Silakan tambahkan pesanan terlebih dahulu.
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
                <th>Status Laundry</th>
              </tr>

            </thead>


            <tbody>

              <tr
                v-for="(item, index) in pesananList"
                :key="item.id"
              >

                <td>{{ index + 1 }}</td>

                <td>
                  <strong>{{ item.id }}</strong>
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

                  <select
                    v-model="item.status"
                    class="status-select"
                    :class="getStatusClass(item.status)"
                    @change="ubahStatus(item)"
                  >

                    <option value="Menunggu">
                      Menunggu
                    </option>

                    <option value="Diproses">
                      Diproses
                    </option>

                    <option value="Selesai">
                      Selesai
                    </option>

                    <option value="Diambil">
                      Diambil
                    </option>

                  </select>

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

          <h3>Informasi Status Laundry</h3>

          <p>
            Menunggu → pesanan belum diproses.
          </p>

          <p>
            Diproses → laundry sedang dikerjakan.
          </p>

          <p>
            Selesai → laundry sudah selesai.
          </p>

          <p>
            Diambil → laundry sudah diambil pelanggan.
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

const pesananList = ref([])


function loadData() {

  const data = localStorage.getItem('dataPesananLaundry')

  if (data) {

    try {

      pesananList.value = JSON.parse(data)

    } catch (error) {

      console.error(error)

      pesananList.value = []

    }

  } else {

    pesananList.value = []

  }

}


const totalMenunggu = computed(() => {

  return pesananList.value.filter(
    item => item.status === 'Menunggu'
  ).length

})


const totalDiproses = computed(() => {

  return pesananList.value.filter(
    item => item.status === 'Diproses'
  ).length

})


const totalSelesai = computed(() => {

  return pesananList.value.filter(
    item => item.status === 'Selesai'
  ).length

})


const totalDiambil = computed(() => {

  return pesananList.value.filter(
    item => item.status === 'Diambil'
  ).length

})


function ubahStatus(item) {

  localStorage.setItem(
    'dataPesananLaundry',
    JSON.stringify(pesananList.value)
  )

}


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

  return ''

}


function formatRupiah(value) {

  return Number(value || 0).toLocaleString('id-ID')

}


function logout() {

  router.push('/login')

}


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
  background: rgba(255,255,255,0.55);
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


/* CONTENT */

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


.refresh-btn {
  border: 1px solid #f0aac5;

  background: white;

  color: #c45b82;

  padding: 9px 15px;

  border-radius: 9px;

  cursor: pointer;
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

  border-radius: 14px;

  padding: 14px;

  display: flex;
  align-items: center;

  gap: 12px;

  box-shadow: 0 3px 12px rgba(0,0,0,0.04);
}


.icon {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  font-size: 18px;
}


.waiting-icon {
  background: #fff1c9;
}

.processing-icon {
  background: #e2edff;
}

.finished-icon {
  background: #dff7e9;
}

.picked-icon {
  background: #eee2ff;
}


.stat-card p {
  margin: 0 0 4px;

  color: #94727f;

  font-size: 11px;
}


.stat-card h2 {
  margin: 0;

  font-size: 16px;

  color: #3f2934;
}


/* TABLE */

.table-card {
  background: white;

  border-radius: 15px;

  padding: 18px;

  box-shadow: 0 3px 15px rgba(0,0,0,0.04);
}


.table-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
}


.table-header h2 {
  margin: 0;

  font-size: 18px;

  color: #3f2934;
}


.table-header p {
  margin: 4px 0 0;

  font-size: 12px;

  color: #94727f;
}


.add-btn {
  text-decoration: none;

  background: #e88caf;

  color: white;

  padding: 9px 14px;

  border-radius: 8px;

  font-size: 12px;
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
}


td {
  padding: 10px;

  border-bottom: 1px solid #f4e5eb;

  color: #604653;

  font-size: 12px;
}


td strong {
  color: #c45b82;
}


/* STATUS */

.status-select {
  border: none;

  outline: none;

  padding: 6px 9px;

  border-radius: 8px;

  font-size: 10px;

  font-weight: bold;

  cursor: pointer;
}


.status-select.waiting {
  background: #fff1c9;
  color: #927000;
}


.status-select.processing {
  background: #e2edff;
  color: #3f70b5;
}


.status-select.finished {
  background: #dff7e9;
  color: #348053;
}


.status-select.picked {
  background: #eee2ff;
  color: #7047aa;
}


/* EMPTY */

.empty {
  text-align: center;

  padding: 45px;
}


.empty-icon {
  font-size: 40px;
}


.empty h3 {
  margin: 10px 0 5px;

  color: #50333f;
}


.empty p {
  margin: 0;

  color: #94727f;

  font-size: 12px;
}


/* INFO */

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
  margin: 0 0 7px;

  color: #70495a;

  font-size: 13px;
}


.info-box p {
  margin: 3px 0;

  color: #86616f;

  font-size: 11px;
}


@media (max-width: 900px) {

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

}


@media (max-width: 600px) {

  .sidebar {
    width: 70px;
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

}

</style>