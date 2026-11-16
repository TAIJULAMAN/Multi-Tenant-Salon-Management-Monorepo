import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { EmptyState, KebabMenu, Label, SectionCard, SoftButton } from "../common";
import { Allergy, Client, SEVERITY_STYLES, clientsStore } from "../clientsData";
import AllergyModal from "../modals/AllergyModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

/** Figma 1:39485 "Medical / Personal Notes" + 1:36157 "Add Allergie" modal. */
export default function MedicalTab({ client }: { client: Client }) {
  const [form, setForm] = useState<{ open: boolean; allergy: Allergy | null }>({ open: false, allergy: null });
  const [toDelete, setToDelete] = useState<Allergy | null>(null);

  const save = (a: Allergy) => {
    const exists = client.allergies.some((x) => x.id === a.id);
    clientsStore.update(client.id, {
      allergies: exists ? client.allergies.map((x) => (x.id === a.id ? a : x)) : [a, ...client.allergies],
    });
  };

  return (
    <SectionCard
      title="Medical / Personal Notes"
      right={<SoftButton label="Add Allergie" icon="add" onPress={() => setForm({ open: true, allergy: null })} />}
    >
      {client.allergies.length === 0 && <EmptyState icon="medkit-outline" text="No allergies or medical notes" />}
      {client.allergies.map((a) => {
        const sev = SEVERITY_STYLES[a.severity];
        return (
          <View key={a.id} style={[styles.alert, { borderColor: sev.border, backgroundColor: sev.bg }]}>
            <View style={[styles.notch, { backgroundColor: sev.border }]} />
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={styles.alertTitle}>{a.name}</Text>
              <Text style={styles.alertBody}>{a.note || "-"}</Text>
              <Label label={a.severity} styleDef={{ bg: sev.solid, text: colors.white }} />
            </View>
            <KebabMenu
              items={[
                { key: "edit", label: "Edit", icon: "create-outline" },
                { key: "delete", label: "Delete", icon: "trash-outline", color: colors.pink },
              ]}
              onSelect={(k) => (k === "edit" ? setForm({ open: true, allergy: a }) : setToDelete(a))}
            />
          </View>
        );
      })}

      <AllergyModal
        visible={form.open}
        allergy={form.allergy}
        onClose={() => setForm({ open: false, allergy: null })}
        onSave={save}
      />
      <ConfirmDeleteModal
        visible={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete Allergie"
        message={`Are you sure you want to remove "${toDelete?.name ?? ""}" from this client?`}
        onConfirm={() =>
          toDelete &&
          clientsStore.update(client.id, { allergies: client.allergies.filter((x) => x.id !== toDelete.id) })
        }
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 12,
    overflow: "hidden",
  },
  notch: {
    position: "absolute",
    left: 0,
    top: "50%",
    marginTop: -14,
    width: 2,
    height: 28,
    borderRadius: 1,
  },
  alertTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  alertBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});
