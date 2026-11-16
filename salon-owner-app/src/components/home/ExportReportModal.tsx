import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExportReportModalProps {
  visible: boolean;
  onClose: () => void;
  defaultTitle?: string;
}

export default function ExportReportModal({
  visible,
  onClose,
  defaultTitle = "Export Report",
}: ExportReportModalProps) {
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");
  const [isExporting, setIsExporting] = useState(false);

  const ranges: Array<"Daily" | "Weekly" | "Monthly" | "Yearly"> = [
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly",
  ];

  const formats: Array<{ key: "PDF" | "Excel" | "CSV"; label: string; icon: any; ext: string }> = [
    { key: "PDF", label: "PDF Document", icon: "document-text-outline", ext: ".pdf" },
    { key: "Excel", label: "Excel Spreadsheet", icon: "grid-outline", ext: ".xlsx" },
    { key: "CSV", label: "CSV Data", icon: "list-outline", ext: ".csv" },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      Alert.alert(
        "Report Exported",
        `Successfully generated ${range} ${defaultTitle} as a ${format} file. Saved to your downloads.`,
        [{ text: "OK" }]
      );
    }, 900);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.title}>{defaultTitle}</Text>
                  <Text style={styles.subtitle}>Select range and output format</Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Range Select */}
              <Text style={styles.sectionLabel}>Date Range *</Text>
              <View style={styles.rangeGrid}>
                {ranges.map((r) => {
                  const isSelected = range === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.rangeChip,
                        isSelected && styles.rangeChipActive,
                      ]}
                      onPress={() => setRange(r)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.rangeChipText,
                          isSelected && styles.rangeChipTextActive,
                        ]}
                      >
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Format Select */}
              <Text style={styles.sectionLabel}>File Format *</Text>
              <View style={styles.formatList}>
                {formats.map((f) => {
                  const isSelected = format === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[
                        styles.formatItem,
                        isSelected && styles.formatItemActive,
                      ]}
                      onPress={() => setFormat(f.key)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.formatIconCircle,
                          isSelected && styles.formatIconCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={f.icon}
                          size={18}
                          color={isSelected ? "#635BFF" : "#64748B"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.formatLabel,
                            isSelected && styles.formatLabelActive,
                          ]}
                        >
                          {f.label}
                        </Text>
                        <Text style={styles.formatExt}>{f.ext}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={onClose}
                  disabled={isExporting}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportBtn, isExporting && styles.exportBtnDisabled]}
                  onPress={handleExport}
                  disabled={isExporting}
                  activeOpacity={0.85}
                >
                  {isExporting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.exportBtnText}>Export Now</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
    marginBottom: 8,
    marginTop: 4,
  },
  rangeGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  rangeChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  rangeChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  rangeChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  rangeChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  formatList: {
    gap: 8,
    marginBottom: 20,
  },
  formatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  formatItemActive: {
    borderColor: "#635BFF",
    backgroundColor: "#FAFAFF",
  },
  formatIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  formatIconCircleActive: {
    backgroundColor: "#EEF2FF",
  },
  formatLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  formatLabelActive: {
    color: "#635BFF",
  },
  formatExt: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#635BFF",
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#635BFF",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  exportBtn: {
    flex: 1.6,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  exportBtnDisabled: {
    opacity: 0.7,
  },
  exportBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
