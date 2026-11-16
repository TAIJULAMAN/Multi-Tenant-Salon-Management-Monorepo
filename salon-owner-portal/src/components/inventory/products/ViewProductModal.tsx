import React, { useState, useEffect } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import { Edit2, Plus, Minus, Barcode, X } from "lucide-react";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData?: any;
}

export default function ViewProductModal({ isOpen, onClose, productData }: ViewProductModalProps) {
  const [stockAmount, setStockAmount] = useState(10);
  const [minStockAmount, setMinStockAmount] = useState(5);
  const [barcodes, setBarcodes] = useState<string[]>(["7891234567895"]);
  const [isAddBarcodeModalOpen, setIsAddBarcodeModalOpen] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [barcodeError, setBarcodeError] = useState("");

  useEffect(() => {
    if (productData) {
      setStockAmount(productData.stockAmount || 0);
      if (productData.barcodes) {
        setBarcodes(Array.isArray(productData.barcodes) ? productData.barcodes : [productData.barcodes]);
      } else if (productData.barcode) {
        setBarcodes([productData.barcode]);
      }
    }
  }, [productData]);

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

  if (!productData) return null;

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} title="View Products" maxWidth="max-w-5xl">
      <div className="-m-6 p-6 bg-[#F8FAFC] rounded-b-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Side: Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[16px] font-bold text-[#1E293B]">{productData.name || "Curology Face wash"}</h3>
              <button className="p-1.5 bg-[#E0E7FF] hover:bg-[#c7d2fe] text-[#635BFF] rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-7 gap-x-4">
              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">SKU</p>
                <p className="text-[13px] font-bold text-[#1E293B]">PROD-2025-001</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-medium text-[#94A3B8]">Barcodes</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#64748B]">
                      {barcodes.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setBarcodeError("");
                      setNewBarcode("");
                      setIsAddBarcodeModalOpen(true);
                    }}
                    className="text-[12px] font-bold text-[#635BFF] flex items-center gap-1 hover:text-[#524be0] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {barcodes.map((code, idx) => (
                    <div
                      key={code + idx}
                      className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2 py-1 text-[12px] hover:border-[#CBD5E1] transition-all"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Barcode className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span className="font-mono font-bold text-[#1E293B] text-[12px] truncate">{code}</span>
                        {idx === 0 ? (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#E0E7FF] text-[#635BFF] shrink-0">
                            Primary
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#F1F5F9] text-[#64748B] shrink-0">
                            Secondary
                          </span>
                        )}
                      </div>
                      {barcodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBarcode(idx)}
                          className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-0.5 rounded hover:bg-[#FEE2E2] shrink-0 ml-1"
                          title="Delete barcode"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Category</p>
                <p className="text-[13px] font-bold text-[#1E293B]">{productData.category || "Category 1"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Brand</p>
                <p className="text-[13px] font-bold text-[#1E293B]">Brand Name</p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Stock Amount</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                    <button onClick={() => setStockAmount(Math.max(0, stockAmount - 1))} className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-[13px] font-bold text-[#1E293B]">{stockAmount}</span>
                    <button onClick={() => setStockAmount(stockAmount + 1)} className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {productData.priority === "Low" ? (
                    <span className="inline-block bg-[#22C55E] text-white px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
                      Priority: Low
                    </span>
                  ) : productData.priority === "Medium" ? (
                    <span className="inline-block bg-[#F59E0B] text-white px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
                      Priority: Medium
                    </span>
                  ) : (
                    <span className="inline-block bg-[#EF4444] text-white px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">
                      Priority: High
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Minimum Stock Amount</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                    <button onClick={() => setMinStockAmount(Math.max(0, minStockAmount - 1))} className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-[13px] font-bold text-[#1E293B]">{minStockAmount}</span>
                    <button onClick={() => setMinStockAmount(minStockAmount + 1)} className="p-1.5 text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Mensuare</p>
                <p className="text-[13px] font-bold text-[#1E293B]">Milliliters (ml)</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Ammount</p>
                <p className="text-[13px] font-bold text-[#1E293B]">100 ml</p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Purchase Price (VAT excluded)</p>
                <p className="text-[13px] font-bold text-[#1E293B]">€ 270</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">Sale Price</p>
                <p className="text-[13px] font-bold text-[#1E293B]">€ {productData.price || 300}</p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-[#94A3B8] mb-1.5">VAT</p>
                <p className="text-[13px] font-bold text-[#1E293B]">€ 30</p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#E0E7FF] text-[#635BFF] text-[13px] font-bold rounded-lg transition-colors hover:bg-[#c7d2fe]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Right Side: Photo */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0]">
            <h3 className="text-[16px] font-bold text-[#1E293B] mb-8">Product Photo</h3>
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Product" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </Modal>

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
    </>
  );
}
