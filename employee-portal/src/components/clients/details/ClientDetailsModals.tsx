"use client";

import React from "react";
import EditPersonalDataModal, { PersonalData } from "@/components/clients/EditPersonalDataModal";
import EditAddressModal, { FullAddressData } from "@/components/clients/EditAddressModal";
import AllServicesBreakdownModal from "@/components/clients/AllServicesBreakdownModal";
import {
  PrintReceiptModal,
  PrintSuccessModal,
  DownloadReceiptModal,
} from "@/components/clients/details/modals/ClientReceiptModals";
import {
  AddNoteModal,
  EditNoteModal,
  ViewNoteModal,
  DeleteNoteModal,
} from "@/components/clients/details/modals/ClientNoteModals";
import {
  AddAllergyModal,
  EditAllergyModal,
  DeleteAllergyModal,
} from "@/components/clients/details/modals/ClientAllergyModals";
import ViewCommLogModal from "@/components/clients/details/modals/ViewCommLogModal";
import UploadClientMediaModal from "@/components/clients/details/modals/UploadClientMediaModal";
import { ReceiptItem } from "@/components/clients/details/tabs/ClientFinancialTab";
import { NoteItem } from "@/components/clients/details/tabs/ClientNotesTab";
import { AllergyItem } from "@/components/clients/details/tabs/ClientMedicalTab";
import { CommLogItem } from "@/components/clients/details/tabs/ClientCommunicationLogTab";

interface ClientDetailsModalsProps {
  // Personal & Address
  isEditPersonalModalOpen: boolean;
  onCloseEditPersonal: () => void;
  personalData: PersonalData;
  onSavePersonalData: (data: PersonalData) => void;

  isEditAddressModalOpen: boolean;
  onCloseEditAddress: () => void;
  fullAddress: FullAddressData;
  onSaveAddress: (data: FullAddressData) => void;

  isAllServicesModalOpen: boolean;
  onCloseAllServices: () => void;

  // Receipt
  isPrintModalOpen: boolean;
  onClosePrintModal: () => void;
  selectedReceipt: ReceiptItem | null;
  onPrint: () => void;
  isPrinting: boolean;

  isPrintSuccessModalOpen: boolean;
  onClosePrintSuccessModal: () => void;

  isDownloadModalOpen: boolean;
  onCloseDownloadModal: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;

  // Notes
  isAddNoteModalOpen: boolean;
  onCloseAddNote: () => void;
  onSaveAddNote: (data: { title: string; description: string; attachment?: File }) => void;

  isViewNoteModalOpen: boolean;
  onCloseViewNote: () => void;
  selectedNoteForView: NoteItem | null;

  isEditNoteModalOpen: boolean;
  onCloseEditNote: () => void;
  selectedNoteForEdit: NoteItem | null;
  onSaveEditNote: (updated: NoteItem) => void;

  isDeleteNoteModalOpen: boolean;
  onCloseDeleteNote: () => void;
  selectedNoteForDelete: NoteItem | null;
  onConfirmDeleteNote: () => void;

  // Allergies
  isAddAllergyModalOpen: boolean;
  onCloseAddAllergy: () => void;
  onSaveAddAllergy: (data: { title: string; description: string; severity: "High" | "Medium" | "Low" }) => void;

  isEditAllergyModalOpen: boolean;
  onCloseEditAllergy: () => void;
  selectedAllergyForEdit: AllergyItem | null;
  onSaveEditAllergy: (updated: AllergyItem) => void;

  isDeleteAllergyModalOpen: boolean;
  onCloseDeleteAllergy: () => void;
  selectedAllergyForDelete: AllergyItem | null;
  onConfirmDeleteAllergy: () => void;

  // Comm Log
  isCommLogModalOpen: boolean;
  onCloseCommLog: () => void;
  selectedCommLog: CommLogItem | null;

  // Media
  isUploadMediaModalOpen: boolean;
  onCloseUploadMedia: () => void;
  onUploadMedia: (media: { title: string; file: File | null }) => void;
}

export default function ClientDetailsModals(props: ClientDetailsModalsProps) {
  return (
    <>
      <EditPersonalDataModal
        isOpen={props.isEditPersonalModalOpen}
        onClose={props.onCloseEditPersonal}
        data={props.personalData}
        onSave={props.onSavePersonalData}
      />

      <EditAddressModal
        isOpen={props.isEditAddressModalOpen}
        onClose={props.onCloseEditAddress}
        data={props.fullAddress}
        onSave={props.onSaveAddress}
      />

      <AllServicesBreakdownModal
        isOpen={props.isAllServicesModalOpen}
        onClose={props.onCloseAllServices}
      />

      {/* Receipt Modals */}
      <PrintReceiptModal
        isOpen={props.isPrintModalOpen}
        onClose={props.onClosePrintModal}
        receipt={props.selectedReceipt}
        onPrint={props.onPrint}
        isPrinting={props.isPrinting}
      />

      <PrintSuccessModal
        isOpen={props.isPrintSuccessModalOpen}
        onClose={props.onClosePrintSuccessModal}
      />

      <DownloadReceiptModal
        isOpen={props.isDownloadModalOpen}
        onClose={props.onCloseDownloadModal}
        receipt={props.selectedReceipt}
        onDownload={props.onDownload}
        isDownloading={props.isDownloading}
        downloadSuccess={props.downloadSuccess}
      />

      {/* Note Modals */}
      <AddNoteModal
        isOpen={props.isAddNoteModalOpen}
        onClose={props.onCloseAddNote}
        onSave={props.onSaveAddNote}
      />

      <ViewNoteModal
        isOpen={props.isViewNoteModalOpen}
        onClose={props.onCloseViewNote}
        note={props.selectedNoteForView}
      />

      <EditNoteModal
        isOpen={props.isEditNoteModalOpen}
        onClose={props.onCloseEditNote}
        note={props.selectedNoteForEdit}
        onSave={props.onSaveEditNote}
      />

      <DeleteNoteModal
        isOpen={props.isDeleteNoteModalOpen}
        onClose={props.onCloseDeleteNote}
        note={props.selectedNoteForDelete}
        onConfirm={props.onConfirmDeleteNote}
      />

      {/* Allergy Modals */}
      <AddAllergyModal
        isOpen={props.isAddAllergyModalOpen}
        onClose={props.onCloseAddAllergy}
        onSave={props.onSaveAddAllergy}
      />

      <EditAllergyModal
        isOpen={props.isEditAllergyModalOpen}
        onClose={props.onCloseEditAllergy}
        allergy={props.selectedAllergyForEdit}
        onSave={props.onSaveEditAllergy}
      />

      <DeleteAllergyModal
        isOpen={props.isDeleteAllergyModalOpen}
        onClose={props.onCloseDeleteAllergy}
        allergy={props.selectedAllergyForDelete}
        onConfirm={props.onConfirmDeleteAllergy}
      />

      {/* Communication Log Modal */}
      <ViewCommLogModal
        isOpen={props.isCommLogModalOpen}
        onClose={props.onCloseCommLog}
        log={props.selectedCommLog}
      />

      {/* Upload Media Modal */}
      <UploadClientMediaModal
        isOpen={props.isUploadMediaModalOpen}
        onClose={props.onCloseUploadMedia}
        onUpload={props.onUploadMedia}
      />
    </>
  );
}
