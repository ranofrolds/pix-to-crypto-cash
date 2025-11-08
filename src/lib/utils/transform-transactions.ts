import { BackendTransaction, Transaction } from '@/lib/types/wallet';

/**
 * Transforms backend transaction format to UI transaction format
 */
export function transformBackendTransaction(tx: BackendTransaction): Transaction {
  // Parse the amount from "30.0 DFLCOM1" format
  const amountMatch = tx.valorFormatado.match(/^([\d.]+)\s+/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  const rawGasUsed =
    typeof tx.gasUsed === 'number'
      ? tx.gasUsed
      : typeof tx.gasUsed === 'string' && tx.gasUsed.trim() !== ''
        ? Number(tx.gasUsed)
        : undefined;
  const gasUsed = typeof rawGasUsed === 'number' && Number.isFinite(rawGasUsed) ? rawGasUsed : undefined;

  // Combine date and time to create full timestamp
  // Backend format: "2025-11-08" and "03:42:12"
  // Add timezone offset to avoid invalid date
  const dateTimeString = `${tx.data}T${tx.hora}Z`;
  let createdAt = new Date(dateTimeString);

  // Fallback if date is invalid
  if (isNaN(createdAt.getTime())) {
    console.error('Invalid date for transaction:', tx.hash, dateTimeString);
    createdAt = new Date(); // Use current date as fallback
  }

  return {
    id: tx.hash,
    type: tx.tipo.toLowerCase() === 'mint' ? 'deposit' : 'deposit',
    method: 'PIX',
    asset: 'BRLA',
    amountAsset: amount,
    amountBRL: amount,
    status: tx.confirmations > 0 ? 'success' : 'pending',
    network: 'ARBITRUM_SEPOLIA',
    hash: tx.hash,
    address: tx.to,
    explorerUrl: tx.url,
    createdAt,
    completedAt: tx.confirmations > 0 ? createdAt : undefined,
    gasUsed,
  };
}

/**
 * Transforms array of backend transactions
 */
export function transformBackendTransactions(transactions: BackendTransaction[]): Transaction[] {
  return transactions.map(transformBackendTransaction);
}
