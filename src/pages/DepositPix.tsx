import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PixScanMock } from '@/components/pix/PixScanMock';
import { PixParsedCard } from '@/components/pix/PixParsedCard';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { PixPayload } from '@/lib/types/pix';
import { NetworkType, AssetSymbol } from '@/lib/types/wallet';
import { formatCurrency, formatCrypto } from '@/lib/utils/format';
import { conversionRates } from '@/lib/mocks/fixtures';
import { toast } from '@/hooks/use-toast';

export default function DepositPix() {
  const navigate = useNavigate();
  const [pixData, setPixData] = useState<PixPayload | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('TRON');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const estimatedAmount = pixData ? pixData.valor / conversionRates.USDT_BRL : 0;

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    toast({
      title: 'Depósito registrado!',
      description: 'Seu depósito está sendo processado (simulado)',
    });
    setTimeout(() => navigate('/history'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/deposit')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Depositar via PIX</h1>
              <p className="text-sm text-muted-foreground">Escaneie ou cole o código PIX</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!pixData ? (
          <PixScanMock onScan={setPixData} />
        ) : (
          <>
            <PixParsedCard data={pixData} />

            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">Receber em</h2>
                <p className="text-sm text-muted-foreground">Escolha o ativo e rede</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ativo</label>
                  <div className="flex gap-2">
                    {(['USDT', 'BTC', 'ETH'] as AssetSymbol[]).map((asset) => (
                      <Button
                        key={asset}
                        variant={selectedAsset === asset ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAsset(asset)}
                        className="flex-1"
                      >
                        {asset}
                      </Button>
                    ))}
                  </div>
                </div>

                <NetworkSelector
                  networks={selectedAsset === 'USDT' ? ['TRON', 'ERC20'] : selectedAsset === 'BTC' ? ['BTC'] : ['ERC20']}
                  selected={selectedNetwork}
                  onChange={setSelectedNetwork}
                />
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Você receberá aproximadamente</span>
                </div>
                <p className="text-2xl font-bold text-accent">
                  {formatCrypto(estimatedAmount, selectedAsset)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Taxa de conversão: {formatCurrency(conversionRates.USDT_BRL)} por USDT
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPixData(null)}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => setShowConfirmDialog(true)}
              >
                Confirmar Depósito
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Depósito PIX</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor PIX</span>
              <span className="font-semibold">{pixData && formatCurrency(pixData.valor)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Receber</span>
              <span className="font-semibold">{formatCrypto(estimatedAmount, selectedAsset)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rede</span>
              <span className="font-semibold">{selectedNetwork}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Esta é uma simulação. Em produção, o pagamento seria processado e os fundos
                creditados após confirmação.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
