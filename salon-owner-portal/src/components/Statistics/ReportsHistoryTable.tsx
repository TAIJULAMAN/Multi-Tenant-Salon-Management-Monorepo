import React, { useState } from "react";
import { Eye, Download, Trash2, X, FileText, AlertTriangle } from "lucide-react";
import { reportsList } from "./data";
import { ReportsHistoryTableProps } from "./types";

export function ReportsHistoryTable({ reportType }: ReportsHistoryTableProps) {
  const [modalState, setModalState] = useState<{ type: 'view' | 'delete', report: any } | null>(null);

  const filteredReports =
    reportType === "All Reports"
      ? reportsList
      : reportsList.filter((r) => r.type === reportType);

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#1E293B]">Generated Reports History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Report Name</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Type</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Created Date</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Format</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Size</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Status</th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((row) => (
              <tr key={row.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="block font-bold text-[#1E293B] text-[13px]">{row.name}</span>
                  <span className="text-xs text-[#94A3B8] font-normal">{row.id}</span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] rounded-full">
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#64748B] font-medium text-[13px]">{row.date}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className={`text-xs font-bold ${row.format === "PDF" ? "text-red-500" : row.format === "XLSX" ? "text-green-500" : "text-blue-500"}`}>
                    {row.format}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[#94A3B8] font-medium text-[13px]">{row.size}</td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      row.status === "Ready" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      className="p-1.5 hover:bg-[#F1F5F9] rounded text-[#64748B] hover:text-[#1E293B] transition-colors" 
                      title="View details"
                      onClick={() => setModalState({ type: 'view', report: row })}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-1.5 hover:bg-[#F1F5F9] rounded transition-colors ${
                        row.status === "Ready" ? "text-[#635BFF] hover:text-[#4F46E5]" : "text-slate-300 cursor-not-allowed"
                      }`}
                      title="Download report"
                      disabled={row.status !== "Ready"}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors" 
                      title="Delete report"
                      onClick={() => setModalState({ type: 'delete', report: row })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modalState?.type === 'view' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-manrope">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Report Details</h3>
              <button onClick={() => setModalState(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#635BFF]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{modalState.report.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{modalState.report.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Type</p>
                  <p className="text-sm font-bold text-slate-800">{modalState.report.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Created Date</p>
                  <p className="text-sm font-bold text-slate-800">{modalState.report.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Format</p>
                  <p className="text-sm font-bold text-slate-800">{modalState.report.format}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">Size</p>
                  <p className="text-sm font-bold text-slate-800">{modalState.report.size}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setModalState(null)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Close
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                  modalState.report.status === "Ready" ? "bg-[#635BFF] text-white hover:bg-[#5249E6]" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                disabled={modalState.report.status !== "Ready"}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 font-manrope">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Report</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete <span className="font-bold text-slate-700">{modalState.report.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3 w-full">
              <button onClick={() => setModalState(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setModalState(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
