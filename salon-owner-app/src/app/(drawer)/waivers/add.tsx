import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSwitch from "@/components/ui/CustomSwitch";
import { WaiverField, WaiverAttachment } from "@/components/waivers/waiversData";

type AddWaiverTab =
  | "Required Fields"
  | "Settings & Info"
  | "Contract Documents"
  | "Sign Link";

const FIELD_TYPES = [
  { type: "Text" as const, label: "Text", icon: "text-outline" },
  { type: "Number" as const, label: "Number", icon: "calculator-outline" },
  { type: "Date" as const, label: "Date", icon: "calendar-outline" },
  { type: "Email" as const, label: "Email", icon: "mail-outline" },
  { type: "Telephone" as const, label: "Phone", icon: "call-outline" },
  { type: "Address" as const, label: "Address", icon: "location-outline" },
  { type: "Text Area" as const, label: "Text Area", icon: "document-text-outline" },
  { type: "Signature" as const, label: "Signature", icon: "pencil-outline" },
];

export default function AddWaiverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<AddWaiverTab>("Required Fields");

  // Tab 1: Fields
  const [fields, setFields] = useState<WaiverField[]>([
    {
      id: "f_1",
      fieldName: "Full Legal Name",
      label: "Full Name",
      type: "Text",
      placeholder: "e.g. Elena Rostova",
      description: "Signer's legal name as on ID",
      required: true,
    },
    {
      id: "f_2",
      fieldName: "Email Address",
      label: "Email",
      type: "Email",
      placeholder: "elena@example.com",
      description: "For sending copy of signed certificate",
      required: true,
    },
    {
      id: "f_3",
      fieldName: "Date of Birth",
      label: "Date of Birth",
      type: "Date",
      placeholder: "DD / MM / YYYY",
      description: "Must be 18+ or signed by legal guardian",
      required: true,
    },
    {
      id: "f_4",
      fieldName: "Digital Signature",
      label: "Signature",
      type: "Signature",
      placeholder: "Draw signature",
      description: "Legally binding digital signature",
      required: true,
    },
  ]);

  // Tab 2: Settings & Info
  const [waiverName, setWaiverName] = useState("");
  const [description, setDescription] = useState("");
  const [signersCount, setSignersCount] = useState("1");
  const [autoReminder, setAutoReminder] = useState(true);
  const [expirationDays, setExpirationDays] = useState("30");

  // Tab 3: Contract Attachments
  const [attachments, setAttachments] = useState<WaiverAttachment[]>([
    {
      id: "att_1",
      name: "Salon_Safety_Guidelines_2025.pdf",
      type: "PDF",
      size: "1.4 MB",
      updatedAt: "Today",
    },
    {
      id: "att_2",
      name: "Chemical_Color_Consent_Terms.docx",
      type: "DOCX",
      size: "820 KB",
      updatedAt: "Yesterday",
    },
  ]);

  // Tab 4: Direct Link
  const directLink = `https://glampro.app/waivers/sign/${waiverName ? waiverName.toLowerCase().replace(/[^a-z0-9]/g, "-") : "new-template"}`;

  const handleAddField = (type: WaiverField["type"]) => {
    const newF: WaiverField = {
      id: `f_${Date.now()}`,
      fieldName: `New ${type} Field`,
      label: type,
      type,
      placeholder: `Enter ${type.toLowerCase()}...`,
      description: "",
      required: false,
    };
    setFields([...fields, newF]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleToggleRequired = (id: string) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const handleAddAttachmentMock = () => {
    const newAtt: WaiverAttachment = {
      id: `att_${Date.now()}`,
      name: `Waiver_Annex_${attachments.length + 1}.pdf`,
      type: "PDF",
      size: "1.2 MB",
      updatedAt: "Just now",
    };
    setAttachments([...attachments, newAtt]);
    Alert.alert("File Attached", "Waiver annex document attached successfully.");
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSaveWaiver = () => {
    if (!waiverName.trim()) {
      Alert.alert("Required Field", "Please enter a template name in Settings & Info tab.");
      setActiveTab("Settings & Info");
      return;
    }

    Alert.alert(
      "Waiver Created!",
      `"${waiverName}" template created with ${fields.length} required fields and ${attachments.length} attachments.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Add Waiver Template</Text>
          <Text style={styles.headerSubtitle}>Configure fields, terms & signing link</Text>
        </View>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSaveWaiver} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabsRow}>
          {(["Required Fields", "Settings & Info", "Contract Documents", "Sign Link"] as AddWaiverTab[]).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </ScrollView>

      {/* Main Tab Content */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Required Fields" && (
          /* TAB 1: REQUIRED FIELDS BUILDER */
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Form Fields for Signer</Text>
              <Text style={styles.sectionSubtitle}>
                Add the questions and data required from the client during signing.
              </Text>
            </View>

            {/* Quick Add Field Types Chips */}
            <View style={styles.addFieldContainer}>
              <Text style={styles.addFieldLabel}>+ ADD FIELD TYPE</Text>
              <View style={styles.fieldTypesGrid}>
                {FIELD_TYPES.map((ft) => (
                  <TouchableOpacity
                    key={ft.type}
                    style={styles.fieldTypeChip}
                    onPress={() => handleAddField(ft.type)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={ft.icon as any} size={14} color="#635BFF" />
                    <Text style={styles.fieldTypeChipText}>{ft.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Configured Fields List */}
            <View style={styles.fieldsList}>
              {fields.map((f, idx) => (
                <View key={f.id} style={styles.fieldCard}>
                  <View style={styles.fieldCardHeader}>
                    <View style={styles.fieldBadge}>
                      <Text style={styles.fieldBadgeText}>#{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        style={styles.fieldNameInput}
                        value={f.fieldName}
                        onChangeText={(txt) => {
                          setFields(
                            fields.map((item) =>
                              item.id === f.id ? { ...item, fieldName: txt } : item
                            )
                          );
                        }}
                        placeholder="Field Title"
                        placeholderTextColor="#94A3B8"
                      />
                      <Text style={styles.fieldTypeTag}>{f.type}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.removeFieldBtn}
                      onPress={() => handleRemoveField(f.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldCardBody}>
                    <View style={styles.formGroup}>
                      <Text style={styles.fieldInnerLabel}>PLACEHOLDER TEXT</Text>
                      <TextInput
                        style={styles.inputSmall}
                        value={f.placeholder}
                        onChangeText={(txt) => {
                          setFields(
                            fields.map((item) =>
                              item.id === f.id ? { ...item, placeholder: txt } : item
                            )
                          );
                        }}
                        placeholder="Hint for signer..."
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.requiredRow}>
                      <View>
                        <Text style={styles.requiredText}>Required to submit</Text>
                        <Text style={styles.requiredSub}>Signer cannot submit without this</Text>
                      </View>
                      <CustomSwitch
                        value={f.required}
                        onValueChange={() => handleToggleRequired(f.id)}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Settings & Info" && (
          /* TAB 2: SETTINGS & INFO */
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>General Template Settings</Text>
              <Text style={styles.sectionSubtitle}>
                Define template title, scope of liability and auto-reminders.
              </Text>
            </View>

            <View style={styles.settingsCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>WAIVER TEMPLATE NAME *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Hair Chemical Treatment Waiver"
                  placeholderTextColor="#94A3B8"
                  value={waiverName}
                  onChangeText={setWaiverName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>DESCRIPTION / DISCLOSURE TEXT</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Full scope of service and liability terms..."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.label}>REQUIRED SIGNERS</Text>
                  <TextInput
                    style={styles.input}
                    value={signersCount}
                    onChangeText={setSignersCount}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>

                <View style={styles.formCol}>
                  <Text style={styles.label}>EXPIRATION (DAYS)</Text>
                  <TextInput
                    style={styles.input}
                    value={expirationDays}
                    onChangeText={setExpirationDays}
                    keyboardType="numeric"
                    placeholder="30"
                  />
                </View>
              </View>

              <View style={styles.switchSettingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Automatic Reminders</Text>
                  <Text style={styles.switchSub}>
                    Send automated SMS/Email reminders 24 hours prior to appointment
                  </Text>
                </View>
                <CustomSwitch value={autoReminder} onValueChange={setAutoReminder} />
              </View>
            </View>
          </View>
        )}

        {activeTab === "Contract Documents" && (
          /* TAB 3: CONTRACT DOCUMENTS */
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contract Documents & Annexes</Text>
              <Text style={styles.sectionSubtitle}>
                Attach full PDF terms, safety policies or medical consent annexes.
              </Text>
            </View>

            {/* Upload Action Card */}
            <TouchableOpacity
              style={styles.uploadCard}
              onPress={handleAddAttachmentMock}
              activeOpacity={0.8}
            >
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload" size={24} color="#635BFF" />
              </View>
              <Text style={styles.uploadTitle}>Tap to Upload Document</Text>
              <Text style={styles.uploadSub}>Supports PDF, DOCX, PNG (Up to 10 MB)</Text>
            </TouchableOpacity>

            {/* Attachments List */}
            <View style={styles.attachmentsList}>
              {attachments.map((att) => (
                <View key={att.id} style={styles.attachmentCard}>
                  <View style={styles.attachmentIconBox}>
                    <Ionicons name="document-attach" size={20} color="#635BFF" />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.attachmentName}>{att.name}</Text>
                    <Text style={styles.attachmentMeta}>
                      {att.type} • {att.size} • Uploaded {att.updatedAt}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeAttBtn}
                    onPress={() => handleRemoveAttachment(att.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "Sign Link" && (
          /* TAB 4: DIRECT SIGN LINK */
          <View style={styles.tabSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Direct Signing Link</Text>
              <Text style={styles.sectionSubtitle}>
                Share this direct URL with clients via booking confirmation or QR code in salon.
              </Text>
            </View>

            <View style={styles.linkCard}>
              <View style={styles.linkIconCircle}>
                <Ionicons name="link" size={24} color="#635BFF" />
              </View>

              <Text style={styles.linkCardTitle}>Public Signing URL</Text>
              <View style={styles.urlBox}>
                <Text style={styles.urlText} numberOfLines={1}>
                  {directLink}
                </Text>
              </View>

              <View style={styles.linkButtonsRow}>
                <TouchableOpacity
                  style={styles.copyLinkBtn}
                  onPress={() => Alert.alert("Link Copied!", "Waiver signing link copied to clipboard.")}
                  activeOpacity={0.8}
                >
                  <Ionicons name="copy-outline" size={15} color="#FFFFFF" />
                  <Text style={styles.copyLinkBtnText}>Copy Link</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.previewSignBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/(drawer)/waivers/sign" as any,
                      params: { waiverName: waiverName || "Sample Waiver" },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={15} color="#635BFF" />
                  <Text style={styles.previewSignBtnText}>Preview Sign Flow</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  saveHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  saveHeaderBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  tabsScroll: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    maxHeight: 50,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabBtnActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabBtnTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 16,
  },
  sectionHeader: {
    gap: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 18,
  },
  addFieldContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 10,
  },
  addFieldLabel: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: "#635BFF",
    letterSpacing: 0.5,
  },
  fieldTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fieldTypeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  fieldTypeChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  fieldsList: {
    gap: 12,
  },
  fieldCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  fieldCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fieldBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  fieldNameInput: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    padding: 0,
  },
  fieldTypeTag: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
    marginTop: 2,
  },
  removeFieldBtn: {
    padding: 6,
  },
  fieldCardBody: {
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  fieldInnerLabel: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  requiredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  requiredText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  requiredSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formCol: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  switchSettingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  switchTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  switchSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 16,
    marginTop: 2,
  },
  uploadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  uploadSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  attachmentsList: {
    gap: 10,
  },
  attachmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 12,
  },
  attachmentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  attachmentMeta: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  removeAttBtn: {
    padding: 6,
  },
  linkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    alignItems: "center",
    gap: 14,
  },
  linkIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  linkCardTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  urlBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  urlText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  linkButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  copyLinkBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingVertical: 11,
    borderRadius: 8,
  },
  copyLinkBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  previewSignBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 11,
    borderRadius: 8,
  },
  previewSignBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
