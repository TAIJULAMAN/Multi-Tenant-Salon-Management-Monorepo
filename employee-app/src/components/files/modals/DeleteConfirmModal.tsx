import React from "react";
import { Text } from "react-native";
import { colors, fonts, typography } from "@/constants/figmaTheme";
import FilesModal from "./FilesModal";

/** Delete confirmation — not drawn in Figma; uses the Files dialog shell. */
export default function DeleteConfirmModal({
  visible,
  onClose,
  itemName,
  itemType,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  itemType: "file" | "folder" | "files";
  onConfirm: () => void;
}) {
  const title = itemType === "folder" ? "Delete Folder" : itemType === "files" ? "Delete Files" : "Delete File";
  return (
    <FilesModal
      visible={visible}
      onClose={onClose}
      title={title}
      saveLabel="Delete"
      saveTone="danger"
      secondaryLabel="Cancel"
      onSave={onConfirm}
      maxWidth={528}
    >
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        Are you sure you want to permanently delete{" "}
        <Text style={{ fontFamily: fonts.semibold, color: colors.text }}>{itemName}</Text>? This action cannot be undone.
      </Text>
    </FilesModal>
  );
}
