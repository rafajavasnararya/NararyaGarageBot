# NEXOVONARSACORPORATION | WHATSAPPCOSTUMERSERVICE.AI

> Multi-brand WhatsApp customer-service, automation, catalog, payment and administration platform.

Repository workspace: `rafajavasnararya/NararyaGarageBot`  
Target product name: **NEXOVONARSACORPORATION | WHATSAPPCOSTUMERSERVICE.AI**

## Brands
- Nararya Garage
- Nararya Store
- Nararya Studio
- Hilekros Products / Hilekros Studio
- Nexovonarsa Corporation

## Current architecture
The repository already contains bot, web, database, member, security, catalog, payment,
reports, deployment, tests, Python, TypeScript, CSS, HTML, SQL, Bash and C++ components.
It is organized into more than 25 directories and includes CI checks plus native C++ smoke tests.

## Customer service
The bot provides natural Indonesian customer-service replies, catalog lookup, AI routing/fallback,
call handling, admin escalation and a standard footer:

**PT NEXOVONARSACORPORATION - All Right Reserved**

The bot must not invent price, stock, order status, payment status or policy. AI is an assistant,
while official catalog/payment/database records remain the source of truth.

## Purchase automation
After a payment is independently verified by the configured payment provider:
1. order status becomes VERIFIED;
2. purchase history is recorded;
3. a receipt PNG is generated;
4. a transaction-safe receipt can be published to the configured WhatsApp channel.

The public receipt must never contain KTP, KK, SIM, student-card or face-image data.

## Member Resmi
Member registration supports:
- WhatsApp number;
- Gmail;
- Instagram/TikTok account references and submitted evidence;
- PO BUSSID/ETS2 affiliation;
- ownership evidence for paid mods/kodenames;
- purchase history.

Identity documents and face images are **sensitive data**. They are kept out of GitHub/public
web/channel payloads and are stored only through the protected storage path when the deployment
is configured for it. Collection should be limited to what is necessary, with consent, access
control, retention and deletion procedures.

Media AI classification returns:
- LIKELY_ORIGINAL
- LIKELY_MANUAL_EDITED
- LIKELY_AI_ASSISTED
- UNCERTAIN

This is an automated indication, not forensic proof. Uncertain/low-confidence cases require
human review.

## Group management
A newly detected group remains PENDING. It is not automatically controlled.

An owner explicitly approves a group with:

`/groupapprove JID`

Only approved groups are eligible for automation. When the bot is an admin and scheduling is
enabled, approved groups are configured to:
- close at 23:00 WIB;
- reopen at 05:00 WIB.

Admin commands require authorization.

## WhatsApp login
The bot uses a linked-device session. On first setup, scan the QR code shown by the client.

The application does **not** collect or store WhatsApp OTP codes. OTP is part of WhatsApp's own
account verification flow and must remain inside WhatsApp. Never ask customers to send OTP, PIN,
password or verification codes to the bot.

## Catalog
WhatsApp Business / Graph API integration is available as an adapter. Automatic catalog sync can
refresh local data, while automatic price/stock mutation is deliberately guarded so AI cannot
silently rewrite business data.

## Website
The web dashboard contains dedicated pages for:
- Nararya Garage
- Nararya Store
- Hilekros Products
- Nararya Studio
- Nexovonarsa Corporation

Theme: dark gray / blue-gray, responsive, with the corporate footer.

## Excel & Word
Operational reports are separated by domain:
- members;
- social evidence metadata;
- ownership evidence metadata;
- purchases;
- finance;
- media review;
- catalog;
- audit log;
- call log;
- security/operations.

Sensitive identity images are not embedded into ordinary spreadsheets or public documents.

## Google Drive
Drive synchronization uses stable file identifiers where configured. Existing files are updated
instead of creating duplicates. Real Drive access only works after valid credentials/tokens are
configured.

## Security
- AES-256-GCM encryption is available for sensitive storage.
- Secrets belong in environment variables, never source control.
- WhatsApp sessions are ignored by Git.
- Sensitive documents stay outside public web and channel messages.
- Audit logging records administrative activity without copying identity documents.

## Setup
1. Install Node.js 20+.
2. `npm install`.
3. Copy `.env.example` to `.env`.
4. Configure owner/admin numbers and integration credentials.
5. Generate a 32-byte sensitive-data key with the provided script.
6. Start the bot with `npm start`.
7. Start the web app with `npm run web`.
8. Link the WhatsApp device by scanning the QR code.
9. Make the bot an admin only in groups where group-management functions are required.
10. Run `npm test` and the repository CI checks before production.

## Production note
No software can honestly be promised as "100% error-free" before its real WhatsApp account,
Meta/Cloud API permissions, payment provider, Google Drive credentials, server environment and
production traffic are tested. The repository is structured to fail safely rather than pretend
that external services are magically configured.

---

**PT NEXOVONARSACORPORATION - All Right Reserved**
