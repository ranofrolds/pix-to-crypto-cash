import { QrCode } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QrCodeDisplayProps {
  data: string;
  size?: number;
}

export function QrCodeDisplay({ data, size = 200 }: QrCodeDisplayProps) {
  // Mock QR code display - in production, use a library like qrcode.react
  return (
    <Card className="p-6 flex items-center justify-center bg-white">
      <div 
        className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-border"
        style={{ width: size, height: size }}
      >
        <QrCode className="w-2/3 h-2/3 text-foreground" />
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,currentColor_10px,currentColor_11px),repeating-linear-gradient(90deg,transparent,transparent_10px,currentColor_10px,currentColor_11px)]" />
      </div>
    </Card>
  );
}
