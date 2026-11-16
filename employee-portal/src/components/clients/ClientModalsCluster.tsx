"use client";

import React from "react";
import AddClientModal from "@/components/clients/AddClientModal";
import EditClientModal from "@/components/clients/EditClientModal";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import DeleteClientModal from "@/components/clients/DeleteClientModal";
import MassDeleteClientModal from "@/components/clients/MassDeleteClientModal";
import DownloadDetailsModal from "@/components/clients/DownloadDetailsModal";
import AddAllergyModal from "@/components/clients/AddAllergyModal";

interface ClientModalsClusterProps {
  isAddOpen: boolean;
  onCloseAdd: () => void;

  isEditOpen: boolean;
  onCloseEdit: () => void;
  selectedClient: any;

  isExportOpen: boolean;
  onCloseExport: () => void;

  isDeleteOpen: boolean;
  onCloseDelete: () => void;
  onConfirmSingleDelete: (clientId: string) => void;

  isMassDeleteOpen: boolean;
  onCloseMassDelete: () => void;
  selectedCount: number;
  onConfirmMassDelete: () => void;

  isDownloadOpen: boolean;
  onCloseDownload: () => void;

  isAddAllergieOpen: boolean;
  onCloseAddAllergy: () => void;
}

export default function ClientModalsCluster({
  isAddOpen,
  onCloseAdd,
  isEditOpen,
  onCloseEdit,
  selectedClient,
  isExportOpen,
  onCloseExport,
  isDeleteOpen,
  onCloseDelete,
  onConfirmSingleDelete,
  isMassDeleteOpen,
  onCloseMassDelete,
  selectedCount,
  onConfirmMassDelete,
  isDownloadOpen,
  onCloseDownload,
  isAddAllergieOpen,
  onCloseAddAllergy,
}: ClientModalsClusterProps) {
  return (
    <>
      <AddClientModal isOpen={isAddOpen} onClose={onCloseAdd} />

      <EditClientModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        selectedClient={selectedClient}
      />

      <CustomExportModal
        isOpen={isExportOpen}
        onClose={onCloseExport}
        title="Export Client Data"
        description="Choose the format to export your client list."
      />

      <DeleteClientModal
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        selectedClient={selectedClient}
        onConfirm={onConfirmSingleDelete}
      />

      <MassDeleteClientModal
        isOpen={isMassDeleteOpen}
        onClose={onCloseMassDelete}
        selectedCount={selectedCount}
        onConfirm={onConfirmMassDelete}
      />

      <DownloadDetailsModal
        isOpen={isDownloadOpen}
        onClose={onCloseDownload}
        selectedClient={selectedClient}
      />

      <AddAllergyModal
        isOpen={isAddAllergieOpen}
        onClose={onCloseAddAllergy}
        selectedClient={selectedClient}
      />
    </>
  );
}
