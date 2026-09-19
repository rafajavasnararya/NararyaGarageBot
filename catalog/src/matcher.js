import { listCatalog } from "./repository.js";
const norm = value => String(value || "").toLowerCase().normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "");
function score(query, product) {
  const q = norm(query);
  const text = norm([product.name, product.brand, product.category, product.description, product.retailerId].join(" "));
  if (!q) return 0;
  const words = q.split(/\\s+/).filter(Boolean);
  return words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0) / words.length;
}
export function findMatches(query, limit = 5) {
  return listCatalog().map(product => ({ product, score: score(query, product) })).filter(row => row.score > 0).sort((a,b)=>b.score-a.score).slice(0,limit);
}
export function formatMatches(query, limit = 5) {
  const rows = findMatches(query, limit);
  if (!rows.length) return "Katalog: produk belum ditemukan.";
  return rows.map(({product}) => {
    const price = product.price == null ? "cek katalog/admin" : "Rp" + Number(product.price).toLocaleString("id-ID");
    return "• " + product.name + " | " + price + " | " + product.availability;
  }).join("\n");
}
