import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import FormModal from "./FormModal";
import { Checkbox, DateField, FieldError, Pill, Radio, SelectField, TextField, figmaStyles } from "./figmaUi";
import {
  REPEAT_FREQUENCIES,
  RepeatFrequency,
  ScheduleMap,
  TIME_OFF_TYPES,
  TimeOffRequest,
  addDays,
  dayScheduledMinutes,
  daysBetween,
  formatDuration,
  isValidTime,
  parseMDY,
  segmentMinutes,
  toISO,
  toMinutes,
} from "./shiftsData";

interface AddTimeOffModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (request: TimeOffRequest) => void;
  /** Used to compute "Time off total" (scheduled hours that fall inside the period). */
  schedule?: ScheduleMap;
}

/** Figma 1:45561 / 1:44946 / 1:45848 / 1:45236 / 1:46176 – "Add Time Off". */
export default function AddTimeOffModal({ visible, onClose, onSave, schedule }: AddTimeOffModalProps) {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [frequency, setFrequency] = useState<RepeatFrequency | null>(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const start = parseMDY(startDate);
  const end = parseMDY(endDate);
  const periodDays = start && end ? daysBetween(start, end) : start ? 1 : 0;
  // Start/End Time only apply to single-day time off (end date empty or equal to the start date) – 1:45848
  const isSingleDay = !!start && (!endDate || periodDays === 1);

  const reasonFor = (id: RepeatFrequency) =>
    REPEAT_FREQUENCIES.find((f) => f.id === id)?.disabledReason?.(Math.max(periodDays, 1)) ?? null;

  // Time off total
  let totalMinutes = 0;
  if (isSingleDay && isValidTime(startTime) && isValidTime(endTime)) {
    totalMinutes = segmentMinutes(startTime, endTime);
  } else if (start && schedule && periodDays > 0 && (!end || end >= start)) {
    for (let i = 0; i < Math.min(periodDays, 366); i++) {
      totalMinutes += dayScheduledMinutes(schedule[toISO(addDays(start, i))]);
    }
  }

  const reset = () => {
    setType("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setRepeat(false);
    setFrequency(null);
    setDescription("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    const next: Record<string, string> = {};
    if (!start) next.startDate = "Start date is required";
    if (start && end && end.getTime() < start.getTime()) next.endDate = "End date must be after start date";
    if (isSingleDay) {
      if (!isValidTime(startTime)) next.startTime = "Enter a time as HH:MM";
      if (!isValidTime(endTime)) next.endTime = "Enter a time as HH:MM";
      if (isValidTime(startTime) && isValidTime(endTime) && toMinutes(endTime) <= toMinutes(startTime)) {
        next.endTime = "End time must be after start time";
      }
    }
    if (repeat && !frequency) next.frequency = "Select a repeat frequency";
    if (repeat && frequency && reasonFor(frequency)) next.frequency = reasonFor(frequency) ?? "";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave?.({
      type: type || TIME_OFF_TYPES[0],
      startDate,
      endDate: endDate || startDate,
      startTime: isSingleDay ? startTime : undefined,
      endTime: isSingleDay ? endTime : undefined,
      repeat,
      frequency: repeat && frequency ? frequency : undefined,
      description: description.trim() || undefined,
    });
    handleClose();
  };

  return (
    <FormModal visible={visible} onClose={handleClose} title="Add Time Off" onPrimary={handleSave}>
      <SelectField
        label="Type"
        required
        placeholder={TIME_OFF_TYPES[0]}
        options={TIME_OFF_TYPES}
        value={type}
        onSelect={setType}
      />

      <View style={figmaStyles.row}>
        <DateField
          label="Start Date"
          required
          value={startDate}
          onChange={(v) => {
            setStartDate(v);
            setErrors((e) => ({ ...e, startDate: "" }));
          }}
          error={errors.startDate}
          style={figmaStyles.flex1}
        />
        <DateField
          label="End Date"
          required
          value={endDate}
          onChange={(v) => {
            setEndDate(v);
            setErrors((e) => ({ ...e, endDate: "" }));
          }}
          error={errors.endDate}
          style={figmaStyles.flex1}
        />
      </View>

      {isSingleDay && (
        <View style={figmaStyles.row}>
          <TextField
            label="Start Time"
            required
            placeholder="Enter time"
            value={startTime}
            onChangeText={setStartTime}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            error={errors.startTime}
            containerStyle={figmaStyles.flex1}
          />
          <TextField
            label="End Time"
            required
            placeholder="Enter time"
            value={endTime}
            onChangeText={setEndTime}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            error={errors.endTime}
            containerStyle={figmaStyles.flex1}
          />
        </View>
      )}

      <Checkbox checked={repeat} label="Repeat" onPress={() => setRepeat((r) => !r)} />

      {repeat && (
        <View style={styles.repeatBox}>
          <Text style={styles.repeatBoxTitle}>Repeat Frequency</Text>
          {REPEAT_FREQUENCIES.map((freq) => {
            const reason = reasonFor(freq.id);
            const disabled = !!reason;
            const selected = frequency === freq.id && !disabled;
            return (
              <TouchableOpacity
                key={freq.id}
                style={styles.freqOption}
                onPress={() => {
                  setFrequency(freq.id);
                  setErrors((e) => ({ ...e, frequency: "" }));
                }}
                disabled={disabled}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled }}
              >
                <Radio selected={selected} disabled={disabled} />
                <View style={figmaStyles.flex1}>
                  <Text style={[styles.freqLabel, disabled && styles.freqLabelDisabled]}>{freq.label}</Text>
                  <Text style={[styles.freqDesc, disabled && styles.freqDescDisabled]}>{reason ?? freq.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <FieldError message={errors.frequency} />
        </View>
      )}

      <TextField
        label="Description (Optional)"
        placeholder="Add description or note"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pill label={`Time off total: ${formatDuration(totalMinutes)}`} />

      <View style={styles.alertBox}>
        <View style={styles.alertBar} />
        <Text style={styles.alertTitle}>Warning</Text>
        <Text style={styles.alertText}>Online bookings cannot be placed during time off.</Text>
      </View>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  repeatBox: {
    backgroundColor: colors.borderLight,
    borderRadius: radius.card,
    padding: 20,
    gap: 14,
  },
  repeatBoxTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  freqOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  freqLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  freqLabelDisabled: {
    color: colors.textMuted,
  },
  freqDesc: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 2,
  },
  freqDescDisabled: {
    color: colors.red,
  },
  alertBox: {
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
    overflow: "hidden",
  },
  alertBar: {
    position: "absolute",
    left: 0,
    top: 28,
    width: 2,
    height: 22,
    backgroundColor: colors.yellow,
  },
  alertTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  alertText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
});
