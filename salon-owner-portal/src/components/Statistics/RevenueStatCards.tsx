import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Euro,
  Percent,
  TrendingUp,
  Receipt,
  Tag,
  BadgePercent,
} from "lucide-react";
import { StatCard } from "./StatCard";

export function RevenueStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
      {/* 1. Total Revenue */}
      <StatCard
        title="Total Revenue"
        value="€42.070"
        IconComponent={Euro}
        bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#635BFF]"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Gross Value</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" />
              +15% vs last month
            </span>
          </div>
        }
      />

      {/* 2. Total Discounts */}
      <StatCard
        title="Total Discounts"
        value="€949"
        IconComponent={Percent}
        bgClass="bg-gradient-to-b from-[#475569]/20 to-[#FFFFFF]"
        iconBgClass="bg-[#475569]"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Deductions</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#EF4444] border border-rose-100">
              <ArrowDownRight className="w-3 h-3" />
              -2% vs last month
            </span>
          </div>
        }
      />

      {/* 3. Net Revenue */}
      <StatCard
        title="Net Revenue"
        value="€41.121"
        IconComponent={TrendingUp}
        bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#10B981]"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">After Discounts</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" />
              +18% profit
            </span>
          </div>
        }
      />

      {/* 4. # Receipts */}
      <StatCard
        title="Receipts"
        value="298"
        IconComponent={Receipt}
        bgClass="bg-gradient-to-b from-[#DB2777]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#DB2777]"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Transaction Count</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" />
              +5%
            </span>
          </div>
        }
      />

      {/* 5. Avg Ticket */}
      <StatCard
        title="Avg Ticket"
        value="€137.99"
        IconComponent={Tag}
        bgClass="bg-gradient-to-b from-[#14B8A6]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#14B8A6]"
        className="col-span-1 sm:col-span-1 lg:col-span-2"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Revenue / Receipt</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" />
              +5.3%
            </span>
          </div>
        }
      />

      {/* 6. Avg Discount */}
      <StatCard
        title="Avg Discount"
        value="€3.19"
        IconComponent={BadgePercent}
        bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#F97316]"
        className="col-span-1 sm:col-span-1 lg:col-span-2"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Per Receipt</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              2.3%
            </span>
          </div>
        }
      />
    </div>
  );
}
