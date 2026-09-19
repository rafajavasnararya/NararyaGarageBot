import {listRecords} from "./repository.js";
export function orderStats(){
  const orders=listRecords("orders");
  return {
    total:orders.length,
    paid:orders.filter(x=>x.status==="PAID").length,
    pending:orders.filter(x=>x.status==="PENDING").length,
    invalid:orders.filter(x=>x.status==="INVALID").length,
    revenue:orders.filter(x=>x.status==="PAID").reduce((a,x)=>a+Number(x.amount||0),0)
  };
}
export function brandStats(brand){return listRecords("orders").filter(x=>x.brand===brand);}