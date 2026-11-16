"use client";

import React, { useState } from "react";
import { X, Printer, Download, Trash2, FileText, Upload } from "lucide-react";
import { ClientReceiptItem, ClientNoteItem } from "@/components/clients/types";
import EditPersonalDataModal, { PersonalData } from "@/components/clients/EditPersonalDataModal";
import EditAddressModal, { FullAddressData } from "@/components/clients/EditAddressModal";
import AllServicesBreakdownModal from "@/components/clients/AllServicesBreakdownModal";

interface ClientDetailsModalsProps {
  // Personal & Address Modals
  isEditPersonalOpen: boolean;
  onCloseEditPersonal: () => void;
  isEditAddressOpen: boolean;
  onCloseEditAddress: () => void;
  isAllServicesOpen: boolean;
  onCloseAllServices: () => void;

  // Receipt Print/Download Modals
  printReceipt: ClientReceiptItem | null;
  onClosePrintReceipt: () => void;
  downloadReceipt: ClientReceiptItem | null;
  onCloseDownloadReceipt: () => void;

  // Notes Modals
  isAddNoteOpen: boolean;
  onCloseAddNote: () => void;
  viewNote: ClientNoteItem | null;
  onCloseViewNote: () => void;
  editNote: ClientNoteItem | null;
  onCloseEditNote: () => void;
  deleteNote: ClientNoteItem | null;
  onCloseDeleteNote: () => void;

  // Media Modal
  isUploadMediaOpen: boolean;
  onCloseUploadMedia: () => void;
}

export const ClientDetailsModals: React.FC<ClientDetailsModalsProps> = ({
  isEditPersonalOpen,
  onCloseEditPersonal,
  isEditAddressOpen,
  onCloseEditAddress,
  isAllServicesOpen,
  onCloseAllServices,
  printReceipt,
  onClosePrintReceipt,
  downloadReceipt,
  onCloseDownloadReceipt,
  isAddNoteOpen,
  onCloseAddNote,
  viewNote,
  onCloseViewNote,
  editNote,
  onCloseEditNote,
  deleteNote,
  onCloseDeleteNote,
  isUploadMediaOpen,
  onCloseUploadMedia,
}) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const [personalData, setPersonalData] = useState<PersonalData>({
    dob: "12/06/1992",
    age: "32",
    gender: "Female",
    telephone: "+39 345 678 9123",
    email: "maria.rodriguez@email.com",
  });

  const [addressData, setAddressData] = useState<FullAddressData>({
    address: "Via Ugo Bassi 24, Apt 4B",
    city: "Bologna",
    province: "Bologna (BO)",
    cap: "40121",
  });

  return (
    <>
      {/* Existing Domain Modals */}
      <EditPersonalDataModal
        isOpen={isEditPersonalOpen}
        onClose={onCloseEditPersonal}
        data={personalData}
        onSave={(updated) => {
          setPersonalData(updated);
          onCloseEditPersonal();
        }}
      />

      <EditAddressModal
        isOpen={isEditAddressOpen}
        onClose={onCloseEditAddress}
        data={addressData}
        onSave={(updated) => {
          setAddressData(updated);
          onCloseEditAddress();
        }}
      />

      <AllServicesBreakdownModal
        isOpen={isAllServicesOpen}
        onClose={onCloseAllServices}
      />

      {/* Print Receipt Modal */}
      {printReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClosePrintReceipt} />
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#635BFF]">
                <Printer className="w-5 h-5" />
                <h3 className="text-[16px] font-bold text-[#1E293B]">Print Receipt</h3>
              </div>
              <button onClick={onClosePrintReceipt} className="text-[#94A3B8] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-5 space-y-3">
              <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Receipt Number:</span>
                  <span className="font-bold text-[#1E293B]">{printReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Date & Time:</span>
                  <span className="font-medium text-[#1E293B]">{printReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Operator:</span>
                  <span className="font-medium text-[#1E293B]">{printReceipt.operator}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E2E8F0] text-[15px]">
                  <span className="font-bold text-[#1E293B]">Total Paid:</span>
                  <span className="font-bold text-[#10B981]">{printReceipt.total}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={onClosePrintReceipt}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-[12px] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  onClosePrintReceipt();
                }}
                className="px-5 py-2 bg-[#635BFF] text-white text-[12px] font-bold rounded-lg hover:bg-[#524be0] transition-colors"
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Receipt Modal */}
      {downloadReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseDownloadReceipt} />
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#10B981]">
                <Download className="w-5 h-5" />
                <h3 className="text-[16px] font-bold text-[#1E293B]">Download Invoice</h3>
              </div>
              <button onClick={onCloseDownloadReceipt} className="text-[#94A3B8] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[13px] text-[#64748B] my-4">
              Download PDF for receipt <strong className="text-[#1E293B]">{downloadReceipt.receiptNumber}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseDownloadReceipt}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-[12px] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onCloseDownloadReceipt}
                className="px-5 py-2 bg-[#10B981] text-white text-[12px] font-bold rounded-lg hover:bg-[#059669] transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseAddNote} />
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#1E293B]">Add Client Note</h3>
              <button onClick={onCloseAddNote} className="text-[#94A3B8] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Coloring Formula"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] outline-none focus:border-[#635BFF]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Note Content *</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed observations or formulas..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-3 border border-[#E2E8F0] rounded-lg text-[13px] outline-none focus:border-[#635BFF] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseAddNote}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-[12px] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onCloseAddNote}
                className="px-5 py-2 bg-[#635BFF] text-white text-[12px] font-bold rounded-lg hover:bg-[#524be0] transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseViewNote} />
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#1E293B]">{viewNote.title}</h3>
              <button onClick={onCloseViewNote} className="text-[#94A3B8] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4">
              <div className="text-[11px] text-[#94A3B8] mb-3">
                Created on {viewNote.date} by {viewNote.author}
              </div>
              <p className="text-[13px] text-[#334155] leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                {viewNote.content}
              </p>
            </div>
            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseViewNote}
                className="px-5 py-2 bg-[#635BFF] text-white text-[12px] font-bold rounded-lg hover:bg-[#524be0] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Note Modal */}
      {deleteNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseDeleteNote} />
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-[#EF4444] mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1E293B]">Delete Note</h3>
            </div>
            <p className="text-[13px] text-[#64748B] mb-5">
              Are you sure you want to delete note <strong className="text-[#1E293B]">{deleteNote.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCloseDeleteNote}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-[12px] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onCloseDeleteNote}
                className="px-5 py-2 bg-[#EF4444] text-white text-[12px] font-bold rounded-lg hover:bg-[#DC2626] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCloseUploadMedia} />
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#1E293B]">Upload Photo / Media</h3>
              <button onClick={onCloseUploadMedia} className="text-[#94A3B8] hover:text-[#1E293B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-[#CBD5E1] rounded-lg p-6 bg-[#F8FAFC] my-4 cursor-pointer hover:border-[#635BFF] transition-colors">
              <Upload className="w-8 h-8 text-[#635BFF] mb-2" />
              <p className="text-[13px] font-bold text-[#1E293B]">Choose file or drag & drop</p>
              <p className="text-[11px] text-[#94A3B8] mt-1">JPG, PNG up to 10MB</p>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseUploadMedia}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-[12px] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onCloseUploadMedia}
                className="px-5 py-2 bg-[#635BFF] text-white text-[12px] font-bold rounded-lg hover:bg-[#524be0] transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
