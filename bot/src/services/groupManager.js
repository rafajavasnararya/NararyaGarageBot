import { isAdmin as isGlobalAdmin, isOwner } from "./auth.js";
import { getGroup, setGroup } from "../../../src/store.js";
import { audit } from "../../../database/src/audit.js";

function participantIsAdmin(meta, jid) {
  const row = meta.participants.find(p => p.id === jid || p.phoneNumber === jid);
  return Boolean(row?.admin);
}

export async function handleGroupCommand(sock, message, action, args = []) {
  const jid = message.key.remoteJid;
  const sender = message.key.participant || jid;
  if (!jid?.endsWith("@g.us")) return { ok: false, reason: "not_group" };
  const meta = await sock.groupMetadata(jid);
  const botId = sock.user?.id?.split(":")[0] + "@s.whatsapp.net";
  const senderAdmin = participantIsAdmin(meta, sender) || isGlobalAdmin(sender) || isOwner(sender);
  const botAdmin = participantIsAdmin(meta, botId);
  if (!senderAdmin) {
    await sock.sendMessage(jid, { text: "⛔ Perintah admin grup." });
    return { ok: false, reason: "sender_not_admin" };
  }
  if (action === "rules") return sock.sendMessage(jid, { text: "📜 RULES\n• Tidak spam/scam.\n• Jangan sebar data pribadi.\n• Link promosi harus izin admin.\n• Hormati member." });
  if (action === "groupinfo") return sock.sendMessage(jid, { text: ["👥 " + meta.subject, "Member: " + meta.participants.length, "Bot admin: " + (botAdmin ? "YA" : "TIDAK")].join("\n") });
  const privileged = ["promote", "demote", "remove", "add", "subject", "description", "revoke"];
  if (!botAdmin && privileged.includes(action)) return sock.sendMessage(jid, { text: "⚠️ Bot harus menjadi admin grup untuk aksi ini." });
  if (["promote", "demote", "remove"].includes(action)) {
    const target = String(args[0] || "").replace(/[^0-9]/g, "");
    if (!target) return sock.sendMessage(jid, { text: "Format: /" + action + " 628xxxxxxxxxx" });
    const targetJid = target + "@s.whatsapp.net";
    await sock.groupParticipantsUpdate(jid, [targetJid], action);
    audit("GROUP_" + action.toUpperCase(), { jid, sender, targetJid });
    return sock.sendMessage(jid, { text: "✅ " + action + " selesai untuk " + targetJid });
  }
  if (action === "tagall") {
    const mentions = meta.participants.map(x => x.id);
    return sock.sendMessage(jid, { text: mentions.map(x => "@" + x.split("@")[0]).join(" "), mentions });
  }
  if (action === "subject") {
    const subject = args.join(" ").trim().slice(0, 100);
    if (!subject) return sock.sendMessage(jid, { text: "Format: /subject Nama Grup" });
    await sock.groupUpdateSubject(jid, subject);
    audit("GROUP_SUBJECT", { jid, sender, subject });
    return sock.sendMessage(jid, { text: "✅ Nama grup diperbarui." });
  }
  if (action === "description") {
    const description = args.join(" ").trim().slice(0, 512);
    if (!description) return sock.sendMessage(jid, { text: "Format: /description Teks deskripsi" });
    await sock.groupUpdateDescription(jid, description);
    audit("GROUP_DESCRIPTION", { jid, sender, changed: true });
    return sock.sendMessage(jid, { text: "✅ Deskripsi grup diperbarui." });
  }
  if (action === "antilink") {
    const enabled = String(args[0] || "").toLowerCase() === "on";
    setGroup(jid, { antilink: enabled });
    return sock.sendMessage(jid, { text: "🔒 Antilink: " + (enabled ? "ON" : "OFF") });
  }
  if (action === "antispam") {
    const enabled = String(args[0] || "").toLowerCase() === "on";
    setGroup(jid, { antispam: enabled });
    return sock.sendMessage(jid, { text: "🛡️ Antispam: " + (enabled ? "ON" : "OFF") });
  }
  if (action === "link") {
    const code = await sock.groupInviteCode(jid);
    return sock.sendMessage(jid, { text: "🔗 https://chat.whatsapp.com/" + code });
  }
  if (action === "revoke") {
    await sock.groupRevokeInvite(jid);
    return sock.sendMessage(jid, { text: "✅ Link grup direset." });
  }
  if (action === "settings") return sock.sendMessage(jid, { text: JSON.stringify(getGroup(jid), null, 2) });
  return sock.sendMessage(jid, { text: "Perintah grup tidak dikenali." });
}

export const manageGroup = handleGroupCommand;
