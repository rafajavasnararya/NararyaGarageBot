import { mainMenu, brandMenu, withFooter } from "./messages.js";
import { getOrder, createOrder, updateOrder } from "./services/orders.js";
import { verifyPayment } from "./services/payment.js";
import { isOwner } from "./services/auth.js";
import { askAI } from "./services/ai.js";
import { handleGroupCommand } from "./services/groupManager.js";
import { catalogReply, catalogContext } from "./services/catalog.js";
import { sendProfessionalReply } from "./services/response.js";
import { startMemberFlow } from "../../member/src/flow.js";
import { handleMemberCommand } from "../../member/src/onboarding.js";
import { ingestMemberImage } from "../../member/src/mediaUpload.js";
import { getMemberByWhatsApp } from "../../member/src/store.js";
import { consentText } from "../../member/src/privacy.js";

const brands = ["studio", "garage", "store", "hilekros", "corporation"];

function getText(message) {
  return (
    message?.message?.conversation ||
    message?.message?.extendedTextMessage?.text ||
    message?.message?.imageMessage?.caption ||
    message?.message?.videoMessage?.caption ||
    ""
  ).trim();
}

async function reply(sock, jid, text) {
  return sendProfessionalReply(sock, jid, withFooter(text));
}

export async function routeMessage(sock, m) {
  const jid = m.key.remoteJid;
  const text = getText(m);
  if (!jid) return;

  const l = text.toLowerCase();

  if (m.message?.imageMessage && /^\\/member\\s+upload\\s+/i.test(text)) {
    const type = text.split(/\\s+/).slice(2).join("_").toUpperCase();
    const member = getMemberByWhatsApp(jid);

    if (!member) {
      return reply(sock, jid, "Sebelum mengirim bukti, silakan mulai /member daftar terlebih dahulu.");
    }

    try {
      const result = await ingestMemberImage(sock, m, member.member_id, type);
      const visibility = result.sensitive
        ? "File disimpan sebagai referensi privat terenkripsi dan tidak dipublikasikan."
        : "File disimpan sebagai referensi privat.";
      return reply(sock, jid, "✅ Bukti berhasil diterima. " + visibility + " Admin akan melakukan pemeriksaan berikutnya.");
    } catch (error) {
      return reply(sock, jid, "Maaf, file belum berhasil diproses. Coba kirim ulang sebagai foto dengan caption /member upload JENIS.");
    }
  }

  if (["menu", "start", "help"].includes(l)) {
    return reply(sock, jid, mainMenu());
  }

  if (l === "/member daftar" || l === "member daftar") {
    const flow = startMemberFlow(jid);
    return reply(sock, jid, flow.message || consentText());
  }

  if (l.startsWith("/member ")) {
    const args = text.slice(8).trim().split(/\\s+/);
    const result = handleMemberCommand(jid, args);
    return reply(sock, jid, result.reply);
  }

  if (brands.includes(l)) {
    return reply(sock, jid, brandMenu(l));
  }

  if (l.startsWith("status ")) {
    const o = getOrder(text.slice(7).trim());
    const result = o
      ? ["📦 STATUS PESANAN", "Order: " + o.id, "Brand: " + o.brand, "Produk: " + o.product, "Status: " + o.status].join("\n")
      : "Order tidak ditemukan. Silakan cek kembali Order ID.";
    return reply(sock, jid, result);
  }

  if (text.startsWith("/")) {
    const [cmd, ...args] = text.slice(1).split(/\\s+/);

    if (cmd === "createorder" && isOwner(jid)) {
      const [brand, product, amount] = args.join(" ").split("|");
      const order = createOrder({ brand, product, amount, customerJid: jid });
      return reply(sock, jid, order ? "✅ Order dibuat: " + order.id : "Format order salah.");
    }

    if (cmd === "verify" && isOwner(jid)) {
      const order = getOrder(args[0]);
      if (!order) return reply(sock, jid, "Order tidak ditemukan.");
      const result = await verifyPayment(order, args[1] || "");
      if (result.status === "VERIFIED") {
        updateOrder(order.id, {
          status: "PAID",
          transactionId: result.transactionId,
          verifiedAt: new Date().toISOString()
        });
        return reply(sock, jid, "✅ Pembayaran terverifikasi: " + order.id);
      }
      if (result.status === "INVALID") return reply(sock, jid, "❌ Pembayaran tidak terverifikasi.");
      return reply(sock, jid, "⏳ Pembayaran masih menunggu pemeriksaan admin/provider.");
    }

    if ([
      "rules","groupinfo","antilink","antispam","tagall",
      "promote","demote","remove","subject","description",
      "link","revoke","settings"
    ].includes(cmd)) {
      return handleGroupCommand(sock, m, cmd, args);
    }
  }

  const brandHint = brands.find(x => l.includes(x)) || "auto";
  const catalog = catalogContext(text);
  const ai = await askAI({ message: text, brandHint, catalogText: catalog });
  const catalogMessage = catalogReply(text);

  if (catalogMessage && /(katalog|produk|mod|kd|harga|stok|available|tersedia)/.test(l)) {
    return reply(sock, jid, catalogMessage);
  }

  return reply(sock, jid, ai.reply);
}
