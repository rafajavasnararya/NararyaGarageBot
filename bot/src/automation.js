import express from "express";
import { verifySignature, normalizeWebhook } from "./services/webhook.js";
import { getOrder, updateOrder } from "./services/orders.js";
import { createReceipt } from "./services/receipt.js";
import { publish, publicTransaction } from "./services/channel.js";
import { notifyAdmin } from "./notifications.js";
import { getMemberByWhatsApp, savePurchase } from "../../member/src/store.js";

function isPaid(status) {
  return ["PAID", "SUCCESS", "SETTLED"].includes(status);
}

function isInvalid(status) {
  return ["INVALID", "FAILED", "NOT_FOUND", "EXPIRED", "CANCELLED"].includes(status);
}

export function startAutomationServer(sock) {
  const app = express();
  app.use(express.json({ verify: (req, _, buf) => { req.rawBody = buf; } }));

  app.post("/webhook/payment", async (req, res) => {
    try {
      const signature = req.headers["x-signature"] || "";
      const secret = process.env.PAYMENT_WEBHOOK_SECRET;
      if (!secret || !verifySignature(req.rawBody, signature, secret)) {
        return res.status(401).json({ ok: false, error: "invalid signature" });
      }

      const payment = normalizeWebhook(req.body);
      const order = getOrder(payment.orderId);
      if (!order) return res.status(404).json({ ok: false, error: "order not found" });

      if (isPaid(payment.status)) {
        // Idempotency: payment providers may retry the same webhook.
        if (String(order.status).toUpperCase() === "PAID") {
          return res.json({ ok: true, status: "ALREADY_VERIFIED", orderId: order.id });
        }
        const updated = updateOrder(order.id, {
          status: "PAID",
          transactionId: payment.transactionId,
          verifiedAt: new Date().toISOString()
        }) || order;

        const member = getMemberByWhatsApp(updated.customerJid);
        if (member) {
          savePurchase({
            purchase_id: "PUR-" + Date.now(),
            member_id: member.member_id,
            order_id: updated.id,
            brand: updated.brand,
            product: updated.product,
            kind: updated.product,
            amount: Number(updated.amount || 0),
            payment_status: "PAID",
            receipt_ref: "receipt:" + updated.id,
            created_at: new Date().toISOString()
          });
        }

        const receipt = await createReceipt(updated);
        await notifyAdmin(sock, "✅ Pembayaran terverifikasi otomatis: " + updated.id);
        await publish(sock, publicTransaction(updated), receipt);
        return res.json({ ok: true, status: "VERIFIED", orderId: updated.id });
      }

      if (isInvalid(payment.status)) {
        await notifyAdmin(sock, "⚠️ Pembayaran tidak terverifikasi: " + order.id);
        return res.json({ ok: true, status: "INVALID", orderId: order.id });
      }

      await notifyAdmin(sock, "⏳ Status pembayaran perlu pemeriksaan admin: " + order.id);
      return res.json({ ok: true, status: "UNKNOWN", orderId: order.id });
    } catch (error) {
      await notifyAdmin(sock, "⚠️ Automation error: " + error.message);
      return res.status(500).json({ ok: false, error: "automation_error" });
    }
  });

  app.listen(process.env.PAYMENT_WEBHOOK_PORT || 3010, () => {
    console.log("Payment automation webhook online");
  });
}
