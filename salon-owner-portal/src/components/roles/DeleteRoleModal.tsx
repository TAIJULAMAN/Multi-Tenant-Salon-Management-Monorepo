"use client";

import React from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import { DeleteRoleModalProps } from "./types";

export default function DeleteRoleModal({
  isOpen,
  onClose,
  role,
  onConfirm,
}: DeleteRoleModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Role">
      {role && (
        <div className="space-y-4 text-center pb-2">
          <h3 className="text-xl font-bold text-[#1E293B] font-manrope">Are you absolutely sure?</h3>
          <p className="text-[13px] text-[#64748B] px-2 font-medium leading-relaxed">
            This action cannot be undone. This will permanently delete the role assignment for <span className="font-bold text-[#1E293B]">{role.name}</span> from the system.
          </p>
          <div className="pt-6 flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-[#64748B] hover:text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
