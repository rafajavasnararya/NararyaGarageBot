import {createRecord,listRecords} from "./repository.js";
export function audit(event,payload){
  return createRecord("logs",{event,payload,createdAt:new Date().toISOString()});
}
export function recent(limit=50){
  return listRecords("logs").slice(-limit).reverse();
}