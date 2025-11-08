# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Refuconnect** - A PIX-to-crypto onramp application built with React, TypeScript, Vite, and Coinbase Smart Wallets. Users can deposit Brazilian Reais via PIX and receive crypto (USDT, BTC, ETH) on Arbitrum networks. The app integrates with a backend service for balance tracking and PIX webhook processing.

### Brand Colors

- **Background**: `#0B0119` (Crimson Black) or `#170420` (Abyss Purple)
- **Accents/Gradients**: `#C8283C` (Crimson Red) → `#FF785A` (Warm Coral)
- **Light/Highlight**: `#FFC8B4` (Soft Peach)
- **Logo/White**: `#FFFFFF` on dark background

## Development Commands

```bash
# Install dependencies
npm i

# Run development server (localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Environment Variables

Configure in Vercel → Project → Settings → Environment Variables:

- `VITE_ARBITRUM_CHAIN_ID` - `421614` (Sepolia) or `42161` (One)
- `VITE_ARBITRUM_RPC` - Your stable Arbitrum RPC URL (required)
- `VITE_CONTRACT_ADDRESS` - Smart contract address (optional, reserved for future use)
- `VITE_COINBASE_APP_ID` - Coinbase Developer Platform App ID (optional)
- `VITE_BACKEND_URL` - Backend API URL (defaults to `https://crypto-onramp-server.onrender.com`)

Missing `VITE_ARBITRUM_RPC` will log an error but fallback to chain defaults.

## Architecture

### Wallet Integration (wagmi + Coinbase Wallet SDK)

- **Provider Setup**: [src/main.tsx](src/main.tsx) wraps app in `WagmiProvider` → `OnchainKitProvider` → `App`
- **Configuration**: [src/lib/wagmi.ts](src/lib/wagmi.ts) creates wagmi config with Coinbase Wallet connector in smart wallet mode (v4, `preference: "all"`)
- **Chain Resolution**: Dynamically sets Arbitrum One (42161) or Sepolia (421614) based on `VITE_ARBITRUM_CHAIN_ID`
- **Custom RPC**: Overrides default chain RPC with `VITE_ARBITRUM_RPC` via `defineChain`
- **Auth Flow**: [WalletConnectButton.tsx](src/components/wallet/WalletConnectButton.tsx) triggers Coinbase login (Google/Apple/Passkey), shows connected address, handles network switching
- **Protected Routes**: [RequireWallet.tsx](src/components/auth/RequireWallet.tsx) redirects to `/` if wallet not connected

### Routing & Pages

- **Router**: [App.tsx](src/App.tsx) uses React Router with `BrowserRouter`
- **Pages**:
  - `/` - [Index.tsx](src/pages/Index.tsx): Landing/login page
  - `/dashboard` - [Dashboard.tsx](src/pages/Dashboard.tsx): Wallet-protected, shows balances and transaction history
  - `/deposit` - [Deposit.tsx](src/pages/Deposit.tsx): PIX deposit flow with QR code generation
  - `/history` - [History.tsx](src/pages/History.tsx): Transaction history
  - `/settings` - [Settings.tsx](src/pages/Settings.tsx): User settings
  - `*` - [NotFound.tsx](src/pages/NotFound.tsx): 404 fallback
- **Vercel SPA Routing**: [vercel.json](vercel.json) redirects all routes to `/index.html` for client-side routing

### Backend API Integration

- **API Client**: [src/lib/api.ts](src/lib/api.ts) provides:
  - `postPixWebhook(payload)` - Triggers PIX deposit webhook
  - `getBalance(address)` - Fetches wallet balance from backend
- **Backend URL**: Configured via `VITE_BACKEND_URL` environment variable
- **Balance Hook**: [use-backend-balance.ts](src/hooks/use-backend-balance.ts) fetches balance using wagmi `useAccount` address

### PIX Payment Flow

1. User enters BRL amount in [Deposit.tsx](src/pages/Deposit.tsx)
2. App generates PIX QR code (mock or via backend)
3. [PixPaymentCard.tsx](src/components/pix/PixPaymentCard.tsx) displays QR code via [QrCanvas.tsx](src/components/pix/QrCanvas.tsx)
4. User scans QR and pays in PIX app
5. Backend processes webhook and credits crypto to user's wallet address
6. Dashboard shows updated balance

### Component Organization

- **UI Components**: [src/components/ui/](src/components/ui/) - shadcn/ui primitives (cards, buttons, dialogs, etc.)
- **Wallet Components**: [src/components/wallet/](src/components/wallet/) - Wallet-specific UI (connect button, transaction items, balance cards, network selector)
- **PIX Components**: [src/components/pix/](src/components/pix/) - PIX-specific UI (QR code, payment card, amount input, copy field)
- **Auth Components**: [src/components/auth/](src/components/auth/) - Route guards and auth logic

### Type System

- **PIX Types**: [src/lib/types/pix.ts](src/lib/types/pix.ts) - `PixPayload`, `PixDeposit`
- **Wallet Types**: [src/lib/types/wallet.ts](src/lib/types/wallet.ts) - `Asset`, `Transaction`, `WalletBalance`, `AssetSymbol`, `NetworkType`, `TransactionStatus`
- **Environment**: [src/lib/env.ts](src/lib/env.ts) - `AppEnv` type with validation helpers

### Styling

- **Tailwind CSS**: [tailwind.config.ts](tailwind.config.ts) configured with shadcn/ui theme
- **Path Alias**: `@/*` maps to [src/*](src/) via [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)
- **Global Styles**: [src/index.css](src/index.css) includes Tailwind directives and custom CSS variables

### State Management

- **TanStack Query**: `QueryClient` in [App.tsx](src/App.tsx) for server state (balance fetching, API calls)
- **wagmi Hooks**: `useAccount`, `useConnect`, `useDisconnect`, `useSwitchChain` for wallet state
- **React Hook Form + Zod**: Form validation (check `@hookform/resolvers` and `zod` in dependencies)

### Farcaster Mini App Integration

- **SDK**: `@farcaster/miniapp-sdk` imported in [App.tsx](src/App.tsx)
- **Ready Signal**: `sdk.actions.ready()` called on mount to notify Base Mini App when embedded
- **Safe Fallback**: Wrapped in try-catch since it no-ops in non-embedded environments

## Key Technical Patterns

- **Wallet Connection**: Always use `useAccount()` from wagmi to get current wallet state
- **Network Checks**: Compare `useAccount().chainId` with `targetChain.id` to detect wrong network
- **RPC Fallback**: If custom RPC fails, wagmi falls back to chain defaults
- **Environment Handling**: Use `getEnv()` from [src/lib/env.ts](src/lib/env.ts) to access validated env vars
- **Error Boundaries**: API errors handled in individual components; no global error boundary
- **Loading States**: Use TanStack Query's `isLoading`/`isFetching` states for async operations

## Testing & Quality

- **Linting**: ESLint configured with React hooks and React Refresh plugins
- **Type Checking**: TypeScript strict mode enabled
- No test suite currently configured

## Deployment

- **Platform**: Vercel (configured via [vercel.json](vercel.json))
- **Build Command**: `npm run build` (runs `vite build`)
- **Deploy Trigger**: Auto-deploy on push to `main` or via Lovable UI
- **Environment Variables**: Must be set in Vercel dashboard before deploy
