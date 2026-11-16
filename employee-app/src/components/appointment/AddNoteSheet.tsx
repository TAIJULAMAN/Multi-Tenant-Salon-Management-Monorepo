import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { colors } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton, dialogStyles } from "./AppointmentDialog";

interface AddNoteSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

/** Figma 1:26594 – "Add a Note" dialog (opened from the ⋮ menu). */
export default function AddNoteSheet({ visible, onClose, onSave }: AddNoteSheetProps) {
  const [value, setValue] = useState("");
  const [prevVisible, setPrevVisible] = useState(visible);

  // Start from an empty note each time the dialog opens.
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setValue("");
  }

  return (
    <AppointmentDialog
      visible={visible}
      title="Add a Note"
      onClose={onClose}
      footer={
        <View style={dialogStyles.actionsRight}>
          <DialogButton label="Save" disabled={!value.trim()} onPress={() => onSave(value.trim())} />
        </View>
      }
    >
      <TextInput
        style={dialogStyles.textArea}
        placeholder="Add a note"
        placeholderTextColor={colors.text}
        multiline
        value={value}
        onChangeText={setValue}
      />
    </AppointmentDialog>
  );
}
