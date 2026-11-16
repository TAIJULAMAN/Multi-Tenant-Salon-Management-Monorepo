"use client";

import React from "react";
import { useParams } from "next/navigation";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import ViewGiftCardDetails from "@/components/clients/gift-cards/ViewGiftCardDetails";
import ViewGiftCardPreview from "@/components/clients/gift-cards/ViewGiftCardPreview";
import { defaultViewGiftCardData } from "@/components/clients/gift-cards/data";

export default function ViewGiftCardPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-300 font-manrope space-y-6">
      <CustomSubPageHeader
        title="View Gift Card"
        backUrl={`/clients/${id}`}
        breadcrumbText="Clients"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ViewGiftCardDetails data={defaultViewGiftCardData} />
        <ViewGiftCardPreview />
      </div>
    </div>
  );
}
