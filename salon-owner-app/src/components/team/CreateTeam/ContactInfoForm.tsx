import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../ui/TextInput";

export interface ContactInfoData {
  email: string;
  emergencyContactName: string;
  emergencyContactTelephone: string;
}

interface ContactInfoFormProps {
  data: ContactInfoData;
  onChange: (key: keyof ContactInfoData, value: string) => void;
  errors: Partial<Record<keyof ContactInfoData, string>>;
}

export default function ContactInfoForm({ data, onChange, errors }: ContactInfoFormProps) {
  return (
    <View style={styles.container}>
      <TextInput
        label="E-mail"
        required
        placeholder="Enter email"
        value={data.email}
        onChangeText={(val) => onChange("email", val)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Emergency Contact Name"
        placeholder="Enter emergency contact name"
        value={data.emergencyContactName}
        onChangeText={(val) => onChange("emergencyContactName", val)}
        error={errors.emergencyContactName}
      />
      <TextInput
        label="Emergency Contact (Telephone)"
        placeholder="Enter emergency contact telephone"
        value={data.emergencyContactTelephone}
        onChangeText={(val) => onChange("emergencyContactTelephone", val)}
        error={errors.emergencyContactTelephone}
        keyboardType="phone-pad"
        rightIcon={<Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.icon} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
});
