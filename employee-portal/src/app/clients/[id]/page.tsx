"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import {
  dummyClientsData,
  initialClientNotes,
  initialClientAllergies,
  mockClientMedia,
  mockClientCommLogs,
} from "@/components/clients/data";

// Profile & Modals
import ClientProfileCard from "@/components/clients/details/ClientProfileCard";
import ClientDetailsModals from "@/components/clients/details/ClientDetailsModals";

// Modular Tabs
import ClientBasicDataTab from "@/components/clients/details/tabs/ClientBasicDataTab";
import ClientAppointmentsTab from "@/components/clients/details/tabs/ClientAppointmentsTab";
import ClientFinancialTab, { ReceiptItem } from "@/components/clients/details/tabs/ClientFinancialTab";
import ClientNotesTab, { NoteItem, MediaItem } from "@/components/clients/details/tabs/ClientNotesTab";
import ClientMedicalTab, { AllergyItem } from "@/components/clients/details/tabs/ClientMedicalTab";
import ClientCommunicationLogTab, { CommLogItem } from "@/components/clients/details/tabs/ClientCommunicationLogTab";
import { PersonalData } from "@/components/clients/EditPersonalDataModal";
import { FullAddressData } from "@/components/clients/EditAddressModal";

export default function ClientDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const client = dummyClientsData.find((c) => c.id === id) || dummyClientsData[0];

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Appointments");

  // Calculations for Financial summary
  const totalSpentNum = (parseInt(client.id.replace(/\D/g, "")) || 1) * 1158.42;
  const avgSpentNum = totalSpentNum / ((parseInt(client.id.replace(/\D/g, "")) || 1) * 3 + 2);
  const formattedTotalSpent = "€ " + Math.round(totalSpentNum).toLocaleString("en-US");
  const formattedAvgSpent = "€ " + Math.round(avgSpentNum).toLocaleString("en-US");

  // Basic Data Tab State
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
  const [isMarketingConsent, setIsMarketingConsent] = useState(true);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);

  // Financial Tab Modals
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintSuccessModalOpen, setIsPrintSuccessModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  // Notes Tab State
  const [notes, setNotes] = useState<NoteItem[]>(initialClientNotes as NoteItem[]);
  const [mediaList, setMediaList] = useState<MediaItem[]>(mockClientMedia as MediaItem[]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState<NoteItem | null>(null);
  const [isViewNoteModalOpen, setIsViewNoteModalOpen] = useState(false);
  const [selectedNoteForView, setSelectedNoteForView] = useState<NoteItem | null>(null);
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [selectedNoteForDelete, setSelectedNoteForDelete] = useState<NoteItem | null>(null);
  const [isUploadMediaModalOpen, setIsUploadMediaModalOpen] = useState(false);

  const handleAddNote = (newNoteData: { title: string; description: string; attachment?: File }) => {
    const newNote: NoteItem = {
      id: String(Date.now()),
      title: newNoteData.title,
      description: newNoteData.description,
      attachmentsCount: newNoteData.attachment ? 1 : 0,
      attachmentName: newNoteData.attachment?.name,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
    setNotes([newNote, ...notes]);
  };

  const handleSaveEditNote = (updated: NoteItem) => {
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    setIsEditNoteModalOpen(false);
  };

  const handleDeleteNoteConfirm = () => {
    if (selectedNoteForDelete) {
      setNotes(notes.filter((n) => n.id !== selectedNoteForDelete.id));
      setIsDeleteNoteModalOpen(false);
      setSelectedNoteForDelete(null);
    }
  };

  // Medical / Allergies Tab State
  const [allergies, setAllergies] = useState<AllergyItem[]>(initialClientAllergies as AllergyItem[]);
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);
  const [isEditAllergyModalOpen, setIsEditAllergyModalOpen] = useState(false);
  const [selectedAllergyForEdit, setSelectedAllergyForEdit] = useState<AllergyItem | null>(null);
  const [isDeleteAllergyModalOpen, setIsDeleteAllergyModalOpen] = useState(false);
  const [selectedAllergyForDelete, setSelectedAllergyForDelete] = useState<AllergyItem | null>(null);

  const handleAddAllergy = (newAllergy: { title: string; description: string; severity: "High" | "Medium" | "Low" }) => {
    const item: AllergyItem = {
      id: String(Date.now()),
      ...newAllergy,
    };
    setAllergies([...allergies, item]);
  };

  const handleSaveEditAllergy = (updated: AllergyItem) => {
    setAllergies(allergies.map((a) => (a.id === updated.id ? updated : a)));
    setIsEditAllergyModalOpen(false);
    setSelectedAllergyForEdit(null);
  };

  const handleDeleteAllergyConfirm = () => {
    if (selectedAllergyForDelete) {
      setAllergies(allergies.filter((a) => a.id !== selectedAllergyForDelete.id));
      setIsDeleteAllergyModalOpen(false);
      setSelectedAllergyForDelete(null);
    }
  };

  // Communication Log Tab State
  const [commLogs] = useState<CommLogItem[]>(mockClientCommLogs as CommLogItem[]);
  const [isCommLogModalOpen, setIsCommLogModalOpen] = useState(false);
  const [selectedCommLog, setSelectedCommLog] = useState<CommLogItem | null>(null);

  return (
    <div className="w-full space-y-6 font-manrope">
      {/* Top Navigation */}
      <CustomSubPageHeader
        title={client.name}
        backUrl="/clients"
        breadcrumbText="Clients"
      />

      {/* Profile Header Card */}
      <ClientProfileCard
        client={client}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Active Tab Content */}
      {activeTab === "Basic Data" && (
        <ClientBasicDataTab
          personalData={personalData}
          fullAddress={fullAddress}
          onEditPersonal={() => setIsEditPersonalModalOpen(true)}
          onEditAddress={() => setIsEditAddressModalOpen(true)}
          isMarketingConsent={isMarketingConsent}
          onToggleMarketingConsent={() => setIsMarketingConsent(!isMarketingConsent)}
          currentHistoryPage={currentHistoryPage}
          onHistoryPageChange={setCurrentHistoryPage}
        />
      )}

      {activeTab === "Appointments" && (
        <ClientAppointmentsTab client={client} />
      )}

      {activeTab === "Financial Information" && (
        <ClientFinancialTab
          formattedTotalSpent={formattedTotalSpent}
          formattedAvgSpent={formattedAvgSpent}
          clientId={id}
          onShowAllServices={() => setIsAllServicesModalOpen(true)}
          onPrintReceipt={(receipt) => {
            setSelectedReceipt(receipt);
            setIsPrintModalOpen(true);
          }}
          onDownloadReceipt={(receipt) => {
            setSelectedReceipt(receipt);
            setIsDownloadModalOpen(true);
          }}
        />
      )}

      {activeTab === "Notes & Attachments" && (
        <ClientNotesTab
          notes={notes}
          mediaList={mediaList}
          onAddNote={() => setIsAddNoteModalOpen(true)}
          onViewNote={(note) => {
            setSelectedNoteForView(note);
            setIsViewNoteModalOpen(true);
          }}
          onEditNote={(note) => {
            setSelectedNoteForEdit(note);
            setIsEditNoteModalOpen(true);
          }}
          onDeleteNote={(note) => {
            setSelectedNoteForDelete(note);
            setIsDeleteNoteModalOpen(true);
          }}
          onUploadMedia={() => setIsUploadMediaModalOpen(true)}
        />
      )}

      {activeTab === "Medical" && (
        <ClientMedicalTab
          allergies={allergies}
          onAddAllergy={() => setIsAddAllergyModalOpen(true)}
          onEditAllergy={(allergy) => {
            setSelectedAllergyForEdit(allergy);
            setIsEditAllergyModalOpen(true);
          }}
          onDeleteAllergy={(allergy) => {
            setSelectedAllergyForDelete(allergy);
            setIsDeleteAllergyModalOpen(true);
          }}
        />
      )}

      {activeTab === "Communication Log" && (
        <ClientCommunicationLogTab
          logs={commLogs}
          onViewLog={(log) => {
            setSelectedCommLog(log);
            setIsCommLogModalOpen(true);
          }}
        />
      )}

      {/* Global Modals Cluster */}
      <ClientDetailsModals
        isEditPersonalModalOpen={isEditPersonalModalOpen}
        onCloseEditPersonal={() => setIsEditPersonalModalOpen(false)}
        personalData={personalData}
        onSavePersonalData={setPersonalData}
        isEditAddressModalOpen={isEditAddressModalOpen}
        onCloseEditAddress={() => setIsEditAddressModalOpen(false)}
        fullAddress={fullAddress}
        onSaveAddress={setFullAddress}
        isAllServicesModalOpen={isAllServicesModalOpen}
        onCloseAllServices={() => setIsAllServicesModalOpen(false)}
        isPrintModalOpen={isPrintModalOpen}
        onClosePrintModal={() => setIsPrintModalOpen(false)}
        selectedReceipt={selectedReceipt}
        onPrint={handlePrint}
        isPrinting={isPrinting}
        isPrintSuccessModalOpen={isPrintSuccessModalOpen}
        onClosePrintSuccessModal={() => setIsPrintSuccessModalOpen(false)}
        isDownloadModalOpen={isDownloadModalOpen}
        onCloseDownloadModal={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        downloadSuccess={downloadSuccess}
        isAddNoteModalOpen={isAddNoteModalOpen}
        onCloseAddNote={() => setIsAddNoteModalOpen(false)}
        onSaveAddNote={handleAddNote}
        isViewNoteModalOpen={isViewNoteModalOpen}
        onCloseViewNote={() => setIsViewNoteModalOpen(false)}
        selectedNoteForView={selectedNoteForView}
        isEditNoteModalOpen={isEditNoteModalOpen}
        onCloseEditNote={() => setIsEditNoteModalOpen(false)}
        selectedNoteForEdit={selectedNoteForEdit}
        onSaveEditNote={handleSaveEditNote}
        isDeleteNoteModalOpen={isDeleteNoteModalOpen}
        onCloseDeleteNote={() => setIsDeleteNoteModalOpen(false)}
        selectedNoteForDelete={selectedNoteForDelete}
        onConfirmDeleteNote={handleDeleteNoteConfirm}
        isAddAllergyModalOpen={isAddAllergyModalOpen}
        onCloseAddAllergy={() => setIsAddAllergyModalOpen(false)}
        onSaveAddAllergy={handleAddAllergy}
        isEditAllergyModalOpen={isEditAllergyModalOpen}
        onCloseEditAllergy={() => setIsEditAllergyModalOpen(false)}
        selectedAllergyForEdit={selectedAllergyForEdit}
        onSaveEditAllergy={handleSaveEditAllergy}
        isDeleteAllergyModalOpen={isDeleteAllergyModalOpen}
        onCloseDeleteAllergy={() => setIsDeleteAllergyModalOpen(false)}
        selectedAllergyForDelete={selectedAllergyForDelete}
        onConfirmDeleteAllergy={handleDeleteAllergyConfirm}
        isCommLogModalOpen={isCommLogModalOpen}
        onCloseCommLog={() => setIsCommLogModalOpen(false)}
        selectedCommLog={selectedCommLog}
        isUploadMediaModalOpen={isUploadMediaModalOpen}
        onCloseUploadMedia={() => setIsUploadMediaModalOpen(false)}
        onUploadMedia={(media) => {
          if (media.title) {
            setMediaList([
              {
                id: String(Date.now()),
                fileName: media.title,
                date: new Date().toLocaleDateString("en-US"),
                type: "Photo",
                url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
              },
              ...mediaList,
            ]);
          }
        }}
      />
    </div>
  );
}
