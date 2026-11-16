import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CalAppointment } from "./types";
import { staffList, statusTheme } from "./data";
import Avatar from "@/components/Avatar";

interface Props {
  visible: boolean;
  appointment: CalAppointment | null;
  onClose: () => void;
  onEdit: (appt: CalAppointment) => void;
  onDelete: (appt: CalAppointment) => void;
}

export default function ViewAppointmentModal({
  visible,
  appointment,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!appointment) return null;

  const staff =
    staffList.find((s) => s.id === appointment.staffId) || staffList[0];
  const theme = statusTheme[appointment.status] || statusTheme.Booked;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.dialogCard}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Appointment Details</Text>
              <Text style={styles.subtitle}>
                ID: #{appointment.id.replace("appt-", "").slice(0, 6)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#29343D" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Client Section */}
            <View style={styles.clientCard}>
              <Avatar
                name={appointment.clientName}
                uri={appointment.clientAvatar}
                size={48}
              />
              <View style={styles.clientDetails}>
                <Text style={styles.clientName}>{appointment.clientName}</Text>
                <Text style={styles.clientPhone}>{appointment.clientPhone}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.badgeBg },
                ]}
              >
                <Text style={[styles.statusText, { color: theme.badgeText }]}>
                  {appointment.status}
                </Text>
              </View>
            </View>

            {/* Schedule & Price Row */}
            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Scheduled Date</Text>
                <Text style={styles.infoVal}>{appointment.date}</Text>
                <Text style={styles.infoSub}>
                  {appointment.startTime} - {appointment.endTime}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Price & Payment</Text>
                <Text style={styles.infoPrice}>{appointment.price}</Text>
                <Text
                  style={[
                    styles.infoPaymentStatus,
                    {
                      color:
                        appointment.paymentStatus === "Paid"
                          ? "#16A34A"
                          : appointment.paymentStatus === "Partially Paid"
                          ? "#D97706"
                          : "#DC2626",
                    },
                  ]}
                >
                  • {appointment.paymentStatus || "Unpaid"}
                </Text>
              </View>
            </View>

            {/* Service & Staff Row */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Service & Staff</Text>
              <View style={styles.serviceRow}>
                <View style={styles.serviceIconWrap}>
                  <Ionicons name="cut-outline" size={18} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{appointment.service}</Text>
                  <Text style={styles.serviceDuration}>
                    Duration: {appointment.duration}
                  </Text>
                </View>
              </View>

              <View style={[styles.serviceRow, { marginTop: 8 }]}>
                <Avatar name={staff.name} uri={staff.avatar} size={32} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffRole}>{staff.role}</Text>
                </View>
              </View>
            </View>

            {/* Booking Order Stepper Timeline */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionHeading}>Booking Order</Text>
              <View style={styles.stepperContainer}>
                {/* Step Circles & Connector Line */}
                <View style={styles.stepperRow}>
                  <View style={[styles.stepCircle, styles.stepCircleDone]}>
                    <Text style={styles.stepCircleText}>1</Text>
                  </View>
                  <View style={styles.stepLine} />
                  <View
                    style={[
                      styles.stepCircle,
                      appointment.status === "Started" ||
                      appointment.status === "Completed"
                        ? styles.stepCircleDone
                        : styles.stepCircleActive,
                    ]}
                  >
                    <Text style={styles.stepCircleText}>2</Text>
                  </View>
                  <View style={styles.stepLine} />
                  <View
                    style={[
                      styles.stepCircle,
                      appointment.status === "Completed"
                        ? styles.stepCircleDone
                        : styles.stepCircleInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCircleText,
                        appointment.status !== "Completed" && {
                          color: "#9CA3AF",
                        },
                      ]}
                    >
                      3
                    </Text>
                  </View>
                </View>

                {/* Step Labels */}
                <View style={styles.stepLabelsRow}>
                  <View style={styles.stepLabelCol}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>To Do</Text>
                    </View>
                    <Text style={styles.stepTime}>{appointment.startTime}</Text>
                    <Text style={styles.stepService}>
                      {appointment.service}
                    </Text>
                    <Text style={styles.stepStaff}>{staff.name}</Text>
                  </View>

                  <View style={styles.stepLabelCol}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>
                        {appointment.status === "Started"
                          ? "Doing"
                          : appointment.status === "Completed"
                          ? "Done"
                          : "To Do"}
                      </Text>
                    </View>
                    <Text style={styles.stepTime}>Progress</Text>
                    <Text style={styles.stepService}>Styling</Text>
                    <Text style={styles.stepStaff}>{staff.name}</Text>
                  </View>

                  <View style={styles.stepLabelCol}>
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepBadgeText}>
                        {appointment.status === "Completed"
                          ? "Completed"
                          : "To Do"}
                      </Text>
                    </View>
                    <Text style={styles.stepTime}>{appointment.endTime}</Text>
                    <Text style={styles.stepService}>Finish</Text>
                    <Text style={styles.stepStaff}>{staff.name}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Notes Section */}
            {appointment.notes ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Appointment Note</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{appointment.notes}</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.deleteActionBtn}
              activeOpacity={0.7}
              onPress={() => {
                onClose();
                onDelete(appointment);
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#FF6692" />
              <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>

            <View style={styles.rightFooterBtns}>
              <TouchableOpacity
                style={styles.closeFooterBtn}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <Text style={styles.closeFooterText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editActionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onEdit(appointment);
                }}
              >
                <Ionicons name="pencil" size={15} color="#FFFFFF" />
                <Text style={styles.editActionText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF4FA",
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#29343D",
  },
  subtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
  },
  scrollArea: {
    flexGrow: 0,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  clientDetails: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#1F2937",
  },
  clientPhone: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoVal: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1F2937",
  },
  infoSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  infoPrice: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#635BFF",
  },
  infoPaymentStatus: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    marginTop: 2,
  },
  sectionBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  sectionHeading: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#29343D",
    marginBottom: 10,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  serviceTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  serviceDuration: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  staffName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1F2937",
  },
  staffRole: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  stepperContainer: {
    paddingVertical: 6,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleDone: {
    backgroundColor: "#36C76C",
  },
  stepCircleActive: {
    backgroundColor: "#635BFF",
  },
  stepCircleInactive: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  stepCircleText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  stepLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stepLabelCol: {
    flex: 1,
    alignItems: "center",
  },
  stepBadge: {
    backgroundColor: "#EFF4FA",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    color: "#0A2540",
  },
  stepTime: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
  },
  stepService: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#1F2937",
    marginTop: 2,
    textAlign: "center",
  },
  stepStaff: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 1,
  },
  notesBox: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
  },
  notesText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFF4FA",
  },
  deleteActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF5F7",
  },
  deleteActionText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#FF6692",
  },
  rightFooterBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closeFooterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
  },
  closeFooterText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#29343D",
  },
  editActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  editActionText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#FFFFFF",
  },
});
