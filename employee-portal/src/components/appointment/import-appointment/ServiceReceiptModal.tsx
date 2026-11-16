"use client";

import React from "react";
import { ChevronLeft, Download } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import { ServiceReceiptModalProps } from "./types";

export default function ServiceReceiptModal({
  isOpen,
  onClose,
  data,
}: ServiceReceiptModalProps) {
  if (!isOpen || !data) return null;

  const totalVal = 170.0;
  const taxableVal = (totalVal / 1.22).toFixed(2);
  const vatVal = (totalVal - parseFloat(taxableVal)).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 hover:text-[#635BFF] transition-colors group text-left cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#64748B] group-hover:text-[#635BFF]" />
            <div>
              <h2 className="text-[15px] font-extrabold text-[#1E293B] font-manrope">
                Service Receipt
              </h2>
              <p className="text-[11px] font-bold text-slate-400">
                Italian Fiscal Invoice
              </p>
            </div>
          </button>
          <button
            onClick={() => alert("Downloading PDF Receipt...")}
            className="bg-[#EEF2FF] hover:bg-[#D3DCFF] text-[#635BFF] px-4 py-2 rounded-xl font-bold text-[12px] flex items-center gap-1.5 transition-colors border border-[#C7D2FE] shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>

        {/* Electronic Invoice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-slate-50/50">
            <div className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
              Electronic Invoice
            </div>
            <div className="text-[15px] font-extrabold text-[#1E293B] mt-1.5">
              2025-000{data.id}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              Receipt No.
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-slate-50/50">
            <div className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">
              Date
            </div>
            <div className="text-[15px] font-extrabold text-[#1E293B] mt-1.5">
              11/30/2024
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              Date Issued
            </div>
          </div>
        </div>

        {/* Transferor & Transferee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transferor */}
          <div className="border border-[#E2E8F0] rounded-2xl p-5 space-y-3 bg-white">
            <h4 className="text-[12px] font-extrabold text-[#1E293B] border-b border-slate-100 pb-2">
              Transferor/Provider
            </h4>
            <div className="space-y-1 text-[12px] font-semibold text-[#475569]">
              <div className="font-extrabold text-[#1E293B] text-[13px]">
                Bella Vista Salon
              </div>
              <div>Via Roma, 123</div>
              <div>20121 Milan (MI) - Italy</div>
              <div className="pt-1.5 flex flex-wrap gap-x-3 text-[11px] text-slate-400">
                <span>
                  PIVA:{" "}
                  <strong className="text-[#475569]">IT12345678901</strong>
                </span>
                <span>
                  Tax Code:{" "}
                  <strong className="text-[#475569]">12345678901</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                PEC:{" "}
                <strong className="text-[#475569]">
                  amministrazione@pec.salonflow.it
                </strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Recipient Code:{" "}
                <strong className="text-[#475569]">XXXXXXX</strong>
              </div>
              <div className="pt-1 flex flex-wrap gap-x-3 text-[11px] text-slate-400">
                <span>
                  Tel:{" "}
                  <strong className="text-[#475569]">+39 02 1234567</strong>
                </span>
                <span>
                  Email:{" "}
                  <strong className="text-[#475569]">info@salonflow.it</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Transferee */}
          <div className="border border-[#E2E8F0] rounded-2xl p-5 space-y-3 bg-white">
            <h4 className="text-[12px] font-extrabold text-[#1E293B] border-b border-slate-100 pb-2">
              Transferee/Client
            </h4>
            <div className="space-y-1 text-[12px] font-semibold text-[#475569]">
              <div className="font-extrabold text-[#1E293B] text-[13px]">
                Amelia Rodriguez (Ref: {data.clientRef})
              </div>
              <div>Via Esempio, 458</div>
              <div>10100 Turin (TO) - Italy</div>
              <div className="pt-1.5 text-[11px] text-slate-400">
                Tax Code:{" "}
                <strong className="text-[#475569]">RSTGPP90A01L219Y</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Service Description Table */}
        <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0] text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider">
                <th className="px-5 py-3 border-r border-[#E2E8F0] w-[40%]">
                  Service Name
                </th>
                <th className="px-5 py-3 border-r border-[#E2E8F0] text-center w-[15%]">
                  Amount
                </th>
                <th className="px-5 py-3 border-r border-[#E2E8F0] text-right w-[15%]">
                  Unit Price
                </th>
                <th className="px-5 py-3 border-r border-[#E2E8F0] text-center w-[15%]">
                  VAT Rate
                </th>
                <th className="px-5 py-3 text-right w-[15%]">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[12px] font-semibold text-[#475569] border-b border-slate-100 last:border-b-0">
                <td className="px-5 py-4 border-r border-[#E2E8F0] font-extrabold text-[#1E293B]">
                  Haircut (Ref: {data.serviceRef})
                </td>
                <td className="px-5 py-4 border-r border-[#E2E8F0] text-center">
                  1
                </td>
                <td className="px-5 py-4 border-r border-[#E2E8F0] text-right">
                  €{taxableVal}
                </td>
                <td className="px-5 py-4 border-r border-[#E2E8F0] text-center">
                  22%
                </td>
                <td className="px-5 py-4 text-right font-extrabold text-[#1E293B]">
                  €{totalVal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* VAT & Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VAT Summary */}
          <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-2 bg-white">
            <div className="text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider mb-2">
              VAT Summary
            </div>
            <div className="flex justify-between text-[12px] font-semibold text-[#475569] border-b border-slate-100 pb-1.5">
              <span>Rate</span>
              <span>22%</span>
            </div>
            <div className="flex justify-between text-[12px] font-semibold text-[#475569] border-b border-slate-100 pb-1.5">
              <span>Taxable</span>
              <span>€{taxableVal}</span>
            </div>
            <div className="flex justify-between text-[12px] font-semibold text-[#475569]">
              <span>IVA (VAT)</span>
              <span>€{vatVal}</span>
            </div>
          </div>

          {/* Document Totals */}
          <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-2 bg-white">
            <div className="text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider mb-2">
              Document Totals
            </div>
            <div className="flex justify-between text-[12px] font-semibold text-[#475569] border-b border-slate-100 pb-1.5">
              <span>Total Taxable Amount</span>
              <span>€{taxableVal}</span>
            </div>
            <div className="flex justify-between text-[12px] font-semibold text-[#475569] border-b border-slate-100 pb-1.5">
              <span>Total VAT</span>
              <span>€{vatVal}</span>
            </div>
            <div className="flex justify-between text-[13px] font-extrabold text-[#635BFF]">
              <span>Document Total</span>
              <span>€{totalVal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-white space-y-3">
          <h4 className="text-[12px] font-extrabold text-[#1E293B] border-b border-slate-100 pb-2">
            Payment Methods
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12px] font-semibold text-[#475569]">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Mode
              </div>
              <div className="text-[#1E293B] font-extrabold mt-1">Credit Card</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Payment Date
              </div>
              <div className="text-[#1E293B] font-extrabold mt-1">12/10/2024</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Amount Paid
              </div>
              <div className="text-[#1E293B] font-extrabold mt-1">
                €{totalVal.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Status
              </div>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-lg">
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Notes */}
        <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-slate-50/50 space-y-2">
          <h4 className="text-[12px] font-extrabold text-[#1E293B]">Legal Notes</h4>
          <ul className="list-disc pl-4 text-[11px] font-semibold text-[#64748B] space-y-1">
            <li>
              Invoice issued pursuant to art. 21 of Presidential Decree 26
              October 1972, n. 633 and subsequent amendments.
            </li>
            <li>
              VAT paid by the purchaser pursuant to art. 17, paragraph 5, of
              Presidential Decree 26 October 1972, n. 633.
            </li>
            <li>
              Digitally signed electronic document pursuant to Legislative Decree
              82/2005.
            </li>
            <li>
              Replacement storage of documents pursuant to the Ministerial
              Decree of 17 June 2014.
            </li>
            <li>Competent court: Milan. Applicable law: Italian.</li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] font-semibold text-[#94A3B8] pt-2 border-t border-slate-100">
          SalonFlow Srl - Via Roma, 123 - 20121 Milan (MI) - VAT number
          IT12345678901 - Share Capital: € 10,000.00 i.v. - REA MI-1234567 - SDI
          Code: XXXXXXX - www.salonflow.it
        </div>
      </div>
    </Modal>
  );
}
