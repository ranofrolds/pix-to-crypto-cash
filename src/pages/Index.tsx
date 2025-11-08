import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

export default function Index() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const featuresAnimation = useScrollAnimation();
  const howItWorksAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  const features = [
    {
      icon: Zap,
      title: 'Depósitos Instantâneos',
      description: 'Converta Pix em cripto em segundos',
    },
    {
      icon: Shield,
      title: 'Seguro & Confiável',
      description: 'Seus ativos protegidos com as melhores práticas',
    },
    {
      icon: Globe,
      title: 'Múltiplas Redes',
      description: 'Suporte Ethereum, Arbitrum, Coinbase e mais',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-lg bg-card/30">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/refuconnect-logo.png"
                alt="Refuconnect"
                className="h-10 w-auto"
              />
            </div>
            <nav className="flex items-center gap-4">
              <WalletConnectButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Sua{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Wallet Cripto
              </span>
              <br />
              do Futuro
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Deposite com Pix e receba criptomoedas instantaneamente. Gerencie seus ativos digitais
              de forma simples, rápida e segura.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 shadow-glow"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <ConnectWallet
                  render={({ onClick, isLoading }) => (
                    <Button
                      size="lg"
                      className="text-lg h-14 px-8 shadow-glow"
                      onClick={onClick}
                      disabled={isLoading}
                    >
                      Conectar Wallet
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  )}
                />
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-8"
                onClick={() => navigate('/deposit')}
              >
                Depositar com Pix
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section 
        id="features" 
        ref={featuresAnimation.ref}
        className={`relative py-20 border-y border-border/50 transition-all duration-700 ${
          featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Refuconnect?</h2>
            <p className="text-muted-foreground text-lg">Tecnologia de ponta para seus ativos digitais</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-8 bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-500 group ${
                  featuresAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section 
        id="how-it-works" 
        ref={howItWorksAnimation.ref}
        className={`relative py-20 transition-all duration-700 ${
          howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-muted-foreground text-lg">Três passos simples para começar</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Conecte sua Wallet', desc: 'Conecte ou crie uma nova wallet' },
              { step: '02', title: 'Deposite com PIX', desc: 'Escolha o valor e gere o código PIX' },
              { step: '03', title: 'Receba Cripto', desc: 'Seus ativos digitais em segundos' },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`text-center relative transition-all duration-500 ${
                  howItWorksAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaAnimation.ref}
        className={`relative py-20 transition-all duration-700 ${
          ctaAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <Card className="p-12 md:p-16 bg-gradient-primary border-0 text-center shadow-glow">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Conecte sua wallet agora e comece a gerenciar seus ativos digitais
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg h-14 px-8"
              onClick={() => navigate('/dashboard')}
            >
              Conectar Wallet Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/refuconnect-logo.png"
                alt="Refuconnect"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Refuconnect. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
