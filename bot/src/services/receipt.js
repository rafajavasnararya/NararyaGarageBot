import fs from "node:fs";
import path from "node:path";
export function createReceipt(order){
  const dir=path.resolve("receipts");
  fs.mkdirSync(dir,{recursive:true});
  const file=path.join(dir,order.id+".json");
  const receipt={id:order.id,brand:order.brand,product:order.product,amount:order.amount,status:order.status,createdAt:new Date().toISOString()};
  fs.writeFileSync(file,JSON.stringify(receipt,null,2));
  return file;
}
export function receiptExists(id){return fs.existsSync(path.resolve("receipts",id+".json"));}