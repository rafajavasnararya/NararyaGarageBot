export async function sendProfessionalReply(sock, jid, text, { typing = true } = {}) {
  const message = String(text || "").trim();
  if (!message) return;
  const delay = Math.min(2200, Math.max(350, Math.round(message.length * 4)));

  if (typing && sock.sendPresenceUpdate) {
    try { await sock.sendPresenceUpdate("composing", jid); } catch {}
  }
  await new Promise(resolve => setTimeout(resolve, delay));
  try { await sock.sendPresenceUpdate?.("paused", jid); } catch {}
  return sock.sendMessage(jid, { text: message });
}

export function customerServiceDelayHint() {
  return "Mohon bersabar karena pesan kami balas satu per satu agar detailnya tidak terlewat.";
}
