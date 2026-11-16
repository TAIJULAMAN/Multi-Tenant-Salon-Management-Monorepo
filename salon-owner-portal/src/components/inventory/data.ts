import { InventoryProduct, InventoryCategory, StockMovement, CategoryProductItem, ImportedProductItem } from "./types";

export const MOCK_PRODUCTS: InventoryProduct[] = [
  { id: "1", name: "Curology Face wash", category: "Category 1", stockAmount: 10, priority: "Low", status: "In Stock", price: 270 },
  { id: "2", name: "Body Lotion", category: "Category 2", stockAmount: 0, priority: "High", status: "Out of Stock", price: 270 },
  { id: "3", name: "Curology Face wash", category: "Category 3", stockAmount: 1, priority: "Medium", status: "In Stock", price: 270 },
  { id: "4", name: "Curology Face wash", category: "Category 3", stockAmount: 4, priority: "Medium", status: "In Stock", price: 270 },
  { id: "5", name: "Curology Face wash", category: "Category 4", stockAmount: 0, priority: "Medium", status: "Out of Stock", price: 270 },
  { id: "6", name: "Curology Face wash", category: "Category 3", stockAmount: 6, priority: "Medium", status: "In Stock", price: 270 },
  { id: "7", name: "Curology Face wash", category: "Category 3", stockAmount: 7, priority: "High", status: "In Stock", price: 270 },
  { id: "8", name: "Body Lotion", category: "Category 2", stockAmount: 2, priority: "High", status: "In Stock", price: 270 },
  { id: "9", name: "Curology Face wash", category: "Category 1", stockAmount: 1, priority: "High", status: "In Stock", price: 270 },
];

export const MOCK_CATEGORIES: InventoryCategory[] = [
  { id: "1", name: "Category 1", relatedProducts: 1 },
  { id: "2", name: "Category 2", relatedProducts: 1 },
  { id: "3", name: "Category 3", relatedProducts: 1 },
  { id: "4", name: "Category 4", relatedProducts: 1 },
  { id: "5", name: "Category 5", relatedProducts: 1 },
  { id: "6", name: "Category 6", relatedProducts: 1 },
];

export const MOCK_STOCKS: StockMovement[] = [
  { id: "1", date: "02/01/2025 12:00", type: "Out", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 10, status: "In Stock", price: 270 },
  { id: "2", date: "02/01/2025 12:00", type: "In", sku: "PROD-2025-001", productName: "Body Lotion", quantity: 1, status: "Out of Stock", price: 270 },
  { id: "3", date: "02/01/2025 12:00", type: "In", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 1, status: "In Stock", price: 270 },
  { id: "4", date: "02/01/2025 12:00", type: "In", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 4, status: "In Stock", price: 270 },
  { id: "5", date: "02/01/2025 12:00", type: "In", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 0, status: "Out of Stock", price: 270 },
  { id: "6", date: "02/01/2025 12:00", type: "Out", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 6, status: "In Stock", price: 270 },
  { id: "7", date: "02/01/2025 12:00", type: "Out", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 7, status: "In Stock", price: 270 },
  { id: "8", date: "02/01/2025 12:00", type: "Out", sku: "PROD-2025-001", productName: "Body Lotion", quantity: 2, status: "In Stock", price: 270 },
  { id: "9", date: "02/01/2025 12:00", type: "Out", sku: "PROD-2025-001", productName: "Curology Face wash", quantity: 1, status: "In Stock", price: 270 },
];

export const MOCK_CATEGORY_PRODUCTS: CategoryProductItem[] = [
  { id: 1, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "Product", status: "Out of Stock", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=1000&auto=format&fit=crop" },
  { id: 4, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" },
  { id: 5, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop" },
  { id: 6, name: "Product", status: "Out of Stock", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" },
  { id: 7, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=1000&auto=format&fit=crop" },
  { id: 8, name: "Product", status: "In Stock", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop" },
];

export const MOCK_IMPORTED_PRODUCTS: ImportedProductItem[] = [
  { sku: "PROD-2025-001", name: "Curology Face wash", brand: "Curology", barcode: "7891234567895", purchase: 270, sale: 270, vat: 70 },
  { sku: "PROD-2025-001", name: "Curology Face wash", brand: "Curology", barcode: "7891234567895", purchase: 270, sale: 270, vat: 70 },
  { sku: "PROD-2025-001", name: "Curology Face wash", brand: "Curology", barcode: "7891234567895", purchase: 270, sale: 270, vat: 70 },
  { sku: "PROD-2025-001", name: "Curology Face wash", brand: "Curology", barcode: "7891234567895", purchase: 270, sale: 270, vat: 70 },
  { sku: "PROD-2025-001", name: "Curology Face wash", brand: "Curology", barcode: "7891234567895", purchase: 270, sale: 270, vat: 70 },
];


