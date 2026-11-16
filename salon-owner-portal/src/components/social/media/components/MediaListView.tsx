import React from "react";
import { MediaSession, MediaItem } from "../data";
import { MediaTableRow, TableAction } from "./MediaTableRow";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";

interface MediaListViewProps {
  allSelected: boolean;
  toggleSelectAll: () => void;
  paginatedSessions: MediaSession[];
  selected: string[];
  toggleSelect: (id: string) => void;
  handleAction: (action: TableAction, session: MediaSession) => void;
  selectedMediaItems: string[];
  toggleMediaItem: (itemId: string) => void;
}

export function MediaListView({
  allSelected,
  toggleSelectAll,
  paginatedSessions,
  selected,
  toggleSelect,
  handleAction,
  selectedMediaItems,
  toggleMediaItem
}: MediaListViewProps) {
  return (
    <div className="overflow-x-auto min-h-[350px]">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
            <th className="w-12 pl-6 pr-2 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">
              <CustomCheckbox
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded shadow-sm border border-gray-300 data-[state=checked]:bg-[#635BFF] data-[state=checked]:border-[#635BFF]"
              />
            </th>
            <th className="px-2 py-4"></th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">ID</th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">Date</th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">Client</th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">Services</th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">Managed By</th>
            <th className="px-4 py-4 text-[13px] font-semibold text-[#64748B] font-manrope">Files</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#64748B] font-manrope text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSessions.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-16 text-center text-sm font-manrope text-gray-400">
                No media found
              </td>
            </tr>
          ) : (
            paginatedSessions.map((session) => (
              <MediaTableRow
                key={session.id}
                session={session}
                isSelected={selected.includes(session.id)}
                onToggleSelect={() => toggleSelect(session.id)}
                onAction={handleAction}
                selectedMediaItems={selectedMediaItems}
                onToggleMediaItem={toggleMediaItem}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
