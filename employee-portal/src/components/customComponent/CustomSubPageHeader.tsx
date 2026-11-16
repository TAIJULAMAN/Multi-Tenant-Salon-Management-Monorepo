"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

interface SubPageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  badgeCount?: number;
  breadcrumbText?: string;
  rightContent?: React.ReactNode;
}

export default function CustomSubPageHeader({
  title,
  subtitle,
  backUrl = "/team",
  badgeCount,
  breadcrumbText = "Roles",
  rightContent,
}: SubPageHeaderProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg px-5 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Link href={backUrl} className="group flex items-center gap-2 text-[#1E293B] hover:text-[#635BFF] transition-colors cursor-pointer shrink-0">
          <ChevronLeft className="w-5 h-5 text-[#635BFF]" />
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <h1 className="text-[14px] font-bold text-[#1E293B] font-manrope leading-tight group-hover:text-[#635BFF] transition-colors">
                {title}
              </h1>
              {subtitle && (
                <div className="text-[11px] text-[#94A3B8] leading-tight mt-0.5 group-hover:text-[#635BFF]/80 transition-colors">
                  {subtitle}
                </div>
              )}
            </div>
            {badgeCount !== undefined && (
              <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-[#635BFF] text-white text-[11px] font-bold">
                {badgeCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      {rightContent ? (
        rightContent
      ) : (
        <div className="flex items-center gap-2 flex-wrap text-[13px] font-bold text-[#64748B]">
          <Link href="/dashboard" className="hover:text-[#1E293B] transition-colors flex items-center">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[#CBD5E1]">/</span>
          <Link href={backUrl} className="flex items-center">
            <span className="text-[#635BFF] bg-[#EEF2FF] px-2 py-0.5 rounded-lg hover:bg-[#635BFF]/10 transition-colors cursor-pointer">
              {breadcrumbText}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
