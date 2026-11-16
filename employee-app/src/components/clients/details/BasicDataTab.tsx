import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "@/components/ui/CustomSwitch";
import RecordCard, { RecordList, recordCardStyles } from "@/components/ui/RecordCard";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  IconButton,
  InfoField,
  Label,
  Pagination,
  RankRow,
  SectionCard,
  SoftButton,
  StatTileCard,
  SubTitle,
  usePagination,
} from "../common";
import {
  Client,
  EDIT_HISTORY,
  FREQUENT_SERVICES,
  GREEN_SOFT,
  OVERVIEW_STATS,
  PREFERRED_STAFF,
  PREFERRED_TIMES,
  WAIVERS,
  Waiver,
  formatBirthDate,
  getAge,
} from "../clientsData";

interface BasicDataTabProps {
  client: Client;
  onEditPersonal: () => void;
  onEditAddress: () => void;
}

const TIMELINE_COLORS = [colors.primary, colors.teal, colors.green, colors.yellow, colors.pink];

export default function BasicDataTab({ client, onEditPersonal, onEditAddress }: BasicDataTabProps) {
  const [waivers, setWaivers] = useState<Waiver[]>(WAIVERS);
  const [staff, setStaff] = useState(PREFERRED_STAFF);
  const history = usePagination(EDIT_HISTORY, 5);

  const updateWaiver = (id: string, patch: Partial<Waiver>) =>
    setWaivers((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const signNow = (w: Waiver) =>
    Alert.alert("Sign Now", `Send "${w.name}" to ${client.firstName} for signature?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Now", onPress: () => updateWaiver(w.id, { kind: "signed" }) },
    ]);

  const revoke = (w: Waiver) =>
    Alert.alert("Revoke Signature", `Revoke ${client.firstName}'s signature for "${w.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Revoke", style: "destructive", onPress: () => updateWaiver(w.id, { kind: "unsigned" }) },
    ]);

  return (
    <View style={styles.container}>
      {/* Overview */}
      <SectionCard title="Overview">
        <View style={styles.statsGrid}>
          {OVERVIEW_STATS.map((s) => (
            <StatTileCard key={s.label} tile={s} style={styles.statCell} />
          ))}
        </View>
      </SectionCard>

      {/* Personal data */}
      <SectionCard title="Personal data" right={<SoftButton label="Edit" onPress={onEditPersonal} />}>
        <View style={styles.grid}>
          <InfoField label="Date of birth" value={client.birthDate ? formatBirthDate(client.birthDate) : "-"} />
          <InfoField label="Age" value={client.birthDate ? getAge(client.birthDate) : "-"} />
          <InfoField label="Gender" value={client.gender} full />
          <InfoField label="Telephone" value={client.phone} />
          <InfoField label="Email" value={client.email} />
          <InfoField label="Emergency Contact" value={client.emergencyContact} full />
        </View>
      </SectionCard>

      {/* Full address */}
      <SectionCard title="Full Address" right={<SoftButton label="Edit" onPress={onEditAddress} />}>
        <View style={styles.grid}>
          <InfoField label="Address" value={client.address} />
          <InfoField label="City" value={client.city} />
          <InfoField label="Province" value={client.province} />
          <InfoField label="CAP" value={client.cap} />
        </View>
      </SectionCard>

      {/* Waivers */}
      <SectionCard title="Waivers">
        {waivers.map((w) => (
          <View key={w.id} style={styles.waiverRow}>
            {w.kind === "toggle" ? (
              <View style={styles.socialIcons}>
                <Ionicons name="logo-facebook" size={30} color="#1877F2" />
                <View style={styles.igIcon}>
                  <Ionicons name="logo-instagram" size={20} color={colors.white} />
                </View>
              </View>
            ) : (
              <Ionicons name="document-text-outline" size={30} color={colors.primary} />
            )}
            <View style={styles.waiverMain}>
              <Text style={styles.waiverName}>{w.name}</Text>
              {w.kind === "signed" && <Label label="Signed" styleDef={{ bg: GREEN_SOFT, text: colors.green }} />}
            </View>
            {w.kind === "toggle" && (
              <CustomSwitch value={!!w.enabled} onValueChange={(v) => updateWaiver(w.id, { enabled: v })} />
            )}
            {w.kind === "unsigned" && <SoftButton label="Sign Now" tone="teal" small onPress={() => signNow(w)} />}
            {w.kind === "signed" && (
              <View style={styles.rowActions}>
                <IconButton
                  icon="eye"
                  accessibilityLabel="View signature"
                  onPress={() => Alert.alert(w.name, `Signed by ${client.firstName} ${client.lastName}.`)}
                />
                <IconButton icon="sync-outline" tone="yellow" accessibilityLabel="Revoke Signature" onPress={() => revoke(w)} />
              </View>
            )}
          </View>
        ))}
      </SectionCard>

      {/* Preferences & behavior */}
      <SectionCard title="Preferences & Behavior">
        <SubTitle>Preferred stylist/employee</SubTitle>
        <View style={styles.staffGrid}>
          {staff.map((p) => (
            <View key={p.id} style={styles.staffCard}>
              <TouchableOpacity
                onPress={() => setStaff((s) => s.filter((x) => x.id !== p.id))}
                style={styles.staffTrash}
                hitSlop={8}
                accessibilityLabel={`Remove ${p.name}`}
              >
                <Ionicons name="trash-outline" size={18} color={colors.pink} />
              </TouchableOpacity>
              <Image source={{ uri: p.avatar }} style={styles.staffAvatar} />
              <Text style={styles.staffName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.staffRole}>{p.role}</Text>
            </View>
          ))}
        </View>

        <SubTitle>Services most frequently booked</SubTitle>
        <View style={{ gap: 16 }}>
          {FREQUENT_SERVICES.map((s, i) => (
            <RankRow key={s} index={i + 1} name={s} />
          ))}
        </View>

        <SubTitle>Preferred days/times</SubTitle>
        <View style={styles.timelineCard}>
          {PREFERRED_TIMES.map((t, i) => (
            <View key={t.day} style={styles.timelineItem}>
              <Text style={styles.timelineTime}>{t.time}</Text>
              <View style={styles.timelineRail}>
                <View style={[styles.timelineLine, i === 0 && { top: "50%" }, i === PREFERRED_TIMES.length - 1 && { bottom: "50%" }]} />
                <View style={[styles.timelineDot, { borderColor: TIMELINE_COLORS[i % TIMELINE_COLORS.length] }]} />
              </View>
              <Text style={styles.timelineDay}>{t.day}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* History of edit */}
      <SectionCard title="History of edit">
        <RecordList>
          {history.pageItems.map((h) => (
            <RecordCard
              key={h.id}
              title={h.field}
              subtitle={h.dateTime}
              trailing={
                <Label
                  label={h.action}
                  styleDef={
                    h.action === "Creation"
                      ? { bg: colors.primarySoft, text: colors.primary }
                      : { bg: GREEN_SOFT, text: colors.green }
                  }
                />
              }
              fields={[
                {
                  label: "Previous → New",
                  value: (
                    <Text style={recordCardStyles.value}>
                      <Text style={styles.previousValue}>{h.previousValue}</Text>
                      {"  →  "}
                      {h.newValue}
                    </Text>
                  ),
                  full: true,
                },
                { label: "Edited By", value: h.editedBy, full: true },
              ]}
            />
          ))}
        </RecordList>
        <Pagination {...history} />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  statCell: {
    width: "48.4%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -16,
  },
  waiverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  socialIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  igIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#E1306C",
    alignItems: "center",
    justifyContent: "center",
  },
  waiverMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  waiverName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  staffGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  staffCard: {
    width: "48.4%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  staffTrash: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  staffAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
    backgroundColor: colors.primaryTint,
  },
  staffName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  staffRole: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
  },
  timelineTime: {
    width: 72,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  timelineRail: {
    width: 36,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.border,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  timelineDay: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  previousValue: {
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
});
