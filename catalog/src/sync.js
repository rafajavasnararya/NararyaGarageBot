import { fetchWhatsAppCatalog } from "../../integrations/whatsappCloud/catalog.js";
import { replaceCatalog } from "./repository.js";
export async function syncRemoteCatalog() {
  const products = await fetchWhatsAppCatalog();
  return replaceCatalog(products, "WHATSAPP_CLOUD_API");
}
export function syncEnabled() {
  return process.env.CATALOG_AUTO_SYNC !== "false" && Boolean(process.env.META_ACCESS_TOKEN && process.env.META_CATALOG_ID);
}
