export interface PixPayload {
  raw: string;
  chave: string;
  valor: number;
  descricao?: string;
  txid: string;
  beneficiario: string;
  expiraEm?: Date;
  cidade?: string;
}

export interface PixDeposit {
  pixData: PixPayload;
  targetAsset: string;
  targetNetwork: string;
  estimatedAmount: number;
  conversionRate: number;
}
