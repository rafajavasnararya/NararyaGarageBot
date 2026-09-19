import fs from "node:fs";
import path from "node:path";

const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files";
const apiUrl = "https://www.googleapis.com/drive/v3/files";
const registryPath = path.resolve("data/google-drive-registry.json");

function readRegistry() {
  try { return JSON.parse(fs.readFileSync(registryPath, "utf8")); }
  catch { return {}; }
}

function writeRegistry(data) {
  fs.mkdirSync(path.dirname(registryPath), { recursive: true });
  fs.writeFileSync(registryPath, JSON.stringify(data, null, 2));
}

function authHeaders(token, extra = {}) {
  return { authorization: "Bearer " + token, ...extra };
}

export async function getDriveRegistry() {
  return readRegistry();
}

export async function uploadEncryptedFile({
  buffer,
  name,
  mimeType,
  folderId = process.env.GOOGLE_DRIVE_FOLDER_ID,
  key = null
}) {
  return upsertDriveFile({
    buffer,
    name,
    mimeType: "application/octet-stream",
    folderId,
    key,
    encrypted: true
  });
}

export async function upsertDriveFile({
  buffer,
  name,
  mimeType,
  folderId = process.env.GOOGLE_DRIVE_FOLDER_ID,
  key,
  encrypted = false
}) {
  const token = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  if (!token) {
    return { uploaded: false, created: false, replaced: false, reason: "GOOGLE_DRIVE_ACCESS_TOKEN is not configured" };
  }

  const registry = readRegistry();
  const existingId = key ? registry[key] : null;

  if (existingId) {
    const response = await fetch(
      apiUrl + "/" + encodeURIComponent(existingId) + "?uploadType=media",
      {
        method: "PATCH",
        headers: authHeaders(token, {
          "content-type": mimeType,
          "content-length": String(buffer.length)
        }),
        body: buffer,
        signal: AbortSignal.timeout(30000)
      }
    );

    if (response.ok) {
      registry[key] = existingId;
      writeRegistry(registry);
      return {
        uploaded: true,
        created: false,
        replaced: true,
        id: existingId,
        name,
        key,
        encrypted
      };
    }

    if (![404, 410].includes(response.status)) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error?.message || "drive_replace_failed");
    }
  }

  const metadata = {
    name,
    ...(folderId ? { parents: [folderId] } : {})
  };

  const boundary = "nararya_" + Math.random().toString(16).slice(2);
  const head = Buffer.from(
    "--" + boundary +
    "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    "\r\n--" + boundary +
    "\r\nContent-Type: " + mimeType +
    "\r\n\r\n"
  );
  const tail = Buffer.from("\r\n--" + boundary + "--");
  const body = Buffer.concat([head, buffer, tail]);

  const response = await fetch(
    uploadUrl + "?uploadType=multipart",
    {
      method: "POST",
      headers: authHeaders(token, {
        "content-type": "multipart/related; boundary=" + boundary,
        "content-length": String(body.length)
      }),
      body,
      signal: AbortSignal.timeout(30000)
    }
  );

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.error?.message || "drive_upload_failed");
  }

  if (key) {
    registry[key] = result.id;
    writeRegistry(registry);
  }

  return {
    uploaded: true,
    created: true,
    replaced: false,
    id: result.id,
    name: result.name,
    key,
    encrypted
  };
}

export async function replaceManagedFile({ key, buffer, name, mimeType, folderId }) {
  return upsertDriveFile({ key, buffer, name, mimeType, folderId });
}
