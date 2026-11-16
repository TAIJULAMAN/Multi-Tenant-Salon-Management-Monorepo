import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { AmountBlock, CompactDropdown, EmptyState, FilterLabel, Label, SectionCard, SoftButton } from "../common";
import {
  APPOINTMENT_STATUS_OPTIONS,
  APPOINTMENT_STATUS_STYLES,
  BOOKING_STEP_STYLES,
  CLIENT_APPOINTMENTS,
  ClientAppointment,
  DATE_RANGE_OPTIONS,
} from "../clientsData";
import { ServicesListModal } from "../modals/InfoModals";

const DAYS: Record<string, number> = {
  "Last 7 days": 7,
  "Last 14 days": 14,
  "Last Month": 30,
  "Last 3 Months": 90,
};

/** Figma 1:37130 (list + filters + booking order), 1:37436 (List of Services), 1:37746 (custom range). */
export default function AppointmentsTab() {
  const router = useRouter();
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [range, setRange] = useState("Last 7 days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [expanded, setExpanded] = useState<string | null>("1");
  const [servicesFor, setServicesFor] = useState<ClientAppointment | null>(null);

  const list = useMemo(() => {
    const min = parseFloat(minAmount);
    const max = parseFloat(maxAmount);
    const days = DAYS[range];
    return CLIENT_APPOINTMENTS.filter((a) => {
      if (status !== "All" && a.status !== status) return false;
      if (!isNaN(min) && a.price < min) return false;
      if (!isNaN(max) && a.price > max) return false;
      if (days && a.daysAgo > days) return false;
      return true;
    });
  }, [minAmount, maxAmount, range, status]);

  return (
    <SectionCard title="Appointments">
      {/* Filters */}
      <View>
        <FilterLabel>Amount Spent</FilterLabel>
        <View style={styles.rangeRow}>
          <TextInput
            style={styles.rangeInput}
            placeholder="€ 0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={minAmount}
            onChangeText={setMinAmount}
          />
          <Text style={styles.dash}>-</Text>
          <TextInput
            style={styles.rangeInput}
            placeholder="€ 200"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={maxAmount}
            onChangeText={setMaxAmount}
          />
        </View>
      </View>
      <View style={styles.dropRow}>
        <CompactDropdown value={range} options={DATE_RANGE_OPTIONS} onChange={setRange} style={{ flex: 1 }} />
        <CompactDropdown value={status} options={APPOINTMENT_STATUS_OPTIONS} onChange={setStatus} style={{ flex: 1 }} />
      </View>
      {range === "Custom Range" && (
        <View style={styles.dropRow}>
          <View style={{ flex: 1 }}>
            <DatePickerInput label="From" value={fromDate} onChange={setFromDate} placeholder="MM/DD/YYYY" />
          </View>
          <View style={{ flex: 1 }}>
            <DatePickerInput label="To" value={toDate} onChange={setToDate} placeholder="MM/DD/YYYY" />
          </View>
        </View>
      )}

      {list.length === 0 && <EmptyState icon="calendar-outline" text="No appointments found" />}

      {list.map((a) => {
        const isOpen = expanded === a.id;
        return (
          <View key={a.id} style={styles.card}>
            <TouchableOpacity style={styles.cardTop} activeOpacity={0.8} onPress={() => setExpanded(isOpen ? null : a.id)}>
              <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>
                  {a.day} {a.month}
                </Text>
                <Text style={styles.dateYear}>{a.year}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{a.title}</Text>
                  <Label label={a.status} styleDef={APPOINTMENT_STATUS_STYLES[a.status]} />
                </View>
                <Text style={styles.meta}>
                  {a.time} • {a.duration} • {a.staff} •{" "}
                  <Text style={styles.link} onPress={() => setServicesFor(a)}>
                    List of Services
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            {isOpen && a.bookingOrder && (
              <View style={styles.booking}>
                <Text style={styles.bookingTitle}>Booking Order</Text>
                <View style={styles.bookingRow}>
                  <View style={styles.bookingLine} />
                  {a.bookingOrder.map((b) => {
                    const st = BOOKING_STEP_STYLES[b.status];
                    return (
                      <View key={b.order} style={styles.step}>
                        <View style={[styles.stepCircle, { backgroundColor: st.circle }]}>
                          <Text style={[styles.stepNum, { color: st.circleText }]}>{b.order}</Text>
                        </View>
                        <View style={[styles.stepBadge, { backgroundColor: st.bg }]}>
                          <Text style={[styles.stepBadgeText, { color: st.text }]}>{b.status}</Text>
                        </View>
                        <Text style={styles.stepTime}>{b.time}</Text>
                        <Text style={styles.stepService}>{b.service}</Text>
                        <Text style={styles.stepStaff}>{b.staff}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.cardBottom}>
              <AmountBlock amount={`€ ${a.price}`} caption={a.paymentState} />
              <SoftButton
                label="Checkout"
                onPress={() => router.push(`/(drawer)/(tabs)/calendar/appointment/${a.id}/checkout` as never)}
              />
            </View>
          </View>
        );
      })}

      <ServicesListModal visible={!!servicesFor} onClose={() => setServicesFor(null)} appointment={servicesFor} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rangeInput: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  dash: {
    color: colors.text,
    fontFamily: fonts.medium,
  },
  dropRow: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    backgroundColor: colors.subtleAlt,
    borderRadius: radius.card,
    padding: 16,
    gap: 14,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateBox: {
    width: 64,
    height: 60,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  dateYear: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  booking: {
    alignItems: "center",
    gap: 14,
  },
  bookingTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  bookingRow: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookingLine: {
    position: "absolute",
    top: 14,
    left: "16%",
    right: "16%",
    height: 1,
    backgroundColor: colors.textMuted,
  },
  step: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  stepBadge: {
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 4,
  },
  stepBadgeText: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  stepTime: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  stepService: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  stepStaff: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});
