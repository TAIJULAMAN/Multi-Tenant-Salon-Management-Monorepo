import React, { useState } from "react";
import { ScrollView, Text, View, Alert, StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/figmaTheme";
import { FigmaModal, FileRow, FormInput, IconButton, ModalFooter, UploadDropzone } from "../common";
import { ClientNote, MediaItem } from "../clientsData";
import { pickFile } from "../pickFile";

// ---------------------------------------------------------------------------
// Add / Edit Note (Figma 1:36394)
// ---------------------------------------------------------------------------

export function NoteFormModal({
  visible,
  onClose,
  note,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  note?: ClientNote | null;
  onSave: (note: ClientNote) => void;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title={note ? "Edit Note" : "Add Note"}>
      {visible && <NoteForm key={note?.id ?? "new"} note={note} onClose={onClose} onSave={onSave} />}
    </FigmaModal>
  );
}

function NoteForm({
  note,
  onClose,
  onSave,
}: {
  note?: ClientNote | null;
  onClose: () => void;
  onSave: (n: ClientNote) => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [attachments, setAttachments] = useState(note?.attachments ?? []);

  const handlePick = async () => {
    const file = await pickFile();
    if (file) setAttachments((a) => [...a, { name: file.name, size: file.size }]);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Missing information", "Please enter a title and a description.");
      return;
    }
    onSave({
      id: note?.id ?? `n${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      attachments,
    });
    onClose();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <FormInput label="Title" required placeholder="Enter title" value={title} onChangeText={setTitle} />
      <FormInput
        label="Description"
        required
        multiline
        placeholder="Enter note"
        value={description}
        onChangeText={setDescription}
      />
      <UploadDropzone onPress={handlePick} />
      {attachments.length > 0 && (
        <View style={styles.fileList}>
          {attachments.map((a, i) => (
            <FileRow
              key={`${a.name}-${i}`}
              name={a.name}
              size={a.size}
              onRemove={() => setAttachments((list) => list.filter((_, idx) => idx !== i))}
            />
          ))}
        </View>
      )}
      <ModalFooter primaryLabel="Save Note" onPrimary={handleSave} />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// View Note (Figma 1:36881)
// ---------------------------------------------------------------------------

export function ViewNoteModal({
  visible,
  onClose,
  note,
}: {
  visible: boolean;
  onClose: () => void;
  note: ClientNote | null;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title="View Note">
      {note && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{note.title}</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{note.description}</Text>
          <Text style={styles.label}>Attachments</Text>
          {note.attachments.length === 0 ? (
            <Text style={styles.value}>No attachments</Text>
          ) : (
            <View style={styles.fileList}>
              {note.attachments.map((a, i) => (
                <FileRow
                  key={`${a.name}-${i}`}
                  name={a.name}
                  size={a.size}
                  actions={
                    <View style={styles.actions}>
                      <IconButton icon="eye" accessibilityLabel="Preview" onPress={() => Alert.alert("Preview", a.name)} />
                      <IconButton
                        icon="download-outline"
                        tone="primarySoft"
                        accessibilityLabel="Download"
                        onPress={() => Alert.alert("Download", `${a.name} downloaded.`)}
                      />
                    </View>
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </FigmaModal>
  );
}

// ---------------------------------------------------------------------------
// Upload Media (Figma 1:36639)
// ---------------------------------------------------------------------------

export function UploadMediaModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (item: MediaItem) => void;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title="Upload Media">
      {visible && <UploadMediaForm onClose={onClose} onSave={onSave} />}
    </FigmaModal>
  );
}

function UploadMediaForm({ onClose, onSave }: { onClose: () => void; onSave: (m: MediaItem) => void }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<{ name: string; size: string; uri: string; mimeType?: string } | null>(null);

  const handlePick = async () => {
    const picked = await pickFile(["image/*", "video/*"]);
    if (picked) {
      setFile(picked);
      if (!name) setName(picked.name);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing information", "Please enter a title.");
      return;
    }
    if (!file) {
      Alert.alert("Missing file", "Please select a photo or video to upload.");
      return;
    }
    const now = new Date();
    const stamp = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
    const isVideo = file.mimeType?.startsWith("video") ?? /\.(mp4|mov|avi)$/i.test(file.name);
    onSave({
      id: `m${Date.now()}`,
      fileName: name.trim(),
      type: isVideo ? "Video" : "Photo",
      uploadedAt: `Uploaded at ${stamp}`,
      uri: isVideo
        ? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
        : file.uri,
      daysAgo: 0,
    });
    onClose();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <FormInput label="Title" required placeholder="Enter title" value={name} onChangeText={setName} />
      {file ? (
        <View style={[styles.fileList, { marginBottom: 16 }]}>
          <FileRow name={file.name} size={file.size} onRemove={() => setFile(null)} />
        </View>
      ) : (
        <UploadDropzone onPress={handlePick} />
      )}
      <ModalFooter primaryLabel="Save Media" onPrimary={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fileList: {
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
});
