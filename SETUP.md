# Panduan Setup Website Pemantauan Air Cileles

## Status Chatbot AI

Website ini menggunakan chatbot AI dengan **mode demo intelligent** yang dapat menjawab pertanyaan umum tentang kualitas air tanpa koneksi ke OpenAI.

### Mode Operasi Chatbot:

#### 🎯 Mode Demo (Saat Ini - Langsung Berfungsi!)

Chatbot sudah berfungsi **tanpa perlu konfigurasi tambahan** dengan fitur:

- ✅ Menjawab pertanyaan tentang pH, TDS, EC
- ✅ Menjelaskan standar kualitas air
- ✅ Memberikan informasi stasiun pemantauan
- ✅ Tips keamanan air minum
- ✅ Interpretasi data monitoring

**Tidak perlu setup apapun** - chatbot langsung bisa digunakan!

#### 🚀 Mode AI Penuh (Opsional - Untuk Production)

Untuk mengaktifkan OpenAI GPT-4 penuh, Anda perlu deploy ke hosting dengan backend proxy karena browser tidak bisa memanggil OpenAI API langsung (CORS policy).

---

## Cara Mengaktifkan AI Penuh (Opsional)

### Opsi 1: Deploy ke Vercel (Recommended)

1. **Dapatkan API Key OpenAI**
   - Kunjungi https://platform.openai.com/api-keys
   - Login/daftar akun OpenAI
   - Klik "Create new secret key"
   - Salin API key (dimulai dengan `sk-...`)

2. **Update Konfigurasi**
   - Buka file `/src/config/apiKeys.ts`
   - Ganti `your_openai_api_key_here` dengan API key Anda:
     ```typescript
     export const OPENAI_API_KEY = 'sk-proj-abc123...';
     ```

3. **Deploy ke Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Di root folder: `vercel`
   - Ikuti instruksi deployment
   - Vercel akan otomatis setup backend proxy

4. **Set Environment Variable di Vercel**
   - Buka Vercel Dashboard → Project Settings
   - Environment Variables
   - Tambahkan: `VITE_OPENAI_API_KEY` = `sk-...`
   - Redeploy project

### Opsi 2: Deploy ke Netlify

1. **Setup API Key** (sama seperti Opsi 1 step 1-2)

2. **Deploy ke Netlify**
   - Install Netlify CLI: `npm i -g netlify-cli`
   - Di root folder: `netlify deploy`
   - Follow instruksi

3. **Set Environment Variable**
   - Netlify Dashboard → Site Settings
   - Environment → Environment Variables
   - Add: `VITE_OPENAI_API_KEY` = `sk-...`
   - Redeploy

### Opsi 3: Backend Proxy Custom

Jika ingin host sendiri, Anda perlu membuat backend proxy server yang:
1. Menerima request dari frontend
2. Memanggil OpenAI API dengan API key
3. Return response ke frontend

Contoh struktur sudah ada di `/api/chat.ts`

---

## Mengapa CORS Error Terjadi?

**CORS (Cross-Origin Resource Sharing)** adalah security policy browser yang mencegah website memanggil API eksternal langsung. Ini untuk melindungi:

1. **API Key Anda** - Jika dipanggil langsung dari browser, semua orang bisa lihat API key di Network tab
2. **Biaya Berlebih** - Orang bisa abuse API key Anda untuk keperluan mereka
3. **Security** - Mencegah penggunaan tidak sah

**Solusi**: Backend proxy yang menyimpan API key di server, bukan di browser.

---

## Data Monitoring

Data monitoring kualitas air tersimpan di `/src/data/monitoring-data.csv` dalam format TSV (Tab-Separated Values).

### Update Data:

1. Buka file `monitoring-data.csv`
2. Edit data (pastikan format tab-separated tetap konsisten)
3. Simpan file
4. Refresh browser

### Format Data:

```
Stasiun	Lokasi	pH	EC	TDS	Status	Latitude	Longitude
TA01	Lokasi 1	7.2	450	225	Baik	-6.9147	107.7690
...
```

---

## Struktur Project

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main application
│   │   └── components/
│   │       ├── Chatbot.tsx            # AI Chatbot (demo mode aktif)
│   │       ├── WaterMap.tsx           # Interactive Leaflet map
│   │       └── WaterDataTable.tsx     # Data table display
│   ├── config/
│   │   └── apiKeys.ts                 # API configuration (optional)
│   ├── data/
│   │   └── monitoring-data.csv        # Water quality data
│   └── utils/
│       └── csvLoader.ts               # CSV data loader
├── api/
│   └── chat.ts                        # Backend API endpoint (untuk production)
└── SETUP.md                           # Panduan ini
```

---

## Testing Chatbot Demo

Coba tanyakan:
- "Apa itu pH?"
- "Dimana lokasi stasiun pemantauan?"
- "Apakah airnya aman untuk diminum?"
- "Apa itu TDS?"
- "Jelaskan tentang EC"

Chatbot akan memberikan jawaban informatif berdasarkan knowledge base tentang kualitas air!

---

## Troubleshooting

### Chatbot tidak merespons
- Refresh halaman
- Cek console browser untuk error (F12)
- Pastikan koneksi internet stabil

### Peta tidak muncul
- Pastikan file CSV data ada di `/src/data/monitoring-data.csv`
- Cek format data CSV

### Tabel kosong
- Periksa format CSV (harus tab-separated)
- Pastikan header kolom sesuai

---

## Support & Contact

Untuk bantuan lebih lanjut:
1. Periksa console browser (F12) untuk error details
2. Review dokumentasi di file ini
3. Pastikan semua dependencies terinstall: `npm install` atau `pnpm install`

---

## Fitur Website

✅ **Hero Section** - Pengenalan sistem monitoring
✅ **Peta Interaktif** - OpenStreetMap dengan 16 stasiun
✅ **Tabel Data** - Data real-time dari CSV
✅ **Chatbot AI** - Demo mode dengan intelligent responses
✅ **Responsive Design** - Mobile & desktop friendly
✅ **Color-coded Status** - Visual indicator kualitas air

---

**Catatan Penting**: 
- Mode demo chatbot sudah cukup untuk kebutuhan dasar
- AI penuh dengan OpenAI hanya diperlukan jika ingin respons yang lebih dinamis dan kontekstual
- Website bisa langsung digunakan tanpa konfigurasi tambahan!
