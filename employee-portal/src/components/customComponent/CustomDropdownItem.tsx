import React from "react";

export default function DropdownItem({
  icon,
  label,
  textColor = "text-[#475569]",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  textColor?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left text-base font-semibold ${textColor} hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors`}
    >
      {icon}
      {label}
    </button>
  );
}
