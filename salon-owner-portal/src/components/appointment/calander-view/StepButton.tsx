import React from "react";

export default function StepButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 flex items-center justify-center border border-[#E0E6EB] rounded-[8px] bg-white text-[#29343D] text-lg font-bold shrink-0 hover:bg-[#F4F6FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
    >
      {children}
    </button>
  );
}

