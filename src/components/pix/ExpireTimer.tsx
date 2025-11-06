import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExpireTimerProps {
  expiresAt: Date;
  onExpire?: () => void;
}

export function ExpireTimer({ expiresAt, onExpire }: ExpireTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const diff = expiry - now;
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0 && onExpire) {
        onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpiringSoon = timeLeft <= 60;
  const isExpired = timeLeft === 0;

  return (
    <Badge
      variant={isExpired ? 'destructive' : isExpiringSoon ? 'default' : 'secondary'}
      className="gap-2 px-3 py-1.5"
    >
      <Clock className="w-3.5 h-3.5" />
      <span className="font-mono font-semibold" aria-live="polite">
        {isExpired ? 'Expirado' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
      </span>
    </Badge>
  );
}
