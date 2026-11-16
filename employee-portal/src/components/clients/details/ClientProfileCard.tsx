"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Hash, FileText, Wallet } from "lucide-react";

interface ClientProfileCardProps {
  client: {
    name: string;
    avatarUrl: string;
    avatarBg?: string;
    [key: string]: any;
  };
  activeTab: string;
  onTabChange: (tabName: string) => void;
  onBookNow?: () => void;
}

export const CLIENT_DETAILS_TABS = [
  { name: "Basic Data", icon: <FileText className="w-4 h-4 shrink-0" /> },
  { name: "Appointments", icon: <Calendar className="w-4 h-4 shrink-0" /> },
  { name: "Financial Information", icon: <Wallet className="w-4 h-4 shrink-0" /> },
  { name: "Notes & Attachments", icon: <span className="text-[13px] font-bold">📝</span> },
  { name: "Medical", icon: <span className="text-[13px] font-bold">🩺</span> },
  { name: "Communication Log", icon: <span className="text-[13px] font-bold">💬</span> },
];

export default function ClientProfileCard({
  client,
  activeTab,
  onTabChange,
  onBookNow,
}: ClientProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Banner Section */}
      <div className="w-full h-48 sm:h-56 relative bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-multiply"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#a5b4fc"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,186.7C384,160,480,96,576,90.7C672,85,768,139,864,165.3C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#818cf8"
            fillOpacity="1"
            d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,250.7C672,277,768,267,864,240C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="p-8 relative flex flex-col md:flex-row items-center justify-between gap-8 pt-20 md:pt-8">
        {/* Center Avatar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm ${
              client.avatarBg || "bg-[#EEF2FF]"
            }`}
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              <Image
                src={client.avatarUrl || "/avatar/icon1.png"}
                alt={client.name}
                fill
                className="object-cover mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Left Stats */}
        <div className="flex gap-8 w-full md:w-1/3 justify-center md:justify-start">
          <div className="flex flex-col items-center justify-center space-y-1">
            <Calendar className="w-5 h-5 text-[#64748B] mb-1" />
            <span className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
              Aug 8, 2024
            </span>
            <span className="text-[12px] font-medium text-[#94A3B8]">Created At</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <Hash className="w-5 h-5 text-[#64748B] mb-1" />
            <span className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
              000000
            </span>
            <span className="text-[12px] font-medium text-[#94A3B8]">Client ID</span>
          </div>
        </div>

        {/* Center Info Details */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 mt-4 md:mt-12">
          <h2 className="text-[1.15rem] font-bold text-[#1E293B] font-manrope leading-tight">
            {client.name}
          </h2>
          <p className="text-[13px] font-medium text-[#94A3B8] mt-1 mb-3">
            Bologna, Italy
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-[#14B8A6] text-white text-[10px] font-bold px-3 py-1 rounded-lg whitespace-nowrap">
              VIP
            </span>
            <span className="border border-[#10B981] text-[#10B981] text-[10px] font-bold px-3 py-1 rounded-lg whitespace-nowrap">
              New Client
            </span>
            <span className="border border-[#F43F5E] text-[#F43F5E] text-[10px] font-bold px-3 py-1 rounded-lg whitespace-nowrap">
              Frequent Canceler
            </span>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="flex justify-center md:justify-end w-full md:w-1/3 mt-4 md:mt-0 md:pt-12">
          <button
            type="button"
            onClick={onBookNow}
            className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm shadow-[#635BFF]/20 cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full bg-[#EEF2FF] flex items-center justify-start md:justify-center px-4 overflow-x-auto border-t border-[#E2E8F0]">
        {CLIENT_DETAILS_TABS.map((tab) => (
          <button
            key={tab.name}
            type="button"
            onClick={() => onTabChange(tab.name)}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.name
                ? "border-[#635BFF] text-[#635BFF]"
                : "border-transparent text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}
