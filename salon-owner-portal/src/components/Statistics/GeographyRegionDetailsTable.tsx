"use client";

import React, { useState } from "react";
import Pagination from "@/components/customComponent/Pagination";
import Modal from "@/components/customComponent/Modal";
import { User, Calendar, Euro } from "lucide-react";

interface RegionDetailRow {
  id: string;
  name: string;
  clients: number;
  revenue: number;
  avgTicket: number;
  visits: number;
}

interface ClientDetail {
  id: string;
  name: string;
  lastVisit: string;
  visits: number;
  spent: number;
}

const regionsDetails: RegionDetailRow[] = [
  { id: "1", name: "Veneto", clients: 65, revenue: 75720.75, avgTicket: 137.87, visits: 550 },
  { id: "2", name: "Sicilia", clients: 42, revenue: 57494.80, avgTicket: 146.30, visits: 393 },
  { id: "3", name: "Puglia", clients: 21, revenue: 28987.50, avgTicket: 142.70, visits: 203 },
  { id: "4", name: "Lazio", clients: 22, revenue: 28885.00, avgTicket: 138.21, visits: 209 },
  { id: "5", name: "Campania", clients: 21, revenue: 27944.85, avgTicket: 141.85, visits: 197 },
  { id: "6", name: "Emilia-Romagna", clients: 19, revenue: 27784.65, avgTicket: 145.47, visits: 191 },
  { id: "7", name: "Marche", clients: 19, revenue: 24370.30, avgTicket: 142.52, visits: 171 },
  { id: "8", name: "Liguria", clients: 18, revenue: 23574.35, avgTicket: 148.27, visits: 159 },
  { id: "9", name: "Toscana", clients: 19, revenue: 23082.05, avgTicket: 137.39, visits: 168 },
  { id: "10", name: "Umbria", clients: 18, revenue: 22345.15, avgTicket: 142.33, visits: 157 },
  { id: "11", name: "Abruzzo", clients: 14, revenue: 18450.00, avgTicket: 139.50, visits: 132 },
  { id: "12", name: "Molise", clients: 11, revenue: 14210.00, avgTicket: 140.20, visits: 101 },
];

const citiesDetails: RegionDetailRow[] = [
  { id: "1", name: "Milan", clients: 58, revenue: 68400.00, avgTicket: 148.50, visits: 460 },
  { id: "2", name: "Rome", clients: 48, revenue: 59200.00, avgTicket: 142.20, visits: 416 },
  { id: "3", name: "Naples", clients: 26, revenue: 34800.00, avgTicket: 139.80, visits: 249 },
  { id: "4", name: "Palermo", clients: 24, revenue: 31200.00, avgTicket: 144.10, visits: 216 },
  { id: "5", name: "Florence", clients: 22, revenue: 29500.00, avgTicket: 145.60, visits: 202 },
  { id: "6", name: "Venice", clients: 21, revenue: 28900.00, avgTicket: 147.20, visits: 196 },
  { id: "7", name: "Turin", clients: 20, revenue: 26100.00, avgTicket: 138.90, visits: 188 },
  { id: "8", name: "Bologna", clients: 19, revenue: 24800.00, avgTicket: 143.40, visits: 173 },
  { id: "9", name: "Verona", clients: 18, revenue: 23400.00, avgTicket: 141.70, visits: 165 },
  { id: "10", name: "Bari", clients: 17, revenue: 21900.00, avgTicket: 136.50, visits: 160 },
  { id: "11", name: "Genoa", clients: 16, revenue: 20500.00, avgTicket: 141.00, visits: 145 },
  { id: "12", name: "Catania", clients: 15, revenue: 19100.00, avgTicket: 138.00, visits: 138 },
  { id: "13", name: "Padua", clients: 14, revenue: 17800.00, avgTicket: 142.00, visits: 125 },
  { id: "14", name: "Trieste", clients: 13, revenue: 16400.00, avgTicket: 139.00, visits: 118 },
  { id: "15", name: "Brescia", clients: 12, revenue: 15200.00, avgTicket: 140.00, visits: 109 },
];

const mockClientsByLocation: Record<string, ClientDetail[]> = {
  Veneto: [
    { id: "c1", name: "Chiara Gentile", lastVisit: "12 Sep 2026", visits: 12, spent: 1654.50 },
    { id: "c2", name: "Federica Mancini", lastVisit: "10 Sep 2026", visits: 9, spent: 1242.00 },
    { id: "c3", name: "Beatrice Rinaldi", lastVisit: "08 Sep 2026", visits: 14, spent: 1928.00 },
    { id: "c4", name: "Silvio Mariani", lastVisit: "05 Sep 2026", visits: 8, spent: 1104.00 },
    { id: "c5", name: "Greta Leone", lastVisit: "01 Sep 2026", visits: 6, spent: 827.22 },
  ],
  Sicilia: [
    { id: "c6", name: "Giulia Gentile", lastVisit: "11 Sep 2026", visits: 10, spent: 1463.00 },
    { id: "c7", name: "Giorgia Caruso", lastVisit: "09 Sep 2026", visits: 8, spent: 1170.40 },
    { id: "c8", name: "Valeria Gentile", lastVisit: "07 Sep 2026", visits: 11, spent: 1609.30 },
  ],
  Puglia: [
    { id: "c9", name: "Elisa Moretti", lastVisit: "10 Sep 2026", visits: 7, spent: 998.90 },
    { id: "c10", name: "Emma Esposito", lastVisit: "06 Sep 2026", visits: 5, spent: 713.50 },
  ],
};

interface GeographyRegionDetailsTableProps {
  viewBy?: "regions" | "cities";
}

export function GeographyRegionDetailsTable({
  viewBy = "regions",
}: GeographyRegionDetailsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<RegionDetailRow | null>(null);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [viewBy]);

  const data = viewBy === "regions" ? regionsDetails : citiesDetails;
  const itemsPerPage = 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewClients = (row: RegionDetailRow) => {
    setSelectedRow(row);
  };

  const clientList = selectedRow
    ? mockClientsByLocation[selectedRow.name] || [
        {
          id: "def1",
          name: "Alessia Colombo",
          lastVisit: "09 Sep 2026",
          visits: 7,
          spent: Number((selectedRow.avgTicket * 7).toFixed(2)),
        },
        {
          id: "def2",
          name: "Marco Rossi",
          lastVisit: "07 Sep 2026",
          visits: 5,
          spent: Number((selectedRow.avgTicket * 5).toFixed(2)),
        },
        {
          id: "def3",
          name: "Luca Ferrari",
          lastVisit: "02 Sep 2026",
          visits: 6,
          spent: Number((selectedRow.avgTicket * 6).toFixed(2)),
        },
      ]
    : [];

  return (
    <>
      <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden w-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#1E293B]">
              {viewBy === "regions" ? "Region Details" : "City Details"}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[20%]">
                    {viewBy === "regions" ? "REGION" : "CITY"}
                  </th>
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[14%]">
                    # CLIENTS
                  </th>
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[18%]">
                    REVENUE
                  </th>
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[16%]">
                    AVG TICKET
                  </th>
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[16%]">
                    TOTAL VISITS
                  </th>
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope text-center w-[16%]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-bold text-[#1E293B]">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                      {row.clients}
                    </td>
                    <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-bold text-[#1E293B]">
                      €{row.revenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                      €{row.avgTicket.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                      {row.visits}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewClients(row)}
                        className="border border-[#E2E8F0] hover:bg-slate-50 text-[#1E293B] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        View Clients
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Pagination following previous style */}
        <div className="w-full mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            itemsName="results"
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Clients Modal */}
      <Modal
        isOpen={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title={selectedRow ? `Clients in ${selectedRow.name}` : "Clients"}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Revenue</p>
              <p className="text-base font-bold text-[#1E293B]">
                €{selectedRow?.revenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Avg Ticket</p>
              <p className="text-base font-bold text-emerald-600">
                €{selectedRow?.avgTicket.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Clients</p>
              <p className="text-base font-bold text-[#635BFF]">
                {selectedRow?.clients}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {clientList.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#635BFF] shrink-0 font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B]">{c.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>Last: {c.lastVisit}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    €{c.spent.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {c.visits} visits
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedRow(null)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
