import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AmountInput } from '@/components/pix/AmountInput';
import { ConversionHint } from '@/components/pix/ConversionHint';
import { PixPaymentCard } from '@/components/pix/PixPaymentCard';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { PixPayload } from '@/lib/types/pix';
import { NetworkType, AssetSymbol } from '@/lib/types/wallet';
import { conversionRates } from '@/lib/mocks/fixtures';
import { toast } from '@/hooks/use-toast';

export default function Deposit() {
  const navigate = useNavigate();
  const [amountBRL, setAmountBRL] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<AssetSymbol>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('TRON');
  const [pixData, setPixData] = useState<PixPayload | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fee = amountBRL > 0 ? Math.max(3.90, amountBRL * 0.015) : 0;
  const estimatedAmount = amountBRL > 0 ? (amountBRL / conversionRates.USDT_BRL) : 0;
  const totalAmount = amountBRL + fee;

  const amountError = amountBRL > 0 && amountBRL < 1 
    ? 'Valor mínimo é R$ 1,00'
    : amountBRL > 50000 
    ? 'Valor máximo é R$ 50.000,00'
    : '';

  const canGenerate = amountBRL >= 1 && amountBRL <= 50000 && !pixData;

  const handleGeneratePix = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPix: PixPayload = {
        raw: `00020126580014br.gov.bcb.pix0136${Date.now()}@cryptowallet.com.br5204000053039865802BR5920CRYPTOWALLET LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(7).toUpperCase()}`,
        chave: 'pix@cryptowallet.com.br',
        valor: totalAmount,
        descricao: `Depósito para ${selectedAsset} na rede ${selectedNetwork}`,
        txid: `PIX${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        beneficiario: 'CRYPTOWALLET LTDA',
        expiraEm: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
        cidade: 'SAO PAULO',
      };
      
      setPixData(mockPix);
      setIsGenerating(false);
      toast({
        title: 'PIX Gerado!',
        description: 'Pague usando seu aplicativo bancário',
      });
    }, 1000);
  };

  const handleCancel = () => {
    setPixData(null);
  };

  const handleMarkAsPaid = () => {
    toast({
      title: 'Depósito registrado!',
      description: 'Seu depósito está sendo processado (simulado)',
    });
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  const handleExpire = () => {
    toast({
      title: 'PIX Expirado',
      description: 'Este PIX expirou. Gere um novo para continuar.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(pixData ? '#' : '/')}
              disabled={!!pixData}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Depositar via PIX</h1>
              <p className="text-sm text-muted-foreground">
                {pixData ? 'Complete o pagamento' : 'Configure seu depósito'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {!pixData ? (
          <>
            {/* Amount Input */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <AmountInput
                value={amountBRL}
                onChange={setAmountBRL}
                error={amountError}
                min={1}
                max={50000}
              />
            </Card>

            {/* Asset Selection */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Ativo a Creditar</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['USDT', 'BTC', 'ETH'] as AssetSymbol[]).map((asset) => (
                      <Button
                        key={asset}
                        variant={selectedAsset === asset ? 'default' : 'outline'}
                        onClick={() => setSelectedAsset(asset)}
                        className="h-12"
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
            </Card>

            {/* Conversion Preview */}
            {amountBRL > 0 && !amountError && (
              <ConversionHint
                amountBRL={amountBRL}
                asset={selectedAsset}
                estimatedAmount={estimatedAmount}
                fee={fee}
                isLoading={isGenerating}
              />
            )}

            {/* Generate Button */}
            <Button
              className="w-full h-14 text-lg shadow-glow gap-2"
              onClick={handleGeneratePix}
              disabled={!canGenerate || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar PIX
                </>
              )}
            </Button>

            {!canGenerate && amountBRL === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Informe um valor válido para gerar o PIX
              </p>
            )}
          </>
        ) : (
          <PixPaymentCard
            pixData={pixData}
            onCancel={handleCancel}
            onMarkAsPaid={handleMarkAsPaid}
            onExpire={handleExpire}
          />
        )}
      </div>
    </div>
  );
}
