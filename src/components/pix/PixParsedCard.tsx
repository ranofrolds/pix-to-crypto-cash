import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { PixPayload } from '@/lib/types/pix';
import { User, Hash, Calendar } from 'lucide-react';

interface PixParsedCardProps {
  data: PixPayload;
}

export function PixParsedCard({ data }: PixParsedCardProps) {
  return (
    <Card className="p-6 space-y-4 bg-gradient-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-1">Dados do PIX</h3>
          <p className="text-sm text-muted-foreground">Verifique as informações</p>
        </div>
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          PIX
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Beneficiário</p>
            <p className="font-medium">{data.beneficiario}</p>
            <p className="text-sm text-muted-foreground">{data.chave}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground mb-1">Valor</p>
            <p className="text-xl font-bold text-accent">{formatCurrency(data.valor)}</p>
          </div>

          {data.expiraEm && (
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Expira em
              </p>
              <p className="text-sm font-medium">{formatDate(data.expiraEm)}</p>
            </div>
          )}
        </div>

        {data.descricao && (
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground mb-1">Descrição</p>
            <p className="text-sm">{data.descricao}</p>
          </div>
        )}

        <div className="p-3 rounded-lg bg-background/50">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            ID da Transação
          </p>
          <p className="text-xs font-mono break-all">{data.txid}</p>
        </div>
      </div>
    </Card>
  );
}
