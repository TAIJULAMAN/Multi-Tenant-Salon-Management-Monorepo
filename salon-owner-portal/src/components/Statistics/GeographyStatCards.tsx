import React from "react";
import { MapPin, Building2, Users, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

interface GeographyStatCardsProps {
  viewBy?: "regions" | "cities";
}

export function GeographyStatCards({ viewBy = "regions" }: GeographyStatCardsProps) {
  const isRegions = viewBy === "regions";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {isRegions ? (
        <>
          {/* 1. Total Regions */}
          <StatCard
            title="Total Regions"
            value="12"
            IconComponent={MapPin}
            bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#635BFF]"
            badge="+2 new"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Active Regions</span>
              </div>
            }
          />

          {/* 2. Total Cities */}
          <StatCard
            title="Total Cities"
            value="15"

            IconComponent={Building2}
            bgClass="bg-gradient-to-b from-[#00D0C7]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#00D0C7]"
            badge="Stable"
            badgeColor="bg-slate-100 text-slate-700 border border-slate-200"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Coverage</span>
              </div>
            }
          />

          {/* 3. Top Region */}
          <StatCard
            title="Top Region"
            value="Veneto"
            IconComponent={Users}
            bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#10B981]"
            badge="65 clients"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Most Clients</span>
              </div>
            }
          />

          {/* 4. Top Region Revenue */}
          <StatCard
            title="Top Region Rev"
            value="€75.721"
            IconComponent={TrendingUp}
            bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#F97316]"
            badge="Revenue Leader"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Highest Value</span>
              </div>
            }
          />
        </>
      ) : (
        <>
          {/* 1. Total Cities */}
          <StatCard
            title="Total Cities"
            value="15"
            IconComponent={Building2}
            bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#635BFF]"
            badge="+3 new"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Active Cities</span>
              </div>
            }
          />

          {/* 2. Total Regions */}
          <StatCard
            title="Total Regions"
            value="12"
            IconComponent={MapPin}
            bgClass="bg-gradient-to-b from-[#00D0C7]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#00D0C7]"
            badge="Stable"
            badgeColor="bg-slate-100 text-slate-700 border border-slate-200"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Coverage</span>
              </div>
            }
          />

          {/* 3. Top City */}
          <StatCard
            title="Top City"
            value="Milan"
            IconComponent={Users}
            bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#10B981]"
            badge="58 clients"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Most Clients</span>
              </div>
            }
          />

          {/* 4. Top City Revenue */}
          <StatCard
            title="Top City Rev"
            value="€68.400"
            IconComponent={TrendingUp}
            bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
            iconBgClass="bg-[#F97316]"
            badge="Revenue Leader"
            badgeColor="bg-rose-50 text-[#EF4444] border border-rose-100"
            subtitle={
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[#64748B] font-medium text-[11px]">Highest Value</span>
              </div>
            }
          />
        </>
      )}
    </div>
  );
}
