import { Redirect } from "expo-router";

/**
 * The Figma "Team Members" frames (1:22124 / 1:22817 / 1:22453) are the appointments
 * Table View, so this legacy route forwards there.
 */
export default function TeamCalendarScreen() {
  return <Redirect href={"/(drawer)/(tabs)/calendar/appointments" as any} />;
}
