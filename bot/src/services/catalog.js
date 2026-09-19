import { findMatches, formatMatches } from "../../../catalog/src/matcher.js";
export function catalogLookup(message) { return findMatches(message, 10); }
export function catalogReply(message) {
  const matches = catalogLookup(message);
  if (!matches.length) return null;
  return "📚 HASIL KATALOG\n" + matches.slice(0,5).map(({product}) => {
    const price = product.price == null ? "cek admin" : "Rp" + Number(product.price).toLocaleString("id-ID");
    return "• " + product.name + " — " + price;
  }).join("\n") + "\n\nData mengikuti katalog terakhir yang tersinkron.";
}
export function catalogContext(message) { return formatMatches(message, 5); }
