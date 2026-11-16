"use client";

import React, { useState } from "react";
import { AccountTab } from "./tabs/AccountTab";
import { PostsTab } from "./tabs/PostsTab";
import { ReelsTab } from "./tabs/ReelsTab";
import { StoryTab } from "./tabs/StoryTab";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsTabs } from "./AnalyticsTabs";
import { AnalyticsTab } from "../types";
import { ANALYTICS_ACCOUNTS, ANALYTICS_DATE_RANGE_OPTIONS } from "../data";

export function AnalyticsManagement() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("Account");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [selectedAccount, setSelectedAccount] = useState("Maria Rodriguez");

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded-lg mb-6 flex flex-col pt-5">
        <AnalyticsHeader
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          dateRange={dateRange}
          setDateRange={setDateRange}
          accounts={ANALYTICS_ACCOUNTS}
          dateRangeOptions={ANALYTICS_DATE_RANGE_OPTIONS}
        />
        <AnalyticsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex-1 pb-8">
        {activeTab === "Account" && <AccountTab selectedAccount={selectedAccount} dateRange={dateRange} />}
        {activeTab === "Posts" && <PostsTab selectedAccount={selectedAccount} dateRange={dateRange} />}
        {activeTab === "Reels" && <ReelsTab selectedAccount={selectedAccount} dateRange={dateRange} />}
        {activeTab === "Story" && <StoryTab selectedAccount={selectedAccount} dateRange={dateRange} />}
      </div>
    </div>
  );
}
