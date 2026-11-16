import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { appointmentRoute, resolveAppointmentId } from "@/components/appointment/appointmentData";

/**
 * Figma 1:25627 – "Set as Repeating" is a dialog over View Appointment.
 * This route is kept for deep links and simply opens View Appointment with that dialog showing.
 */
export default function RepeatingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`${appointmentRoute(resolveAppointmentId(id))}?open=repeating` as any} />;
}
