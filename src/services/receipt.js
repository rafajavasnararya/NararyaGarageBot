import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export async function createReceipt(order) {
  const dir = path.resolve('receipts');
  fs.mkdirSync(dir, { recursive: true });
  const safe = order.id.replace(/[^A-Z0-9_-]/gi, '_');
  const output = path.join(dir, safe + '.png');

  const svg = `<svg width="1000" height="1250" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="60" y="90" font-family="Arial" font-size="42" font-weight="700">NARARYA BUSINESS</text>
    <text x="60" y="145" font-family="Arial" font-size="28">${escapeXml(order.brand)}</text>
    <line x1="60" y1="185" x2="940" y2="185" stroke="#111111" stroke-width="2"/>
    <text x="60" y="255" font-family="Arial" font-size="26">ORDER ID</text>
    <text x="60" y="300" font-family="Arial" font-size="34" font-weight="700">${escapeXml(order.id)}</text>
    <text x="60" y="380" font-family="Arial" font-size="26">PRODUCT</text>
    <text x="60" y="425" font-family="Arial" font-size="30">${escapeXml(order.product)}</text>
    <text x="60" y="505" font-family="Arial" font-size="26">AMOUNT</text>
    <text x="60" y="550" font-family="Arial" font-size="34" font-weight="700">Rp ${Number(order.amount).toLocaleString('id-ID')}</text>
    <text x="60" y="630" font-family="Arial" font-size="26">TRANSACTION ID</text>
    <text x="60" y="675" font-family="Arial" font-size="30">${escapeXml(order.transactionId || '-')}</text>
    <rect x="60" y="755" width="880" height="105" rx="18" fill="#111111"/>
    <text x="500" y="823" text-anchor="middle" font-family="Arial" font-size="36" font-weight="700" fill="#ffffff">PAYMENT VERIFIED</text>
    <text x="60" y="955" font-family="Arial" font-size="22">Verified: ${escapeXml(order.verifiedAt || new Date().toISOString())}</text>
    <text x="60" y="1040" font-family="Arial" font-size="20">Bukti ini dibuat otomatis oleh NARARYA BUSINESS BOT.</text>
    <text x="60" y="1080" font-family="Arial" font-size="18">Sensitive payment details are intentionally omitted.</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(output);
  return output;
}

function escapeXml(value = '') {
  return String(value).replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
}
