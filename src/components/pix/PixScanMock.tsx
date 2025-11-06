import { useState } from 'react';
import { Upload, Camera, ClipboardPaste } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockPixPayload } from '@/lib/mocks/fixtures';
import { PixPayload } from '@/lib/types/pix';

interface PixScanMockProps {
  onScan: (data: PixPayload) => void;
}

export function PixScanMock({ onScan }: PixScanMockProps) {
  const [pixCode, setPixCode] = useState('');

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setPixCode(text);
  };

  const handleUseMock = () => {
    onScan(mockPixPayload);
  };

  const handleSubmit = () => {
    if (pixCode.trim()) {
      // In a real app, parse the PIX code here
      onScan(mockPixPayload);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 border-dashed border-2 bg-secondary/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Escanear QR Code PIX</h3>
            <p className="text-sm text-muted-foreground">
              Simule o escaneamento de um QR Code PIX
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload QR
            </Button>
            <Button variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Abrir Câmera
            </Button>
          </div>
        </div>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ou</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Cole o código PIX</label>
        <Textarea
          placeholder="00020126360014br.gov.bcb.pix..."
          value={pixCode}
          onChange={(e) => setPixCode(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePaste}
            className="gap-2 flex-1"
          >
            <ClipboardPaste className="w-4 h-4" />
            Colar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!pixCode.trim()}
            className="flex-1"
          >
            Processar
          </Button>
        </div>
      </div>

      <Button
        variant="secondary"
        onClick={handleUseMock}
        className="w-full"
      >
        Usar PIX de Exemplo
      </Button>
    </div>
  );
}
