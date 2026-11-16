"use client";

import React from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  className?: string;
  containerClassName?: string;
  checkedClassName?: string;
  uncheckedClassName?: string;
  iconSize?: number;
  label?: React.ReactNode;
}

export default function CustomCheckbox({
  id,
  checked,
  onChange,
  className = "w-5 h-5 rounded-[6px] flex flex-shrink-0 items-center justify-center transition-colors",
  containerClassName,
  checkedClassName = "bg-brand border border-brand text-white",
  uncheckedClassName = "bg-white border-2 border-slate-300 hover:border-slate-400",
  iconSize = 12,
  label,
}: CustomCheckboxProps) {
  const resolvedContainerClass =
    containerClassName ??
    (label
      ? "flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer"
      : "inline-flex items-center cursor-pointer");

  return (
    <label className={resolvedContainerClass}>
      <div className={`relative ${label ? "mt-0.5" : ""} flex items-center justify-center`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute opacity-0 w-full h-full cursor-pointer z-10"
        />
        <div 
          className={`${className} ${
            checked ? checkedClassName : uncheckedClassName
          }`}
        >
          {checked && <Check size={iconSize} strokeWidth={3.5} className="text-white" />}
        </div>
      </div>
      {label && (
        <span className="text-xs text-slate-600 leading-tight">{label}</span>
      )}
    </label>
  );
}
