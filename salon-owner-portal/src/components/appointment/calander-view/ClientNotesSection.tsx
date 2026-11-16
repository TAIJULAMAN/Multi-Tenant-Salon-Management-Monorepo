"use client";

import React from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ClientNoteItem, ModalClient } from "@/components/appointment/types";

interface ClientNotesSectionProps {
  selectedClient: ModalClient;
  currentNotes: ClientNoteItem[];
  showNoteDetails: boolean;
  setShowNoteDetails: (show: boolean) => void;
  showAllNotes: boolean;
  setShowAllNotes: (show: boolean) => void;
  isAddingNote: boolean;
  setIsAddingNote: (adding: boolean) => void;
  newNoteText: string;
  setNewNoteText: (text: string) => void;
  onAddNote: () => void;
}

export default function ClientNotesSection({
  selectedClient,
  currentNotes,
  showNoteDetails,
  setShowNoteDetails,
  showAllNotes,
  setShowAllNotes,
  isAddingNote,
  setIsAddingNote,
  newNoteText,
  setNewNoteText,
  onAddNote,
}: ClientNotesSectionProps) {
  return (
    <div className={selectedClient.giftCards > 0 ? "border-b border-slate-200" : ""}>
      <button
        type="button"
        onClick={() => setShowNoteDetails(!showNoteDetails)}
        className="w-full px-4 py-3 flex items-center justify-between text-[14px] font-bold text-[#29343D] hover:bg-slate-50 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span>Client notes</span>
          {currentNotes.length > 0 && (
            <span className="text-[11px] bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded-full font-bold">
              {currentNotes.length}
            </span>
          )}
        </div>
        {showNoteDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showNoteDetails && (
        <div className="px-4 pb-4 space-y-2.5 animate-in slide-in-from-top-1">
          {/* Notes List */}
          <div className="space-y-2">
            {(showAllNotes ? currentNotes : currentNotes.slice(0, 1)).map(
              (note, idx) => (
                <div
                  key={note.id || idx}
                  className="bg-white border border-slate-200 p-3 rounded-[4px] space-y-1.5 shadow-2xs"
                >
                  <p className="text-[13px] text-[#29343D] leading-relaxed">
                    {note.text}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#98A4AE] pt-1 border-t border-slate-50">
                    <span>
                      {note.author ? `By ${note.author}` : "Staff Note"}
                    </span>
                    <span>{note.date}</span>
                  </div>
                </div>
              )
            )}

            {currentNotes.length === 0 && !isAddingNote && (
              <p className="text-xs text-[#999] italic py-2">
                No notes recorded yet.
              </p>
            )}
          </div>

          {/* Action Buttons Row */}
          {!isAddingNote && (
            <div className="flex items-center justify-between pt-1">
              {currentNotes.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="text-[12px] font-bold text-[#635BFF] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {showAllNotes ? (
                    <>
                      Show less <ChevronUp size={13} />
                    </>
                  ) : (
                    <>
                      Show all notes ({currentNotes.length}){" "}
                      <ChevronDown size={13} />
                    </>
                  )}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setIsAddingNote(true)}
                className="text-[12px] font-bold text-[#635BFF] flex items-center gap-1 hover:underline cursor-pointer ml-auto"
              >
                <Plus size={13} strokeWidth={2.5} /> Add new note
              </button>
            </div>
          )}

          {/* Inline Add Note Form */}
          {isAddingNote && (
            <div className="bg-white border border-[#635BFF]/30 p-3 rounded-[6px] space-y-2 shadow-sm animate-in fade-in duration-150">
              <textarea
                autoFocus
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Add note for ${selectedClient.name}...`}
                className="w-full text-[13px] text-[#29343D] placeholder-[#98A4AE] outline-none resize-none min-h-[64px] bg-transparent"
              />
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNoteText("");
                  }}
                  className="px-3 py-1.5 text-[12px] font-semibold text-[#526B7A] hover:bg-slate-100 rounded-[4px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onAddNote}
                  disabled={!newNoteText.trim()}
                  className="px-3.5 py-1.5 text-[12px] font-bold bg-[#635BFF] hover:bg-[#5249db] text-white rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

