import {isAdmin} from "./auth.js";
export async function manageGroup(sock,message,action,target){
  const jid=message.key.remoteJid;
  const sender=message.key.participant||jid;
  if(!isAdmin(sender)) return false;
  if(action==="info"){
    const meta=await sock.groupMetadata(jid);
    await sock.sendMessage(jid,{text:`Group: ${meta.subject}\nMembers: ${meta.participants.length}`});
    return true;
  }
  if(!target) return false;
  if(["remove","promote","demote"].includes(action)){
    await sock.groupParticipantsUpdate(jid,[target],action);
    return true;
  }
  return false;
}