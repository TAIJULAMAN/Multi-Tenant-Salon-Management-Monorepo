"use client";

import React from "react";
import Image from "next/image";
import { MousePointerClick } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import { giftCardTemplates } from "./data";

interface GiftCardStepOneProps {
  numCards: string;
  onNumCardsChange: (val: string) => void;
  amount: string;
  onAmountChange: (val: string) => void;
  currency: string;
  onCurrencyChange: (val: string) => void;
  hideAmount: boolean;
  onToggleHideAmount: () => void;
  selectedTemplate: number;
  onSelectTemplate: (id: number) => void;
  onNext: () => void;
}

export default function GiftCardStepOne({
  numCards,
  onNumCardsChange,
  amount,
  onAmountChange,
  currency,
  onCurrencyChange,
  hideAmount,
  onToggleHideAmount,
  selectedTemplate,
  onSelectTemplate,
  onNext,
}: GiftCardStepOneProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-8 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">Basic Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
              How many gift cards do you want to create? *
            </label>
            <input
              type="number"
              value={numCards}
              onChange={(e) => onNumCardsChange(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm transition-colors"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-2">
              <label className="block text-[13px] font-bold text-[#1E293B]">
                Amount *
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={hideAmount}
                  onClick={onToggleHideAmount}
                  className={`relative inline-flex h-[24px] w-[40px] items-center rounded-[6px] transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer ${
                    hideAmount ? "bg-[#635BFF]" : "bg-[#E2E8F0]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block h-[18px] w-[18px] transform rounded-[4px] bg-white shadow-sm transition duration-200 ease-in-out ${
                      hideAmount ? "translate-x-[19px]" : "translate-x-[3px]"
                    }`}
                  />
                </button>
                <span className="text-[14px] text-[#475569] font-medium">
                  Hide amount
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                disabled={hideAmount}
                className={`flex-1 border border-[#E2E8F0] rounded-lg px-4 py-3 text-[14px] focus:outline-none focus:border-[#635BFF] shadow-sm transition-colors ${
                  hideAmount
                    ? "bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"
                    : "text-[#1E293B]"
                }`}
              />
              <CustomSelect
                value={currency}
                onChange={onCurrencyChange}
                options={["€ EUR", "$ USD", "£ GBP"]}
                className="w-[6rem] flex-shrink-0"
                buttonClassName="w-full flex items-center justify-between gap-1 border border-[#E2E8F0] rounded-lg px-3 py-3 text-[14px] font-bold text-[#1E293B] focus:border-[#635BFF] shadow-sm bg-white cursor-pointer h-full"
              />
            </div>
          </div>
        </div>

        <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">Select Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftCardTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === tpl.id
                  ? "border-[#635BFF] shadow-sm"
                  : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              <div className="relative w-full h-40 mb-4">
                <Image
                  src={tpl.image}
                  alt={tpl.name}
                  fill
                  className="rounded-lg drop-shadow-md object-contain"
                />
              </div>
              <h3 className="text-[15px] font-bold text-[#1E293B] mb-2">
                {tpl.name}
              </h3>
              <p className="text-[13px] text-[#94A3B8] font-medium leading-relaxed">
                {tpl.description}
              </p>
            </div>
          ))}

          {/* Custom Upload */}
          <div className="border border-dashed border-[#635BFF] rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-[#F8FAFC] transition-colors cursor-pointer group h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
              <MousePointerClick className="w-8 h-8 text-[#635BFF]" />
            </div>
            <span className="text-[14px] font-bold text-[#635BFF]">
              Upload Custom Gift Card
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="bg-[#635BFF] hover:bg-[#4F46E5] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-sm cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
