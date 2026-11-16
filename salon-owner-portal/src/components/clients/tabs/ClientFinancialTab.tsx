"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wallet,
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  Download,
  Plus,
  MoreVertical,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import {
  getClientSpendingChartData,
  CHART_FILTER_OPTIONS as chartFilterOptions,
  mockEmployeeBreakdown,
  mockFinancialReceipts,
  mockClientGiftCards,
} from "@/components/clients/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface ClientFinancialTabProps {
  clientId: string;
  formattedTotalSpent: string;
  onOpenPrintModal: (receipt: any) => void;
  onOpenDownloadModal: (receipt: any) => void;
  onOpenAllServicesModal: () => void;
}

export default function ClientFinancialTab({
  clientId,
  formattedTotalSpent,
  onOpenPrintModal,
  onOpenDownloadModal,
  onOpenAllServicesModal,
}: ClientFinancialTabProps) {
  const [chartFilter, setChartFilter] = useState("Last 7 days");
  const [isChartFilterDropdownOpen, setIsChartFilterDropdownOpen] =
    useState(false);
  const [currentReceiptsPage, setCurrentReceiptsPage] = useState(1);
  const [openGiftCardMenu, setOpenGiftCardMenu] = useState<number | null>(null);

  const currentChartData = getClientSpendingChartData(chartFilter);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1E293B",
        bodyColor: "#10B981",
        borderColor: "#E2E8F0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => `Money Spent: € ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94A3B8", font: { size: 10, weight: 500 } },
        border: { display: false },
      },
      y: {
        grid: { color: "#F1F5F9" },
        ticks: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: "#10B981",
        borderWidth: 2,
        borderColor: "white",
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const chartData = {
    labels: currentChartData.labels,
    datasets: [
      {
        label: "Money Spent",
        data: currentChartData.data,
        borderColor: "#10B981",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
          return gradient;
        },
        borderWidth: 3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-bold text-[#1E293B]">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-b from-[#635BFF4D] to-white rounded-lg p-5 border border-[#F1F5F9] shadow-[0_4px_20px_-10px_rgba(99,91,255,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-[13px] font-bold text-[#1E293B]">
                Total money Spent
              </span>
            </div>
            <div className="text-[24px] font-bold text-[#1E293B] font-manrope">
              {formattedTotalSpent}
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#10B9814D] to-white rounded-lg p-5 border border-[#F1F5F9] shadow-[0_4px_20px_-10px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#10B981] flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-[13px] font-bold text-[#1E293B]">
                Average Spent Per Visit
              </span>
            </div>
            <div className="text-[24px] font-bold text-[#1E293B] font-manrope">
              € 258
            </div>
          </div>
        </div>
      </div>

      {/* Money Spent Chart */}
      <div className="bg-white rounded-lg p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[14px] font-bold text-[#1E293B]">Money Spent</h3>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsChartFilterDropdownOpen(!isChartFilterDropdownOpen)
              }
              className="flex items-center justify-between gap-2 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2 text-[13px] font-bold text-[#1E293B] shadow-sm hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <span>{chartFilter}</span>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </button>
            {isChartFilterDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-[#F1F5F9] rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {chartFilterOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setChartFilter(opt);
                      setIsChartFilterDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-[14px] text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="text-[24px] font-bold text-[#1E293B] font-manrope mb-2">
            {currentChartData.total}
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <ChevronUp className="w-3 h-3" />
              {currentChartData.change}
            </div>
            <span className="text-[12px] text-[#94A3B8] font-medium">
              vs previous period
            </span>
          </div>
        </div>

        {/* Functional Chart Area */}
        <div className="h-[200px] w-full">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      {/* Breakdowns */}
      <div className="space-y-6">
        <div>
          <h3 className="text-[13px] font-bold text-[#1E293B] mb-4">
            Breakdown by Employee
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockEmployeeBreakdown.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={item.avatarUrl}
                      alt="Staff"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[12px] font-bold text-[#1E293B]">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[#10B981]">
                    {item.totalEarned}
                  </div>
                  <div className="text-[9px] font-medium text-[#94A3B8]">
                    Total Earned
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-[#1E293B]">
              Breakdown by Service Type
            </h3>
            <button
              type="button"
              onClick={onOpenAllServicesModal}
              className="text-[12px] font-bold text-[#635BFF] hover:underline cursor-pointer"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                  <span className="text-white text-[13px] font-bold">1</span>
                </div>
                <span className="text-[13px] font-bold text-[#1E293B]">
                  Haircuts
                </span>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-bold text-[#10B981]">
                  € 1,700
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">
                  Total Earned
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                  <span className="text-white text-[13px] font-bold">2</span>
                </div>
                <span className="text-[13px] font-bold text-[#1E293B]">
                  Coloring
                </span>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-bold text-[#10B981]">
                  € 1,700
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">
                  Total Earned
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                  <span className="text-white text-[13px] font-bold">3</span>
                </div>
                <span className="text-[13px] font-bold text-[#1E293B]">
                  Treatments
                </span>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-bold text-[#10B981]">
                  € 1,700
                </div>
                <div className="text-[10px] font-medium text-[#94A3B8]">
                  Total Earned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-bold text-[#1E293B]">Receipts list</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Team Member
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Service
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Scheduled Date
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Price
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockFinancialReceipts.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors last:border-b-0"
                >
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-bold text-[#635BFF]">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.member}`}
                        alt={row.member}
                        className="w-7 h-7 rounded-full bg-[#EEF2FF]"
                      />
                      <span className="text-[11px] font-bold text-[#1E293B]">
                        {row.member}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">
                    {row.service}
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-bold text-[#1E293B]">
                    {row.price}
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#10B981] border border-[#10B981]/30 bg-[#ECFDF5] px-2.5 py-1 rounded-[6px] inline-flex items-center">
                      {row.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-[6px] border inline-flex items-center ${
                        row.status === "Pending"
                          ? "text-[#D97706] bg-[#FFFBEB] border-[#F59E0B]/30"
                          : row.status === "Paid"
                            ? "text-[#10B981] bg-[#ECFDF5] border-[#10B981]/30"
                            : "text-[#E11D48] bg-[#FFF1F2] border-[#F43F5E]/30"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenPrintModal(row)}
                        className="p-1.5 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] rounded-lg transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDownloadModal(row)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors border border-[#E2E8F0] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentReceiptsPage}
          totalPages={3}
          totalItems={12}
          itemsPerPage={5}
          itemName="receipts"
          onPageChange={setCurrentReceiptsPage}
        />
      </div>

      {/* Gifts Cards */}
      <div className="space-y-6 bg-white rounded-lg shadow-sm border border-[#E2E8F0] px-5 py-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#1E293B]">Gifts Cards</h2>
          <Link
            href={`/dashboard/clients/${clientId}/gift-cards/add`}
            className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Gift Card
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-300 rounded-full">
                <Image
                  src="/TotaltoStillSpend.png"
                  alt="Total to Still Spend"
                  width={20}
                  height={10}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-[15px] font-bold text-[#1E293B]">
                Total to Still Spend
              </span>
            </div>
            <div className="text-[22px] font-bold text-[#1E293B] font-manrope">
              € 540
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-300 rounded-full">
                <Image
                  src="/TotalUsed.png"
                  alt="Total Used"
                  width={20}
                  height={10}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-[15px] font-bold text-[#1E293B]">
                Total Used
              </span>
            </div>
            <div className="text-[22px] font-bold text-[#1E293B] font-manrope">
              € 1,440
            </div>
          </div>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockClientGiftCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm relative group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[14px] font-bold text-[#1E293B]">
                    {card.amount}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                    {card.code}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGiftCardMenu(
                      openGiftCardMenu === card.id ? null : card.id,
                    )
                  }
                  className="text-[#94A3B8] hover:text-[#1E293B] transition-colors mt-0.5 relative z-20 cursor-pointer"
                >
                  <MoreVertical className="w-[18px] h-[18px]" />
                </button>
                {/* Action Menu (Mock) */}
                {openGiftCardMenu === card.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenGiftCardMenu(null)}
                    />
                    <div className="absolute top-12 right-4 bg-white border border-[#F1F5F9] rounded-lg shadow-lg p-1 z-20 animate-in fade-in duration-200">
                      <Link
                        href={`/dashboard/clients/${clientId}/gift-cards/view/${card.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#635BFF] hover:bg-[#F8FAFC] rounded-lg transition-colors w-full text-left"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/clients/${clientId}/gift-cards/add?edit=${encodeURIComponent(
                          card.id
                        )}&amount=${encodeURIComponent(
                          card.amount.replace(/[^0-9.]/g, "")
                        )}`}
                        className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors w-full text-left cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFE4E6] rounded-lg transition-colors w-full text-left cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-5 flex-grow flex items-center justify-center">
                <img
                  src={card.image}
                  alt="Gift Card"
                  className="w-full h-auto object-contain drop-shadow-lg"
                />
              </div>

              <div className="flex items-center gap-2 mt-auto">
                {card.isUsed ? (
                  <span className="bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-3 py-1 rounded-full">
                    Used
                  </span>
                ) : (
                  <>
                    <span className="bg-[#FEFCE8] text-[#EAB308] text-[10px] font-bold px-3 py-1 rounded-full">
                      No-Used
                    </span>
                    <span className="border border-[#10B981] text-[#10B981] bg-white text-[10px] font-bold px-3 py-1 rounded-full">
                      Active
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
