"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Check } from "lucide-react";
import { AUTOMATION_CLIENTS } from "@/components/financial/data";

interface ExceptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onSave: (ids: string[]) => void;
}

export function ExceptionsModal({
  isOpen,
  onClose,
  selected,
  onSave,
}: ExceptionsModalProps) {
  const [search, setSearch] = useState("");
  const [localSelected, setLocalSelected] = useState<string[]>(selected);

  const filtered = useMemo(
    () =>
      AUTOMATION_CLIENTS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const toggle = (id: string) =>
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-2xl w-[440px] max-h-[90vh] flex flex-col overflow-hidden z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-[15px] font-bold text-[#1E293B]">
            Exceptions to default
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#475569]" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2 bg-[#F8F9FE] border border-[#E2E8F0] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="flex-1 bg-transparent text-[12px] text-[#475569] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1">
          {filtered.map((client) => {
            const isChecked = localSelected.includes(client.id);
            return (
              <button
                key={client.id}
                onClick={() => toggle(client.id)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#F8F9FE] transition-colors text-left"
              >
                <div
                  className={`w-8 h-8 rounded-full ${client.color} flex items-center justify-center shrink-0`}
                >
                  <span className="text-white text-[11px] font-bold">
                    {client.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1E293B]">
                    {client.name}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    {client.role}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-[#635BFF] border-[#635BFF]"
                      : "border-[#E2E8F0] bg-white"
                  }`}
                >
                  {isChecked && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-[12px] text-[#94A3B8]">
              No clients found
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={() => {
              onSave(localSelected);
              onClose();
            }}
            className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors"
          >
            Save list
          </button>
        </div>
      </div>
    </div>
  );
}
