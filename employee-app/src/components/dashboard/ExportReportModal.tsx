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
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

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
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">(
    "Monthly",
  );
  const [format, setFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");
  const [isExporting, setIsExporting] = useState(false);

  const ranges: ("Daily" | "Weekly" | "Monthly" | "Yearly")[] = [
    "Daily",
    "Weekly",
    "Monthly",
    "Yearly",
  ];

  const formats: {
    key: "PDF" | "Excel" | "CSV";
    label: string;
    icon: any;
    ext: string;
  }[] = [
    {
      key: "PDF",
      label: "PDF Document",
      icon: "document-text-outline",
      ext: ".pdf",
    },
    {
      key: "Excel",
      label: "Excel Spreadsheet",
      icon: "grid-outline",
      ext: ".xlsx",
    },
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
        [{ text: "OK" }],
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
                  <Text style={styles.subtitle}>
                    Select range and output format
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={colors.text} />
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
                          color={
                            isSelected ? colors.primary : colors.textSecondary
                          }
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
                  style={[
                    styles.exportBtn,
                    isExporting && styles.exportBtnDisabled,
                  ]}
                  onPress={handleExport}
                  disabled={isExporting}
                  activeOpacity={0.85}
                >
                  {isExporting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Ionicons
                        name="download-outline"
                        size={16}
                        color={colors.white}
                      />
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.overlay,
    shadowOpacity: 0.25,
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
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.text,
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
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  rangeChipActive: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  rangeChipText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  rangeChipTextActive: {
    color: colors.primary,
    fontFamily: fonts.semibold,
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
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  formatItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  formatIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  formatIconCircleActive: {
    backgroundColor: colors.primaryTint,
  },
  formatLabel: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  formatLabelActive: {
    color: colors.primary,
  },
  formatExt: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primary,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  exportBtn: {
    flex: 1.6,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...shadows.primary,
  },
  exportBtnDisabled: {
    opacity: 0.7,
  },
  exportBtnText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: colors.white,
  },
});
