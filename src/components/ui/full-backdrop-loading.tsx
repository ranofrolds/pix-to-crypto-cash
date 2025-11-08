import { cn } from '@/lib/utils';

interface FullBackdropLoadingProps {
  isOpen: boolean;
  message?: string;
  className?: string;
}

export function FullBackdropLoading({
  isOpen,
  message = 'Carregando...',
  className
}: FullBackdropLoadingProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm',
        'transition-opacity duration-300 ease-in-out',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/90 border border-border/50 shadow-glow">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  );
}
