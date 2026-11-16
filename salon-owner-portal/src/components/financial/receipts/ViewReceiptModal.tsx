import React from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import { Banknote, CreditCard, Ticket, Globe, Split } from "lucide-react";

interface PaymentMethodBreakdown {
  method: string;
  amount: number;
}

interface ViewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData?: any;
}

export default function ViewReceiptModal({ isOpen, onClose, receiptData }: ViewReceiptModalProps) {
  if (!receiptData) return null;

  // Resolve payment methods and split amounts
  const rawMethods = Array.isArray(receiptData.method)
    ? receiptData.method
    : receiptData.method
    ? receiptData.method.split(",").map((m: string) => m.trim())
    : ["Cash"];

  let paymentBreakdown: PaymentMethodBreakdown[] = [];

  if (Array.isArray(receiptData.payments) && receiptData.payments.length > 0) {
    paymentBreakdown = receiptData.payments;
  } else if (Array.isArray(receiptData.paymentMethods) && receiptData.paymentMethods.length > 0) {
    paymentBreakdown = receiptData.paymentMethods;
  } else if (rawMethods.length > 1) {
    // If multiple methods are listed but amounts weren't specified, split equally
    const halfAmount = Math.round(receiptData.amount / rawMethods.length);
    paymentBreakdown = rawMethods.map((m: string, idx: number) => ({
      method: m,
      amount: idx === rawMethods.length - 1 ? receiptData.amount - halfAmount * (rawMethods.length - 1) : halfAmount,
    }));
  } else {
    paymentBreakdown = [
      {
        method: rawMethods[0] || "Cash",
        amount: receiptData.amount,
      },
    ];
  }

  const isSplitPayment = paymentBreakdown.length > 1;

  const getMethodDetails = (method: string) => {
    switch (method) {
      case "Cash":
        return {
          icon: <Banknote className="w-4 h-4 text-[#16A34A]" />,
          style: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30",
          label: "Cash",
        };
      case "Card Terminal":
      case "On Card":
      case "Credit Card":
        return {
          icon: <CreditCard className="w-4 h-4 text-[#0D9488]" />,
          style: "bg-[#CCFBF1] text-[#0D9488] border border-[#0D9488]/30",
          label: method === "On Card" || method === "Credit Card" ? method : "Card Terminal",
        };
      case "Gift Card":
        return {
          icon: <Ticket className="w-4 h-4 text-[#9333EA]" />,
          style: "bg-[#F3E8FF] text-[#9333EA] border border-[#9333EA]/30",
          label: "Gift Card",
        };
      case "Online Payment":
        return {
          icon: <Globe className="w-4 h-4 text-[#D97706]" />,
          style: "bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30",
          label: "Online Payment",
        };
      default:
        return {
          icon: <Banknote className="w-4 h-4 text-[#475569]" />,
          style: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
          label: method,
        };
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt Details" maxWidth="max-w-2xl">
      <div className="space-y-4 pt-4 font-manrope">
        {/* Client and Total Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Client</label>
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B]">
              <div>{receiptData.clientName}</div>
              <div className="text-[11px] text-[#64748B] font-medium">{receiptData.clientEmail}</div>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
              Total Amount
            </label>
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-bold text-[#1E293B] flex items-center justify-between">
              <span>€ {Number(receiptData.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {isSplitPayment && (
                <span className="text-[10px] font-bold text-[#635BFF] bg-[#EEF2FF] border border-[#635BFF]/30 px-2 py-0.5 rounded-[6px] flex items-center gap-1">
                  <Split className="w-3 h-3" /> Split Payment
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Date and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Date</label>
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B]">
              {receiptData.date}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Status</label>
            <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-[13px] font-semibold text-[#1E293B] flex items-center">
              <span
                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold border ${
                  receiptData.status === "Issued"
                    ? "bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/30"
                    : receiptData.status === "Draft"
                    ? "bg-[#FBBF24]/10 text-[#D97706] border-[#FBBF24]/30"
                    : "bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/30"
                }`}
              >
                {receiptData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Section (Accounting for single & split payments) */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wide">
              {isSplitPayment ? "Payment Breakdown (Split Payment)" : "Payment Method"}
            </label>
            <span className="text-[11px] font-medium text-[#64748B]">
              {paymentBreakdown.length} {paymentBreakdown.length === 1 ? "method used" : "methods used"}
            </span>
          </div>

          <div className="space-y-2">
            {paymentBreakdown.map((item, idx) => {
              const details = getMethodDetails(item.method);
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      {details.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#1E293B]">{details.label}</span>
                        {isSplitPayment && (
                          <span className="text-[10px] text-[#64748B] font-medium">
                            (Method {idx + 1})
                          </span>
                        )}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-bold mt-0.5 ${details.style}`}>
                        Paid via {details.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-[#94A3B8] font-medium">Amount Paid</div>
                    <div className="text-[13px] font-bold text-[#1E293B]">
                      € {Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {isSplitPayment && (
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] font-bold">
              <span className="text-[#64748B]">Total Paid:</span>
              <span className="text-[#1E293B]">
                € {paymentBreakdown.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
