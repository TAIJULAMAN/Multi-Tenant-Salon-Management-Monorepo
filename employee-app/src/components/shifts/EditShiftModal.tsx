import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import FormModal from "./FormModal";
import { FieldError, Pill, SelectField, figmaStyles } from "./figmaUi";
import { ME, TIME_OPTIONS, formatDuration, isValidTime, makeId, segmentMinutes, toMinutes } from "./shiftsData";

export interface ShiftSegment {
  id: string;
  start: string;
  end: string;
}

interface EditShiftModalProps {
  visible: boolean;
  onClose: () => void;
  /** e.g. "Mon, 11 Aug" */
  dayLabel: string;
  initialSegments: ShiftSegment[];
  onSave: (segments: ShiftSegment[]) => void;
}

/** Figma 1:43220 – "Edit Maria Rodriguez’s Shift". Mount with a `key` per day to reset. */
export default function EditShiftModal({ visible, onClose, dayLabel, initialSegments, onSave }: EditShiftModalProps) {
  const [segments, setSegments] = useState<ShiftSegment[]>(
    initialSegments.length ? initialSegments : [{ id: makeId("seg"), start: "", end: "" }]
  );
  const [error, setError] = useState("");

  const total = segments.reduce((sum, s) => sum + segmentMinutes(s.start, s.end), 0);

  const update = (id: string, field: "start" | "end", value: string) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setError("");
  };

  const addSegment = () => setSegments((prev) => [...prev, { id: makeId("seg"), start: "", end: "" }]);
  const removeSegment = (id: string) => setSegments((prev) => prev.filter((s) => s.id !== id));

  const handleSave = () => {
    for (const s of segments) {
      if (!isValidTime(s.start) || !isValidTime(s.end)) {
        setError("Select a start and end time for every shift.");
        return;
      }
      if (toMinutes(s.end) <= toMinutes(s.start)) {
        setError("Each shift must end after it starts.");
        return;
      }
    }
    const sorted = [...segments].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    for (let i = 1; i < sorted.length; i++) {
      if (toMinutes(sorted[i].start) < toMinutes(sorted[i - 1].end)) {
        setError("Shifts on the same day cannot overlap.");
        return;
      }
    }
    onSave(sorted);
    onClose();
  };

  return (
    <FormModal visible={visible} onClose={onClose} title={`Edit ${ME.name}’s Shift`} onPrimary={handleSave}>
      <View style={styles.dayCard}>
        <View style={styles.dayRow}>
          <Text style={styles.dayLabel}>{dayLabel}</Text>
          <Pill label={`Total: ${formatDuration(total)}`} />
        </View>

        {segments.map((seg) => (
          <View key={seg.id} style={styles.segmentRow}>
            <SelectField
              label="Start Time"
              required
              style={figmaStyles.flex1}
              placeholder="Select time"
              value={seg.start}
              options={TIME_OPTIONS}
              onSelect={(v) => update(seg.id, "start", v)}
            />
            <SelectField
              label="End Time"
              required
              style={figmaStyles.flex1}
              placeholder="Select time"
              value={seg.end}
              options={TIME_OPTIONS}
              onSelect={(v) => update(seg.id, "end", v)}
            />
            <TouchableOpacity
              style={styles.trashBtn}
              onPress={() => removeSegment(seg.id)}
              hitSlop={8}
              activeOpacity={0.7}
              accessibilityLabel="Delete shift"
            >
              <Ionicons name="trash-outline" size={20} color={colors.pink} />
            </TouchableOpacity>
          </View>
        ))}

        <FieldError message={error} />

        <TouchableOpacity style={styles.addLink} onPress={addSegment} activeOpacity={0.7}>
          <Text style={styles.addLinkText}>Add a Shift</Text>
        </TouchableOpacity>
      </View>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayLabel: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  trashBtn: {
    height: 42,
    justifyContent: "center",
  },
  addLink: {
    alignSelf: "flex-start",
  },
  addLinkText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.primary,
  },
});
