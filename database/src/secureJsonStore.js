import fs from "node:fs";
import path from "node:path";
import { encryptJson, decryptJson } from "../../security/encryption.js";

export function createSecureJsonStore(filePath, initialValue) {
  const file = path.resolve(filePath);

  function ensureDir() {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }

  function read() {
    ensureDir();
    if (!fs.existsSync(file)) return structuredClone(initialValue);
    const encoded = fs.readFileSync(file, "utf8");
    if (!encoded.trim()) return structuredClone(initialValue);
    return decryptJson(encoded);
  }

  function write(value) {
    ensureDir();
    const encoded = encryptJson(value);
    const temp = file + ".tmp";
    fs.writeFileSync(temp, encoded, { mode: 0o600 });
    fs.renameSync(temp, file);
    return value;
  }

  return { read, write, file };
}
