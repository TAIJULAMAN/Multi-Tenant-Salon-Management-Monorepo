"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ExtractedSalary } from "@/components/salaries/upload/data";

interface EditCausaleModalProps {
  packet: ExtractedSalary;
  onClose: () => void;
  onSave: (newCausale: string) => void;
}
import { formatPeriodToItalian } from "@/utils/formatters";
export { formatPeriodToItalian };

export default function EditCausaleModal({
  packet,
  onClose,
  onSave,
}: EditCausaleModalProps) {
  const [causale, setCausale] = useState(packet.causale || "");

  // Prevent background scrolling and handle Escape key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const italianPeriod = formatPeriodToItalian(packet.period);

  const suggestions = [
    `Stipendio ${italianPeriod}`,
    "TFR",
    `Stipendio ${italianPeriod} + TFR`,
    "Tredicesima",
    "Quattordicesima",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(causale);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl p-6 shadow-2xl border border-slate-200/80 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[17px] font-bold text-slate-800 tracking-tight">
              Modifica Causale Pagamento
            </h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
              {packet.employeeName ? packet.employeeName.toUpperCase() : "DIPENDENTE"} • {packet.period}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5">
          {/* Input field */}
          <div>
            <input
              type="text"
              value={causale}
              onChange={(e) => setCausale(e.target.value)}
              placeholder="Inserisci causale pagamento"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all"
              autoFocus
            />
          </div>

          {/* Quick suggestions */}
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2.5">
              Suggerimenti rapidi:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => {
                const isSelected =
                  causale.trim().toLowerCase() === item.toLowerCase();
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCausale(item)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand/10 border-brand text-brand shadow-xs"
                        : "bg-slate-100/80 hover:bg-slate-200/80 border-slate-200/60 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-200/80 text-slate-700 font-bold text-sm transition-all cursor-pointer text-center"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-sm transition-all shadow-md shadow-brand/25 cursor-pointer text-center"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
