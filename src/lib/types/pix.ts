export interface PixPayload {
  raw: string;
  chave: string;
  valor: number;
  descricao?: string;
  txid: string;
  beneficiario: string;
  expiraEm?: Date;
  cidade?: string;
  qrCodeImage?: string; // URL da imagem QR Code (Woovi)
  brCode?: string; // Código PIX copia e cola (Woovi)
}

export interface PixDeposit {
  pixData: PixPayload;
  targetAsset: string;
  targetNetwork: string;
  estimatedAmount: number;
  conversionRate: number;
}

export interface WooviPixResponse {
  success: boolean;
  message: string;
  data: {
    qrCodeImage: string;
    brCode: string;
    transactionId: string;
    value: number; // em centavos
    fee: number; // em centavos
    status: string;
    paymentLinkUrl: string;
    expiresDate: string; // ISO string
  };
}
