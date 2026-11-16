"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { dummyClientsData } from "@/components/clients/data";
import ClientsTable from "@/components/clients/ClientsTable";
import AddClientModal from "@/components/clients/AddClientModal";
import EditClientModal from "@/components/clients/EditClientModal";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import DeleteClientModal from "@/components/clients/DeleteClientModal";
import DownloadDetailsModal from "@/components/clients/DownloadDetailsModal";
import AddAllergyModal from "@/components/clients/AddAllergyModal";
import Pagination from "@/components/saloonOwner/customComponent/Pagination";

export default function ClientsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddAllergieOpen, setIsAddAllergieOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredData = dummyClientsData.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleSelectAll = () => {
    if (selectedClients.length === paginatedData.length) {
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

  const headerAction = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
      <div className="w-full sm:w-56">
        <CustomSearch
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search client..."
        />
      </div>
      <Link
        href="/dashboard/clients/import"
        className="w-full sm:w-auto justify-center bg-white border-2 border-[#E0E7FF] hover:bg-[#F8F9FE] text-[#635BFF] px-4 py-1.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors shrink-0"
      >
        Import Clients
      </Link>
      <button
        onClick={() => setIsExportOpen(true)}
        className="w-full sm:w-auto justify-center bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors shrink-0"
      >
        <Download className="w-4 h-4" />
        Export Data
      </button>
      <button
        onClick={() => setIsAddOpen(true)}
        className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors shadow-sm shadow-[#635BFF]/20 shrink-0"
      >
        <Plus className="w-4 h-4" />
        Add Client
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <CustomPageHeader title="Clients" action={headerAction} />

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
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

      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <EditClientModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        selectedClient={selectedClient}
      />

      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Client Data"
        description="Choose the format to export your client list."
      />

      <DeleteClientModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedClient={selectedClient}
      />

      <DownloadDetailsModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        selectedClient={selectedClient}
      />

      <AddAllergyModal
        isOpen={isAddAllergieOpen}
        onClose={() => setIsAddAllergieOpen(false)}
        selectedClient={selectedClient}
      />
    </div>
  );
}
