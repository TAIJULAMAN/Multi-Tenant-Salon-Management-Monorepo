"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import TerminalIllustration from "../icons/TerminalIllustration";
import { CardTerminalModalProps } from "../types";

type CardState = "waiting" | "processing" | "success";

export default function CardTerminalModal({
  open,
  onClose,
  total,
  onComplete,
}: CardTerminalModalProps) {
  const [state, setState] = useState<CardState>("waiting");

  function simulate(): void {
    setState("processing");
    setTimeout(() => setState("success"), 2200);
  }

  function handleClose(): void {
    setState("waiting");
    onClose();
  }

  function handleDone(): void {
    handleClose();
    onComplete?.();
  }

  return (
    <Modal isOpen={open} onClose={handleClose} title="Card Terminal" maxWidth="max-w-[420px]">
      <div className="p-4 flex flex-col items-center text-center min-h-[260px] justify-center">
        {state === "waiting" && (
          <>
            <div className="mb-5">
              <TerminalIllustration />
            </div>
            <p className="text-base font-bold text-[#29343D] mb-1">
              Waiting for payment processing...
            </p>
            <p className="text-xs text-[#98A4AE] mb-6">
              Please tap, insert, or swipe card on the terminal.
            </p>
            <button
              onClick={simulate}
              className="w-full py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Simulate Card Tap
            </button>
          </>
        )}
        {state === "processing" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#DDDBFF] flex items-center justify-center mb-5">
              <Loader2 size={28} color="#635BFF" className="animate-spin" />
            </div>
            <p className="text-base font-bold text-[#29343D] mb-1">
              Processing Payment...
            </p>
            <p className="text-xs text-[#98A4AE]">
              Please do not remove your card.
            </p>
          </>
        )}
        {state === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#DDDBFF] flex items-center justify-center mb-5">
              <Check size={28} color="#635BFF" strokeWidth={2.5} />
            </div>
            <p className="text-base font-bold text-[#29343D] mb-1">
              Payment Successful!
            </p>
            <p className="text-xs text-[#98A4AE] mb-6">
              € {total.toFixed ? total.toFixed(2) : total} charged successfully.
            </p>
            <button
              onClick={handleDone}
              className="w-full py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Done
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
export { CardTerminalModal };
