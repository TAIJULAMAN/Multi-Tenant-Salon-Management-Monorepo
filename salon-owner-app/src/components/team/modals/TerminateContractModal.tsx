import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TerminateContractModalProps {
  visible: boolean;
  onClose: () => void;
  memberName?: string;
  onConfirm?: (data: { endDate: string; reason: string; removeAccessDate: string }) => void;
}

export default function TerminateContractModal({
  visible,
  onClose,
  memberName,
  onConfirm,
}: TerminateContractModalProps) {
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [removeAccessDate, setRemoveAccessDate] = useState("");

  const handleTerminate = () => {
    if (!endDate.trim()) {
      Alert.alert("Required Field", "Please enter the contract end date.");
      return;
    }
    if (!reason.trim()) {
      Alert.alert("Required Field", "Please enter the reason for termination.");
      return;
    }

    if (onConfirm) {
      onConfirm({ endDate, reason, removeAccessDate });
    } else {
      Alert.alert(
        "Contract Terminated",
        `Contract for ${memberName || "this member"} has been terminated.`
      );
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.avoidingView}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalCard}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Terminate Contract</Text>
                  <Text style={styles.subtitle}>
                    Are you sure you want to terminate this contract?
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formContent}>
                  {/* Field 1: End Date */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Date *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter end date"
                      placeholderTextColor="#94A3B8"
                      value={endDate}
                      onChangeText={setEndDate}
                    />
                  </View>

                  {/* Field 2: Reason */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Reason *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Enter reason"
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={reason}
                      onChangeText={setReason}
                    />
                  </View>

                  {/* Field 3: Remove Access To Platform */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Remove Access To The Platform On *</Text>
                    <View style={styles.dateInputWrapper}>
                      <TextInput
                        style={styles.dateInput}
                        placeholder="Select date"
                        placeholderTextColor="#94A3B8"
                        value={removeAccessDate}
                        onChangeText={setRemoveAccessDate}
                      />
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#64748B"
                        style={styles.calendarIcon}
                      />
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.terminateBtn}
                    onPress={handleTerminate}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.terminateBtnText}>Terminate Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avoidingView: {
    width: "100%",
    maxWidth: 420,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 20,
  },
  formContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 96,
    paddingTop: 12,
  },
  dateInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingRight: 42,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  calendarIcon: {
    position: "absolute",
    right: 14,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  terminateBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },
  terminateBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
});
