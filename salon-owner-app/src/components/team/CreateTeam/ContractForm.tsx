import React from "react";
import { View, StyleSheet } from "react-native";
import TextInput from "../../ui/TextInput";
import DropdownSelect from "../../ui/DropdownSelect";
import DatePickerInput from "../../ui/DatePickerInput";

export interface ContractData {
  contractType: string;
  taxId: string;
  iban: string;
  startDate: string;
  endDate: string;
  role: string;
  remunerationType: string;
  amount: string;
}

interface ContractFormProps {
  data: ContractData;
  onChange: (key: keyof ContractData, value: string) => void;
  errors: Partial<Record<keyof ContractData, string>>;
}

const CONTRACT_TYPES = ["Part Time", "Full Time", "Stage", "Vat collaboration"];
const ROLES = ["Staff", "Manager", "Accountant"];
const REMUNERATION_TYPES = ["Fixed", "Hourly"];

export default function ContractForm({ data, onChange, errors }: ContractFormProps) {
  return (
    <View style={styles.container}>
      <DropdownSelect
        label="Contract Type"
        required
        placeholder="Select contract type"
        value={data.contractType}
        options={CONTRACT_TYPES}
        onSelect={(val) => onChange("contractType", val)}
        error={errors.contractType}
      />
      <TextInput
        label="Tax ID Code"
        required
        placeholder="Enter Tax ID Code"
        value={data.taxId}
        onChangeText={(val) => onChange("taxId", val)}
        error={errors.taxId}
        autoCapitalize="characters"
      />
      <TextInput
        label="IBAN"
        placeholder="Enter IBAN for salary payments"
        value={data.iban}
        onChangeText={(val) => onChange("iban", val)}
        error={errors.iban}
        autoCapitalize="characters"
      />
      <DatePickerInput
        label="Start Date"
        required
        placeholder="Enter start date"
        value={data.startDate}
        onChange={(val) => onChange("startDate", val)}
        error={errors.startDate}
      />
      <DatePickerInput
        label="End Date"
        placeholder="Enter end date"
        value={data.endDate}
        onChange={(val) => onChange("endDate", val)}
        error={errors.endDate}
      />
      <DropdownSelect
        label="Role"
        required
        placeholder="Select role"
        value={data.role}
        options={ROLES}
        onSelect={(val) => onChange("role", val)}
        error={errors.role}
      />
      <DropdownSelect
        label="Item remuneration type"
        required
        placeholder="Select remuneration type"
        value={data.remunerationType}
        options={REMUNERATION_TYPES}
        onSelect={(val) => onChange("remunerationType", val)}
        error={errors.remunerationType}
      />
      <TextInput
        label="Amount"
        required
        placeholder="Enter amount"
        value={data.amount}
        onChangeText={(val) => onChange("amount", val)}
        error={errors.amount}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
