"use client";

import React, { useState, useEffect } from "react";
import { Camera, Calendar, Hash, FileText, Wallet, Plus } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import ClientDetailsSkeleton from "@/components/clients/ClientDetailsSkeleton";
import {
  dummyClientsData,
  DEFAULT_CLIENT_TAGS,
  initialClientNotes,
  ClientNote,
} from "@/components/clients/data";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import EditPersonalDataModal, {
  PersonalData,
} from "@/components/clients/EditPersonalDataModal";
import EditAddressModal, {
  FullAddressData,
} from "@/components/clients/EditAddressModal";
import AllServicesBreakdownModal from "@/components/clients/AllServicesBreakdownModal";
import UpdateClientAvatarModal from "@/components/clients/UpdateClientAvatarModal";
import ManageClientTagsModal from "@/components/clients/ManageClientTagsModal";

// 6 Tab Components
import {
  ClientBasicDataTab,
  ClientAppointmentsTab,
  ClientFinancialTab,
  ClientNotesTab,
  ClientMedicalTab,
  ClientCommunicationLogTab,
} from "@/components/clients/tabs";

// 10 Modal Components
import {
  ReceiptPrintModal,
  ReceiptPrintSuccessModal,
  ReceiptDownloadModal,
  AddNoteModal,
  ViewNoteModal,
  EditNoteModal,
  DeleteNoteModal,
  UploadMediaModal,
  CommunicationLogDetailModal,
  AddAllergyModal,
} from "@/components/clients/modals";

export default function ClientDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const client =
    dummyClientsData.find((c) => c.id === id) || dummyClientsData[0];

  const totalSpentNum = (parseInt(client.id.replace(/\D/g, "")) || 1) * 1158.42;

  const formattedTotalSpent =
    "€ " + Math.round(totalSpentNum).toLocaleString("en-US");

  const searchParams = useSearchParams();
  const [avatarUrl, setAvatarUrl] = useState(client.avatarUrl);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [clientTags, setClientTags] = useState<string[]>(DEFAULT_CLIENT_TAGS);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "Basic Data",
  );

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Basic Data State & Modals
  const [personalData, setPersonalData] = useState<PersonalData>({
    dob: "November 7, 1992",
    age: "33 years old",
    gender: "Female",
    telephone: client.telephone || "+39 345 678 9123",
    email: client.email || "maria@beautywellness.com",
  });
  const [fullAddress, setFullAddress] = useState<FullAddressData>({
    address: "Independance Street 54/r",
    city: "Bologna",
    province: "Bologna (BO)",
    cap: "40129",
  });
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [isMarketingConsent, setIsMarketingConsent] = useState(true);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);

  // Financial Receipt Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isPrintSuccessModalOpen, setIsPrintSuccessModalOpen] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setIsPrintModalOpen(false);
      setIsPrintSuccessModalOpen(true);
    }, 1500);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        setIsDownloadModalOpen(false);
      }, 1500);
    }, 1500);
  };

  // Notes State & Modals
  const [notes, setNotes] = useState<ClientNote[]>(initialClientNotes);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteDescription, setNewNoteDescription] = useState("");

  const [isViewNoteModalOpen, setIsViewNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClientNote | null>(null);

  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [selectedNoteForEdit, setSelectedNoteForEdit] =
    useState<ClientNote | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteDescription, setEditNoteDescription] = useState("");

  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [selectedNoteForDelete, setSelectedNoteForDelete] =
    useState<ClientNote | null>(null);

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) return;
    const newNote: ClientNote = {
      id: String(Date.now()),
      title: newNoteTitle.trim(),
      description: newNoteDescription.trim() || "No description provided.",
      attachmentsCount: 0,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
    setNotes([newNote, ...notes]);
    setNewNoteTitle("");
    setNewNoteDescription("");
    setIsAddNoteModalOpen(false);
  };

  const handleOpenEditNote = (note: ClientNote) => {
    setSelectedNoteForEdit(note);
    setEditNoteTitle(note.title);
    setEditNoteDescription(note.description);
    setIsEditNoteModalOpen(true);
  };

  const handleSaveEditNote = () => {
    if (!selectedNoteForEdit || !editNoteTitle.trim()) return;
    setNotes(
      notes.map((n) =>
        n.id === selectedNoteForEdit.id
          ? {
              ...n,
              title: editNoteTitle.trim(),
              description: editNoteDescription.trim(),
            }
          : n,
      ),
    );
    setIsEditNoteModalOpen(false);
    setSelectedNoteForEdit(null);
  };

  const handleOpenDeleteNote = (note: ClientNote) => {
    setSelectedNoteForDelete(note);
    setIsDeleteNoteModalOpen(true);
  };

  const handleConfirmDeleteNote = () => {
    if (!selectedNoteForDelete) return;
    setNotes(notes.filter((n) => n.id !== selectedNoteForDelete.id));
    setIsDeleteNoteModalOpen(false);
    setSelectedNoteForDelete(null);
  };

  // Upload Media Modal
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);

  // Medical Modal
  const [isAddAllergieModalOpen, setIsAddAllergieModalOpen] = useState(false);

  // Communication Log Modal
  const [isCommLogModalOpen, setIsCommLogModalOpen] = useState(false);
  const [selectedCommLog, setSelectedCommLog] = useState<any>(null);

  // Skeleton loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ClientDetailsSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      <CustomSubPageHeader
        title={client.name}
        backUrl="/dashboard/clients"
        breadcrumbText="Clients"
      />

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Banner Section */}
        <div className="w-full h-48 sm:h-56 relative bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe] overflow-hidden">
          {/* Abstract background shapes */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-multiply"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#a5b4fc"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,186.7C384,160,480,96,576,90.7C672,85,768,139,864,165.3C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#818cf8"
              fillOpacity="1"
              d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,250.7C672,277,768,267,864,240C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="p-8 relative flex flex-col md:flex-row items-center justify-between gap-8 pt-20 md:pt-8">
          {/* Center Avatar (Absolute positioning to overlap banner) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative group">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm ${client.avatarBg}`}
              >
                <img
                  src={avatarUrl}
                  alt={client.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover mix-blend-multiply"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                title="Change Profile Picture"
                aria-label="Change Profile Picture"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-[#524be0] transition-all cursor-pointer z-10"
                style={{ backgroundColor: "#635BFF", color: "#ffffff" }}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Left Stats */}
          <div className="flex gap-8 w-full md:w-1/3 justify-center md:justify-start">
            <div className="flex flex-col items-center justify-center space-y-1">
              <Calendar className="w-5 h-5 text-[#64748B] mb-1" />
              <span className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
                Aug 8, 2024
              </span>
              <span className="text-[12px] font-medium text-[#94A3B8]">
                Created At
              </span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <Hash className="w-5 h-5 text-[#64748B] mb-1" />
              <span className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
                000000
              </span>
              <span className="text-[12px] font-medium text-[#94A3B8]">
                Client ID
              </span>
            </div>
          </div>

          {/* Center Info Details */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 mt-4 md:mt-12">
            <h2 className="text-[1.15rem] font-bold text-[#1E293B] font-manrope leading-tight">
              {client.name}
            </h2>
            <p className="text-[13px] font-medium text-[#94A3B8] mt-1 mb-3">
              Bologna, Italy
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {clientTags.map((tag) => {
                let tagStyle =
                  "bg-[#EEF2FF] text-[#635BFF] border border-[#635BFF]/20";
                if (tag === "VIP") tagStyle = "bg-[#14B8A6] text-white";
                else if (tag === "New Client")
                  tagStyle = "border border-[#10B981] text-[#10B981]";
                else if (tag === "Frequent Canceler")
                  tagStyle = "border border-[#F43F5E] text-[#F43F5E]";

                return (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${tagStyle}`}
                  >
                    {tag}
                  </span>
                );
              })}
              <button
                type="button"
                onClick={() => setIsTagModalOpen(true)}
                title="Manage Tags"
                className="text-[11px] font-bold px-3 py-1 rounded-full border border-[#635BFF] text-[#635BFF] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                style={{
                  color: "#635BFF",
                  backgroundColor: "#EEF2FF",
                  borderColor: "#635BFF",
                }}
              >
                <Plus className="w-3.5 h-3.5 text-[#635BFF]" />
                <span className="text-[#635BFF]">Tags</span>
              </button>
            </div>
          </div>

          {/* Right Button */}
          <div className="flex justify-center md:justify-end w-full md:w-1/3 mt-4 md:mt-0 md:pt-12">
            <button
              type="button"
              className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm shadow-[#635BFF]/20 cursor-pointer"
              style={{ backgroundColor: "#635BFF", color: "#ffffff" }}
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="w-full bg-[#EEF2FF] flex items-center justify-start md:justify-center px-4 overflow-x-auto border-t border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab("Basic Data")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Basic Data" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            Basic Data
          </button>
          <button
            onClick={() => setActiveTab("Appointments")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Appointments" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("Financial Information")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Financial Information" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <Wallet className="w-4 h-4 shrink-0" />
            Financial Information
          </button>
          <button
            onClick={() => setActiveTab("Notes & Attachments")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Notes & Attachments" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            Notes & Attachments
          </button>
          <button
            onClick={() => setActiveTab("Medical")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Medical" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5 9.04 7.96a2.1 2.1 0 0 0 0 2.97l2.46 2.47a2.1 2.1 0 0 0 2.97 0l2.46-2.47a2.1 2.1 0 0 0 0-2.97L12 5Z" />
            </svg>
            Medical
          </button>
          <button
            onClick={() => setActiveTab("Communication Log")}
            className={`flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-[13px] font-bold transition-all border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${activeTab === "Communication Log" ? "border-[#635BFF] text-[#635BFF]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            Communication Log
          </button>
        </div>
      </div>

      {/* 6 Tab Contents */}
      {activeTab === "Basic Data" && (
        <ClientBasicDataTab
          personalData={personalData}
          fullAddress={fullAddress}
          onEditPersonal={() => setIsEditPersonalModalOpen(true)}
          onEditAddress={() => setIsEditAddressModalOpen(true)}
          isMarketingConsent={isMarketingConsent}
          setIsMarketingConsent={setIsMarketingConsent}
          currentHistoryPage={currentHistoryPage}
          setCurrentHistoryPage={setCurrentHistoryPage}
        />
      )}

      {activeTab === "Appointments" && (
        <ClientAppointmentsTab clientName={client.name} />
      )}

      {activeTab === "Financial Information" && (
        <ClientFinancialTab
          clientId={id}
          formattedTotalSpent={formattedTotalSpent}
          onOpenPrintModal={(receipt) => {
            setSelectedReceipt(receipt);
            setIsPrintModalOpen(true);
          }}
          onOpenDownloadModal={(receipt) => {
            setSelectedReceipt(receipt);
            setIsDownloadModalOpen(true);
          }}
          onOpenAllServicesModal={() => setIsAllServicesModalOpen(true)}
        />
      )}

      {activeTab === "Notes & Attachments" && (
        <ClientNotesTab
          notes={notes}
          onOpenAddNote={() => setIsAddNoteModalOpen(true)}
          onOpenViewNote={(note) => {
            setSelectedNote(note);
            setIsViewNoteModalOpen(true);
          }}
          onOpenEditNote={handleOpenEditNote}
          onOpenDeleteNote={handleOpenDeleteNote}
          onOpenUploadMedia={() => setIsUploadMediaModalOpen(true)}
        />
      )}

      {activeTab === "Medical" && (
        <ClientMedicalTab
          onOpenAddAllergy={() => setIsAddAllergieModalOpen(true)}
        />
      )}

      {activeTab === "Communication Log" && (
        <ClientCommunicationLogTab
          onOpenCommLogDetail={(log) => {
            setSelectedCommLog(log);
            setIsCommLogModalOpen(true);
          }}
        />
      )}

      {/* 10 Separate Modals */}
      {/* Receipt Print Modal */}
      <ReceiptPrintModal
        isOpen={isPrintModalOpen}
        selectedReceipt={selectedReceipt}
        isPrinting={isPrinting}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handlePrint}
      />

      {/* Receipt Print Success Modal */}
      <ReceiptPrintSuccessModal
        isOpen={isPrintSuccessModalOpen}
        onClose={() => setIsPrintSuccessModalOpen(false)}
      />

      {/* Receipt Download Modal */}
      <ReceiptDownloadModal
        isOpen={isDownloadModalOpen}
        selectedReceipt={selectedReceipt}
        isDownloading={isDownloading}
        downloadSuccess={downloadSuccess}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        newNoteTitle={newNoteTitle}
        setNewNoteTitle={setNewNoteTitle}
        newNoteDescription={newNoteDescription}
        setNewNoteDescription={setNewNoteDescription}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSave={handleAddNote}
      />

      {/* View Note Modal */}
      <ViewNoteModal
        isOpen={isViewNoteModalOpen}
        selectedNote={selectedNote}
        onClose={() => setIsViewNoteModalOpen(false)}
      />

      {/* Edit Note Modal */}
      <EditNoteModal
        isOpen={isEditNoteModalOpen}
        selectedNoteForEdit={selectedNoteForEdit}
        editNoteTitle={editNoteTitle}
        setEditNoteTitle={setEditNoteTitle}
        editNoteDescription={editNoteDescription}
        setEditNoteDescription={setEditNoteDescription}
        onClose={() => {
          setIsEditNoteModalOpen(false);
          setSelectedNoteForEdit(null);
        }}
        onSave={handleSaveEditNote}
      />

      {/* Delete Note Confirmation Modal */}
      <DeleteNoteModal
        isOpen={isDeleteNoteModalOpen}
        selectedNoteForDelete={selectedNoteForDelete}
        onClose={() => {
          setIsDeleteNoteModalOpen(false);
          setSelectedNoteForDelete(null);
        }}
        onConfirmDelete={handleConfirmDeleteNote}
      />

      {/* Upload Media Modal */}
      <UploadMediaModal
        isOpen={isUploadMediaModalOpen}
        onClose={() => setIsUploadMediaModalOpen(false)}
      />

      {/* Communication Log Detail Modal */}
      <CommunicationLogDetailModal
        isOpen={isCommLogModalOpen}
        selectedCommLog={selectedCommLog}
        onClose={() => setIsCommLogModalOpen(false)}
      />

      {/* Add Allergy Modal */}
      <AddAllergyModal
        isOpen={isAddAllergieModalOpen}
        onClose={() => setIsAddAllergieModalOpen(false)}
      />

      {/* Edit Personal Data Modal */}
      <EditPersonalDataModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => setIsEditPersonalModalOpen(false)}
        data={personalData}
        onSave={(updated) => setPersonalData(updated)}
      />

      {/* Edit Full Address Modal */}
      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        data={fullAddress}
        onSave={(updated) => setFullAddress(updated)}
      />

      {/* All Services Breakdown Modal */}
      <AllServicesBreakdownModal
        isOpen={isAllServicesModalOpen}
        onClose={() => setIsAllServicesModalOpen(false)}
      />

      {/* Update Client Avatar Modal */}
      <UpdateClientAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={avatarUrl}
        onSave={(newUrl) => setAvatarUrl(newUrl)}
      />

      {/* Manage Client Tags Modal */}
      <ManageClientTagsModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tags={clientTags}
        onSave={(newTags) => setClientTags(newTags)}
      />
    </div>
  );
}
