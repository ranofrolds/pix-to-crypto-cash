import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { formatCurrency } from '@/lib/utils/format';
import animationJson from '@animation.json';

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number; // in milliseconds
  amount?: number; // amount credited in BRL
}

export function SuccessAnimation({ isVisible, onComplete, duration = 3000, amount }: SuccessAnimationProps) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (isVisible) {
      // Reset opacity when animation becomes visible
      setOpacity(1);

      // Start fade out after duration - 500ms
      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, duration - 500);

      // Call onComplete after full duration
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md pointer-events-none"
      style={{
        opacity,
        transition: 'opacity 500ms ease-out'
      }}
    >
      <div className="relative w-full max-w-lg px-4">
        {/* Lottie Animation Background */}
        <div className="absolute inset-0 z-20 flex items-center justify-center -mt-32 pointer-events-none">
          <Lottie
            animationData={animationJson}
            loop={false}
            autoplay={true}
            style={{ width: '600px', height: '600px' }}
          />
        </div>

        {/* Success Message */}
        <div className="relative z-10 text-center bg-card/95 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-green-500 mb-3">
            Pagamento Confirmado!
          </h2>

          {amount !== undefined && (
            <p className="text-2xl font-semibold mb-2">
              {formatCurrency(amount)}
            </p>
          )}

          <p className="text-base text-muted-foreground">
            Seu crédito foi processado com sucesso
          </p>
        </div>
      </div>
    </div>
  );
}
