<template>
  <div class="pemesanan-page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="logo">
        Laundry<span>Ku</span>
      </div>

      <div class="menu">
        <router-link to="/beranda">Beranda</router-link>
        <router-link to="/pemesanan" class="active">Pemesanan</router-link>
        <router-link to="/riwayat">Riwayat</router-link>
        <router-link to="/profil">Profil</router-link>
      </div>

      <button class="logout" @click="logout">
        Logout
      </button>
    </nav>

    <!-- CONTENT -->
    <main class="content">

      <div class="title">
        <h1>Form Pemesanan</h1>
        <p>Isi data pesanan laundry kamu dengan benar</p>
      </div>

      <!-- FORM CARD -->
      <div class="form-card">
        <form @submit.prevent="buatPesanan" class="form-grid">

          <!-- NAMA -->
          <div class="form-group">
            <label>Nama Pelanggan</label>
            <input
              type="text"
              v-model="form.nama"
              placeholder="Masukkan nama pelanggan"
              required
            />
          </div>

          <!-- NO HP -->
          <div class="form-group">
            <label>No. Handphone</label>
            <input
              type="text"
              v-model="form.no_hp"
              placeholder="Masukkan nomor handphone"
              required
            />
          </div>

          <!-- LAYANAN -->
          <div class="form-group">
            <label>Layanan Laundry</label>
            <select v-model="form.id_layanan" required>
              <option value="">Pilih layanan laundry</option>
              <option
                v-for="item in layananList"
                :key="item.id_layanan || item.id"
                :value="item.id_layanan || item.id"
              >
                {{ item.nama_layanan || item.nama }} - Rp{{ formatRupiahSimple(item.harga) }}/kg
              </option>
            </select>
          </div>

          <!-- BERAT -->
          <div class="form-group">
            <label>Berat Laundry (kg)</label>
            <input
              type="number"
              v-model.number="form.berat"
              min="1"
              placeholder="Contoh: 3"
              required
            />
          </div>

          <!-- ANTAR JEMPUT -->
          <div class="form-group full">
            <label>Antar Jemput</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  value="Ya"
                  v-model="form.antar_jemput"
                />
                <span>Ya</span>
              </label>

              <label class="radio-option">
                <input
                  type="radio"
                  value="Tidak"
                  v-model="form.antar_jemput"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>

          <!-- ALAMAT -->
          <div
            class="form-group full"
            v-if="form.antar_jemput === 'Ya'"
          >
            <label>Alamat Antar Jemput</label>
            <textarea
              v-model="form.alamat"
              rows="3"
              placeholder="Masukkan alamat lengkap untuk antar jemput"
              required
            ></textarea>
          </div>

          <!-- PEMBAYARAN -->
          <div class="form-group full">
            <label>Metode Pembayaran</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  type="radio"
                  value="Cash"
                  v-model="form.pembayaran"
                />
                <span>Cash</span>
              </label>

              <label class="radio-option">
                <input
                  type="radio"
                  value="Transfer"
                  v-model="form.pembayaran"
                />
                <span>Transfer</span>
              </label>
            </div>
          </div>

          <!-- CATATAN -->
          <div class="form-group full">
            <label>Catatan</label>
            <textarea
              v-model="form.catatan"
              rows="3"
              placeholder="Tambahkan catatan jika diperlukan"
            ></textarea>
          </div>

          <!-- TOTAL -->
          <div class="total-box full">
            <div>
              <span>Total Pembayaran</span>
              <strong>{{ formatRupiah(total) }}</strong>
            </div>
          </div>

          <!-- BUTTON -->
          <div class="form-group full">
            <button
              type="submit"
              class="pesan-button"
              :disabled="loading"
            >
              {{ loading ? 'Memproses Pesanan...' : 'Buat Pesanan' }}
            </button>
          </div>

        </form>
      </div>

    </main>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "PemesananUser",

  data() {
    return {
      // Disesuaikan dengan IP Hotspot Gateway laptop ASUS (192.168.137.1)
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',

      layananList: [
        { id_layanan: 1, nama_layanan: "Cuci Reguler", harga: 7000 },
        { id_layanan: 2, nama_layanan: "Cuci Kering", harga: 8000 },
        { id_layanan: 3, nama_layanan: "Cuci Express", harga: 10000 }
      ],

      loading: false,

      form: {
        nama: "",
        no_hp: "",
        id_layanan: "",
        berat: "",
        catatan: "",
        antar_jemput: "Tidak",
        alamat: "",
        pembayaran: "Cash"
      }
    }
  },

  computed: {
    total() {
      const layananTerpilih = this.layananList.find(
        item => String(item.id_layanan || item.id) === String(this.form.id_layanan)
      )

      const harga = layananTerpilih ? Number(layananTerpilih.harga || 0) : 0
      const berat = Number(this.form.berat) || 0

      return harga * berat
    }
  },

  mounted() {
    this.loadUser()
    this.ambilLayanan()
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

    loadUser() {
      const data = localStorage.getItem("user_info") || localStorage.getItem("user")
      if (data) {
        try {
          const user = JSON.parse(data)
          this.form.nama = user.nama || user.name || ""
          this.form.no_hp = user.no_hp || user.telepon || user.phone || ""
        } catch (error) {
          console.error("Gagal membaca data user:", error)
        }
      }
    },

    async ambilLayanan() {
      try {
        const res = await axios.get(`${this.API_BASE_URL}/api/layanan`)
        if (res.data && res.data.data && res.data.data.length > 0) {
          this.layananList = res.data.data
        } else if (Array.isArray(res.data) && res.data.length > 0) {
          this.layananList = res.data
        }
      } catch (error) {
        console.error("Gagal mengambil daftar layanan:", error)
      }
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(angka || 0)
    },

    formatRupiahSimple(angka) {
      return new Intl.NumberFormat("id-ID").format(Number(angka) || 0)
    },

    async buatPesanan() {
      if (!this.form.nama.trim()) {
        alert("Nama pelanggan harus diisi!")
        return
      }

      if (!this.form.no_hp.trim()) {
        alert("Nomor handphone harus diisi!")
        return
      }

      if (!this.form.id_layanan) {
        alert("Silakan pilih layanan laundry!")
        return
      }

      if (!this.form.berat || this.form.berat <= 0) {
        alert("Masukkan berat laundry!")
        return
      }

      if (this.form.antar_jemput === "Ya" && !this.form.alamat.trim()) {
        alert("Alamat antar jemput harus diisi!")
        return
      }

      this.loading = true

      try {
        const idPelanggan = localStorage.getItem('id_pelanggan') || 1

        const payload = {
          id_pelanggan: Number(idPelanggan),
          id_layanan: Number(this.form.id_layanan),
          total_berat: Number(this.form.berat),
          antar_jemput: this.form.antar_jemput,
          alamat: this.form.antar_jemput === "Ya" ? this.form.alamat : "",
          metode_pembayaran: this.form.pembayaran,
          catatan: this.form.catatan,
          total_harga: Number(this.total)
        }

        await axios.post(
          `${this.API_BASE_URL}/api/orders`,
          payload,
          this.getAuthHeaders()
        )

        const pesananLokal = {
          ...this.form,
          total: this.total,
          tanggal: new Date().toLocaleDateString("id-ID"),
          status: "Pesanan Diterima"
        }
        localStorage.setItem("pesanan", JSON.stringify(pesananLokal))

        alert("Pesanan berhasil dibuat! 😊")
        this.$router.push("/riwayat")

      } catch (error) {
        console.error("Gagal mengirim pesanan:", error)
        alert("Gagal memproses pesanan ke server backend.")
      } finally {
        this.loading = false
      }
    },

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

.pemesanan-page {
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

/* CONTENT */
.content {
  max-width: 850px;
  margin: 0 auto;
  padding: 45px 25px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.title h1 {
  margin: 0;
  color: #333;
  font-size: 30px;
}

.title p {
  margin-top: 8px;
  color: #888;
  font-size: 14px;
}

/* FORM CARD & GRID LAYOUT */
.form-card {
  background: white;
  border-radius: 22px;
  padding: 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  outline: none;
  background: white;
  transition: 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #e85d9e;
  box-shadow: 0 0 0 3px rgba(232, 93, 158, 0.1);
}

.form-group textarea {
  resize: vertical;
}

/* RADIO BUTTONS */
.radio-group {
  display: flex;
  gap: 25px;
  align-items: center;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #444;
}

.radio-option input {
  width: auto;
  accent-color: #e85d9e;
  cursor: pointer;
}

/* TOTAL BOX */
.total-box {
  background: #fff0f6;
  border-radius: 15px;
  padding: 20px;
  margin-top: 5px;
}

.total-box.full {
  grid-column: 1 / -1;
}

.total-box div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-box span {
  color: #666;
  font-size: 15px;
}

.total-box strong {
  color: #e85d9e;
  font-size: 22px;
}

/* BUTTON */
.pesan-button {
  width: 100%;
  border: none;
  background: #e85d9e;
  color: white;
  padding: 14px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: 0.3s;
}

.pesan-button:hover {
  background: #d94d8e;
}

.pesan-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .navbar {
    padding: 0 20px;
  }

  .menu {
    gap: 12px;
  }

  .menu a {
    font-size: 12px;
  }

  .form-card {
    padding: 25px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>