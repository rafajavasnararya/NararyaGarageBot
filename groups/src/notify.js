import { requestGroupApproval } from "./approval.js";

export async function notifyGroupApproval(sock, { jid, subject, requestedBy }) {
  const result = requestGroupApproval({ jid, subject, requestedBy });
  const notifyJid = process.env.ADMIN_NOTIFY_JID;

  if (!notifyJid || result.status !== "PENDING") return result;

  const text = [
    "🔔 PERMINTAAN APPROVAL GRUP",
    "",
    "Nama: " + (subject || "Unknown"),
    "JID: " + jid,
    "Pemohon: " + (requestedBy || "-"),
    "",
    "Bot tidak akan menjalankan fungsi admin sebelum disetujui.",
    "",
    "Konfirmasi:",
    "/groupapprove " + jid,
    "/groupreject " + jid + " alasan",
    "",
    "PT NEXOVONARSACORPORATION - All Right Reserved"
  ].join("\n");

  await sock.sendMessage(notifyJid, { text });
  return result;
}
