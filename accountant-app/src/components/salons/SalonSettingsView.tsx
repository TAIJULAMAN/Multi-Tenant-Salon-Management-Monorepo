import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BankSettingsData } from "@/data/salonsData";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

interface SalonSettingsViewProps {
  initialSettings: BankSettingsData;
  onSaveSettings: (settings: BankSettingsData) => void;
}

export default function SalonSettingsView({
  initialSettings,
  onSaveSettings,
}: SalonSettingsViewProps) {
  const [iban, setIban] = useState(initialSettings.iban);
  const [bankHolder, setBankHolder] = useState(initialSettings.bankHolder);
  const [vatNumber, setVatNumber] = useState(initialSettings.vatNumber);
  const [address, setAddress] = useState(initialSettings.address);

  const handleSave = () => {
    if (!iban.trim() || !bankHolder.trim() || !vatNumber.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    onSaveSettings({
      iban,
      bankHolder,
      vatNumber,
      address,
    });
    Alert.alert("Settings Saved", "Your banking and payout details have been updated.");
  };

  return (
    <View style={styles.container}>
      {/* Information Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
        <Text style={styles.infoBannerText}>
          This information will be automatically used for all future payout requests. You can update it whenever needed.
        </Text>
      </View>

      {/* Bank Details Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="card-outline" size={18} color="#635BFF" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Bank Account Details</Text>
        </View>

        <CustomInput
          label="IBAN *"
          value={iban}
          onChangeText={setIban}
          placeholder="IT60X0542811101000000123456"
          autoCapitalize="characters"
        />

        <CustomInput
          label="Bank Transfer Holder *"
          value={bankHolder}
          onChangeText={setBankHolder}
          placeholder="Mario Accountant S.r.l."
        />

        <View style={styles.validationPill}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.validationText}>Valid Account Holder</Text>
        </View>
      </View>

      {/* VAT & Business Address Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="business-outline" size={18} color="#635BFF" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>VAT & Legal Headquarters</Text>
        </View>

        <CustomInput
          label="VAT Number (Partita IVA) *"
          value={vatNumber}
          onChangeText={setVatNumber}
          placeholder="IT12345678901"
          autoCapitalize="characters"
        />

        <View style={styles.validationPill}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.validationText}>Valid European VIES VAT</Text>
        </View>

        <Text style={styles.inputLabel}>Registered Address</Text>
        <TextInput
          style={styles.addressInput}
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter registered studio / office address..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Security Disclaimer Card */}
      <View style={styles.securityCard}>
        <View style={styles.securityHeader}>
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
          <Text style={styles.securityTitle}>Data Security & Encryption</Text>
        </View>
        <Text style={styles.securityDesc}>
          Your banking details are stored with bank-grade 256-bit AES encryption. They are never shared with third parties and are strictly used to disburse your referral commissions.
        </Text>
      </View>

      {/* Save Button */}
      <CustomButton
        title="Save Changes"
        onPress={handleSave}
        variant="primary"
        size="small"
        style={styles.saveBtn}
        icon={<Ionicons name="save-outline" size={16} color="#FFFFFF" />}
      />
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    fontSize: 12,
    color: "#1E40AF",
    flex: 1,
    lineHeight: 16,
  },
  sectionCard: {
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  validationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -8,
    marginBottom: 14,
  },
  validationText: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  addressInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#1F2937",
    minHeight: 70,
    textAlignVertical: "top",
  },
  securityCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  securityDesc: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  saveBtn: {
    marginTop: 6,
    backgroundColor: "#635BFF",
  },
});
