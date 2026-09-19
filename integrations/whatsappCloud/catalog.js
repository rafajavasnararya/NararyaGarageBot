import { graphRequest } from "./client.js";

function mapProduct(row) {
  return {
    retailerId: row.retailer_id || row.id,
    brand: row.brand || "unknown",
    name: row.name || "",
    category: row.category || "catalog",
    price: row.price == null ? null : Number(row.price),
    currency: row.currency || "IDR",
    availability: row.availability || "unknown",
    description: row.description || "",
    imageUrl: row.image_url || null,
    whatsappCatalogId: row.id || null
  };
}

export async function fetchWhatsAppCatalog() {
  const catalogId = process.env.META_CATALOG_ID;
  if (!catalogId) throw new Error("META_CATALOG_ID is not configured");
  const fields = "id,retailer_id,name,description,price,currency,availability,image_url";
  const response = await graphRequest(catalogId + "/products?fields=" + encodeURIComponent(fields) + "&limit=100");
  return Array.isArray(response.data) ? response.data.map(mapProduct) : [];
}

export async function updateWhatsAppProduct(productId, patch) {
  if (process.env.CATALOG_AUTO_APPLY !== "true") {
    return { applied: false, reason: "CATALOG_AUTO_APPLY is disabled", productId, patch };
  }
  return graphRequest(productId, { method: "POST", body: JSON.stringify(patch) });
}
