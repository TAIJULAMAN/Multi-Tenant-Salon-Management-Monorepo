"use client";

import React from "react";
import { MetricCard } from "../components/MetricCard";
import { MOCK_ANALYTICS_METRICS } from "../../data";
import { AnalyticsTabProps } from "../../types";
import { AudienceGenderAgeChart } from "../components/AudienceGenderAgeChart";
import { AudienceCityChart } from "../components/AudienceCityChart";
import { FollowersActiveChart } from "../components/FollowersActiveChart";

export function AccountTab({ selectedAccount, dateRange }: AnalyticsTabProps) {
  return (
    <div className="flex flex-col gap-5 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MOCK_ANALYTICS_METRICS.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AudienceGenderAgeChart />
        <AudienceCityChart />
      </div>
      <FollowersActiveChart />
    </div>
  );
}
