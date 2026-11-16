"use client";

import React, { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title = "Dashboard",
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-white px-4 sm:px-6 py-4 sm:py-4.5 border border-[#E2E8F0] shadow-sm">
      <div className="space-y-1">
        <h1 className="text-lg sm:text-[1.15rem] font-bold text-[#1E293B] font-manrope leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[11px] sm:text-xs text-[#94A3B8] font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="w-full sm:w-auto flex items-center justify-stretch sm:justify-end [&>*]:w-full sm:[&>*]:w-auto [&_button]:w-full sm:[&_button]:w-auto shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
