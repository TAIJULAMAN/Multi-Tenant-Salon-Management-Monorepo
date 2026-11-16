import React, { useState, useEffect } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import CustomFileUpload from "@/components/customComponent/CustomFileUpload";
import { ImagePlus, ChevronDown } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function EditProductModal({ isOpen, onClose, onSave, initialData }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcodes: "",
    category: "",
    brand: "",
    stockAmount: "",
    minStockAmount: "",
    measure: "Milliliters (ml)",
    amount: "",
    purchasePrice: "",
    salePrice: "",
    onSale: true,
    vat: "",
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || "",
        sku: initialData.sku || "PROD-2025-001",
        barcodes: initialData.barcodes || "7891234567895",
        category: initialData.category || "",
        brand: initialData.brand || "Brand Name",
        stockAmount: initialData.stockAmount !== undefined ? String(initialData.stockAmount) : "10",
        minStockAmount: initialData.minStockAmount !== undefined ? String(initialData.minStockAmount) : "5",
        measure: initialData.measure || "Milliliters (ml)",
        amount: initialData.amount || "100 ml",
        purchasePrice: initialData.purchasePrice !== undefined ? String(initialData.purchasePrice) : "270",
        salePrice: initialData.price !== undefined ? String(initialData.price) : "300",
        onSale: initialData.onSale !== undefined ? initialData.onSale : true,
        vat: initialData.vat !== undefined ? String(initialData.vat) : "30",
      });
      if (initialData.photo) {
        setPhotoPreview(initialData.photo);
      }
    }
  }, [isOpen, initialData]);

  const handlePhotoSelect = (file: File) => {
    setSelectedPhoto(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  };

  const handleSubmit = () => {
    onSave({
      ...initialData,
      name: formData.name || "Edited Product",
      category: formData.category || "Uncategorized",
      stockAmount: parseInt(formData.stockAmount) || 0,
      price: parseFloat(formData.salePrice) || 0,
      photo: photoPreview || undefined,
      photoFile: selectedPhoto || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" maxWidth="max-w-2xl">
      <div className="space-y-5 pt-2">
        {/* Product Name */}
        <div>
          <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Product Name *</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
          />
        </div>

        {/* SKU & Barcodes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">SKU *</label>
            <input
              type="text"
              placeholder="Enter SKU"
              value={formData.sku}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Barcodes *</label>
            <input
              type="text"
              placeholder="Enter barcodes"
              value={formData.barcodes}
              onChange={e => setFormData({ ...formData, barcodes: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Category *</label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-[#E2E8F0] rounded-lg pl-4 pr-10 py-3 text-[13px] text-[#94A3B8] outline-none focus:border-[#635BFF] transition-colors bg-white appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Category 1">Category 1</option>
                <option value="Category 2">Category 2</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Brand</label>
            <input
              type="text"
              placeholder="Enter brand"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Stock Amount & Min Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Stock Amount *</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.stockAmount}
              onChange={e => setFormData({ ...formData, stockAmount: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Minimum Stock Amount *</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.minStockAmount}
              onChange={e => setFormData({ ...formData, minStockAmount: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Mensuare & Ammount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Mensuare *</label>
            <div className="relative">
              <select
                value={formData.measure}
                onChange={e => setFormData({ ...formData, measure: e.target.value })}
                className="w-full border border-[#E2E8F0] rounded-lg pl-4 pr-10 py-3 text-[13px] text-[#94A3B8] outline-none focus:border-[#635BFF] transition-colors bg-white appearance-none cursor-pointer"
              >
                <option value="Milliliters (ml)">Milliliters (ml)</option>
                <option value="Grams (g)">Grams (g)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Ammount *</label>
            <input
              type="text"
              placeholder="00 ml"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Purchase & Sale Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">Purchase Price (VAT excluded) *</label>
            <input
              type="number"
              placeholder="Enter price"
              value={formData.purchasePrice}
              onChange={e => setFormData({ ...formData, purchasePrice: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-bold text-[#1E293B]">Sale Price *</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.onSale}
                  onChange={e => setFormData({ ...formData, onSale: e.target.checked })}
                  className="accent-[#635BFF] w-4 h-4 rounded border-[#E2E8F0]"
                />
                <span className="text-[13px] text-[#64748B]">On Sale</span>
              </label>
            </div>
            <input
              type="number"
              placeholder="Enter sale price"
              value={formData.salePrice}
              onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* VAT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">VAT *</label>
            <input
              type="number"
              placeholder="Enter VAT"
              value={formData.vat}
              onChange={e => setFormData({ ...formData, vat: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <CustomFileUpload
          label="Product Photo *"
          accept="image/*"
          icon={<ImagePlus className="w-6 h-6 text-[#635BFF]" />}
          onFileSelect={handlePhotoSelect}
          selectedFile={selectedPhoto}
          previewUrl={photoPreview}
          onRemoveFile={handleRemovePhoto}
          hintText="Supports PNG, JPG, or WEBP up to 10MB"
        />

        {/* Save Button */}
        <div className="flex justify-end pt-4 pb-2">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
