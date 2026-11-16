import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import Header from "@/components/Header";
import TabRootInset from "@/components/ui/TabRootInset";
import CalendarSubHeader from "@/components/calendar/CalendarSubHeader";
import CalendarBoard from "@/components/calendar/CalendarBoard";
import CalendarOptionsMenu from "@/components/calendar/CalendarOptionsMenu";
import { Anchor } from "@/components/calendar/ui";
import { CURRENT_EMPLOYEE_ID, staffList, todayISO } from "@/components/calendar/data";
import { colors } from "@/constants/figmaTheme";

/**
 * View Calendar — Figma 1:18786 (day + 3-dot menu), 1:15219 (team dropdown + quick look),
 * 1:16704 (full screen), 1:20263 (week), 1:21876 (month).
 */
export default function CalendarScreen() {
  const [menuAnchor, setMenuAnchor] = useState<Anchor | null>(null);

  return (
    <TabRootInset>
      <View style={styles.container}>
        <Header />
        <CalendarSubHeader
          active="calendar"
          onOpenMenu={setMenuAnchor}
          onAddAppointment={() =>
            router.push({
              pathname: "/(drawer)/(tabs)/calendar/add" as any,
              params: { staffId: CURRENT_EMPLOYEE_ID, date: todayISO(), startTime: "09:00" },
            })
          }
        />
        <CalendarBoard initialStaffIds={staffList.map((s) => s.id)} />
        <CalendarOptionsMenu visible={!!menuAnchor} anchor={menuAnchor} onClose={() => setMenuAnchor(null)} />
      </View>
    </TabRootInset>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
