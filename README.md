# NARARYA BUSINESS WHATSAPP BOT

Satu bot WhatsApp untuk:

- 🎨 Nararya Studio
- 🚌 Nararya Garage
- 🛒 Hilekros Products

## Fitur

- Menu customer service per brand
- Pembuatan dan pengecekan order
- Verifikasi pembayaran melalui provider API
- Pembayaran INVALID tidak membalas customer secara normal; admin diberi alert
- Pembayaran UNKNOWN ditahan untuk pemeriksaan manual
- Bukti transaksi otomatis dibuat sebagai PNG
- Notifikasi admin dan channel
- Welcome/goodbye grup
- Anti-link dan anti-spam dasar
- Perintah admin grup: /rules, /groupinfo, /antilink, /antispam, /tagall
- Role OWNER, SUPER_ADMIN, BRAND_ADMIN, MODERATOR

## Penting soal pembayaran

Bot tidak menganggap screenshot sebagai bukti pembayaran. Screenshot dapat dipalsukan. Status transaksi harus berasal dari payment provider API/webhook yang benar.

Adapter di `src/services/paymentVerifier.js` mengharapkan endpoint yang mengembalikan JSON seperti:

```json
{
  "status": "PAID",
  "transactionId": "TX-123"
}
```

Status PAID = VERIFIED. INVALID/FAILED/NOT_FOUND/EXPIRED = INVALID. Selain itu = UNKNOWN.

Untuk produksi, gunakan webhook provider dengan validasi signature. Jangan commit API key, session WhatsApp, atau data pelanggan ke GitHub.

## Setup

1. Install Node.js 20+.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env`.
4. Isi `OWNER_NUMBERS`, provider pembayaran, dan JID notifikasi.
5. Jalankan `npm start`.
6. Scan QR WhatsApp dari terminal.
7. Jadikan akun bot admin di grup yang ingin dikelola.

## Commands

Customer:
- `menu`
- `studio`
- `garage`
- `hilekros`
- `status ORDER_ID`

Owner:
- `/createorder BRAND|PRODUCT|AMOUNT`
- `/verify ORDER_ID [TRANSACTION_ID]`

Group admin:
- `/rules`
- `/groupinfo`
- `/antilink on|off`
- `/antispam on|off`
- `/tagall`

## Catatan WhatsApp

Project ini menggunakan Baileys, yaitu library tidak resmi untuk WhatsApp Web. Kemampuan aktual, kompatibilitas, dan aturan penggunaan dapat berubah. Gunakan secara wajar dan patuhi ketentuan WhatsApp.
