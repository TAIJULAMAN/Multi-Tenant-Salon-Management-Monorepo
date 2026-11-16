import React, { useState } from "react";
import FilesModal, { ModalInput } from "./FilesModal";

/** Rename dialog — not drawn in Figma; mirrors the "Create Folder" dialog (1:8945). */
export default function RenameModal({
  visible,
  onClose,
  currentName,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
}) {
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    onClose();
  };

  return (
    <FilesModal
      visible={visible}
      onClose={onClose}
      title="Rename"
      onSave={handleSave}
      saveDisabled={!name.trim() || name.trim() === currentName}
      maxWidth={528}
    >
      <ModalInput
        label="Name *"
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        autoFocus
        selectTextOnFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
    </FilesModal>
  );
}
