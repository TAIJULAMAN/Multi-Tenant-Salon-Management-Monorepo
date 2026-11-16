"use client";

import React, { useState } from "react";
import { X, ChevronRight, Scissors } from "lucide-react";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { SearchServiceModalProps } from "./types";
import { services as servicesData } from "./data";

export default function SearchServiceModal({ isOpen, onClose, onSelectService }: SearchServiceModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredServices = servicesData.filter((service) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      service.name.toLowerCase().includes(query) ||
      service.estimatedPrice.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-2xl p-4 relative animate-in fade-in zoom-in duration-200 mx-4 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-[#1E293B]">Search a Service</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <CustomSearch
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            placeholder="Search"
          />
        </div>

        <h3 className="text-[12px] font-bold text-[#1E293B] mb-4">
          {searchTerm ? "Search Results" : "Recent research"}
        </h3>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6 custom-scrollbar max-h-[300px]">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  onSelectService(service);
                  onClose();
                }}
                className="border border-[#E2E8F0] hover:border-[#635BFF] rounded-[16px] p-4 flex items-center justify-between cursor-pointer transition-colors bg-white group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center group-hover:bg-[#EEF2FF] transition-colors">
                    <Scissors className="w-5 h-5 text-[#A5B4FC] group-hover:text-[#635BFF] transition-colors transform -rotate-45" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1E293B] mb-0.5">{service.name}</div>
                    <div className="text-[12px] text-[#94A3B8] font-medium">{service.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-[#94A3B8] font-medium uppercase">Estimated</div>
                    <div className="text-[14px] font-bold text-[#635BFF]">{service.estimatedPrice}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#635BFF] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-[#94A3B8]">
              No services found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm shadow-[#635BFF]/20">
            Add Service
          </button>
        </div>

      </div>
    </div>
  );
}
