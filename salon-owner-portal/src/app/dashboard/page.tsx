"use client";

import React, { Suspense } from "react";
import StatCards from "@/components/saloonOwner/dashboard/StatCards";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import { RefreshCw, Eye } from "lucide-react";
import Link from "next/link";
import ClientsGrowthChart from "@/components/saloonOwner/dashboard/ClientsGrowthChart";
import RevenueTrendChart from "@/components/saloonOwner/dashboard/RevenueTrendChart";
import AppointmentsChart from "@/components/saloonOwner/dashboard/AppointmentsChart";
import DailySummary from "@/components/saloonOwner/dashboard/DailySummary";
import OnlinePayment from "@/components/saloonOwner/dashboard/OnlinePayment";
import AgendaAppointments from "@/components/saloonOwner/dashboard/AgendaAppointments";
import { agendaAppointmentsData } from "@/components/dashboard/data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#64748B]">Loading dashboard data...</div>}>
      <div className="space-y-5 pb-5">
        <CustomPageHeader
          title="Dashboard"
          action={
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F1F5F9] text-[#64748B] rounded-lg text-sm font-semibold hover:bg-[#E2E8F0] transition-colors w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
              <Link
                href="/dashboard/appointment"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] text-white rounded-lg text-sm font-semibold hover:bg-[#534dfd] transition-colors shadow-md shadow-[#635BFF]/20 w-full sm:w-auto"
              >
                <Eye className="w-4 h-4" />
                View All Appointments
              </Link>
            </div>
          }
        />
        <StatCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <DailySummary />
          <ClientsGrowthChart />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <RevenueTrendChart />
          <OnlinePayment />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AppointmentsChart />
          <AgendaAppointments appointments={agendaAppointmentsData} />
        </div>
      </div>
    </Suspense>
  );
}
