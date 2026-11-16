"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, PackagePlus, Layers } from "lucide-react";
import Pagination from "@/components/customComponent/Pagination";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import AddProductModal from "@/components/inventory/products/AddProductModal";
import SelectExistingProductModal from "@/components/inventory/categories/SelectExistingProductModal";
import { MOCK_CATEGORY_PRODUCTS } from "@/components/inventory/data";
import { CategoryProductItem } from "@/components/inventory/types";

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isExistingProductModalOpen, setIsExistingProductModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [productsList, setProductsList] = useState<CategoryProductItem[]>(MOCK_CATEGORY_PRODUCTS);

  const totalItems = productsList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = productsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddExisting = (selectedIds: string[]) => {
    const newItems: CategoryProductItem[] = selectedIds.map((id, index) => ({
      id: Date.now() + index,
      name: `Added Product ${id}`,
      status: "In Stock" as const,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
    }));
    setProductsList((prev) => [...newItems, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <div className="px-8 py-4">
        <CustomSubPageHeader
          title="View Category"
          backUrl="/dashboard/inventory/categories"
          breadcrumbText="Inventory"
        />
      </div>

      <div className="py-5">
        <div>
          <div className="bg-white rounded-lg p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-[18px] font-bold text-[#1E293B] font-manrope">
                Category {unwrappedParams.id}
              </h1>

              {/* Add Product Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#635BFF] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-20 py-1.5 animate-in fade-in-50 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsAddProductModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#1E293B] hover:bg-[#EEF2FF] hover:text-[#635BFF] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <PackagePlus className="w-4 h-4 text-[#635BFF]" />
                      <span>New Product</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsExistingProductModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#1E293B] hover:bg-[#EEF2FF] hover:text-[#635BFF] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#635BFF]" />
                      <span>Existing Product</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-[#E2E8F0] rounded-lg p-4 flex flex-col hover:border-[#635BFF]/30 transition-colors bg-white shadow-sm hover:shadow-md group cursor-pointer"
                >
                  <div className="w-full aspect-square bg-[#F8FAFC] rounded-lg overflow-hidden mb-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-1">
                    <p className="text-[14px] font-bold text-[#1E293B] mb-2">
                      {product.name}
                    </p>
                    {product.status === "In Stock" ? (
                      <span className="inline-flex items-center bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {product.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-[#FCE7F3] text-[#F43F5E] px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {product.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalItems > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                itemsName="products"
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSave={(data) => {
          setProductsList((prev) => [
            {
              id: Date.now(),
              name: data.name || "New Product",
              status: "In Stock" as const,
              image:
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
            },
            ...prev,
          ]);
          setIsAddProductModalOpen(false);
        }}
      />

      <SelectExistingProductModal
        isOpen={isExistingProductModalOpen}
        onClose={() => setIsExistingProductModalOpen(false)}
        categoryName={`Category ${unwrappedParams.id}`}
        onSelect={handleAddExisting}
      />
    </div>
  );
}
