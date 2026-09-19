# NARARYA BUSINESS PLATFORM

WhatsApp automation + AI customer service + payment verification + multi-brand website untuk:

- 🎨 Nararya Studio
- 🚌 Nararya Garage
- 🛒 Nararya Store
- 🔵 Hilekros Studio / Hilekros Products
- 🏢 Nexovonarsa Corporation

## Customer service otomatis

Bot menerima chat biasa dan merespons dengan gaya customer service natural berbahasa Indonesia.

Fitur:
- menu multi-brand;
- katalog lookup;
- AI provider + fallback lokal;
- typing/composing delay pendek agar balasan terasa natural;
- template balasan saat pelanggan meminta waktu;
- handler panggilan untuk meminta pelanggan menjelaskan keperluan melalui chat;
- footer standar:

PT NEXOVONARSACORPORATION - All Right Reserved

AI tidak boleh mengarang harga, stok, status order, atau pembayaran.

## Pembayaran otomatis

- Payment webhook tersedia di /webhook/payment.
- Signature webhook wajib valid.
- PAID/SUCCESS/SETTLED -> VERIFIED.
- Invalid/failed/expired/cancelled -> INVALID.
- Status lain -> UNKNOWN dan admin diberi notifikasi.
- Receipt PNG dibuat otomatis setelah pembayaran tervalidasi.
- Riwayat pembelian member dicatat setelah pembayaran terverifikasi.
- Receipt publik tidak berisi dokumen identitas atau foto wajah.

## Member Resmi

Alur member menggunakan consent dan metadata terstruktur.

Data operasional:
- WhatsApp;
- Gmail;
- Instagram/TikTok;
- PO BUSSID/ETS2;
- riwayat pembelian;
- bukti ownership.

Dokumen sensitif:
- KTP;
- KK;
- SIM;
- kartu pelajar;
- foto wajah.

Dokumen sensitif hanya disimpan sebagai file terenkripsi/private reference. Jangan kirim dokumen sensitif ke grup atau channel.

Image review menggunakan indikasi:
- LIKELY_ORIGINAL
- LIKELY_MANUAL_EDITED
- LIKELY_AI_ASSISTED
- UNCERTAIN

Hasil tersebut bukan bukti forensik. Kasus UNCERTAIN/confidence rendah masuk human review.

## Katalog

Ada service katalog lokal + adapter WhatsApp Business/Graph API.

- CATALOG_AUTO_SYNC=true
- CATALOG_AUTO_APPLY=false

Auto apply dimatikan secara default agar AI tidak mengubah harga/stok tanpa sumber data resmi.

## Website

Halaman tersedia:
- /
- /garage.html
- /store.html
- /hilekros.html
- /studio.html
- /corporation.html

Tema abu-abu/biru gelap dan responsive.

Nararya Store memiliki endpoint katalog:
- GET /api/catalog
- GET /api/catalog?q=kata-kunci

## Group management

Saat bot menjadi admin dan pengirim adalah admin, tersedia:
- /rules
- /groupinfo
- /tagall
- /promote
- /demote
- /remove
- /subject
- /description
- /link
- /revoke
- /antilink on|off
- /antispam on|off
- /settings

## Struktur teknologi

Project saat ini memiliki lebih dari 25 folder dan lebih dari 100 file repository.

Bahasa/teknologi:
- JavaScript
- TypeScript
- Python
- CSS
- HTML
- SQL
- C++
- Bash
- Docker
- GitHub Actions

Ada juga native C++ helper untuk media-signature/low-level triage.

## Excel & Word

File administrasi dibuat terpisah:
- database member;
- social evidence;
- ownership evidence;
- purchases;
- finance;
- media review;
- catalog;
- audit log;
- call log;
- security notes;
- dashboard.

## Google Drive

Adapter Google Drive tersedia untuk deployment. Kredensial akses harus dikonfigurasi sendiri di environment. Tidak ada klaim bahwa upload telah terjadi tanpa token yang valid.

## Setup

1. Node.js 20+.
2. npm install.
3. Salin .env.example menjadi .env.
4. Isi OWNER_NUMBERS, ADMIN_NUMBERS, AI provider, payment provider, dan konfigurasi Meta bila digunakan.
5. npm start untuk bot.
6. npm run web untuk website.
7. Scan QR bila menggunakan koneksi Baileys.
8. Jadikan bot admin grup bila memerlukan fungsi admin grup.

## Catatan WhatsApp

Baileys adalah koneksi WhatsApp Web, sedangkan WhatsApp Business Platform/Cloud API adalah jalur resmi Meta untuk integrasi bisnis.

Channel dan beberapa kemampuan admin dapat berbeda dari chat biasa. Verifikasi fitur pada akun WhatsApp target sebelum production.

Jangan commit:
- API key;
- access token;
- OTP;
- session WhatsApp;
- KTP/KK/SIM/kartu pelajar;
- foto wajah pelanggan.

## Security & scheduled groups

- Member operational data is encrypted at rest with AES-256-GCM using `SENSITIVE_DATA_KEY_BASE64`.
- New groups are PENDING until an owner explicitly approves them with `/groupapprove JID`.
- APPROVED groups are the only groups processed by bot automation.
- Approved groups are automatically closed at 23:00 WIB and reopened at 05:00 WIB when the bot is an admin and `scheduleEnabled=true`.
- Each Excel/Word report is a separate managed file; Google Drive sync updates the existing file ID instead of creating duplicates.

