"use client";

import React, { useState } from "react";
import CustomSelect from "../customComponent/CustomSelect";
import { EmployeeInfoCardsProps } from "./types";

export const EmployeeInfoCards: React.FC<EmployeeInfoCardsProps> = ({ performanceMetrics, operationStatics }) => {
  const [metricsMonth, setMetricsMonth] = useState("Select Month");
  const [staticsMonth, setStaticsMonth] = useState("Last Month");

  const currentPerformanceMetrics = metricsMonth === "Select Month" ? performanceMetrics : {
    targetThreshold: "€ 4,000",
    monthlySalary: "€ 3,000",
    thresholdCalculation: "€ 2,500",
    statusColor: "bg-[#FEF9C3] text-[#EAB308]",
    performanceStatus: "Pending"
  };

  const currentOperationStatics = staticsMonth === "Last Month" ? operationStatics : {
    completedAppointments: 105,
    revenueAppointment: "€ 8,400",
    workingDays: 20,
    performanceStatus: "Excellent"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border border-[#E2E8F0] rounded-[16px] p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-[#1E293B] text-[14px]">Performance Metrics (Last Month)</h3>
          <CustomSelect
            value={metricsMonth}
            onChange={setMetricsMonth}
            options={["Select Month", "January", "February", "March", "April", "May"]}
            buttonClassName="flex items-center justify-between gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#475569] bg-white shadow-none h-auto min-w-[120px]"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Target Threshold</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentPerformanceMetrics.targetThreshold}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Monthly Salary</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentPerformanceMetrics.monthlySalary}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Threshold Calculation (20%)</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentPerformanceMetrics.thresholdCalculation}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[13px] font-medium text-[#475569]">Performance Status</span>
            <span className={`${currentPerformanceMetrics.statusColor} px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide`}>
              {currentPerformanceMetrics.performanceStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-[#E2E8F0] rounded-[16px] p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-[#1E293B] text-[14px]">Operation Statics</h3>
          <CustomSelect
            value={staticsMonth}
            onChange={setStaticsMonth}
            options={["Last Month", "This Month", "Last 3 Months"]}
            buttonClassName="flex items-center justify-between gap-2 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#475569] bg-white shadow-none h-auto min-w-[120px]"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Completed Appointments</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentOperationStatics.completedAppointments}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Revenue Appointment</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentOperationStatics.revenueAppointment}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] border-dashed">
            <span className="text-[13px] font-medium text-[#475569]">Working Days</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentOperationStatics.workingDays}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[13px] font-medium text-[#475569]">Performance Status</span>
            <span className="text-[13px] font-bold text-[#1E293B]">{currentOperationStatics.performanceStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
