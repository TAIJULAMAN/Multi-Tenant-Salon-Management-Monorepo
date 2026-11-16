import React from "react";
import { FileBarChart, Clock, Filter, HardDrive } from "lucide-react";
import { StatCard } from "./StatCard";

export function ReportsStatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Reports"
        value="42 Files"
        IconComponent={FileBarChart}
        bgClass="bg-gradient-to-b from-[#635BFF]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#635BFF]"
        subtitle={
          <span className="flex items-center gap-1 text-[#64748B] font-bold">
            Saved in secure storage
          </span>
        }
      />
      <StatCard
        title="Last Run"
        value="Today"
        IconComponent={Clock}
        bgClass="bg-gradient-to-b from-[#10B981]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#10B981]"
        subtitle={
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            Financial performance run
          </span>
        }
      />
      <StatCard
        title="Auto Schedules"
        value="3 Active"
        IconComponent={Filter}
        bgClass="bg-gradient-to-b from-[#F97316]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#F97316]"
        subtitle={
          <span className="flex items-center gap-1 text-amber-600 font-bold">
            Weekly, Monthly, Quarterly
          </span>
        }
      />
      <StatCard
        title="Storage Used"
        value="82.4 MB"
        IconComponent={HardDrive}
        bgClass="bg-gradient-to-b from-[#DB2777]/30 to-[#FFFFFF]"
        iconBgClass="bg-[#DB2777]"
        subtitle={
          <span className="flex items-center gap-1 text-[#DB2777] font-bold">
            8.2% of 1 GB quota
          </span>
        }
      />
    </div>
  );
}
