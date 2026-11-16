import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import CustomModal from "@/components/ui/CustomModal";
import DatePickerInput from "@/components/ui/DatePickerInput";
import CustomButton from "@/components/ui/CustomButton";

interface CustomRangeModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (label: string) => void;
}

/** "Custom Range" option of the period dropdown (Figma 1:14772). */
export default function CustomRangeModal({ visible, onClose, onApply }: CustomRangeModalProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const apply = () => {
    if (!from || !to) {
      Alert.alert("Select dates", "Please choose both a start and an end date.");
      return;
    }
    onApply(`${from} - ${to}`);
    onClose();
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="Custom Range">
      <View style={styles.body}>
        <DatePickerInput label="From" required value={from} onChange={setFrom} placeholder="Start date" />
        <DatePickerInput label="To" required value={to} onChange={setTo} placeholder="End date" />
        <View style={styles.row}>
          <CustomButton title="Cancel" variant="secondary" onPress={onClose} style={styles.flex} />
          <CustomButton title="Apply" onPress={apply} style={styles.flex} />
        </View>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  flex: {
    flex: 1,
  },
});
