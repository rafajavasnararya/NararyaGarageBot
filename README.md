# NARARYA BUSINESS PLATFORM

WhatsApp automation + AI customer service + payment verification + multi-brand website untuk:

- 🎨 Nararya Studio
- 🚌 Nararya Garage
- 🛒 Nararya Store
- 🔵 Hilekros Studio
- 🏢 Nexovonarsa Corporation

## Automatic customer service

Bot menerima pertanyaan biasa dan meneruskannya ke AI provider melalui `AI_API_URL`. Jika AI belum dikonfigurasi, bot memakai fallback CS lokal sehingga tetap auto-reply.

Semua balasan customer memakai footer:
**PT NEXOVONARSACORPORATION - All Right Reserved**

AI tidak boleh mengarang harga, stok, status order, atau mengonfirmasi pembayaran. Status pembayaran tetap berasal dari payment provider.

## Pembayaran otomatis

- Provider API dapat dikonfigurasi lewat environment.
- Webhook pembayaran tersedia di `/webhook/payment`.
- Signature webhook wajib cocok dengan `PAYMENT_WEBHOOK_SECRET`.
- PAID/SUCCESS/SETTLED -> VERIFIED.
- INVALID/FAILED/NOT_FOUND/EXPIRED/CANCELLED -> INVALID.
- Status lain -> UNKNOWN dan admin diberi notifikasi.
- Setelah VERIFIED, receipt PNG dibuat otomatis dan dipublikasikan ke channel jika `CHANNEL_JID` tersedia.
- Receipt publik hanya memuat informasi order dasar, bukan rahasia pembayaran.

## Website

Website multi-brand tersedia sebagai:
- `/`
- `/garage.html`
- `/store.html`
- `/hilekros.html`
- `/studio.html`
- `/corporation.html`

Tema website menggunakan background abu-abu/biru gelap dengan layout responsif dan AI chat.

## Setup

1. Node.js 20+.
2. `npm install`.
3. Salin `.env.example` ke `.env`.
4. Isi OWNER_NUMBERS, payment provider, AI provider, ADMIN_NOTIFY_JID, dan CHANNEL_JID.
5. `npm start` untuk bot.
6. `npm run web` untuk website.
7. Scan QR WhatsApp.
8. Jadikan bot admin jika ingin memakai fitur manajemen grup.

## Catatan

Project menggunakan Baileys, library tidak resmi untuk WhatsApp Web. Kemampuan aktual dan aturan penggunaan dapat berubah. Gunakan secara wajar dan patuhi ketentuan WhatsApp.

Jangan commit API key, session WhatsApp, OTP, token, atau data pelanggan ke GitHub.
