export type AssetSymbol = 'USDT' | 'BTC' | 'ETH' | 'BRL' | 'BRLA';
export type NetworkType =
  | 'TRON'
  | 'ERC20'
  | 'BTC'
  | 'PIX'
  | 'BASE_SEPOLIA'
  | 'ARBITRUM_SEPOLIA'
  | 'ARBITRUM_ONE';
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type TransactionType = 'deposit' | 'withdrawal' | 'swap';

export interface Asset {
  symbol: AssetSymbol;
  name: string;
  network: NetworkType;
  address: string;
  balance: number;
  balanceUSD: number;
  icon?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  method: string;
  asset: AssetSymbol;
  amountAsset: number;
  amountBRL?: number;
  amountUSD?: number;
  status: TransactionStatus;
  network?: NetworkType;
  hash?: string;
  address?: string;
  createdAt: Date;
  completedAt?: Date;
  fee?: number;
}

export interface WalletBalance {
  BRL: number;
  USDT: number;
  BTC: number;
  ETH: number;
  BRLA: number;
}

// Backend transaction response types
export interface BackendTransaction {
  hash: string;
  tipo: string;
  url: string;
  data: string;
  hora: string;
  valorFormatado: string;
  valorRaw: string;
  from: string;
  to: string;
  blockNumber: number;
  confirmations: number;
}

export interface BackendTransactionsResponse {
  success: boolean;
  data: {
    wallet: string;
    transactions: BackendTransaction[];
  };
}
