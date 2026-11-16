import React from "react";
import { Alert, Share } from "react-native";
import { router } from "expo-router";
import CalendarMenuModal from "./CalendarMenuModal";
import { getAppointmentsStore, getStaffById } from "./data";
import { Anchor } from "./ui";

interface Props {
  visible: boolean;
  onClose: () => void;
  anchor?: Anchor | null;
}

function buildCsv(): string {
  const header = "id,date,start_at,end_at,client,service,staff,price,status,note";
  const rows = getAppointmentsStore().map((a) =>
    [
      a.code,
      a.date,
      a.startTime,
      a.endTime,
      a.clientName,
      a.service,
      getStaffById(a.staffId).name,
      a.price,
      a.status,
      (a.notes ?? "").replace(/[\n,]/g, " "),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

/** 3-dot options: Settings (General / Notifications & Communication), Import Appointments, Export Data. */
export default function CalendarOptionsMenu({ visible, onClose, anchor }: Props) {
  const handleExport = () => {
    const count = getAppointmentsStore().length;
    Alert.alert("Export Data", `Export ${count} appointments to CSV format?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Export & Share",
        onPress: () => {
          Share.share({ title: "appointments.csv", message: buildCsv() }).catch(() =>
            Alert.alert("Export failed", "Could not share the exported file.")
          );
        },
      },
    ]);
  };

  return (
    <CalendarMenuModal
      visible={visible}
      onClose={onClose}
      anchor={anchor}
      onOpenSettings={(tab) =>
        router.push({ pathname: "/(drawer)/(tabs)/calendar/settings" as any, params: { tab } })
      }
      onOpenImport={() => router.push("/(drawer)/(tabs)/calendar/import" as any)}
      onExportData={handleExport}
    />
  );
}
