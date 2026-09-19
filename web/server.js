import express from "express"; import path from "node:path"; import {fileURLToPath} from "node:url";
const app=express(),root=path.dirname(fileURLToPath(import.meta.url)); app.use(express.json()); app.use(express.static(path.join(root,"public")));
app.get("/api/health",(_,r)=>r.json({ok:true,service:"NARARYA BUSINESS WEB",time:new Date().toISOString()}));
app.get("/api/brands",(_,r)=>r.json([{id:"garage",name:"NARARYA GARAGE",path:"/garage.html"},{id:"store",name:"NARARYA STORE",path:"/store.html"},{id:"hilekros",name:"HILEKROS STUDIO",path:"/hilekros.html"},{id:"studio",name:"NARARYA STUDIO",path:"/studio.html"},{id:"corporation",name:"NEXOVONARSA CORPORATION",path:"/corporation.html"}]));
app.listen(process.env.WEB_PORT||8080,()=>console.log("NARARYA BUSINESS WEB online"));
