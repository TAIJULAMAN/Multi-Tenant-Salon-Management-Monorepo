import React, { useState } from "react";
import { View } from "react-native";
import FormModal from "./FormModal";
import { DateField, SelectField, TextField, figmaStyles } from "./figmaUi";
import { TIME_OPTIONS, isValidTime, parseMDY, toMinutes } from "./shiftsData";

export interface BlockedTimeData {
  title: string;
  date: string; // MM/DD/YYYY
  startTime: string;
  endTime: string;
}

interface AddBlockedTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: BlockedTimeData) => void;
}

/** "Add Blocked Time" (Add menu, 1:42980). No dedicated frame – built with the Add Time Off form styling. */
export default function AddBlockedTimeModal({ visible, onClose, onSave }: AddBlockedTimeModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const next: Record<string, string> = {};
    if (!parseMDY(date)) next.date = "Date is required";
    if (!isValidTime(startTime)) next.startTime = "Start time is required";
    if (!isValidTime(endTime)) next.endTime = "End time is required";
    if (isValidTime(startTime) && isValidTime(endTime) && toMinutes(endTime) <= toMinutes(startTime)) {
      next.endTime = "End time must be after start time";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave?.({ title: title.trim() || "Blocked Time", date, startTime, endTime });
    handleClose();
  };

  return (
    <FormModal visible={visible} onClose={handleClose} title="Add Blocked Time" onPrimary={handleSave}>
      <TextField label="Title (Optional)" placeholder="e.g. Lunch break, Training" value={title} onChangeText={setTitle} />
      <DateField label="Date" required value={date} onChange={setDate} error={errors.date} />
      <View style={figmaStyles.row}>
        <SelectField
          label="Start Time"
          required
          placeholder="Select time"
          options={TIME_OPTIONS}
          value={startTime}
          onSelect={setStartTime}
          error={errors.startTime}
          style={figmaStyles.flex1}
        />
        <SelectField
          label="End Time"
          required
          placeholder="Select time"
          options={TIME_OPTIONS}
          value={endTime}
          onSelect={setEndTime}
          error={errors.endTime}
          style={figmaStyles.flex1}
        />
      </View>
    </FormModal>
  );
}
