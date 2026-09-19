# Automation Flow

Purchase:
1. Create a unique Order ID.
2. Receive a signed payment webhook.
3. Verify the webhook before changing payment state.
4. Treat an already-paid order as idempotent so duplicate webhooks do not publish duplicate receipts.
5. Generate a receipt PNG containing transaction-safe fields only.
6. Notify the admin and publish the receipt to CHANNEL_JID when configured.

Groups:
Only APPROVED groups are automated. A new group creates a pending approval request.
An owner/admin explicitly approves it. If the bot is actually a group admin, approved
groups can switch to announcement mode at 23:00 WIB and reopen at 05:00 WIB.

Login:
Use WhatsApp linked-device/QR. This project does not collect or store WhatsApp OTP
codes. Phone-number verification, where available, remains inside WhatsApp's own UI.

AI:
The conversational layer must not invent price, stock, payment status or policy.
Image-origin classification is probabilistic: LIKELY_ORIGINAL, LIKELY_MANUAL_EDITED,
LIKELY_AI_ASSISTED or UNCERTAIN. Low-confidence results require human review.

PT NEXOVONARSACORPORATION - All Right Reserved
