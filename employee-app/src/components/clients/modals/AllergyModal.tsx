import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { FigmaModal, FormInput, InlineSelect, ModalFooter } from "../common";
import { Allergy, COLOR_BY_SEVERITY, SEVERITY_OPTIONS, Severity } from "../clientsData";

interface AllergyModalProps {
  visible: boolean;
  onClose: () => void;
  allergy?: Allergy | null;
  onSave: (allergy: Allergy) => void;
}

/** Figma 1:36157 "Add Allergie": Name *, Severity (optional), Note, "Save Allergie". */
export default function AllergyModal({ visible, onClose, allergy, onSave }: AllergyModalProps) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title={allergy ? "Edit Allergie" : "Add Allergie"}>
      {visible && <AllergyForm key={allergy?.id ?? "new"} allergy={allergy} onClose={onClose} onSave={onSave} />}
    </FigmaModal>
  );
}

function AllergyForm({
  allergy,
  onClose,
  onSave,
}: {
  allergy?: Allergy | null;
  onClose: () => void;
  onSave: (a: Allergy) => void;
}) {
  const [name, setName] = useState(allergy?.name ?? "");
  const [severity, setSeverity] = useState<Severity | "">(allergy?.severity ?? "");
  const [note, setNote] = useState(allergy?.note ?? "");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing information", "Please enter the allergie name.");
      return;
    }
    const sev: Severity = severity || "Mild";
    onSave({
      id: allergy?.id ?? `a${Date.now()}`,
      name: name.trim(),
      severity: sev,
      note: note.trim(),
      color: COLOR_BY_SEVERITY[sev],
    });
    onClose();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <FormInput label="Name" required placeholder="Enter name" value={name} onChangeText={setName} />
      <InlineSelect
        label="Severity (optional)"
        placeholder="Mild"
        value={severity}
        options={SEVERITY_OPTIONS}
        onChange={(v) => setSeverity(v as Severity)}
      />
      <FormInput label="Note" multiline placeholder="Enter note" value={note} onChangeText={setNote} />
      <ModalFooter primaryLabel="Save Allergie" onPrimary={handleSave} />
    </ScrollView>
  );
}
