export async function publish(sock,text,image){
  const jid=process.env.CHANNEL_JID;
  if(!jid)return false;
  if(image)return sock.sendMessage(jid,{image:{url:image},caption:text});
  return sock.sendMessage(jid,{text});
}
export function publicTransaction(order){
  return "✅ TRANSAKSI TERVERIFIKASI\nBrand: "+order.brand+"\nOrder: "+order.id;
}