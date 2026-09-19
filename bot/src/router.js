import {mainMenu,brandMenu,withFooter} from "./messages.js";
import {getOrder,createOrder,updateOrder} from "./services/orders.js";
import {verifyPayment} from "./services/payment.js";
import {isOwner} from "./services/auth.js";
import {askAI} from "./services/ai.js";
import {handleGroupCommand} from "./services/groupManager.js";
import {startMemberFlow,acceptConsent,attachEvidence} from "../../member/src/flow.js";
import {consentText} from "../../member/src/privacy.js";
const brands=["studio","garage","store","hilekros","corporation"];
export async function routeMessage(sock,m){
 const jid=m.key.remoteJid;
 const text=(m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||"").trim();
 if(!text)return;
 const l=text.toLowerCase();
 if(l==="menu"||l==="start"||l==="help")return sock.sendMessage(jid,{text:mainMenu()});
 if(l==="/member daftar"||l==="member daftar")return sock.sendMessage(jid,{text:withFooter(startMemberFlow(jid).message||consentText())});
 if(l==="/member setuju"||l==="member setuju")return sock.sendMessage(jid,{text:withFooter("Persetujuan diterima. Kirim nama lengkap/display name. Setelah itu bot akan memandu bukti sosial dan ownership melalui kanal privat.")});
 if(brands.includes(l))return sock.sendMessage(jid,{text:brandMenu(l)});
 if(l.startsWith("status ")){const o=getOrder(text.slice(7).trim());return sock.sendMessage(jid,{text:withFooter(o?["📦 STATUS PESANAN","Order: "+o.id,"Brand: "+o.brand,"Produk: "+o.product,"Status: "+o.status].join("\n"):"Order tidak ditemukan.")})}
 if(text.startsWith("/")){
  const [cmd,...args]=text.slice(1).split(/\s+/);
  if(cmd==="createorder"&&isOwner(jid)){const [brand,product,amount]=args.join(" ").split("|");const o=createOrder({brand,product,amount,customerJid:jid});return sock.sendMessage(jid,{text:withFooter(o?"Order dibuat: "+o.id:"Format salah.")})}
  if(cmd==="verify"&&isOwner(jid)){const o=getOrder(args[0]);if(!o)return sock.sendMessage(jid,{text:withFooter("Order tidak ditemukan.")});const r=await verifyPayment(o,args[1]||"");if(r.status==="VERIFIED"){updateOrder(o.id,{status:"PAID",transactionId:r.transactionId,verifiedAt:new Date().toISOString()});return sock.sendMessage(jid,{text:withFooter("✅ Pembayaran terverifikasi: "+o.id)})}if(r.status==="INVALID")return;return sock.sendMessage(jid,{text:withFooter("⏳ Pembayaran masih menunggu pemeriksaan admin.")})}
  if(["rules","groupinfo","antilink","antispam","tagall"].includes(cmd))return handleGroupCommand(sock,m,cmd,args);
 }
 const ai=await askAI({message:text,brandHint:brands.find(x=>l.includes(x))||"auto"});
 return sock.sendMessage(jid,{text:withFooter(ai.reply)});
}