import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;

function getKey() {
  const encoded = process.env.SENSITIVE_DATA_KEY_BASE64;
  if (!encoded) throw new Error("SENSITIVE_DATA_KEY_BASE64 is not configured");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== KEY_BYTES) throw new Error("SENSITIVE_DATA_KEY_BASE64 must decode to 32 bytes");
  return key;
}

export function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([Buffer.from("NVB1"), iv, tag, encrypted]);
}

export function decryptBuffer(payload) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
  if (data.subarray(0, 4).toString() !== "NVB1") throw new Error("unsupported_encrypted_payload");
  const iv = data.subarray(4, 4 + IV_BYTES);
  const tag = data.subarray(4 + IV_BYTES, 4 + IV_BYTES + TAG_BYTES);
  const body = data.subarray(4 + IV_BYTES + TAG_BYTES);
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]);
}

export function encryptJson(value) {
  return encryptBuffer(Buffer.from(JSON.stringify(value), "utf8")).toString("base64");
}

export function decryptJson(value) {
  const plain = decryptBuffer(Buffer.from(String(value), "base64")).toString("utf8");
  return JSON.parse(plain);
}

export function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
