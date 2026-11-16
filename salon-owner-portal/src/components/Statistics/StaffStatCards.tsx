import React from "react";
import { Clock, Star, Users, Award, ArrowUpRight, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

export function StaffStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Hours"
        value="185 hrs"
        IconComponent={Clock}
        bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#635BFF]"
        subtitle={
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> 96% roster fill rate
          </span>
        }
      />
      <StatCard
        title="Avg Rating"
        value="4.8 / 5.0"
        IconComponent={Star}
        bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#10B981]"
        subtitle={
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Based on 320 reviews
          </span>
        }
      />
      <StatCard
        title="Active Stylists"
        value="8 Stylists"
        IconComponent={Users}
        bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#F97316]"
        subtitle={
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            All currently active
          </span>
        }
      />
      <StatCard
        title="Top Performer"
        value="Emma Watson"
        IconComponent={Award}
        bgClass="bg-gradient-to-b from-[#DB2777]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#DB2777]"
        subtitle={
          <span className="flex items-center gap-1 text-[#635BFF] font-bold">
            $4,800 generated this week
          </span>
        }
      />
    </div>
  );
}
