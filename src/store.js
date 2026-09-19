import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('data');
const file = path.join(dir, 'store.json');

const initial = { orders: {}, groups: {}, warnings: {} };

function load() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(initial, null, 2));
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

let db = load();

function save() {
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

export function createOrder({ brand, product, amount, customerJid }) {
  const prefix = brand.key;
  const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const count = Object.keys(db.orders).filter(id => id.startsWith(prefix + '-')).length + 1;
  const id = prefix + '-' + day + '-' + String(count).padStart(4, '0');
  db.orders[id] = {
    id, brand: brand.name, product, amount: Number(amount),
    customerJid, status: 'PENDING', transactionId: null,
    createdAt: new Date().toISOString(), verifiedAt: null
  };
  save();
  return db.orders[id];
}

export function getOrder(id) {
  return db.orders[String(id || '').toUpperCase()] || null;
}

export function setOrder(id, patch) {
  const order = getOrder(id);
  if (!order) return null;
  db.orders[order.id] = { ...order, ...patch };
  save();
  return db.orders[order.id];
}

export function getGroup(jid) {
  if (!db.groups[jid]) {
    db.groups[jid] = { antilink: false, antispam: false };
    save();
  }
  return db.groups[jid];
}

export function setGroup(jid, patch) {
  const current = getGroup(jid);
  db.groups[jid] = { ...current, ...patch };
  save();
  return db.groups[jid];
}

export function warn(jid, userJid) {
  const key = jid + ':' + userJid;
  db.warnings[key] = (db.warnings[key] || 0) + 1;
  save();
  return db.warnings[key];
}
