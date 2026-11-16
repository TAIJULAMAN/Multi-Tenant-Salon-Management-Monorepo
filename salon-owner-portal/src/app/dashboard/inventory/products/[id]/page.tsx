"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit2, Plus, Minus, Box, Barcode, X } from "lucide-react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import EditProductModal from "@/components/saloonOwner/inventory/products/EditProductModal";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";

export default function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [stockAmount, setStockAmount] = useState(10);
  const [minStockAmount, setMinStockAmount] = useState(5);
  const [isAddBarcodeModalOpen, setIsAddBarcodeModalOpen] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [barcodes, setBarcodes] = useState<string[]>(["7891234567895"]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddBarcode = () => {
    const trimmed = newBarcode.trim();
    if (!trimmed) {
      setBarcodeError("Please enter a valid barcode");
      return;
    }
    if (barcodes.includes(trimmed)) {
      setBarcodeError("This barcode is already added");
      return;
    }
    setBarcodes([...barcodes, trimmed]);
    setNewBarcode("");
    setBarcodeError("");
    setIsAddBarcodeModalOpen(false);
  };

  const handleRemoveBarcode = (indexToRemove: number) => {
    if (barcodes.length <= 1) return;
    setBarcodes(barcodes.filter((_, idx) => idx !== indexToRemove));
  };

  const productData = {
    id: unwrappedParams.id,
    name: "Curology Face wash",
    category: "Category 1",
    priority: "Low",
    price: 300
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="px-8 py-4 sticky top-0 z-10 bg-[#F8FAFC]">
        <CustomSubPageHeader
          title="View Products"
          backUrl="/dashboard/inventory/products"
          breadcrumbText="Inventory"
        />
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side: Details */}
          <div className="rounded-lg p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[20px] font-bold text-[#1E293B]">{productData.name}</h3>
              <button onClick={() => setIsEditModalOpen(true)} className="p-2 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-[#635BFF] rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">SKU</p>
                <p className="text-[14px] font-bold text-[#1E293B]">PROD-2025-001</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] font-medium text-[#94A3B8]">Barcodes</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
                      {barcodes.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setBarcodeError("");
                      setNewBarcode("");
                      setIsAddBarcodeModalOpen(true);
                    }} 
                    className="text-[13px] font-bold text-[#635BFF] flex items-center gap-1 hover:text-[#524be0] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {barcodes.map((code, idx) => (
                    <div
                      key={code + idx}
                      className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 transition-all hover:border-[#CBD5E1]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Barcode className="w-4 h-4 text-[#64748B] shrink-0" />
                        <span className="text-[13px] font-bold text-[#1E293B] font-mono truncate">{code}</span>
                        {idx === 0 ? (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-[#E0E7FF] text-[#635BFF] border border-[#635BFF]/20 shrink-0">
                            Primary
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-[#F1F5F9] text-[#64748B] shrink-0">
                            Secondary
                          </span>
                        )}
                      </div>
                      {barcodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBarcode(idx)}
                          className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1 rounded hover:bg-[#FEE2E2] shrink-0 ml-2"
                          title="Remove barcode"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Category</p>
                <p className="text-[14px] font-bold text-[#1E293B]">{productData.category}</p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Brand</p>
                <p className="text-[14px] font-bold text-[#1E293B]">Brand Name</p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Stock Amount</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                    <button onClick={() => setStockAmount(Math.max(0, stockAmount - 1))} className="p-2 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-[14px] font-bold text-[#1E293B]">{stockAmount}</span>
                    <button onClick={() => setStockAmount(stockAmount + 1)} className="p-2 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {productData.priority === "Low" ? (
                    <span className="inline-block bg-[#22C55E] text-white px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
                      Priority: Low
                    </span>
                  ) : productData.priority === "Medium" ? (
                    <span className="inline-block bg-[#F59E0B] text-white px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
                      Priority: Medium
                    </span>
                  ) : (
                    <span className="inline-block bg-[#EF4444] text-white px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
                      Priority: High
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Minimum Stock Amount</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                    <button onClick={() => setMinStockAmount(Math.max(0, minStockAmount - 1))} className="p-2 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-[14px] font-bold text-[#1E293B]">{minStockAmount}</span>
                    <button onClick={() => setMinStockAmount(minStockAmount + 1)} className="p-2 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Mensuare</p>
                <p className="text-[14px] font-bold text-[#1E293B]">Milliliters (ml)</p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Ammount</p>
                <p className="text-[14px] font-bold text-[#1E293B]">100 ml</p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Purchase Price (VAT excluded)</p>
                <p className="text-[14px] font-bold text-[#1E293B]">€ 270</p>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">Sale Price</p>
                <p className="text-[14px] font-bold text-[#1E293B]">€ {productData.price}</p>
              </div>

              <div>
                <p className="text-[12px] font-medium text-[#94A3B8] mb-2">VAT</p>
                <p className="text-[14px] font-bold text-[#1E293B]">€ 30</p>
              </div>
            </div>

            <div className="pt-10">
              <button
                className="px-8 py-3 bg-[#E0E7FF] text-[#635BFF] text-[14px] font-bold rounded-lg transition-colors hover:bg-[#c7d2fe]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Right Side: Photo */}
          <div className="bg-white rounded-lg p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] border border-[#E2E8F0] self-start">
            <h3 className="text-[16px] font-bold text-[#1E293B] mb-8">Product Photo</h3>
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Product" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddBarcodeModalOpen}
        onClose={() => {
          setIsAddBarcodeModalOpen(false);
          setBarcodeError("");
        }}
        title="Add Barcode"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Barcode Number *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 7891234567896"
                value={newBarcode}
                onChange={(e) => {
                  setNewBarcode(e.target.value);
                  if (barcodeError) setBarcodeError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBarcode();
                  }
                }}
                className={`w-full border rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-[#1E293B] font-mono outline-none transition-colors ${
                  barcodeError ? "border-[#EF4444] focus:border-[#EF4444]" : "border-[#E2E8F0] focus:border-[#635BFF]"
                }`}
              />
              <Barcode className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {barcodeError && (
              <p className="text-[11px] text-[#EF4444] mt-1.5 font-medium">{barcodeError}</p>
            )}
            <p className="text-[11px] text-[#94A3B8] mt-1.5">
              Supports standard 12/13-digit EAN, UPC, or custom salon inventory barcodes.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={() => {
                setIsAddBarcodeModalOpen(false);
                setBarcodeError("");
              }}
              className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] text-[13px] font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBarcode}
              className="px-6 py-2 bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/20"
            >
              Save Barcode
            </button>
          </div>
        </div>
      </Modal>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => console.log('Saved data:', data)}
        initialData={productData}
      />
    </div>
  );
}
