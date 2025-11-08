import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExplorerLinkProps {
  url?: string;
  children?: React.ReactNode;
}

export function ExplorerLink({ url, children }: ExplorerLinkProps) {
  // If no URL provided, don't render anything
  if (!url || url === '#') return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 h-auto p-0 text-primary hover:text-primary/80"
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {children || 'Ver no Explorer'}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Button>
  );
}
