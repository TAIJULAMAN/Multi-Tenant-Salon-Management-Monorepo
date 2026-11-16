"use client";

import React from "react";
import {
  Download,
  CheckCircle2,
  Building2,
  User,
  FileText,
  CreditCard,
} from "lucide-react";
import { useParams } from "next/navigation";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import { CustomButton } from "@/components/common/CustomButton";

export default function ServiceReceiptPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <style jsx global>{`
        @media print {
          /* Hide the top header and sidebars during print */
          header,
          aside,
          .print-hidden {
            display: none !important;
          }
          /* Ensure the background stays clean */
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .min-h-screen {
            min-height: auto !important;
          }
          .shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-[#F8FAFC] pb-12 font-manrope">
        {/* Top Bar */}
        <div className="print-hidden">
          <CustomSubPageHeader
            title="Service Receipt"
            backUrl={`/dashboard/financial/payments/${id}`}
            rightContent={
              <CustomButton
                variant="light-purple"
                icon={Download}
                title="Download PDF"
                onClick={() => window.print()}
              />
            }
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Main Receipt Container */}
          <div>
            <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-[#EEF2F6] overflow-hidden relative">
              {/* Header Accent */}
              <div className="h-2 w-full bg-gradient-to-r from-[#635BFF] to-[#16CDC7]"></div>

              <div className="p-8 md:p-10">
                {/* Top Section: Invoice Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
                      Invoice
                    </h1>
                    <p className="text-[#64748B] text-sm mt-1 font-medium">
                      Original electronic fiscal document
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] min-w-[140px]">
                      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                        Receipt No.
                      </div>
                      <div className="text-lg font-extrabold text-[#635BFF]">
                        2025-000123
                      </div>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] min-w-[140px]">
                      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                        Date Issued
                      </div>
                      <div className="text-lg font-extrabold text-[#1E293B]">
                        11/30/2024
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parties Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Transferor */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAFAFE] to-white border border-[#EEF2F8] relative overflow-hidden group hover:border-[#D9D7FF] transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Building2 className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#ECEAFF] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[#635BFF]" />
                      </div>
                      <h2 className="text-[15px] font-bold text-[#1E293B]">
                        Transferor / Provider
                      </h2>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div>
                        <div className="text-base font-extrabold text-[#1E293B]">
                          Bella Vista Salon
                        </div>
                        <div className="text-sm text-[#64748B] mt-1 leading-relaxed">
                          Via Roma, 123
                          <br />
                          20121 Milan (MI) - Italy
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-[#EEF2F8]">
                        <div>
                          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            P.IVA
                          </div>
                          <div className="text-[13px] font-bold text-[#1E293B]">
                            IT12345678901
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            Telephone
                          </div>
                          <div className="text-[13px] font-bold text-[#1E293B]">
                            +39 02 1234567
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            Email
                          </div>
                          <div className="text-[13px] font-bold text-[#635BFF]">
                            fatturazione@salonflow.it
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transferee */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAFAFE] to-white border border-[#EEF2F8] relative overflow-hidden group hover:border-[#D9D7FF] transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <User className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#E5F9F6] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#16CDC7]" />
                      </div>
                      <h2 className="text-[15px] font-bold text-[#1E293B]">
                        Transferee / Client
                      </h2>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div>
                        <div className="text-base font-extrabold text-[#1E293B]">
                          Maria Rodriguez
                        </div>
                        <div className="text-sm text-[#64748B] mt-1 leading-relaxed">
                          Via Esempio, 456
                          <br />
                          10100 Turin (TO) - Italy
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-y-3 pt-4 border-t border-[#EEF2F8]">
                        <div>
                          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            Tax Code
                          </div>
                          <div className="text-[13px] font-bold text-[#1E293B]">
                            98765432109
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Dashed Divider */}
                <div className="relative flex items-center justify-center mb-10">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t-[2px] border-dashed border-[#E2E8F0]" />
                  </div>
                  <div className="relative bg-white px-4">
                    <div className="w-2 h-2 rounded-full bg-[#E2E8F0]"></div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F4] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#FF6692]" />
                    </div>
                    <h2 className="text-lg font-extrabold text-[#1E293B]">
                      Service Details
                    </h2>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-[#EEF2F8]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFAFE] border-b border-[#EEF2F8]">
                          <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-[40%]">
                            Service Name
                          </th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">
                            Qty
                          </th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                            Unit Price
                          </th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                            VAT
                          </th>
                          <th className="py-4 px-6 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEF2F8]">
                        <tr className="hover:bg-[#FAFAFE] transition-colors group">
                          <td className="py-5 px-6">
                            <div className="text-[14px] font-bold text-[#1E293B]">
                              Haircut
                            </div>
                          </td>
                          <td className="py-5 px-6 text-[14px] font-medium text-[#475569] text-center">
                            1
                          </td>
                          <td className="py-5 px-6 text-[14px] font-medium text-[#475569] text-right">
                            € 245.08
                          </td>
                          <td className="py-5 px-6 text-[14px] font-medium text-[#475569] text-right">
                            <span className="inline-flex items-center justify-center bg-gray-100 px-2 py-0.5 rounded-full text-[11px] font-bold text-gray-600">
                              22%
                            </span>
                          </td>
                          <td className="py-5 px-6 text-[14px] font-extrabold text-[#1E293B] text-right">
                            € 245.08
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals & Payments Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  {/* Payment Methods */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#FFF8E6] flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-[#FFB300]" />
                      </div>
                      <h2 className="text-lg font-extrabold text-[#1E293B]">
                        Payment Methods
                      </h2>
                    </div>
                    <div className="bg-[#FAFAFE] rounded-2xl border border-[#EEF2F8] p-5 space-y-4">
                      {[
                        {
                          method: "Credit Card",
                          date: "12/02/2024",
                          amount: "€ 100",
                          status: "Paid",
                        },
                        {
                          method: "Gift Card",
                          date: "12/02/2024",
                          amount: "€ 70",
                          status: "Paid",
                        },
                      ].map((payment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-[#EEF2F8]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                              <CreditCard className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <div>
                              <div className="text-[13px] font-extrabold text-[#1E293B]">
                                {payment.method}
                              </div>
                              <div className="text-[11px] font-medium text-[#94A3B8]">
                                {payment.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[14px] font-extrabold text-[#1E293B]">
                              {payment.amount}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-[#10B981] mt-0.5">
                              <CheckCircle2 className="w-3 h-3" />{" "}
                              {payment.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div>
                    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#0F172A]/20">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#16CDC7] opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                      <h2 className="text-lg font-bold mb-6 relative z-10 text-white/90">
                        Summary
                      </h2>
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-white/70">
                            Taxable Amount
                          </span>
                          <span className="text-[14px] font-bold text-white">
                            € 170.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-white/70">
                            Total VAT (22%)
                          </span>
                          <span className="text-[14px] font-bold text-white">
                            € 0.00
                          </span>
                        </div>
                        <div className="w-full border-t border-white/10 my-4" />
                        <div className="flex items-center justify-between">
                          <span className="text-[16px] font-bold text-white/90">
                            Document Total
                          </span>
                          <span className="text-[28px] font-extrabold text-white tracking-tight">
                            € 170.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal Notes */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#EEF2F8]">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">
                    Legal & Additional Information
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      "Invoice issued pursuant to art. 21 of Presidential Decree 26 October 1972, n. 633.",
                      "VAT paid by the purchaser pursuant to art. 17, paragraph 6.",
                      "Digitally signed electronic document pursuant to Legislative Decree 82/2005.",
                      "Replacement storage of documents pursuant to the Ministerial Decree of 17 June 2014.",
                      "Competent court: Milan. Applicable law: Italian.",
                    ].map((note, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#64748B] shrink-0 mt-1.5 opacity-60"></div>
                        <span className="text-[11px] text-[#64748B] leading-relaxed font-medium">
                          {note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Outside Card */}
            <div className="mt-8 text-center px-4">
              <p className="text-[11px] font-medium text-[#94A3B8] leading-relaxed max-w-3xl mx-auto">
                <strong className="font-bold text-[#64748B]">
                  SalonFlow Srl
                </strong>{" "}
                - Via Roma, 123 - 20121 Milan (MI) - VAT number: IT12345678901 -
                SDI Code: XXXXXXX <br />
                Share Capital: € 10,000.00 i.v. - REA MI-1234567 <br />
                <span className="inline-flex gap-4 mt-2">
                  <span>www.salonflow.it</span>
                  <span>info@salonflow.it</span>
                  <span>Tel: +39 02 1234567</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
