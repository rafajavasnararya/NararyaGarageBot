import 'dotenv/config';

const csv = (value = '') => value.split(',').map(v => v.trim()).filter(Boolean);

export const config = {
  botName: process.env.BOT_NAME || 'NARARYA BUSINESS BOT',
  ownerNumbers: csv(process.env.OWNER_NUMBERS),
  adminNotifyJid: process.env.ADMIN_NOTIFY_JID || '',
  channelJid: process.env.CHANNEL_JID || '',
  paymentApiUrl: process.env.PAYMENT_PROVIDER_API_URL || '',
  paymentApiKey: process.env.PAYMENT_PROVIDER_API_KEY || '',
  port: Number(process.env.PORT || 3000),
  prefix: process.env.PREFIX || '/',
  publicMode: process.env.PUBLIC_MODE !== 'false'
};

export const brands = {
  studio: { key: 'NS', name: 'NARARYA STUDIO', emoji: '🎨' },
  garage: { key: 'NG', name: 'NARARYA GARAGE', emoji: '🚌' },
  hilekros: { key: 'HP', name: 'HILEKROS PRODUCTS', emoji: '🛒' }
};
