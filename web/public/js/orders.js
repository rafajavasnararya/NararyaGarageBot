import {api} from "./api.js";
export async function loadOrders(){
  const data=await api("orders");
  return data.orders||[];
}
export function renderOrders(rows,target){
  target.innerHTML=rows.map(o=>`<tr><td>${o.id}</td><td>${o.brand}</td><td>${o.status}</td><td>Rp ${Number(o.amount||0).toLocaleString("id-ID")}</td></tr>`).join("");
}