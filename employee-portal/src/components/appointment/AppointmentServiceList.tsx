import { ServiceRow } from "@/@types/salon-owner/service.type";
import { BadgePercent, ChevronDown, Plus, Trash2, Scissors } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ITips from "../common-component/ITips";
import SendTipModal from "./add-appointment/SendTipModal";
import AddDiscountModal from "./add-appointment/AddDiscountModal";
import AddBottombar from "./add-appointment/AddBottombar";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import CustomSelect from "@/components/customComponent/CustomSelect";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";

export default function AppointmentServiceList({
  services,
  onUpdateServices,
  baseTotal,
  discountType,
  discountAmount,
  onUpdateDiscount,
  onBack,
  onSave,
  onAddService,
  onDeleteService,
}: {
  services: ServiceRow[];
  onUpdateServices: (services: ServiceRow[]) => void;
  baseTotal: number;
  discountType: string;
  discountAmount: string;
  onUpdateDiscount: (type: string, amount: string) => void;
  onBack?: () => void;
  onSave?: () => void;
  onAddService?: () => void;
  onDeleteService?: (index: number) => void;
}) {
  const moreRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [sendTipOpen, setSendTipOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))
        setMoreOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <>
      {/* ── Modals ── */}
      <SendTipModal open={sendTipOpen} onClose={() => setSendTipOpen(false)} />
      <AddDiscountModal
        open={discountOpen}
        onClose={() => setDiscountOpen(false)}
        initialType={discountType}
        initialAmount={discountAmount}
        subtotal={baseTotal}
        onApply={(type, amount) => {
          onUpdateDiscount(type, amount);
        }}
      />

      <div className="bg-white rounded-xl p-[30px] border border-[#EFF4FA] relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-semibold text-[#29343D]">Services</h3>
          {onAddService && (
            <button
              type="button"
              onClick={onAddService}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-semibold bg-[#F4F3FF] text-[#635BFF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Add Service
            </button>
          )}
        </div>

        {/* ── Scrollable table wrapper or empty state ── */}
        {services.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-[#E2E8F0] rounded-xl mb-4">
            <div className="w-12 h-12 rounded-full bg-[#F4F6FA] flex items-center justify-center mb-3 text-[#98A4AE]">
              <Scissors size={20} />
            </div>
            <p className="text-sm font-semibold text-[#29343D] mb-1">No services added</p>
            <p className="text-xs text-[#98A4AE] mb-4">Add a service to complete checkout</p>
            {onAddService && (
              <button
                type="button"
                onClick={onAddService}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#635BFF] text-white text-xs font-semibold hover:bg-[#4f49e0] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                Select Services
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-[30px] px-[30px] mb-4">
            <div className="min-w-[640px]">
              <div className="rounded-xl overflow-hidden">
                {/* Header */}
                <div className={`grid ${onDeleteService ? "grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr_40px]" : "grid-cols-6"} px-4 py-2.5 border-b border-[#EFF4FA]`}>
                  {[
                    "Service",
                    "Date",
                    "Price",
                    "Start Time",
                    "Duration",
                    "Employee",
                  ].map((h) => (
                    <span
                      key={h}
                      className="text-sm font-manrope text-[#29343D] font-semibold"
                    >
                      {h}
                    </span>
                  ))}
                  {onDeleteService && <span />}
                </div>

                {/* Rows */}
                {services.map((s, i) => (
                  <div
                    key={i}
                    className={`grid ${onDeleteService ? "grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr_40px]" : "grid-cols-6"} items-center px-4 py-5 border-b border-[#EFF4FA] last:border-0`}
                  >
                    <span className="text-sm font-semibold font-manrope text-[#29343D]">
                      {s.name}
                    </span>
                    <span className="text-sm font-manrope font-normal text-[#29343D] w-[60%]">
                      <CustomDatePicker
                        value={s.date || ""}
                        onChange={(val) => {
                          const updated = [...services];
                          updated[i] = { ...updated[i], date: val };
                          onUpdateServices(updated);
                        }}
                        className="border-none shadow-none text-sm font-manrope font-normal px-0 h-auto w-[115px] bg-transparent focus:ring-0"
                      />
                    </span>
                    <span className="text-sm font-manrope font-normal text-[#29343D]">
                      € {s.price}
                    </span>
                    <span className="text-sm font-manrope font-normal text-[#29343D]">
                      <CustomTimePicker
                        value={s.startTime || ""}
                        onChange={(val) => {
                          const updated = [...services];
                          updated[i] = { ...updated[i], startTime: val };
                          onUpdateServices(updated);
                        }}
                        className="w-min"
                        buttonClassName="flex items-center gap-2 border-none shadow-none text-sm font-manrope font-normal px-0 h-auto bg-transparent focus:ring-0 text-[#29343D] whitespace-nowrap"
                      />
                    </span>
                    <span className="text-sm font-manrope font-normal text-[#29343D]">
                      {s.duration ?? "—"}
                    </span>

                    {/* Employee chip */}
                    <div className="flex items-center gap-2.5">
                      <CustomSelect
                        value={s.employee || "Maria Rodriguez"}
                        onChange={(val) => {
                          const updated = [...services];
                          updated[i] = { ...updated[i], employee: val };
                          onUpdateServices(updated);
                        }}
                        options={[
                          { label: "Maria Rodriguez", value: "Maria Rodriguez", icon: "/avatar/icon1.png" },
                          { label: "John Doe", value: "John Doe", icon: "/avatar/icon1.png" },
                        ]}
                        buttonClassName="w-fit min-w-[160px] flex items-center justify-between gap-4 bg-[#F4F6FA] rounded-[10px] py-1.5 px-2.5 text-sm font-semibold font-manrope text-[#29343D] cursor-pointer"
                      />
                    </div>

                    {/* Delete button */}
                    {onDeleteService && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onDeleteService(i)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A4AE] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          title="Remove service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* ── end scrollable table wrapper ── */}

        {/* Order Summary */}
        <div className="border border-[#EFF4FA] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#29343D] mb-3">
            Order Summary
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm text-[#526B7A]">
              <span>Tax</span>
              <span>0</span>
            </div>
            <div className="flex justify-between items-center text-sm text-[#526B7A]">
              <div className="flex items-center gap-2">
                <span>Discount {discountAmount ? `(${discountType === "Percentage" ? discountAmount + "%" : "€ " + discountAmount})` : ""}</span>
                <button onClick={() => setDiscountOpen(true)} className="text-[#635BFF] text-xs hover:underline cursor-pointer">
                  {discountAmount ? "Edit" : "Add"}
                </button>
              </div>
              <span>{discountAmount ? (discountType === "Fixed Amount" ? `- € ${parseFloat(discountAmount) || 0}` : `- € ${(baseTotal * ((parseFloat(discountAmount) || 0) / 100)).toFixed(2)}`) : "0"}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#29343D] pt-2.5">
              <span>Total</span>
              <span>€ {discountType === "Fixed Amount" ? Math.max(0, baseTotal - (parseFloat(discountAmount) || 0)) : Math.max(0, baseTotal * (1 - (parseFloat(discountAmount) || 0) / 100))}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <AddBottombar
          moreRef={moreRef}
          setMoreOpen={setMoreOpen}
          moreOpen={moreOpen}
          icon={<ITips />}
          icon2={<BadgePercent size={15} color="#1C274C" />}
          listLable={"Add a Tip"}
          listLable2={"Add a Discount"}
          setAddNoteOpen={setSendTipOpen}
          setUpfrontOpen={setDiscountOpen}
          hideCheckout={true}
          onBack={onBack}
          onSave={onSave}
        />
      </div>
    </>
  );
}
