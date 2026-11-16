"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common-component/PageHeader";
import AppointmentServiceList from "@/components/saloonOwner/appointment/AppointmentServiceList";
import SearchClientModal from "@/components/checkout/SearchClientModal";
import SearchServiceModal from "@/components/checkout/SearchServiceModal";
import { ServiceRow } from "@/@types/salon-owner/service.type";

import {
  CheckoutContentProps,
  PaymentMethodId,
  ActiveModal,
  CheckoutClient,
} from "./types";
import { INITIAL_SERVICES } from "./data";

import CheckoutClientCard from "./components/CheckoutClientCard";
import PaymentMethodsSelector from "./components/PaymentMethodsSelector";
import CheckoutSummary from "./components/CheckoutSummary";

import PrintReceiptModal from "./modals/PrintReceiptModal";
import ReceiptSuccessModal from "@/components/dashboard/ReceiptSuccessModal";
import CardTerminalModal from "./modals/CardTerminalModal";
import OnlinePaymentModal from "./modals/OnlinePaymentModal";
import GiftCardModal from "./modals/GiftCardModal";
import DividePaymentModal from "./modals/DividePaymentModal";
import ActiveGiftCardWarningModal from "@/components/checkout/ActiveGiftCardWarningModal";

export default function AppointmentCheckoutContent({
  onBack,
  onSave,
  breadcrumb,
  showClientCard = true,
  initialClient = null,
  initialServices,
  allowDeleteService = true,
}: CheckoutContentProps) {
  const router = useRouter();
  const [client, setClient] = useState<CheckoutClient | null>(
    initialClient || {
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=maria",
      phone: "+1 234 567 890",
      email: "maria.rodriguez@example.com",
    },
  );
  const [services, setServices] = useState<ServiceRow[]>(
    initialServices || INITIAL_SERVICES,
  );
  const [searchClientOpen, setSearchClientOpen] = useState(false);
  const [searchServiceOpen, setSearchServiceOpen] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethodId[]>([
    "cash",
  ]);
  const [divided, setDivided] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [showGiftCardWarning, setShowGiftCardWarning] = useState(false);
  const [discountType, setDiscountType] = useState<string>("Fixed Amount");
  const [discountAmount, setDiscountAmount] = useState<string>("0");
  const [tip, setTip] = useState<number>(0);

  const clientActiveGiftCards = 2; // Active gift cards associated with client

  const baseTotal = services.reduce((acc, s) => acc + Number(s.price || 0), 0);
  const discountVal =
    discountType === "Fixed Amount"
      ? parseFloat(discountAmount) || 0
      : (baseTotal * (parseFloat(discountAmount) || 0)) / 100;
  const tax = baseTotal * 0.1;
  const total = Math.max(0, baseTotal + tax + tip - discountVal);

  function handleToggleMethod(id: PaymentMethodId) {
    if (selectedMethods.includes(id)) {
      if (selectedMethods.length > 1) {
        const next = selectedMethods.filter((m) => m !== id);
        setSelectedMethods(next);
        if (next.length === 1) setDivided(false);
      }
    } else {
      const next = [...selectedMethods, id];
      setSelectedMethods(next);
      if (next.length > 1) {
        setDivided(true);
      }
    }
  }

  function handleInitiatePay(bypassWarning = false) {
    // If client has active gift cards and gift card is not selected, warn the user
    if (!bypassWarning && clientActiveGiftCards > 0 && !selectedMethods.includes("gift")) {
      setShowGiftCardWarning(true);
      return;
    }

    if (divided || selectedMethods.length >= 2) {
      setActiveModal("divide");
    } else {
      const singleMethod = selectedMethods[0];
      if (singleMethod === "card") setActiveModal("card");
      else if (singleMethod === "online") setActiveModal("online");
      else if (singleMethod === "gift") setActiveModal("gift");
      else setPrintModalOpen(true);
    }
  }

  function handleCompletePaymentFlow() {
    setActiveModal(null);
    setPrintModalOpen(true);
  }

  function handleFinalComplete() {
    setPrintModalOpen(false);
    setSuccessModalOpen(true);
  }

  function handleSuccessClose() {
    setSuccessModalOpen(false);
    if (onSave) onSave();
    else router.push("/dashboard/appointment");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <PageHeader
        title="Appointment Checkout"
        onBack={onBack || (() => router.back())}
        breadcrumb={
          breadcrumb || [
            { label: "Dashboard", active: false },
            { label: "Appointments", active: false },
            { label: "Checkout", active: true },
          ]
        }
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Client, Services, Payment Selector */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {showClientCard && (
              <CheckoutClientCard
                client={client}
                onOpenSearch={() => setSearchClientOpen(true)}
                onClear={() => setClient(null)}
              />
            )}

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E6EB] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-[#1E293B]">
                  Selected Services ({services.length})
                </h3>
              </div>
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
                onDeleteService={
                  allowDeleteService
                    ? (idx) =>
                        setServices((prev) => prev.filter((_, i) => i !== idx))
                    : undefined
                }
              />
            </div>

            <PaymentMethodsSelector
              selectedMethods={selectedMethods}
              onToggleMethod={handleToggleMethod}
              divided={divided}
              onToggleDivided={() => {
                const nextDivided = !divided;
                setDivided(nextDivided);
                if (nextDivided && selectedMethods.length < 2) {
                  setSelectedMethods(["cash", "card"]);
                } else if (!nextDivided) {
                  setSelectedMethods([selectedMethods[0] || "cash"]);
                }
              }}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-6">
            <CheckoutSummary
              subtotal={baseTotal}
              tax={tax}
              discount={discountVal}
              tip={tip}
              onApplyDiscount={(amount) => {
                setDiscountType("Fixed Amount");
                setDiscountAmount(String(amount));
              }}
              onSetTip={setTip}
              onPay={handleInitiatePay}
              disabled={services.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SearchClientModal
        isOpen={searchClientOpen}
        onClose={() => setSearchClientOpen(false)}
        onSelectClient={(c) => {
          setClient({
            id: c.id,
            name: c.name,
            avatar: c.avatar || "https://i.pravatar.cc/150",
            phone: c.phone,
            email: c.email,
          });
          setSearchClientOpen(false);
        }}
      />

      <SearchServiceModal
        isOpen={searchServiceOpen}
        onClose={() => setSearchServiceOpen(false)}
        onSelectService={(s) => {
          setServices((prev) => [
            ...prev,
            {
              name: s.name,
              date: "2025-08-02",
              price: s.price || 50,
              startTime: "12:00",
              duration: s.duration || "30 min",
              employee: "Maria Rodriguez",
            },
          ]);
          setSearchServiceOpen(false);
        }}
      />

      <CardTerminalModal
        open={activeModal === "card"}
        onClose={() => setActiveModal(null)}
        onComplete={handleCompletePaymentFlow}
      />

      <OnlinePaymentModal
        open={activeModal === "online"}
        onClose={() => setActiveModal(null)}
        onComplete={handleCompletePaymentFlow}
        total={total}
      />

      <GiftCardModal
        open={activeModal === "gift"}
        onClose={() => setActiveModal(null)}
        onComplete={handleCompletePaymentFlow}
      />

      <DividePaymentModal
        open={activeModal === "divide"}
        onClose={() => setActiveModal(null)}
        methodA={selectedMethods[0] || "cash"}
        methodB={selectedMethods[1] || "card"}
        total={total}
        onComplete={handleCompletePaymentFlow}
      />

      <PrintReceiptModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        onComplete={handleFinalComplete}
        twoOptions
      />

      <ReceiptSuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessClose}
      />

      <ActiveGiftCardWarningModal
        isOpen={showGiftCardWarning}
        onGoBack={() => setShowGiftCardWarning(false)}
        onContinueAnyway={() => {
          setShowGiftCardWarning(false);
          handleInitiatePay(true);
        }}
        activeCardsCount={clientActiveGiftCards}
      />
    </div>
  );
}
