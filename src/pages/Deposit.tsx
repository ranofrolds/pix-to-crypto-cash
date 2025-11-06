import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Deposit() {
  const navigate = useNavigate();

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
              <p className="text-sm text-muted-foreground">Converta Reais para cripto instantaneamente</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6">
        <Card className="p-8 bg-gradient-card">
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Depositar via PIX</h2>
              <p className="text-muted-foreground">
                Faça depósitos em Reais e converta para criptomoedas de forma rápida e segura
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/deposit/pix')} className="w-full sm:w-auto">
              Continuar com PIX
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
