"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { tagSegmentationList, allAvailableTags } from "./data";
import TagSegmentationCards from "./TagSegmentationCards";
import TagSegmentationTable from "./TagSegmentationTable";
import CustomSearch from "../customComponent/CustomSearch";

export default function TagSegmentationTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Biondo",
    "Biondo Platino",
    "Castano",
    "Corti",
    "Fedele",
    "Lunghi",
  ]);
  const [matchLogic, setMatchLogic] = useState<"OR" | "AND">("OR");

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  const filteredTagsToShow = allAvailableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredList = tagSegmentationList.filter((client) => {
    if (selectedTags.length === 0) return true; // Show all if no tags selected

    if (matchLogic === "OR") {
      return client.tags.some((tag) => selectedTags.includes(tag));
    } else {
      return selectedTags.every((tag) => client.tags.includes(tag));
    }
  });

  return (
    <div className="space-y-6 text-left font-manrope">
      {/* Tag Filters Settings */}
      <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-[#1E293B]">Tag Filters</h3>

        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
            Search Tags:
          </label>
          <CustomSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type to search tags..."
            className="w-full"
          />
        </div>

        {/* Selected Tags list */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-[#1E293B]">
              Select Tags ({selectedTags.length} selected):
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-[#635BFF] hover:text-[#5249E6] transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredTagsToShow.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isSelected
                    ? "bg-[#EEF2FF] border-[#635BFF] text-[#635BFF] shadow-sm"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
                    }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Match Logic selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <label className="block text-xs font-semibold text-[#1E293B] mb-1.5 sm:mb-0">
            Match Logic:
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setMatchLogic("OR")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all h-[32px] flex items-center justify-center ${matchLogic === "OR"
                ? "bg-[#635BFF] text-white shadow-sm"
                : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
                }`}
            >
              OR (Match ANY tag)
            </button>
            <button
              onClick={() => setMatchLogic("AND")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all h-[32px] flex items-center justify-center ${matchLogic === "AND"
                ? "bg-[#635BFF] text-white shadow-sm"
                : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
                }`}
            >
              AND (Match ALL tags)
            </button>
          </div>
        </div>
      </div>

      <TagSegmentationCards filteredList={filteredList} />
      <TagSegmentationTable filteredList={filteredList} />
    </div>
  );
}
