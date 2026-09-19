import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { uploadEncryptedFile } from "./googleDrive.js";

function key() {
  const raw = process.env.SENSITIVE_DATA_KEY_BASE64;
  if (!raw) throw new Error("SENSITIVE_DATA_KEY_BASE64 is required");
  const buffer = Buffer.from(raw, "base64");
  if (buffer.length !== 32) throw new Error("SENSITIVE_DATA_KEY_BASE64 must decode to 32 bytes");
  return buffer;
}
function encrypt(buffer) {
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv("aes-256-gcm",key(),iv);
  const encrypted=Buffer.concat([cipher.update(buffer),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),encrypted]);
}
export async function storeSecureBuffer({memberId,type,buffer,mimeType="image/jpeg",originalName="evidence.jpg"}) {
  const encrypted=encrypt(buffer);
  const sha256=crypto.createHash("sha256").update(encrypted).digest("hex");
  const dir=path.resolve("data/private",String(memberId));
  fs.mkdirSync(dir,{recursive:true});
  const safe=originalName.replace(/[^a-zA-Z0-9._-]/g,"_");
  const fileName=Date.now()+"-"+String(type).toUpperCase()+"-"+safe+".enc";
  const localPath=path.join(dir,fileName);
  fs.writeFileSync(localPath,encrypted);
  const drive=await uploadEncryptedFile({buffer:encrypted,name:fileName,mimeType:"application/octet-stream"});
  return {storageRef:drive.uploaded?"gdrive:"+drive.id:"local:"+localPath,sha256,encrypted:true,mimeType,type};
}
