import {Router} from "express";
const router=Router();
router.get("/health",(_,res)=>res.json({ok:true,service:"NARARYA BUSINESS"}));
router.get("/brands",(_,res)=>res.json([
  {id:"studio",name:"NARARYA STUDIO",color:"purple"},
  {id:"garage",name:"NARARYA GARAGE",color:"orange"},
  {id:"hilekros",name:"HILEKROS PRODUCTS",color:"blue"}
]));
router.get("/version",(_,res)=>res.json({version:"2.0.0",node:process.version}));
export default router;