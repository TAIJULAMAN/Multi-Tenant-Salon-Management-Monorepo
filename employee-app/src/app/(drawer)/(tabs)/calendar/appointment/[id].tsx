import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";
import AppointmentHeader from "@/components/appointment/AppointmentHeader";
import AddNoteSheet from "@/components/appointment/AddNoteSheet";
import CancelAppointmentDialog from "@/components/appointment/CancelAppointmentDialog";
import RepeatingDialog from "@/components/appointment/RepeatingDialog";
import OptionSheet from "@/components/appointment/OptionSheet";
import PopoverMenu, { DropdownMenu } from "@/components/appointment/PopoverMenu";
import ServiceCard, { SquareAvatar } from "@/components/appointment/ServiceCard";
import StatusToast, { ToastState, takeQueuedToast } from "@/components/appointment/StatusToast";
import {
  AppointmentStatus,
  AVAILABLE_SERVICES,
  CURRENT_EMPLOYEE,
  RepeatRule,
  STAFF,
  STATUS_OPTIONS,
  addActivity,
  appointmentRoute,
  formatDate,
  formatEuro,
  formatEuroFixed,
  formatLongDate,
  fromMinutes,
  repeatSummary,
  servicesDuration,
  servicesTotal,
  toMinutes,
  updateAppointment,
  useAppointment,
  weekdayOf,
} from "@/components/appointment/appointmentData";

const STATUS_STYLE: Record<AppointmentStatus | "Paid", { bg: string; text: string }> = {
  Booked: { bg: colors.primarySoft, text: colors.primary },
  Confirmed: { bg: colors.tealSoft, text: colors.teal },
  Arrived: { bg: colors.yellowSoft, text: "#C29A12" },
  Started: { bg: colors.borderLight, text: colors.blue },
  "No-show": { bg: colors.pinkSoft, text: colors.pink },
  Completed: { bg: "#E6F8EC", text: colors.green },
  Cancelled: { bg: colors.subtleAlt, text: colors.textSecondary },
  Paid: { bg: "#E6F8EC", text: colors.green },
};

const STATUS_ACTIVITY: Partial<Record<AppointmentStatus, string>> = {
  Booked: "Appointment Booked",
  Confirmed: "Appointment Confirmed",
  Arrived: "Client Arrived",
  Started: "Appointment Started",
  "No-show": "Marked as No-show",
};

// Ring colours of the "Appointment Activity" timeline (Figma 1:25423).
const activityColor = (label: string) => {
  if (label === "Paid") return colors.green;
  if (label.includes("Receipt")) return "#46C8EC";
  if (label.includes("Started")) return colors.textSecondary;
  if (label.includes("Confirmed") || label.includes("Arrived")) return colors.teal;
  if (label.includes("Cancel") || label.includes("No-show")) return colors.pink;
  return colors.primary;
};

type DialogKind = "note" | "cancel" | "repeating" | null;

/** Figma 1:25423 (status dropdown) · 1:30368 (note edit + ⋮ menu) · 1:26594 · 1:25627 · 1:25926/1:26361 */
export default function ViewAppointmentScreen() {
  const router = useRouter();
  const { id, open } = useLocalSearchParams<{ id: string; open?: string }>();
  const insets = useSafeAreaInsets();
  const appt = useAppointment(id);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(
    open === "cancel" || open === "repeating" || open === "note" ? open : null
  );
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [employeeForService, setEmployeeForService] = useState<string | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const hideToast = useCallback(() => setToast(null), []);

  // Pick up confirmations queued by sub-screens (reschedule, checkout, …)
  useFocusEffect(
    useCallback(() => {
      const queued = takeQueuedToast();
      if (queued) setToast(queued);
    }, [])
  );

  const isPaid = !!appt.payment;
  const isCancelled = appt.status === "Cancelled";
  const isLocked = isPaid || isCancelled;
  const total = servicesTotal(appt.services);
  const statusKey = isPaid ? "Paid" : appt.status;
  const statusStyle = STATUS_STYLE[statusKey];
  const go = (sub: string) => router.push(appointmentRoute(appt.id, sub) as any);

  const changeStatus = (status: AppointmentStatus) => {
    if (status === appt.status) return;
    updateAppointment(appt.id, (a) => ({
      ...a,
      status,
      activity: STATUS_ACTIVITY[status] ? addActivity(a, STATUS_ACTIVITY[status]!) : a.activity,
    }));
    setToast({ type: "success", title: "Status updated", message: `Appointment marked as ${status}.` });
  };

  const saveNote = (note: string) => {
    updateAppointment(appt.id, (a) => ({ ...a, note }));
    setIsEditingNote(false);
    setDialog(null);
    setToast({ type: "success", title: "Note saved" });
  };

  const saveRepeating = (rule: RepeatRule) => {
    updateAppointment(appt.id, (a) => ({ ...a, repeating: rule, activity: addActivity(a, "Set as Repeating") }));
    setDialog(null);
    setToast({ type: "success", title: "Repetition saved", message: repeatSummary(rule) });
  };

  const cancelAppointment = (reason: string) => {
    updateAppointment(appt.id, (a) => ({
      ...a,
      status: "Cancelled",
      cancelReason: reason,
      activity: addActivity(a, "Appointment Cancelled"),
    }));
    setDialog(null);
    setToast({ type: "info", title: "Appointment cancelled", message: reason });
  };

  const addService = (name: string) => {
    const tpl = AVAILABLE_SERVICES.find((s) => s.name === name);
    if (!tpl) return;
    updateAppointment(appt.id, (a) => {
      const last = a.services[a.services.length - 1];
      const start = last ? toMinutes(last.startTime) + last.duration : toMinutes(a.startTime);
      const services = [
        ...a.services,
        {
          id: `s${Date.now()}`,
          name: tpl.name,
          price: tpl.price,
          duration: tpl.duration,
          startTime: fromMinutes(start),
          employeeId: CURRENT_EMPLOYEE.id,
        },
      ];
      return { ...a, services, endTime: fromMinutes(start + tpl.duration) };
    });
    setIsAddServiceOpen(false);
  };

  const removeService = (serviceId: string) => {
    if (appt.services.length <= 1) {
      Alert.alert("Cannot remove", "An appointment must contain at least one service.");
      return;
    }
    updateAppointment(appt.id, (a) => {
      const services = a.services.filter((s) => s.id !== serviceId);
      return { ...a, services, endTime: fromMinutes(toMinutes(a.startTime) + servicesDuration(services)) };
    });
  };

  const assignEmployee = (employeeId: string) => {
    if (!employeeForService) return;
    updateAppointment(appt.id, (a) => ({
      ...a,
      services: a.services.map((s) => (s.id === employeeForService ? { ...s, employeeId } : s)),
    }));
  };

  const activeService = appt.services.find((s) => s.id === employeeForService);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <AppointmentHeader title="View Appointment" />
      <StatusToast toast={toast} onHide={hideToast} top={Math.max(insets.top, 16) + 70} />

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* Title-bar actions */}
        {!isLocked && (
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.rescheduleBtn} onPress={() => go("reschedule")} activeOpacity={0.8}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelApptBtn} onPress={() => setDialog("cancel")} activeOpacity={0.8}>
              <Text style={styles.cancelApptText}>Cancel Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {isCancelled && (
          <View style={styles.cancelledBanner}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.pink} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cancelledTitle}>This appointment has been cancelled</Text>
              {appt.cancelReason ? <Text style={styles.cancelledSub}>Reason: {appt.cancelReason}</Text> : null}
            </View>
          </View>
        )}

        {/* Basic Informations */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Basic Informations</Text>
            <Text style={styles.cardTitle}>{appt.code}</Text>
          </View>

          <Text style={styles.fieldLabel}>Client</Text>
          <View style={styles.clientBox}>
            <SquareAvatar uri={appt.client.avatar} size={56} />
            <View style={{ flex: 1 }}>
              <Text style={styles.clientName} numberOfLines={1}>
                {appt.client.name}
              </Text>
              <Text style={styles.clientEmail} numberOfLines={1}>
                {appt.client.email}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.viewProfileBtn}
              onPress={() => router.push(`/(drawer)/(tabs)/clients/${appt.client.id}` as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldValue}>{formatDate(appt.date)}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Time</Text>
              <Text style={styles.fieldValue}>
                {appt.startTime} - {appt.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Status</Text>
              <DropdownMenu
                items={STATUS_OPTIONS.map((s) => ({
                  label: s,
                  selected: s === appt.status,
                  onPress: () => changeStatus(s),
                }))}
                renderTrigger={(openMenu) => (
                  <TouchableOpacity
                    style={[styles.statusBtn, { backgroundColor: statusStyle.bg }]}
                    onPress={openMenu}
                    disabled={isLocked}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusKey}</Text>
                    {!isLocked && <Ionicons name="chevron-down" size={16} color={statusStyle.text} />}
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>Repeating</Text>
              <TouchableOpacity
                style={[styles.repeatingBtn, appt.repeating && styles.repeatingBtnSet]}
                onPress={() => setDialog("repeating")}
                disabled={isCancelled}
                activeOpacity={0.7}
              >
                <Text style={[styles.repeatingText, appt.repeating && { color: colors.green }]} numberOfLines={1}>
                  {appt.repeating ? repeatSummary(appt.repeating) : "Set as Repeating"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appointment Activity */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 20 }]}>Appointment Activity</Text>
          {appt.activity.map((item, idx) => {
            const isLast = idx === appt.activity.length - 1;
            const isReceipt = item.label.includes("Receipt") && isPaid;
            const content = (
              <>
                <View style={styles.timelineTime}>
                  <Text style={styles.timelineDate}>{formatLongDate(item.date)}</Text>
                  <Text style={styles.timelineAt}>at {item.time}</Text>
                </View>
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineDot, { borderColor: activityColor(item.label) }]} />
                  {!isLast && <View style={styles.timelineLine} />}
                </View>
                <Text style={styles.timelineLabel}>{item.label}</Text>
              </>
            );
            return isReceipt ? (
              <TouchableOpacity key={item.id} style={styles.timelineItem} onPress={() => go("receipt")}>
                {content}
              </TouchableOpacity>
            ) : (
              <View key={item.id} style={styles.timelineItem}>
                {content}
              </View>
            );
          })}
        </View>

        {/* Note */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Note</Text>
            {!isEditingNote && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => {
                  setNoteDraft(appt.note);
                  setIsEditingNote(true);
                }}
                activeOpacity={0.7}
                accessibilityLabel="Edit note"
              >
                <Ionicons name="pencil-outline" size={16} color={colors.teal} />
              </TouchableOpacity>
            )}
          </View>
          {isEditingNote ? (
            <View style={{ gap: 20 }}>
              <TextInput
                style={styles.noteInput}
                multiline
                autoFocus
                value={noteDraft}
                onChangeText={setNoteDraft}
                placeholder="Add a note"
                placeholderTextColor={colors.textMuted}
              />
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => saveNote(noteDraft.trim())}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.noteText, !appt.note && { color: colors.textMuted }]}>
              {appt.note || "No note added yet."}
            </Text>
          )}
        </View>

        {/* Services */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 20 }]}>Services</Text>
          <View style={{ gap: 12 }}>
            {appt.services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                date={appt.date}
                onPressEmployee={isLocked ? undefined : () => setEmployeeForService(s.id)}
                onRemove={isLocked || appt.services.length <= 1 ? undefined : () => removeService(s.id)}
              />
            ))}
          </View>

          {!isLocked && (
            <View style={styles.addServiceRow}>
              <TouchableOpacity
                style={styles.addServiceBtn}
                onPress={() => setIsAddServiceOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={styles.addServiceText}>Add Service</Text>
              </TouchableOpacity>
              <View style={styles.totalTime}>
                <Text style={styles.totalTimeLabel}>Total Time</Text>
                <View style={styles.totalTimePill}>
                  <Text style={styles.totalTimeText}>{servicesDuration(appt.services)} min</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatEuro(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer (Back · ⋮ · Checkout) */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 10, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.footerRight}>
          {!isLocked && (
            <PopoverMenu
              items={[
                { label: "Add a Note", onPress: () => setDialog("note") },
                { label: "No-show", onPress: () => changeStatus("No-show") },
              ]}
            />
          )}
          {isPaid ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => go("receipt")} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>View Receipt</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryBtn, isCancelled && styles.primaryBtnDisabled]}
              onPress={() => go("checkout")}
              disabled={isCancelled}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryBtnText, isCancelled && { color: colors.textMuted }]}>Checkout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dialogs */}
      <AddNoteSheet visible={dialog === "note"} onClose={() => setDialog(null)} onSave={saveNote} />
      <CancelAppointmentDialog
        visible={dialog === "cancel"}
        onClose={() => setDialog(null)}
        onSave={cancelAppointment}
      />
      <RepeatingDialog
        visible={dialog === "repeating"}
        initial={appt.repeating}
        defaultDay={weekdayOf(appt.date)}
        onClose={() => setDialog(null)}
        onSave={saveRepeating}
      />

      <OptionSheet
        visible={!!employeeForService}
        title="Employee"
        options={STAFF.map((s) => ({
          value: s.id,
          label: s.name,
          avatar: s.avatar,
          subtitle: s.id === CURRENT_EMPLOYEE.id ? "You" : undefined,
        }))}
        selected={activeService?.employeeId}
        onSelect={assignEmployee}
        onClose={() => setEmployeeForService(null)}
      />

      <CustomBottomSheet visible={isAddServiceOpen} onClose={() => setIsAddServiceOpen(false)} title="Add Service">
        <View style={{ gap: 8 }}>
          {AVAILABLE_SERVICES.map((s) => (
            <TouchableOpacity
              key={s.name}
              style={styles.serviceOption}
              onPress={() => addService(s.name)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceOptionName}>{s.name}</Text>
                <Text style={styles.serviceOptionSub}>{s.duration} min</Text>
              </View>
              <Text style={styles.serviceOptionPrice}>{formatEuroFixed(s.price)}</Text>
              <Ionicons name="add-circle" size={22} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  topActions: {
    flexDirection: "row",
    gap: 12,
  },
  rescheduleBtn: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.tealSoft,
  },
  rescheduleText: {
    ...typography.button,
    color: colors.teal,
  },
  cancelApptBtn: {
    flex: 1.4,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.pinkSoft,
  },
  cancelApptText: {
    ...typography.button,
    color: colors.pink,
  },
  cancelledBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: radius.card,
    backgroundColor: colors.pinkSoft,
  },
  cancelledTitle: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.pink,
  },
  cancelledSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  clientBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: radius.card,
    backgroundColor: colors.subtleAlt,
    marginTop: 8,
    marginBottom: 20,
  },
  clientName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  clientEmail: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  viewProfileBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  viewProfileText: {
    ...typography.button,
    lineHeight: 20,
    color: colors.primary,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  gridCol: {
    flex: 1,
  },
  statusBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 16,
  },
  statusText: {
    ...typography.button,
    lineHeight: 20,
  },
  repeatingBtn: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    justifyContent: "center",
    backgroundColor: colors.subtleAlt,
    paddingHorizontal: 16,
    height: 32,
    borderRadius: radius.md,
  },
  repeatingBtnSet: {
    backgroundColor: "#E6F8EC",
  },
  repeatingText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 56,
  },
  timelineTime: {
    width: 104,
  },
  timelineDate: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  timelineAt: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  timelineRail: {
    width: 28,
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: 3,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: colors.white,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.border,
  },
  timelineLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  iconBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  noteInput: {
    minHeight: 152,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlignVertical: "top",
  },
  outlineBtn: {
    alignSelf: "flex-end",
    height: 36,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineBtnText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  addServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  addServiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: radius.md,
  },
  addServiceText: {
    ...typography.button,
    color: colors.primary,
  },
  totalTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  totalTimeLabel: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  totalTimePill: {
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  totalTimeText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.teal,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    ...shadows.card,
  },
  backBtn: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
  },
  backBtnText: {
    ...typography.button,
    color: colors.textDark,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.subtleAlt,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceOptionName: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  serviceOptionSub: {
    ...typography.caption,
    marginTop: 1,
  },
  serviceOptionPrice: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
