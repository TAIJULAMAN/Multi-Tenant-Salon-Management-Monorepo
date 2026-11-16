"use client";

import React, { useState } from "react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { dummyClientsData } from "@/components/clients/data";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientHeaderActions from "@/components/clients/ClientHeaderActions";
import ClientModalsCluster from "@/components/clients/ClientModalsCluster";
import Pagination from "@/components/customComponent/Pagination";

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [clients, setClients] = useState(dummyClientsData);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMassDeleteOpen, setIsMassDeleteOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddAllergieOpen, setIsAddAllergieOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredData = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelectAll = () => {
    if (
      selectedClients.length === paginatedData.length &&
      paginatedData.length > 0
    ) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedData.map((c) => c.id));
    }
  };

  const toggleSelectClient = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter((clientId) => clientId !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const handleConfirmSingleDelete = (clientId: string) => {
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    setSelectedClients((prev) => prev.filter((id) => id !== clientId));
    setIsDeleteOpen(false);
    setSelectedClient(null);

    const remainingFiltered = updated.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const newTotalPages = Math.ceil(remainingFiltered.length / itemsPerPage);
    if (currentPage > Math.max(1, newTotalPages)) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const handleConfirmMassDelete = () => {
    const updated = clients.filter((c) => !selectedClients.includes(c.id));
    setClients(updated);
    setSelectedClients([]);
    setIsMassDeleteOpen(false);

    const remainingFiltered = updated.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const newTotalPages = Math.ceil(remainingFiltered.length / itemsPerPage);
    if (currentPage > Math.max(1, newTotalPages)) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  return (
    <div className="w-full space-y-6 font-manrope">
      <CustomPageHeader
        title="Clients"
        action={
          <ClientHeaderActions
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            selectedCount={selectedClients.length}
            onMassDeleteClick={() => setIsMassDeleteOpen(true)}
            onAddClientClick={() => setIsAddOpen(true)}
          />
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <ClientsTable
          paginatedData={paginatedData}
          selectedClients={selectedClients}
          openDropdownId={openDropdownId}
          toggleSelectAll={toggleSelectAll}
          toggleSelectClient={toggleSelectClient}
          setOpenDropdownId={setOpenDropdownId}
          onEditClient={(client) => {
            setSelectedClient(client);
            setIsEditOpen(true);
          }}
          onDeleteClient={(client) => {
            setSelectedClient(client);
            setIsDeleteOpen(true);
          }}
          onAddAllergy={(client) => {
            setSelectedClient(client);
            setIsAddAllergieOpen(true);
          }}
        />

        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            itemsName="clients"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ClientModalsCluster
        isAddOpen={isAddOpen}
        onCloseAdd={() => setIsAddOpen(false)}
        isEditOpen={isEditOpen}
        onCloseEdit={() => setIsEditOpen(false)}
        selectedClient={selectedClient}
        isExportOpen={isExportOpen}
        onCloseExport={() => setIsExportOpen(false)}
        isDeleteOpen={isDeleteOpen}
        onCloseDelete={() => setIsDeleteOpen(false)}
        onConfirmSingleDelete={handleConfirmSingleDelete}
        isMassDeleteOpen={isMassDeleteOpen}
        onCloseMassDelete={() => setIsMassDeleteOpen(false)}
        selectedCount={selectedClients.length}
        onConfirmMassDelete={handleConfirmMassDelete}
        isDownloadOpen={isDownloadOpen}
        onCloseDownload={() => setIsDownloadOpen(false)}
        isAddAllergieOpen={isAddAllergieOpen}
        onCloseAddAllergy={() => setIsAddAllergieOpen(false)}
      />
    </div>
  );
}
