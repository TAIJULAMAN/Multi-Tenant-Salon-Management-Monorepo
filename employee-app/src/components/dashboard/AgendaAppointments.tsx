import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  OutlineButton,
  PeriodDropdown,
  dashboardCardStyle as card,
} from "./DashboardControls";
import {
  AGENDA_DATES,
  agendaAppointments,
  agendaStatusColors,
  stepStatusColors,
  type AgendaAppointment,
} from "./dashboardData";

const APPOINTMENTS_PATH = "/(drawer)/(tabs)/calendar/appointments";
const appointmentPath = (id: string, sub?: string) =>
  `/(drawer)/(tabs)/calendar/appointment/${id}${sub ? `/${sub}` : ""}`;

/** Figma "Agenda - Appointments" table (fixed-height, scrollable, 1:32440). */
const TABLE_MAX_HEIGHT = 435;
const EDIT_ICON = "#46C8EA";

export default function AgendaAppointments() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(AGENDA_DATES[0]);
  const [expandedId, setExpandedId] = useState<string | null>(
    agendaAppointments[0]?.id ?? null,
  );

  const items = agendaAppointments.filter((a) => a.date === selectedDate);

  const renderExpanded = (item: AgendaAppointment) => (
    <View style={styles.expandedWrapper}>
      <Text style={styles.expandedTitle}>Booking Order</Text>
      <View style={styles.stepsRow}>
        <View style={styles.timelineLine} />
        {item.steps.map((step) => {
          const c = stepStatusColors[step.status];
          return (
            <View key={step.number} style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: c.circle }]}>
                <Text style={[styles.stepNumber, { color: c.circleText }]}>
                  {step.number}
                </Text>
              </View>
              <View style={[styles.stepBadge, { backgroundColor: c.badgeBg }]}>
                <Text style={[styles.stepBadgeText, { color: c.badgeText }]}>
                  {step.status}
                </Text>
              </View>
              <Text style={styles.stepTime}>{step.time}</Text>
              <Text style={styles.stepService} numberOfLines={1}>
                {step.service}
              </Text>
              <Text style={styles.stepStaff} numberOfLines={1}>
                {step.staff}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.printReceiptBtn}
        onPress={() => router.push(appointmentPath(item.id, "receipt") as any)}
        activeOpacity={0.8}
      >
        <Text style={styles.printReceiptText}>Print Receipt</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[card.card, styles.cardOverride]}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Agenda - Appointments</Text>
        </View>
        <View style={card.actionsRow}>
          <PeriodDropdown
            value={selectedDate}
            options={AGENDA_DATES}
            onChange={(d) => {
              setSelectedDate(d);
              setExpandedId(
                agendaAppointments.find((a) => a.date === d)?.id ?? null,
              );
            }}
          />
          <OutlineButton
            title="View All"
            onPress={() => router.push(APPOINTMENTS_PATH as any)}
          />
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.flex]}>Client</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>

        <ScrollView
          style={styles.tableBody}
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          {items.map((item, index) => {
            const badge = agendaStatusColors[item.status];
            const isExpanded = expandedId === item.id;
            return (
              <View
                key={item.id}
                style={[styles.row, index > 0 && styles.rowDivider]}
              >
                <View style={styles.rowMain}>
                  <TouchableOpacity
                    style={styles.clientCell}
                    onPress={() => router.push(appointmentPath(item.id) as any)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                    <View style={styles.flex}>
                      <Text style={styles.clientName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.phoneText} numberOfLines={1}>
                        {item.phone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.rowMeta}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() =>
                        router.push(appointmentPath(item.id) as any)
                      }
                      activeOpacity={0.7}
                      accessibilityLabel="Edit appointment"
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={16}
                        color={EDIT_ICON}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chevronBtn}
                      onPress={() =>
                        setExpandedId((p) => (p === item.id ? null : item.id))
                      }
                      hitSlop={6}
                      activeOpacity={0.7}
                      accessibilityLabel={
                        isExpanded
                          ? "Collapse booking order"
                          : "Expand booking order"
                      }
                    >
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {isExpanded && renderExpanded(item)}
              </View>
            );
          })}

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>
                No appointments on {selectedDate}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  cardOverride: {
    zIndex: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    height: 43,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryTint,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  tableBody: {
    maxHeight: TABLE_MAX_HEIGHT,
  },
  row: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clientCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.pinkSoft,
  },
  clientName: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  phoneText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  badge: {
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 60,
    paddingVertical: 8,
  },
  timeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronBtn: {
    width: 24,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  expandedWrapper: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  expandedTitle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 12,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  timelineLine: {
    position: "absolute",
    top: 12,
    left: "16.6%",
    right: "16.6%",
    height: 1,
    backgroundColor: colors.textMuted,
  },
  stepItem: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  stepBadge: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: radius.md,
    marginBottom: 8,
  },
  stepBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  stepTime: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  stepService: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
    textAlign: "center",
  },
  stepStaff: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  printReceiptBtn: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  printReceiptText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
  emptyState: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
