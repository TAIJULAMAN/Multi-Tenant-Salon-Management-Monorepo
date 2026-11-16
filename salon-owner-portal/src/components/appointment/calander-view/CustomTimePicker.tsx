import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CustomTimePicker({
  value,
  onChange,
}: {
  value: string; // "HH:mm" in 24h format
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const parseTime = (time: string) => {
    if (!time) return { h: 12, m: 0, ampm: "PM" };
    const [hr, min] = time.split(":").map(Number);
    const ampm = hr >= 12 ? "PM" : "AM";
    const h12 = hr % 12 || 12;
    return { h: h12, m: min || 0, ampm };
  };

  const [time, setTime] = useState(parseTime(value));

  useEffect(() => {
    setTime(parseTime(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdate = (updates: Partial<typeof time>) => {
    const newTime = { ...time, ...updates };
    setTime(newTime);
    
    let h24 = newTime.h;
    if (newTime.ampm === "PM" && h24 !== 12) h24 += 12;
    if (newTime.ampm === "AM" && h24 === 12) h24 = 0;
    
    const formatted = `${h24.toString().padStart(2, "0")}:${newTime.m.toString().padStart(2, "0")}`;
    onChange(formatted);
  };

  // Scroll active elements into view on open
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      hourRef.current?.scrollIntoView({ block: "center" });
      minRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 cursor-pointer hover:border-slate-300 transition-colors"
      >
        <span className="text-[13px] font-bold text-[#635BFF] w-[64px] text-center">
          {time.h.toString().padStart(2, "0")}:{time.m.toString().padStart(2, "0")} {time.ampm}
        </span>
        <Clock size={14} className="text-[#29343D]" />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-[4px] z-50 flex w-[180px] overflow-hidden">
          {/* Hours */}
          <div className="flex-1 h-[200px] overflow-y-auto custom-scrollbar border-r border-slate-100 bg-white">
            {[...Array(12)].map((_, i) => {
              const h = i + 1;
              const isSelected = time.h === h;
              return (
                <div
                  key={h}
                  ref={isSelected ? hourRef : null}
                  onClick={() => handleUpdate({ h })}
                  className={`py-2.5 text-center text-[13px] cursor-pointer font-bold transition-colors ${
                    isSelected
                      ? "bg-[#0066FF] text-white"
                      : "hover:bg-slate-50 text-[#29343D]"
                  }`}
                >
                  {h.toString().padStart(2, "0")}
                </div>
              );
            })}
          </div>
          {/* Minutes */}
          <div className="flex-1 h-[200px] overflow-y-auto custom-scrollbar border-r border-slate-100 bg-white">
            {[...Array(60)].map((_, i) => {
              const m = i;
              const isSelected = time.m === m;
              return (
                <div
                  key={m}
                  ref={isSelected ? minRef : null}
                  onClick={() => handleUpdate({ m })}
                  className={`py-2.5 text-center text-[13px] cursor-pointer font-bold transition-colors ${
                    isSelected
                      ? "bg-[#0066FF] text-white"
                      : "hover:bg-slate-50 text-[#29343D]"
                  }`}
                >
                  {m.toString().padStart(2, "0")}
                </div>
              );
            })}
          </div>
          {/* AM/PM */}
          <div className="flex-1 h-[200px] bg-white">
            {["AM", "PM"].map((meridiem) => {
              const isSelected = time.ampm === meridiem;
              return (
                <div
                  key={meridiem}
                  onClick={() => handleUpdate({ ampm: meridiem as "AM" | "PM" })}
                  className={`py-2.5 text-center text-[13px] cursor-pointer font-bold transition-colors ${
                    isSelected
                      ? "bg-[#0066FF] text-white"
                      : "hover:bg-slate-50 text-[#29343D]"
                  }`}
                >
                  {meridiem}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
