export type MemberStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
export type MediaIndication = 'LIKELY_ORIGINAL' | 'LIKELY_MANUAL_EDITED' | 'LIKELY_AI_ASSISTED' | 'UNCERTAIN';
export interface Member {
  memberId:string; status:MemberStatus; name:string; whatsapp:string; gmail?:string;
  instagram?:string; tiktok?:string; poBussid?:string; poEts2?:string;
  consentVersion:string; consentAt:string;
}
export interface SecureDocument {
  documentId:string; memberId:string; type:'KTP'|'KK'|'SIM'|'KARTU_PELAJAR'|'FACE'|'SOCIAL_SCREENSHOT'|'MOD_OWNERSHIP';
  storageRef:string; sha256:string; verificationStatus:string;
}
export interface MediaReview {
  memberId:string; assetRef:string; indication:MediaIndication; confidence:number;
  requiresHumanReview:boolean; reviewer?:string; finalStatus?:string;
}