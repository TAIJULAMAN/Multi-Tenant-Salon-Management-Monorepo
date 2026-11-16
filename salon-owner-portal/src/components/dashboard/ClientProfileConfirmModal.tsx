"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, User } from "lucide-react";

interface ClientProfileConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    phone?: string;
    photo?: string;
  } | null;
}

export default function ClientProfileConfirmModal({
  isOpen,
  onClose,
  client,
}: ClientProfileConfirmModalProps) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-sm">
          {client.photo ? (
            <Image
              src={client.photo}
              alt={client.name}
              width={56}
              height={56}
              className="object-cover"
            />
          ) : (
            <User size={30} className="text-[#635BFF]" />
          )}
        </div>

        <h3 className="text-[17px] font-bold text-[#1E293B] mb-1 font-manrope">
          {client.name}
        </h3>
        {client.phone && (
          <p className="text-[12px] font-semibold text-[#64748B] mb-5">
            {client.phone}
          </p>
        )}

        <p className="text-[13px] text-[#475569] mb-6">
          Would you like to open this client's profile page?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <Link
            href={`/dashboard/clients/${client.id}`}
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white font-bold text-[13px] rounded-xl shadow-lg shadow-[#635BFF]/20 transition-colors flex items-center justify-center text-center"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
