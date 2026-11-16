import React, { useState } from "react";
import { Instagram, ChevronDown } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";

interface AnalyticsHeaderProps {
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  accounts?: string[];
  dateRangeOptions?: string[];
}

export function AnalyticsHeader({
  selectedAccount,
  setSelectedAccount,
  dateRange,
  setDateRange,
  accounts = ["Maria Rodriguez", "John Doe", "Jane Smith"],
  dateRangeOptions = [
    "Last 7 days", "Last 28 days", "Last 90 days",
    "This Week", "This Month", "This Year",
    "Last Week", "Last Month", "Custom Range"
  ],
}: AnalyticsHeaderProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 gap-4 mb-6 w-full">
      <h1 className="text-[16px] sm:text-xl font-bold text-[#1E293B]">Analytics</h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#E0E7FF] text-[#635BFF] rounded flex items-center justify-center flex-shrink-0">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <span>{selectedAccount}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform flex-shrink-0 ${isAccountOpen ? "rotate-180" : ""}`} />
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 top-full mt-1 w-full sm:w-max min-w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg overflow-hidden z-20">
              {accounts.map((acc) => (
                <button
                  key={acc}
                  onClick={() => {
                    setSelectedAccount(acc);
                    setIsAccountOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[#F8FAFC] ${selectedAccount === acc ? "text-[#635BFF] bg-[#EEF2FF]" : "text-[#1E293B]"
                    }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="w-full sm:w-36">
          <CustomSelect
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
            className="w-full"
            buttonClassName="w-full justify-between sm:justify-start"
          />
        </div>
      </div>
    </div>
  );
}
