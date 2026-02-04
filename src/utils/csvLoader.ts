import { MonitoringLocation } from '@/app/components/WaterMap';
import csvData from '@/data/monitoring-data.csv?raw';

export function parseCSVData(text: string): MonitoringLocation[] {
  try {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('File CSV harus memiliki header dan minimal 1 baris data');
    }

    const data: MonitoringLocation[] = [];

    // Skip header (line 0) and parse data lines
    for (let i = 1; i < lines.length; i++) {
      // Split by tab since the CSV uses tab-separated values
      const values = lines[i].split('\t').map(v => v.trim());
      
      if (values.length < 6) {
        console.warn(`Baris ${i + 1} dilewati: jumlah kolom tidak cocok`);
        continue;
      }

      try {
        const location: MonitoringLocation = {
          id: values[0], // Location code (TA01, TA02, etc.)
          name: values[0], // Use location code as name
          position: [parseFloat(values[1]), parseFloat(values[2])], // Latitude, Longitude
          ph: parseFloat(values[3]),
          ec: parseFloat(values[4]),
          tds: parseInt(values[5]),
        };

        // Validasi data
        if (isNaN(location.position[0]) || isNaN(location.position[1]) || 
            isNaN(location.ph) || isNaN(location.ec) || isNaN(location.tds)) {
          throw new Error(`Data tidak valid pada baris ${i + 1}`);
        }

        data.push(location);
      } catch (err) {
        console.warn(`Baris ${i + 1} dilewati:`, err);
      }
    }

    if (data.length === 0) {
      throw new Error('Tidak ada data valid yang ditemukan dalam file CSV');
    }

    return data;
  } catch (error) {
    console.error('Error parsing CSV data:', error);
    return [];
  }
}

export function getMonitoringData(): MonitoringLocation[] {
  return parseCSVData(csvData);
}
