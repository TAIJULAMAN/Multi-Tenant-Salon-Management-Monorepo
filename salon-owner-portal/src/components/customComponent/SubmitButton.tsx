"use client";

import React from "react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function SubmitButton({
  children = "Submit",
  className = "",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`px-6 py-2 bg-[#635BFF] text-white text-sm font-semibold rounded-lg hover:bg-[#534DFD] transition-colors shadow-sm shadow-[#635BFF]/30 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
