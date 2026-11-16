import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  ChipGroup,
  CompactDropdown,
  EmptyState,
  FilterLabel,
  IconButton,
  Label,
  Pagination,
  SectionCard,
  usePagination,
} from "../common";
import {
  COMMUNICATION_LOG,
  CommunicationEntry,
  LAST_CONTACTED,
  LOG_RANGE_OPTIONS,
  MESSAGE_STATUS_OPTIONS,
  MESSAGE_STATUS_STYLES,
  SENDER_TYPE_STYLES,
  STAFF_AVATARS,
} from "../clientsData";
import { ChannelIcon, CommunicationDetailModal, senderType } from "../modals/InfoModals";

const RANGE_DAYS: Record<string, number> = {
  "Last 7 days": 7,
  "Last 14 days": 14,
  "Last Month": 30,
  "Last 3 Months": 90,
};

/** Figma 1:39631 — channel chips, status + date range dropdowns, log list, pagination. */
export default function CommunicationLogTab() {
  const [channel, setChannel] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [range, setRange] = useState("All Time");
  const [entries, setEntries] = useState(COMMUNICATION_LOG);
  const [selected, setSelected] = useState<CommunicationEntry | null>(null);

  const filtered = useMemo(() => {
    const days = RANGE_DAYS[range];
    return entries.filter((e) => {
      if (channel !== "All" && e.channel !== channel) return false;
      if (status !== "All Status" && e.status !== status) return false;
      if (days && e.daysAgo > days) return false;
      return true;
    });
  }, [entries, channel, status, range]);

  const pagination = usePagination(filtered, 5);

  const markDelivered = (e: CommunicationEntry) =>
    Alert.alert("Confirm delivery", "Mark this message as delivered?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => setEntries((l) => l.map((x) => (x.id === e.id ? { ...x, status: "Delivered" } : x))),
      },
    ]);

  return (
    <SectionCard title="Communication Log">
      <View style={styles.lastRow}>
        <Text style={styles.lastLabel}>Last time contacted:</Text>
        <Label label={LAST_CONTACTED} styleDef={{ bg: colors.primarySoft, text: colors.primary }} />
      </View>

      <View>
        <FilterLabel>Channel</FilterLabel>
        <ChipGroup options={["All", "Email", "SMS", "WhatsApp"]} value={channel} onChange={setChannel} />
      </View>
      <View style={styles.dropRow}>
        <View style={{ flex: 1 }}>
          <FilterLabel>Status</FilterLabel>
          <CompactDropdown value={status} options={MESSAGE_STATUS_OPTIONS} onChange={setStatus} />
        </View>
        <View style={{ flex: 1.3 }}>
          <FilterLabel>Date Range</FilterLabel>
          <CompactDropdown value={range} options={LOG_RANGE_OPTIONS} onChange={setRange} />
        </View>
      </View>

      <View style={styles.list}>
        {filtered.length === 0 && <EmptyState icon="chatbubbles-outline" text="No communications found" />}
        {pagination.pageItems.map((e, i) => {
          const type = senderType(e);
          return (
            <View key={e.id} style={[styles.item, i > 0 && styles.itemDivider]}>
              <View style={styles.itemTop}>
                <ChannelIcon channel={e.channel} />
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={styles.message}>{e.message}</Text>
                  <View style={styles.metaRow}>
                    {e.sender ? (
                      <View style={styles.sender}>
                        <Image source={{ uri: STAFF_AVATARS[3] }} style={styles.senderAvatar} />
                        <Text style={styles.meta}>{e.sender}</Text>
                      </View>
                    ) : (
                      <Text style={styles.meta}>System</Text>
                    )}
                    <Text style={styles.meta}>{e.date}</Text>
                    <Text style={styles.meta}>{e.time}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.itemBottom}>
                <Label label={e.status} styleDef={MESSAGE_STATUS_STYLES[e.status]} />
                <Label label={type} styleDef={SENDER_TYPE_STYLES[type]} />
                <View style={{ flex: 1 }} />
                <IconButton icon="eye" accessibilityLabel="View message" onPress={() => setSelected(e)} />
                {e.status === "Sent" && (
                  <IconButton
                    icon="checkmark"
                    tone="outline"
                    accessibilityLabel="Mark as delivered"
                    onPress={() => markDelivered(e)}
                  />
                )}
              </View>
            </View>
          );
        })}
        {filtered.length > 0 && (
          <View style={[styles.itemDivider, { padding: 16 }]}>
            <Pagination {...pagination} />
          </View>
        )}
      </View>

      <CommunicationDetailModal
        visible={!!selected}
        entry={selected}
        onClose={() => setSelected(null)}
        onArchive={(e) => setEntries((l) => l.filter((x) => x.id !== e.id))}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  lastRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  lastLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  dropRow: {
    flexDirection: "row",
    gap: 12,
  },
  list: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  item: {
    padding: 16,
    gap: 12,
  },
  itemDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  sender: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  meta: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
