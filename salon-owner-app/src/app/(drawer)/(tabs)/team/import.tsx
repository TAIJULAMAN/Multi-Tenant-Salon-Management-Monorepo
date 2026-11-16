import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { teamStore, TeamMember } from "@/components/team/CreateTeam/teamStore";

interface ImportRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  services: string;
  avatarUrl: string;
}

const SAMPLE_CSV_PREVIEW: ImportRecord[] = [
  {
    id: "EMP-001",
    name: "Elena Rostova",
    email: "elena.rostova@beautywellness.com",
    phone: "+39 342 112 3344",
    role: "Senior Stylist",
    status: "Active",
    services: "Hair Styling, Balayage",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "EMP-002",
    name: "Marco Bianchi",
    email: "m.bianchi@beautywellness.com",
    phone: "+39 349 998 8776",
    role: "Colorist",
    status: "Active",
    services: "Coloring, Highlights",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "EMP-003",
    name: "Giulia Bellini",
    email: "giulia.b@beautywellness.com",
    phone: "+39 331 445 6677",
    role: "Esthetician",
    status: "Active",
    services: "Skin Care, Waxing",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "EMP-004",
    name: "Luca Fontana",
    email: "luca.fontana@beautywellness.com",
    phone: "+39 320 889 9001",
    role: "Nail Artist",
    status: "Active",
    services: "Manicure, Pedicure",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
];

export default function ImportTeamScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([
    "EMP-001",
    "EMP-002",
    "EMP-003",
    "EMP-004",
  ]);
  const [isImporting, setIsImporting] = useState(false);

  const handleDownloadTemplate = (format: "csv" | "xlsx") => {
    Alert.alert(
      "Download Template",
      `Employee template (${format.toUpperCase()}) downloaded to device files.`,
      [{ text: "OK" }]
    );
  };

  const handlePickFile = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFileName("team_members_import_batch_2025.csv");
      Alert.alert(
        "File Uploaded",
        "Found 4 valid employee records ready for import.",
        [{ text: "Review Data" }]
      );
    }, 1000);
  };

  const toggleSelectRecord = (id: string) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter((r) => r !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRecords.length === SAMPLE_CSV_PREVIEW.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(SAMPLE_CSV_PREVIEW.map((r) => r.id));
    }
  };

  const handleExecuteImport = () => {
    if (selectedRecords.length === 0) {
      Alert.alert("Selection Required", "Please select at least one employee record to import.");
      return;
    }

    setIsImporting(true);
    setTimeout(() => {
      const recordsToImport = SAMPLE_CSV_PREVIEW.filter((r) => selectedRecords.includes(r.id));
      recordsToImport.forEach((rec) => {
        const newMember: TeamMember = {
          id: `imported-${Date.now()}-${rec.id}`,
          name: rec.name,
          email: rec.email,
          phone: rec.phone,
          role: "Staff",
          status: "Active",
          isSuspended: false,
          contractType: "Full Time",
          employmentStatus: "Hired via Import",
          avatarUrl: rec.avatarUrl,
        };
        teamStore.addMember(newMember);
      });

      setIsImporting(false);
      Alert.alert(
        "Import Successful",
        `Successfully imported ${recordsToImport.length} employee(s) into your team!`,
        [
          {
            text: "View Team",
            onPress: () => router.push("/(drawer)/(tabs)/team" as any),
          },
        ]
      );
    }, 1200);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import Team Members</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Hero / Video Guide Card matching Web */}
        <View style={styles.guideCard}>
          <View style={styles.guideIconRow}>
            <View style={styles.guideIconBadge}>
              <Ionicons name="videocam-outline" size={20} color="#635BFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guideTitle}>How to Import Employees</Text>
              <Text style={styles.guideSubtitle}>
                Watch our quick 2-minute video guide or read instructions below.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.playVideoBtn}
            onPress={() =>
              Alert.alert(
                "Video Guide",
                "Playing tutorial: How to format and upload your team Excel / CSV spreadsheet."
              )
            }
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.playVideoBtnText}>Watch Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* Step 1: Download Templates */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Download File Template</Text>
              <Text style={styles.sectionDesc}>
                Use our predefined template to ensure proper column formatting.
              </Text>
            </View>
          </View>

          <View style={styles.templatesRow}>
            <TouchableOpacity
              style={styles.templateCard}
              onPress={() => handleDownloadTemplate("csv")}
              activeOpacity={0.7}
            >
              <View style={[styles.templateIconBox, { backgroundColor: "#E0F2FE" }]}>
                <Ionicons name="document-text-outline" size={20} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.templateName}>CSV Template</Text>
                <Text style={styles.templateFormat}>.csv format</Text>
              </View>
              <Ionicons name="download-outline" size={18} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.templateCard}
              onPress={() => handleDownloadTemplate("xlsx")}
              activeOpacity={0.7}
            >
              <View style={[styles.templateIconBox, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="grid-outline" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.templateName}>Excel Template</Text>
                <Text style={styles.templateFormat}>.xlsx format</Text>
              </View>
              <Ionicons name="download-outline" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 2: Upload CSV / Excel File */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Upload Completed Spreadsheet</Text>
              <Text style={styles.sectionDesc}>
                Upload the file with populated employee records.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.uploadDropzone}
            onPress={handlePickFile}
            activeOpacity={0.7}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={{ alignItems: "center", gap: 10 }}>
                <ActivityIndicator size="small" color="#635BFF" />
                <Text style={styles.uploadingText}>Parsing employee spreadsheet...</Text>
              </View>
            ) : uploadedFileName ? (
              <View style={{ alignItems: "center", gap: 8 }}>
                <Ionicons name="checkmark-circle" size={38} color="#10B981" />
                <Text style={styles.uploadedFileName}>{uploadedFileName}</Text>
                <Text style={styles.reuploadText}>Tap to change or re-upload file</Text>
              </View>
            ) : (
              <View style={{ alignItems: "center", gap: 8 }}>
                <View style={styles.cloudIconContainer}>
                  <Ionicons name="cloud-upload-outline" size={28} color="#635BFF" />
                </View>
                <Text style={styles.dropzoneTitle}>Tap to browse or upload file</Text>
                <Text style={styles.dropzoneSubtitle}>Supported: .csv, .xlsx, .xls (max 10MB)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Step 3: Parsed Data Preview & Confirmation */}
        {uploadedFileName && (
          <View style={styles.sectionCard}>
            <View style={styles.previewHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Data Preview ({SAMPLE_CSV_PREVIEW.length} found)</Text>
                <Text style={styles.sectionDesc}>
                  Select the records you would like to import.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.selectAllBtn}
                onPress={toggleSelectAll}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    selectedRecords.length === SAMPLE_CSV_PREVIEW.length
                      ? "checkbox"
                      : selectedRecords.length > 0
                      ? "remove-circle"
                      : "square-outline"
                  }
                  size={18}
                  color="#635BFF"
                />
                <Text style={styles.selectAllText}>
                  {selectedRecords.length === SAMPLE_CSV_PREVIEW.length ? "Deselect" : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recordsList}>
              {SAMPLE_CSV_PREVIEW.map((item) => {
                const isSelected = selectedRecords.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.recordCard, isSelected && styles.recordCardSelected]}
                    onPress={() => toggleSelectRecord(item.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={20}
                      color={isSelected ? "#635BFF" : "#CBD5E1"}
                      style={{ marginRight: 10 }}
                    />
                    <Image source={{ uri: item.avatarUrl }} style={styles.recordAvatar} />

                    <View style={{ flex: 1 }}>
                      <View style={styles.recordTitleRow}>
                        <Text style={styles.recordName}>{item.name}</Text>
                        <Text style={styles.recordId}>{item.id}</Text>
                      </View>
                      <Text style={styles.recordEmail}>{item.email}</Text>

                      <View style={styles.recordTagsRow}>
                        <View style={styles.roleTag}>
                          <Text style={styles.roleTagText}>{item.role}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusTag,
                            item.status === "Active" ? styles.statusActive : styles.statusInactive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusTagText,
                              item.status === "Active" ? styles.statusActiveText : styles.statusInactiveText,
                            ]}
                          >
                            {item.status}
                          </Text>
                        </View>
                        <View style={styles.servicesTag}>
                          <Text style={styles.servicesTagText}>{item.services}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!uploadedFileName || selectedRecords.length === 0) && styles.submitButtonDisabled,
          ]}
          onPress={handleExecuteImport}
          disabled={!uploadedFileName || selectedRecords.length === 0 || isImporting}
          activeOpacity={0.85}
        >
          {isImporting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                Import ({selectedRecords.length}) Members
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 30,
  },
  guideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  guideIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  guideIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  guideTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  guideSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  playVideoBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  playVideoBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepBadgeText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  templatesRow: {
    flexDirection: "row",
    gap: 12,
  },
  templateCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  templateIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  templateName: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  templateFormat: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  uploadDropzone: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cloudIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dropzoneSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  uploadingText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  uploadedFileName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  reuploadText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#635BFF",
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  selectAllText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  recordsList: {
    gap: 10,
  },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  recordCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF9FF",
  },
  recordAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  recordTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  recordId: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  recordEmail: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  recordTagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  roleTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
  },
  statusActive: {
    backgroundColor: "#DCFCE7",
  },
  statusActiveText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#16A34A",
  },
  statusInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusInactiveText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#DC2626",
  },
  servicesTag: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  servicesTagText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#635BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
