import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const SALONS = [
  "Select Salon",
  "Glamour Beauty",
  "Chic Hair & Beauty",
  "Urban Elegance",
  "Luxe Lounge",
  "Radiant Salon",
  "Style Studio",
];

const TAX_TYPES = [
  "Select Tax Type",
  "VAT",
  "Income Tax",
  "Social Security",
  "Corporate Tax",
  "Sales Tax",
  "Property Tax",
  "Other",
];

interface NewTaxUploadTabProps {
  onSuccess: () => void;
}

export default function NewTaxUploadTab({ onSuccess }: NewTaxUploadTabProps) {
  const [salon, setSalon] = useState("Select Salon");
  const [taxType, setTaxType] = useState("Select Tax Type");
  const [file, setFile] = useState<{ name: string; size: string; uri?: string } | null>({
    name: "IELTS-Writing-Structures-Guide.pdf",
    size: "24.5 MB",
  });
  const [note, setNote] = useState("");

  // Dropdown states (inline below button)
  const [salonDropdownOpen, setSalonDropdownOpen] = useState(false);
  const [taxTypeDropdownOpen, setTaxTypeDropdownOpen] = useState(false);

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const sizeInMb = asset.size ? asset.size / (1024 * 1024) : 0;
        const sizeStr = asset.size
          ? sizeInMb >= 1
            ? `${sizeInMb.toFixed(1)} MB`
            : `${(asset.size / 1024).toFixed(0)} KB`
          : "1.2 MB";

        setFile({
          name: asset.name,
          size: sizeStr,
          uri: asset.uri,
        });
      }
    } catch (e) {
      Alert.alert("Error", "Could not select file.");
    }
  };

  const handleSendForApproval = () => {
    if (salon === "Select Salon" || taxType === "Select Tax Type") {
      Alert.alert("Missing Fields", "Please select a salon and tax type.");
      return;
    }

    if (!file) {
      Alert.alert("File Required", "Please attach a tax document PDF.");
      return;
    }

    Alert.alert(
      "Sent for Approval",
      `Tax document for ${salon} (${taxType}) has been submitted for review.`,
      [
        {
          text: "OK",
          onPress: () => {
            onSuccess();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setSalon("Select Salon");
    setTaxType("Select Tax Type");
    setFile(null);
    setNote("");
  };

  const closeAllDropdowns = () => {
    if (salonDropdownOpen) setSalonDropdownOpen(false);
    if (taxTypeDropdownOpen) setTaxTypeDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <View style={styles.container}>
        {/* ─────────────────────────────────────────────────────────────
            1. Header Title
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>New Tax Upload</Text>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            2. Main Upload Form Card
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.formCard}>
          {/* Salon Selector (Label Above, Input + Anchored Dropdown Below) */}
          <View style={[styles.fieldGroup, { zIndex: 1000 }]}>
            <Text style={styles.fieldLabel}>Salon *</Text>
            <View style={styles.dropdownAnchorWrap}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setTaxTypeDropdownOpen(false);
                  setSalonDropdownOpen(!salonDropdownOpen);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    salon === "Select Salon" && styles.placeholderText,
                  ]}
                >
                  {salon}
                </Text>
                <Ionicons
                  name={salonDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Anchored Popover List directly below the select */}
              {salonDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {SALONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.popoverItem,
                        salon === item && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setSalon(item);
                        setSalonDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          salon === item && styles.popoverItemTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                      {salon === item && (
                        <Ionicons name="checkmark" size={16} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Tax Type Selector (Label Above, Input + Anchored Dropdown Below) */}
          <View style={[styles.fieldGroup, { zIndex: 900 }]}>
            <Text style={styles.fieldLabel}>Tax Type *</Text>
            <View style={styles.dropdownAnchorWrap}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setSalonDropdownOpen(false);
                  setTaxTypeDropdownOpen(!taxTypeDropdownOpen);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    taxType === "Select Tax Type" && styles.placeholderText,
                  ]}
                >
                  {taxType}
                </Text>
                <Ionicons
                  name={taxTypeDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Anchored Popover List directly below the select */}
              {taxTypeDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {TAX_TYPES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.popoverItem,
                        taxType === item && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setTaxType(item);
                        setTaxTypeDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          taxType === item && styles.popoverItemTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                      {taxType === item && (
                        <Ionicons name="checkmark" size={16} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Dropzone Section */}
          <View style={styles.dropzoneSection}>
            <View style={styles.dropzoneHeader}>
              <Text style={styles.dropzoneTitle}>Drop Tax Document</Text>
              <Text style={styles.dropzoneSubtitle}>
                You can upload multiple employees in one PDF file
              </Text>
            </View>

            <TouchableOpacity
              style={styles.dropzoneBox}
              onPress={handlePickDocument}
              activeOpacity={0.8}
            >
              <View style={styles.cursorIconCircle}>
                <Ionicons name="navigate-outline" size={22} color="#635BFF" />
              </View>
              <Text style={styles.browseText}>Drop here or click to browse</Text>
            </TouchableOpacity>

            {/* Uploaded File Card */}
            {file && (
              <View style={styles.uploadedFileCard}>
                <View style={styles.fileCardLeft}>
                  <Ionicons
                    name="document-outline"
                    size={24}
                    color="#635BFF"
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileNameText} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileSizeText}>{file.size}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => setFile(null)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color="#F87171" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Note (Optional) Textarea */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Note(Optional)</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              placeholderTextColor="#94A3B8"
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            3. Bottom Action Buttons
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSendForApproval}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Send for Approval</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
    position: "relative",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  dropdownAnchorWrap: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  dropdownButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E293B",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  popoverMenu: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    paddingVertical: 6,
    zIndex: 99999,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  popoverItemActive: {
    backgroundColor: "#F4F3FF",
  },
  popoverItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
  },
  popoverItemTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  dropzoneSection: {
    gap: 12,
    paddingVertical: 4,
    zIndex: 1,
  },
  dropzoneHeader: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  dropzoneSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  dropzoneBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#C7D2FE",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFF",
  },
  cursorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  browseText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  uploadedFileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  fileCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#635BFF",
  },
  fileSizeText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  trashBtn: {
    padding: 6,
    borderRadius: 6,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
    minHeight: 88,
  },
  bottomActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    zIndex: 1,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  submitButton: {
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
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
