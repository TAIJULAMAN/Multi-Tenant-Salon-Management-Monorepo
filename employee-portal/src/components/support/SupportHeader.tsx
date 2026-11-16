"use client";

import React from "react";
import { LifeBuoy } from "lucide-react";
import { SupportHeaderProps } from "./types";

export default function SupportHeader({ activeTicketsCount }: SupportHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#635BFF] via-[#7B74FF] to-[#8F89FF] rounded-lg p-8 text-white shadow-xl shadow-[#635BFF]/10 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
        <LifeBuoy className="w-96 h-96" />
      </div>
      <div className="max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4 border border-white/10 uppercase tracking-wider">
          <LifeBuoy className="w-3.5 h-3.5" /> Support Center
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold font-manrope tracking-tight leading-tight mb-3">
          How can we help you today?
        </h1>
        <p className="text-white/95 text-base font-medium font-manrope leading-relaxed">
          Submit a support request to the platform admin, chat with support staff, or read through the quick troubleshooting guide below.
        </p>
      </div>

      {/* Support Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20 max-w-xl">
        <div>
          <div className="text-2xl font-bold font-manrope">10 min</div>
          <div className="text-xs text-white/80">Avg. Response Time</div>
        </div>
        <div>
          <div className="text-2xl font-bold font-manrope">24/7</div>
          <div className="text-xs text-white/80">Admin Availability</div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-2xl font-bold font-manrope">
            {activeTicketsCount} Active
          </div>
          <div className="text-xs text-white/80">Support Requests</div>
        </div>
      </div>
    </div>
  );
}
