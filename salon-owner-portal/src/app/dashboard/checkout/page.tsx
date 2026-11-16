"use client";

import React, { Suspense } from "react";
import DashboardCheckoutInner from "@/components/checkout/DashboardCheckoutInner";

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
