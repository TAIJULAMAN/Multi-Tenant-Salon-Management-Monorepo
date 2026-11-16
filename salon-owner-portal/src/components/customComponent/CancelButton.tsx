"use client";

import React from "react";

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function CancelButton({ onClick, children = "Cancel", className = "", ...props }: CancelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-[#635BFF] px-5 py-2 text-sm font-medium text-[#635BFF] cursor-pointer hover:bg-[#635BFF]/5 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
