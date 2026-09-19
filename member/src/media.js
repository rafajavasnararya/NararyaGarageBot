export const MEDIA_LABELS=['LIKELY_ORIGINAL','LIKELY_MANUAL_EDITED','LIKELY_AI_ASSISTED','UNCERTAIN'];
export function reviewImage({metadata={},visionScore=null,manualSignals=0}={}){
 let label='UNCERTAIN'; let confidence=0;
 if(Number.isFinite(visionScore)&&visionScore>=0.8){label='LIKELY_AI_ASSISTED';confidence=visionScore;}
 else if(manualSignals>=2){label='LIKELY_MANUAL_EDITED';confidence=Math.min(.95,.55+manualSignals*.1);}
 else if(Object.keys(metadata).length>0){label='LIKELY_ORIGINAL';confidence=.55;}
 return {label,confidence,requiresHumanReview:label==='UNCERTAIN'||confidence<.75};
}
export function disclaimer(){return 'Pemeriksaan AI hanya indikasi probabilistik, bukan bukti forensik. Kasus tidak pasti wajib diperiksa manusia.';}