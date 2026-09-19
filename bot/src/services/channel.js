import fs from "node:fs/promises";

export async function publish(sock, text, imagePath = null) {
  const jid = process.env.CHANNEL_JID;
  if (!jid) return { ok: false, reason: "CHANNEL_JID is not configured" };
  if (imagePath) {
    const image = await fs.readFile(imagePath);
    await sock.sendMessage(jid, { image, caption: text });
    return { ok: true, type: "image" };
  }
  await sock.sendMessage(jid, { text });
  return { ok: true, type: "text" };
}

export function publicTransaction(order) {
  return [
    "✅ TRANSAKSI TERVERIFIKASI",
    "Brand: " + order.brand,
    "Produk: " + order.product,
    "Order: " + order.id,
    "Status: " + order.status,
    "",
    "Data identitas pelanggan tidak dipublikasikan.",
    "",
    "PT NEXOVONARSACORPORATION - All Right Reserved"
  ].join("\n");
}
