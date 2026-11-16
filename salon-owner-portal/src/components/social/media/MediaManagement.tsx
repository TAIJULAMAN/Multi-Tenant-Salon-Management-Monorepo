"use client";

import { useState, useRef, useEffect } from "react";
import { UploadIcon } from "lucide-react";
import { MediaSession, MOCK_SESSIONS } from "./data";
import { TableAction } from "./components/MediaTableRow";
import { MediaFilterBar } from "./components/MediaFilterBar";
import { MediaBulkActions } from "./components/MediaBulkActions";
import { BulkDeleteModal } from "./modals/BulkDeleteModal";
import { UseMediaModal } from "./modals/UseMediaModal";
import { MediaListView } from "./components/MediaListView";
import { MediaGridView } from "./components/MediaGridView";
import { MediaManagementModals } from "./modals/MediaManagementModals";
import Pagination from "@/components/customComponent/Pagination";

export default function MediaManagement() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sessions, setSessions] = useState<MediaSession[]>(MOCK_SESSIONS);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Date range
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<"clients" | "services" | "upload" | "view" | "delete" | "providers" | null>(null);
  const [selectedSessionForAction, setSelectedSessionForAction] = useState<MediaSession | null>(null);
  const [selectedMediaItems, setSelectedMediaItems] = useState<string[]>([]);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isUseMediaModalOpen, setIsUseMediaModalOpen] = useState(false);

  // Filter selections
  const [selectedClients, setSelectedClients] = useState<string[]>(["Maria Rodriguez", "John Smith"]);
  const [selectedServices, setSelectedServices] = useState<string[]>(["Hair Treatment", "Facial Care"]);
  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  const handleAction = (action: TableAction, session: MediaSession) => {
    if (action === "download") {
      session.items.forEach((item) => {
        const a = document.createElement("a");
        a.href = item.src;
        a.download = item.fileName || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
      return;
    }

    setSelectedSessionForAction(session);
    if (action === "edit" || action === "add") {
      setActiveModal("upload");
    } else if (action === "view" || action === "delete") {
      setActiveModal(action);
    }
  };

  const toggleClient = (client: string) =>
    setSelectedClients((prev) =>
      prev.includes(client) ? prev.filter((c) => c !== client) : [...prev, client]
    );

  const toggleService = (service: string) =>
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );

  const clearFilters = () => {
    setSelectedClients([]);
    setSelectedServices([]);
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  const filtered = sessions.filter((s) => {
    const matchSearch = search
      ? s.clientName.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.services.some((srv) => srv.toLowerCase().includes(search.toLowerCase()))
      : true;
    const matchClient = selectedClients.length === 0 || selectedClients.includes(s.clientName);
    const matchService = selectedServices.length === 0 || s.services.some((srv) => selectedServices.includes(srv));

    let matchDate = true;
    if (fromDate || toDate) {
      try {
        const sessionDate = new Date(s.date);
        if (!isNaN(sessionDate.getTime())) {
          const ymd = sessionDate.toISOString().split("T")[0];
          if (fromDate && ymd < fromDate) matchDate = false;
          if (toDate && ymd > toDate) matchDate = false;
        }
      } catch (e) {}
    }

    return matchSearch && matchClient && matchService && matchDate;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClients, selectedServices, fromDate, toDate]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedSessions = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allSelected =
    viewMode === "list"
      ? paginatedSessions.length > 0 && paginatedSessions.every((s) => selected.includes(s.id))
      : paginatedSessions.flatMap((s) => s.items).length > 0 &&
        paginatedSessions.flatMap((s) => s.items).every((i) => selectedMediaItems.includes(i.id));

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const toggleSelectAll = () => {
    if (viewMode === "list") {
      if (allSelected) {
        setSelected((prev) => prev.filter((id) => !paginatedSessions.some((s) => s.id === id)));
      } else {
        const newIds = paginatedSessions.map((s) => s.id);
        setSelected((prev) => Array.from(new Set([...prev, ...newIds])));
      }
    } else {
      const allItemIds = paginatedSessions.flatMap((s) => s.items).map((i) => i.id);
      if (allSelected) {
        setSelectedMediaItems((prev) => prev.filter((id) => !allItemIds.includes(id)));
      } else {
        setSelectedMediaItems((prev) => Array.from(new Set([...prev, ...allItemIds])));
      }
    }
  };

  const toggleMediaItem = (id: string) =>
    setSelectedMediaItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleDelete = () => {
    if (selectedSessionForAction) {
      setSessions((prev) => prev.filter((s) => s.id !== selectedSessionForAction.id));
      setActiveModal(null);
      setSelectedSessionForAction(null);
    }
  };

  const handleSaveSession = (newSession: MediaSession) => {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === newSession.id);
      return exists ? prev.map((s) => (s.id === newSession.id ? newSession : s)) : [newSession, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold text-[#1E293B]">Media Library</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">Manage photo and video content captured during client appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[13px] font-bold rounded-lg transition-colors shadow-sm"
            >
              Connect Socials
            </button>
            <button
              onClick={() => {
                setSelectedSessionForAction(null);
                setActiveModal("upload");
              }}
              className="flex items-center gap-2 bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-colors shadow-sm shadow-[#635BFF]/20"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Upload Media</span>
            </button>
          </div>
        </div>

        <MediaFilterBar
          search={search}
          setSearch={setSearch}
          selectedClients={selectedClients}
          selectedServices={selectedServices}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          clearFilters={clearFilters}
          setActiveModal={setActiveModal}
          setClientSearch={setClientSearch}
          setServiceSearch={setServiceSearch}
        />

        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
          <MediaBulkActions
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
            selectedCount={viewMode === "list" ? selected.length : selectedMediaItems.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleMassDeletion={() => setIsBulkDeleteModalOpen(true)}
            handleUseMedia={() => setIsUseMediaModalOpen(true)}
          />

          {viewMode === "list" ? (
            <MediaListView
              allSelected={allSelected}
              toggleSelectAll={toggleSelectAll}
              paginatedSessions={paginatedSessions}
              selected={selected}
              toggleSelect={toggleSelect}
              handleAction={handleAction}
              selectedMediaItems={selectedMediaItems}
              toggleMediaItem={toggleMediaItem}
            />
          ) : (
            <MediaGridView
              paginatedSessions={paginatedSessions}
              selectedMediaItems={selectedMediaItems}
              toggleMediaItem={toggleMediaItem}
            />
          )}

          {totalPages > 1 && (
            <div className="p-5 border-t border-[#E2E8F0] bg-white">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                itemsName="entries"
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <MediaManagementModals
        activeModal={activeModal}
        onCloseModal={() => setActiveModal(null)}
        selectedSessionForAction={selectedSessionForAction}
        onDeleteSession={handleDelete}
        isConnectModalOpen={isConnectModalOpen}
        onCloseConnectModal={() => setIsConnectModalOpen(false)}
        onSaveSession={handleSaveSession}
        clientSearch={clientSearch}
        setClientSearch={setClientSearch}
        selectedClients={selectedClients}
        toggleClient={toggleClient}
        serviceSearch={serviceSearch}
        setServiceSearch={setServiceSearch}
        selectedServices={selectedServices}
        toggleService={toggleService}
      />

      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        count={viewMode === "list" ? selected.length : selectedMediaItems.length}
        itemType={viewMode === "list" ? "sessions" : "media items"}
        onConfirm={() => {
          if (viewMode === "list") {
            setSessions((prev) => prev.filter((s) => !selected.includes(s.id)));
            setSelected([]);
          } else {
            setSessions((prev) =>
              prev
                .map((s) => ({
                  ...s,
                  items: s.items.filter((i) => !selectedMediaItems.includes(i.id)),
                }))
                .filter((s) => s.items.length > 0)
            );
            setSelectedMediaItems([]);
          }
        }}
      />

      <UseMediaModal
        isOpen={isUseMediaModalOpen}
        onClose={() => setIsUseMediaModalOpen(false)}
        selectedCount={viewMode === "list" ? selected.length : selectedMediaItems.length}
      />
    </div>
  );
}
