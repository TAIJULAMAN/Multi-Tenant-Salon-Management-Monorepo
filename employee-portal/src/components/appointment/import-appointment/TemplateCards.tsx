"use client";

import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import { templatesData } from "./data";

export default function TemplateCards() {
  return (
    <div className="space-y-4">
      <h2 className="text-[14px] font-bold text-[#1E293B]">Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templatesData.map((tpl) => (
          <div
            key={tpl.id}
            className="border border-[#E2E8F0] rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#635BFF] transition-colors group cursor-pointer shadow-sm hover:shadow-md bg-white"
          >
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#635BFF] mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-[13px] font-bold text-[#1E293B] mb-1">
              {tpl.name}
            </div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-4">
              {tpl.meta}
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-[#F8FAFC] text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#635BFF] rounded-lg transition-colors cursor-pointer"
                title="View"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Viewing ${tpl.name}`);
                }}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-[#F8FAFC] text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#635BFF] rounded-lg transition-colors cursor-pointer"
                title="Download"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Downloading ${tpl.name}`);
                }}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
