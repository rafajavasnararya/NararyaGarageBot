import fs from 'node:fs';
const file='data/members.json';
function read(){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return {members:[],documents:[],purchases:[]};}}
function write(db){fs.mkdirSync('data',{recursive:true});fs.writeFileSync(file,JSON.stringify(db,null,2));}
export function saveMember(m){const db=read();db.members.push(m);write(db);return m;}
export function getMemberByWhatsApp(w){return read().members.find(x=>x.whatsapp===w);}
export function saveDocumentRef(d){const db=read();db.documents.push(d);write(db);return d;}
export function savePurchase(p){const db=read();db.purchases.push(p);write(db);return p;}
export function listMembers(){return read().members.map(({identity,face,...safe})=>safe);}
export function listPurchases(){return read().purchases;}