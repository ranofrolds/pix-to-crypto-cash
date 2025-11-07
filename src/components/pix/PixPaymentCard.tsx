import { useState } from 'react';
import { Copy, Hash, User, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCanvas } from './QrCanvas';
import { CopyField } from './CopyField';
import { ExpireTimer } from './ExpireTimer';
import { formatCurrency } from '@/lib/utils/format';
import { PixPayload } from '@/lib/types/pix';
import { copyToClipboard } from '@/lib/utils/format';
import { toast } from '@/hooks/use-toast';

interface PixPaymentCardProps {
  pixData: PixPayload;
  onCancel: () => void;
  onMarkAsPaid: () => void;
  onExpire?: () => void;
  confirmLabel?: string;
  confirmLoading?: boolean;
}

export function PixPaymentCard({ pixData, onCancel, onMarkAsPaid, onExpire, confirmLabel, confirmLoading }: PixPaymentCardProps) {
  const handleCopyTxid = async () => {
    try {
      await copyToClipboard(pixData.txid);
      toast({
        title: 'TXID copiado!',
        description: 'ID da transação copiado',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-gradient-card border-primary/20 shadow-glow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">PIX Gerado</h2>
          <p className="text-sm text-muted-foreground">
            Pague usando seu aplicativo bancário
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="hover:bg-destructive/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Amount and Timer */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Valor do PIX</p>
          <p className="text-3xl font-bold text-accent">{formatCurrency(pixData.valor)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-2">Expira em</p>
          {pixData.expiraEm && (
            <ExpireTimer expiresAt={pixData.expiraEm} onExpire={onExpire} />
          )}
        </div>
      </div>

      <Separator />

      {/* QR Code Section */}
      <div>
        <h3 className="font-semibold mb-4 text-center">Opção 1: Escanear QR Code</h3>
        <QrCanvas data={pixData.raw} />
      </div>

      <Separator />

      {/* Copy & Paste Section */}
      <div>
        <h3 className="font-semibold mb-4">Opção 2: Copiar Código</h3>
        <CopyField value={pixData.raw} label="Código PIX (copia e cola)" />
      </div>

      <Separator />

      {/* Metadata */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
          <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Beneficiário</p>
            <p className="font-medium">{pixData.beneficiario}</p>
            {pixData.cidade && (
              <p className="text-sm text-muted-foreground">{pixData.cidade}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
          <Hash className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">ID da Transação (TXID)</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono break-all flex-1">{pixData.txid}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTxid}
                className="flex-shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
        <p className="text-sm text-warning-foreground">
          <strong>Atenção:</strong> Este PIX é válido por 5 minutos. Após o pagamento,
          clique em "Marcar como pago" abaixo.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1 shadow-glow"
          onClick={onMarkAsPaid}
          disabled={!!confirmLoading}
        >
          {confirmLoading ? 'Enviando...' : (confirmLabel ?? 'Já paguei')}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground">
        Depósito simulado. Nenhuma transferência real será feita.
      </p>
    </Card>
  );
}
