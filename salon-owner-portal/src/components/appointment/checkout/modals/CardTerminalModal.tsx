"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import { TerminalIllustration } from "../components/CheckoutIcons";

type CardState = "waiting" | "processing" | "success";

interface CardTerminalModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CardTerminalModal({
  open,
  onClose,
  onComplete,
}: CardTerminalModalProps) {
  const [state, setState] = useState<CardState>("waiting");

  function simulate(): void {
    setState("processing");
    setTimeout(() => {
      setState("success");
    }, 2000);
  }

  function handleClose(): void {
    setState("waiting");
    onClose();
  }

  function handleDone(): void {
    setState("waiting");
    onComplete();
  }

  return (
    <Modal isOpen={open} onClose={handleClose} maxWidth="max-w-[420px]">
      <div className="flex flex-col items-center text-center p-2">
        <TerminalIllustration />

        {state === "waiting" && (
          <>
            <h3 className="text-[17px] font-bold text-[#1E293B] mt-5 mb-1.5">
              Card Terminal
            </h3>
            <p className="text-[13px] text-[#64748B] mb-6">
              Please insert, swipe, or tap the card on the POS terminal.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={simulate}
                className="flex-1 py-2.5 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5248e5] transition-colors"
              >
                Simulate Payment
              </button>
            </div>
          </>
        )}

        {state === "processing" && (
          <>
            <h3 className="text-[17px] font-bold text-[#1E293B] mt-5 mb-1.5">
              Processing...
            </h3>
            <p className="text-[13px] text-[#64748B] mb-6">
              Waiting for terminal confirmation. Do not remove card.
            </p>
            <div className="flex items-center gap-2 text-[#635BFF] font-semibold text-[14px] py-4">
              <Loader2 size={20} className="animate-spin" /> Authorizing
              transaction...
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#22C55E] mt-4 mb-2">
              <Check size={24} />
            </div>
            <h3 className="text-[17px] font-bold text-[#1E293B] mb-1.5">
              Transaction Approved!
            </h3>
            <p className="text-[13px] text-[#64748B] mb-6">
              Payment was successfully processed.
            </p>
            <button
              onClick={handleDone}
              className="w-full py-2.5 rounded-lg bg-[#22C55E] text-white text-[13px] font-semibold hover:bg-[#16a34a] transition-colors"
            >
              Continue to Receipt
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
