import { mainMenu, brandMenu, withFooter } from "./messages.js";
import { getOrder, createOrder, updateOrder } from "./services/orders.js";
import { verifyPayment } from "./services/payment.js";
import { isOwner } from "./services/auth.js";
import { askAI } from "./services/ai.js";
import { handleGroupCommand } from "./services/groupManager.js";
import { catalogReply, catalogContext } from "./services/catalog.js";
import { startMemberFlow } from "../../member/src/flow.js";
import { handleMemberCommand } from "../../member/src/onboarding.js";
import { consentText } from "../../member/src/privacy.js";
import { isApprovedGroup, approveGroup, rejectGroup } from "../../groups/src/approval.js";

const brands = ["studio", "garage", "store", "hilekros", "corporation"];
const groupCommands = [
  "rules","groupinfo","antilink","antispam","tagall","promote","demote",
  "remove","subject","description","link","revoke","settings"
];

function getText(message) {
  return (
    message?.message?.conversation ||
    message?.message?.extendedTextMessage?.text ||
    message?.message?.imageMessage?.caption ||
    message?.message?.videoMessage?.caption ||
    ""
  ).trim();
}

function isGroup(jid) {
  return String(jid || "").endsWith("@g.us");
}

async function notifyApprovalResult(sock, groupJid, approved, actor) {
  const text = approved
    ? [
        "✅ GRUP DISETUJUI",
        "",
        "Grup ini sudah dikonfirmasi oleh admin.",
        "Bot siap menjalankan layanan otomatis dan fitur admin sesuai hak akses.",
        "",
        "Disetujui oleh: " + actor,
        "",
        "PT NEXOVONARSACORPORATION - All Right Reserved"
      ].join("\n")
    : [
        "⛔ GRUP TIDAK DISETUJUI",
        "",
        "Bot tidak mengaktifkan layanan otomatis pada grup ini.",
        "Silakan hubungi admin resmi apabila grup perlu dipertimbangkan kembali.",
        "",
        "PT NEXOVONARSACORPORATION - All Right Reserved"
      ].join("\n");
  await sock.sendMessage(groupJid, { text });
}

export async function routeMessage(sock, m) {
  const jid = m.key.remoteJid;
  const text = getText(m);
  if (!jid || !text) return;

  const l = text.toLowerCase();

  // Approval commands are owner-only and should be issued from a private chat.
  if (l.startsWith("/groupapprove ")) {
    if (isGroup(jid) || !isOwner(jid)) {
      return sock.sendMessage(jid, { text: withFooter("⛔ Perintah ini hanya untuk admin utama melalui chat privat.") });
    }
    const target = text.slice("/groupapprove ".length).trim();
    if (!target.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: withFooter("Format: /groupapprove 123456789@g.us") });
    }
    const approved = approveGroup(target, jid);
    await notifyApprovalResult(sock, target, true, jid);
    return sock.sendMessage(jid, {
      text: withFooter("✅ Grup disetujui: " + approved.subject + "\nJID: " + approved.jid)
    });
  }

  if (l.startsWith("/groupreject ")) {
    if (isGroup(jid) || !isOwner(jid)) {
      return sock.sendMessage(jid, { text: withFooter("⛔ Perintah ini hanya untuk admin utama melalui chat privat.") });
    }
    const parts = text.slice("/groupreject ".length).trim().split(/\s+/);
    const target = parts.shift();
    const reason = parts.join(" ").slice(0, 300) || "Tidak ada alasan.";
    if (!target?.endsWith("@g.us")) {
      return sock.sendMessage(jid, { text: withFooter("Format: /groupreject 123456789@g.us alasan") });
    }
    const rejected = rejectGroup(target, jid, reason);
    await notifyApprovalResult(sock, target, false, jid);
    return sock.sendMessage(jid, {
      text: withFooter("⛔ Grup ditolak: " + rejected.subject + "\nAlasan: " + reason)
    });
  }

  if (isGroup(jid) && !isApprovedGroup(jid)) {
    // Quarantine: do not expose bot admin features before confirmation.
    return sock.sendMessage(jid, {
      text: withFooter("Grup ini sedang menunggu konfirmasi admin resmi. Bot belum mengaktifkan layanan otomatis di grup ini.")
    });
  }

  if (["menu", "start", "help"].includes(l)) {
    return sock.sendMessage(jid, { text: mainMenu() });
  }

  if (l === "/member daftar" || l === "member daftar") {
    const flow = startMemberFlow(jid);
    return sock.sendMessage(jid, { text: withFooter(flow.message || consentText()) });
  }

  if (l.startsWith("/member ")) {
    const args = text.slice(8).trim().split(/\s+/);
    const result = handleMemberCommand(jid, args);
    return sock.sendMessage(jid, { text: withFooter(result.reply) });
  }

  if (brands.includes(l)) {
    return sock.sendMessage(jid, { text: brandMenu(l) });
  }

  if (l.startsWith("status ")) {
    const o = getOrder(text.slice(7).trim());
    const result = o
      ? ["📦 STATUS PESANAN","Order: " + o.id,"Brand: " + o.brand,"Produk: " + o.product,"Status: " + o.status].join("\n")
      : "Order tidak ditemukan. Silakan cek kembali Order ID.";
    return sock.sendMessage(jid, { text: withFooter(result) });
  }

  if (text.startsWith("/")) {
    const [cmd, ...args] = text.slice(1).split(/\s+/);

    if (cmd === "createorder" && isOwner(jid)) {
      const [brand, product, amount] = args.join(" ").split("|");
      const order = createOrder({ brand, product, amount, customerJid: jid });
      return sock.sendMessage(jid, { text: withFooter(order ? "✅ Order dibuat: " + order.id : "Format order salah.") });
    }

    if (cmd === "verify" && isOwner(jid)) {
      const order = getOrder(args[0]);
      if (!order) return sock.sendMessage(jid, { text: withFooter("Order tidak ditemukan.") });
      const result = await verifyPayment(order, args[1] || "");
      if (result.status === "VERIFIED") {
        updateOrder(order.id, {
          status: "PAID",
          transactionId: result.transactionId,
          verifiedAt: new Date().toISOString()
        });
        return sock.sendMessage(jid, { text: withFooter("✅ Pembayaran terverifikasi: " + order.id) });
      }
      if (result.status === "INVALID") return sock.sendMessage(jid, { text: withFooter("❌ Pembayaran tidak terverifikasi.") });
      return sock.sendMessage(jid, { text: withFooter("⏳ Pembayaran masih menunggu pemeriksaan admin/provider.") });
    }

    if (groupCommands.includes(cmd)) {
      return handleGroupCommand(sock, m, cmd, args);
    }
  }

  const brandHint = brands.find(x => l.includes(x)) || "auto";
  const catalog = catalogContext(text);
  const ai = await askAI({ message: text, brandHint, catalogText: catalog });
  const catalogMessage = catalogReply(text);

  if (catalogMessage && /(katalog|produk|mod|kd|harga|stok|available|tersedia)/.test(l)) {
    return sock.sendMessage(jid, { text: withFooter(catalogMessage) });
  }

  return sock.sendMessage(jid, { text: withFooter(ai.reply) });
}
