import fs from "node:fs";
import path from "node:path";
const file=path.resolve("data/member-sessions.json");
function read(){if(!fs.existsSync(file))return {};return JSON.parse(fs.readFileSync(file,"utf8"));}
function write(data){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data,null,2));}
export function getSession(whatsapp){return read()[whatsapp]||null;}
export function setSession(whatsapp,patch){const data=read();data[whatsapp]={...(data[whatsapp]||{}),...patch,updatedAt:new Date().toISOString()};write(data);return data[whatsapp];}
export function clearSession(whatsapp){const data=read();delete data[whatsapp];write(data);}
