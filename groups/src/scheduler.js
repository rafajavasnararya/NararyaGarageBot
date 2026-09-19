import { listApprovedGroups } from "./approval.js";

const DEFAULT_ZONE = process.env.GROUP_TIMEZONE || "Asia/Jakarta";
const CLOSE_HOUR = Number(process.env.GROUP_CLOSE_HOUR ?? "23");
const OPEN_HOUR = Number(process.env.GROUP_OPEN_HOUR ?? "5");
const state = new Map();

function localParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DEFAULT_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(date);

  const out = {};
  for (const p of parts) if (p.type !== "literal") out[p.type] = p.value;
  return out;
}

function actionForNow(date = new Date()) {
  const p = localParts(date);
  const hour = Number(p.hour);
  const minute = Number(p.minute);

  if (hour === CLOSE_HOUR && minute === 0) return "CLOSE";
  if (hour === OPEN_HOUR && minute === 0) return "OPEN";
  return null;
}

function dateKey(date = new Date()) {
  const p = localParts(date);
  return p.year + "-" + p.month + "-" + p.day;
}

function botIsAdmin(meta, botJid) {
  const normalized = String(botJid || "").split(":")[0] + "@s.whatsapp.net";
  return meta.participants.some(p => (p.id === normalized || p.phoneNumber === normalized) && Boolean(p.admin));
}

export async function applyGroupSchedule(sock, group) {
  if (!group?.jid || group.status !== "APPROVED" || group.scheduleEnabled === false) return;
  const action = actionForNow();
  if (!action) return;

  const key = group.jid + ":" + dateKey() + ":" + action;
  if (state.get(group.jid) === key) return;

  try {
    const meta = await sock.groupMetadata(group.jid);
    if (!botIsAdmin(meta, sock.user?.id)) {
      console.warn("[group-schedule] bot is not admin:", group.jid);
      return;
    }

    const setting = action === "CLOSE" ? "announcement" : "not_announcement";
    await sock.groupSettingUpdate(group.jid, setting);

    const statusText = action === "CLOSE"
      ? "🔒 Grup otomatis ditutup. Hanya admin yang dapat mengirim pesan sampai pukul 05.00 WIB."
      : "🔓 Grup otomatis dibuka kembali. Seluruh anggota dapat mengirim pesan.";

    await sock.sendMessage(group.jid, {
      text: statusText + "\n\nPT NEXOVONARSACORPORATION - All Right Reserved"
    });

    state.set(group.jid, key);
  } catch (error) {
    console.error("[group-schedule] failed:", group.jid, error.message);
  }
}

export function startGroupScheduler(sock, intervalMs = 30000) {
  const run = async () => {
    for (const group of listApprovedGroups()) {
      await applyGroupSchedule(sock, group);
    }
  };

  run().catch(error => console.error("[group-schedule] initial run:", error.message));
  return setInterval(() => run().catch(error => console.error("[group-schedule] run:", error.message)), intervalMs);
}

export function scheduleConfig() {
  return {
    timezone: DEFAULT_ZONE,
    close: String(CLOSE_HOUR).padStart(2, "0") + ":00",
    open: String(OPEN_HOUR).padStart(2, "0") + ":00"
  };
}
