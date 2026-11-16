import React, { useState } from "react";
import { ScrollView, View, Alert, StyleSheet } from "react-native";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { FigmaModal, FormInput as TextInput, InlineSelect, ModalFooter, shared } from "../common";
import {
  Client,
  GENDER_OPTIONS,
  clientsStore,
  createEmptyClient,
} from "../clientsData";

export type ClientFormMode = "add" | "edit" | "address";

interface ClientFormModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ClientFormMode;
  client?: Client;
  onSaved?: (client: Client) => void;
}

const TITLES: Record<ClientFormMode, string> = {
  add: "Add Client",
  edit: "Edit Client",
  address: "Edit Full Address",
};

export default function ClientFormModal({ visible, onClose, mode, client, onSaved }: ClientFormModalProps) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title={TITLES[mode]}>
      {visible && (
        <ClientForm
          key={`${mode}-${client?.id ?? "new"}`}
          mode={mode}
          client={client}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </FigmaModal>
  );
}

function ClientForm({
  mode,
  client,
  onClose,
  onSaved,
}: {
  mode: ClientFormMode;
  client?: Client;
  onClose: () => void;
  onSaved?: (client: Client) => void;
}) {
  const [draft, setDraft] = useState<Client>(() =>
    mode === "add" || !client ? { ...createEmptyClient(), gender: "" } : { ...client }
  );
  const set = <K extends keyof Client>(key: K, value: Client[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = () => {
    if (mode !== "address") {
      if (!draft.firstName.trim() || !draft.lastName.trim()) {
        Alert.alert("Missing information", "Please enter first and last name.");
        return;
      }
      if (!draft.phone.trim()) {
        Alert.alert("Missing information", "Please enter a telephone number.");
        return;
      }
    }
    const saved = { ...draft, firstName: draft.firstName.trim(), lastName: draft.lastName.trim() };
    if (mode === "add") {
      clientsStore.add(saved);
    } else {
      clientsStore.update(saved.id, saved);
    }
    onSaved?.(saved);
    onClose();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {mode === "address" ? (
        <>
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={draft.address}
            onChangeText={(v) => set("address", v)}
          />
          <View style={shared.row}>
            <View style={shared.col}>
              <TextInput label="City" placeholder="Enter city" value={draft.city} onChangeText={(v) => set("city", v)} />
            </View>
            <View style={shared.col}>
              <TextInput label="CAP" placeholder="Enter CAP" keyboardType="number-pad" value={draft.cap} onChangeText={(v) => set("cap", v)} />
            </View>
          </View>
          <TextInput
            label="Province"
            placeholder="Enter province"
            value={draft.province}
            onChangeText={(v) => set("province", v)}
          />
        </>
      ) : (
        <>
          {/* Figma 1:41399: First/Last Name, Date of birth/Gender, Telephone/E-mail */}
          <View style={shared.row}>
            <View style={shared.col}>
              <TextInput
                label="First Name"
                required
                placeholder="Enter first name"
                value={draft.firstName}
                onChangeText={(v) => set("firstName", v)}
              />
            </View>
            <View style={shared.col}>
              <TextInput
                label="Last Name"
                required
                placeholder="Enter last name"
                value={draft.lastName}
                onChangeText={(v) => set("lastName", v)}
              />
            </View>
          </View>
          <View style={shared.row}>
            <View style={shared.col}>
              <DatePickerInput
                label="Date of birth"
                placeholder="Enter date of birth"
                value={draft.birthDate}
                onChange={(v) => set("birthDate", v)}
              />
            </View>
            <View style={shared.col}>
              <InlineSelect
                label="Gender"
                placeholder="Select gender"
                value={draft.gender}
                options={GENDER_OPTIONS}
                onChange={(v) => set("gender", v)}
              />
            </View>
          </View>
          <View style={shared.row}>
            <View style={shared.col}>
              <TextInput
                label="Telephone"
                required
                placeholder="Enter telephone"
                keyboardType="phone-pad"
                value={draft.phone}
                onChangeText={(v) => set("phone", v)}
              />
            </View>
            <View style={shared.col}>
              <TextInput
                label="E-mail"
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={draft.email}
                onChangeText={(v) => set("email", v)}
              />
            </View>
          </View>
          {mode === "edit" && (
            <TextInput
              label="Emergency Contact"
              placeholder="Enter emergency contact"
              value={draft.emergencyContact}
              onChangeText={(v) => set("emergencyContact", v)}
            />
          )}
        </>
      )}
      <ModalFooter primaryLabel="Save" onPrimary={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 4,
  },
});
