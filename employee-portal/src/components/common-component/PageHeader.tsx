"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import BreadcrumbIcon from "../svg/BreadcrumbIcon";
import { useRouter } from "next/navigation";

export default function PageHeader({
  title,
  onBack,
  showBackButton = false,
  breadcrumb = [],
  HomeIcon,
  actions,
}: {
  title: React.ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  breadcrumb?: { label: string; active: boolean }[];
  HomeIcon?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const hasBackButton = showBackButton || onBack !== undefined;

  return (
    <div className="bg-white md:mb-0 mb-[16px] px-6 py-3.5 flex items-center justify-between border-b border-[#EFF4FA] rounded-xl flex-wrap gap-3">
      {/* Left side: Back button and title */}
      <div className="flex items-center gap-2 text-sm text-[#29343D]">
        {hasBackButton && (
          <button
            onClick={handleBack}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ChevronLeft size={16} className="text-[#635BFF]" />
          </button>
        )}
        <span className="text-base font-bold font-manrope text-[#29343D]">
          {title}
        </span>
      </div>

      {/* Right side: Breadcrumb & Actions */}
      <div className="flex items-center gap-4 text-sm text-[#98A4AE]">
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Home Icon (JSX or fallback) */}
            {HomeIcon ? HomeIcon : <BreadcrumbIcon />}

            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <span className="text-[#29343D]">/</span>
                <span
                  className={`text-sm px-2 py-0.5 font-manrope rounded-md ${
                    item.active
                      ? "text-[#635BFF] font-medium bg-[#EEEEFF]"
                      : "text-[#98A4AE]"
                  }`}
                >
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
