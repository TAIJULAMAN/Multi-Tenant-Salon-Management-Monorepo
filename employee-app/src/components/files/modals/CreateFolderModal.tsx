import React, { useState } from "react";
import { colors } from "@/constants/figmaTheme";
import FilesModal, { ModalInput } from "./FilesModal";

/** Figma 1:8945 — "Create Folder" dialog. */
export default function CreateFolderModal({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    onClose();
  };

  return (
    <FilesModal
      visible={visible}
      onClose={onClose}
      title="Create Folder"
      onSave={handleSave}
      saveDisabled={!name.trim()}
      maxWidth={528}
    >
      <ModalInput
        label="Name *"
        placeholder="Enter name"
        placeholderTextColor={colors.text}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
    </FilesModal>
  );
}
