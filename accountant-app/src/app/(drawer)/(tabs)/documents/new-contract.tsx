import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";

const CONTRACT_TYPES = ["Permanent", "Temporary", "Freelance", "Internship"];
const ROLES = ["Select role", "Hair Stylist", "Colorist", "Receptionist", "Manager"];
const REMUNERATION_TYPES = ["Select type", "Fixed Salary", "Hourly", "Commission Base"];
const SALONS = ["Select Salon", "Chic Hair & Beauty", "Style Studio", "Elegance Spa", "Glamour Beauty Roma"];
const TAX_TYPES = ["Select Tax Type", "Standard", "Reduced", "Exempt"];

export default function NewContractScreen() {
  const router = useRouter();

  // Form State
  const [contractType, setContractType] = useState("Permanent");
  const [taxIdCode, setTaxIdCode] = useState("");
  const [iban, setIban] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showEndDate, setShowEndDate] = useState(false);
  const [role, setRole] = useState("Select role");
  const [remunerationType, setRemunerationType] = useState("Select type");
  const [salon, setSalon] = useState("Select Salon");
  const [taxType, setTaxType] = useState("Select Tax Type");
  const [file, setFile] = useState<{ name: string; size: string; uri?: string } | null>(null);

  // Dropdown open states
  const [contractTypeOpen, setContractTypeOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [remunerationOpen, setRemunerationOpen] = useState(false);
  const [salonOpen, setSalonOpen] = useState(false);
  const [taxTypeOpen, setTaxTypeOpen] = useState(false);

  const closeAllDropdowns = () => {
    if (contractTypeOpen) setContractTypeOpen(false);
    if (roleOpen) setRoleOpen(false);
    if (remunerationOpen) setRemunerationOpen(false);
    if (salonOpen) setSalonOpen(false);
    if (taxTypeOpen) setTaxTypeOpen(false);
  };

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
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
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const handleSendForApproval = () => {
    if (!taxIdCode.trim()) {
      Alert.alert("Missing Tax ID Code", "Please enter the employee's Tax ID Code.");
      return;
    }
    if (!startDate.trim()) {
      Alert.alert("Missing Start Date", "Please enter the contract start date.");
      return;
    }
    if (role === "Select role") {
      Alert.alert("Missing Role", "Please select a role.");
      return;
    }
    if (remunerationType === "Select type") {
      Alert.alert("Missing Remuneration Type", "Please select a remuneration type.");
      return;
    }
    if (salon === "Select Salon") {
      Alert.alert("Missing Salon", "Please select an associated salon.");
      return;
    }
    if (taxType === "Select Tax Type") {
      Alert.alert("Missing Tax Type", "Please select a tax type.");
      return;
    }
    if (!file) {
      Alert.alert("Document Required", "Please upload a contract document.");
      return;
    }

    Alert.alert(
      "Contract Submitted",
      "Contract has been successfully submitted for approval.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Global Header */}
      <SalonGlobalHeader title="Documents" />

      <TouchableWithoutFeedback onPress={closeAllDropdowns}>
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Row with Breadcrumb */}
            <View style={styles.topHeaderCard}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => router.back()}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={20} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.topHeaderTitle}>New Tax Upload</Text>
              </View>

              {/* Breadcrumb matching web */}
              <View style={styles.breadcrumbWrap}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="home-outline" size={13} color="#94A3B8" />
                </TouchableOpacity>
                <Text style={styles.breadcrumbSlash}>/</Text>
                <View style={styles.breadcrumbTag}>
                  <Text style={styles.breadcrumbTagText}>Contract</Text>
                </View>
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* 1. Contract Type */}
              <View style={[styles.fieldGroup, { zIndex: 1000 }]}>
                <Text style={styles.fieldLabel}>Contract Type *</Text>
                <View style={styles.dropdownAnchorWrap}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      closeAllDropdowns();
                      setContractTypeOpen(!contractTypeOpen);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dropdownButtonText}>{contractType}</Text>
                    <Ionicons
                      name={contractTypeOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {contractTypeOpen && (
                    <View style={styles.popoverMenu}>
                      {CONTRACT_TYPES.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.popoverItem,
                            contractType === item && styles.popoverItemActive,
                          ]}
                          onPress={() => {
                            setContractType(item);
                            setContractTypeOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.popoverItemText,
                              contractType === item && styles.popoverItemTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                          {contractType === item && (
                            <Ionicons name="checkmark" size={16} color="#635BFF" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* 2. Tax ID Code */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Tax ID Code *</Text>
                <TextInput
                  style={styles.textInput}
                  value={taxIdCode}
                  onChangeText={setTaxIdCode}
                  placeholder="Enter tax ID code"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* 3. IBAN */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>IBAN</Text>
                <TextInput
                  style={styles.textInput}
                  value={iban}
                  onChangeText={setIban}
                  placeholder="Enter IBAN for salary payments"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* 4. Start Date & Set an End Date Link */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Start Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="Enter start date"
                  placeholderTextColor="#94A3B8"
                />
                {!showEndDate ? (
                  <TouchableOpacity
                    onPress={() => setShowEndDate(true)}
                    style={{ marginTop: 4, alignSelf: "flex-start" }}
                  >
                    <Text style={styles.linkText}>Set an end date</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.fieldLabel}>End Date</Text>
                    <TextInput
                      style={styles.textInput}
                      value={endDate}
                      onChangeText={setEndDate}
                      placeholder="Enter end date (e.g. 31 Dec 2027)"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                )}
              </View>

              {/* 5. Role */}
              <View style={[styles.fieldGroup, { zIndex: 900 }]}>
                <Text style={styles.fieldLabel}>Role *</Text>
                <View style={styles.dropdownAnchorWrap}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      closeAllDropdowns();
                      setRoleOpen(!roleOpen);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        role === "Select role" && styles.placeholderText,
                      ]}
                    >
                      {role}
                    </Text>
                    <Ionicons
                      name={roleOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {roleOpen && (
                    <View style={styles.popoverMenu}>
                      {ROLES.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.popoverItem,
                            role === item && styles.popoverItemActive,
                          ]}
                          onPress={() => {
                            setRole(item);
                            setRoleOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.popoverItemText,
                              role === item && styles.popoverItemTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                          {role === item && (
                            <Ionicons name="checkmark" size={16} color="#635BFF" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* 6. Remuneration Type */}
              <View style={[styles.fieldGroup, { zIndex: 800 }]}>
                <Text style={styles.fieldLabel}>Remuneration Type *</Text>
                <View style={styles.dropdownAnchorWrap}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      closeAllDropdowns();
                      setRemunerationOpen(!remunerationOpen);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        remunerationType === "Select type" && styles.placeholderText,
                      ]}
                    >
                      {remunerationType}
                    </Text>
                    <Ionicons
                      name={remunerationOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {remunerationOpen && (
                    <View style={styles.popoverMenu}>
                      {REMUNERATION_TYPES.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.popoverItem,
                            remunerationType === item && styles.popoverItemActive,
                          ]}
                          onPress={() => {
                            setRemunerationType(item);
                            setRemunerationOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.popoverItemText,
                              remunerationType === item && styles.popoverItemTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                          {remunerationType === item && (
                            <Ionicons name="checkmark" size={16} color="#635BFF" />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* 7. Salon Selector */}
              <View style={[styles.fieldGroup, { zIndex: 700 }]}>
                <Text style={styles.fieldLabel}>Salon *</Text>
                <View style={styles.dropdownAnchorWrap}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      closeAllDropdowns();
                      setSalonOpen(!salonOpen);
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
                      name={salonOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {salonOpen && (
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
                            setSalonOpen(false);
                          }}
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

              {/* 8. Tax Type Selector */}
              <View style={[styles.fieldGroup, { zIndex: 600 }]}>
                <Text style={styles.fieldLabel}>Tax Type *</Text>
                <View style={styles.dropdownAnchorWrap}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => {
                      closeAllDropdowns();
                      setTaxTypeOpen(!taxTypeOpen);
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
                      name={taxTypeOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#64748B"
                    />
                  </TouchableOpacity>

                  {taxTypeOpen && (
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
                            setTaxTypeOpen(false);
                          }}
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

              {/* 9. Document Upload Section */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Document *</Text>
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

                {/* Uploaded File Display */}
                {file && (
                  <View style={styles.uploadedFileCard}>
                    <View style={styles.fileCardLeft}>
                      <Ionicons
                        name="document-text-outline"
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
                      style={styles.removeFileBtn}
                      onPress={() => setFile(null)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={18} color="#F87171" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Action Bar */}
          <View style={styles.fixedBottomBar}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 16,
  },
  topHeaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  breadcrumbWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbSlash: {
    fontSize: 12,
    color: "#CBD5E1",
  },
  breadcrumbTag: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  breadcrumbTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
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
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  linkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
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
    marginTop: 8,
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
  removeFileBtn: {
    padding: 6,
  },
  fixedBottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 14 : 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  cancelButton: {
    flex: 1,
    height: 46,
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
    flex: 1.6,
    height: 46,
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
