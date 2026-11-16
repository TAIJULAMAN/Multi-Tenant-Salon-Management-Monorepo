"use client";

import React from "react";
import { Mail, Phone, Clock, ExternalLink } from "lucide-react";

export default function SupportContactDetails() {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 space-y-4">
      <h3 className="font-bold text-base text-[#1E293B] font-manrope">Direct Contact Details</h3>
      <p className="text-xs text-[#64748B]">Need instant help? Connect with the administrator using these channels.</p>

      <div className="space-y-3.5 pt-2">
        <a
          href="mailto:admin@harem-beauty.com"
          className="flex items-center gap-3 p-3 rounded-lg border border-[#F1F5F9] hover:bg-slate-50 transition-colors"
        >
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Mail className="w-4.5 h-4.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs font-bold text-[#334155] uppercase tracking-wider">Email Us</div>
            <div className="text-xs text-[#64748B] truncate">admin@harem-beauty.com</div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] ml-auto shrink-0" />
        </a>

        <a
          href="tel:+18005553289"
          className="flex items-center gap-3 p-3 rounded-lg border border-[#F1F5F9] hover:bg-slate-50 transition-colors"
        >
          <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <Phone className="w-4.5 h-4.5" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs font-bold text-[#334155] uppercase tracking-wider">Phone Support</div>
            <div className="text-xs text-[#64748B] truncate">+1 (800) 555-3289</div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] ml-auto shrink-0" />
        </a>

        <div className="flex items-center gap-3 p-3 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-[#334155] uppercase tracking-wider">Support Hours</div>
            <div className="text-xs text-[#64748B]">Mon - Fri: 8 AM - 8 PM EST</div>
          </div>
        </div>
      </div>
    </div>
  );
}
