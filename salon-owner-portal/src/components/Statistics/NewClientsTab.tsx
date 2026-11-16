"use client";

import React from "react";
import NewClientsCards from "./NewClientsCards";
import NewClientsChart from "./NewClientsChart";
import NewClientsTable from "./NewClientsTable";

export default function NewClientsTab() {
  return (
    <div className="space-y-6 text-left font-manrope">
      <NewClientsCards />
      <NewClientsChart />
      <NewClientsTable />
    </div>
  );
}
