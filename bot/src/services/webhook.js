import crypto from "node:crypto";
export function verifySignature(payload,signature,secret){
  if(!secret||!signature)return false;
  const digest=crypto.createHmac("sha256",secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest),Buffer.from(signature));
}
export function normalizeWebhook(body){
  return {orderId:body.orderId||body.order_id,transactionId:body.transactionId||body.transaction_id,status:String(body.status||"").toUpperCase(),amount:Number(body.amount||0)};
}