import fs from "node:fs";
import path from "node:path";

const file = path.resolve("data/approved-groups.json");

function read() {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return { approved: {}, pending: {} }; }
}

function write(data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function isApprovedGroup(jid) {
  return Boolean(read().approved[String(jid)]);
}

export function getGroupApproval(jid) {
  const db = read();
  return db.approved[String(jid)] || db.pending[String(jid)] || null;
}

export function requestGroupApproval({ jid, subject, requestedBy }) {
  const db = read();
  const key = String(jid);
  if (db.approved[key]) return { status: "APPROVED", record: db.approved[key] };
  const record = {
    jid: key,
    subject: subject || "Unknown Group",
    requestedBy: requestedBy || "",
    requestedAt: new Date().toISOString(),
    status: "PENDING"
  };
  db.pending[key] = record;
  write(db);
  return { status: "PENDING", record };
}

export function approveGroup(jid, actor) {
  const db = read();
  const key = String(jid);
  const pending = db.pending[key] || { jid: key, subject: "Approved Group" };
  db.approved[key] = {
    ...pending,
    status: "APPROVED",
    approvedBy: actor,
    approvedAt: new Date().toISOString()
  };
  delete db.pending[key];
  write(db);
  return db.approved[key];
}

export function rejectGroup(jid, actor, reason = "") {
  const db = read();
  const key = String(jid);
  const pending = db.pending[key] || { jid: key, subject: "Unknown Group" };
  db.pending[key] = {
    ...pending,
    status: "REJECTED",
    rejectedBy: actor,
    rejectedAt: new Date().toISOString(),
    reason
  };
  write(db);
  return db.pending[key];
}

export function listApprovedGroups() {
  return Object.values(read().approved);
}

export function listPendingGroups() {
  return Object.values(read().pending).filter(x => x.status === "PENDING");
}
