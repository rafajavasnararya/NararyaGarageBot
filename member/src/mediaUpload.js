import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { storeSecureBuffer } from "../../storage/secureVault.js";
import { attachEvidence } from "./flow.js";
import { isSensitive } from "./privacy.js";

export const SUPPORTED_UPLOAD_TYPES = [
  "SOCIAL_SCREENSHOT",
  "MOD_OWNERSHIP",
  "KTP",
  "KK",
  "SIM",
  "KARTU_PELAJAR",
  "FACE"
];

export async function ingestMemberImage(sock, message, memberId, type) {
  const normalized = String(type || "").toUpperCase();
  if (!SUPPORTED_UPLOAD_TYPES.includes(normalized)) {
    throw new Error("unsupported_upload_type");
  }

  const image = message?.message?.imageMessage;
  if (!image) throw new Error("image_required");

  const buffer = await downloadMediaMessage(
    message,
    "buffer",
    {},
    { logger: sock.logger, reuploadRequest: sock.updateMediaMessage }
  );

  const stored = await storeSecureBuffer({
    memberId,
    type: normalized,
    buffer,
    mimeType: image.mimetype || "image/jpeg",
    originalName: normalized + ".jpg"
  });

  const ref = attachEvidence(memberId, normalized, stored.storageRef, stored.sha256);
  return {
    ref,
    storageRef: stored.storageRef,
    sensitive: isSensitive(normalized)
  };
}
