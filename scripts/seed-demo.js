import {createRecord} from "../database/src/repository.js";
const rows=[
  {id:"NS-DEMO-101",brand:"studio",product:"Logo Team",amount:45000,status:"PAID"},
  {id:"NG-DEMO-102",brand:"garage",product:"ACC Pack",amount:25000,status:"PENDING"},
  {id:"HP-DEMO-103",brand:"hilekros",product:"Demo Product",amount:75000,status:"PAID"}
];
for(const row of rows)createRecord("orders",row);
console.log("Inserted",rows.length,"demo orders");