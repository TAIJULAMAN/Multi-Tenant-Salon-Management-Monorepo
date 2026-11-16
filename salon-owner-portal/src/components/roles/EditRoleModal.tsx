"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import { EditRoleModalProps } from "./types";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";

export default function EditRoleModal({
  isOpen,
  onClose,
  role,
  onSubmit,
}: EditRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    date: "",
    createdBy: "",
    creatorRole: "",
    avatarBg: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        email: role.email,
        role: role.role,
        date: role.date,
        createdBy: role.createdBy,
        creatorRole: role.creatorRole,
        avatarBg: role.avatarBg,
        avatarUrl: role.avatarUrl,
      });
    }
  }, [role, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Role Assignment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            label="Full Name"
            required
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            placeholder="Enter full name"
          />
          <CustomInput
            label="Email Address"
            required
            type="email"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: val })}
            placeholder="Enter email address"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Role"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            options={["Owner", "Admin", "Accountant"]}
            placeholder="Select Role"
          />
          <CustomInput
            label="Assigned Date"
            required
            value={formData.date}
            onChange={(val) => setFormData({ ...formData, date: val })}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            label="Created By"
            required
            value={formData.createdBy}
            onChange={(val) => setFormData({ ...formData, createdBy: val })}
            placeholder="Enter creator name"
          />
          <CustomInput
            label="Creator Role"
            required
            value={formData.creatorRole}
            onChange={(val) => setFormData({ ...formData, creatorRole: val })}
            placeholder="Enter creator role"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Avatar Icon URL"
            value={formData.avatarUrl}
            onChange={(val) => setFormData({ ...formData, avatarUrl: val })}
            options={["/avatar/icon1.png", "/avatar/icon2.png"]}
            placeholder="Select Avatar"
          />
          <CustomInput
            label="Avatar Background Class"
            required
            value={formData.avatarBg}
            onChange={(val) => setFormData({ ...formData, avatarBg: val })}
            placeholder="e.g., bg-[#FCE7F3]"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F1F5F9] mt-6">
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton>Save Changes</SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
