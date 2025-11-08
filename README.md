# Refuconnect - ETH Latam Hackaton 2025

[![Status](https://img.shields.io/badge/status-hackathon-orange)](#roadmap)
[![React](https://img.shields.io/badge/react-19.1.0-61dafb?logo=react&logoColor=white)](#stack)
[![Vite](https://img.shields.io/badge/vite-5.x-646cff?logo=vite&logoColor=white)](#stack)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](#license)

Refuconnect transforma Pix em cripto em segundos, oferecendo depósitos instantâneos, custódia segura e suporte a múltiplas redes para que refugiados e migrantes possam gerenciar seus ativos digitais com a mesma agilidade de uma conta tradicional.

**Backend Repository**: https://github.com/taigfs/crypto-onramp-server

## 🔗 Quick Links
- [Visão Geral](#visão-geral)
- [Features & Motivação](#features--motivação)
- [Arquitetura](#arquitetura)
- [Getting Started](#getting-started)
- [Operação & Observabilidade](#operação--observabilidade)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)

## Visão Geral

Refuconnect é uma interface web moderna focada em on/off ramp para comunidades que dependem de Pix no Brasil. A aplicação integra Coinbase Smart Wallets para autenticação web3, se conecta a redes Arbitrum (Sepolia/One) e permite que usuários depositem via Pix e recebam criptomoedas instantaneamente.

### Stack

- React 19 + TypeScript
- Vite para build e dev server
- wagmi + Coinbase Wallet SDK v4 (Smart Wallet mode)
- TanStack Query para gerenciamento de estado assíncrono
- shadcn/ui + Tailwind CSS para interface
- OnchainKit para componentes web3

## Features & Motivação

Deposite com Pix e receba criptomoedas instantaneamente, com uma experiência simples, rápida e segura que conecta sua wallet a múltiplas redes e mantém seus ativos protegidos pelas melhores práticas de infraestrutura cripto.

- **Autenticação Web3**: Login com Google/Apple/Passkey via Coinbase Smart Wallets sem mnemônicos ou extensões.
- **Depósitos instantâneos**: Gera QR Code Pix e processa webhooks do backend para creditar BRLR/USDT.
- **Multichain-ready**: Suporte atual a Arbitrum Sepolia/One com detecção automática de rede errada.
- **Dashboard completo**: Visualização de saldo, histórico de transações e gerenciamento de ativos.
- **Responsivo & acessível**: Interface otimizada para mobile e desktop com design system consistente.
- **Farcaster Mini App**: Pronto para rodar como embedded app no ecossistema Base.

## Arquitetura

```
pix-to-crypto-cash/
├─ src/
│  ├─ main.tsx               # Entrypoint: WagmiProvider + OnchainKitProvider
│  ├─ App.tsx                # Router e QueryClient
│  ├─ pages/
│  │  ├─ Index.tsx           # Landing page (login)
│  │  ├─ Dashboard.tsx       # Dashboard principal (wallet-protected)
│  │  ├─ Deposit.tsx         # Fluxo de depósito Pix
│  │  ├─ History.tsx         # Histórico de transações
│  │  ├─ Settings.tsx        # Configurações do usuário
│  │  └─ NotFound.tsx        # 404 fallback
│  ├─ components/
│  │  ├─ ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
│  │  ├─ wallet/             # WalletConnectButton, TransactionItem, BalanceCard
│  │  ├─ pix/                # PixPaymentCard, QrCanvas, PixAmountInput
│  │  └─ auth/               # RequireWallet (route guard)
│  ├─ lib/
│  │  ├─ wagmi.ts            # wagmi config + Coinbase Wallet connector
│  │  ├─ api.ts              # Backend API client (postPixWebhook, getBalance)
│  │  ├─ env.ts              # Environment validation helpers
│  │  └─ types/              # TypeScript types (pix.ts, wallet.ts)
│  ├─ hooks/
│  │  └─ use-backend-balance.ts  # TanStack Query hook para saldo
│  └─ index.css              # Global styles + Tailwind directives
├─ vercel.json               # SPA routing config
├─ tailwind.config.ts        # Tailwind + shadcn theme
└─ CLAUDE.md                 # Project instructions para Claude Code
```

**Fluxo principal**
1. Usuário faz login via Coinbase Wallet (Google/Apple/Passkey).
2. App verifica se está na rede correta (Arbitrum Sepolia/One).
3. Usuário navega para `/deposit`, insere valor em BRL e gera QR Code Pix.
4. Após pagamento, backend processa webhook e credita tokens na wallet.
5. Dashboard exibe saldo atualizado via polling de `getBalance`.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm (instalado com Node)
- Conta Coinbase Developer Platform (opcional para `VITE_COINBASE_APP_ID`)
- Backend rodando (padrão: `https://crypto-onramp-server.onrender.com`)

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Rodar dev server (localhost:8080)
npm run dev

# Build para produção
npm run build

# Build para development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Deploy

#### Vercel (Recomendado)

```bash
# Via Lovable UI
1. Abra https://lovable.dev/projects/92ee76e2-8d90-42ca-9ee6-18800448de75
2. Clique em Share → Publish

# Via CLI
vercel --prod
```

Configure environment variables em **Vercel → Project → Settings → Environment Variables**.

#### Outras Plataformas

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Install command**: `npm install`

## Componentes Principais

### WalletConnectButton
[src/components/wallet/WalletConnectButton.tsx](src/components/wallet/WalletConnectButton.tsx)

- Exibe botão "Entrar com Google/Apple (Coinbase)"
- Abre modal de autenticação Coinbase Wallet
- Mostra endereço conectado e botão de desconexão
- Detecta rede errada e oferece switch para Arbitrum

### PixPaymentCard
[src/components/pix/PixPaymentCard.tsx](src/components/pix/PixPaymentCard.tsx)

- Renderiza QR Code via `QrCanvas.tsx`
- Exibe BR Code copiável
- Mostra link de pagamento e detalhes (valor, taxa, expiração)
- Polling de status do pagamento (integration com backend)

### RequireWallet
[src/components/auth/RequireWallet.tsx](src/components/auth/RequireWallet.tsx)

- Route guard para páginas protegidas
- Redireciona para `/` se wallet não conectada
- Usado em `Dashboard`, `Deposit`, `History`, `Settings`

### Balance Hook
[src/hooks/use-backend-balance.ts](src/hooks/use-backend-balance.ts)

- TanStack Query hook que fetches saldo via `getBalance` API
- Refetch automático a cada 10s quando wallet conectada
- Retorna `balance`, `isLoading`, `error`, `refetch`

## Integração com Backend

### API Client
[src/lib/api.ts](src/lib/api.ts)

```typescript
// Criar cobrança Pix
const qrCode = await postPixWebhook({
  wallet_address: '0x...',
  value: 250 // centavos
})

// Consultar saldo
const balance = await getBalance('0x...')
```

### Endpoints Utilizados

| Método | Endpoint            | Uso                                    |
| ------ | ------------------- | -------------------------------------- |
| POST   | `/get_qrcode`       | Gera QR Code Pix via backend           |
| GET    | `/balance/:address` | Consulta saldo de tokens do usuário    |

Backend padrão: [crypto-onramp-server](https://github.com/ranofrolds/crypto-onramp-server)

## Operação & Observabilidade

### Monitoramento de Wallet

- **Status da conexão**: Detectado via `useAccount()` do wagmi
- **Rede errada**: App compara `chainId` atual com a variável de ambiente.
- **RPC indisponível**: wagmi fallback para RPC padrão da chain se custom RPC falhar

### Logs & Debugging

- Abra DevTools → Console para ver erros de wagmi/TanStack Query
- Network tab para inspecionar chamadas API (`/balance`, `/get_qrcode`)
- Wagmi devtools habilitados em dev mode

## Farcaster Mini App

A aplicação está pronta para rodar como **Base Mini App**:

```typescript
// src/App.tsx
import sdk from '@farcaster/miniapp-sdk'

sdk.actions.ready() // Notifica Base quando embedded
```

- **Safe fallback**: No-op quando não rodando em contexto Farcaster
- **Future**: Integração com Farcaster ID e frames

## Brand Guidelines

### Cores

```css
/* Background */
--background: #0B0119 (Crimson Black)
--secondary-bg: #170420 (Abyss Purple)

/* Accents */
--primary: #C8283C (Crimson Red)
--secondary: #FF785A (Warm Coral)
--highlight: #FFC8B4 (Soft Peach)

/* Text */
--foreground: #FFFFFF
```

### Typography

- **Font Family**: Inter (via Tailwind default)
- **Headings**: `font-bold` ou `font-semibold`
- **Body**: `text-base` ou `text-sm`

## Contribuindo

1. Faça fork do repositório
2. Clone localmente: `git clone <YOUR_GIT_URL>`
3. Crie uma branch: `git checkout -b feature/nova-feature`
4. Rode testes de lint: `npm run lint`
5. Commit suas mudanças: `git commit -m "feat: adiciona nova feature"`
6. Push para o fork: `git push origin feature/nova-feature`
7. Abra Pull Request descrevendo problema, solução e testes realizados

## Créditos

- Hackathon ETH Latam 2025 — Equipe Refuconnect
- Coinbase Developer Platform e OnchainKit
- Comunidade Fhenix e Woovi pelo suporte técnico
- shadcn/ui pela biblioteca de componentes

## License

ISC
