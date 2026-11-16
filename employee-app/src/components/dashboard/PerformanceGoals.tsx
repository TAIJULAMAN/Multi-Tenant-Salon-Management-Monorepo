import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CreateGoalModal from "./CreateGoalModal";
import { dashboardCardStyle as card } from "./DashboardControls";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import {
  formatGoalValue,
  getGoalStatus,
  goalStatusMeta,
  initialGoals,
  type PerformanceGoal,
} from "./dashboardData";

function GoalCard({
  goal,
  onLongPress,
}: {
  goal: PerformanceGoal;
  onLongPress: () => void;
}) {
  const status = getGoalStatus(goal);
  const meta = goalStatusMeta[status];
  const pct = Math.min(goal.target > 0 ? goal.current / goal.target : 0, 1);

  return (
    <TouchableOpacity
      style={styles.goalCard}
      activeOpacity={0.9}
      onLongPress={onLongPress}
    >
      <View style={styles.goalTopRow}>
        <View style={styles.goalValueWrap}>
          <Text style={styles.goalValue}>
            {formatGoalValue(goal.type, goal.current)}
          </Text>
          <Text style={styles.goalLabel}>{goal.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.statusBadgeText, { color: meta.text }]}>
            {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct * 100}%`, backgroundColor: meta.color },
            ]}
          />
        </View>
        <Text style={styles.targetText}>
          {formatGoalValue(goal.type, goal.target, true)}
        </Text>
      </View>

      <Text style={styles.goalMessage}>{meta.message}</Text>
      {goal.period !== "Monthly" && (
        <Text style={styles.periodText}>
          {goal.startDate && goal.endDate
            ? `${goal.startDate} – ${goal.endDate}`
            : goal.period}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function PerformanceGoals() {
  const [goals, setGoals] = useState<PerformanceGoal[]>(initialGoals);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSave = (data: Omit<PerformanceGoal, "id" | "current">) => {
    setGoals((prev) => [
      ...prev,
      { ...data, id: `g${Date.now()}`, current: 0 },
    ]);
    setIsCreateOpen(false);
  };

  const handleDelete = (goal: PerformanceGoal) => {
    Alert.alert("Delete goal", `Remove the "${goal.type}" goal?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setGoals((p) => p.filter((g) => g.id !== goal.id)),
      },
    ]);
  };

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Performance Goals</Text>
          <Text style={card.subtitle}>
            Track your progress and stay on top of your salon’s results.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setIsCreateOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.createBtnText}>Create Goal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.goalsList}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onLongPress={() => handleDelete(goal)}
          />
        ))}
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={22} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              No goals yet. Create your first goal.
            </Text>
          </View>
        )}
      </View>

      <CreateGoalModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createBtn: {
    height: 36,
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  createBtnText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  goalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  goalValueWrap: {
    flex: 1,
  },
  goalValue: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },
  goalLabel: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textMuted,
  },
  statusBadge: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: radius.md,
  },
  statusBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  targetText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  goalMessage: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  periodText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 20,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
