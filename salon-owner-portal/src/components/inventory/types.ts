export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  stockAmount: number;
  priority: "Low" | "Medium" | "High";
  status: "In Stock" | "Out of Stock";
  price: number;
}

export interface InventoryCategory {
  id: string;
  name: string;
  relatedProducts: number;
}

export interface StockMovement {
  id: string;
  date: string;
  type: "In" | "Out";
  sku: string;
  productName: string;
  quantity: number;
  status: "In Stock" | "Out of Stock";
  price: number;
}

export interface ProductFormData {
  name: string;
  sku: string;
  barcodes: string;
  category: string;
  brand: string;
  stockAmount: string;
  minStockAmount: string;
  measure: string;
  amount: string;
  purchasePrice: string;
  salePrice: string;
  onSale: boolean;
  vat: string;
}

export interface CategoryProductItem {
  id: number;
  name: string;
  status: "In Stock" | "Out of Stock";
  image: string;
}

export interface ImportedProductItem {
  sku: string;
  name: string;
  brand: string;
  barcode: string;
  purchase: number;
  sale: number;
  vat: number;
}

