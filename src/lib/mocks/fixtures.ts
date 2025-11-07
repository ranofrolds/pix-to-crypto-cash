import { Asset, Transaction, WalletBalance } from '../types/wallet';
import { PixPayload } from '../types/pix';

export const mockBalance: WalletBalance = {
  BRL: 1250.00,
  USDT: 300.5,
  BTC: 0.0123,
  ETH: 0.456,
  BRLA: 0.053669,
};

export const mockAssets: Asset[] = [
  {
    symbol: 'BRLA',
    name: 'Brazilian Real Asset',
    network: 'BASE_SEPOLIA',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: 0.053669,
    balanceUSD: 30.00,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    network: 'TRON',
    address: 'TXYZa8EuqRMZNfVEhHEuNJTjQw7ZPXQxvR',
    balance: 0,
    balanceUSD: 0,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    network: 'ERC20',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: 0,
    balanceUSD: 0,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    balance: 0,
    balanceUSD: 0,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: 0,
    balanceUSD: 0,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    type: 'deposit',
    method: 'Depósito em reais para BRLA',
    asset: 'BRLA',
    amountAsset: 30.00,
    amountBRL: 30.00,
    amountUSD: 30.00,
    status: 'success',
    network: 'BASE_SEPOLIA',
    hash: '0x1234567890abcdef',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: new Date('2025-01-06T22:06:00'),
    completedAt: new Date('2025-01-06T22:06:00'),
  },
  {
    id: 'tx_002',
    type: 'deposit',
    method: 'PIX',
    asset: 'BRLA',
    amountAsset: 50.00,
    amountBRL: 50.00,
    amountUSD: 50.00,
    status: 'pending',
    network: 'BASE_SEPOLIA',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: 'tx_003',
    type: 'withdrawal',
    method: 'Retirada',
    asset: 'BRLA',
    amountAsset: 20.00,
    amountBRL: 20.00,
    amountUSD: 20.00,
    status: 'success',
    network: 'BASE_SEPOLIA',
    hash: '0xabcdef1234567890',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
  },
  {
    id: 'tx_004',
    type: 'deposit',
    method: 'PIX',
    asset: 'BRLA',
    amountAsset: 100.00,
    amountBRL: 100.00,
    amountUSD: 100.00,
    status: 'failed',
    network: 'BASE_SEPOLIA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'tx_005',
    type: 'deposit',
    method: 'PIX',
    asset: 'BRLA',
    amountAsset: 200.00,
    amountBRL: 200.00,
    amountUSD: 200.00,
    status: 'success',
    network: 'BASE_SEPOLIA',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 71.5),
  },
];

export const mockPixPayload: PixPayload = {
  raw: '00020126360014br.gov.bcb.pix0114+55119999999990204000053039865802BR5913Joao Silva6009SAO PAULO62070503***63041D3D',
  chave: '+5511999999999',
  valor: 250.00,
  descricao: 'Depósito para wallet cripto',
  txid: 'E12345678202401011030000000001',
  beneficiario: 'Joao Silva',
  expiraEm: new Date(Date.now() + 1000 * 60 * 30), // 30 min
  cidade: 'SAO PAULO',
};

export const conversionRates = {
  USDT_BRL: 5.0,
  BTC_BRL: 425000.0,
  ETH_BRL: 22500.0,
  BTC_USD: 42600.0,
  ETH_USD: 2250.0,
};
