"use client";

import React, { useState } from "react";
import InactiveClientSettings from "./InactiveClientSettings";
import InactiveClientsCards from "./InactiveClientsCards";
import InactiveClientsChart from "./InactiveClientsChart";
import InactiveClientsTable from "./InactiveClientsTable";

export default function InactiveClientsTab() {
  const [filterMode, setFilterMode] = useState("Days Since Last Visit");
  const [days, setDays] = useState("90");
  const [periodStart, setPeriodStart] = useState("2026-08-12");
  const [periodEnd, setPeriodEnd] = useState("2026-08-27");

  return (
    <div className="space-y-6 text-left font-manrope">
      <InactiveClientSettings
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        days={days}
        setDays={setDays}
        periodStart={periodStart}
        setPeriodStart={setPeriodStart}
        periodEnd={periodEnd}
        setPeriodEnd={setPeriodEnd}
      />

      <InactiveClientsCards
        filterMode={filterMode}
        days={days}
        periodStart={periodStart}
        periodEnd={periodEnd}
      />
      <InactiveClientsChart
        filterMode={filterMode}
        days={days}
        periodStart={periodStart}
        periodEnd={periodEnd}
      />
      <InactiveClientsTable
        filterMode={filterMode}
        days={days}
        periodStart={periodStart}
        periodEnd={periodEnd}
      />
    </div>
  );
}
