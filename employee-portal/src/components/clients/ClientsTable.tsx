import React from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2, ShieldAlert } from "lucide-react";
import { ClientsTableProps } from "./types";

export default function ClientsTable({
  paginatedData,
  selectedClients,
  openDropdownId,
  toggleSelectAll,
  toggleSelectClient,
  setOpenDropdownId,
  onEditClient,
  onDeleteClient,
  onAddAllergy,
  onMassDelete,
}: ClientsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[30%]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors shrink-0 ${
                      selectedClients.length === paginatedData.length &&
                      paginatedData.length > 0
                        ? "bg-[#635BFF] border-[#635BFF] text-white"
                        : selectedClients.length > 0
                          ? "bg-[#F43F5E] border-[#F43F5E] text-white"
                          : "bg-white border-[#CBD5E1]"
                    }`}
                  >
                    {selectedClients.length === paginatedData.length &&
                    paginatedData.length > 0 ? (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : selectedClients.length > 0 ? (
                      <svg
                        width="10"
                        height="2"
                        viewBox="0 0 10 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                  {selectedClients.length > 0 ? (
                    <span
                      className={
                        selectedClients.length === paginatedData.length
                          ? "text-[#635BFF]"
                          : "text-[#F43F5E]"
                      }
                    >
                      {selectedClients.length === paginatedData.length
                        ? "Unselect All Clients"
                        : "Select All Clients"}
                    </span>
                  ) : (
                    <span>Name</span>
                  )}
                </div>
              </div>
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[20%]">
              Telephone
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[20%]">
              Last Appointment
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[15%]">
              Allergies
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[10%]">
              Created at
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope text-center w-[5%]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((client) => (
            <tr
              key={client.id}
              className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group"
            >
              <td className="px-6 py-4 border-r border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelectClient(client.id)}
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors shrink-0 ${
                      selectedClients.includes(client.id)
                        ? "bg-[#635BFF] border-[#635BFF] text-white"
                        : "bg-white border-[#CBD5E1]"
                    }`}
                  >
                    {selectedClients.includes(client.id) && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${client.avatarBg}`}
                  >
                    <img
                      src={client.avatarUrl}
                      alt={client.name}
                      className="w-8 h-8 object-cover mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1E293B]">
                      {client.name}
                    </div>
                    <div className="text-[12px] text-[#94A3B8] font-medium mt-0.5">
                      {client.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0]">
                <span className="text-[13px] font-semibold text-[#64748B]">
                  {client.telephone}
                </span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0]">
                <span className="text-[13px] font-semibold text-[#64748B]">
                  {client.lastAppointment}
                </span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0]">
                <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FEF9C3] text-[#D97706]">
                  Fragrances Allergie
                </span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0]">
                <span className="text-[13px] font-semibold text-[#64748B]">
                  {client.createdAt}
                </span>
              </td>
              <td className="px-6 py-4 text-center relative">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === client.id ? null : client.id,
                      )
                    }
                    className="text-[#64748B] hover:text-[#1E293B] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9]"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openDropdownId === client.id && (
                    <div className="absolute right-8 top-10 w-40 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-2 z-10 flex flex-col items-start">
                      <Link
                        href={`/clients/${client.id}`}
                        className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#635BFF] transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4 text-[#635BFF]" /> View Details
                      </Link>
                      <button className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#10B981] transition-colors flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#10B981]"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="4"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        Book now
                      </button>
                      <button
                        onClick={() => {
                          onEditClient(client);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0EA5E9] transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4 text-[#0EA5E9]" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          onDeleteClient(client);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#F43F5E] transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-[#F43F5E]" /> Delete
                      </button>
                      <button
                        onClick={() => {
                          onAddAllergy(client);
                          setOpenDropdownId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#FBBF24] transition-colors flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-[#FBBF24]" /> Add
                        Allergie
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
