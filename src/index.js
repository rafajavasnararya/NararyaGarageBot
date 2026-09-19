import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  downloadContentFromMessage
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import qrcode from 'qrcode-terminal';
import express from 'express';
import fs from 'node:fs';
import { config, brands } from './config.js';
import { createOrder, getOrder, setOrder, getGroup, setGroup, warn } from './store.js';
import { verifyPayment } from './services/paymentVerifier.js';
import { createReceipt } from './services/receipt.js';
import { mainMenu, brandMenu, invalidPaymentAdmin, unknownPaymentAdmin } from './utils/messages.js';

const logger = P({ level: 'info' });
const app = express();
app.get('/health', (_, res) => res.json({ ok: true, bot: config.botName }));
app.listen(config.port, () => logger.info({ port: config.port }, 'Health server started'));

let sock;

const isOwner = jid => {
  const number = String(jid || '').split('@')[0].replace(/\\D/g, '');
  return config.ownerNumbers.some(n => n.replace(/\\D/g, '') === number);
};

const sendAdmin = async text => {
  if (config.adminNotifyJid) await sock.sendMessage(config.adminNotifyJid, { text });
};

const sendChannel = async (text, imagePath = null) => {
  if (!config.channelJid) return;
  if (imagePath && fs.existsSync(imagePath)) {
    await sock.sendMessage(config.channelJid, { image: { url: imagePath }, caption: text });
  } else {
    await sock.sendMessage(config.channelJid, { text });
  }
};

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  sock = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['NARARYA BUSINESS BOT', 'Chrome', '1.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'open') logger.info('WhatsApp connected.');
    if (connection === 'close') {
      const status = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (status !== DisconnectReason.loggedOut) setTimeout(connect, 3000);
      else logger.error('Logged out. Delete auth_info and pair again.');
    }
  });

  sock.ev.on('group-participants.update', async event => {
    try {
      for (const participant of event.participants) {
        if (event.action === 'add') await sock.sendMessage(event.id, { text: `👋 Selamat datang @${participant.split('@')[0]}!`, mentions: [participant] });
        if (event.action === 'remove') await sock.sendMessage(event.id, { text: `👋 @${participant.split('@')[0]} telah keluar/dikeluarkan.`, mentions: [participant] });
      }
    } catch (e) { logger.warn(e, 'Group participant event failed'); }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      await handleMessage(msg);
    }
  });
}

async function handleMessage(msg) {
  const jid = msg.key.remoteJid;
  const text = getText(msg).trim();
  if (!text) return;

  const lower = text.toLowerCase();
  if (lower === 'menu' || lower === 'start' || lower === 'help') return sock.sendMessage(jid, { text: mainMenu });
  if (['studio','garage','hilekros'].includes(lower)) return sock.sendMessage(jid, { text: brandMenu(lower) });

  if (lower.startsWith('status ')) {
    const order = getOrder(text.slice(7).trim());
    return sock.sendMessage(jid, { text: order ? `📦 ${order.id}\nBrand: ${order.brand}\nStatus: ${order.status}\nTransaction: ${order.transactionId || '-'}` : 'Order tidak ditemukan.' });
  }

  if (!text.startsWith(config.prefix)) return;
  const [command, ...args] = text.slice(config.prefix.length).trim().split(/\\s+/);
  const cmd = command.toLowerCase();

  if (cmd === 'createorder') {
    if (!isOwner(jid)) return;
    const [brandName, product, amount] = args.join(' ').split('|').map(v => v?.trim());
    const brand = brands[brandName?.toLowerCase()];
    if (!brand || !product || !amount || Number.isNaN(Number(amount))) return sock.sendMessage(jid, { text: 'Format: /createorder studio|Nama Produk|45000' });
    const order = createOrder({ brand, product, amount, customerJid: jid });
    return sock.sendMessage(jid, { text: `✅ Order dibuat: ${order.id}\nNominal: Rp ${Number(order.amount).toLocaleString('id-ID')}` });
  }

  if (cmd === 'verify') {
    if (!isOwner(jid)) return;
    const order = getOrder(args[0]);
    if (!order) return sock.sendMessage(jid, { text: 'Order tidak ditemukan.' });
    const result = await verifyPayment(order, args[1] || '');
    if (result.status === 'VERIFIED') {
      const updated = setOrder(order.id, { status: 'PAID', transactionId: result.transactionId, verifiedAt: new Date().toISOString() });
      const receipt = await createReceipt(updated);
      await sock.sendMessage(updated.customerJid, { text: `✅ Pembayaran terverifikasi.\nOrder: ${updated.id}\nTerima kasih.` });
      await sendAdmin(`✅ PAYMENT VERIFIED\\n${updated.id}\\n${updated.brand}\\nRp ${Number(updated.amount).toLocaleString('id-ID')}`);
      await sendChannel(`✅ Transaksi terverifikasi\\n${updated.brand}\\nOrder: ${updated.id}`, receipt);
      return sock.sendMessage(jid, { text: `✅ Verified: ${updated.id}` });
    }
    if (result.status === 'INVALID') {
      await setOrder(order.id, { status: 'INVALID' });
      await sendAdmin(invalidPaymentAdmin(order, result));
      return;
    }
    await sendAdmin(unknownPaymentAdmin(order, result));
    return sock.sendMessage(jid, { text: `⚠️ Pembayaran ${order.id} belum dapat diverifikasi otomatis. Admin akan memeriksa transaksi ini.` });
  }

  if (!jid.endsWith('@g.us')) return;

  const group = getGroup(jid);
  const metadata = await sock.groupMetadata(jid);
  const sender = msg.key.participant || msg.key.remoteJid;
  const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
  const botId = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
  const botIsAdmin = admins.includes(botId);
  const senderIsAdmin = admins.includes(sender) || isOwner(sender);

  if (group.antilink && /https?:\\/\\/|www\\./i.test(text) && !senderIsAdmin) {
    if (botIsAdmin) await sock.sendMessage(jid, { delete: msg.key });
    return;
  }

  if (group.antispam) {
    const count = warn(jid, sender);
    if (count >= 3 && botIsAdmin && !senderIsAdmin) {
      await sock.groupParticipantsUpdate(jid, [sender], 'remove');
      return;
    }
  }

  if (!text.startsWith(config.prefix)) return;
  const [command, ...args] = text.slice(config.prefix.length).trim().split(/\\s+/);
  const cmd = command.toLowerCase();

  if (!senderIsAdmin) return;

  if (cmd === 'rules') return sock.sendMessage(jid, { text: '📜 Rules grup:\\n1. No spam\\n2. No scam\\n3. No link tanpa izin\\n4. Hormati member lain.' });
  if (cmd === 'groupinfo') return sock.sendMessage(jid, { text: `👥 ${metadata.subject}\\nMember: ${metadata.participants.length}\\nBot admin: ${botIsAdmin ? 'YA' : 'TIDAK'}` });
  if (cmd === 'antilink') {
    const value = (args[0] || '').toLowerCase() === 'on';
    setGroup(jid, { antilink: value });
    return sock.sendMessage(jid, { text: `Anti-link: ${value ? 'ON' : 'OFF'}` });
  }
  if (cmd === 'antispam') {
    const value = (args[0] || '').toLowerCase() === 'on';
    setGroup(jid, { antispam: value });
    return sock.sendMessage(jid, { text: `Anti-spam: ${value ? 'ON' : 'OFF'}` });
  }
  if (cmd === 'tagall') {
    const mentions = metadata.participants.map(p => p.id);
    return sock.sendMessage(jid, { text: mentions.map(x => '@' + x.split('@')[0]).join(' '), mentions });
  }
}

function getText(msg) {
  const m = msg.message;
  return m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    '';
}

connect().catch(err => logger.error(err, 'Fatal connection error'));
