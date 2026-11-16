"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import BasicInformationSection from "@/components/checkout/BasicInformationSection";
import PaymentMethodsSection from "@/components/checkout/PaymentMethodsSection";
import ServicesSection from "@/components/checkout/ServicesSection";
import SearchClientModal from "@/components/checkout/SearchClientModal";
import SearchServiceModal from "@/components/checkout/SearchServiceModal";
import DividePaymentModal from "@/components/checkout/DividePaymentModal";
import PrintReceiptModal from "@/components/appointment/checkout/modals/PrintReceiptModal";
import ReceiptSuccessModal from "@/components/dashboard/ReceiptSuccessModal";
import ActiveGiftCardWarningModal from "@/components/checkout/ActiveGiftCardWarningModal";

export default function DashboardCheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientName = searchParams.get("clientName");
  const clientAvatar = searchParams.get("clientAvatar");
  const serviceName = searchParams.get("serviceName");
  const servicePrice = searchParams.get("servicePrice");
  const teamMember = searchParams.get("teamMember");
  const time = searchParams.get("time");

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDivideModalOpen, setIsDivideModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showGiftCardWarning, setShowGiftCardWarning] = useState(false);

  const clientActiveGiftCards = 2;

  const [selectedClient, setSelectedClient] = useState<any>(() => {
    if (clientName) {
      return {
        id: searchParams.get("appointmentId") || "1",
        name: clientName,
        avatar: clientAvatar || "https://i.pravatar.cc/100?img=5",
        phone: "+39 345 678 9123",
      };
    }
    return {
      id: 1,
      name: "Maria Rodriguez",
      phone: "+39 345 678 9123",
      avatar: "https://i.pravatar.cc/100?img=5",
    };
  });

  const [services, setServices] = useState<any[]>(() => {
    if (serviceName) {
      const priceNum = servicePrice ? parseFloat(servicePrice) : 170;
      return [
        {
          id: Date.now(),
          name: serviceName,
          date: "02/08/2025",
          price: `€ ${isNaN(priceNum) ? 170 : priceNum}`,
          startTime: time || "11:00",
          duration: "15 min",
          employee: {
            name: teamMember || "Maria Rodriguez",
            avatar: "/avatar/icon1.png",
          },
        },
      ];
    }
    return [
      {
        id: 1,
        name: "Haircut",
        date: "02/08/2025",
        price: "€ 170",
        startTime: "11:00",
        duration: "15 min",
        employee: {
          name: "Maria Rodriguez",
          avatar: "https://i.pravatar.cc/100?img=5",
        },
      },
    ];
  });

  const [activePaymentMethods, setActivePaymentMethods] = useState<string[]>([
    "Cash",
  ]);

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    setIsClientModalOpen(false);
  };

  const handleSelectService = (service: any) => {
    const rawPrice = service.estimatedPrice
      ? parseFloat(service.estimatedPrice.replace(/[^0-9.]/g, ""))
      : 170;
    const serviceToAdd = {
      ...service,
      id: Date.now(),
      date: "02/08/2025",
      price: `€ ${rawPrice}`,
      startTime: "11:00",
      duration: service.duration || "15 min",
      employee: {
        name: "Maria Rodriguez",
        avatar: "https://i.pravatar.cc/100?img=5",
      },
    };
    setServices((prev) => [...prev, serviceToAdd]);
    setIsServiceModalOpen(false);
  };

  const total = useMemo(() => {
    return services.reduce((acc, s) => {
      const num =
        typeof s.price === "number"
          ? s.price
          : parseFloat(String(s.price).replace(/[^0-9.]/g, "")) || 0;
      return acc + num;
    }, 0);
  }, [services]);

  const handlePaymentToggle = (id: string) => {
    setActivePaymentMethods((prev) => {
      if (prev.includes(id)) {
        if (prev.length > 1) {
          return prev.filter((m) => m !== id);
        }
        return prev;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCheckout = (bypassWarning = false) => {
    if (
      !bypassWarning &&
      clientActiveGiftCards > 0 &&
      !activePaymentMethods.includes("Gift Card")
    ) {
      setShowGiftCardWarning(true);
      return;
    }
    if (activePaymentMethods.length > 1) {
      setIsDivideModalOpen(true);
    } else {
      setIsPrintModalOpen(true);
    }
  };

  const handlePrintComplete = () => {
    setIsPrintModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 font-manrope">
      <div className="top-0 z-10 w-full">
        <CustomPageHeader
          title="Checkout"
          action={
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[13px] font-semibold text-[#64748B] hover:text-[#635BFF] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>/</span>
              <span className="bg-[#EEF2FF] text-[#635BFF] px-2 py-1 rounded-lg">
                Dashboard
              </span>
            </Link>
          }
        />
      </div>

      <div className="py-6 w-full space-y-6 pb-24 max-w-[1280px] mx-auto px-4 sm:px-6">
        <BasicInformationSection
          selectedClient={selectedClient}
          onOpenClientModal={() => setIsClientModalOpen(true)}
        />
        <PaymentMethodsSection
          activePaymentMethods={activePaymentMethods}
          onPaymentToggle={handlePaymentToggle}
          activeGiftCardsCount={clientActiveGiftCards}
        />
        <ServicesSection
          services={services}
          total={total}
          onOpenServiceModal={() => setIsServiceModalOpen(true)}
          onBack={() => router.back()}
          onCheckout={() => handleCheckout(false)}
          isCheckoutDisabled={
            activePaymentMethods.length === 0 || services.length === 0
          }
        />
      </div>

      <SearchClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={handleSelectClient}
      />
      <SearchServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSelectService={handleSelectService}
      />
      <DividePaymentModal
        isOpen={isDivideModalOpen}
        onClose={() => setIsDivideModalOpen(false)}
        totalAmount={total}
        selectedMethods={activePaymentMethods}
        onConfirmSuccess={() => {
          setIsDivideModalOpen(false);
          setIsPrintModalOpen(true);
        }}
      />
      <PrintReceiptModal
        open={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onComplete={handlePrintComplete}
        twoOptions
      />
      <ReceiptSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
      />
      <ActiveGiftCardWarningModal
        isOpen={showGiftCardWarning}
        onGoBack={() => setShowGiftCardWarning(false)}
        onContinueAnyway={() => {
          setShowGiftCardWarning(false);
          handleCheckout(true);
        }}
        activeCardsCount={clientActiveGiftCards}
      />
    </div>
  );
}
