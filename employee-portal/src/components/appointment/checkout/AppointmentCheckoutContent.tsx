"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { ServiceRow } from "@/@types/salon-owner/service.type";
import PageHeader from "@/components/common-component/PageHeader";
import AppointmentServiceList from "@/components/appointment/AppointmentServiceList";
import { useRouter } from "next/navigation";
import SearchClientModal from "@/components/checkout/SearchClientModal";
import SearchServiceModal from "@/components/checkout/SearchServiceModal";
import { PaymentMethodId, IconProps } from "./types";
import {
  CashIcon,
  CardIcon,
  OnlineIcon,
  GiftIcon,
} from "./icons";
import {
  PrintReceiptModal,
  CardTerminalModal,
  OnlinePaymentModal,
  GiftCardModal,
  DividePaymentModal,
} from "./modals";

export interface CheckoutContentProps {
  onBack?: () => void;
  onSave?: () => void;
  breadcrumb?: { label: string; active: boolean }[];
  showClientCard?: boolean;
  initialClient?: {
    id?: number | string;
    name: string;
    avatar: string;
    phone?: string;
    email?: string;
  } | null;
  initialServices?: ServiceRow[];
  allowAddService?: boolean;
  allowDeleteService?: boolean;
}

export type CheckoutPageProps = CheckoutContentProps;

type ActiveModal =
  | null
  | "cash"
  | "card"
  | "online"
  | "gift"
  | "divide"
  | "online-combo";

const INITIAL_SERVICES: ServiceRow[] = [
  {
    name: "Haircut",
    date: "2025-08-02",
    price: 170,
    startTime: "11:00",
    duration: "15 min",
    employee: "Maria Rodriguez",
  },
];

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  Icon: React.FC<IconProps>;
}[] = [
  { id: "cash", label: "Cash", Icon: CashIcon },
  { id: "card", label: "Card Terminal", Icon: CardIcon },
  { id: "online", label: "Online Payment", Icon: OnlineIcon },
  { id: "gift", label: "Gift Card", Icon: GiftIcon },
];

export default function AppointmentCheckoutContent({
  onBack,
  onSave,
  breadcrumb = [{ label: "Appointments", active: true }],
  showClientCard = false,
  initialClient = null,
  initialServices = INITIAL_SERVICES,
  allowAddService = false,
  allowDeleteService = false,
}: CheckoutContentProps) {
  const router = useRouter();

  const [client, setClient] = useState(initialClient);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [discountType, setDiscountType] = useState<string>("Percentage");
  const [discountAmount, setDiscountAmount] = useState<string>("");

  useEffect(() => {
    if (initialClient !== undefined) {
      setClient(initialClient);
    }
  }, [initialClient]);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServices(initialServices);
    }
  }, [initialServices]);

  const baseTotal = services.reduce((sum, s) => sum + Number(s.price), 0);
  const total =
    discountType === "Fixed Amount"
      ? Math.max(0, baseTotal - (parseFloat(discountAmount) || 0))
      : Math.max(0, baseTotal * (1 - (parseFloat(discountAmount) || 0) / 100));

  const [selected, setSelected] = useState<PaymentMethodId[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handlePaymentComplete = () => {
    if (onSave) {
      onSave();
    }
  };

  function toggleMethod(id: PaymentMethodId): void {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleContinue(): void {
    const hasOnline = selected.includes("online");
    const others = selected.filter((x) => x !== "online") as PaymentMethodId[];

    if (hasOnline && others.length >= 1) {
      setActiveModal("online-combo");
      return;
    }
    if (selected.length >= 2) {
      setActiveModal("divide");
      return;
    }
    if (selected.includes("cash")) {
      setActiveModal("cash");
      return;
    }
    if (selected.includes("card")) {
      setActiveModal("card");
      return;
    }
    if (selected.includes("online")) {
      setActiveModal("online");
      return;
    }
    if (selected.includes("gift")) {
      setActiveModal("gift");
      return;
    }
  }

  const close = (): void => setActiveModal(null);

  const nonOnline = selected.filter((x) => x !== "online") as PaymentMethodId[];
  const divideA: PaymentMethodId = nonOnline[0] ?? "cash";
  const divideB: PaymentMethodId = nonOnline[1] ?? "card";

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-manrope flex flex-col">
      <PageHeader
        title="Checkout"
        onBack={onBack || (() => router.back())}
        breadcrumb={breadcrumb}
        showBackButton={true}
      />

      <div className="flex-1 overflow-y-auto mt-6 space-y-4 pb-6">
        {/* Client Information Card (when showClientCard is true) */}
        {showClientCard && (
          <div className="bg-white rounded-xl p-[24px] border border-[#E0E6EB]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-[#29343D]">Client Information</h3>
              <button
                type="button"
                onClick={() => setIsClientModalOpen(true)}
                className="text-xs font-semibold text-[#635BFF] hover:underline cursor-pointer"
              >
                {client ? "Change Client" : "Select Client"}
              </button>
            </div>
            <p className="text-xs text-[#98A4AE] mb-4">
              {client ? "Associated client for this receipt." : "Select a client or proceed as walk-in customer."}
            </p>

            {client ? (
              <div className="flex items-center justify-between p-3.5 bg-[#F4F6FA] rounded-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#E2E8F0] shrink-0">
                    <img
                      src={client.avatar || "/avatar/icon1.png"}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#29343D]">{client.name}</div>
                    <div className="text-xs text-[#98A4AE] font-medium">{client.phone || client.email || "Registered Client"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#635BFF] bg-[#EEF2FF] px-2.5 py-1 rounded-full">
                    Client
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsClientModalOpen(true)}
                className="flex items-center justify-between p-3.5 bg-[#F8FAFC] border border-dashed border-[#CBD5E1] hover:border-[#635BFF] rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#635BFF] group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#29343D]">Walk-in Client (None Selected)</div>
                    <div className="text-xs text-[#98A4AE]">Click to assign a registered client to this receipt</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#635BFF] px-3 py-1.5 rounded-[8px] bg-[#EEF2FF] group-hover:bg-[#635BFF] group-hover:text-white transition-colors cursor-pointer"
                >
                  Select Client
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-[30px] border border-[#E0E6EB]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#29343D]">
              Payment Methods
            </h3>
            <button
              onClick={handleContinue}
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                selected.length > 0
                  ? "bg-[#635BFF] hover:bg-[#4f49e0] text-white cursor-pointer"
                  : "bg-[#E0E6EB] text-[#98A4AE] cursor-not-allowed"
              }`}
            >
              Continue Payment
            </button>
          </div>
          <p className="text-xs font-manrope text-[#98A4AE] mb-4">
            Select one or more methods.
          </p>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
            {PAYMENT_METHODS.map(({ id, label, Icon }) => {
              const isSelected = selected.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleMethod(id)}
                  className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#635BFF] bg-[#F4F3FF]"
                      : "border-[#EFF4FA] bg-white hover:border-[#DDDBFF]"
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      isSelected ? "bg-[#635BFF]" : "bg-[#DDDBFF]"
                    }`}
                  >
                    <Icon white={isSelected} />
                  </div>
                  <span className="text-sm font-medium text-[#29343D]">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <AppointmentServiceList
          services={services}
          onUpdateServices={setServices}
          baseTotal={baseTotal}
          discountType={discountType}
          discountAmount={discountAmount}
          onUpdateDiscount={(type, amount) => {
            setDiscountType(type);
            setDiscountAmount(amount);
          }}
          onBack={onBack}
          onSave={onSave}
          onAddService={allowAddService ? () => setIsServiceModalOpen(true) : undefined}
          onDeleteService={allowDeleteService ? (index) => setServices((prev) => prev.filter((_, i) => i !== index)) : undefined}
        />
      </div>

      <PrintReceiptModal
        open={activeModal === "cash"}
        onClose={close}
        twoOptions={false}
        onComplete={handlePaymentComplete}
      />
      <CardTerminalModal
        open={activeModal === "card"}
        onClose={close}
        total={total}
        onComplete={handlePaymentComplete}
      />
      <OnlinePaymentModal
        open={activeModal === "online"}
        onClose={close}
        client={client}
        onComplete={handlePaymentComplete}
      />
      <GiftCardModal
        open={activeModal === "gift"}
        onClose={close}
        total={total}
        onComplete={handlePaymentComplete}
      />
      <DividePaymentModal
        open={activeModal === "divide"}
        onClose={close}
        methodA={divideA}
        methodB={divideB}
        total={total}
        onComplete={handlePaymentComplete}
      />
      <PrintReceiptModal
        open={activeModal === "online-combo"}
        onClose={close}
        twoOptions={true}
        onComplete={handlePaymentComplete}
      />

      <SearchClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={(c) => {
          setClient(c);
          setIsClientModalOpen(false);
        }}
      />
      <SearchServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSelectService={(s) => {
          const rawPrice =
            typeof s.estimatedPrice === "string"
              ? parseFloat(s.estimatedPrice.replace(/[^0-9.]/g, "")) || 170
              : s.estimatedPrice || 170;
          const newService: ServiceRow = {
            id: String(Date.now()),
            name: s.name,
            date: "2025-08-02",
            price: rawPrice,
            startTime: "11:00",
            duration: s.duration || "45 min",
            employee: "Maria Rodriguez",
            employeeAvatar: "/avatar/icon1.png",
          };
          setServices((prev) => [...prev, newService]);
          setIsServiceModalOpen(false);
        }}
      />
    </div>
  );
}
