import crypto from 'node:crypto';
import { saveMember, getMemberByWhatsApp, saveDocumentRef, savePurchase } from './store.js';
import { consentText, redactSensitive } from './privacy.js';
export function startMemberFlow(whatsapp){
 const existing=getMemberByWhatsApp(whatsapp);
 if(existing)return {step:'EXISTING',member:existing};
 return {step:'CONSENT',message:consentText()};
}
export function acceptConsent(whatsapp,name){
 const id='MEM-'+crypto.randomBytes(5).toString('hex').toUpperCase();
 const member={member_id:id,status:'PENDING',name,whatsapp,consent_version:'1.0',consent_at:new Date().toISOString()};
 saveMember(redactSensitive(member)); return member;
}
export function attachEvidence(memberId,type,storageRef,sha256){
 return saveDocumentRef({document_id:'DOC-'+crypto.randomBytes(5).toString('hex').toUpperCase(),member_id:memberId,type,storage_ref:storageRef,sha256,uploaded_at:new Date().toISOString(),verification_status:'PENDING'});
}
export function attachPurchase(data){return savePurchase({...data,purchase_id:'PUR-'+crypto.randomBytes(5).toString('hex').toUpperCase(),created_at:new Date().toISOString()});}