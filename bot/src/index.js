import "dotenv/config";
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import P from "pino";
import qrcode from "qrcode-terminal";
import { routeMessage } from "./router.js";
import { startAutomationServer } from "./automation.js";
import { startCatalogScheduler } from "../../catalog/src/scheduler.js";
import { notifyGroupApproval } from "../../groups/src/notify.js";
import { getGroupApproval } from "../../groups/src/approval.js";

const log = P({ level: process.env.LOG_LEVEL || "info" });
let catalogStarted = false;

function normalizeOwnJid(value) {
  return String(value || "").split(":")[0].split("/")[0];
}

async function respondToCall(sock, call) {
  const from = call?.from || call?.peerJid || call?.chatId;
  if (!from) return;

  const text = [
    "Halo, terima kasih sudah menghubungi NARARYA BUSINESS.",
    "",
    "Agar kami bisa membantu dengan tepat, boleh sampaikan keperluannya terlebih dahulu melalui chat WhatsApp ini?",
    "Mohon bersabar karena pesan kami balas satu per satu.",
    "",
    "PT NEXOVONARSACORPORATION - All Right Reserved"
  ].join("\n");

  try {
    await sock.sendMessage(from, { text });
  } catch (error) {
    log.warn({ error: String(error) }, "call follow-up message failed");
  }
}

async function handleGroupJoin(sock, update) {
  if (update?.action !== "add") return;

  const own = normalizeOwnJid(sock.user?.id);
  const participants = Array.isArray(update.participants) ? update.participants : [];
  const isBotAdded = participants.some(p => normalizeOwnJid(p) === own);
  if (!isBotAdded || !update.id?.endsWith("@g.us")) return;

  try {
    const metadata = await sock.groupMetadata(update.id);
    const existing = getGroupApproval(update.id);

    if (existing?.status === "APPROVED") {
      await sock.sendMessage(update.id, {
        text: "✅ NARARYA BUSINESS kembali aktif di grup yang sudah disetujui.\n\nPT NEXOVONARSACORPORATION - All Right Reserved"
      });
      return;
    }

    await notifyGroupApproval(sock, {
      jid: update.id,
      subject: metadata.subject,
      requestedBy: metadata.owner || ""
    });
  } catch (error) {
    log.error({ error: String(error), group: update.id }, "group approval request failed");
  }
}

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    process.env.AUTH_DIR || "data/auth_info"
  );

  const sock = makeWASocket({
    auth: state,
    logger: log,
    printQRInTerminal: false,
    browser: ["NARARYA BUSINESS BOT", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", u => {
    if (u.qr) qrcode.generate(u.qr, { small: true });

    if (u.connection === "open") {
      log.info("WhatsApp connected");
      if (!catalogStarted) {
        startAutomationServer(sock);
        startCatalogScheduler();
        catalogStarted = true;
      }
    }

    if (u.connection === "close") {
      const code = new Boom(u.lastDisconnect?.error)?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) setTimeout(startBot, 3000);
    }
  });

  sock.ev.on("group-participants.update", update => {
    handleGroupJoin(sock, update).catch(error => log.error(error));
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
      if (!m.key.fromMe && m.message) {
        try {
          await routeMessage(sock, m);
        } catch (error) {
          log.error(error);
        }
      }
    }
  });

  sock.ev.on("call", async calls => {
    for (const call of Array.isArray(calls) ? calls : [calls]) {
      try {
        await respondToCall(sock, call);
      } catch (error) {
        log.error(error);
      }
    }
  });

  return sock;
}

startBot().catch(error => log.error(error));
