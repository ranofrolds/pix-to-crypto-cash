import { QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QrCanvasProps {
  data: string;
  size?: number;
}

export function QrCanvas({ data, size = 240 }: QrCanvasProps) {
  const handleDownload = () => {
    // Mock download - in production, generate actual QR code and download
    console.log('Download QR Code:', data);
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 bg-white flex items-center justify-center">
        <div
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-4 border-primary/20"
          style={{ width: size, height: size }}
          aria-label="QRCode para pagamento PIX"
        >
          <QrCode className="w-3/4 h-3/4 text-foreground/80" />
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,currentColor_8px,currentColor_9px),repeating-linear-gradient(90deg,transparent,transparent_8px,currentColor_8px,currentColor_9px)]" />
          
          {/* Center logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-sm">PIX</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">
          Abra seu banco, escolha Pagar via PIX e escaneie o QR Code
        </p>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          Baixar QR Code
        </Button>
      </div>
    </div>
  );
}
