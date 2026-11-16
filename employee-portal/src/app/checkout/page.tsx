"use client";

import React, { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppointmentCheckoutContent from "@/components/appointment/checkout/AppointmentCheckoutContent";
import { ServiceRow } from "@/@types/salon-owner/service.type";

function DashboardCheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clientName = searchParams.get("clientName");
  const clientAvatar = searchParams.get("clientAvatar");
  const serviceName = searchParams.get("serviceName");
  const servicePrice = searchParams.get("servicePrice");
  const teamMember = searchParams.get("teamMember");
  const time = searchParams.get("time");

  const initialClient = useMemo(() => {
    if (clientName) {
      return {
        id: searchParams.get("appointmentId") || "1",
        name: clientName,
        avatar: clientAvatar || "/avatar/icon1.png",
        phone: "+39 345 678 9123",
      };
    }
    return null;
  }, [clientName, clientAvatar, searchParams]);

  const initialServices: ServiceRow[] = useMemo(() => {
    if (serviceName) {
      const priceNum = servicePrice ? parseFloat(servicePrice) : 170;
      return [
        {
          id: "1",
          name: serviceName,
          date: "2025-08-02",
          price: isNaN(priceNum) ? 170 : priceNum,
          startTime: time || "11:00",
          duration: "15 min",
          employee: teamMember || "Maria Rodriguez",
          employeeAvatar: "/avatar/icon1.png",
        },
      ];
    }
    return [
      {
        id: "1",
        name: "Haircut",
        date: "2025-08-02",
        price: 170,
        startTime: "11:00",
        duration: "15 min",
        employee: "Maria Rodriguez",
        employeeAvatar: "/avatar/icon1.png",
      },
    ];
  }, [serviceName, servicePrice, teamMember, time]);

  return (
    <AppointmentCheckoutContent
      breadcrumb={[{ label: "Dashboard", active: true }]}
      showClientCard={true}
      initialClient={initialClient}
      initialServices={initialServices}
      allowAddService={true}
      allowDeleteService={true}
      onSave={() => router.push("/dashboard?receiptSuccess=true")}
      onBack={() => router.push("/dashboard")}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardCheckoutInner />
    </Suspense>
  );
}
