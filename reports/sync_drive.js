import fs from "node:fs/promises";
import path from "node:path";
import { upsertDriveFile } from "../storage/googleDrive.js";

const ROOT = path.resolve("reports");

const FILES = {
  sales_xlsx: { file: "NARARYA_SALES.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  orders_xlsx: { file: "NARARYA_ORDERS.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  finance_xlsx: { file: "NARARYA_FINANCE.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  members_xlsx: { file: "NARARYA_MEMBERS.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  catalog_xlsx: { file: "NARARYA_CATALOG.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  sales_sop_docx: { file: "NARARYA_SALES_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  orders_sop_docx: { file: "NARARYA_ORDERS_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  finance_sop_docx: { file: "NARARYA_FINANCE_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  members_sop_docx: { file: "NARARYA_MEMBERS_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  catalog_sop_docx: { file: "NARARYA_CATALOG_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  security_sop_docx: { file: "NARARYA_SECURITY_SOP.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
};

export async function syncReportsToDrive() {
  const results = [];
  for (const [key, entry] of Object.entries(FILES)) {
    const filePath = path.join(ROOT, entry.file);
    try {
      const buffer = await fs.readFile(filePath);
      const result = await upsertDriveFile({
        key,
        buffer,
        name: entry.file,
        mimeType: entry.mimeType
      });
      results.push({ key, ...result });
    } catch (error) {
      results.push({
        key,
        uploaded: false,
        created: false,
        replaced: false,
        reason: error.message
      });
    }
  }
  return results;
}

export { FILES };
