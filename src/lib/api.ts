import { getEnv } from './env';
import { BackendTransactionsResponse } from './types/wallet';

type Json = Record<string, unknown>;

async function request<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const { BACKEND_URL } = getEnv();
  const base = BACKEND_URL?.replace(/\/$/, '') ?? '';
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return (await res.json()) as T;
  // @ts-expect-error allow string body
  return (await res.text()) as T;
}

export async function postPixWebhook(payload: { wallet_address: string; amount?: string }): Promise<Json> {
  return request<Json>('/pixWebhook', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getBalance(address: string): Promise<{ balance?: string | number } & Json> {
  const safe = address?.trim();
  if (!safe) throw new Error('Endereco invalido');
  return request<{ balance?: string | number } & Json>(`/balance/${safe}`);
}

export async function getWalletTransactions(address: string): Promise<BackendTransactionsResponse> {
  const safe = address?.trim();
  if (!safe) throw new Error('Endereco invalido');
  return request<BackendTransactionsResponse>(`/wallets/${safe}/transactions`);
}
