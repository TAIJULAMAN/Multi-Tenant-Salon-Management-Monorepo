"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import ReceiptIllustration from "../icons/ReceiptIllustration";
import { OnlinePaymentModalProps } from "../types";

interface OnlineFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function OnlinePaymentModal({
  open,
  onClose,
  client,
  onComplete,
}: OnlinePaymentModalProps) {
  const [step, setStep] = useState<"form" | "print">("form");
  const [sendLink, setSendLink] = useState<boolean>(true);
  const clientName = client?.name || "Maria Fernandez";
  const clientAvatar = client?.avatar || "/avatar/icon1.png";
  const nameParts = clientName.split(" ");
  const [form, setForm] = useState<OnlineFormState>({
    firstName: nameParts[0] || "Maria",
    lastName: nameParts.slice(1).join(" ") || "Fernandez",
    email: client?.email || "maria@example.com",
    phone: client?.phone || "+34 634 123 4567",
  });

  useEffect(() => {
    if (client) {
      const parts = (client.name || "").split(" ");
      setForm({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: client.email || "client@example.com",
        phone: client.phone || "+34 634 123 4567",
      });
    }
  }, [client]);

  function handleClose(): void {
    onClose();
    setTimeout(() => setStep("form"), 300);
  }

  function handlePrintAction(): void {
    handleClose();
    onComplete?.();
  }

  function updateField(key: keyof OnlineFormState, value: string): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const fields: { label: string; key: keyof OnlineFormState }[] = [
    { label: "First Name*", key: "firstName" },
    { label: "Last Name*", key: "lastName" },
    { label: "E-mail*", key: "email" },
    { label: "Phone*", key: "phone" },
  ];

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={step === "form" ? "Online Payment" : "Print Receipt"}
      maxWidth="max-w-[460px]"
    >
      {step === "form" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#F4F6FA] rounded-xl">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E2E8F0] shrink-0">
              <img
                src={clientAvatar}
                alt={clientName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#29343D]">{clientName}</p>
              <p className="text-xs text-[#98A4AE]">Client</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[#526B7A]">Send payment link</span>
              <div
                onClick={() => setSendLink((v) => !v)}
                className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                  sendLink ? "bg-[#635BFF]" : "bg-[#E0E6EB]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    sendLink ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-[#526B7A] block mb-1">
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E0E6EB] rounded-lg text-[#29343D] outline-none focus:border-[#635BFF] transition-colors bg-white"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("print")}
            className="w-full py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Send payment Email
          </button>
        </div>
      ) : (
        <div className="p-4 flex flex-col items-center text-center">
          <div className="mb-5">
            <ReceiptIllustration />
          </div>
          <p className="text-base font-bold text-[#29343D] mb-1">Print Receipt</p>
          <p className="text-xs text-[#98A4AE] mb-6">
            Payment link sent. Choose what to print.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handlePrintAction}
              className="flex-1 py-2.5 border border-[#E0E6EB] rounded-lg text-xs font-semibold text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
            >
              Entirely (Including what will be paid later)
            </button>
            <button
              onClick={handlePrintAction}
              className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Print online payment part once received
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
export { OnlinePaymentModal };
