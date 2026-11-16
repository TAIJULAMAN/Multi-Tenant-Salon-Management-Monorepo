import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { AddClientModalProps } from "./types";

export default function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    telephone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Client">
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
        <div className="pt-2 flex justify-end">
          <SubmitButton type="submit" className="px-8">
            Save
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
