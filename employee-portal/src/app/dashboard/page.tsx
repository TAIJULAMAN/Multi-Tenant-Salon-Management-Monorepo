"use client";

import React, { Suspense } from "react";
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
import StatCards from "@/components/dashboard/StatCards";
import PerformanceGoals from "@/components/dashboard/PerformanceGoals";
import AgendaAppointments from "@/components/dashboard/AgendaAppointments";
import AppointmentsChart from "@/components/dashboard/AppointmentsChart";
import DashboardTopServices from "@/components/dashboard/DashboardTopServices";
import DashboardLoyalCustomers from "@/components/dashboard/DashboardLoyalCustomers";
import ClientsGrowthChart from "@/components/dashboard/ClientsGrowthChart";
import DashboardPaymentsPerYear from "@/components/dashboard/DashboardPaymentsPerYear";
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#64748B]">
          Loading dashboard data...
        </div>
      }
    >
      <div className="space-y-6 pb-12 font-manrope">
        <CustomPageHeader
          title="Dashboard"
          action={
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#F8FAFC] transition-colors w-full sm:w-auto cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
                Refresh Data
              </button>
              <Link
                href="/appointment"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#635BFF] text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-[#524be0] transition-colors shadow-sm shadow-[#635BFF]/20 w-full sm:w-auto cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                View All Appointments
              </Link>
            </div>
          }
        />
        <StatCards />
        <PerformanceGoals />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <AgendaAppointments appointments={agendaAppointmentsData} />
          <AppointmentsChart />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <DashboardTopServices />
          <DashboardLoyalCustomers />
        </div>
        <ClientsGrowthChart />
        <DashboardPaymentsPerYear />
      </div>
    </Suspense>
  );
}
