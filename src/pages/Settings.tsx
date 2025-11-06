import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Globe, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
              <h1 className="text-xl font-bold">Configurações</h1>
              <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Appearance */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Aparência</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Ativar tema escuro</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Preferências</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <div>
                  <p className="font-medium">Idioma</p>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Alterar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                <div>
                  <p className="font-medium">Moeda de Referência</p>
                  <p className="text-sm text-muted-foreground">BRL (Real)</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Alterar
              </Button>
            </div>
          </div>
        </Card>

        {/* Wallet Connection (Disabled) */}
        <Card className="p-6 opacity-60">
          <h2 className="text-lg font-semibold mb-4">Conexão de Carteira</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Conectar uma carteira externa para gerenciar seus ativos.
            </p>
            <Button disabled className="w-full">
              Conectar Carteira (Em breve)
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sobre</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>CryptoWallet v1.0.0</p>
            <p>Interface de demonstração para wallet de criptomoedas</p>
            <p className="text-xs mt-4">
              Esta é uma aplicação de demonstração. Todas as transações e saldos são simulados.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
