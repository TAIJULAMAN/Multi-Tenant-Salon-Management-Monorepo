import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import DatePickerInput from "@/components/ui/DatePickerInput";
import AppointmentDialog, { DialogButton, dialogStyles } from "./AppointmentDialog";
import { RepeatFrequency, RepeatRule, WEEK_DAYS, repeatSummary } from "./appointmentData";

const FREQUENCIES: RepeatFrequency[] = ["Daily", "Weekly", "Monthly", "Yearly"];
const UNIT: Record<RepeatFrequency, string> = { Daily: "day", Weekly: "week", Monthly: "month", Yearly: "year" };

// DatePickerInput works with MM/DD/YYYY strings; the store uses ISO.
const isoToPicker = (iso?: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};
const pickerToIso = (value: string) => {
  const [m, d, y] = value.split("/");
  return y && m && d ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : undefined;
};

interface RepeatingDialogProps {
  visible: boolean;
  initial: RepeatRule | null;
  /** weekday of the appointment ("Mon"…), used as default day */
  defaultDay: string;
  onClose: () => void;
  onSave: (rule: RepeatRule) => void;
}

/** Figma 1:25627 – "Set as Repeating" dialog. */
export default function RepeatingDialog({ visible, initial, defaultDay, onClose, onSave }: RepeatingDialogProps) {
  const [frequency, setFrequency] = useState<RepeatFrequency>("Weekly");
  const [every, setEvery] = useState("1");
  const [days, setDays] = useState<string[]>([defaultDay]);
  const [end, setEnd] = useState<RepeatRule["end"]>("never");
  const [endAfter, setEndAfter] = useState("1");
  const [endDate, setEndDate] = useState("");
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setFrequency(initial?.frequency ?? "Weekly");
      setEvery(String(initial?.every ?? 1));
      setDays(initial?.days.length ? initial.days : [defaultDay]);
      setEnd(initial?.end ?? "never");
      setEndAfter(String(initial?.endAfter ?? 1));
      setEndDate(isoToPicker(initial?.endDate));
    }
  }

  const rule: RepeatRule = {
    frequency,
    every: Math.max(1, parseInt(every, 10) || 1),
    days: frequency === "Weekly" ? WEEK_DAYS.filter((d) => days.includes(d)) : [],
    end,
    endAfter: end === "after" ? Math.max(1, parseInt(endAfter, 10) || 1) : undefined,
    endDate: end === "date" ? pickerToIso(endDate) : undefined,
  };

  const count = end === "never" ? "∞" : end === "after" ? String(rule.endAfter) : endDate || "—";
  const isValid = (frequency !== "Weekly" || rule.days.length > 0) && (end !== "date" || !!rule.endDate);

  const toggleDay = (day: string) =>
    setDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));

  return (
    <AppointmentDialog
      visible={visible}
      title="Set as Repeating"
      onClose={onClose}
      footer={
        <View style={dialogStyles.actionsRight}>
          <DialogButton label="Save repetition" disabled={!isValid} onPress={() => onSave(rule)} />
        </View>
      }
    >
      {/* Preview */}
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview</Text>
        <View style={styles.previewRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mutedLabel}>Frequency</Text>
            <View style={styles.freqBadge}>
              <Text style={styles.freqBadgeText}>{repeatSummary(rule)}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mutedLabel}>Number of appointments</Text>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Frequency */}
      <View>
        <Text style={dialogStyles.label}>Frequency</Text>
        <View style={styles.chipRow}>
          {FREQUENCIES.map((f) => (
            <Chip key={f} label={f} active={frequency === f} onPress={() => setFrequency(f)} />
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Repetition details */}
      <View style={{ gap: 12 }}>
        <Text style={[dialogStyles.label, { marginBottom: 0 }]}>Repetition details</Text>
        <View style={styles.inlineRow}>
          <Text style={styles.inlineText}>Repeat every</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="number-pad"
            value={every}
            onChangeText={setEvery}
            maxLength={2}
          />
          <Text style={styles.inlineText}>{UNIT[frequency]}</Text>
        </View>
        {frequency === "Weekly" && (
          <View>
            <Text style={dialogStyles.label}>Days of the week</Text>
            <View style={styles.chipRow}>
              {WEEK_DAYS.map((d) => (
                <Chip key={d} label={d} small active={days.includes(d)} onPress={() => toggleDay(d)} />
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* End of repetition */}
      <View style={{ gap: 12 }}>
        <Text style={[dialogStyles.label, { marginBottom: 0 }]}>End of repetition</Text>
        <TouchableOpacity style={styles.inlineRow} onPress={() => setEnd("never")} activeOpacity={0.7}>
          <Radio checked={end === "never"} />
          <Text style={styles.inlineText}>Never</Text>
        </TouchableOpacity>
        <View style={styles.inlineRow}>
          <TouchableOpacity style={styles.inlineRow} onPress={() => setEnd("after")} activeOpacity={0.7}>
            <Radio checked={end === "after"} />
            <Text style={styles.inlineText}>After</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.smallInput}
            keyboardType="number-pad"
            value={endAfter}
            onFocus={() => setEnd("after")}
            onChangeText={setEndAfter}
            maxLength={3}
          />
          <Text style={styles.inlineText}>time(s)</Text>
        </View>
        <View style={[styles.inlineRow, { alignItems: "flex-start" }]}>
          <TouchableOpacity
            style={[styles.inlineRow, { marginTop: 11 }]}
            onPress={() => setEnd("date")}
            activeOpacity={0.7}
          >
            <Radio checked={end === "date"} />
            <Text style={styles.inlineText}>In</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, maxWidth: 200 }}>
            <DatePickerInput
              placeholder="mm/dd/yyyy"
              value={endDate}
              onChange={(v) => {
                setEndDate(v);
                setEnd("date");
              }}
            />
          </View>
        </View>
      </View>
    </AppointmentDialog>
  );
}

function Chip({ label, active, small, onPress }: { label: string; active: boolean; small?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, small && styles.chipSmall, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, small && { fontSize: 13 }, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return <View style={[styles.radio, checked && styles.radioOn]}>{checked && <View style={styles.radioDot} />}</View>;
}

const styles = StyleSheet.create({
  preview: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 20,
    gap: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  previewRow: {
    flexDirection: "row",
    gap: 12,
  },
  mutedLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },
  freqBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E6F8EC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  freqBadgeText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.green,
  },
  countText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  chipRow: {
    flexDirection: "row",
    gap: 6,
  },
  chip: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSmall: {
    height: 44,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  smallInput: {
    width: 40,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
