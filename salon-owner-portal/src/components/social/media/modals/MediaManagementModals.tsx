"use client";

import React, { useState, useRef } from "react";
import ConnectSocialMediaModal from "../../ConnectSocialMediaModal";
import { UploadWizardModal } from "./UploadWizardModal";
import { SelectClientsModal } from "./SelectClientsModal";
import { SelectServicesModal } from "./SelectServicesModal";
import { SelectProvidersModal } from "./SelectProvidersModal";
import { ViewSessionModal } from "./ViewSessionModal";
import { DeleteSessionModal } from "./DeleteSessionModal";
import { MediaItem, MediaSession, ALL_CLIENTS, ALL_SERVICES, ALL_PROVIDERS } from "../data";

interface MediaManagementModalsProps {
  activeModal: "clients" | "services" | "upload" | "view" | "delete" | "providers" | null;
  onCloseModal: () => void;
  selectedSessionForAction: MediaSession | null;
  onDeleteSession: () => void;
  isConnectModalOpen: boolean;
  onCloseConnectModal: () => void;
  onSaveSession: (session: MediaSession) => void;

  // Filter client modal props
  clientSearch: string;
  setClientSearch: (val: string) => void;
  selectedClients: string[];
  toggleClient: (client: string) => void;

  // Filter service modal props
  serviceSearch: string;
  setServiceSearch: (val: string) => void;
  selectedServices: string[];
  toggleService: (service: string) => void;
}

export const MediaManagementModals: React.FC<MediaManagementModalsProps> = ({
  activeModal,
  onCloseModal,
  selectedSessionForAction,
  onDeleteSession,
  isConnectModalOpen,
  onCloseConnectModal,
  onSaveSession,
  clientSearch,
  setClientSearch,
  selectedClients,
  toggleClient,
  serviceSearch,
  setServiceSearch,
  selectedServices,
  toggleService,
}) => {
  const [uploadStep, setUploadStep] = useState(1);
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
      const newFiles = Array.from(e.target.files).map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: f.name,
        type: f.type.startsWith("video/") ? ("video" as const) : ("photo" as const),
        uploadedBy: wizardClient || "Me",
        uploadedAt: new Date().toLocaleString(),
        published: false,
        src: URL.createObjectURL(f),
      }));
      setWizardFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleCompleteUpload = () => {
    if (!wizardClient || wizardFiles.length === 0) return;

    const session: MediaSession = {
      id: selectedSessionForAction?.id || Math.random().toString(36).substr(2, 8),
      date: new Date().toLocaleDateString(),
      clientName: wizardClient,
      clientSubtext: wizardNotes || "New Session",
      services: wizardServices,
      managedBy: wizardProviders.length > 0 ? wizardProviders.join(", ") : "Current User",
      items: wizardFiles,
    };

    onSaveSession(session);
    onCloseModal();
  };

  const filteredClientList = ALL_CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredServiceList = ALL_SERVICES.filter((s) =>
    s.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <>
      {activeModal === "clients" && (
        <SelectClientsModal
          onClose={onCloseModal}
          clientSearch={clientSearch}
          setClientSearch={setClientSearch}
          filteredClientList={filteredClientList}
          selectedClients={selectedClients}
          toggleClient={toggleClient}
        />
      )}

      {activeModal === "services" && (
        <SelectServicesModal
          onClose={onCloseModal}
          serviceSearch={serviceSearch}
          setServiceSearch={setServiceSearch}
          filteredServiceList={filteredServiceList}
          selectedServices={selectedServices}
          toggleService={toggleService}
        />
      )}

      {activeModal === "upload" && (
        <UploadWizardModal
          onClose={onCloseModal}
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
          onOpenProvidersModal={() => {}}
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
          onClose={onCloseModal}
        />
      )}

      {activeModal === "delete" && selectedSessionForAction && (
        <DeleteSessionModal
          session={selectedSessionForAction}
          onClose={onCloseModal}
          onDelete={onDeleteSession}
        />
      )}

      {activeModal === "providers" && (
        <SelectProvidersModal
          onClose={onCloseModal}
          wizardProviderSearch={wizardProviderSearch}
          setWizardProviderSearch={setWizardProviderSearch}
          ALL_PROVIDERS={ALL_PROVIDERS}
          wizardProviders={wizardProviders}
          setWizardProviders={setWizardProviders}
        />
      )}

      <ConnectSocialMediaModal
        isOpen={isConnectModalOpen}
        onClose={onCloseConnectModal}
      />
    </>
  );
};
