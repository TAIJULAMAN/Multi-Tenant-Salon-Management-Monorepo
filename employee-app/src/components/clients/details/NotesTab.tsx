import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  ChipGroup,
  CompactDropdown,
  EmptyState,
  FilterLabel,
  IconButton,
  KebabMenu,
  SectionCard,
  SoftButton,
} from "../common";
import { ClientNote, INITIAL_MEDIA, INITIAL_NOTES, LAST_APPOINTMENT_OPTIONS, MediaItem } from "../clientsData";
import { NoteFormModal, UploadMediaModal, ViewNoteModal } from "../modals/NoteModals";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

const DAYS: Record<string, number> = {
  "Last 7 days": 7,
  "Last 14 days": 14,
  "Last Month": 30,
  "Last 3 Months": 90,
};

/** Figma 1:39232 — Notes table + Media grid; modals 1:36394 / 1:36881 / 1:36639. */
export default function NotesTab() {
  const [notes, setNotes] = useState<ClientNote[]>(INITIAL_NOTES);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [fileType, setFileType] = useState("All Type");
  const [dateRange, setDateRange] = useState("Last 7 days");

  const [noteForm, setNoteForm] = useState<{ open: boolean; note: ClientNote | null }>({ open: false, note: null });
  const [viewNote, setViewNote] = useState<ClientNote | null>(null);
  const [deleteNote, setDeleteNote] = useState<ClientNote | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteMedia, setDeleteMedia] = useState<MediaItem | null>(null);

  const filteredMedia = useMemo(() => {
    const days = DAYS[dateRange];
    return media.filter((m) => {
      if (fileType !== "All Type" && m.type !== fileType) return false;
      if (days && m.daysAgo > days) return false;
      return true;
    });
  }, [media, fileType, dateRange]);

  const saveNote = (n: ClientNote) =>
    setNotes((list) => (list.some((x) => x.id === n.id) ? list.map((x) => (x.id === n.id ? n : x)) : [n, ...list]));

  return (
    <View style={styles.container}>
      {/* Notes */}
      <SectionCard
        title="Notes"
        right={<SoftButton label="Add Note" icon="add" onPress={() => setNoteForm({ open: true, note: null })} />}
      >
        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.headText, { flex: 1 }]}>Notes</Text>
            <Text style={styles.headText}>Actions</Text>
          </View>
          {notes.length === 0 && <EmptyState icon="document-text-outline" text="No notes yet" />}
          {notes.map((n, i) => (
            <View key={n.id} style={[styles.noteRow, i % 2 === 1 && { backgroundColor: colors.subtle }]}>
              <Text style={styles.noteTitle}>{n.title}</Text>
              <Text style={styles.noteBody} numberOfLines={3}>
                {n.description}
              </Text>
              <View style={styles.noteFooter}>
                <View style={styles.attachCount}>
                  <Ionicons name="attach" size={14} color={colors.textMuted} />
                  <Text style={styles.attachText}>{n.attachments.length}</Text>
                </View>
                <View style={styles.actions}>
                  <IconButton icon="eye" accessibilityLabel="View note" onPress={() => setViewNote(n)} />
                  <IconButton
                    icon="pencil-outline"
                    tone="blue"
                    accessibilityLabel="Edit note"
                    onPress={() => setNoteForm({ open: true, note: n })}
                  />
                  <IconButton icon="trash-outline" tone="danger" accessibilityLabel="Delete note" onPress={() => setDeleteNote(n)} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* Media */}
      <SectionCard
        title="Media"
        right={<SoftButton label="Upload Media" icon="add" onPress={() => setUploadOpen(true)} />}
      >
        <View>
          <FilterLabel>File Type</FilterLabel>
          <ChipGroup options={["All Type", "Photo", "Video"]} value={fileType} onChange={setFileType} />
        </View>
        <View>
          <FilterLabel>Date</FilterLabel>
          <CompactDropdown
            value={dateRange}
            options={LAST_APPOINTMENT_OPTIONS}
            onChange={setDateRange}
            style={{ alignSelf: "flex-start", minWidth: 130 }}
          />
        </View>

        {filteredMedia.length === 0 && <EmptyState icon="images-outline" text="No media found" />}
        {filteredMedia.map((m) => (
          <View key={m.id} style={styles.mediaCard}>
            <View style={styles.mediaHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mediaName}>{m.fileName}</Text>
                <Text style={styles.mediaDate}>{m.uploadedAt}</Text>
              </View>
              <KebabMenu
                items={[
                  { key: "download", label: "Download", icon: "download-outline" },
                  { key: "delete", label: "Delete", icon: "trash-outline", color: colors.pink },
                ]}
                onSelect={(k) =>
                  k === "download" ? Alert.alert("Download", `${m.fileName} downloaded.`) : setDeleteMedia(m)
                }
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mediaPreview}
              onPress={() => Alert.alert(m.fileName, m.type === "Video" ? "Playing video..." : "Opening photo...")}
            >
              <Image source={{ uri: m.uri }} style={StyleSheet.absoluteFill} />
              {m.type === "Video" && (
                <View style={styles.videoControls}>
                  <View style={styles.controlsRow}>
                    <Ionicons name="play" size={20} color={colors.white} />
                    <View style={{ flex: 1 }} />
                    <Ionicons name="volume-high" size={20} color={colors.white} />
                    <Ionicons name="scan-outline" size={20} color={colors.white} />
                    <Ionicons name="ellipsis-vertical" size={18} color={colors.white} />
                  </View>
                  <View style={styles.progress} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </SectionCard>

      <NoteFormModal
        visible={noteForm.open}
        note={noteForm.note}
        onClose={() => setNoteForm({ open: false, note: null })}
        onSave={saveNote}
      />
      <ViewNoteModal visible={!!viewNote} note={viewNote} onClose={() => setViewNote(null)} />
      <UploadMediaModal
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={(m) => setMedia((list) => [m, ...list])}
      />
      <ConfirmDeleteModal
        visible={!!deleteNote}
        onClose={() => setDeleteNote(null)}
        title="Delete Note"
        message="Are you sure you want to delete this note and its attachments?"
        onConfirm={() => deleteNote && setNotes((l) => l.filter((x) => x.id !== deleteNote.id))}
      />
      <ConfirmDeleteModal
        visible={!!deleteMedia}
        onClose={() => setDeleteMedia(null)}
        title="Delete Media"
        message={`Are you sure you want to delete ${deleteMedia?.fileName ?? "this file"}?`}
        onConfirm={() => deleteMedia && setMedia((l) => l.filter((x) => x.id !== deleteMedia.id))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  noteRow: {
    padding: 16,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noteTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  noteBody: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  noteFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  attachCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  attachText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  mediaCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
  },
  mediaHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  mediaName: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  mediaDate: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  mediaPreview: {
    height: 180,
    borderRadius: radius.card,
    overflow: "hidden",
    backgroundColor: colors.primarySoft,
  },
  videoControls: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    gap: 8,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progress: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
});
