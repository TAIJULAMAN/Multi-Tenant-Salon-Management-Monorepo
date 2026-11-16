"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { CalendarSettingsPanelProps } from "@/components/appointment/types";
import CalendarSettingsDropdown from "./CalendarSettingsDropdown";

export default function CalendarSettingsPanel(props: CalendarSettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="font-manrope relative" ref={containerRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] border text-[14px] font-semibold transition-colors cursor-pointer
          ${
            open
              ? "bg-[#DDDBFF] border-[#635BFF] text-[#635BFF]"
              : "bg-white border-[#E0E6EB] text-[#526B7A] hover:border-[#635BFF] hover:text-[#635BFF]"
          }`}
      >
        <CalendarDays size={15} />
        Calendar settings
      </button>

      {open && (
        <CalendarSettingsDropdown
          {...props}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
