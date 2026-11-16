import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CalAppointment } from "@/components/appointment/types";
import {
  staffList,
  availableServices,
  clientList,
  timeToMinutes,
  minutesToTime,
  getAppointmentsStore,
  addAppointmentToStore,
  updateAppointmentInStore,
} from "@/components/appointment/data";
import Avatar from "@/components/Avatar";

export default function AppointmentFormScreen() {
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const statusBarHeight = isAndroid ? (StatusBar.currentHeight || 28) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight) + 10;
  const safeBottom = Math.max(insets.bottom, isAndroid ? 48 : 20) + 16;

  const params = useLocalSearchParams<{
    id?: string;
    mode?: string;
    staffId?: string;
    startTime?: string;
    date?: string;
  }>();

  const mode = params.mode === "edit" ? "edit" : "create";
  const editId = params.id;
  const initialDate = params.date || "2026-02-13";
  const paramStartTime = params.startTime || "09:00";
  const paramStaffId = params.staffId || staffList[0].id;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Client
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  // Step 2: Services & Staff & Timeline
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    availableServices[0].id,
  ]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(paramStaffId);
  const [startTime, setStartTime] = useState(paramStartTime);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);

  // Step 3: Status, Payment, Notes
  const [selectedStatus, setSelectedStatus] = useState<
    "Booked" | "Confirmed" | "Arrived" | "Started" | "Completed" | "Canceled"
  >("Booked");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    "Paid" | "Partially Paid" | "Unpaid"
  >("Unpaid");
  const [notes, setNotes] = useState("");

  // Existing appointment if in edit mode
  const [existingAppt, setExistingAppt] = useState<CalAppointment | null>(null);

  useEffect(() => {
    if (mode === "edit" && editId) {
      const found = getAppointmentsStore().find((a) => a.id === editId);
      if (found) {
        setExistingAppt(found);
        // Find client
        const foundClient = clientList.find(
          (c) =>
            c.name.toLowerCase() === found.clientName.toLowerCase() ||
            c.phone === found.clientPhone
        );
        if (foundClient) {
          setSelectedClientId(foundClient.id);
          setIsAddingNewClient(false);
        } else {
          setSelectedClientId(null);
          setIsAddingNewClient(true);
          setNewClientName(found.clientName);
          setNewClientPhone(found.clientPhone || "");
        }

        // Services
        const srv = availableServices.find(
          (s) => s.name.toLowerCase() === found.service.toLowerCase()
        );
        setSelectedServiceIds(srv ? [srv.id] : [availableServices[0].id]);
        setSelectedStaffId(found.staffId || staffList[0].id);
        setStartTime(found.startTime);
        setSelectedStatus(found.status as any);
        setSelectedPaymentStatus(found.paymentStatus || "Unpaid");
        setNotes(found.notes || "");
      }
    } else {
      setSelectedClientId(clientList[0].id);
      setIsAddingNewClient(false);
      setSelectedServiceIds([availableServices[0].id]);
      setSelectedStaffId(paramStaffId);
      setStartTime(paramStartTime);
      setSelectedStatus("Booked");
      setSelectedPaymentStatus("Unpaid");
      setNotes("");
    }
  }, [mode, editId, paramStaffId, paramStartTime]);

  const selectedClient = clientList.find((c) => c.id === selectedClientId);

  const filteredClients = clientList.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.phone.includes(clientSearchQuery)
  );

  // Total duration
  const totalDurationMins = selectedServiceIds.reduce((acc, sid) => {
    const srv = availableServices.find((s) => s.id === sid);
    return acc + (srv ? srv.duration : 30);
  }, 0);

  const formattedTotalDuration = `${Math.floor(totalDurationMins / 60)}h ${
    totalDurationMins % 60
  }min`;

  // End time
  const startMins = timeToMinutes(startTime);
  const endTime = minutesToTime(startMins + totalDurationMins);

  // Total price
  const totalPriceNum = selectedServiceIds.reduce((acc, sid) => {
    const srv = availableServices.find((s) => s.id === sid);
    return acc + (srv ? srv.priceNum : 30);
  }, 0);

  const primaryServiceName =
    availableServices.find((s) => s.id === selectedServiceIds[0])?.name ||
    "Haircut";

  const assignedStaff =
    staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const toggleService = (srvId: string) => {
    if (selectedServiceIds.includes(srvId)) {
      if (selectedServiceIds.length === 1) {
        Alert.alert("Notice", "At least one service must be selected.");
        return;
      }
      setSelectedServiceIds(selectedServiceIds.filter((id) => id !== srvId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, srvId]);
    }
  };

  const canGoToStep2 =
    mode === "edit"
      ? true
      : isAddingNewClient
      ? newClientName.trim().length > 0
      : selectedClientId !== null;

  const canGoToStep3 =
    mode === "edit" ? true : selectedServiceIds.length > 0;

  const handleFinalSubmit = () => {
    let clientName = "";
    let clientPhone = "";
    let clientAvatar: string | undefined = undefined;

    if (isAddingNewClient) {
      clientName = newClientName.trim();
      clientPhone = newClientPhone.trim() || "+1 555 000 0000";
    } else if (selectedClient) {
      clientName = selectedClient.name;
      clientPhone = selectedClient.phone;
      clientAvatar = selectedClient.avatar;
    } else if (existingAppt) {
      clientName = existingAppt.clientName;
      clientPhone = existingAppt.clientPhone || "";
      clientAvatar = existingAppt.clientAvatar;
    }

    const appt: CalAppointment = {
      id: existingAppt?.id || `appt-${Date.now()}`,
      staffId: selectedStaffId,
      clientName,
      clientAvatar,
      clientPhone,
      service: primaryServiceName,
      startTime,
      endTime,
      duration: formattedTotalDuration,
      price: `€ ${totalPriceNum}`,
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus,
      notes: notes.trim(),
      date: existingAppt?.date || initialDate,
    };

    if (mode === "edit") {
      updateAppointmentInStore(appt);
    } else {
      addAppointmentToStore(appt);
    }

    router.back();
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screenContainer, { paddingTop: safeTop }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBackStep}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitlesCol}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.screenTitle}>
              {mode === "edit" ? "Edit Appointment" : "New Appointment"}
            </Text>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step {currentStep} of 3</Text>
            </View>
          </View>
          <Text style={styles.screenSubtitle}>
            {initialDate} • {startTime} - {endTime}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: currentStep === 1 ? "33.3%" : currentStep === 2 ? "66.6%" : "100%" },
          ]}
        />
      </View>

      {/* Scrollable Body */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1: CLIENT SELECTION */}
        {currentStep === 1 && (
          <View style={styles.stepSection}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>Client Name *</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsAddingNewClient(!isAddingNewClient);
                  if (!isAddingNewClient) {
                    setSelectedClientId(null);
                  }
                }}
              >
                <Text style={styles.addClientToggleText}>
                  {isAddingNewClient ? "Select existing client" : "+ Add new client"}
                </Text>
              </TouchableOpacity>
            </View>

            {isAddingNewClient ? (
              <View style={styles.newClientBox}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Shah Aman"
                  placeholderTextColor="#9CA3AF"
                  value={newClientName}
                  onChangeText={setNewClientName}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                  Phone Number
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="+39 345 678 9123"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={newClientPhone}
                  onChangeText={setNewClientPhone}
                />

                <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                  Email (Optional)
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="client@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  value={newClientEmail}
                  onChangeText={setNewClientEmail}
                />
              </View>
            ) : selectedClient ? (
              <View style={styles.selectedClientCard}>
                <Avatar
                  name={selectedClient.name}
                  uri={selectedClient.avatar}
                  size={46}
                />
                <View style={styles.selectedClientInfo}>
                  <Text style={styles.selectedClientName}>
                    {selectedClient.name}
                  </Text>
                  <Text style={styles.selectedClientPhone}>
                    {selectedClient.phone}
                  </Text>
                  {selectedClient.notes ? (
                    <Text style={styles.selectedClientNotes} numberOfLines={4}>
                      {selectedClient.notes}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.removeClientBtn}
                  onPress={() => setSelectedClientId(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.clientSearchSection}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={17} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search existing clients..."
                    placeholderTextColor="#9CA3AF"
                    value={clientSearchQuery}
                    onChangeText={setClientSearchQuery}
                  />
                  {clientSearchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setClientSearchQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.clientListDropdown}>
                  {filteredClients.map((client) => (
                    <TouchableOpacity
                      key={client.id}
                      style={styles.clientDropdownItem}
                      onPress={() => setSelectedClientId(client.id)}
                    >
                      <Avatar
                        name={client.name}
                        uri={client.avatar}
                        size={36}
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.clientItemName}>{client.name}</Text>
                        <Text style={styles.clientItemPhone}>{client.phone}</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* STEP 2: SERVICES & TIMELINE & BOOKING ORDER */}
        {currentStep === 2 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionTitle}>Select Services</Text>
            <View style={styles.servicesGrid}>
              {availableServices.map((srv) => {
                const isChecked = selectedServiceIds.includes(srv.id);
                return (
                  <TouchableOpacity
                    key={srv.id}
                    style={[
                      styles.serviceCheckboxCard,
                      isChecked && styles.serviceCheckboxCardActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleService(srv.id)}
                  >
                    <View
                      style={[
                        styles.checkboxBox,
                        isChecked && styles.checkboxBoxActive,
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.serviceNameText}>{srv.name}</Text>
                      <Text style={styles.serviceDurationText}>
                        {srv.durationText}
                      </Text>
                    </View>
                    <Text style={styles.servicePriceText}>{srv.price}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.durationCard}>
              <Ionicons name="timer-outline" size={18} color="#635BFF" />
              <Text style={styles.totalDurationText}>
                Total duration:{" "}
                <Text style={{ fontFamily: "Manrope_700Bold", color: "#1F2937" }}>
                  {formattedTotalDuration}
                </Text>
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              Appointment Timeline
            </Text>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineItemText}>
                1. {primaryServiceName}
              </Text>
              <View style={styles.timePillRow}>
                <View style={styles.timePill}>
                  <Text style={styles.timePillText}>{startTime}</Text>
                  <Ionicons name="time-outline" size={14} color="#635BFF" />
                </View>
                <Text style={{ color: "#9CA3AF", fontFamily: "Manrope_700Bold" }}>
                  -
                </Text>
                <View style={styles.timePill}>
                  <Text style={styles.timePillText}>{endTime}</Text>
                  <Ionicons name="time-outline" size={14} color="#635BFF" />
                </View>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
              Booking Order
            </Text>
            <View style={styles.bookingOrderCard}>
              <View style={styles.orderStepCircle}>
                <Text style={styles.orderStepNumber}>1</Text>
              </View>
              <View style={styles.toDoBadge}>
                <Text style={styles.toDoBadgeText}>TO DO</Text>
              </View>
              <Text style={styles.orderTimeText}>
                {startTime} - {endTime}
              </Text>
              <Text style={styles.orderServiceText}>{primaryServiceName}</Text>

              {/* Stylist Selector */}
              <TouchableOpacity
                style={styles.staffDropdownBtn}
                onPress={() => setIsStaffPickerOpen(!isStaffPickerOpen)}
              >
                <Avatar
                  name={assignedStaff.name}
                  uri={assignedStaff.avatar}
                  size={26}
                />
                <Text style={styles.staffDropdownName}>
                  {assignedStaff.name}
                </Text>
                <Ionicons
                  name={isStaffPickerOpen ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {isStaffPickerOpen && (
                <View style={styles.staffPickerOptions}>
                  {staffList.map((st) => (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.staffPickerRow,
                        st.id === selectedStaffId && styles.staffPickerRowActive,
                      ]}
                      onPress={() => {
                        setSelectedStaffId(st.id);
                        setIsStaffPickerOpen(false);
                      }}
                    >
                      <Avatar name={st.name} uri={st.avatar} size={24} />
                      <Text style={styles.staffPickerOptionText}>
                        {st.name} ({st.role})
                      </Text>
                      {st.id === selectedStaffId && (
                        <Ionicons name="checkmark" size={16} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* STEP 3: STATUS, PAYMENT & NOTE */}
        {currentStep === 3 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusOptionsRow}>
              {(["Booked", "Confirmed"] as const).map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statusSelectBox,
                      isSelected && styles.statusSelectBoxActive,
                    ]}
                    onPress={() => setSelectedStatus(st)}
                  >
                    <View
                      style={[
                        styles.dotIndicator,
                        {
                          backgroundColor:
                            st === "Booked" ? "#635BFF" : "#10B981",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusSelectLabel,
                        isSelected && styles.statusSelectLabelActive,
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
              Payment Status
            </Text>
            <View style={styles.paymentOptionsRow}>
              {(["Paid", "Partially Paid", "Unpaid"] as const).map((ps) => {
                const isSelected = selectedPaymentStatus === ps;
                return (
                  <TouchableOpacity
                    key={ps}
                    style={[
                      styles.paymentSelectBox,
                      isSelected &&
                        (ps === "Paid"
                          ? styles.paymentSelectPaidActive
                          : ps === "Partially Paid"
                          ? styles.paymentSelectPartiallyActive
                          : styles.paymentSelectUnpaidActive),
                    ]}
                    onPress={() => setSelectedPaymentStatus(ps)}
                  >
                    <View
                      style={[
                        styles.dotIndicator,
                        {
                          backgroundColor:
                            ps === "Paid"
                              ? "#16A34A"
                              : ps === "Partially Paid"
                              ? "#D97706"
                              : "#DC2626",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.paymentSelectLabel,
                        isSelected && { fontFamily: "Manrope_700Bold" },
                      ]}
                    >
                      {ps}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
              Appointment Note
            </Text>
            <TextInput
              style={styles.notesTextArea}
              placeholder="Add any specific requirements or notes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Fixed Action Bar (Elevated above Android navigation bar) */}
      <View
        style={[
          styles.bottomActionBar,
          { paddingBottom: safeBottom },
        ]}
      >
        <TouchableOpacity
          style={styles.footerSecondaryBtn}
          onPress={handleBackStep}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.footerSecondaryText}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Text>
        </TouchableOpacity>

        {currentStep < 3 ? (
          <TouchableOpacity
            style={[
              styles.footerPrimaryBtn,
              !(currentStep === 1 ? canGoToStep2 : canGoToStep3) &&
                styles.footerPrimaryBtnDisabled,
            ]}
            disabled={!(currentStep === 1 ? canGoToStep2 : canGoToStep3)}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() =>
              setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 2 | 3) : 3))
            }
          >
            <Text style={styles.footerPrimaryText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.footerPrimaryBtn}
            onPress={handleFinalSubmit}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.footerPrimaryText}>
              {mode === "edit" ? "Save Changes" : "Create Appointment"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FA",
  },
  headerTitlesCol: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  screenTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  stepBadge: {
    backgroundColor: "#EFF4FA",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#635BFF",
  },
  screenSubtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FA",
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: "#E5E7EB",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#635BFF",
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  stepSection: {
    gap: 12,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  addClientToggleText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#635BFF",
  },
  newClientBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  inputLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#4B5563",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
  },
  selectedClientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
  },
  selectedClientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedClientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  selectedClientPhone: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  selectedClientNotes: {
    fontFamily: "Manrope_400Regular",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  removeClientBtn: {
    padding: 4,
  },
  clientSearchSection: {
    gap: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
    padding: 0,
  },
  clientListDropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: 180,
  },
  clientDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  clientItemName: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1F2937",
  },
  clientItemPhone: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  servicesGrid: {
    gap: 8,
  },
  serviceCheckboxCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  serviceCheckboxCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F8F8FF",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxBoxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  serviceNameText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  serviceDurationText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: 2,
  },
  servicePriceText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  durationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F0FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  totalDurationText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#635BFF",
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 8,
  },
  timelineItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1F2937",
  },
  timePillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F0FF",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  timePillText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#635BFF",
  },
  bookingOrderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 8,
  },
  orderStepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  orderStepNumber: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  toDoBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF4FA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  toDoBadgeText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    color: "#4B5563",
  },
  orderTimeText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  orderServiceText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1F2937",
  },
  staffDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginTop: 6,
  },
  staffDropdownName: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#1F2937",
  },
  staffPickerOptions: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 6,
  },
  staffPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  staffPickerRowActive: {
    backgroundColor: "#F3F0FF",
  },
  staffPickerOptionText: {
    flex: 1,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#1F2937",
  },
  statusOptionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statusSelectBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  statusSelectBoxActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F8F8FF",
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusSelectLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#4B5563",
  },
  statusSelectLabelActive: {
    fontFamily: "Manrope_700Bold",
    color: "#1F2937",
  },
  paymentOptionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  paymentSelectBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: "#FFFFFF",
  },
  paymentSelectPaidActive: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  paymentSelectPartiallyActive: {
    borderColor: "#D97706",
    backgroundColor: "#FFFBEB",
  },
  paymentSelectUnpaidActive: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  paymentSelectLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#374151",
  },
  notesTextArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
    textAlignVertical: "top",
    minHeight: 90,
  },
  bottomActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#EFF4FA",
    gap: 12,
    zIndex: 100,
    elevation: 10,
  },
  footerSecondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
    alignItems: "center",
    justifyContent: "center",
  },
  footerSecondaryText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#29343D",
  },
  footerPrimaryBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  footerPrimaryBtnDisabled: {
    opacity: 0.5,
  },
  footerPrimaryText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
