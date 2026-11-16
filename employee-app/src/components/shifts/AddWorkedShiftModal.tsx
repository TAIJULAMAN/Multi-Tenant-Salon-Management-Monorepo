import React, { useState } from "react";
import { View } from "react-native";
import FormModal from "./FormModal";
import { DateField, SelectField, figmaStyles } from "./figmaUi";
import { SCHEDULE_TYPES, TIME_OPTIONS, WorkedShift, isValidTime, parseMDY, toISO, toMinutes } from "./shiftsData";

interface AddWorkedShiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Omit<WorkedShift, "id">) => void;
}

/** Figma 1:44669 – "Add Shift" (Worked Shifts → Add). */
export default function AddWorkedShiftModal({ visible, onClose, onSave }: AddWorkedShiftModalProps) {
  const [scheduleType, setScheduleType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setScheduleType("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const next: Record<string, string> = {};
    const d = parseMDY(date);
    if (!scheduleType) next.scheduleType = "Schedule type is required";
    if (!d) next.date = "Date is required";
    else if (d.getTime() > Date.now()) next.date = "You can only add past shifts";
    if (!isValidTime(startTime)) next.startTime = "Start time is required";
    if (!isValidTime(endTime)) next.endTime = "End time is required";
    if (isValidTime(startTime) && isValidTime(endTime) && toMinutes(endTime) <= toMinutes(startTime)) {
      next.endTime = "End time must be after start time";
    }
    setErrors(next);
    if (Object.keys(next).length || !d) return;
    onSave({ dateISO: toISO(d), scheduleType, timeIn: startTime, timeOut: endTime, breakMinutes: 0 });
    handleClose();
  };

  return (
    <FormModal visible={visible} onClose={handleClose} title="Add Shift" onPrimary={handleSave}>
      <View style={figmaStyles.row}>
        <SelectField
          label="Schedule Type"
          required
          placeholder="Select type"
          options={SCHEDULE_TYPES}
          value={scheduleType}
          onSelect={setScheduleType}
          error={errors.scheduleType}
          style={figmaStyles.flex1}
        />
        <DateField
          label="Date"
          required
          trailing="chevron"
          value={date}
          onChange={setDate}
          error={errors.date}
          style={figmaStyles.flex1}
        />
      </View>
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
