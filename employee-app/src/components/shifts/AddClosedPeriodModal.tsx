import React, { useState } from "react";
import { View } from "react-native";
import FormModal from "./FormModal";
import { DateField, TextField, figmaStyles } from "./figmaUi";
import { parseMDY } from "./shiftsData";

export interface ClosedPeriodData {
  reason: string;
  startDate: string; // MM/DD/YYYY
  endDate: string; // MM/DD/YYYY
}

interface AddClosedPeriodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: ClosedPeriodData) => void;
}

/** "Business Closed Period" (Add menu, 1:42980). No dedicated frame – built with the Add Time Off form styling. */
export default function AddClosedPeriodModal({ visible, onClose, onSave }: AddClosedPeriodModalProps) {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setReason("");
    setStartDate("");
    setEndDate("");
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const next: Record<string, string> = {};
    const start = parseMDY(startDate);
    const end = parseMDY(endDate);
    if (!start) next.startDate = "Start date is required";
    if (!end) next.endDate = "End date is required";
    if (start && end && end.getTime() < start.getTime()) next.endDate = "End date must be after start date";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave?.({ reason: reason.trim() || "Business Closed", startDate, endDate });
    handleClose();
  };

  return (
    <FormModal visible={visible} onClose={handleClose} title="Business Closed Period" onPrimary={handleSave}>
      <View style={figmaStyles.row}>
        <DateField label="Start Date" required value={startDate} onChange={setStartDate} error={errors.startDate} style={figmaStyles.flex1} />
        <DateField label="End Date" required value={endDate} onChange={setEndDate} error={errors.endDate} style={figmaStyles.flex1} />
      </View>
      <TextField
        label="Description (Optional)"
        placeholder="Add description or note"
        value={reason}
        onChangeText={setReason}
        multiline
      />
    </FormModal>
  );
}
