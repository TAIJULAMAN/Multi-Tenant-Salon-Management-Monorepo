import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarPageHeader from "@/components/calendar/CalendarPageHeader";
import { FigmaCheckbox, Pagination, StatusBadge, ui } from "@/components/calendar/ui";
import RecordCard, { RecordList, recordCardStyles } from "@/components/ui/RecordCard";
import { AppStatus, CalAppointment } from "@/components/calendar/types";
import {
  CURRENT_EMPLOYEE_ID,
  addAppointmentToStore,
  addDays,
  availableServices,
  clientList,
  formatNumericDate,
  minutesToTime,
  nextAppointmentCode,
  timeToMinutes,
  toISODate,
  uid,
} from "@/components/calendar/data";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

interface ImportRow {
  id: string;
  ref: string;
  date: string; // ISO
  start: string;
  end: string;
  clientRef: string;
  serviceRef: string;
  staffRef: string;
  status: AppStatus;
  note: string;
  decision: "pending" | "accepted";
}

const STATUS_CYCLE: AppStatus[] = ["Booked", "Started", "Canceled", "Confirmed", "Arrived", "Completed", "Arrived", "Arrived", "Canceled", "Booked"];

function buildRows(): ImportRow[] {
  const base = new Date();
  return STATUS_CYCLE.map((status, i) => {
    const startMin = 9 * 60 + i * 45;
    return {
      id: `imp-${i + 1}`,
      ref: `#${String(i + 1).padStart(3, "0")}`,
      date: toISODate(addDays(base, (i % 5) + 1)),
      start: minutesToTime(startMin),
      end: minutesToTime(startMin + 10),
      clientRef: `#${String((i % clientList.length) + 1).padStart(3, "0")}`,
      serviceRef: `#${String((i % availableServices.length) + 1).padStart(3, "0")}`,
      staffRef: "#001",
      status,
      note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      decision: "pending",
    };
  });
}

const VIDEO_THUMB =
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1200&q=80";

/** Import Appointments — Figma 1:18296 (empty), 1:18409 (file + Imported List), 1:32059 (rows selected). */
export default function ImportAppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const allSelected = rows.length > 0 && selected.length === rows.length;

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/vnd.ms-excel", "*/*"],
        copyToCacheDirectory: false,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      const size = asset.size
        ? asset.size > 1024 * 1024
          ? `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(asset.size / 1024))} KB`
        : "4.2 MB";
      setFile({ name: asset.name, size });
      setRows(buildRows());
      setSelected([]);
      setPage(0);
    } catch {
      Alert.alert("Upload failed", "We couldn't read that file. Please try again.");
    }
  };

  const removeFile = () => {
    setFile(null);
    setRows([]);
    setSelected([]);
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const reject = (ids: string[]) => {
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    setSelected((prev) => prev.filter((x) => !ids.includes(x)));
  };
  const accept = (ids: string[]) => {
    setRows((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, decision: "accepted" } : r)));
    setSelected([]);
  };

  const handleSave = () => {
    const chosen = rows.filter((r) => r.decision === "accepted");
    if (chosen.length === 0) {
      Alert.alert("Nothing to import", "Accept at least one row (✓) before saving.");
      return;
    }
    chosen.forEach((r, i) => {
      const client = clientList[i % clientList.length];
      const service = availableServices[i % availableServices.length];
      const appt: CalAppointment = {
        id: uid("apt-imp"),
        code: nextAppointmentCode(),
        staffId: CURRENT_EMPLOYEE_ID,
        clientId: client.id,
        clientName: client.name,
        clientAvatar: client.avatar,
        clientPhone: client.phone,
        clientEmail: client.email,
        service: service.name,
        startTime: r.start,
        endTime: r.end,
        duration: `${timeToMinutes(r.end) - timeToMinutes(r.start)} min`,
        price: service.price,
        priceNum: service.priceNum,
        status: r.status,
        paymentStatus: "Unpaid",
        notes: r.note,
        date: r.date,
      };
      addAppointmentToStore(appt);
    });
    Alert.alert("Import Complete", `${chosen.length} appointments were added to your calendar.`, [
      { text: "OK", onPress: () => (router.canGoBack() ? router.back() : undefined) },
    ]);
  };

  const templateAction = (name: string, action: "view" | "download") =>
    Alert.alert(
      name,
      action === "view"
        ? "Columns: id, start_at, end_at, client_ref, service_ref, staff_ref, status, note"
        : `${name} downloaded to your device.`
    );

  return (
    <View style={styles.container}>
      <CalendarPageHeader title="Import Appointments" />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[ui.card, { gap: 0 }]}>
          {/* Tutorial video */}
          <TouchableOpacity
            style={styles.video}
            activeOpacity={0.9}
            onPress={() => Alert.alert("Import tutorial", "The tutorial video will play here.")}
          >
            <Image source={{ uri: VIDEO_THUMB }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={styles.videoControls}>
              <Ionicons name="play" size={18} color={colors.white} />
              <View style={{ flex: 1 }} />
              <Ionicons name="volume-high" size={18} color={colors.white} />
              <Ionicons name="scan-outline" size={18} color={colors.white} />
              <Ionicons name="ellipsis-vertical" size={18} color={colors.white} />
            </View>
            <View style={styles.videoProgress} />
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Templates</Text>
          <View style={styles.templates}>
            {["CSV Template", "Filled CSV Example"].map((name) => (
              <View key={name} style={styles.templateCard}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.templateName} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={styles.templateMeta}>CSV • 100 KB</Text>
                <View style={styles.templateBtns}>
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => templateAction(name, "view")}>
                    <Ionicons name="eye" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dlBtn} onPress={() => templateAction(name, "download")}>
                    <Ionicons name="download-outline" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Import File</Text>
          <TouchableOpacity style={styles.dropzone} activeOpacity={0.8} onPress={handlePick}>
            <View style={styles.uploadIcon}>
              <Ionicons name="hand-left-outline" size={26} color={colors.primary} />
            </View>
            <Text style={styles.dropzoneText}>Drop here or click to browse</Text>
          </TouchableOpacity>

          {file && (
            <View style={styles.fileItem}>
              <Ionicons name="document-attach-outline" size={30} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>{file.size}</Text>
              </View>
              <TouchableOpacity onPress={removeFile} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={colors.pink} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {rows.length > 0 && (
          <View style={ui.card}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Imported List</Text>
              {selected.length > 0 && (
                <View style={styles.bulkRow}>
                  <TouchableOpacity style={[styles.bulkBtn, { backgroundColor: colors.pinkSoft }]} onPress={() => reject(selected)}>
                    <Text style={[styles.bulkText, { color: colors.pink }]}>Mass Rejection</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.bulkBtn, { backgroundColor: colors.teal }]} onPress={() => accept(selected)}>
                    <Text style={[styles.bulkText, { color: colors.white }]}>Mass Approval</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* "Select all" replaces the old table-header checkbox. */}
            <View style={styles.selectAllRow}>
              <FigmaCheckbox
                checked={allSelected}
                onPress={() => setSelected(allSelected ? [] : rows.map((r) => r.id))}
              />
              <Text style={styles.selectAllText}>Select all</Text>
              {selected.length > 0 && <Text style={styles.selectedCount}>{selected.length} selected</Text>}
            </View>

            {/* One card per imported row (replaces the wide horizontally scrolling table). */}
            <RecordList>
              {pageRows.map((r) => {
                const d = formatNumericDate(r.date);
                const isSelected = selected.includes(r.id);
                return (
                  <RecordCard
                    key={r.id}
                    selected={isSelected}
                    leading={<FigmaCheckbox checked={isSelected} onPress={() => toggle(r.id)} />}
                    title={<Text style={styles.idText}>{r.ref}</Text>}
                    trailing={<StatusBadge status={r.status} />}
                    fields={[
                      { label: "start_at", value: `${d} ${r.start}` },
                      { label: "end_at", value: `${d} ${r.end}` },
                      { label: "client_ref", value: r.clientRef },
                      { label: "service_ref", value: r.serviceRef },
                      { label: "staff_ref", value: r.staffRef },
                      {
                        label: "note",
                        full: true,
                        value: (
                          <Text style={recordCardStyles.value} numberOfLines={2}>
                            {r.note}
                          </Text>
                        ),
                      },
                    ]}
                    footer={
                      <>
                        <TouchableOpacity style={[styles.actBtn, { backgroundColor: colors.pinkSoft }]} onPress={() => reject([r.id])}>
                          <Ionicons name="close" size={16} color={colors.pink} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actBtn,
                            { backgroundColor: r.decision === "accepted" ? colors.teal : colors.tealSoft },
                          ]}
                          onPress={() => accept([r.id])}
                        >
                          <Ionicons name="checkmark" size={16} color={r.decision === "accepted" ? colors.white : colors.teal} />
                        </TouchableOpacity>
                      </>
                    }
                  />
                );
              })}
            </RecordList>
            <Pagination page={safePage} pageSize={pageSize} total={rows.length} onPage={setPage} onPageSize={setPageSize} />
          </View>
        )}

        {rows.length > 0 && (
          <View style={styles.saveRow}>
            <TouchableOpacity style={ui.primaryBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={ui.primaryBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { padding: 16, gap: 16 },
  video: {
    height: 190,
    borderRadius: radius.md,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
  },
  videoControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  videoProgress: {
    height: 3,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
    marginBottom: 12,
  },
  templates: { flexDirection: "row", gap: 12 },
  templateCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  templateName: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  templateMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  templateBtns: { flexDirection: "row", gap: 12, marginTop: 14 },
  eyeBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  dlBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzone: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    gap: 10,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginTop: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileName: { fontFamily: fonts.medium, fontSize: 16, color: colors.primary },
  fileSize: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  bulkRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.md,
  },
  bulkText: { fontFamily: fonts.medium, fontSize: 13 },
  selectAllRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  selectAllText: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  selectedCount: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
  idText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.primary },
  actBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveRow: { flexDirection: "row", justifyContent: "flex-end" },
});
