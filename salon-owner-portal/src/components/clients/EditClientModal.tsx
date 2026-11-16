import React, { useState, useEffect } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";
import { EditClientModalProps } from "./types";

export default function EditClientModal({ isOpen, onClose, selectedClient }: EditClientModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    telephone: "",
    email: "",
  });

  useEffect(() => {
    if (selectedClient && isOpen) {
      const names = selectedClient.name?.split(" ") || ["", ""];
      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        dateOfBirth: "November 7, 1992",
        gender: "Female",
        telephone: selectedClient.telephone || "",
        email: selectedClient.email || "",
      });
    }
  }, [selectedClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  if (!selectedClient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Client">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="First Name *"
            value={formData.firstName}
            onChange={(val) => setFormData({ ...formData, firstName: val })}
            placeholder="Enter first name"
            required
          />
          <CustomInput
            label="Last Name *"
            value={formData.lastName}
            onChange={(val) => setFormData({ ...formData, lastName: val })}
            placeholder="Enter last name *"
            required
          />
          <CustomInput
            label="Date of birth"
            value={formData.dateOfBirth}
            onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
            placeholder="Enter date of birth"
          />
          <CustomSelect
            label="Gender"
            value={formData.gender || "Select gender"}
            options={["Male", "Female", "Other"]}
            onChange={(val) => setFormData({ ...formData, gender: val })}
          />
          <CustomInput
            label="Telephone *"
            value={formData.telephone}
            onChange={(val) => setFormData({ ...formData, telephone: val })}
            placeholder="Enter telephone"
            type="tel"
            required
          />
          <CustomInput
            label="E-mail"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
            placeholder="Enter email"
            type="email"
          />
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton type="submit" className="px-8 shadow-sm shadow-[#635BFF]/20">
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
