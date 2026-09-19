import fs from "node:fs";
import path from "node:path";

const file = path.resolve("data/members.json");

function read() {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { members: [], documents: [], purchases: [] };
  }
}

function write(db) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

export function saveMember(member) {
  const db = read();
  const index = db.members.findIndex(x => x.member_id === member.member_id);
  if (index >= 0) db.members[index] = { ...db.members[index], ...member };
  else db.members.push(member);
  write(db);
  return member;
}

export function getMemberByWhatsApp(whatsapp) {
  return read().members.find(x => x.whatsapp === whatsapp) || null;
}

export function saveDocumentRef(document) {
  const db = read();
  db.documents.push(document);
  write(db);
  return document;
}

export function savePurchase(purchase) {
  const db = read();
  db.purchases.push(purchase);
  write(db);
  return purchase;
}

export function listMembers() {
  return read().members.map(({ identity, face, rawIdentity, rawFace, ...safe }) => safe);
}

export function listPurchases(memberId = null) {
  const purchases = read().purchases;
  return memberId ? purchases.filter(x => x.member_id === memberId) : purchases;
}
