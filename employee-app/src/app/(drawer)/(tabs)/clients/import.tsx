import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { IMPORT_ROWS, ImportRow, clientsStore, createEmptyClient } from "@/components/clients/clientsData";
import {
  CheckState,
  FigmaCheckbox,
  FileRow,
  IconButton,
  Pagination,
  PrimaryButton,
  TitleBar,
  UploadDropzone,
  usePagination,
} from "@/components/clients/common";
import { PickedFile, pickFile } from "@/components/clients/pickFile";
import RecordCard, { RecordList } from "@/components/ui/RecordCard";

type RowDecision = "accepted" | "rejected" | undefined;

const VIDEO_THUMB =
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1200&q=80";

/** Import Clients — Figma 1:40570 (empty), 1:40683 (file + Imported List), 1:41039 (all selected + mass actions). */
export default function ImportClientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [file, setFile] = useState<PickedFile | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [decisions, setDecisions] = useState<Record<string, RowDecision>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const pagination = usePagination(rows, 5);

  const handlePick = async () => {
    const picked = await pickFile(["text/csv", "text/comma-separated-values", "application/vnd.ms-excel", "*/*"]);
    if (!picked) return;
    setFile(picked);
    setRows(IMPORT_ROWS);
    setDecisions({});
    setSelected([]);
  };

  const removeFile = () => {
    setFile(null);
    setRows([]);
    setDecisions({});
    setSelected([]);
  };

  const decide = (ids: string[], d: RowDecision) =>
    setDecisions((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = ids.length === 1 && next[id] === d ? undefined : d));
      return next;
    });

  const allSelected = rows.length > 0 && selected.length === rows.length;
  const headerState: CheckState = allSelected ? "checked" : selected.length > 0 ? "indeterminate" : "unchecked";
  const toggleRow = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSave = () => {
    const toImport = rows.filter((r) => decisions[r.id] !== "rejected");
    if (toImport.length === 0) {
      Alert.alert("Nothing to import", "All rows were rejected.");
      return;
    }
    toImport.forEach((r) => {
      const c = createEmptyClient();
      clientsStore.add({
        ...c,
        id: `${c.id}-${r.id}`,
        firstName: r.firstName,
        lastName: r.lastName,
        phone: r.phone,
        email: r.email,
        birthDate: r.birthDate,
        registration: "Imported",
      });
    });
    Alert.alert("Import Successful", `${toImport.length} client(s) imported.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate("/(drawer)/(tabs)/clients" as never));

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <TitleBar title="Import Clients" onBack={goBack} onHome={() => router.navigate("/(drawer)/(tabs)/clients" as never)} />

        <View style={styles.card}>
          {/* Tutorial video */}
          <TouchableOpacity
            style={styles.video}
            activeOpacity={0.9}
            onPress={() => Alert.alert("Video Guide", "Playing tutorial: how to import your clients.")}
          >
            <Image source={{ uri: VIDEO_THUMB }} style={StyleSheet.absoluteFill} />
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
          </TouchableOpacity>

          {/* Templates */}
          <Text style={styles.sectionTitle}>Templates</Text>
          <View style={styles.templatesRow}>
            {["CSV Template", "Filled CSV Example"].map((t) => (
              <View key={t} style={styles.templateCard}>
                <View style={styles.templateIcon}>
                  <Ionicons name="document-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.templateName}>{t}</Text>
                <Text style={styles.templateMeta}>CSV • 100 KB</Text>
                <View style={styles.templateActions}>
                  <IconButton icon="eye" accessibilityLabel={`Preview ${t}`} onPress={() => Alert.alert(t, "Opening preview...")} />
                  <IconButton
                    icon="download-outline"
                    tone="blue"
                    accessibilityLabel={`Download ${t}`}
                    onPress={() => Alert.alert("Download", `${t} downloaded.`)}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Import file */}
          <Text style={styles.sectionTitle}>Import File</Text>
          <UploadDropzone onPress={handlePick} style={{ marginBottom: 0 }} />
          {file && (
            <FileRow
              name={file.name}
              size={file.size}
              actions={
                <TouchableOpacity onPress={removeFile} hitSlop={8} accessibilityLabel="Remove file" style={{ alignSelf: "flex-start" }}>
                  <Ionicons name="trash-outline" size={20} color={colors.pink} />
                </TouchableOpacity>
              }
            />
          )}
        </View>

        {rows.length > 0 && (
          <>
            <View style={styles.card}>
              <View style={styles.listHeader}>
                <Text style={[styles.sectionTitle, { flex: 1 }]}>Imported List</Text>
                {selected.length > 0 && (
                  <View style={styles.massRow}>
                    <TouchableOpacity style={styles.massReject} onPress={() => decide(selected, "rejected")} activeOpacity={0.8}>
                      <Text style={[styles.massText, { color: colors.pink }]}>Mass Rejection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.massApprove} onPress={() => decide(selected, "accepted")} activeOpacity={0.8}>
                      <Text style={[styles.massText, { color: colors.white }]}>Mass Approval</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.selectRow}>
                <FigmaCheckbox
                  state={headerState}
                  label="Select all rows"
                  onPress={() => setSelected(allSelected ? [] : rows.map((r) => r.id))}
                />
                <Text style={styles.selectLabel}>Select all</Text>
              </View>

              <RecordList>
                {pagination.pageItems.map((r) => {
                  const decision = decisions[r.id];
                  return (
                    <RecordCard
                      key={r.id}
                      selected={selected.includes(r.id)}
                      style={decision === "rejected" && { opacity: 0.45 }}
                      leading={
                        <FigmaCheckbox
                          state={selected.includes(r.id) ? "checked" : "unchecked"}
                          label={`Select ${r.id}`}
                          onPress={() => toggleRow(r.id)}
                        />
                      }
                      title={`${r.firstName} ${r.lastName}`}
                      subtitle={<Text style={styles.idText}>{r.id}</Text>}
                      fields={[
                        { label: "phone", value: r.phone },
                        { label: "email", value: r.email, full: true },
                        { label: "marketing_consent", value: r.marketingConsent },
                        { label: "birth_date", value: r.birthDate },
                      ]}
                      footer={
                        <>
                          <DecisionButton
                            icon="close"
                            active={decision === "rejected"}
                            soft={colors.pinkSoft}
                            color={colors.pink}
                            label="Reject"
                            onPress={() => decide([r.id], "rejected")}
                          />
                          <DecisionButton
                            icon="checkmark"
                            active={decision === "accepted"}
                            soft={colors.tealSoft}
                            color={colors.teal}
                            label="Approve"
                            onPress={() => decide([r.id], "accepted")}
                          />
                        </>
                      }
                    />
                  );
                })}
              </RecordList>
              <Pagination {...pagination} />
            </View>

            <View style={styles.footerRow}>
              <PrimaryButton label="Save" onPress={handleSave} style={{ height: 44 }} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function DecisionButton({
  icon,
  active,
  soft,
  color,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  soft: string;
  color: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.decisionBtn, { backgroundColor: active ? color : soft }]}
    >
      <Ionicons name={icon} size={18} color={active ? colors.white : color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
    ...shadows.card,
  },
  video: {
    height: 200,
    borderRadius: radius.card,
    overflow: "hidden",
    backgroundColor: colors.primarySoft,
  },
  videoControls: {
    position: "absolute",
    left: 12,
    right: 12,
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
  sectionTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  templatesRow: {
    flexDirection: "row",
    gap: 12,
  },
  templateCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 20,
    paddingHorizontal: 8,
    gap: 4,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  templateName: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: "center",
  },
  templateMeta: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  templateActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  massRow: {
    flexDirection: "row",
    gap: 8,
  },
  massReject: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.pinkSoft,
    justifyContent: "center",
  },
  massApprove: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.teal,
    justifyContent: "center",
  },
  massText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  idText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  decisionBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
