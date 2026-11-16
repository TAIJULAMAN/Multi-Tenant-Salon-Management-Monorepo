"use client";

import React from "react";
import Image from "next/image";
import { Ban, ChevronDown, Settings } from "lucide-react";
import LogoIcon from "@/components/svg/LogoIcon";
import { giftCardLogoOptions } from "./data";
import { GiftCardLogoOption } from "./types";

interface GiftCardStepTwoProps {
  selectedLogo: number;
  onSelectLogo: (id: number) => void;
  onBack: () => void;
  onSave: () => void;
}

export default function GiftCardStepTwo({
  selectedLogo,
  onSelectLogo,
  onBack,
  onSave,
}: GiftCardStepTwoProps) {
  const renderLogoIcon = (logo: GiftCardLogoOption) => {
    switch (logo.type) {
      case "none":
        return <Ban className="w-6 h-6 mb-2 text-[#635BFF]" />;
      case "main":
        return (
          <div className="w-6 h-6 mb-2 bg-[#635BFF] rounded-lg text-white flex items-center justify-center font-bold text-[10px]">
            M
          </div>
        );
      case "alt":
        return (
          <div className="w-6 h-6 mb-2 bg-[#1E293B] rounded-lg text-white flex items-center justify-center font-bold text-[10px]">
            A
          </div>
        );
      case "minimal":
        return (
          <div className="w-6 h-6 mb-2 bg-[#635BFF] rounded-full text-white flex items-center justify-center font-bold text-[10px]">
            M
          </div>
        );
      default:
        return <LogoIcon />;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Branding Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-8">
        <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">Logo and Branding</h2>

        <label className="block text-[13px] font-bold text-[#1E293B] mb-4">
          Choose Logo
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {giftCardLogoOptions.map((logo) => (
            <div
              key={logo.id}
              onClick={() => onSelectLogo(logo.id)}
              className={`border rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-24 ${
                selectedLogo === logo.id
                  ? "border-[#635BFF] bg-[#F8F6FF]"
                  : "border-[#F1F5F9] bg-[#F8FAFC] hover:border-[#CBD5E1]"
              }`}
            >
              {renderLogoIcon(logo)}
              <span
                className={`text-[12px] font-bold ${
                  selectedLogo === logo.id ? "text-[#635BFF]" : "text-[#64748B]"
                }`}
              >
                {logo.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="block text-[13px] font-bold text-[#1E293B]">
            Template Colors
          </label>
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg text-[12px] font-bold transition-colors w-full sm:w-auto cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Customize Logo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Details */}
        <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-8">
          <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">
            Gift Card Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Salon Name *
              </label>
              <input
                type="text"
                placeholder="Enter salon name"
                defaultValue="CEU HAREM ACCONCIATURE"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Website *
              </label>
              <input
                type="text"
                placeholder="Enter website"
                defaultValue="www.degradepartenassafra.it"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
              Address *
            </label>
            <input
              type="text"
              placeholder="Enter address"
              defaultValue="Via Rodipuglia 44/A - MASSAFRA (TA)"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Date of Issue *
              </label>
              <input
                type="text"
                placeholder="Enter date"
                defaultValue="02/09/2025"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Date of Expiration *
              </label>
              <input
                type="text"
                placeholder="Enter date"
                defaultValue="02/20/2025"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Usage Limit *
              </label>
              <input
                type="text"
                placeholder="Enter limit"
                defaultValue="1"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Eligible Services *
              </label>
              <div className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer bg-[#F8FAFC]">
                <span className="text-[14px] text-[#1E293B]">All Services</span>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Receiver Name *
              </label>
              <input
                type="text"
                placeholder="Enter receiver name"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
                Gifter Name (optional)
              </label>
              <input
                type="text"
                placeholder="Enter gifter name"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1E293B] mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Enter a description"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#635BFF] shadow-sm resize-none"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <button
              type="button"
              onClick={onBack}
              className="text-[#64748B] hover:text-[#1E293B] font-bold text-[14px] transition-colors w-full sm:w-auto py-2.5 sm:py-0 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSave}
              className="bg-[#635BFF] hover:bg-[#4F46E5] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-sm w-full sm:w-auto cursor-pointer"
            >
              Save & Create
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-6 sticky top-6">
          <h2 className="text-[14px] font-bold text-[#1E293B] mb-6">Live Preview</h2>
          <div className="space-y-6">
            <div className="relative w-full h-56">
              <Image
                src="/images/gift-card-blue-empty.png"
                alt="Gift Card Preview Front"
                fill
                className="rounded-lg shadow-lg object-contain"
              />
            </div>
            <div className="relative w-full h-56">
              <Image
                src="/boucher/giftCard.png"
                alt="Gift Card Preview Back"
                fill
                className="rounded-lg shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
