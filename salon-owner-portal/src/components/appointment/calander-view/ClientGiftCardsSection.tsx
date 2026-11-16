"use client";

import React from "react";
import { ChevronDown, ChevronUp, Ticket } from "lucide-react";
import { ModalClient } from "@/components/appointment/types";

interface ClientGiftCardsSectionProps {
  selectedClient: ModalClient;
  showGiftDetails: boolean;
  setShowGiftDetails: (show: boolean) => void;
}

export default function ClientGiftCardsSection({
  selectedClient,
  showGiftDetails,
  setShowGiftDetails,
}: ClientGiftCardsSectionProps) {
  if (selectedClient.giftCards <= 0) return null;

  return (
    <div>
      <button
        onClick={() => setShowGiftDetails(!showGiftDetails)}
        className="w-full px-4 py-3 flex items-center justify-between text-[14px] font-bold text-[#29343D] hover:bg-slate-50"
      >
        <span>Active gift cards</span>
        {showGiftDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showGiftDetails && selectedClient.giftCardDetails && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1">
          <div className="bg-white border border-slate-200 p-4 rounded-[4px] shadow-sm cursor-default">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-[4px] border border-slate-100">
                  <Ticket size={16} className="text-[#999]" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#29343D]">
                    {selectedClient.giftCardDetails.amount}
                  </p>
                  <p className="text-[12px] text-[#999]">
                    Expires {selectedClient.giftCardDetails.dateOfExpiration}
                  </p>
                </div>
              </div>
              <span className="text-[12px] text-[#999]">
                {selectedClient.giftCardDetails.eligibleServices.join("•")}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[11px] text-[#999] font-bold uppercase mb-1">
                  Date of Issue
                </p>
                <p className="text-[14px] font-bold text-[#29343D]">
                  {selectedClient.giftCardDetails.dateOfIssue}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#999] font-bold uppercase mb-1">
                  Date of Expiration
                </p>
                <p className="text-[14px] font-bold text-[#29343D]">
                  {selectedClient.giftCardDetails.dateOfExpiration}
                </p>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <p className="text-[11px] text-[#999] font-bold uppercase mb-1">
                  Amount
                </p>
                <p className="text-[16px] font-bold text-[#29343D]">
                  {selectedClient.giftCardDetails.amount}
                </p>
              </div>
              <div className="border-t border-slate-50 pt-4">
                <p className="text-[11px] text-[#999] font-bold uppercase mb-1">
                  Usage Limit
                </p>
                <p className="text-[16px] font-bold text-[#29343D]">
                  {selectedClient.giftCardDetails.usageLimit}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-[#999] font-bold uppercase mb-2">
                  Eligible Services
                </p>
                <div className="flex gap-2">
                  {selectedClient.giftCardDetails.eligibleServices.map((s) => (
                    <span
                      key={s}
                      className="bg-[#635BFF]/10 text-[#635BFF] px-3 py-1 rounded-full text-[12px] font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-slate-50">
                <p className="text-[11px] text-[#999] font-bold uppercase mb-2">
                  Personal Message
                </p>
                <div className="bg-slate-50 p-3 rounded-[4px] italic text-[13px] text-[#29343D]">
                  {selectedClient.giftCardDetails.personalMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

