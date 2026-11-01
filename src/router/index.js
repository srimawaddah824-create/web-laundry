import { createRouter, createWebHistory } from 'vue-router'

// =====================================================
// LOGIN & REGISTER USER
// =====================================================

import LoginUser from '../views/loginuser.vue'
import RegisterUser from '../views/user/register.vue'

// =====================================================
// HALAMAN USER
// =====================================================

import BerandaUser from '../views/user/beranda.vue'
import PemesananUser from '../views/user/pemesanan.vue'
import PesananBerhasil from '../views/user/pesanan-berhasil.vue'
import RiwayatUser from '../views/user/riwayat.vue'
import ProfilUser from '../views/user/profil.vue'

// =====================================================
// LOGIN ADMIN
// =====================================================

import LoginAdmin from '../views/admin/loginadmin.vue'

// =====================================================
// HALAMAN ADMIN
// =====================================================

import DashboardAdmin from '../views/admin/dashboardadmin.vue'
import DataPelanggan from '../views/admin/datapelanggan.vue'
import DataLayanan from '../views/admin/datalayanan.vue'
import DataPesanan from '../views/admin/datapesanan.vue'
import Pembayaran from '../views/admin/pembayaran.vue'
import DataTransaksi from '../views/admin/datatransaksi.vue'

// =====================================================
// ROUTES
// =====================================================

const routes = [

  // ===================================================
  // USER
  // ===================================================

  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    name: 'LoginUser',
    component: LoginUser
  },

  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser
  },

  {
    path: '/beranda',
    name: 'BerandaUser',
    component: BerandaUser
  },

  {
    path: '/pemesanan',
    name: 'PemesananUser',
    component: PemesananUser
  },

  {
    path: '/pesanan-berhasil',
    name: 'PesananBerhasil',
    component: PesananBerhasil
  },

  {
    path: '/riwayat',
    name: 'RiwayatUser',
    component: RiwayatUser
  },

  {
    path: '/profil',
    name: 'ProfilUser',
    component: ProfilUser
  },

  // ===================================================
  // ADMIN
  // ===================================================

  {
    path: '/loginadmin',
    alias: '/login-admin',
    name: 'LoginAdmin',
    component: LoginAdmin
  },

  {
    path: '/dashboard',
    name: 'DashboardAdmin',
    component: DashboardAdmin
  },

  {
    path: '/pelanggan',
    alias: '/datapelanggan',
    name: 'DataPelanggan',
    component: DataPelanggan
  },

  {
    path: '/layanan',
    alias: '/datalayanan',
    name: 'DataLayanan',
    component: DataLayanan
  },

  {
    path: '/pesanan',
    alias: '/datapesanan',
    name: 'DataPesanan',
    component: DataPesanan
  },

  {
    path: '/pembayaran',
    name: 'Pembayaran',
    component: Pembayaran
  },

  {
    path: '/transaksi',
    alias: '/datatransaksi',
    name: 'DataTransaksi',
    component: DataTransaksi
  }

]

// =====================================================
// BUAT ROUTER
// =====================================================

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router