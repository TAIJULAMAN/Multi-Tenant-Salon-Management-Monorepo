import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import {
  GOAL_PERIODS,
  GOAL_TYPES,
  type GoalPeriod,
  type GoalType,
  type PerformanceGoal,
} from "./dashboardData";

interface CreateGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (goal: Omit<PerformanceGoal, "id" | "current">) => void;
}

interface InlineSelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
}

/**
 * Select matching the Figma "Create Goal" fields (1:33655 / 1:34281):
 * the option list floats over the fields below the input.
 */
function InlineSelect<T extends string>({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: InlineSelectProps<T>) {
  return (
    <View style={[styles.field, open && styles.fieldOpen]}>
      <Text style={styles.label}>{label} *</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.selectText} numberOfLines={1}>
          {value}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.optionsList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.option}
              onPress={() => onSelect(opt)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.optionText,
                  opt === value && styles.optionTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/** Figma 1:33040 – Create Goal modal. */
export default function CreateGoalModal({
  visible,
  onClose,
  onSave,
}: CreateGoalModalProps) {
  const [type, setType] = useState<GoalType>("Revenue");
  const [period, setPeriod] = useState<GoalPeriod>("Monthly");
  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openSelect, setOpenSelect] = useState<"type" | "period" | null>(null);
  const [errors, setErrors] = useState<{
    target?: string;
    start?: string;
    end?: string;
  }>({});

  const isCustom = period === "Custom (start date / end date)";

  const reset = () => {
    setType("Revenue");
    setPeriod("Monthly");
    setTarget("");
    setStartDate("");
    setEndDate("");
    setOpenSelect(null);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    const value = Number(target.replace(",", "."));
    const nextErrors: typeof errors = {};
    if (!target.trim() || isNaN(value) || value <= 0)
      nextErrors.target = "Enter a valid target value";
    if (isCustom && !startDate) nextErrors.start = "Select a start date";
    if (isCustom && !endDate) nextErrors.end = "Select an end date";
    setErrors(nextErrors);
    setOpenSelect(null);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      type,
      period,
      target: value,
      startDate: isCustom ? startDate : undefined,
      endDate: isCustom ? endDate : undefined,
    });
    reset();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => setOpenSelect(null)}>
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.title}>Create Goal</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    hitSlop={10}
                    accessibilityLabel="Close"
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.body}
                  contentContainerStyle={[
                    styles.bodyContent,
                    openSelect === "period" &&
                      !isCustom &&
                      styles.bodyContentOpen,
                  ]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <InlineSelect
                    label="Goal type"
                    value={type}
                    options={GOAL_TYPES}
                    open={openSelect === "type"}
                    onToggle={() =>
                      setOpenSelect((s) => (s === "type" ? null : "type"))
                    }
                    onSelect={(v) => {
                      setType(v);
                      setOpenSelect(null);
                    }}
                  />

                  <View style={styles.field}>
                    <Text style={styles.label}>Target value *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textInput,
                        errors.target && styles.inputError,
                      ]}
                      placeholder="Set the value you want to achieve during this period."
                      placeholderTextColor={colors.textMuted}
                      keyboardType="decimal-pad"
                      value={target}
                      onFocus={() => setOpenSelect(null)}
                      onChangeText={(t) => {
                        setTarget(t);
                        if (errors.target)
                          setErrors((e) => ({ ...e, target: undefined }));
                      }}
                    />
                    {errors.target ? (
                      <Text style={styles.errorText}>{errors.target}</Text>
                    ) : null}
                  </View>

                  <InlineSelect
                    label="Goal period"
                    value={period}
                    options={GOAL_PERIODS}
                    open={openSelect === "period"}
                    onToggle={() =>
                      setOpenSelect((s) => (s === "period" ? null : "period"))
                    }
                    onSelect={(v) => {
                      setPeriod(v);
                      setOpenSelect(null);
                    }}
                  />

                  {isCustom && (
                    <View style={styles.dateRow}>
                      <View style={styles.flex}>
                        <DatePickerInput
                          label="Start date"
                          required
                          value={startDate}
                          onChange={(d) => {
                            setStartDate(d);
                            setErrors((e) => ({ ...e, start: undefined }));
                          }}
                          error={errors.start}
                        />
                      </View>
                      <View style={styles.flex}>
                        <DatePickerInput
                          label="End date"
                          required
                          value={endDate}
                          onChange={(d) => {
                            setEndDate(d);
                            setErrors((e) => ({ ...e, end: undefined }));
                          }}
                          error={errors.end}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleSave}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 746,
    maxHeight: "88%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingTop: 20,
    paddingHorizontal: 20,
    ...shadows.overlay,
    shadowOpacity: 0.25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: 20,
  },
  // leaves room for the period option list that floats past the Save row
  bodyContentOpen: {
    paddingBottom: 70,
  },
  field: {
    marginBottom: 20,
    zIndex: 1,
  },
  fieldOpen: {
    zIndex: 10,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  textInput: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.red,
    marginTop: 4,
  },
  selectText: {
    flex: 1,
    marginRight: 8,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  optionsList: {
    position: "absolute",
    top: 27 + 42 + 8,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 8,
    ...shadows.overlay,
    shadowOpacity: 0.2,
  },
  option: {
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  optionTextActive: {
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  footer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  saveBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
  },
  saveBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
  },
});
