export const SECURITY_RULES=Object.freeze({noSecretsInGit:true,verifyPaymentWithProvider:true,redactPublicReceipts:true,ownerCommandsOnly:true,antiSpamEnabled:true,auditAdminActions:true,failClosedOnUnknownPayment:true,aiMustNotInventOrderStatus:true,aiMustNotConfirmPayment:true,webhookSignatureRequired:true});
export function isSafePaymentStatus(status){return ["VERIFIED","INVALID","UNKNOWN"].includes(String(status).toUpperCase());}
export function sanitizeText(input,max=2000){return String(input??"").replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/g,"").slice(0,max);}
