export type PaymentStatus="VERIFIED"|"INVALID"|"UNKNOWN";
export interface PaymentRequest{
  orderId:string;
  amount:number;
  transactionId?:string;
}
export interface PaymentResponse{
  status:PaymentStatus;
  transactionId?:string;
  reason?:string;
}
export interface WebhookPayload{
  orderId:string;
  transactionId:string;
  status:string;
  amount:number;
}