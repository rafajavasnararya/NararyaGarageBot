import crypto from "node:crypto";
console.log("SENSITIVE_DATA_KEY_BASE64=" + crypto.randomBytes(32).toString("base64"));
