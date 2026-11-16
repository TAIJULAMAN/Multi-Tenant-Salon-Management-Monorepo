"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";

export interface GoalItem {
  id: string;
  value: string;
  target: string;
  title: string;
  badge: string;
  badgeType: "success" | "warning" | "danger";
  progressPercent: number;
  barColor: string;
  description: string;
}

const initialGoals: GoalItem[] = [
  {
    id: "1",
    value: "1,782,00 €",
    target: "2.500,00 €",
    title: "Revenue",
    badge: "You're on track!",
    badgeType: "success",
    progressPercent: 71.3,
    barColor: "bg-[#10B981]",
    description: "Progress is aligned with the expected pace for this period.",
  },
  {
    id: "2",
    value: "12",
    target: "50",
    title: "Number of appointments",
    badge: "Attention",
    badgeType: "warning",
    progressPercent: 24,
    barColor: "bg-[#F59E0B]",
    description: "Progress is slightly below the ideal pace. Consider taking action to boost results.",
  },
  {
    id: "3",
    value: "39 €",
    target: "199 €",
    title: "Average ticket",
    badge: "Goal at risk",
    badgeType: "danger",
    progressPercent: 19.6,
    barColor: "bg-[#F43F5E]",
    description: "At the current pace, this goal may not be reached on time.",
  },
];

export default function PerformanceGoals() {
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [goalType, setGoalType] = useState("Revenue Target (€)");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [period, setPeriod] = useState("This Month");

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();

    const targetNum = parseFloat(targetValue.replace(/[^0-9.]/g, "")) || 100;
    const currentNum = parseFloat(currentValue.replace(/[^0-9.]/g, "")) || 0;
    const progress = Math.min(100, Math.round((currentNum / targetNum) * 100));

    let badgeText = "You're on track!";
    let badgeType: "success" | "warning" | "danger" = "success";
    let barColor = "bg-[#10B981]";
    let description = "Progress is aligned with the expected pace for this period.";

    if (progress < 30) {
      badgeText = "Goal at risk";
      badgeType = "danger";
      barColor = "bg-[#F43F5E]";
      description = "At the current pace, this goal may not be reached on time.";
    } else if (progress < 60) {
      badgeText = "Attention";
      badgeType = "warning";
      barColor = "bg-[#F59E0B]";
      description = "Progress is slightly below the ideal pace. Consider taking action to boost results.";
    }

    const isCurrency = goalType.includes("(€)");
    const formattedVal = isCurrency ? `${currentNum.toLocaleString("de-DE")},00 €` : `${currentNum}`;
    const formattedTarget = isCurrency ? `${targetNum.toLocaleString("de-DE")},00 €` : `${targetNum}`;

    const newGoal: GoalItem = {
      id: Date.now().toString(),
      value: formattedVal,
      target: formattedTarget,
      title: goalType.replace(" Target (€)", "").replace(" (€)", ""),
      badge: badgeText,
      badgeType,
      progressPercent: progress,
      barColor,
      description,
    };

    setGoals((prev) => [...prev, newGoal]);
    setIsModalOpen(false);

    // Reset fields
    setTargetValue("");
    setCurrentValue("");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#1E293B]">Performance Goals</h2>
          <p className="text-[12px] text-[#94A3B8] font-medium mt-0.5">
            Track your progress and stay on top of your salon&apos;s results.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
        >
          Create Goal
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="border border-[#E2E8F0] rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-[#CBD5E1] transition-all"
          >
            <div>
              {/* Value and Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[20px] font-bold text-[#1E293B] leading-tight">
                    {goal.value}
                  </div>
                  <div className="text-[12px] font-medium text-[#94A3B8] mt-0.5">
                    {goal.title}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                    goal.badgeType === "success"
                      ? "bg-[#D1FAE5] text-[#10B981]"
                      : goal.badgeType === "warning"
                      ? "bg-[#FEF3C7] text-[#D97706]"
                      : "bg-[#FFE4E6] text-[#F43F5E]"
                  }`}
                >
                  {goal.badge}
                </span>
              </div>

              {/* Progress Bar & Target */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${goal.barColor}`}
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>
                <span className="text-[12px] font-bold text-[#1E293B] shrink-0">
                  {goal.target}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-[#64748B] mt-4 leading-relaxed">
              {goal.description}
            </p>
          </div>
        ))}
      </div>

      {/* Create Goal Modal using Custom Components */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Goal"
        maxWidth="max-w-[480px]"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4 pt-2 font-manrope">
          <div>
            <CustomSelect
              label="Goal Type"
              value={goalType}
              onChange={setGoalType}
              options={[
                "Revenue Target (€)",
                "Number of Appointments",
                "Average Ticket (€)",
                "New Clients Acquired",
              ]}
            />
          </div>

          <CustomInput
            label="Current Progress Value"
            placeholder="e.g. 1500"
            value={currentValue}
            onChange={setCurrentValue}
            required
          />

          <CustomInput
            label="Target Goal Value"
            placeholder="e.g. 2500"
            value={targetValue}
            onChange={setTargetValue}
            required
          />

          <div>
            <CustomSelect
              label="Period"
              value={period}
              onChange={setPeriod}
              options={["This Month", "Next Quarter", "Full Year"]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <CancelButton onClick={() => setIsModalOpen(false)}>
              Cancel
            </CancelButton>
            <SubmitButton>Save Goal</SubmitButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
