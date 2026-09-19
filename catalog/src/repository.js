import fs from "node:fs";
import path from "node:path";

const file = path.resolve("catalog/data/products.json");

function read() {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({ updatedAt: null, source: "LOCAL", products: [] }, null, 2));
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function write(db) { fs.writeFileSync(file, JSON.stringify(db, null, 2)); }

export function listCatalog() { return read().products || []; }

export function replaceCatalog(products, source = "LOCAL") {
  const db = read();
  db.updatedAt = new Date().toISOString();
  db.source = source;
  db.products = products;
  write(db);
  return db;
}

export function upsertProduct(product) {
  const db = read();
  const id = String(product.retailerId);
  const index = db.products.findIndex(x => String(x.retailerId) === id);
  if (index >= 0) db.products[index] = { ...db.products[index], ...product };
  else db.products.push(product);
  db.updatedAt = new Date().toISOString();
  write(db);
  return product;
}
