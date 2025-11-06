import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string;
}

export function AmountInput({ value, onChange, min = 1, max = 50000, error }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value > 0) {
      setDisplayValue(formatToBRL(value));
    }
  }, [value]);

  const formatToBRL = (val: number): string => {
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseFromBRL = (str: string): number => {
    const cleaned = str.replace(/[^\d,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = parseFromBRL(input);
    
    if (numericValue <= max) {
      onChange(numericValue);
      setDisplayValue(input);
    }
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatToBRL(value));
    } else {
      setDisplayValue('');
    }
  };

  const handleFocus = () => {
    if (value > 0) {
      setDisplayValue(value.toString().replace('.', ','));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Valor em Reais</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          R$
        </span>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`pl-12 text-lg font-semibold ${error ? 'border-destructive' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {!error && (
        <p className="text-xs text-muted-foreground">
          Mínimo: R$ {min.toFixed(2)} • Máximo: R$ {max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
