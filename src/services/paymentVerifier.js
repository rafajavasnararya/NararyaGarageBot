import { config } from '../config.js';

export async function verifyPayment(order, suppliedTransactionId = '') {
  if (!config.paymentApiUrl) {
    return { status: 'UNKNOWN', reason: 'PAYMENT_PROVIDER_API_URL belum dikonfigurasi.' };
  }

  const url = new URL(config.paymentApiUrl);
  url.searchParams.set('orderId', order.id);
  url.searchParams.set('amount', String(order.amount));
  if (suppliedTransactionId) url.searchParams.set('transactionId', suppliedTransactionId);

  const headers = { Accept: 'application/json' };
  if (config.paymentApiKey) headers.Authorization = 'Bearer ' + config.paymentApiKey;

  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { status: 'UNKNOWN', reason: 'Provider HTTP ' + response.status };

    const data = await response.json();
    const status = String(data.status || '').toUpperCase();
    const tx = data.transactionId || data.transaction_id || suppliedTransactionId || null;

    if (status === 'PAID' || status === 'SUCCESS' || status === 'SETTLED') {
      return { status: 'VERIFIED', transactionId: tx };
    }
    if (['INVALID', 'FAILED', 'NOT_FOUND', 'EXPIRED', 'CANCELLED'].includes(status)) {
      return { status: 'INVALID', transactionId: tx, reason: status };
    }
    return { status: 'UNKNOWN', transactionId: tx, reason: status || 'Provider tidak memberikan status yang dikenali.' };
  } catch (error) {
    return { status: 'UNKNOWN', reason: error.message };
  }
}
