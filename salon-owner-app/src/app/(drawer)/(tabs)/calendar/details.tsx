import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import {
  useAppointmentsStore,
  updateAppointmentInStore,
  deleteAppointmentFromStore,
  staffList,
  availableServices,
} from "@/components/appointment/data";
import { CalAppointment } from "@/components/appointment/types";

export default function AppointmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const statusBarHeight = isAndroid ? (StatusBar.currentHeight || 28) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight) + 10;
  const safeBottom = Math.max(insets.bottom, isAndroid ? 48 : 20) + 16;

  const [appointments] = useAppointmentsStore();
  const appt =
    appointments.find((a) => a.id === id) ||
    appointments[0] ||
    ({
      id: "appt-1",
      staffId: "st1",
      clientName: "Maria Fernandez",
      clientPhone: "+34 612 345 678",
      clientAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      service: "Haircut",
      startTime: "11:00",
      endTime: "11:15",
      duration: "15 min",
      price: "€ 170",
      status: "Booked",
      paymentStatus: "Paid",
      date: "2025-08-02",
      notes: "",
    } as CalAppointment);

  const [status, setStatus] = useState(appt.status || "Booked");
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const kebabRef = useRef<View>(null);
  const [menuPosition, setMenuPosition] = useState({
    top: safeTop + 60,
    right: 16,
  });

  const handleOpenMenu = () => {
    if (kebabRef.current && (kebabRef.current as any).measureInWindow) {
      (kebabRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (y && height) {
            setMenuPosition({
              top: y + height + 6,
              right: 16,
            });
          }
          setIsActionMenuOpen(true);
        }
      );
    } else {
      setMenuPosition({
        top: safeTop + 60,
        right: 16,
      });
      setIsActionMenuOpen(true);
    }
  };

  const [note, setNote] = useState(
    appt.notes ||
      "Client prefers organic shampoo and light layers on the sides."
  );
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteInputValue, setNoteInputValue] = useState(note);

  const statuses = [
    "Booked",
    "Confirmed",
    "Arrived",
    "Started",
    "Completed",
    "Canceled",
  ] as const;

  const staff =
    staffList.find((s) => s.id === appt.staffId) || staffList[0];

  const handleStatusChange = (newStatus: any) => {
    setStatus(newStatus);
    setIsStatusModalVisible(false);
    updateAppointmentInStore({
      ...appt,
      status: newStatus,
    });
  };

  const handleSaveNote = () => {
    setNote(noteInputValue);
    setIsEditingNote(false);
    updateAppointmentInStore({
      ...appt,
      notes: noteInputValue,
    });
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            handleStatusChange("Canceled");
          },
        },
      ]
    );
  };

  const handleDeleteAppointment = () => {
    setIsActionMenuOpen(false);
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAppointmentFromStore(appt.id);
            router.back();
          },
        },
      ]
    );
  };

  const getStatusStyle = (currentStatus: string) => {
    switch (currentStatus) {
      case "Booked":
        return { bg: "#F0EFFF", text: "#5C55FF" };
      case "Confirmed":
        return { bg: "#EBFDF5", text: "#10B981" };
      case "Arrived":
        return { bg: "#FFFBEB", text: "#F59E0B" };
      case "Started":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "Completed":
        return { bg: "#EBFDF5", text: "#10B981" };
      case "Canceled":
        return { bg: "#FEF2F2", text: "#EF4444" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const activeStatusStyle = getStatusStyle(status);

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
          <Text style={styles.backBtnText}>View Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          ref={kebabRef}
          style={styles.topKebabBtn}
          onPress={handleOpenMenu}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Basic Informations Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Basic Informations</Text>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>
                #{appt.id ? appt.id.replace("appt-", "").padStart(3, "0") : "001"}
              </Text>
            </View>
          </View>

          <Text style={styles.fieldSectionLabel}>Client</Text>
          <View style={styles.clientProfileBox}>
            <Avatar
              name={appt.clientName}
              uri={appt.clientAvatar}
              size={48}
            />
            <View style={styles.clientInfoCol}>
              <Text style={styles.clientNameText}>{appt.clientName}</Text>
              <Text style={styles.clientEmailText}>
                {appt.clientPhone || "maria@gmail.com"}
              </Text>
            </View>
            <TouchableOpacity style={styles.viewProfileBtn} activeOpacity={0.7}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Details Row: Booking Order & Status */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Booking Order</Text>
              <Text style={styles.colVal}>{appt.date || "2025-08-02"}</Text>
            </View>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Status</Text>
              <TouchableOpacity
                style={[
                  styles.statusDropdownPill,
                  { backgroundColor: activeStatusStyle.bg },
                ]}
                onPress={() => setIsStatusModalVisible(true)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: activeStatusStyle.text },
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: activeStatusStyle.text },
                  ]}
                >
                  {status}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={activeStatusStyle.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Details Row: Time and Channel */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Time</Text>
              <Text style={styles.colVal}>
                {appt.startTime} - {appt.endTime}
              </Text>
            </View>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Channel</Text>
              <Text style={styles.colVal}>Online Booking</Text>
            </View>
          </View>

          {/* Details Row: Payment Status & Method */}
          <View style={styles.twoColRow}>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Payment Status</Text>
              <View
                style={[
                  styles.badgePill,
                  appt.paymentStatus === "Paid"
                    ? styles.badgePaid
                    : styles.badgeUnpaid,
                ]}
              >
                <Text
                  style={[
                    styles.badgePillText,
                    appt.paymentStatus === "Paid"
                      ? styles.badgePaidText
                      : styles.badgeUnpaidText,
                  ]}
                >
                  {appt.paymentStatus || "Unpaid"}
                </Text>
              </View>
            </View>
            <View style={styles.colItem}>
              <Text style={styles.colLabel}>Payment Method</Text>
              <Text style={styles.colVal}>Online (Credit Card)</Text>
            </View>
          </View>
        </View>

        {/* 2. Client Notes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Client Notes</Text>
            {!isEditingNote && (
              <TouchableOpacity
                onPress={() => setIsEditingNote(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.editNoteBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingNote ? (
            <View style={styles.editNoteContainer}>
              <TextInput
                style={styles.noteTextInput}
                multiline
                numberOfLines={3}
                value={noteInputValue}
                onChangeText={setNoteInputValue}
                placeholder="Add client notes or preferences..."
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.noteButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelNoteBtn}
                  onPress={() => {
                    setNoteInputValue(note);
                    setIsEditingNote(false);
                  }}
                >
                  <Text style={styles.cancelNoteBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveNoteBtn}
                  onPress={handleSaveNote}
                >
                  <Text style={styles.saveNoteBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noteBodyText}>
              {note || "No client notes added yet."}
            </Text>
          )}
        </View>

        {/* 3. Services Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Services</Text>
            <View style={styles.servicesHeaderRight}>
              <View style={styles.servicesCountBadge}>
                <Text style={styles.servicesCountBadgeText}>
                  1 Service
                </Text>
              </View>
            </View>
          </View>

          {/* Service Item Row */}
          <View style={styles.serviceItemCard}>
            <View style={styles.serviceItemTopRow}>
              <View style={styles.serviceItemMainCol}>
                <Text style={styles.serviceItemName}>{appt.service}</Text>
                <Text style={styles.serviceItemDesc}>
                  Standard professional salon service
                </Text>
              </View>
              <Text style={styles.serviceItemPrice}>{appt.price}</Text>
            </View>

            <View style={styles.serviceMetaRow}>
              <View style={styles.serviceMetaCol}>
                <Text style={styles.serviceMetaLabel}>Time</Text>
                <Text style={styles.serviceMetaVal}>
                  {appt.startTime} - {appt.endTime}
                </Text>
              </View>
              <View style={styles.serviceMetaCol}>
                <Text style={styles.serviceMetaLabel}>Duration</Text>
                <Text style={styles.serviceMetaVal}>
                  {appt.duration || "15 min"}
                </Text>
              </View>
              <View style={styles.serviceMetaCol}>
                <Text style={styles.serviceMetaLabel}>Category</Text>
                <Text style={styles.serviceMetaVal}>Hair Treatments</Text>
              </View>
            </View>

            {/* Service Assigned Employee */}
            <View style={styles.serviceEmployeeRow}>
              <Text style={styles.serviceEmployeeLabel}>Employee</Text>
              <View style={styles.employeeBadgePill}>
                <Avatar name={staff.name} uri={staff.avatar} size={20} />
                <Text style={styles.employeeNamePill}>{staff.name}</Text>
              </View>
            </View>
          </View>

          {/* Cancel and Edit buttons */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={handleCancelAppointment}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSecondaryText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() =>
                router.push({
                  pathname: "/calendar/form",
                  params: { mode: "edit", id: appt.id },
                })
              }
              activeOpacity={0.7}
            >
              <Text style={styles.btnPrimaryText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Services Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{appt.price}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: safeBottom },
        ]}
      >
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => {
            Alert.alert(
              "Checkout",
              `Process checkout of ${appt.price} for ${appt.clientName}?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Confirm Checkout",
                  onPress: () => {
                    updateAppointmentInStore({
                      ...appt,
                      paymentStatus: "Paid",
                      status: "Completed",
                    });
                    setStatus("Completed");
                    Alert.alert(
                      "Success",
                      "Appointment completed and marked as paid!"
                    );
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Status Picker Modal */}
      <Modal
        visible={isStatusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsStatusModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsStatusModalVisible(false)}
        >
          <View style={styles.statusModalBox}>
            <Text style={styles.statusModalTitle}>Update Status</Text>
            {statuses.map((item) => {
              const sStyle = getStatusStyle(item);
              const isSelected = item === status;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.statusOptionItem,
                    isSelected && styles.statusOptionItemSelected,
                  ]}
                  onPress={() => handleStatusChange(item)}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: sStyle.text },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      isSelected && { color: "#5C55FF", fontFamily: "Manrope_700Bold" },
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#5C55FF"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3-Dot Action Menu Dropdown (Anchored directly below 3-dot button) */}
      <Modal
        visible={isActionMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsActionMenuOpen(false)}
        >
          <View
            style={[
              styles.actionMenuDropdown,
              { top: menuPosition.top, right: menuPosition.right },
            ]}
          >
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setIsActionMenuOpen(false);
                router.push({
                  pathname: "/calendar/form",
                  params: { mode: "edit", id: appt.id },
                });
              }}
            >
              <Ionicons name="create-outline" size={17} color="#374151" />
              <Text style={styles.actionMenuItemText}>Edit Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setIsActionMenuOpen(false);
                router.push({
                  pathname: "/calendar/form",
                  params: { mode: "edit", id: appt.id },
                });
              }}
            >
              <Ionicons name="calendar-outline" size={17} color="#374151" />
              <Text style={styles.actionMenuItemText}>Reschedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setIsActionMenuOpen(false);
                handleCancelAppointment();
              }}
            >
              <Ionicons name="close-circle-outline" size={17} color="#EF4444" />
              <Text style={[styles.actionMenuItemText, { color: "#EF4444" }]}>
                Cancel Appointment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionMenuItem, styles.actionMenuItemLast]}
              onPress={handleDeleteAppointment}
            >
              <Ionicons name="trash-outline" size={17} color="#EF4444" />
              <Text style={[styles.actionMenuItemText, { color: "#EF4444" }]}>
                Delete Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF4FA",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  backBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  topKebabBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FA",
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 30,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#111827",
  },
  idBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idBadgeText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#4B5563",
  },
  fieldSectionLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  clientProfileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  clientInfoCol: {
    flex: 1,
    marginLeft: 10,
  },
  clientNameText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#111827",
  },
  clientEmailText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: 1,
  },
  viewProfileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  viewProfileText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#374151",
  },
  twoColRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colItem: {
    flex: 1,
  },
  colLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#6B7280",
    marginBottom: 3,
  },
  colVal: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#1F2937",
  },
  statusDropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11.5,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgePaid: {
    backgroundColor: "#EBFDF5",
  },
  badgePaidText: {
    color: "#10B981",
  },
  badgeUnpaid: {
    backgroundColor: "#FEF2F2",
  },
  badgeUnpaidText: {
    color: "#EF4444",
  },
  badgePillText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
  },
  editNoteBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#5C55FF",
  },
  noteBodyText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  editNoteContainer: {
    gap: 8,
  },
  noteTextInput: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    minHeight: 60,
  },
  noteButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelNoteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelNoteBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#6B7280",
  },
  saveNoteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#5C55FF",
  },
  saveNoteBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  servicesHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  servicesCountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  servicesCountBadgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#4B5563",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingBottom: 10,
  },
  btnSecondary: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E6EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  btnSecondaryText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#4B5563",
  },
  btnPrimary: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#5C55FF",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  serviceItemCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  serviceItemTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceItemMainCol: {
    flex: 1,
    marginRight: 10,
  },
  serviceItemName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#111827",
  },
  serviceItemDesc: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  serviceItemPrice: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#111827",
  },
  serviceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  serviceMetaCol: {
    flex: 1,
  },
  serviceMetaLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10.5,
    color: "#9CA3AF",
  },
  serviceMetaVal: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#4B5563",
    marginTop: 1,
  },
  serviceEmployeeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  serviceEmployeeLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
  },
  employeeBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  employeeNamePill: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#1F2937",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  totalLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  totalValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  bottomActionBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFF4FA",
    zIndex: 100,
    elevation: 10,
  },
  checkoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#5C55FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C55FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusModalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    maxWidth: 320,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  statusModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#111827",
    marginBottom: 8,
  },
  statusOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  statusOptionItemSelected: {
    backgroundColor: "#F4F6FA",
  },
  statusOptionText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  actionMenuDropdown: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 4,
    width: 210,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionMenuItemLast: {
    borderBottomWidth: 0,
  },
  actionMenuItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
});
