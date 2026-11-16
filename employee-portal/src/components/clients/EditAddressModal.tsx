"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";

export interface FullAddressData {
  address: string;
  city: string;
  province: string;
  cap: string;
}

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullAddressData;
  onSave: (updated: FullAddressData) => void;
}

export default function EditAddressModal({
  isOpen,
  onClose,
  data,
  onSave,
}: EditAddressModalProps) {
  const [formData, setFormData] = useState<FullAddressData>(data);

  useEffect(() => {
    if (isOpen) {
      setFormData(data);
    }
  }, [isOpen, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Full Address">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              label="Address *"
              value={formData.address}
              onChange={(val) => setFormData({ ...formData, address: val })}
              placeholder="e.g. Independance Street 54/r"
              required
            />
          </div>
          <CustomInput
            label="City *"
            value={formData.city}
            onChange={(val) => setFormData({ ...formData, city: val })}
            placeholder="e.g. Bologna"
            required
          />
          <CustomInput
            label="Province *"
            value={formData.province}
            onChange={(val) => setFormData({ ...formData, province: val })}
            placeholder="e.g. Bologna (BO)"
            required
          />
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              label="CAP (Postal Code) *"
              value={formData.cap}
              onChange={(val) => setFormData({ ...formData, cap: val })}
              placeholder="e.g. 40129"
              required
            />
          </div>
        </div>
        <div className="pt-3 flex justify-end gap-3 border-t border-[#E2E8F0]">
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton type="submit" className="px-6 shadow-sm shadow-[#635BFF]/20">
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
