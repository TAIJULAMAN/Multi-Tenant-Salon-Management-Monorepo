"use client";

import React, { useState } from "react";
import {
  Plus,
  Paperclip,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  Search,
} from "lucide-react";
import CustomDateRangePickerWithPresets from "@/components/customComponent/CustomDateRangePickerWithPresets";
import {
  ClientNote,
  mockMedia,
  MEDIA_TYPE_OPTIONS as mediaTypeOptions,
} from "@/components/clients/data";

interface ClientNotesTabProps {
  notes: ClientNote[];
  onOpenAddNote: () => void;
  onOpenViewNote: (note: ClientNote) => void;
  onOpenEditNote: (note: ClientNote) => void;
  onOpenDeleteNote: (note: ClientNote) => void;
  onOpenUploadMedia: () => void;
}

export default function ClientNotesTab({
  notes,
  onOpenAddNote,
  onOpenViewNote,
  onOpenEditNote,
  onOpenDeleteNote,
  onOpenUploadMedia,
}: ClientNotesTabProps) {
  const [activeMediaFilter, setActiveMediaFilter] = useState("All type");
  const [selectedMediaDateFilter, setSelectedMediaDateFilter] =
    useState("Last 7 Days");

  const filteredMedia =
    activeMediaFilter === "All type"
      ? mockMedia
      : mockMedia.filter((m) => m.type === activeMediaFilter);

  return (
    <div className="space-y-6 pb-20">
      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-5 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[14px] font-bold text-[#1E293B] font-manrope">
            Notes
          </h2>
          <button
            type="button"
            onClick={onOpenAddNote}
            className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Notes
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope text-center w-[180px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors last:border-b-0"
                >
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="text-[13px] font-bold text-[#1E293B]">
                        {item.title}
                      </h4>
                      {item.date && (
                        <span className="text-[11px] font-medium text-[#94A3B8]">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-medium text-[#94A3B8] mb-3 leading-[1.6] max-w-4xl">
                      {item.description}
                    </p>
                    {item.attachmentsCount && item.attachmentsCount > 0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#94A3B8]">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>
                          {item.attachmentsCount}{" "}
                          {item.attachmentName
                            ? `(${item.attachmentName})`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenViewNote(item)}
                        className="w-[34px] h-[34px] rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors shadow-sm cursor-pointer"
                        title="View Note"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEditNote(item)}
                        className="w-[34px] h-[34px] rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center hover:bg-[#DCFCE7] transition-colors shadow-sm cursor-pointer"
                        title="Edit Note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteNote(item)}
                        className="w-[34px] h-[34px] rounded-lg bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center hover:bg-[#FFE4E6] transition-colors shadow-sm cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Media Section */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-[18px] font-bold text-[#1E293B] font-manrope">
            Media
          </h2>
          <button
            type="button"
            onClick={onOpenUploadMedia}
            className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-bold transition-colors w-full sm:w-auto justify-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-8">
          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2.5">
              File Type
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {mediaTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveMediaFilter(type)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer ${activeMediaFilter === type ? "bg-[#EEF2FF] text-[#635BFF] border border-[#635BFF]" : "bg-transparent text-[#64748B] hover:bg-[#F1F5F9] border border-transparent"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2.5">
              Date
            </span>
            <CustomDateRangePickerWithPresets
              value={selectedMediaDateFilter}
              onChange={(val) => setSelectedMediaDateFilter(val)}
              presets={[
                "Last 7 Days",
                "Last 14 Days",
                "Last Month",
                "Last Year",
              ]}
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((media) => (
              <div
                key={media.id}
                className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1E293B]">
                      {media.fileName}
                    </h4>
                    <p className="text-[11px] font-medium text-[#94A3B8] mt-1">
                      Uploaded at {media.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-[#94A3B8] hover:text-[#1E293B] p-1 -mr-1 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {media.type === "Photo" ? (
                  <div className="w-full h-[220px] rounded-lg overflow-hidden bg-[#F1F5F9]">
                    <img
                      src={media.url}
                      alt="Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[220px] rounded-lg overflow-hidden bg-black relative group-hover:shadow-md transition-all flex items-center justify-center">
                    <video
                      src={media.url}
                      poster={media.thumbnail}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                <Search className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <h3 className="text-[14px] font-bold text-[#1E293B]">
                No Media Found
              </h3>
              <p className="text-[12px] font-medium text-[#94A3B8] mt-1">
                Try selecting a different file type or date range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
