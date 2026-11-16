"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import GiftCardStepOne from "@/components/clients/gift-cards/GiftCardStepOne";
import GiftCardStepTwo from "@/components/clients/gift-cards/GiftCardStepTwo";

export default function AddGiftCardPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [numCards, setNumCards] = useState("1");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("€ EUR");
  const [hideAmount, setHideAmount] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedLogo, setSelectedLogo] = useState(2);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-0 pb-24 animate-in fade-in duration-300 font-manrope space-y-6">
      <CustomSubPageHeader
        title="Add Gift Card"
        backUrl={`/clients/${id}`}
        breadcrumbText="Clients"
      />

      {step === 1 ? (
        <GiftCardStepOne
          numCards={numCards}
          onNumCardsChange={setNumCards}
          amount={amount}
          onAmountChange={setAmount}
          currency={currency}
          onCurrencyChange={setCurrency}
          hideAmount={hideAmount}
          onToggleHideAmount={() => setHideAmount(!hideAmount)}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onNext={() => setStep(2)}
        />
      ) : (
        <GiftCardStepTwo
          selectedLogo={selectedLogo}
          onSelectLogo={setSelectedLogo}
          onBack={() => setStep(1)}
          onSave={() => router.push(`/clients/${id}`)}
        />
      )}
    </div>
  );
}
