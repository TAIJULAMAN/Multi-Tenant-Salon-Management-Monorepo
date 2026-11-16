import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import OnboardingLayout from "./OnboardingLayout";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: any) => void;
  data: any;
}

export default function OnboardingStep3({
  onNext,
  onBack,
  updateData,
  data,
}: Props) {
  const goals = [
    "Online bookings",
    "Manage team & shifts",
    "Automate reminders",
    "Inventory management",
    "Financial reports",
    "Grow revenue",
  ];

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    data.goals || []
  );

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      updateData({ goals: selectedGoals });
      onNext();
    }
  };

  return (
    <OnboardingLayout step={3} totalSteps={6}>
      <Text style={styles.title}>What are you looking to achieve first?</Text>
      <Text style={styles.subtitle}>
        This helps us design the best experience for your business.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>
          Choose the goals that are most important to you right now.
        </Text>

        <View style={styles.chipsContainer}>
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            return (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
                onPress={() => toggleGoal(goal)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected
                      ? styles.chipTextSelected
                      : styles.chipTextUnselected,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueBtn,
              selectedGoals.length === 0 && styles.continueBtnDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedGoals.length === 0}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  chipUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  chipTextUnselected: {
    color: "#64748B",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
  },
});
