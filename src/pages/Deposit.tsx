import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssetRow } from '@/components/wallet/AssetRow';
import { NetworkSelector } from '@/components/wallet/NetworkSelector';
import { QrCodeDisplay } from '@/components/wallet/QrCodeDisplay';
import { CopyButton } from '@/components/wallet/CopyButton';
import { mockAssets } from '@/lib/mocks/fixtures';
import { Asset, NetworkType } from '@/lib/types/wallet';
import { truncateAddress } from '@/lib/utils/format';

export default function Deposit() {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<Asset>(mockAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(mockAssets[0].network);

  const availableNetworks = mockAssets
    .filter((a) => a.symbol === selectedAsset.symbol)
    .map((a) => a.network);

  const currentAsset = mockAssets.find(
    (a) => a.symbol === selectedAsset.symbol && a.network === selectedNetwork
  ) || selectedAsset;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Depositar</h1>
              <p className="text-sm text-muted-foreground">Escolha o ativo e a rede</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Asset Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Selecione o Ativo</h2>
          <div className="space-y-2">
            {Array.from(new Set(mockAssets.map((a) => a.symbol))).map((symbol) => {
              const asset = mockAssets.find((a) => a.symbol === symbol)!;
              return (
                <div
                  key={symbol}
                  className={`rounded-xl border-2 transition-all ${
                    selectedAsset.symbol === symbol
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent'
                  }`}
                >
                  <AssetRow
                    asset={asset}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setSelectedNetwork(asset.network);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Network Selection */}
        <Card className="p-6">
          <NetworkSelector
            networks={availableNetworks}
            selected={selectedNetwork}
            onChange={setSelectedNetwork}
          />
        </Card>

        {/* Deposit Address */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Endereço de Depósito</h2>
            <p className="text-sm text-muted-foreground">
              Envie {currentAsset.symbol} apenas na rede {currentAsset.network}
            </p>
          </div>

          <div className="flex justify-center">
            <QrCodeDisplay data={currentAsset.address} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 rounded-lg bg-secondary font-mono text-sm break-all">
                {currentAsset.address}
              </div>
              <CopyButton text={currentAsset.address} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning-foreground">
              <strong>Atenção:</strong> Envie apenas {currentAsset.symbol} na rede{' '}
              {currentAsset.network} para este endereço. Envios de outros ativos ou redes
              diferentes podem resultar em perda permanente dos fundos.
            </p>
          </div>
        </Card>

        {/* PIX Deposit Option */}
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Depositar via PIX</h3>
              <p className="text-sm text-muted-foreground">
                Converta Reais para cripto instantaneamente
              </p>
            </div>
            <Button onClick={() => navigate('/deposit/pix')}>
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
