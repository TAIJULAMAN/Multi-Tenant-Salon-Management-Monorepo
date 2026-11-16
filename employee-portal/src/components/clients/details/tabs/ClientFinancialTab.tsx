"use client";

import React, { useState } from "react";
import { Wallet, Calendar, ChevronUp, Printer, Download, Plus, MoreVertical, Eye, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
import CustomSelect from "@/components/customComponent/CustomSelect";
import Pagination from "@/components/customComponent/Pagination";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export interface ReceiptItem {
  id: string;
  member: string;
  service: string;
  date: string;
  price: string;
  payment: string;
  status: "Pending" | "Paid" | "Returned";
}

interface ClientFinancialTabProps {
  formattedTotalSpent: string;
  formattedAvgSpent: string;
  clientId: string;
  onShowAllServices: () => void;
  onPrintReceipt: (receipt: ReceiptItem) => void;
  onDownloadReceipt: (receipt: ReceiptItem) => void;
}

export default function ClientFinancialTab({
  formattedTotalSpent,
  formattedAvgSpent,
  clientId,
  onShowAllServices,
  onPrintReceipt,
  onDownloadReceipt,
}: ClientFinancialTabProps) {
  const [chartFilter, setChartFilter] = useState("Last 7 days");
  const [currentReceiptsPage, setCurrentReceiptsPage] = useState(1);
  const [openGiftCardMenu, setOpenGiftCardMenu] = useState<number | null>(null);

  const chartFilterOptions = [
    { label: "Last 7 days", value: "Last 7 days" },
    { label: "Last 14 days", value: "Last 14 days" },
    { label: "Last Month", value: "Last Month" },
  ];

  const getChartData = () => {
    if (chartFilter === "Last 7 days") {
      return {
        labels: ['Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7'],
        data: [150, 250, 410, 300, 550, 350, 600],
        total: "€ 1,358",
        change: "+12%",
      };
    } else if (chartFilter === "Last 14 days") {
      return {
        labels: ['Aug 25', 'Aug 27', 'Aug 29', 'Aug 31', 'Sep 2', 'Sep 4', 'Sep 6'],
        data: [200, 350, 300, 450, 400, 500, 750],
        total: "€ 2,450",
        change: "+18%",
      };
    } else {
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [1200, 1500, 1400, 1800],
        total: "€ 5,100",
        change: "+25%",
      };
    }
  };

  const currentChartData = getChartData();

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1E293B',
        bodyColor: '#10B981',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => `Money Spent: € ${context.raw}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { size: 10, weight: 500 } },
        border: { display: false }
      },
      y: {
        grid: { color: '#F1F5F9' },
        ticks: { display: false },
        border: { display: false }
      }
    },
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: 'white'
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const chartData = {
    labels: currentChartData.labels,
    datasets: [
      {
        label: 'Money Spent',
        data: currentChartData.data,
        borderColor: '#10B981',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
      },
    ],
  };

  const receipts: ReceiptItem[] = [
    { id: "#0025", member: "Maria Rodriguez", service: "Haircut", date: "8 Aug 2025, 08:00 AM - 10:15 AM", price: "€ 170", payment: "Cash", status: "Pending" },
    { id: "#0026", member: "Maria Rodriguez", service: "Haircut", date: "8 Aug 2025, 12:00 PM - 02:15 PM", price: "€ 170", payment: "Cash", status: "Returned" },
    { id: "#0027", member: "Maria Rodriguez", service: "Haircut", date: "8 Aug 2025, 18:30 PM - 20:15 PM", price: "€ 170", payment: "On Card", status: "Returned" },
    { id: "#0028", member: "Maria Rodriguez", service: "Haircut", date: "8 Aug 2025, 08:00 AM - 10:15 AM", price: "€ 170", payment: "Credit Card", status: "Paid" },
    { id: "#0029", member: "Maria Rodriguez", service: "Haircut", date: "8 Aug 2025, 12:00 PM - 02:15 PM", price: "€ 170", payment: "Credit Card", status: "Pending" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-bold text-[#1E293B]">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shadow-sm">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-bold text-[#64748B]">Total money Spent</span>
              </div>
              <div className="text-[24px] font-bold text-[#1E293B] font-manrope">{formattedTotalSpent}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-bold text-[#64748B]">Average Spent Per Visit</span>
              </div>
              <div className="text-[24px] font-bold text-[#1E293B] font-manrope">{formattedAvgSpent || "€ 258"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Money Spent Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[14px] font-bold text-[#1E293B]">Money Spent</h3>
          <div className="w-[160px]">
            <CustomSelect
              options={chartFilterOptions}
              value={chartFilter}
              onChange={setChartFilter}
              placeholder="Select period"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="text-[24px] font-bold text-[#1E293B] font-manrope mb-2">{currentChartData.total}</div>
          <div className="flex items-center gap-2">
            <div className="bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <ChevronUp className="w-3 h-3" />
              {currentChartData.change}
            </div>
            <span className="text-[12px] text-[#94A3B8] font-medium">vs previous period</span>
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
          <h3 className="text-[13px] font-bold text-[#1E293B] mb-4">Breakdown by Employee</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${item}`} alt="Staff" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1E293B]">Barney</span>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[#10B981]">€ 1,700</div>
                  <div className="text-[9px] font-medium text-[#94A3B8]">Total Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold text-[#1E293B]">Breakdown by Service Type</h3>
            <button
              type="button"
              onClick={onShowAllServices}
              className="text-[12px] font-bold text-[#635BFF] hover:underline cursor-pointer"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: 1, name: "Haircuts", total: "€ 1,700" },
              { id: 2, name: "Coloring", total: "€ 1,700" },
              { id: 3, name: "Treatments", total: "€ 1,700" },
            ].map((srv) => (
              <div key={srv.id} className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                    <span className="text-white text-[13px] font-bold">{srv.id}</span>
                  </div>
                  <span className="text-[13px] font-bold text-[#1E293B]">{srv.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#10B981]">{srv.total}</div>
                  <div className="text-[10px] font-medium text-[#94A3B8]">Total Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h3 className="text-[14px] font-bold text-[#1E293B]">Receipts list</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Team Member</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Service</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Scheduled Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Price</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Payment Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors last:border-b-0">
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-bold text-[#635BFF]">{row.id}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.member}`} alt={row.member} className="w-7 h-7 rounded-full bg-[#EEF2FF]" />
                      <span className="text-[11px] font-bold text-[#1E293B]">{row.member}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">{row.service}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">{row.date}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] font-bold text-[#1E293B]">{row.price}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#10B981] border border-[#10B981]/30 bg-[#ECFDF5] px-2.5 py-1 rounded-lg inline-flex items-center">{row.payment}</span>
                  </td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0]">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border inline-flex items-center ${row.status === "Pending" ? "text-[#D97706] bg-[#FFFBEB] border-[#F59E0B]/30" :
                      row.status === "Paid" ? "text-[#10B981] bg-[#ECFDF5] border-[#10B981]/30" :
                        "text-[#E11D48] bg-[#FFF1F2] border-[#F43F5E]/30"
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPrintReceipt(row)}
                        className="p-1.5 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] rounded-lg transition-colors cursor-pointer"
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownloadReceipt(row)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors border border-[#E2E8F0] cursor-pointer"
                        title="Download"
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
      <div className="space-y-6 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] px-5 py-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#1E293B]">Gifts Cards</h2>
          <Link href={`/clients/${clientId}/gift-cards/add`} className="flex items-center gap-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-bold transition-colors">
            <Plus className="w-4 h-4" />
            Add Gift Card
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-2xl">
                <Image src="/TotaltoStillSpend.png" alt="Total to Still Spend" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <span className="text-[15px] font-bold text-[#1E293B]">Total to Still Spend</span>
            </div>
            <div className="text-[22px] font-bold text-[#1E293B] font-manrope">€ 540</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-2xl">
                <Image src="/TotalUsed.png" alt="Total Used" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <span className="text-[15px] font-bold text-[#1E293B]">Total Used</span>
            </div>
            <div className="text-[22px] font-bold text-[#1E293B] font-manrope">€ 1,440</div>
          </div>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div key={card} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm relative group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[14px] font-bold text-[#1E293B]">€ 200</div>
                  <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">#002</div>
                </div>
                <button
                  onClick={() => setOpenGiftCardMenu(openGiftCardMenu === card ? null : card)}
                  className="text-[#94A3B8] hover:text-[#1E293B] transition-colors mt-0.5 relative z-20 cursor-pointer"
                >
                  <MoreVertical className="w-[18px] h-[18px]" />
                </button>
                {/* Action Menu */}
                {openGiftCardMenu === card && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenGiftCardMenu(null)} />
                    <div className="absolute top-12 right-4 bg-white border border-[#F1F5F9] rounded-xl shadow-lg p-1 z-20 animate-in fade-in duration-200">
                      <Link href={`/clients/${clientId}/gift-cards/view/${card}`} className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#635BFF] hover:bg-[#F8FAFC] rounded-lg transition-colors w-full text-left">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      <button className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors w-full text-left cursor-pointer">
                        <FileText className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFE4E6] rounded-lg transition-colors w-full text-left cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-5 flex-grow flex items-center justify-center">
                {card === 1 ? (
                  <img src="/cards/c1.png" alt="Gift Card" className="w-full h-auto object-contain drop-shadow-lg" />
                ) : (
                  <img src="/cards/c3.png" alt="Gift Card" className="w-full h-auto object-contain drop-shadow-lg" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-auto">
                {card === 1 ? (
                  <span className="bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-3 py-1 rounded-lg">Used</span>
                ) : (
                  <>
                    <span className="bg-[#FEFCE8] text-[#EAB308] text-[10px] font-bold px-3 py-1 rounded-lg">No-Used</span>
                    <span className="border border-[#10B981] text-[#10B981] bg-white text-[10px] font-bold px-3 py-1 rounded-lg">Active</span>
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
