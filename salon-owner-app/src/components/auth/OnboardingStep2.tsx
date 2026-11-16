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

export default function OnboardingStep2({
  onNext,
  onBack,
  updateData,
  data,
}: Props) {
  const categories = [
    "Salon",
    "Barbershop",
    "Clinic / Medical",
    "Spa / Wellness",
    "Other",
  ];
  const [selected, setSelected] = useState(data.businessType || "");

  const handleContinue = () => {
    if (selected) {
      updateData({ businessType: selected });
      onNext();
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={6}>
      <Text style={styles.title}>What best describes your business?</Text>
      <Text style={styles.subtitle}>
        This helps us tailor the experience to your business needs.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Select one option to continue</Text>

        <View style={styles.chipsContainer}>
          {categories.map((cat) => {
            const isSelected = selected === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
                onPress={() => setSelected(cat)}
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
                  {cat}
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
              !selected && styles.continueBtnDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selected}
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
    paddingHorizontal: 18,
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
