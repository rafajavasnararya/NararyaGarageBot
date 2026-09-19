import { brands } from '../config.js';

export const mainMenu = `🤖 NARARYA BUSINESS BOT

Selamat datang di layanan resmi kami.

Pilih brand:

① 🎨 NARARYA STUDIO
② 🚌 NARARYA GARAGE
③ 🛒 HILEKROS PRODUCTS

Ketik:
studio
garage
hilekros
`;

export function brandMenu(type) {
  const b = brands[type];
  if (!b) return mainMenu;
  const lists = {
    studio: '• Vector\n• Line Up\n• Kaos / Jersey\n• Logo Team / Product / Perusahaan\n• Julukan\n• Pamflet Trip\n• Poster / Poster Bus\n• Stiker\n• 3D Design',
    garage: '• Kodename\n• Mod Request\n• ACC Request\n• Karoseri\n• Livery\n• BUSSID Services',
    hilekros: '• Product Catalog\n• Stock\n• Order\n• Payment\n• Status Pesanan'
  };
  return `${b.emoji} *${b.name}*

Layanan:
${lists[type]}

Ketik *menu* untuk kembali.
`;
}

export const invalidPaymentAdmin = (order, result) =>
  `🚨 PAYMENT ALERT\n\nOrder: ${order.id}\nBrand: ${order.brand}\nAmount: Rp ${Number(order.amount).toLocaleString('id-ID')}\nStatus: INVALID\nReason: ${result.reason || '-'}\n\nCustomer tidak menerima konfirmasi pembayaran otomatis.`;

export const unknownPaymentAdmin = (order, result) =>
  `⚠️ PAYMENT REVIEW\n\nOrder: ${order.id}\nBrand: ${order.brand}\nStatus: UNKNOWN\nReason: ${result.reason || '-'}`;
