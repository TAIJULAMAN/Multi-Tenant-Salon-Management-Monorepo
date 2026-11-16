import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SupportTicket,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  getPriorityBadgeStyle,
} from "../supportData";

interface CreateTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newTicket: SupportTicket) => void;
}

export default function CreateTicketModal({
  visible,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("Technical Issue");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);

  const resetForm = () => {
    setSubject("");
    setCategory("Technical Issue");
    setPriority("Medium");
    setDescription("");
    setAttachment(null);
  };

  const handleSubmit = () => {
    if (!subject.trim()) {
      Alert.alert("Validation Error", "Please enter a subject for your ticket.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validation Error", "Please provide a detailed description of the issue.");
      return;
    }

    const randomId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: randomId,
      subject: subject.trim(),
      category,
      priority,
      status: "Pending Admin",
      date: "Just now",
      description: description.trim(),
      attachmentName: attachment || undefined,
      messages: [
        {
          id: `m_${Date.now()}`,
          sender: "User",
          text: description.trim(),
          time: "Just now",
        },
      ],
    };

    onSubmit(newTicket);
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="help-buoy-outline" size={20} color="#635BFF" />
              </View>
              <View>
                <Text style={styles.title}>Submit Support Ticket</Text>
                <Text style={styles.subtitle}>Our customer team usually responds within 2 hours</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Subject */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Ticket Subject <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Brief summary of the issue..."
                placeholderTextColor="#94A3B8"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.chipsRow}>
                {TICKET_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Priority */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority Level</Text>
              <View style={styles.priorityRow}>
                {TICKET_PRIORITIES.map((p) => {
                  const isSelected = priority === p;
                  const pBadge = getPriorityBadgeStyle(p);
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityBtn,
                        isSelected && {
                          backgroundColor: pBadge.bg,
                          borderColor: pBadge.text,
                        },
                      ]}
                      onPress={() => setPriority(p)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.priorityBtnText,
                          isSelected && { color: pBadge.text, fontFamily: "Manrope_700Bold" },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Detailed Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Explain what happened, steps to reproduce, or what assistance you need..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Mock Attachment */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Attachment (Screenshots or Logs)</Text>
              {attachment ? (
                <View style={styles.attachmentBox}>
                  <Ionicons name="document-attach" size={18} color="#635BFF" />
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {attachment}
                  </Text>
                  <TouchableOpacity onPress={() => setAttachment(null)}>
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadTrigger}
                  onPress={() => setAttachment(`screenshot_${Date.now().toString().slice(-4)}.png`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="cloud-upload-outline" size={18} color="#635BFF" />
                  <Text style={styles.uploadTriggerText}>Tap to attach file or screenshot</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 10.5,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginVertical: 4,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginBottom: 6,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  chipText: {
    fontSize: 11.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  chipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  priorityBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  uploadTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
  },
  uploadTriggerText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  attachmentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#EEF2FF",
  },
  attachmentName: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  submitBtn: {
    flex: 1.5,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
