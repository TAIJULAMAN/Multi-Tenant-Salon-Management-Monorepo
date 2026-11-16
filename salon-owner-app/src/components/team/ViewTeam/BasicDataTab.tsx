import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "@/components/ui/CustomSwitch";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import EditAdditionalDataModal, { AdditionalDataState } from "@/components/team/modals/EditAdditionalDataModal";

interface BasicDataTabProps {
  member: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  onNavigateToPermissions?: () => void;
}

interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: string;
  enabled: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  { id: "s1", name: "Hair Color", duration: "15 min", price: "€ 170", enabled: true },
  { id: "s2", name: "Hair Color & Highlights", duration: "30 min", price: "€ 170", enabled: true },
  { id: "s3", name: "Cut and Fold", duration: "45 min", price: "€ 90", enabled: true },
  { id: "s4", name: "Balayage Full", duration: "60 min", price: "€ 220", enabled: false },
  { id: "s5", name: "Scalp Treatment", duration: "20 min", price: "€ 60", enabled: true },
  { id: "s6", name: "Glossing & Toner", duration: "25 min", price: "€ 85", enabled: false },
];

export default function BasicDataTab({ member, onNavigateToPermissions }: BasicDataTabProps) {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30 min");
  const [newServicePrice, setNewServicePrice] = useState("€ 120");

  // Additional data state
  const [additionalData, setAdditionalData] = useState<AdditionalDataState>({
    certifications: ["Professional Hairdresser", "Business Management"],
    courses: ["Leadership Management", "Customer Service Excellence"],
    languages: [
      { language: "Italian", level: "Native" },
      { language: "English", level: "Advanced" },
      { language: "Spanish", level: "Intermediate" },
    ],
  });
  const [isEditAdditionalDataOpen, setIsEditAdditionalDataOpen] = useState(false);

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      Alert.alert("Missing Name", "Please enter a service name.");
      return;
    }
    const newS: ServiceItem = {
      id: Date.now().toString(),
      name: newServiceName.trim(),
      duration: newServiceDuration.trim() || "30 min",
      price: newServicePrice.trim() || "€ 100",
      enabled: true,
    };
    setServices([newS, ...services]);
    setIsAddServiceOpen(false);
    setNewServiceName("");
    Alert.alert("Success", "Service added to member's catalog.");
  };

  return (
    <View style={styles.container}>
      {/* Personal Data Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Data</Text>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.7}
            onPress={() => Alert.alert("Edit Personal Data", "Personal data editor opened.")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
            <Ionicons name="create-outline" size={14} color="#5C55FF" />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>Nov 7, 1992</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>33 years old</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>Female</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value} numberOfLines={1}>anna@bellavista.com</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Emergency Contact Name</Text>
            <Text style={styles.value}>Marco Rossi</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Emergency Contact Phone</Text>
            <Text style={styles.value}>+39 335 345 678</Text>
          </View>
        </View>
      </View>

      {/* Contract Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Contract</Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.downloadBtn}
              activeOpacity={0.7}
              onPress={() => Alert.alert("Download Contract", "Contract PDF downloaded successfully.")}
            >
              <Ionicons name="download-outline" size={16} color="#5C55FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.7}
              onPress={() => Alert.alert("Edit Contract", "Contract details editor opened.")}
            >
              <Text style={styles.editBtnText}>Edit</Text>
              <Ionicons name="create-outline" size={14} color="#5C55FF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>End Date</Text>
            <Text style={styles.value}>Indeterminate</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Tax ID Code</Text>
            <Text style={styles.value}>RSSANN92S07A944B</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{member.role || "Staff"}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Remuneration</Text>
            <Text style={styles.value}>Fixed (€ 2,200)</Text>
          </View>
          <View style={styles.gridColFull}>
            <Text style={styles.label}>IBAN</Text>
            <Text style={styles.value}>IT60 X064 1234 5678 9101 123</Text>
          </View>
        </View>
      </View>

      {/* Full Address Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Full Address</Text>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.7}
            onPress={() => Alert.alert("Edit Address", "Address details editor opened.")}
          >
            <Text style={styles.editBtnText}>Edit</Text>
            <Ionicons name="create-outline" size={14} color="#5C55FF" />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridColFull}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>Independence Street 567</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>Bologna</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Province</Text>
            <Text style={styles.value}>Bologna (BO)</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>CAP</Text>
            <Text style={styles.value}>40126</Text>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Services ({services.filter(s => s.enabled).length} Active)</Text>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.7}
            onPress={() => setIsAddServiceOpen(true)}
          >
            <Ionicons name="add" size={14} color="#5C55FF" style={{ marginRight: 2 }} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {services.map((s) => (
          <View key={s.id} style={styles.serviceRow}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{s.name}</Text>
              <Text style={styles.serviceDetail}>
                {s.duration} • {s.price}
              </Text>
            </View>
            <CustomSwitch
              value={s.enabled}
              onValueChange={() => toggleService(s.id)}
            />
          </View>
        ))}
      </View>

      {/* Additional Data Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Additional Data</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditAdditionalDataOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.editBtnText}>Edit</Text>
            <Ionicons name="create-outline" size={14} color="#5C55FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.label}>Certifications</Text>
          <View style={styles.badgeRow}>
            {additionalData.certifications.map((c, i) => (
              <View key={`cert_${i}`} style={styles.badgeBlue}>
                <Text style={styles.badgeBlueText}>{c.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.label}>Completed Courses</Text>
          {additionalData.courses.map((course, i) => (
            <Text key={`course_${i}`} style={styles.courseValue}>{course}</Text>
          ))}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.label}>Languages</Text>
          {additionalData.languages.map((l, i) => (
            <View key={`lang_${i}`} style={styles.langRow}>
              <Text style={styles.langLabel}>{l.language}</Text>
              <Text style={l.level === "Native" ? styles.langValueNative : styles.langValueAdv}>
                {l.level}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.label}>Direct Manager</Text>
          <Text style={styles.value}>Maria Rodriguez</Text>
        </View>
      </View>

      {/* Social & Access Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Social & Access</Text>
          <TouchableOpacity
            style={styles.permitsBtn}
            activeOpacity={0.7}
            onPress={onNavigateToPermissions}
          >
            <Text style={styles.permitsBtnText}>Permits</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialRow}>
          <View style={styles.socialLeft}>
            <View style={styles.socialIconContainer}>
              <Ionicons name="logo-facebook" size={16} color="#3B5998" />
            </View>
            <Text style={styles.socialName}>Facebook</Text>
          </View>
          <View style={styles.badgeYellow}>
            <Text style={styles.badgeYellowText}>Not Connected</Text>
          </View>
        </View>

        <View style={styles.socialRow}>
          <View style={styles.socialLeft}>
            <View style={styles.socialIconContainer}>
              <Ionicons name="logo-instagram" size={16} color="#E1306C" />
            </View>
            <Text style={styles.socialName}>Instagram</Text>
          </View>
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>Connected</Text>
          </View>
        </View>

        <View style={[styles.socialRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <Text style={styles.socialLabel}>Last Access</Text>
          <Text style={styles.socialValue}>1h ago</Text>
        </View>
      </View>

      {/* Add Service using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        title="Add Service to Member"
      >
        <View style={styles.sheetFormContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Service Name *</Text>
            <TextInput
              style={styles.formInput}
              value={newServiceName}
              onChangeText={setNewServiceName}
              placeholder="e.g. Keratin Smoothing Treatment"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Duration *</Text>
            <TextInput
              style={styles.formInput}
              value={newServiceDuration}
              onChangeText={setNewServiceDuration}
              placeholder="e.g. 45 min"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Price *</Text>
            <TextInput
              style={styles.formInput}
              value={newServicePrice}
              onChangeText={setNewServicePrice}
              placeholder="e.g. € 150"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setIsAddServiceOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleAddService}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>

      {/* Edit Additional Data Modal */}
      <EditAdditionalDataModal
        visible={isEditAdditionalDataOpen}
        onClose={() => setIsEditAdditionalDataOpen(false)}
        initialData={additionalData}
        onSave={(updated) => setAdditionalData(updated)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#5C55FF",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
  },
  gridCol: {
    width: "50%",
    paddingRight: 8,
  },
  gridColFull: {
    width: "100%",
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#5C55FF",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  serviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  serviceDetail: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  fieldSection: {
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  badgeBlue: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  badgeBlueText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#2563EB",
  },
  courseValue: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    marginTop: 2,
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  langLabel: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  langValueNative: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  langValueAdv: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  permitsBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  permitsBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#5C55FF",
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  socialLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  socialName: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  badgeYellow: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeYellowText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#D97706",
  },
  badgeGreen: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeGreenText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  socialLabel: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  socialValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sheetFormContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  sheetModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sheetCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  sheetSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#5C55FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
