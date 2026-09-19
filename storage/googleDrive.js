const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files";

export async function uploadEncryptedFile({ buffer, name, mimeType, folderId = process.env.GOOGLE_DRIVE_FOLDER_ID }) {
  const token = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  if (!token) return { uploaded: false, reason: "GOOGLE_DRIVE_ACCESS_TOKEN is not configured" };
  const metadata = { name, mimeType: "application/octet-stream", ...(folderId ? { parents: [folderId] } : {}) };
  const boundary = "nararya_" + Math.random().toString(16).slice(2);
  const head = Buffer.from("--"+boundary+"\\r\\nContent-Type: application/json; charset=UTF-8\\r\\n\\r\\n"+JSON.stringify(metadata)+"\\r\\n--"+boundary+"\\r\\nContent-Type: "+mimeType+"\\r\\n\\r\\n");
  const tail = Buffer.from("\\r\\n--"+boundary+"--");
  const body = Buffer.concat([head, buffer, tail]);
  const response = await fetch(uploadUrl+"?uploadType=multipart",{method:"POST",headers:{authorization:"Bearer "+token,"content-type":"multipart/related; boundary="+boundary,"content-length":String(body.length)},body,signal:AbortSignal.timeout(30000)});
  const result = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(result?.error?.message || "drive_upload_failed");
  return { uploaded:true,id:result.id,name:result.name };
}
