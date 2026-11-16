import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarPageHeader from "@/components/calendar/CalendarPageHeader";
import CustomSwitch from "@/components/ui/CustomSwitch";
import { FigmaCheckbox, OptionPicker, SelectField, ui } from "@/components/calendar/ui";
import { colors, fonts } from "@/constants/figmaTheme";

type SettingsTab = "general" | "notifications";

interface CalendarSettings {
  language: string;
  country: string;
  dateFormat: string;
  timeFormat: string;
  showSecondaryTimeZone: boolean;
  mainTimeZone: string;
  secondaryTimeZone: string;
  updateFromLocation: boolean;
  defaultDuration: string;
  showWeekends: boolean;
  showCancelled: boolean;
  showCompleted: boolean;
  weekendStart: string;
  remind24h: boolean;
  remind2h: boolean;
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  newBookingAlert: boolean;
  cancellationAlert: boolean;
  rescheduleAlert: boolean;
}

// Persist across visits for the session (mock only, no backend).
let savedSettings: CalendarSettings = {
  language: "English (US)",
  country: "United States",
  dateFormat: "12/31/2025",
  timeFormat: "1:00 PM",
  showSecondaryTimeZone: false,
  mainTimeZone: "English (US)",
  secondaryTimeZone: "None",
  updateFromLocation: true,
  defaultDuration: "15 minutes",
  showWeekends: true,
  showCancelled: true,
  showCompleted: true,
  weekendStart: "Sunday",
  remind24h: true,
  remind2h: true,
  sms: true,
  email: true,
  whatsapp: false,
  newBookingAlert: true,
  cancellationAlert: true,
  rescheduleAlert: true,
};

const TIME_ZONES = [
  "English (US)",
  "(GMT-08:00) Pacific Time - Los Angeles",
  "(GMT-05:00) Eastern Time - New York",
  "(GMT+00:00) Greenwich Mean Time - London",
  "(GMT+01:00) Central European Time - Rome",
  "(GMT+02:00) Eastern European Time - Athens",
  "(GMT+04:00) Gulf Standard Time - Dubai",
];

type PickerKey = "language" | "country" | "dateFormat" | "timeFormat" | "mainTimeZone" | "secondaryTimeZone" | "defaultDuration" | "weekendStart";

const PICKERS: Record<PickerKey, { title: string; options: string[] }> = {
  language: { title: "Language", options: ["English (US)", "English (UK)", "Italiano", "Español", "Français", "Deutsch"] },
  country: { title: "Country", options: ["United States", "United Kingdom", "Italy", "Spain", "France", "Germany"] },
  dateFormat: { title: "Date Format", options: ["12/31/2025", "31/12/2025", "2025-12-31"] },
  timeFormat: { title: "Time Format", options: ["1:00 PM", "13:00"] },
  mainTimeZone: { title: "Main Time Zone", options: TIME_ZONES },
  secondaryTimeZone: { title: "Secondary Time Zone", options: ["None", ...TIME_ZONES.slice(1)] },
  defaultDuration: { title: "Default Duration", options: ["15 minutes", "30 minutes", "45 minutes", "60 minutes", "90 minutes"] },
  weekendStart: { title: "Start of the weekend", options: ["Saturday", "Sunday", "Monday"] },
};

/** Calendar > Settings — Figma 1:23265 (General Settings) + "Notifications & Communication" from the 3-dot Settings menu. */
export default function CalendarSettingsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const tab: SettingsTab = params.tab === "notifications" ? "notifications" : "general";
  const [s, setS] = useState<CalendarSettings>(savedSettings);
  const [picker, setPicker] = useState<PickerKey | null>(null);

  const set = <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    savedSettings = s;
    Alert.alert("Settings Saved", "Your calendar settings have been updated.", [
      { text: "OK", onPress: () => (router.canGoBack() ? router.back() : undefined) },
    ]);
  };

  const title = tab === "general" ? "General Settings" : "Notifications & Communication";
  const select = (key: PickerKey, label: string, disabled?: boolean) => (
    <SelectField
      style={styles.field}
      label={label}
      required
      value={s[key]}
      disabled={disabled}
      onPress={() => setPicker(key)}
    />
  );

  return (
    <View style={styles.container}>
      <CalendarPageHeader title={title}>
        <View style={styles.tabsRow}>
          <View style={styles.tab}>
            <Text style={styles.tabText} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.tabIndicator} />
          </View>
        </View>
      </CalendarPageHeader>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "general" ? (
          <>
            <View style={ui.card}>
              <Text style={styles.cardTitle}>Language and Region</Text>
              {select("language", "Language")}
              {select("country", "Country")}
              {select("dateFormat", "Date Format")}
              {select("timeFormat", "Time Format")}
            </View>

            <View style={ui.card}>
              <Text style={styles.cardTitle}>Time Zone</Text>
              <FigmaCheckbox
                label="Display secondary time zone"
                checked={s.showSecondaryTimeZone}
                onPress={() => set("showSecondaryTimeZone", !s.showSecondaryTimeZone)}
              />
              {select("mainTimeZone", "Main Time Zone")}
              {select("secondaryTimeZone", "Secondary Time Zone", !s.showSecondaryTimeZone)}
              <View style={{ height: 14 }} />
              <FigmaCheckbox
                label="Request to update primary time zone based on current location"
                checked={s.updateFromLocation}
                onPress={() => set("updateFromLocation", !s.updateFromLocation)}
              />
            </View>

            <View style={ui.card}>
              <Text style={styles.cardTitle}>Events</Text>
              {select("defaultDuration", "Default Duration")}
            </View>

            <View style={ui.card}>
              <Text style={styles.cardTitle}>Events</Text>
              <View style={{ gap: 18 }}>
                <FigmaCheckbox label="Show weekends" checked={s.showWeekends} onPress={() => set("showWeekends", !s.showWeekends)} />
                <FigmaCheckbox
                  label="Show cancelled events"
                  checked={s.showCancelled}
                  onPress={() => set("showCancelled", !s.showCancelled)}
                />
                <FigmaCheckbox
                  label="Show completed events"
                  checked={s.showCompleted}
                  onPress={() => set("showCompleted", !s.showCompleted)}
                />
              </View>
              {select("weekendStart", "Start of the weekend")}
            </View>
          </>
        ) : (
          <>
            <View style={ui.card}>
              <Text style={styles.cardTitle}>Client Reminders</Text>
              <SwitchRow
                label="24 Hours Before"
                sub="Send an automated appointment reminder"
                value={s.remind24h}
                onChange={(v) => set("remind24h", v)}
              />
              <View style={styles.divider} />
              <SwitchRow
                label="2 Hours Before"
                sub="Final day-of-service reminder"
                value={s.remind2h}
                onChange={(v) => set("remind2h", v)}
              />
              <View style={styles.divider} />
              <Text style={styles.subLabel}>Delivery Channels</Text>
              <View style={{ gap: 14 }}>
                <FigmaCheckbox label="SMS" checked={s.sms} onPress={() => set("sms", !s.sms)} />
                <FigmaCheckbox label="Email" checked={s.email} onPress={() => set("email", !s.email)} />
                <FigmaCheckbox label="WhatsApp" checked={s.whatsapp} onPress={() => set("whatsapp", !s.whatsapp)} />
              </View>
            </View>

            <View style={ui.card}>
              <Text style={styles.cardTitle}>My Alerts</Text>
              <SwitchRow
                label="New Booking Alert"
                sub="Notify me when an appointment is booked with me"
                value={s.newBookingAlert}
                onChange={(v) => set("newBookingAlert", v)}
              />
              <View style={styles.divider} />
              <SwitchRow
                label="Cancellation Alert"
                sub="Instant alert if a client cancels"
                value={s.cancellationAlert}
                onChange={(v) => set("cancellationAlert", v)}
              />
              <View style={styles.divider} />
              <SwitchRow
                label="Reschedule Alert"
                sub="Notify me when an appointment is moved"
                value={s.rescheduleAlert}
                onChange={(v) => set("rescheduleAlert", v)}
              />
            </View>
          </>
        )}

        <View style={styles.saveRow}>
          <TouchableOpacity style={ui.smallPrimaryBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={ui.smallPrimaryBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {picker && (
        <OptionPicker
          visible
          title={PICKERS[picker].title}
          options={PICKERS[picker].options}
          value={s[picker]}
          onSelect={(v) => set(picker, v)}
          onClose={() => setPicker(null)}
        />
      )}
    </View>
  );
}

function SwitchRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Text style={styles.switchSub}>{sub}</Text>
      </View>
      <CustomSwitch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  tabsRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  tab: {
    paddingHorizontal: 16,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: 17,
    color: colors.primary,
    paddingBottom: 12,
  },
  tabIndicator: {
    height: 1.5,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  cardTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
    marginBottom: 14,
  },
  field: {
    marginTop: 12,
  },
  subLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  switchSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
