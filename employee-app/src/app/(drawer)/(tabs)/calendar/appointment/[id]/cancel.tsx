import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { appointmentRoute, resolveAppointmentId } from "@/components/appointment/appointmentData";

/**
 * Figma 1:25926 / 1:26361 – "Cancel Appointment" is a dialog over View Appointment.
 * This route is kept for deep links and simply opens View Appointment with that dialog showing.
 */
export default function CancelRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`${appointmentRoute(resolveAppointmentId(id))}?open=cancel` as any} />;
}
