"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import { Download, Printer, CheckCircle, FileText, Building2, User, CreditCard, Calendar } from "lucide-react";

export interface SalaryRecord {
  id: string;
  name: string;
  uploader?: string;
  avatarBg?: string;
  avatarUrl?: string;
  role: string;
  netAmount: string;
  month?: string;
  date: string;
  status: "pending" | "paid" | "Approved";
  grossSalary?: string;
  netSalary?: string;
  trfMonthly?: string;
  cumulativeTrf?: string;
  iban?: string;
}

interface ViewPayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: SalaryRecord | null;
}

export default function ViewPayslipModal({ isOpen, onClose, record }: ViewPayslipModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !record) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }, 1000);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 500);
  };

  const statusLabel =
    record.status === "Approved"
      ? "Approved"
      : record.status === "paid"
      ? "Paid"
      : "Under Review";

  const statusStyle =
    record.status === "Approved"
      ? "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30"
      : record.status === "paid"
      ? "bg-[#CCFBF1] text-[#0D9488] border border-[#0D9488]/30"
      : "bg-[#FEF9C3] text-[#CA8A04] border border-[#CA8A04]/30";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payslip Details" maxWidth="max-w-2xl">
      <div className="space-y-6 font-manrope">
        {/* Salon / Employer Header */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1E293B]">Harem Salon Milano</h3>
              <p className="text-[12px] text-[#64748B]">Via Roma, 123 · 20121 Milan (MI) · P.IVA IT12345678901</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className={`inline-block px-3 py-1 rounded-[6px] text-[11px] font-bold ${statusStyle}`}>
              {statusLabel}
            </span>
            <p className="text-[11px] text-[#94A3B8] font-medium mt-1">Doc No: PS-{record.id.padStart(4, "0")}</p>
          </div>
        </div>

        {/* Employee & Period Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              <User className="w-3.5 h-3.5 text-[#635BFF]" /> Employee Info
            </div>
            <div className="flex items-center gap-3">
              <img
                src={record.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.name}`}
                alt={record.name}
                className="w-10 h-10 rounded-full object-cover bg-[#F1F5F9] border border-[#E2E8F0]"
              />
              <div>
                <p className="text-[14px] font-bold text-[#1E293B]">{record.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-[#CA8A04] bg-[#FEF9C3] px-2 py-0.5 rounded-[4px] border border-[#CA8A04]/20">
                    {record.role || "Staff"}
                  </span>
                  {record.uploader && (
                    <span className="text-[11px] text-[#94A3B8]">Uploaded by: {record.uploader}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#F1F5F9] text-[12px] flex items-center justify-between">
              <span className="text-[#64748B] flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-[#94A3B8]" /> IBAN:
              </span>
              <span className="font-mono font-medium text-[#1E293B]">{record.iban || "IT60 X054 ******** 123"}</span>
            </div>
          </div>

          {/* Period Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-[#635BFF]" /> Reference Period
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#1E293B]">{record.month || "December 2024"}</p>
              <p className="text-[12px] text-[#64748B] mt-0.5">Payment Date: {record.date}</p>
            </div>
            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-[12px] text-[#64748B]">Net Payable Amount:</span>
              <span className="text-[16px] font-extrabold text-[#16A34A]">{record.netAmount}</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-2xs">
          <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-[#1E293B] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#635BFF]" /> Remuneration Breakdown
            </h4>
            <span className="text-[11px] text-[#64748B] font-medium">Currency: EUR (€)</span>
          </div>

          <table className="w-full text-left text-[13px]">
            <tbody>
              <tr className="border-b border-[#F1F5F9]">
                <td className="px-5 py-3 font-semibold text-[#1E293B]">Gross Salary (Retribuzione Lorda)</td>
                <td className="px-5 py-3 text-right font-bold text-[#1E293B]">{record.grossSalary || "€ 3,200.00"}</td>
              </tr>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
                <td className="px-5 py-2.5 text-[#64748B] pl-8">Social Security Withholdings (INPS 9.19%)</td>
                <td className="px-5 py-2.5 text-right font-medium text-[#DC2626]">- € 294.00</td>
              </tr>
              <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
                <td className="px-5 py-2.5 text-[#64748B] pl-8">Tax Withholdings (IRPEF)</td>
                <td className="px-5 py-2.5 text-right font-medium text-[#DC2626]">- € 306.00</td>
              </tr>
              <tr className="border-b border-[#E2E8F0] bg-[#ECFDF5]/30">
                <td className="px-5 py-3 font-bold text-[#15803D]">Net Monthly Salary (Netto del Mese)</td>
                <td className="px-5 py-3 text-right font-bold text-[#15803D]">{record.netAmount || record.netSalary || "€ 2,600.00"}</td>
              </tr>
              <tr className="border-b border-[#F1F5F9]">
                <td className="px-5 py-3 text-[#64748B]">TFR Accrued This Month (TRF Mensile)</td>
                <td className="px-5 py-3 text-right font-semibold text-[#1E293B]">{record.trfMonthly || "€ 600.00"}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 text-[#64748B]">Cumulative TFR to Date (TFR Accantonato)</td>
                <td className="px-5 py-3 text-right font-bold text-[#635BFF]">{record.cumulativeTrf || "€ 3,800.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] font-bold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#16A34A]" /> Downloaded
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] font-bold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-semibold text-[13px] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
