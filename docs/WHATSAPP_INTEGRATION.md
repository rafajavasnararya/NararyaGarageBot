# WHATSAPP INTEGRATION

## 1. Customer service

The project includes:
- natural Indonesian customer-service wording;
- short human-like typing delay;
- composing/paused presence when supported;
- call follow-up asking the caller to state the purpose;
- fallback responses when an external AI provider is unavailable.

## 2. Official WhatsApp Business Platform

For official business messaging, configure valid Meta WhatsApp Business Platform credentials in .env.

Typical configuration includes:
- META_ACCESS_TOKEN
- META_PHONE_NUMBER_ID
- META_WABA_ID
- META_CATALOG_ID
- META_GRAPH_VERSION

Use an official Meta Business account and valid webhook configuration.

## 3. Catalog

The catalog adapter can synchronize product records from the configured Meta catalog.

Default:
CATALOG_AUTO_APPLY=false

The bot can read and match catalog data, but it should not silently change prices or stock without an authorized source.

## 4. Channels

CHANNEL_JID is an output target used by the current WhatsApp client layer for receipt publication.

Channel administration and posting capabilities can differ from ordinary chats and from the official Cloud API. Verify the target account before production use.

## 5. Groups

Group participant changes, names and descriptions require the bot to be an admin of the group. The current group-management implementation is in the WhatsApp Web client layer.

## 6. Security

Never put session files, access tokens, API keys, KTP/KK/SIM/student-card images, or face images into GitHub.
