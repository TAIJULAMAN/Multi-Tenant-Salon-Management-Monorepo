import React, { useState } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomTextarea from "@/components/customComponent/CustomTextarea";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { AddAllergyModalProps } from "./types";

export default function AddAllergyModal({ isOpen, onClose, selectedClient }: AddAllergyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    severity: "Mild",
    note: "",
  });

  if (!selectedClient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Allergie" maxWidth="max-w-2xl">
      <div className="p-6 space-y-5">
        <CustomInput
          label="Name *"
          value={formData.name}
          onChange={(val) => setFormData({ ...formData, name: val })}
          placeholder="Enter name"
          required
        />

        <CustomSelect
          label="Severity (optional)"
          value={formData.severity}
          onChange={(val) => setFormData({ ...formData, severity: val })}
          options={["Mild", "Moderate", "Severe"]}
        />

        <CustomTextarea
          label="Note"
          value={formData.note}
          onChange={(val) => setFormData({ ...formData, note: val })}
          placeholder="Enter note"
          rows={4}
        />

        <div className="flex justify-end pt-2">
          <SubmitButton onClick={onClose} className="px-6 py-2.5">
            Save Allergie
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
