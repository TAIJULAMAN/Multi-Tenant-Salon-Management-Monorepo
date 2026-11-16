import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

interface RequestAccessViewProps {
  onSubmitSuccess?: () => void;
}

const ROLE_OPTIONS = [
  { id: "Accountant", label: "Certified Accountant (Commercialista)", desc: "Full access to payroll, F24 taxes, and financial statements" },
  { id: "Tax Advisor", label: "Tax Advisor (Consulente Fiscale)", desc: "Access to quarterly VAT, compliance, and tax deadlines" },
  { id: "Financial Consultant", label: "Financial Consultant", desc: "Access to revenue reporting and expense budgeting" },
];

export default function RequestAccessView({ onSubmitSuccess }: RequestAccessViewProps) {
  const [salonCode, setSalonCode] = useState("");
  const [selectedRole, setSelectedRole] = useState("Accountant");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!salonCode.trim()) {
      Alert.alert("Missing Field", "Please enter the salon code or owner email.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        "Request Sent!",
        `Your access request for role "${selectedRole}" has been submitted to ${salonCode}. You will receive a notification once the salon owner approves.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSalonCode("");
              setDescription("");
              if (onSubmitSuccess) onSubmitSuccess();
            },
          },
        ]
      );
    }, 600);
  };

  const handleClear = () => {
    setSalonCode("");
    setDescription("");
    setSelectedRole("Accountant");
  };

  return (
    <View style={styles.container}>
      {/* Title Card */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Request Access to Salon</Text>
        <Text style={styles.headerSubtitle}>
          Connect with new salons by entering their unique Salon Code or owner email address.
        </Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <CustomInput
          label="Salon Code or Email *"
          value={salonCode}
          onChangeText={setSalonCode}
          placeholder="e.g. SLN-78491 or owner@glamour.it"
          iconName="business-outline"
          autoCapitalize="none"
        />

        {/* Role Selector */}
        <Text style={styles.inputLabel}>Desired Professional Role *</Text>
        <View style={styles.roleOptionsContainer}>
          {ROLE_OPTIONS.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.roleCardActive]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.8}
              >
                <View style={styles.roleCardHeader}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>
                    {role.label}
                  </Text>
                </View>
                <Text style={styles.roleDesc}>{role.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Introduction Message */}
        <Text style={styles.inputLabel}>Introduction / Note (Optional)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          placeholder="Introduce your accounting firm and explain why you'd like to work together..."
          placeholderTextColor="#9CA3AF"
        />

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={18} color="#3B82F6" style={{ marginRight: 8, marginTop: 1 }} />
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "700" }}>Note:</Text> Your request will be directly delivered to the salon owner for approval. You'll receive a notification once accepted.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionsRow}>
          <CustomButton
            title="Clear"
            onPress={handleClear}
            variant="outline"
            size="small"
            style={styles.cancelBtn}
          />
          <CustomButton
            title="Send Request"
            onPress={handleSubmit}
            variant="primary"
            size="small"
            isLoading={isSubmitting}
            style={styles.submitBtn}
            icon={<Ionicons name="paper-plane" size={14} color="#FFFFFF" />}
            iconPosition="right"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  roleOptionsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  roleCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  roleCardActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  roleCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: "#635BFF",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  roleTitleActive: {
    color: "#635BFF",
  },
  roleDesc: {
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 26,
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#1F2937",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 11,
    color: "#1E40AF",
    flex: 1,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderColor: "#E5E7EB",
  },
  submitBtn: {
    flex: 1.6
  },
});
