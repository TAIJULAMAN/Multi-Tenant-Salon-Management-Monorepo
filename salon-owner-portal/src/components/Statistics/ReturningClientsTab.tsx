"use client";

import React from "react";
import ReturningClientsCards from "./ReturningClientsCards";
import ReturningClientsChart from "./ReturningClientsChart";
import ReturningClientsTable from "./ReturningClientsTable";

export default function ReturningClientsTab() {
  return (
    <div className="space-y-6 text-left font-manrope">
      <ReturningClientsCards />
      <ReturningClientsChart />
      <ReturningClientsTable />
    </div>
  );
}
