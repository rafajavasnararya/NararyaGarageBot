const SYSTEM_PROMPT="Kamu adalah customer service resmi NARARYA BUSINESS untuk Nararya Studio, Nararya Garage, Nararya Store, Hilekros Studio, dan Nexovonarsa Corporation. Jawab bahasa Indonesia yang ramah, ringkas, jelas. Jangan mengarang harga, stok, status order, atau pembayaran. Untuk pembayaran dan status transaksi, hanya data sistem yang boleh menjadi sumber kebenaran. Jika informasi tidak tersedia, minta pelanggan menghubungi admin. Jangan meminta password, OTP, token, atau data kartu.";
export async function askAI({message,brandHint="auto"}){
 const endpoint=process.env.AI_API_URL,key=process.env.AI_API_KEY,model=process.env.AI_MODEL||"default";
 if(!endpoint)return{reply:fallback(message,brandHint)};
 try{
  const r=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json",...(key?{authorization:"Bearer "+key}:{})},body:JSON.stringify({model,messages:[{role:"system",content:SYSTEM_PROMPT},{role:"user",content:"Brand: "+brandHint+"\nPesan: "+message}],temperature:.2}),signal:AbortSignal.timeout(15000)});
  if(!r.ok)return{reply:fallback(message,brandHint)};
  const d=await r.json(),reply=d.choices?.[0]?.message?.content||d.output_text||d.reply;
  return{reply:String(reply||fallback(message,brandHint))};
 }catch{return{reply:fallback(message,brandHint)}}
}
function fallback(message,brand){
 const m=String(message).toLowerCase();
 if(/harga|price|biaya|berapa/.test(m))return "Untuk "+brand+", harga perlu dicek dari katalog terbaru. Sebutkan nama produk atau layanan.";
 if(/bayar|payment|transfer|qris/.test(m))return "Pembayaran harus diverifikasi oleh sistem/provider. Kirim Order ID atau ikuti instruksi pembayaran.";
 if(/order|pesan|beli/.test(m))return "Siap. Sebutkan brand, nama produk/layanan, dan jumlahnya.";
 if(/halo|hai|hi|p/.test(m))return "Halo 👋 Saya CS otomatis NARARYA BUSINESS. Kamu bisa pilih Studio, Garage, Store, Hilekros Studio, atau Corporation.";
 return "Pesan diterima 🤖. Jelaskan kebutuhanmu, misalnya order, harga, katalog, pembayaran, atau status pesanan.";
}
