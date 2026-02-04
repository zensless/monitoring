import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { MonitoringLocation } from './WaterMap';

interface WaterDataTableProps {
  locations: MonitoringLocation[];
  onLocationClick?: (location: MonitoringLocation) => void;
}

export function WaterDataTable({ locations, onLocationClick }: WaterDataTableProps) {
  const getWaterQualityStatus = (ph: number, tds: number) => {
    const phGood = ph >= 6.5 && ph <= 8.5;
    const tdsGood = tds <= 500;

    if (phGood && tdsGood) return { text: 'Sangat Baik', variant: 'default' as const };
    if (phGood || tdsGood) return { text: 'Baik', variant: 'secondary' as const };
    if (ph >= 6.0 && ph <= 9.0) return { text: 'Cukup', variant: 'outline' as const };
    return { text: 'Buruk', variant: 'destructive' as const };
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lokasi</TableHead>
            <TableHead>Tingkat pH</TableHead>
            <TableHead>EC (mS/cm)</TableHead>
            <TableHead>TDS (ppm)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => {
            const status = getWaterQualityStatus(
              location.ph,
              location.tds
            );
            return (
              <TableRow
                key={location.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onLocationClick?.(location)}
              >
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.ph.toFixed(1)}</TableCell>
                <TableCell>{location.ec.toFixed(2)}</TableCell>
                <TableCell>{location.tds}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.text}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
