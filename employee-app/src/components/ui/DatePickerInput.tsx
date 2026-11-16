import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@expo/ui/community/datetime-picker";

interface DatePickerInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (dateString: string) => void;
  error?: string;
  mode?: "date" | "time" | "datetime";
}

export default function DatePickerInput({
  label,
  required,
  placeholder = "Select date",
  value,
  onChange,
  error,
  mode = "date",
}: DatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Parse string MM/DD/YYYY to Date object
  const parseDate = (val?: string): Date => {
    if (val) {
      const parts = val.split("/");
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
          return new Date(y, m, d);
        }
      }
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  };

  const currentDate = parseDate(value);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Hide picker on Android immediately upon selection or cancellation
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      const yyyy = selectedDate.getFullYear();
      onChange(`${mm}/${dd}/${yyyy}`);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.inputButton, error ? styles.inputError : null]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={19} color="#9CA3AF" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode={mode}
          display={Platform.OS === "ios" ? "inline" : "default"}
          themeVariant="light"
          accentColor="#635BFF"
          onChange={handleDateChange}
          onDismiss={() => setShowPicker(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 6,
  },
  required: {
    color: "#EF4444",
  },
  inputButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  errorText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#EF4444",
    marginTop: 4,
  },
});
