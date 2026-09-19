import { createSecureJsonStore } from "../../database/src/secureJsonStore.js";

const dbStore = createSecureJsonStore("data/members.enc.json", {
  members: [],
  documents: [],
  purchases: []
});

export function saveMember(member) {
  const db = dbStore.read();
  const index = db.members.findIndex(x => x.member_id === member.member_id);
  if (index >= 0) db.members[index] = { ...db.members[index], ...member };
  else db.members.push(member);
  dbStore.write(db);
  return member;
}

export function getMemberByWhatsApp(whatsapp) {
  return dbStore.read().members.find(x => x.whatsapp === whatsapp) || null;
}

export function saveDocumentRef(document) {
  const db = dbStore.read();
  db.documents.push(document);
  dbStore.write(db);
  return document;
}

export function savePurchase(purchase) {
  const db = dbStore.read();
  db.purchases.push(purchase);
  dbStore.write(db);
  return purchase;
}

export function listMembers() {
  return dbStore.read().members.map(({ identity, face, rawIdentity, rawFace, ...safe }) => safe);
}

export function listPurchases(memberId = null) {
  const purchases = dbStore.read().purchases;
  return memberId ? purchases.filter(x => x.member_id === memberId) : purchases;
}
