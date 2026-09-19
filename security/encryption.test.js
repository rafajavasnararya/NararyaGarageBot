import test from "node:test";
import assert from "node:assert/strict";

process.env.SENSITIVE_DATA_KEY_BASE64 = Buffer.alloc(32, 7).toString("base64");

test("AES-256-GCM JSON round trip", async () => {
  const { encryptJson, decryptJson } = await import("./encryption.js");
  const input = { memberId: "MEM-TEST", gmail: "private@example.com", ok: true };
  const encoded = encryptJson(input);
  assert.notEqual(encoded, JSON.stringify(input));
  assert.deepEqual(decryptJson(encoded), input);
});
