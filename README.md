# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/92ee76e2-8d90-42ca-9ee6-18800448de75

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/92ee76e2-8d90-42ca-9ee6-18800448de75) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/92ee76e2-8d90-42ca-9ee6-18800448de75) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Coinbase Embedded Wallets (address only)

Configure these environment variables (Vercel → Project → Settings → Environment Variables):

- `VITE_ARBITRUM_CHAIN_ID` → `421614` (Sepolia) or `42161` (One)
- `VITE_ARBITRUM_RPC` → Your stable Arbitrum RPC URL
- `VITE_CONTRACT_ADDRESS` → 0x... (reserved for future on-chain use)
- `VITE_COINBASE_APP_ID` → App ID from CDP (optional for future use)

Client flow implemented:

- Button “Entrar com Google/Apple (Coinbase)” opens Coinbase Smart Wallet login
- On success, shows the connected address and basic disconnect
- If chainId ≠ Arbitrum (from `VITE_ARBITRUM_CHAIN_ID`), shows “Trocar para Arbitrum”
- Error states: cancel login, RPC indisponível, provider indisponível

Notes:

- Providers (Google/Apple/Email) and Redirect URL are enabled in the CDP Portal dashboard.
- This repo uses wagmi + Coinbase Wallet SDK v4 in smart wallet mode.
