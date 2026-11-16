"use client";

import React from "react";
import { Search, Calendar, User, X } from "lucide-react";
import { mockClients, mockEmployees } from "./data";

interface WaiverFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: "All" | "Client" | "Employee";
  setRoleFilter: (val: "All" | "Client" | "Employee") => void;
  selectedPerson: string;
  setSelectedPerson: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  onClear: () => void;
}

export function WaiverFilterBar({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  selectedPerson,
  setSelectedPerson,
  dateFilter,
  setDateFilter,
  onClear,
}: WaiverFilterBarProps) {
  const isFiltered =
    Boolean(search) ||
    roleFilter !== "All" ||
    Boolean(selectedPerson) ||
    dateFilter !== "All Dates";

  const allPeople = [
    ...mockClients.map((c) => ({ name: c.name, role: "Client" })),
    ...mockEmployees.map((e) => ({ name: e.name, role: "Employee" })),
  ];

  const filteredPeople =
    roleFilter === "All"
      ? allPeople
      : allPeople.filter((p) => p.role === roleFilter);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by waiver name or client/employee..."
            className="w-full pl-10 pr-4 py-2 text-[13px] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#635BFF] transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Role Selector */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1 text-[12px] font-bold">
            {(["All", "Client", "Employee"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleFilter(r);
                  setSelectedPerson("");
                }}
                className={`px-3 py-1 rounded-md transition-all ${
                  roleFilter === r
                    ? "bg-white text-[#635BFF] shadow-xs"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {r === "All" ? "All Roles" : r}
              </button>
            ))}
          </div>

          {/* Specific Person Dropdown */}
          <div className="relative">
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] text-[#1E293B] text-[12px] font-bold py-2 pl-8 pr-8 rounded-lg focus:outline-none focus:border-[#635BFF] cursor-pointer"
            >
              <option value="">Filter by Person</option>
              {filteredPeople.map((p, idx) => (
                <option key={idx} value={p.name}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] text-[#1E293B] text-[12px] font-bold py-2 pl-8 pr-8 rounded-lg focus:outline-none focus:border-[#635BFF] cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-[#94A3B8] hover:text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors flex items-center gap-1 text-[12px] font-bold cursor-pointer"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
