export type PaymentMethod = "COD" | "UPI" | "CARD" | "NETBANKING" | "WALLET";
export interface PaymentProvider {
  readonly method: PaymentMethod;
  createPayment(input: { orderId: string; amount: number; currency: string }): Promise<{ reference: string }>;
}
export class CashOnDeliveryProvider implements PaymentProvider {
  readonly method = "COD" as const;
  async createPayment(input: { orderId: string; amount: number; currency: string }) {
    return { reference: `cod:${input.orderId}:${input.amount}:${input.currency}` };
  }
}
export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  if (method === "COD") return new CashOnDeliveryProvider();
  throw new Error(`${method} payments are not enabled yet.`);
}
