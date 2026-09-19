import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const FOOTER = "PT NEXOVONARSACORPORATION - All Right Reserved";

export async function createReceipt(order) {
  const dir = path.resolve("receipts");
  fs.mkdirSync(dir, { recursive: true });
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const lines = [
    "NARARYA BUSINESS RECEIPT",
    "",
    "Order  : " + order.id,
    "Brand  : " + order.brand,
    "Product: " + order.product,
    "Amount : Rp" + Number(order.amount || 0).toLocaleString("id-ID"),
    "Status : " + order.status,
    "",
    FOOTER
  ];
  const rows = lines.map((x, i) =>
    '<text x="80" y="' + (95 + i * 50) + '" fill="#e8eef7" font-family="Arial" font-size="' +
    (i === 0 ? 42 : 25) + '" font-weight="' + (i === 0 ? 700 : 400) + '">' + esc(x) + "</text>"
  ).join("");
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760">' +
    '<rect width="1200" height="760" fill="#252b35"/>' +
    '<rect x="40" y="40" width="1120" height="680" rx="28" fill="#384454"/>' + rows + "</svg>";
  const file = path.join(dir, order.id + ".png");
  await sharp(Buffer.from(svg)).png().toFile(file);
  return file;
}

export function receiptExists(id) {
  return fs.existsSync(path.resolve("receipts", id + ".png"));
}
