import { acceptConsent } from "./flow.js";
import { getMemberByWhatsApp, saveMember } from "./store.js";
import { setSession } from "./session.js";

export function handleMemberCommand(whatsapp,args) {
  const command=String(args[0]||"").toLowerCase();
  if(command==="setuju"){
    const member=acceptConsent(whatsapp,"Belum diisi");
    setSession(whatsapp,{memberId:member.member_id,step:"NAME"});
    return {reply:"✅ Persetujuan dicatat. Kirim /member nama Nama Lengkap."};
  }
  const current=getMemberByWhatsApp(whatsapp);
  if(!current) return {reply:"Silakan mulai /member daftar terlebih dahulu."};
  if(command==="nama"){
    const name=args.slice(1).join(" ").trim();
    if(!name)return {reply:"Format: /member nama Nama Lengkap"};
    const updated={...current,name}; saveMember(updated); setSession(whatsapp,{memberId:updated.member_id,step:"EMAIL"});
    return {reply:"✅ Nama tersimpan. Lanjut /member email alamat@gmail.com"};
  }
  if(command==="email"){
    const gmail=args[1]||"";
    if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(gmail))return {reply:"Format email belum valid."};
    const updated={...current,gmail}; saveMember(updated); setSession(whatsapp,{memberId:updated.member_id,step:"SOCIAL"});
    return {reply:"✅ Gmail tersimpan. Kirim screenshot Instagram/TikTok melalui chat privat."};
  }
  if(command==="po"){
    const game=String(args[1]||"").toLowerCase(),value=args.slice(2).join(" ").trim();
    if(!value||!["bussid","ets2"].includes(game))return {reply:"Format: /member po bussid Nama PO atau /member po ets2 Nama PO"};
    const patch=game==="bussid"?{po_bussid:value}:{po_ets2:value}; const updated={...current,...patch}; saveMember(updated);
    return {reply:"✅ PO dicatat. Lanjut /member upload SOCIAL_SCREENSHOT dan /member upload MOD_OWNERSHIP."};
  }
  if(command==="status") return {reply:"Status Member: "+current.status+" | ID: "+current.member_id};
  return {reply:"Perintah member: /member daftar | setuju | nama | email | po | status"};
}
