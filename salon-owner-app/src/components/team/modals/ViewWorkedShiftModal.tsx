import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";

interface ViewWorkedShiftModalProps {
  visible: boolean;
  onClose: () => void;
  shiftData: {
    name: string;
    role: string;
    avatarUrl: string;
    uploader?: string;
    date?: string;
    clockIn: string;
    clockOut: string;
    totalHours: string;
    daysWorked?: number;
    avgDay?: string;
    breakDuration?: string;
    overtime?: string;
    status?: string;
  } | null;
  onEdit?: () => void;
}

export default function ViewWorkedShiftModal({
  visible,
  onClose,
  shiftData,
  onEdit,
}: ViewWorkedShiftModalProps) {
  if (!shiftData) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Worked Shift Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Member Profile */}
            <View style={styles.memberCard}>
              <Avatar name={shiftData.name} uri={shiftData.avatarUrl} size={48} />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{shiftData.name}</Text>
                <Text style={styles.memberRole}>{shiftData.role} · Uploaded by: {shiftData.uploader || "Mario Rossi"}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{shiftData.status || "Completed"}</Text>
              </View>
            </View>

            {/* Grid Metrics */}
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Date</Text>
                <Text style={styles.gridValue}>{shiftData.date || "Dec 01, 2024"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Total Hours</Text>
                <Text style={[styles.gridValue, { color: "#635BFF" }]}>{shiftData.totalHours || "160h"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Days Worked</Text>
                <Text style={styles.gridValue}>{shiftData.daysWorked || 21} Days</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Avg / Day</Text>
                <Text style={styles.gridValue}>{shiftData.avgDay || "7.6h"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Clock In</Text>
                <Text style={styles.gridValue}>{shiftData.clockIn || "09:00 AM"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Clock Out</Text>
                <Text style={styles.gridValue}>{shiftData.clockOut || "05:00 PM"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Break Time</Text>
                <Text style={styles.gridValue}>{shiftData.breakDuration || "45 min"}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Overtime</Text>
                <Text style={styles.gridValue}>{shiftData.overtime || "0.0h"}</Text>
              </View>
            </View>

            {/* Shift Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>Log Note</Text>
              <Text style={styles.noteDesc}>
                Employee punched in via mobile terminal. All shifts and logged hours recorded for December 2024.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeActionBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeActionBtnText}>Close</Text>
            </TouchableOpacity>

            {onEdit && (
              <TouchableOpacity
                style={styles.editActionBtn}
                onPress={() => {
                  onClose();
                  onEdit();
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="pencil" size={15} color="#FFFFFF" />
                <Text style={styles.editActionBtnText}>Edit Shift</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 16,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  memberName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  memberRole: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#15803D",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gridLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  gridValue: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  noteBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  noteTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  noteDesc: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  closeActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  closeActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  editActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  editActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
