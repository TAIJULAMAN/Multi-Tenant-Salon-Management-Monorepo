import React, { useState } from "react";
import { View } from "react-native";
import FormModal from "./FormModal";
import { DateField, FieldError, figmaStyles } from "./figmaUi";
import { parseMDY } from "./shiftsData";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Called with the range, or null when cleared. */
  onApply: (range: DateRange | null) => void;
}

/** "Custom Range" picker (Select dates / Select range filters) – Start/End date + Clear / Apply. */
export default function DateRangeModal({ visible, onClose, title = "Custom Range", onApply }: DateRangeModalProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const f = parseMDY(from);
    const t = parseMDY(to);
    if (!f || !t) {
      setError("Select both dates");
      return;
    }
    if (t.getTime() < f.getTime()) {
      setError("End date must be after start date");
      return;
    }
    setError("");
    onApply({ from: f, to: t });
    onClose();
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setError("");
    onApply(null);
    onClose();
  };

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={title}
      primaryLabel="Apply"
      onPrimary={handleApply}
      secondaryLabel="Clear"
      onSecondary={handleClear}
    >
      <View style={figmaStyles.row}>
        <DateField label="Start Date" required value={from} onChange={setFrom} style={figmaStyles.flex1} />
        <DateField label="End Date" required value={to} onChange={setTo} style={figmaStyles.flex1} />
      </View>
      <FieldError message={error} />
    </FormModal>
  );
}
