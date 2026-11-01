<template>
  <div class="pemesanan-page">
    <nav class="navbar">
      <div class="logo">🧺 LaundryKu</div>
      <div class="menu">
        <span @click="goBeranda">Beranda</span>
        <span class="active">Pemesanan</span>
        <span @click="goRiwayat">Riwayat</span>
        <span @click="goProfil">Profil</span>
      </div>
      <button class="logout-btn" @click="logout">Logout</button>
    </nav>

    <div class="container">
      <div class="form-card">
        <h2>Buat Pesanan Laundry</h2>

        <!-- PILIH LAYANAN -->
        <div class="form-group">
          <label>Pilih Layanan</label>
          <select v-model="selectedLayananId" @change="hitungTotal">
            <option value="" disabled>-- Pilih Jenis Layanan --</option>
            <option v-for="item in daftarLayanan" :key="item.id" :value="item.id">
              {{ item.nama_layanan || item.nama }} - {{ formatRupiah(item.harga) }}/kg
            </option>
          </select>
        </div>

        <!-- BERAT -->
        <div class="form-group">
          <label>Berat Laundry (Kg)</label>
          <input 
            v-model.number="berat" 
            type="number" 
            min="1" 
            placeholder="Masukkan berat" 
            @input="hitungTotal"
          />
        </div>

        <!-- ANTAR JEMPUT -->
        <div class="form-group">
          <label>Antar Jemput</label>
          <div class="radio-group">
            <label><input type="radio" value="Ya" v-model="antarJemput" /> Ya</label>
            <label><input type="radio" value="Tidak" v-model="antarJemput" /> Tidak</label>
          </div>
        </div>

        <!-- ALAMAT -->
        <div v-if="antarJemput === 'Ya'" class="form-group">
          <label>Alamat Antar Jemput</label>
          <textarea v-model="alamat" placeholder="Masukkan alamat lengkap"></textarea>
        </div>

        <!-- METODE PEMBAYARAN -->
        <div class="form-group">
          <label>Metode Pembayaran</label>
          <div class="radio-group">
            <label><input type="radio" value="Cash" v-model="metodePembayaran" /> Cash</label>
            <label><input type="radio" value="Transfer" v-model="metodePembayaran" /> Transfer</label>
          </div>
        </div>

        <!-- CATATAN -->
        <div class="form-group">
          <label>Catatan</label>
          <textarea v-model="catatan" placeholder="Tambahkan catatan jika diperlukan"></textarea>
        </div>

        <!-- TOTAL -->
        <div class="total-card">
          <span>Total Pembayaran</span>
          <strong>{{ formatRupiah(totalHarga) }}</strong>
        </div>

        <!-- BUTTON -->
        <button :disabled="loading" class="submit-btn" @click="buatPesanan">
          {{ loading ? 'Memproses Pesanan...' : 'Pesan Sekarang' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "PemesananUser",
  data() {
    return {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.137.1:8080',
      daftarLayanan: [],
      selectedLayananId: "",
      berat: 1,
      antarJemput: "Tidak",
      alamat: "",
      metodePembayaran: "Cash",
      catatan: "",
      totalHarga: 0,
      loading: false
    };
  },

  mounted() {
    this.fetchLayanan();
  },

  methods: {
    async fetchLayanan() {
      try {
        const response = await axios.get(`${this.API_BASE_URL}/api/layanan`);
        this.daftarLayanan = response.data.data || response.data || [];
        if (this.daftarLayanan.length > 0) {
          this.selectedLayananId = this.daftarLayanan[0].id;
          this.hitungTotal();
        }
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      }
    },

    hitungTotal() {
      const layanan = this.daftarLayanan.find(l => l.id === this.selectedLayananId);
      const hargaPerKg = layanan ? (layanan.harga || 0) : 0;
      const beratVal = this.berat > 0 ? this.berat : 0;
      this.totalHarga = hargaPerKg * beratVal;
    },

    async buatPesanan() {
      if (!this.selectedLayananId) {
        alert("Silakan pilih jenis layanan terlebih dahulu!");
        return;
      }

      if (!this.berat || this.berat <= 0) {
        alert("Masukkan berat laundry yang valid!");
        return;
      }

      if (this.antarJemput === "Ya" && !this.alamat) {
        alert("Silakan isi alamat antar jemput!");
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
      const idPelanggan = localStorage.getItem("id_pelanggan") || userInfo.id_pelanggan || userInfo.id;

      if (!idPelanggan) {
        alert("Sesi login berakhir. Silakan login kembali.");
        this.$router.push("/login");
        return;
      }

      this.loading = true;

      try {
        const layananSelected = this.daftarLayanan.find(l => l.id === this.selectedLayananId);

        const payload = {
          id_pelanggan: parseInt(idPelanggan),
          id_layanan: parseInt(this.selectedLayananId),
          berat: parseFloat(this.berat),
          antar_jemput: this.antarJemput,
          alamat: this.antarJemput === "Ya" ? this.alamat : "-",
          metode_pembayaran: this.metodePembayaran,
          catatan: this.catatan,
          total_harga: this.totalHarga
        };

        const token = localStorage.getItem("user_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.post(`${this.API_BASE_URL}/api/orders`, payload, { headers });

        // Simpan ringkasan untuk PesananBerhasil.vue
        const pesananSaved = {
          nama: userInfo.nama || "Pelanggan",
          no_hp: userInfo.no_hp || "-",
          layanan: layananSelected ? (layananSelected.nama_layanan || layananSelected.nama) : "Layanan",
          berat: this.berat,
          antar_jemput: this.antarJemput,
          alamat: this.alamat,
          pembayaran: this.metodePembayaran,
          total: this.totalHarga
        };

        localStorage.setItem("pesanan", JSON.stringify(pesananSaved));

        alert("Pesanan berhasil dibuat! ✨");
        this.$router.push("/pesanan-berhasil");

      } catch (error) {
        console.error("Gagal membuat pesanan:", error);
        if (error.response && error.response.data) {
          const msg = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
          alert("Gagal memproses pesanan: " + msg);
        } else {
          alert("Gagal terhubung ke server backend Go.");
        }
      } finally {
        this.loading = false;
      }
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(angka || 0);
    },

    goBeranda() { this.$router.push("/beranda"); },
    goRiwayat() { this.$router.push("/riwayat"); },
    goProfil() { this.$router.push("/profil"); },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }
.pemesanan-page { min-height: 100vh; background: #fff7fa; }
.navbar { height: 70px; display: flex; align-items: center; padding: 0 70px; background: white; border-bottom: 1px solid #f5dce7; }
.logo { flex: 1; color: #e85d9e; font-size: 21px; font-weight: bold; }
.menu { display: flex; gap: 32px; margin-right: 35px; }
.menu span { color: #666; font-size: 13px; cursor: pointer; }
.menu span.active, .menu span:hover { color: #e85d9e; font-weight: bold; }
.logout-btn { padding: 9px 18px; border: none; border-radius: 8px; background: #e85d9e; color: white; font-size: 12px; cursor: pointer; }
.container { padding: 40px 20px; display: flex; justify-content: center; }
.form-card { width: 550px; background: white; padding: 35px; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.06); }
.form-card h2 { margin-top: 0; color: #333; font-size: 22px; text-align: center; margin-bottom: 25px; }
.form-group { margin-bottom: 18px; text-align: left; }
.form-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #444; font-weight: 600; }
.form-group input[type="number"], .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ebd2de; border-radius: 8px; outline: none; font-size: 13px; background: #fffcfd; }
.radio-group { display: flex; gap: 20px; font-size: 13px; }
.total-card { display: flex; justify-content: space-between; align-items: center; background: #fff0f6; padding: 15px; border-radius: 10px; margin-top: 25px; margin-bottom: 20px; }
.total-card strong { color: #e85d9e; font-size: 20px; }
.submit-btn { width: 100%; padding: 14px; border: none; border-radius: 10px; background: #e85d9e; color: white; font-size: 14px; font-weight: bold; cursor: pointer; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>