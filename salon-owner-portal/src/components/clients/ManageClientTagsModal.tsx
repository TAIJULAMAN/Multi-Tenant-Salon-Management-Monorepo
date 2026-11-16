"use client";

import React, { useState } from "react";
import { X, Tag, Plus, Check } from "lucide-react";

interface ManageClientTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onSave: (tags: string[]) => void;
}

const PRESET_TAGS = [
  "VIP",
  "New Client",
  "Frequent Canceler",
  "High Spender",
  "Sensitive Skin",
  "Late Arrival",
  "Loyal",
  "Color Specialist Fan",
  "Student Discount",
];

export default function ManageClientTagsModal({
  isOpen,
  onClose,
  tags,
  onSave,
}: ManageClientTagsModalProps) {
  const [currentTags, setCurrentTags] = useState<string[]>(tags);
  const [customTagInput, setCustomTagInput] = useState("");

  if (!isOpen) return null;

  const removeTag = (t: string) => {
    setCurrentTags((prev) => prev.filter((item) => item !== t));
  };

  const addTag = (t: string) => {
    const trimmed = t.trim();
    if (trimmed && !currentTags.includes(trimmed)) {
      setCurrentTags((prev) => [...prev, trimmed]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim()) {
      addTag(customTagInput);
      setCustomTagInput("");
    }
  };

  const handleSave = () => {
    onSave(currentTags);
    onClose();
  };

  const getTagStyle = (tag: string) => {
    if (tag === "VIP") return "bg-[#14B8A6] text-white";
    if (tag === "New Client") return "border border-[#10B981] text-[#10B981]";
    if (tag === "Frequent Canceler")
      return "border border-[#F43F5E] text-[#F43F5E]";
    return "bg-[#EEF2FF] text-[#635BFF] border border-[#635BFF]/20";
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
            <Tag size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1E293B] font-manrope">
              Manage Client Tags
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Add or remove client categorization tags
            </p>
          </div>
        </div>

        {/* Current Tags */}
        <div className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
            Active Tags ({currentTags.length})
          </label>
          {currentTags.length === 0 ? (
            <p className="text-[13px] text-slate-400 italic">
              No tags assigned yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs ${getTagStyle(
                    tag,
                  )}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:opacity-75 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add custom tag */}
        <form onSubmit={handleAddCustom} className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
            Add New Tag
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              placeholder="e.g. Sensitive Scalp, High Priority..."
              className="flex-1 text-[13px] border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:border-[#635BFF]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#635BFF] hover:bg-[#524be0] text-white text-[12px] font-bold rounded-xl flex items-center gap-1 shadow-sm transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </form>

        {/* Quick Presets */}
        <div className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
            Suggested Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TAGS.map((preset) => {
              const isAdded = currentTags.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => (isAdded ? removeTag(preset) : addTag(preset))}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    isAdded
                      ? "bg-[#EEF2FF] border-[#635BFF] text-[#635BFF]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-slate-300 hover:text-[#1E293B]"
                  }`}
                >
                  {isAdded && <Check size={11} />}
                  <span>{preset}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl font-bold text-[13px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white font-bold text-[13px] rounded-xl shadow-lg shadow-[#635BFF]/20 transition-colors"
          >
            Save Tags
          </button>
        </div>
      </div>
    </div>
  );
}
