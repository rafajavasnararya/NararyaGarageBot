export type CatalogAvailability = "in_stock" | "out_of_stock" | "preorder" | "unknown";

export interface CatalogProduct {
  retailerId: string;
  brand: "studio" | "garage" | "store" | "hilekros";
  name: string;
  category: string;
  price: number | null;
  currency: "IDR";
  availability: CatalogAvailability;
  description: string;
  imageUrl?: string | null;
  whatsappCatalogId?: string | null;
}

export interface CatalogSyncResult {
  source: string;
  updatedAt: string;
  count: number;
  autoApply: boolean;
}
