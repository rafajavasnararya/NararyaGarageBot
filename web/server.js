import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { askAI } from "../bot/src/services/ai.js";
import { listCatalog } from "../catalog/src/repository.js";
import { findMatches } from "../catalog/src/matcher.js";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(root, "public")));

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    service: "NARARYA BUSINESS WEB",
    time: new Date().toISOString()
  });
});

app.get("/api/brands", (_, res) => {
  res.json([
    { id: "garage", name: "NARARYA GARAGE", path: "/garage.html" },
    { id: "store", name: "NARARYA STORE", path: "/store.html" },
    { id: "hilekros", name: "HILEKROS STUDIO", path: "/hilekros.html" },
    { id: "studio", name: "NARARYA STUDIO", path: "/studio.html" },
    { id: "corporation", name: "NEXOVONARSA CORPORATION", path: "/corporation.html" }
  ]);
});

app.get("/api/catalog", (req, res) => {
  const query = String(req.query.q || "").trim();
  const products = query ? findMatches(query, 20).map(x => x.product) : listCatalog();
  res.json({
    ok: true,
    source: "catalog-service",
    updatedAt: new Date().toISOString(),
    count: products.length,
    products
  });
});

app.post("/api/ai", async (req, res) => {
  const message = String(req.body?.message || "").slice(0, 2000);
  const catalogText = listCatalog().slice(0, 10).map(x =>
    [x.name, x.brand, x.category, x.price == null ? "cek admin" : "Rp" + Number(x.price).toLocaleString("id-ID")].join(" | ")
  ).join("\n");

  res.json(await askAI({
    message,
    brandHint: "auto",
    catalogText
  }));
});

app.listen(process.env.WEB_PORT || 8080, () => {
  console.log("NARARYA BUSINESS WEB online");
});
