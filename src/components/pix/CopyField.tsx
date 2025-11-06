import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { copyToClipboard } from '@/lib/utils/format';
import { toast } from '@/hooks/use-toast';

interface CopyFieldProps {
  value: string;
  label: string;
}

export function CopyField({ value, label }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      setCopied(true);
      toast({
        title: 'Copiado!',
        description: 'Código PIX copiado para a área de transferência',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Por favor, selecione e copie manualmente',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pix-code">{label}</Label>
      <div className="relative">
        <Textarea
          id="pix-code"
          value={value}
          readOnly
          rows={4}
          className="font-mono text-xs resize-none pr-24"
          aria-label={label}
        />
        <Button
          onClick={handleCopy}
          size="sm"
          className="absolute top-2 right-2 gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        No seu banco, escolha PIX copia e cola e cole este código
      </p>
    </div>
  );
}
