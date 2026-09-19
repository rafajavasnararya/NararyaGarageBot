import express from "express"; import {verifySignature,normalizeWebhook} from "./services/webhook.js"; import {getOrder,updateOrder} from "./services/orders.js"; import {createReceipt} from "./services/receipt.js"; import {publish,publicTransaction} from "./services/channel.js"; import {notifyAdmin} from "./notifications.js";
export function startAutomationServer(sock){
 const app=express(); app.use(express.json({verify:(req,_,buf)=>{req.rawBody=buf}}));
 app.post("/webhook/payment",async(req,res)=>{
  const signature=req.headers["x-signature"]||"",secret=process.env.PAYMENT_WEBHOOK_SECRET;
  if(!secret||!verifySignature(req.rawBody,signature,secret))return res.status(401).json({ok:false,error:"invalid signature"});
  const p=normalizeWebhook(req.body),o=getOrder(p.orderId); if(!o)return res.status(404).json({ok:false,error:"order not found"});
  if(["PAID","SUCCESS","SETTLED"].includes(p.status)){const updated=updateOrder(o.id,{status:"PAID",transactionId:p.transactionId,verifiedAt:new Date().toISOString()})||o;const receipt=await createReceipt(updated);await notifyAdmin(sock,"✅ Payment verified automatically: "+o.id);await publish(sock,publicTransaction(updated),receipt);return res.json({ok:true,status:"VERIFIED",orderId:o.id})}
  if(["INVALID","FAILED","NOT_FOUND","EXPIRED","CANCELLED"].includes(p.status)){await notifyAdmin(sock,"⚠️ Invalid payment for "+o.id);return res.json({ok:true,status:"INVALID",orderId:o.id})}
  await notifyAdmin(sock,"⏳ Unknown payment status for "+o.id); return res.json({ok:true,status:"UNKNOWN",orderId:o.id});
 });
 app.listen(process.env.PAYMENT_WEBHOOK_PORT||3010,()=>console.log("Payment automation webhook online"));
}