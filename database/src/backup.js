import fs from "node:fs";
import path from "node:path";
export function backup(){
  const source=path.resolve("data/database.json");
  if(!fs.existsSync(source))return null;
  const dir=path.resolve("data/backups");
  fs.mkdirSync(dir,{recursive:true});
  const target=path.join(dir,"database-"+Date.now()+".json");
  fs.copyFileSync(source,target);
  return target;
}