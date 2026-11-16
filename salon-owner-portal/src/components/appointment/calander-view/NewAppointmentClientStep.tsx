"use client";

import React from "react";
import Image from "next/image";
import { Search, X, Camera, UserPlus, Mail, Phone } from "lucide-react";
import ClientNotesSection from "./ClientNotesSection";
import ClientGiftCardsSection from "./ClientGiftCardsSection";
import { DUMMY_CLIENTS } from "@/components/appointment/data";
import { ModalClient, ClientNoteItem } from "@/components/appointment/types";

interface NewAppointmentClientStepProps {
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedClient?: ModalClient;
  isAddingNewClient: boolean;
  setIsAddingNewClient: (val: boolean) => void;
  isClientDropdownOpen: boolean;
  setIsClientDropdownOpen: (open: boolean) => void;
  clientSearch: string;
  setClientSearch: (search: string) => void;
  newClientName: string;
  setNewClientName: (name: string) => void;
  newClientEmail: string;
  setNewClientEmail: (email: string) => void;
  newClientPhone: string;
  setNewClientPhone: (phone: string) => void;
  newClientPhoto: string | null;
  setNewClientPhoto: (photo: string | null) => void;
  onAddNewClient: () => void;
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
  showGiftDetails: boolean;
  setShowGiftDetails: (show: boolean) => void;
}

export default function NewAppointmentClientStep({
  selectedClientId,
  setSelectedClientId,
  selectedClient,
  isAddingNewClient,
  setIsAddingNewClient,
  isClientDropdownOpen,
  setIsClientDropdownOpen,
  clientSearch,
  setClientSearch,
  newClientName,
  setNewClientName,
  newClientEmail,
  setNewClientEmail,
  newClientPhone,
  setNewClientPhone,
  newClientPhoto,
  setNewClientPhoto,
  onAddNewClient,
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
  showGiftDetails,
  setShowGiftDetails,
}: NewAppointmentClientStepProps) {
  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-[#999]">
          Client Name *
        </label>
        <button
          onClick={() => setIsAddingNewClient(!isAddingNewClient)}
          className="text-[12px] font-bold text-[#635BFF] hover:underline"
        >
          {isAddingNewClient ? "Select existing" : "+ Add new client"}
        </button>
      </div>

      {!isAddingNewClient ? (
        <div className="relative">
          {selectedClient && !isClientDropdownOpen ? (
            <div
              onClick={() => setIsClientDropdownOpen(true)}
              className="w-full flex items-center justify-between pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-[4px] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={
                    selectedClient.photo ||
                    `/avatar/icon${
                      ((parseInt(selectedClient.id.replace(/\D/g, "")) || 1) %
                        3) +
                      1
                    }.png`
                  }
                  alt={selectedClient.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-[14px] text-[#29343D] leading-none mb-1">
                    {selectedClient.name}
                  </span>
                  <span className="text-[11px] text-[#999] leading-none">
                    {selectedClient.email} • {selectedClient.phone}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedClientId("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#29343D]"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name..."
                autoFocus={isClientDropdownOpen}
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                onFocus={() => setIsClientDropdownOpen(true)}
                className={`w-full pl-10 pr-10 py-3 bg-white border ${
                  isClientDropdownOpen ? "border-[#635BFF]" : "border-slate-200"
                } rounded-[4px] text-[15px] text-[#29343D] outline-none`}
              />
              {isClientDropdownOpen && (
                <button
                  onClick={() => {
                    setIsClientDropdownOpen(false);
                    setClientSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#29343D]"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {isClientDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-[8px] shadow-lg p-2 animate-in fade-in zoom-in-95">
              <div className="pt-2">
                <p className="text-[11px] font-bold text-[#999] uppercase tracking-wider mb-3 px-2">
                  SELECT CLIENT TO ADD
                </p>
                <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {DUMMY_CLIENTS.filter((c) =>
                    c.name.toLowerCase().includes(clientSearch.toLowerCase()),
                  ).map((client, i) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setShowGiftDetails(false);
                        setIsClientDropdownOpen(false);
                        setClientSearch("");
                      }}
                      className={`flex flex-col items-center justify-center text-center p-3 border rounded-[12px] cursor-pointer transition-colors ${
                        selectedClientId === client.id
                          ? "border-[#635BFF] bg-indigo-50/30"
                          : "border-slate-200 hover:border-[#635BFF] hover:bg-slate-50 text-[#29343D]"
                      }`}
                    >
                      <Image
                        src={client.photo || `/avatar/icon${(i % 3) + 1}.png`}
                        alt={client.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover mb-2"
                      />
                      <p className="font-bold text-[12px] text-[#29343D] leading-tight mb-1 truncate w-full">
                        {client.name}
                      </p>
                      {client.email && (
                        <p className="text-[10px] text-[#999] truncate w-full">
                          {client.email}
                        </p>
                      )}
                      {client.phone && (
                        <p className="text-[10px] text-[#999] truncate w-full">
                          {client.phone}
                        </p>
                      )}
                    </div>
                  ))}
                  {DUMMY_CLIENTS.filter((c) =>
                    c.name.toLowerCase().includes(clientSearch.toLowerCase()),
                  ).length === 0 && (
                    <p className="text-center text-xs text-[#999] py-4 col-span-3">
                      No clients found
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center mb-4">
            <label className="relative group cursor-pointer w-20 h-20 rounded-full bg-slate-50 flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-[#635BFF] hover:bg-indigo-50/30 transition-colors overflow-hidden">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                      setNewClientPhoto(e.target?.result as string);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              {newClientPhoto ? (
                <Image
                  src={newClientPhoto}
                  alt="New client"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#999] group-hover:text-[#635BFF]">
                  <Camera size={24} />
                  <span className="text-[10px] mt-1 font-medium">
                    Add Photo
                  </span>
                </div>
              )}
            </label>
          </div>
          <div className="relative">
            <UserPlus
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#635BFF]"
              size={18}
            />
            <input
              autoFocus
              placeholder="Enter full name..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[4px] text-[15px] text-[#29343D] focus:border-[#635BFF] outline-none"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                size={18}
              />
              <input
                placeholder="Email address..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[4px] text-[15px] text-[#29343D] focus:border-[#635BFF] outline-none"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                size={18}
              />
              <input
                placeholder="Phone number..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[4px] text-[15px] text-[#29343D] focus:border-[#635BFF] outline-none"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onAddNewClient}
              disabled={!newClientName}
              className="px-6 py-2.5 bg-[#635BFF] text-white text-[14px] font-bold rounded-[6px] hover:bg-[#5249db] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Client
            </button>
          </div>
        </div>
      )}

      {selectedClient &&
        (currentNotes.length > 0 ||
          selectedClient.giftCards > 0 ||
          isAddingNote) && (
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-[8px] overflow-hidden">
            <ClientNotesSection
              selectedClient={selectedClient}
              currentNotes={currentNotes}
              showNoteDetails={showNoteDetails}
              setShowNoteDetails={setShowNoteDetails}
              showAllNotes={showAllNotes}
              setShowAllNotes={setShowAllNotes}
              isAddingNote={isAddingNote}
              setIsAddingNote={setIsAddingNote}
              newNoteText={newNoteText}
              setNewNoteText={setNewNoteText}
              onAddNote={onAddNote}
            />

            <ClientGiftCardsSection
              selectedClient={selectedClient}
              showGiftDetails={showGiftDetails}
              setShowGiftDetails={setShowGiftDetails}
            />
          </div>
        )}
    </section>
  );
}
