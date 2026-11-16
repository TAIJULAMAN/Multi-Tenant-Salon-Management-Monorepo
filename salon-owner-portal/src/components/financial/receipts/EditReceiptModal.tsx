import React, { useState, useEffect } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import { Split } from "lucide-react";

interface EditReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function EditReceiptModal({ isOpen, onClose, onSave, initialData }: EditReceiptModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    clientName: "",
    clientEmail: "",
    amount: "",
    method: "Cash",
    status: "Issued"
  });

  const [isSplit, setIsSplit] = useState(false);
  const [method1, setMethod1] = useState("Cash");
  const [amount1, setAmount1] = useState("");
  const [method2, setMethod2] = useState("Card Terminal");
  const [amount2, setAmount2] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      const rawMethodStr = initialData.method || "Cash";
      const methods = Array.isArray(rawMethodStr)
        ? rawMethodStr
        : rawMethodStr.split(",").map((m: string) => m.trim());

      const hasMultiple = (initialData.payments && initialData.payments.length > 1) || methods.length > 1;
      setIsSplit(hasMultiple);

      if (hasMultiple) {
        if (initialData.payments && initialData.payments.length > 1) {
          setMethod1(initialData.payments[0].method || "Cash");
          setAmount1(String(initialData.payments[0].amount || ""));
          setMethod2(initialData.payments[1].method || "Card Terminal");
          setAmount2(String(initialData.payments[1].amount || ""));
        } else {
          setMethod1(methods[0] || "Cash");
          setMethod2(methods[1] || "Card Terminal");
          const half = Math.round(Number(initialData.amount) / 2) || 0;
          setAmount1(String(half));
          setAmount2(String(Number(initialData.amount) - half));
        }
      } else {
        setMethod1(methods[0] || "Cash");
        setAmount1(initialData.amount ? initialData.amount.toString() : "");
        setMethod2("Card Terminal");
        setAmount2("");
      }

      setFormData({
        id: initialData.id,
        date: initialData.date,
        clientName: initialData.clientName,
        clientEmail: initialData.clientEmail,
        amount: initialData.amount ? initialData.amount.toString() : "",
        method: initialData.method,
        status: initialData.status
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const totalAmount = isSplit
      ? (Number(amount1) || 0) + (Number(amount2) || 0)
      : Number(formData.amount) || 0;

    const payments = isSplit
      ? [
          { method: method1, amount: Number(amount1) || 0 },
          { method: method2, amount: Number(amount2) || 0 }
        ]
      : [{ method: method1, amount: totalAmount }];

    onSave({
      id: formData.id,
      date: formData.date,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      amount: totalAmount,
      method: isSplit ? `${method1}, ${method2}` : method1,
      payments,
      status: formData.status
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Receipt" maxWidth="max-w-2xl">
      <div className="space-y-4 pt-4 font-manrope">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Client Email</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
        </div>

        {/* Split Payment Toggle */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Split className="w-4 h-4 text-[#635BFF]" />
            <div>
              <p className="text-[13px] font-bold text-[#1E293B]">Split Payment (Paid with 2 methods)</p>
              <p className="text-[11px] text-[#64748B]">Client used two different payment methods</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSplit}
              onChange={e => {
                const nextSplit = e.target.checked;
                setIsSplit(nextSplit);
                if (nextSplit && !amount2) {
                  const total = Number(formData.amount) || 0;
                  const half = Math.round(total / 2);
                  setAmount1(String(half));
                  setAmount2(String(total - half));
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#635BFF]"></div>
          </label>
        </div>

        {isSplit ? (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Split Payment Breakdown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 space-y-2">
                <span className="text-[11px] font-bold text-[#635BFF]">Method 1</span>
                <select
                  value={method1}
                  onChange={e => setMethod1(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card Terminal">Card Terminal</option>
                  <option value="Gift Card">Gift Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
                <div>
                  <label className="block text-[10px] text-[#64748B] font-medium mb-1">Amount (€)</label>
                  <input
                    type="number"
                    value={amount1}
                    onChange={e => setAmount1(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 space-y-2">
                <span className="text-[11px] font-bold text-[#635BFF]">Method 2</span>
                <select
                  value={method2}
                  onChange={e => setMethod2(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card Terminal">Card Terminal</option>
                  <option value="Gift Card">Gift Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
                <div>
                  <label className="block text-[10px] text-[#64748B] font-medium mb-1">Amount (€)</label>
                  <input
                    type="number"
                    value={amount2}
                    onChange={e => setAmount2(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[12px] font-bold">
              <span className="text-[#64748B]">Combined Total:</span>
              <span className="text-[#1E293B]">
                € {((Number(amount1) || 0) + (Number(amount2) || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Amount (€)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Method</label>
              <select
                value={method1}
                onChange={e => setMethod1(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white"
              >
                <option value="Cash">Cash</option>
                <option value="Card Terminal">Card Terminal</option>
                <option value="Gift Card">Gift Card</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">Status</label>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white"
          >
            <option value="Issued">Issued</option>
            <option value="Draft">Draft</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
