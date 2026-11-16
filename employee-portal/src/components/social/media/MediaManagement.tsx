"use client";

import { useState, useRef, useEffect } from "react";
import { UploadIcon } from "lucide-react";
import ConnectSocialMediaModal from "../ConnectSocialMediaModal";
import { MediaItem, MediaSession, MOCK_SESSIONS, ALL_CLIENTS, ALL_SERVICES, ALL_PROVIDERS } from "./data";
import { TableAction } from "./components/MediaTableRow";
import { MediaFilterBar } from "./components/MediaFilterBar";
import { MediaBulkActions } from "./components/MediaBulkActions";
import { GridMassActions } from "./components/GridMassActions";
import { MediaListView } from "./components/MediaListView";
import { MediaGridView } from "./components/MediaGridView";

import { UploadWizardModal } from "./modals/UploadWizardModal";
import { SelectClientsModal } from "./modals/SelectClientsModal";
import { SelectServicesModal } from "./modals/SelectServicesModal";
import { SelectProvidersModal } from "./modals/SelectProvidersModal";
import { ViewSessionModal } from "./modals/ViewSessionModal";
import { DeleteSessionModal } from "./modals/DeleteSessionModal";

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
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<"clients" | "services" | "upload" | "view" | "delete" | "providers" | null>(null);
  const [selectedSessionForAction, setSelectedSessionForAction] = useState<MediaSession | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedMediaItems, setSelectedMediaItems] = useState<string[]>([]);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Filter selections
  const [selectedClients, setSelectedClients] = useState<string[]>(["Maria Rodriguez", "John Smith"]);
  const [selectedServices, setSelectedServices] = useState<string[]>(["Hair Treatment", "Facial Care"]);
  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Upload wizard
  const [wizardClient, setWizardClient] = useState<string | null>(null);
  const [wizardClientSearch, setWizardClientSearch] = useState("");
  const [wizardServices, setWizardServices] = useState<string[]>([]);
  const [wizardProviders, setWizardProviders] = useState<string[]>([]);
  const [wizardProviderSearch, setWizardProviderSearch] = useState("");
  const [wizardNotes, setWizardNotes] = useState("");
  const [wizardFiles, setWizardFiles] = useState<MediaItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: f.name,
        type: f.type.startsWith('video/') ? 'video' as const : 'photo' as const,
        uploadedBy: wizardClient || "Me",
        uploadedAt: new Date().toLocaleString(),
        published: false,
        src: URL.createObjectURL(f)
      }));
      setWizardFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleCompleteUpload = () => {
    if (!wizardClient || wizardFiles.length === 0) return;

    if (editingSessionId) {
      setSessions(prev => prev.map(s => s.id === editingSessionId ? {
        ...s,
        clientName: wizardClient,
        clientSubtext: wizardNotes || "New Session",
        services: wizardServices,
        managedBy: wizardProviders.length > 0 ? wizardProviders.join(", ") : "Current User",
        items: wizardFiles
      } : s));
    } else {
      const newSession: MediaSession = {
        id: Math.random().toString(36).substr(2, 8),
        date: new Date().toLocaleDateString(),
        clientName: wizardClient,
        clientSubtext: wizardNotes || "New Session",
        services: wizardServices,
        managedBy: wizardProviders.length > 0 ? wizardProviders.join(", ") : "Current User",
        items: wizardFiles
      };
      setSessions(prev => [newSession, ...prev]);
    }

    setActiveModal(null);
    setEditingSessionId(null);
  };

  const handleAction = (action: TableAction, session: MediaSession) => {
    if (action === 'download') {
      session.items.forEach(item => {
        const a = document.createElement('a');
        a.href = item.src;
        a.download = item.fileName || "download";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
      return;
    }

    if (action === 'edit' || action === 'add') {
      setWizardClient(session.clientName);
      setWizardServices(session.services);
      setWizardProviders(session.managedBy && session.managedBy !== "Current User" ? session.managedBy.split(", ") : []);
      setWizardNotes(session.clientSubtext);
      setWizardFiles(session.items);
      setEditingSessionId(session.id);
      setUploadStep(action === 'edit' ? 1 : 3);
      setActiveModal("upload");
      return;
    }

    setSelectedSessionForAction(session);
    setActiveModal(action);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDatePicker]);

  const toggleClient = (client: string) =>
    setSelectedClients(prev => prev.includes(client) ? prev.filter(c => c !== client) : [...prev, client]);

  const toggleService = (service: string) =>
    setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);

  const clearFilters = () => {
    setSelectedClients([]);
    setSelectedServices([]);
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  const filteredClientList = ALL_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );
  const filteredServiceList = ALL_SERVICES.filter(s =>
    s.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filtered = sessions.filter((s) => {
    const matchSearch = search ? (s.clientName.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()) || s.services.some(srv => srv.toLowerCase().includes(search.toLowerCase()))) : true;
    const matchClient = selectedClients.length === 0 || selectedClients.includes(s.clientName);
    const matchService = selectedServices.length === 0 || s.services.some(srv => selectedServices.includes(srv));

    let matchDate = true;
    if (fromDate || toDate) {
      try {
        const sessionDate = new Date(s.date);
        if (!isNaN(sessionDate.getTime())) {
          const ymd = sessionDate.toISOString().split('T')[0];
          if (fromDate && ymd < fromDate) matchDate = false;
          if (toDate && ymd > toDate) matchDate = false;
        }
      } catch (e) { }
    }

    return matchSearch && matchClient && matchService && matchDate;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClients, selectedServices, fromDate, toDate]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedSessions = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allSelected = viewMode === "list"
    ? paginatedSessions.length > 0 && paginatedSessions.every((s) => selected.includes(s.id))
    : paginatedSessions.flatMap(s => s.items).length > 0 && paginatedSessions.flatMap(s => s.items).every(i => selectedMediaItems.includes(i.id));

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleSelectAll = () => {
    if (viewMode === "list") {
      if (allSelected) {
        setSelected(prev => prev.filter(id => !paginatedSessions.find(s => s.id === id)));
      } else {
        setSelected(prev => Array.from(new Set([...prev, ...paginatedSessions.map(s => s.id)])));
      }
    } else {
      const allItemIds = paginatedSessions.flatMap(s => s.items).map(i => i.id);
      if (allSelected) {
        setSelectedMediaItems(prev => prev.filter(id => !allItemIds.includes(id)));
      } else {
        setSelectedMediaItems(prev => Array.from(new Set([...prev, ...allItemIds])));
      }
    }
  };

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
  };

  const toggleMediaItem = (itemId: string) => {
    setSelectedMediaItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const handleMassDeletion = () => {
    setSessions(prev => prev.filter(s => !selected.includes(s.id)));
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-manrope">
      <div>
        <MediaFilterBar
          search={search}
          setSearch={setSearch}
          selectedClients={selectedClients}
          selectedServices={selectedServices}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setActiveModal={setActiveModal}
          setClientSearch={setClientSearch}
          setServiceSearch={setServiceSearch}
          clearFilters={clearFilters}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
        />

        <div className="flex flex-wrap items-center gap-4 mb-6 mt-6">
          <button
            onClick={() => {
              setUploadStep(1);
              setWizardClient(null);
              setWizardClientSearch("");
              setWizardServices([]);
              setWizardProviders([]);
              setWizardNotes("");
              setWizardFiles([]);
              setEditingSessionId(null);
              setActiveModal("upload");
            }}
            className="flex flex-col items-start gap-4 justify-center rounded-lg w-[180px] p-[20px] bg-[#635BFF] cursor-pointer shadow-lg shadow-indigo-100 hover:opacity-90 transition-opacity"
          >
            <UploadIcon color="white" />
            <span className="text-start text-white font-manrope font-bold text-lg">Add Media</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
          <MediaBulkActions
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
            selectedCount={viewMode === "list" ? selected.length : selectedMediaItems.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
            handleMassDeletion={handleMassDeletion}
            handleUseMedia={() => alert(`Proceeding to use ${selected.length} sessions and ${selectedMediaItems.length} specific files for publishing!`)}
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

      {activeModal === "clients" && (
        <SelectClientsModal
          onClose={() => setActiveModal(null)}
          clientSearch={clientSearch}
          setClientSearch={setClientSearch}
          filteredClientList={filteredClientList}
          selectedClients={selectedClients}
          toggleClient={toggleClient}
        />
      )}

      {activeModal === "services" && (
        <SelectServicesModal
          onClose={() => setActiveModal(null)}
          serviceSearch={serviceSearch}
          setServiceSearch={setServiceSearch}
          filteredServiceList={filteredServiceList}
          selectedServices={selectedServices}
          toggleService={toggleService}
        />
      )}

      {activeModal === "upload" && (
        <UploadWizardModal
          onClose={() => setActiveModal(null)}
          uploadStep={uploadStep}
          setUploadStep={setUploadStep}
          wizardClient={wizardClient}
          setWizardClient={setWizardClient}
          wizardClientSearch={wizardClientSearch}
          setWizardClientSearch={setWizardClientSearch}
          ALL_CLIENTS={ALL_CLIENTS}
          wizardServices={wizardServices}
          setWizardServices={setWizardServices}
          ALL_SERVICES={ALL_SERVICES}
          wizardProviders={wizardProviders}
          onOpenProvidersModal={() => setActiveModal("providers")}
          wizardNotes={wizardNotes}
          setWizardNotes={setWizardNotes}
          wizardFiles={wizardFiles}
          setWizardFiles={setWizardFiles}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleCompleteUpload={handleCompleteUpload}
        />
      )}

      {activeModal === "view" && selectedSessionForAction && (
        <ViewSessionModal
          session={selectedSessionForAction}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "delete" && selectedSessionForAction && (
        <DeleteSessionModal
          session={selectedSessionForAction}
          onClose={() => setActiveModal(null)}
          onDelete={handleDelete}
        />
      )}

      {activeModal === "providers" && (
        <SelectProvidersModal
          onClose={() => setActiveModal("upload")}
          wizardProviderSearch={wizardProviderSearch}
          setWizardProviderSearch={setWizardProviderSearch}
          ALL_PROVIDERS={ALL_PROVIDERS}
          wizardProviders={wizardProviders}
          setWizardProviders={setWizardProviders}
        />
      )}

      {viewMode === "grid" && (
        <GridMassActions
          selectedCount={selectedMediaItems.length}
          totalCount={paginatedSessions.flatMap(s => s.items).length}
          onSelectAll={() => {
            const allItemIds = paginatedSessions.flatMap(s => s.items).map(i => i.id);
            if (selectedMediaItems.length === allItemIds.length) {
              setSelectedMediaItems([]);
            } else {
              setSelectedMediaItems(allItemIds);
            }
          }}
          onClear={() => setSelectedMediaItems([])}
          onDelete={() => {
            setSessions(prev => prev.map(s => ({
              ...s,
              items: s.items.filter(i => !selectedMediaItems.includes(i.id))
            })).filter(s => s.items.length > 0));
            setSelectedMediaItems([]);
          }}
          onUseMedia={() => alert(`Proceeding to use ${selectedMediaItems.length} specific files for publishing!`)}
        />
      )}

      <ConnectSocialMediaModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
