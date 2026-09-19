const state=new Map();
export function checkSpam(jid,user,limit=6,windowMs=10000){
  const key=jid+":"+user;
  const now=Date.now();
  const rows=(state.get(key)||[]).filter(t=>now-t<windowMs);
  rows.push(now);
  state.set(key,rows);
  return rows.length>limit;
}
export function clearSpam(jid,user){state.delete(jid+":"+user);}