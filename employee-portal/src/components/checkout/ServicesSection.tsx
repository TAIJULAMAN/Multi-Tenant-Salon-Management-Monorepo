import React from "react";
import { Plus, BookOpen, ChevronDown, MoreVertical } from "lucide-react";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { ServicesSectionProps } from "./types";

export default function ServicesSection({
  services,
  total,
  onOpenServiceModal,
  onBack,
  onCheckout,
  isCheckoutDisabled,
}: ServicesSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#1E293B]">Services</h3>
        {services.length > 0 && (
          <CancelButton onClick={onOpenServiceModal} className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add Service
          </CancelButton>
        )}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        {services.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center border-b border-[#E2E8F0]">
            <div className="w-12 h-12 flex items-center justify-center mb-4 text-[#1E293B]">
              <BookOpen className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="text-[14px] font-bold text-[#1E293B] mb-3">No services added</h4>
            <CancelButton onClick={onOpenServiceModal}>Select Services</CancelButton>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-b border-[#E2E8F0]">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Service</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Price</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Start Time</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Duration</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#1E293B] whitespace-nowrap">Employee</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, idx) => (
                  <tr key={service.id} className={idx !== services.length - 1 ? "border-b border-[#F1F5F9]" : ""}>
                    <td className="px-6 py-5 text-[13px] font-semibold text-[#1E293B]">{service.name}</td>
                    <td className="px-6 py-5 text-[13px] font-medium text-[#64748B]">{service.date}</td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-[#1E293B]">{service.price}</td>
                    <td className="px-6 py-5 text-[13px] font-medium text-[#64748B]">{service.startTime}</td>
                    <td className="px-6 py-5 text-[13px] font-medium text-[#64748B]">{service.duration}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg w-fit">
                        <img src={service.employee.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                        <span className="text-[12px] font-semibold text-[#1E293B]">{service.employee.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] ml-1" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Premium Order Summary */}
        <div className="p-8 bg-[#F8FAFC]">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-[#0F172A]/20 max-w-lg ml-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#16CDC7] opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            
            <h4 className="text-lg font-bold mb-6 relative z-10 text-white/90">Order Summary</h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[14px]">
                <span className="font-medium text-white/70">Tax</span>
                <span className="font-bold text-white">€ 0.00</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="font-medium text-white/70">Discount</span>
                <span className="font-bold text-white">€ 0.00</span>
              </div>
              <div className="w-full border-t border-white/10 my-4" />
              <div className="flex justify-between items-center text-[16px]">
                <span className="font-bold text-white/90">Total</span>
                <span className="font-extrabold text-white text-[28px] tracking-tight">€ {total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-4 sm:p-6 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <CancelButton
            onClick={onBack}
            className="w-full sm:w-auto border-transparent bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B]"
          >
            Back
          </CancelButton>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="shrink-0 w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F1F5F9] transition-colors">
              <MoreVertical className="w-4 h-4 text-[#64748B]" />
            </button>
            <SubmitButton
              onClick={onCheckout}
              disabled={isCheckoutDisabled}
              className="flex-1 sm:flex-none w-full sm:w-auto px-4 sm:px-8 py-2.5"
            >
              Save and Leave
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
}
