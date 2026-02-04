import { useState, useEffect } from 'react';
import { WaterMap, MonitoringLocation } from '@/app/components/WaterMap';
import { WaterDataTable } from '@/app/components/WaterDataTable';
import { Chatbot } from '@/app/components/Chatbot';
import { getMonitoringData } from '@/utils/csvLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Droplets, MapPin, LineChart, Info } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export default function App() {
  const [monitoringLocations, setMonitoringLocations] = useState<MonitoringLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MonitoringLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data = getMonitoringData();
    setMonitoringLocations(data);
    setIsLoading(false);
  }, []);

  const handleLocationSelect = (location: MonitoringLocation) => {
    setSelectedLocation(location);
  };

  if (isLoading || monitoringLocations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Droplets className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Memuat data pemantauan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1675725594605-c864c831d4da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdhdGVyJTIwcml2ZXIlMjBuYXR1cmV8ZW58MXx8fHwxNzcwMDk3NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Water background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="h-12 w-12" />
            <h1 className="text-5xl">Pemantauan Air Cileles</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Pemantauan kualitas air secara real-time untuk Cileles, Jatinangor. Pantau tingkat pH, 
            konduktivitas listrik (EC), dan total padatan terlarut (TDS) di berbagai stasiun pemantauan.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stasiun Pemantauan</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monitoringLocations.length}</div>
              <p className="text-xs text-muted-foreground">Lokasi aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata pH</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  monitoringLocations.reduce((sum, loc) => sum + loc.ph, 0) /
                  monitoringLocations.length
                ).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Rentang optimal: 6,5-8,5</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata EC</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  monitoringLocations.reduce((sum, loc) => sum + loc.ec, 0) /
                  monitoringLocations.length
                ).toFixed(2)}{' '}
                mS/cm
              </div>
              <p className="text-xs text-muted-foreground">Konduktivitas listrik</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata TDS</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  monitoringLocations.reduce((sum, loc) => sum + loc.tds, 0) /
                  monitoringLocations.length
                )}{' '}
                ppm
              </div>
              <p className="text-xs text-muted-foreground">Optimal: &lt;500 ppm</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Map and Table */}
        <Tabs defaultValue="map" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="map">Peta Interaktif</TabsTrigger>
            <TabsTrigger value="table">Tabel Data</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Peta Lokasi Pemantauan</CardTitle>
                <CardDescription>
                  Klik penanda mana pun untuk melihat parameter kualitas air secara detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaterMap locations={monitoringLocations} onLocationSelect={handleLocationSelect} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Kualitas Air</CardTitle>
                <CardDescription>
                  Data pemantauan real-time dari semua stasiun di Cileles, Jatinangor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaterDataTable
                  locations={monitoringLocations}
                  onLocationClick={handleLocationSelect}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Location Details */}
        {selectedLocation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {selectedLocation.name} - Informasi Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tingkat pH</h4>
                  <p className="text-2xl font-bold">{selectedLocation.ph.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedLocation.ph >= 6.5 && selectedLocation.ph <= 8.5
                      ? 'Dalam rentang aman'
                      : 'Perlu perhatian'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">EC (Konduktivitas)</h4>
                  <p className="text-2xl font-bold">{selectedLocation.ec.toFixed(2)} mS/cm</p>
                  <p className="text-xs text-muted-foreground mt-1">Konduktivitas listrik</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">TDS (Total Padatan Terlarut)</h4>
                  <p className="text-2xl font-bold">{selectedLocation.tds} ppm</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedLocation.tds <= 500 ? 'Dalam rentang optimal' : 'Di atas optimal'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tentang Parameter Kualitas Air</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Tingkat pH</h4>
              <p className="text-sm text-muted-foreground">
                Mengukur keasaman/kebasaan air. Air minum yang aman: 6,5-8,5. Nilai di luar rentang ini
                dapat menunjukkan kontaminasi atau kandungan mineral alami.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">EC (Konduktivitas Listrik)</h4>
              <p className="text-sm text-muted-foreground">
                Mengukur kemampuan air menghantarkan listrik dalam satuan mS/cm. Nilai tinggi menunjukkan
                konsentrasi ion terlarut yang tinggi, yang dapat berasal dari mineral atau kontaminan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">TDS (Total Dissolved Solids)</h4>
              <p className="text-sm text-muted-foreground">
                Mengukur jumlah total padatan terlarut dalam air (ppm). Air minum yang baik: &lt;500 ppm.
                TDS tinggi dapat mempengaruhi rasa dan menunjukkan kandungan mineral yang tinggi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pemantauan Berkelanjutan</h4>
              <p className="text-sm text-muted-foreground">
                Data dari {monitoringLocations.length} stasiun pemantauan dipantau secara real-time untuk
                memastikan kualitas air tetap dalam rentang aman untuk warga Cileles, Jatinangor.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Chatbot Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Asisten AI Pemantauan Air</h2>
          <Chatbot />
        </div>
      </div>
    </div>
  );
}