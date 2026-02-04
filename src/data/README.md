# Format Data CSV

File `monitoring-data.csv` berisi data pemantauan kualitas air untuk stasiun-stasiun di Cileles, Jatinangor.

## Struktur CSV

Format CSV yang digunakan (tab-separated):
```
Location	Latitude	Longitude	pH	EC	TDS
```

## Penjelasan Kolom

1. **Location** - Kode lokasi stasiun pemantauan (TA01, TA02, dst.)
2. **Latitude** - Koordinat lintang dalam format desimal
3. **Longitude** - Koordinat bujur dalam format desimal  
4. **pH** - Tingkat pH air (rentang optimal: 6.5-8.5)
5. **EC** - Electrical Conductivity / Konduktivitas listrik dalam mS/cm
6. **TDS** - Total Dissolved Solids / Total padatan terlarut dalam ppm (optimal: <500 ppm)

## Contoh Data

```
Location	Latitude	Longitude	pH	EC	TDS
TA01	-6.911565191	107.7753386	4.8	0.33	246
TA02	-6.909919919	107.7739089	4.1	0.42	306
```

## Cara Mengedit Data

1. Buka file `/src/data/monitoring-data.csv`
2. Edit data sesuai kebutuhan dengan mengikuti format di atas
3. Pastikan menggunakan TAB sebagai pemisah antar kolom
4. Pastikan setiap baris memiliki 6 kolom
5. Jangan hapus baris header (baris pertama)
6. Simpan file
7. Data akan otomatis termuat saat website di-refresh

## Catatan Penting

- File menggunakan TAB sebagai separator, bukan koma
- Jangan hapus baris header (baris pertama)
- Pastikan nilai latitude dan longitude sesuai dengan lokasi di Cileles, Jatinangor
- Nilai pH, EC, dan TDS harus berupa angka
- Data akan ditampilkan di peta, tabel, dan statistik website
- Marker di peta akan berwarna sesuai dengan nilai pH:
  - Hijau: pH 6.5-8.5 (Baik)
  - Kuning: pH 6.0-9.0 (Cukup)
  - Merah: pH di luar rentang (Buruk)
