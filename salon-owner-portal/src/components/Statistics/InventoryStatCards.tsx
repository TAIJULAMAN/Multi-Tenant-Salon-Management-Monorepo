import React from "react";
import { Package, Tag, TrendingUp, CircleDollarSign } from "lucide-react";
import { StatCard } from "./StatCard";

interface InventoryStatCardsProps {
  timeRange?: string;
}

const statsByTimeRange: Record<string, { total: string; sellable: string; potentialNet: string; potentialGross: string }> = {
  "This Week": { total: "€29.850", sellable: "€22.910", potentialNet: "€37.640", potentialGross: "€45.920" },
  "This Month": { total: "€30.190", sellable: "€23.273", potentialNet: "€38.306", potentialGross: "€46.733" },
  "Last 30 days": { total: "€30.190", sellable: "€23.273", potentialNet: "€38.306", potentialGross: "€46.733" },
  "This Year": { total: "€34.500", sellable: "€26.800", potentialNet: "€44.120", potentialGross: "€53.820" },
};

export function InventoryStatCards({ timeRange = "Last 30 days" }: InventoryStatCardsProps) {
  const current = statsByTimeRange[timeRange] || statsByTimeRange["Last 30 days"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Total Inventory Value */}
      <StatCard
        title="Total Inventory Value"
        value={current.total}
        IconComponent={Package}
        bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#635BFF]"
        badge="Asset Value"
        badgeColor="bg-slate-100 text-slate-700 border border-slate-200"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Cost Price (All)</span>
          </div>
        }
      />

      {/* 2. Sellable Value (Cost) */}
      <StatCard
        title="Sellable Value (Cost)"
        value={current.sellable}
        IconComponent={Tag}
        bgClass="bg-gradient-to-b from-[#00D0C7]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#00D0C7]"
        badge="77% of Total"
        badgeColor="bg-teal-50 text-teal-700 border border-teal-200/80"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Cost Price (Retail Items)</span>
          </div>
        }
      />

      {/* 3. Potential Revenue (Net) */}
      <StatCard
        title="Potential Revenue (Net)"
        value={current.potentialNet}
        IconComponent={TrendingUp}
        bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#10B981]"
        badge="Excl. VAT"
        badgeColor="bg-rose-50 text-rose-600 border border-rose-200"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Retail Price (Tax Excl.)</span>
          </div>
        }
      />

      {/* 4. Potential Revenue (Gross) */}
      <StatCard
        title="Potential Revenue (Gross)"
        value={current.potentialGross}
        IconComponent={CircleDollarSign}
        bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#F97316]"
        badge="Incl. VAT"
        badgeColor="bg-rose-50 text-rose-600 border border-rose-200"
        subtitle={
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-[#64748B] font-medium text-[11px]">Retail Price (Tax Incl.)</span>
          </div>
        }
      />
    </div>
  );
}
