import React from "react";
import { List, LayoutGrid } from "lucide-react";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";

interface MediaBulkActionsProps {
  allSelected: boolean;
  toggleSelectAll: () => void;
  selectedCount: number;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  handleMassDeletion: () => void;
  handleUseMedia: () => void;
}

export function MediaBulkActions({
  allSelected,
  toggleSelectAll,
  selectedCount,
  viewMode,
  setViewMode,
  handleMassDeletion,
  handleUseMedia
}: MediaBulkActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-[#E2E8F0] gap-4">
      <div className="flex items-center gap-2 font-manrope font-semibold text-[13.5px] text-[#635BFF]">
        <CustomCheckbox
          checked={allSelected}
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded shadow-sm border border-gray-300 data-[state=checked]:bg-[#635BFF] data-[state=checked]:border-[#635BFF]"
        />
        <span onClick={toggleSelectAll} className="cursor-pointer hover:opacity-75 transition-opacity">
          {allSelected ? "Unselect All Items" : "Select All Items"}
        </span>
        {!allSelected && selectedCount > 0 && (
          <span className="ml-1 text-[11px] font-medium font-manrope px-2 py-0.5 rounded-full bg-[#EBFAF0] text-[#36C76C]">
            {selectedCount} selected
          </span>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center p-1 bg-gray-100/80 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#635BFF]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#635BFF]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid size={18} strokeWidth={2.5} />
            </button>
          </div>

          <button onClick={handleMassDeletion}
            className="font-manrope font-medium cursor-pointer text-[13px] px-4 py-2 rounded-lg bg-[#FFF1F2] text-[#F43F5E] hover:bg-[#FFE4E6] transition-colors">
            Mass Deletion
          </button>
          <button
            onClick={handleUseMedia}
            className="font-manrope font-medium cursor-pointer text-[13px] px-4 py-2 rounded-lg bg-[#14B8A6] text-white hover:bg-[#0D9488] transition-colors"
          >
            Use Media
          </button>
        </div>
      )}

      {selectedCount === 0 && (
        <div className="flex items-center p-1 bg-gray-100/80 rounded-xl border border-gray-200/60">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-[#635BFF]" : "text-gray-500 hover:text-gray-700"}`}
          >
            <List size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#635BFF]" : "text-gray-500 hover:text-gray-700"}`}
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
