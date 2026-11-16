"use client";

import React, { useState, useMemo } from "react";
import CustomExportModal from "@/components/customComponent/CustomExportModal";
import { ALL_REMUNERATION_DATA } from "@/components/remuneration/data";
import RemunerationFilterBar from "@/components/remuneration/RemunerationFilterBar";
import RemunerationStatCards from "@/components/remuneration/RemunerationStatCards";
import RemunerationTable from "@/components/remuneration/RemunerationTable";

export default function RemunerationPage() {
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [customRange, setCustomRange] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    let data = ALL_REMUNERATION_DATA;

    // Filter by year
    if (selectedYear !== "All Years") {
      data = data.filter((item) => item.year === selectedYear);
    }

    // Filter by custom date range
    if (dateRange.start && dateRange.end) {
      const startTime = new Date(dateRange.start).setHours(0, 0, 0, 0);
      const endTime = new Date(dateRange.end).setHours(23, 59, 59, 999);

      data = data.filter((item) => {
        const itemTime = new Date(item.date).getTime();
        return itemTime >= startTime && itemTime <= endTime;
      });
    }

    return data;
  }, [selectedYear, dateRange]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, safeCurrentPage, itemsPerPage]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCustomRange("");
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      <RemunerationFilterBar
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        customRange={customRange}
        onCustomRangeChange={(rangeStr, start, end) => {
          setCustomRange(rangeStr);
          setDateRange({ start, end });
          setCurrentPage(1);
        }}
        onClearCustomRange={() => {
          setCustomRange("");
          setDateRange({ start: null, end: null });
          setCurrentPage(1);
        }}
        onExportClick={() => setIsExportOpen(true)}
      />
      <RemunerationStatCards />
      <RemunerationTable
        paginatedData={paginatedData}
        totalRecords={filteredData.length}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <CustomExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Remuneration Data"
        description="Choose the format to export your remuneration history."
      />
    </div>
  );
}
