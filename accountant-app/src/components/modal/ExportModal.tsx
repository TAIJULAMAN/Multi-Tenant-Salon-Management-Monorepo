import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ExportModal({ isOpen, onClose, title }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "csv" | "json">("pdf");
  const [fileName, setFileName] = useState(() => {
    const sanitizedTitle = title.toLowerCase().replace(/\s+/g, "-");
    return `${sanitizedTitle}-${new Date().getFullYear()}`;
  });
  const [exportState, setExportState] = useState<"idle" | "loading" | "success">("idle");

  if (!isOpen) return null;

  const handleExport = () => {
    setExportState("loading");

    setTimeout(() => {
      setExportState("success");
      setTimeout(() => {
        setExportState("idle");
        onClose();
      }, 1200);
    }, 1500);
  };

  const handleClose = () => {
    setExportState("idle");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.modalTitle}>Export Chart Data</Text>
                <Text style={styles.modalSubtitle}>{title}</Text>
              </View>

              {exportState === "idle" ? (
                <View style={styles.formContainer}>
                  {/* File Name */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>FILE NAME</Text>
                    <TextInput
                      style={styles.textInput}
                      value={fileName}
                      onChangeText={setFileName}
                      placeholder="Enter file name"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* Format Options */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>CHOOSE FORMAT</Text>
                    <View style={styles.formatRow}>
                      {/* PDF */}
                      <TouchableOpacity
                        style={[
                          styles.formatCard,
                          selectedFormat === "pdf" && styles.formatCardActive,
                        ]}
                        onPress={() => setSelectedFormat("pdf")}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="document-text-outline"
                          size={24}
                          color={selectedFormat === "pdf" ? "#635BFF" : "#94A3B8"}
                        />
                        <Text
                          style={[
                            styles.formatText,
                            selectedFormat === "pdf" && styles.formatTextActive,
                          ]}
                        >
                          PDF Document
                        </Text>
                      </TouchableOpacity>

                      {/* CSV */}
                      <TouchableOpacity
                        style={[
                          styles.formatCard,
                          selectedFormat === "csv" && styles.formatCardActive,
                        ]}
                        onPress={() => setSelectedFormat("csv")}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="grid-outline"
                          size={24}
                          color={selectedFormat === "csv" ? "#635BFF" : "#94A3B8"}
                        />
                        <Text
                          style={[
                            styles.formatText,
                            selectedFormat === "csv" && styles.formatTextActive,
                          ]}
                        >
                          CSV Sheet
                        </Text>
                      </TouchableOpacity>

                      {/* JSON */}
                      <TouchableOpacity
                        style={[
                          styles.formatCard,
                          selectedFormat === "json" && styles.formatCardActive,
                        ]}
                        onPress={() => setSelectedFormat("json")}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="code-slash-outline"
                          size={24}
                          color={selectedFormat === "json" ? "#635BFF" : "#94A3B8"}
                        />
                        <Text
                          style={[
                            styles.formatText,
                            selectedFormat === "json" && styles.formatTextActive,
                          ]}
                        >
                          JSON Data
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={handleClose}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.exportBtn}
                      onPress={handleExport}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.exportBtnText}>Export Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : exportState === "loading" ? (
                <View style={styles.stateCenterBox}>
                  <ActivityIndicator size="large" color="#635BFF" />
                  <Text style={styles.stateTitle}>Generating file...</Text>
                  <Text style={styles.stateSub}>Please do not close this window</Text>
                </View>
              ) : (
                <View style={styles.stateCenterBox}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={24} color="#10B981" />
                  </View>
                  <Text style={styles.stateTitle}>Export Complete!</Text>
                  <Text style={styles.stateSub}>Your download has started.</Text>
                </View>
              )}
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },
  header: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 2,
  },
  formContainer: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  formatRow: {
    flexDirection: "row",
    gap: 8,
  },
  formatCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 6,
  },
  formatCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "rgba(99, 91, 255, 0.05)",
  },
  formatText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    textAlign: "center",
  },
  formatTextActive: {
    color: "#635BFF",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  exportBtn: {
    flex: 1,
    backgroundColor: "#635BFF",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stateCenterBox: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 14,
  },
  stateSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
});
