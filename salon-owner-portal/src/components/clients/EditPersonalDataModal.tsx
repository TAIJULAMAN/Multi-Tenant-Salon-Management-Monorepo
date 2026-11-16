"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";

export interface PersonalData {
  dob: string;
  age: string;
  gender: string;
  telephone: string;
  email: string;
}

interface EditPersonalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalData;
  onSave: (updated: PersonalData) => void;
}

export default function EditPersonalDataModal({
  isOpen,
  onClose,
  data,
  onSave,
}: EditPersonalDataModalProps) {
  const [formData, setFormData] = useState<PersonalData>(data);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Personal Data">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Date of birth *"
            value={formData.dob}
            onChange={(val) => setFormData({ ...formData, dob: val })}
            placeholder="e.g. November 7, 1992"
            required
          />
          <CustomInput
            label="Age *"
            value={formData.age}
            onChange={(val) => setFormData({ ...formData, age: val })}
            placeholder="e.g. 33 years old"
            required
          />
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              label="Gender *"
              value={formData.gender || "Female"}
              options={["Female", "Male", "Other"]}
              onChange={(val) => setFormData({ ...formData, gender: val })}
            />
          </div>
          <CustomInput
            label="Telephone *"
            value={formData.telephone}
            onChange={(val) => setFormData({ ...formData, telephone: val })}
            placeholder="e.g. +39 345 678 9123"
            type="tel"
            required
          />
          <CustomInput
            label="Email *"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
            placeholder="e.g. maria@beautywellness.com"
            type="email"
            required
          />
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
