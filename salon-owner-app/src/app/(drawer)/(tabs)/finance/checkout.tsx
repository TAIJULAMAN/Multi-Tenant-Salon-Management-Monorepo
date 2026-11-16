import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

export interface CheckoutServiceItem {
  id: string;
  name: string;
  date: string;
  price: number;
  startTime: string;
  duration: string;
  employee: string;
  employeeAvatar?: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isWalkIn?: boolean;
}

const mockClientsList: ClientData[] = [
  {
    id: "c_1",
    name: "Maria Rodriguez",
    email: "maria.r@example.com",
    phone: "+39 342 998 8776",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c_2",
    name: "Sophia Rossi",
    email: "sophia.rossi@example.com",
    phone: "+39 345 678 9124",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c_3",
    name: "Elena Romano",
    email: "elena.romano@example.com",
    phone: "+39 345 678 9125",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c_4",
    name: "Giulia Bianchi",
    email: "giulia.b@example.com",
    phone: "+39 345 678 9126",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c_5",
    name: "Valentina Costa",
    email: "valentina.c@example.com",
    phone: "+39 345 678 9127",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
  },
];

const mockAvailableServices = [
  { name: "Haircut", price: 170, duration: "15 min" },
  { name: "Balayage & Styling", price: 220, duration: "60 min" },
  { name: "Full Color & Gloss", price: 180, duration: "45 min" },
  { name: "Blow Dry & Finish", price: 65, duration: "30 min" },
  { name: "Manicure & Nail Care", price: 45, duration: "25 min" },
  { name: "Beard Trim & Grooming", price: 35, duration: "20 min" },
];

const mockStaffMembers = [
  { name: "Maria Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" },
  { name: "Mada", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
  { name: "Angelica", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
  { name: "Marco", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<any>();
  const insets = useSafeAreaInsets();

  // Initial Client Setup
  const isIndependent = params.type === "independent";
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(
    isIndependent || !params.clientName
      ? null
      : {
          id: params.apptId || "c_1",
          name: params.clientName,
          email: `${params.clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          phone: "+39 342 998 8776",
          avatar: params.clientAvatar || undefined,
        }
  );

  // Payment Methods
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["Cash"]);

  // Services List in Cart
  const [services, setServices] = useState<CheckoutServiceItem[]>([
    {
      id: "srv_1",
      name: params.serviceName || "Haircut",
      date: params.serviceDate || "2025-09-23",
      price: parseFloat(params.servicePrice) || 170,
      startTime: params.serviceTime || "11:00 AM",
      duration: params.serviceDuration || "15 min",
      employee: params.employeeName || "Maria Rodriguez",
      employeeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    },
  ]);

  // Tip & Discount States
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [tipEmployee, setTipEmployee] = useState<string>("Maria Rodriguez");
  const [discountType, setDiscountType] = useState<"Fixed Amount" | "Percentage">("Fixed Amount");
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Modals
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isStaffSelectModalOpen, setIsStaffSelectModalOpen] = useState(false);
  const [selectedServiceForStaff, setSelectedServiceForStaff] = useState<string | null>(null);
  const [isTipStaffSelectModalOpen, setIsTipStaffSelectModalOpen] = useState(false);
  const [isAddServiceStaffSelectModalOpen, setIsAddServiceStaffSelectModalOpen] = useState(false);
  const moreBtnRef = useRef<any>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<{ bottom: number; right: number }>({ bottom: 80, right: 155 });

  // Temp form states in modals
  const [tempTipPercent, setTempTipPercent] = useState<number | "custom">(0);
  const [customTipInput, setCustomTipInput] = useState("");
  const [tempDiscountType, setTempDiscountType] = useState<"Fixed Amount" | "Percentage">("Fixed Amount");
  const [tempDiscountInput, setTempDiscountInput] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");

  // Add service modal state
  const [newServiceName, setNewServiceName] = useState("Blow Dry & Finish");
  const [newServicePrice, setNewServicePrice] = useState("65");
  const [newServiceDuration, setNewServiceDuration] = useState("30 min");
  const [newServiceEmployee, setNewServiceEmployee] = useState("Maria Rodriguez");

  // Computations
  const subtotal = useMemo(() => {
    return services.reduce((acc, s) => acc + (s.price || 0), 0);
  }, [services]);

  const discountAmount = useMemo(() => {
    if (discountType === "Fixed Amount") {
      return Math.min(discountValue, subtotal);
    } else {
      return Math.min((subtotal * discountValue) / 100, subtotal);
    }
  }, [subtotal, discountType, discountValue]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + tipAmount);
  }, [subtotal, discountAmount, tipAmount]);

  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethods.includes(method)) {
      if (selectedPaymentMethods.length > 1) {
        setSelectedPaymentMethods((prev) => prev.filter((m) => m !== method));
      }
    } else {
      setSelectedPaymentMethods((prev) => [...prev, method]);
    }
  };

  // Remove Service
  const handleRemoveService = (id: string) => {
    if (services.length <= 1) {
      Alert.alert("Cannot Remove", "A receipt must contain at least one service item.");
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Add Service confirm
  const handleConfirmAddService = () => {
    const p = parseFloat(newServicePrice) || 50;
    const newSrv: CheckoutServiceItem = {
      id: `srv_${Date.now()}`,
      name: newServiceName,
      date: "2025-09-23",
      price: p,
      startTime: "12:00 PM",
      duration: newServiceDuration,
      employee: newServiceEmployee,
    };
    setServices((prev) => [...prev, newSrv]);
    setIsAddServiceModalOpen(false);
  };

  // Open More Menu Anchored above 3-dot button
  const handleOpenMoreMenu = () => {
    if (moreBtnRef.current?.measureInWindow) {
      moreBtnRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const screenWidth = Dimensions.get("window").width;
        const screenHeight = Dimensions.get("window").height;
        setMoreMenuAnchor({
          bottom: Math.max(60, screenHeight - y + 6),
          right: Math.max(16, screenWidth - (x + width)),
        });
        setIsMoreMenuOpen(true);
      });
    } else {
      setMoreMenuAnchor({ bottom: Math.max(insets.bottom + 60, 80), right: 155 });
      setIsMoreMenuOpen(true);
    }
  };

  // Open Tip Modal
  const handleOpenTipModal = () => {
    setIsMoreMenuOpen(false);
    setTempTipPercent(0);
    setCustomTipInput(tipAmount > 0 ? String(tipAmount) : "");
    setIsTipModalOpen(true);
  };

  // Save Tip
  const handleSaveTip = () => {
    if (tempTipPercent === "custom") {
      const customVal = parseFloat(customTipInput) || 0;
      setTipAmount(customVal);
    } else if (tempTipPercent > 0) {
      const calculated = (subtotal * tempTipPercent) / 100;
      setTipAmount(calculated);
    } else {
      setTipAmount(0);
    }
    setIsTipModalOpen(false);
  };

  // Open Discount Modal
  const handleOpenDiscountModal = () => {
    setIsMoreMenuOpen(false);
    setTempDiscountType(discountType);
    setTempDiscountInput(discountValue > 0 ? String(discountValue) : "");
    setIsDiscountModalOpen(true);
  };

  // Save Discount
  const handleSaveDiscount = () => {
    const val = parseFloat(tempDiscountInput) || 0;
    setDiscountType(tempDiscountType);
    setDiscountValue(val);
    setIsDiscountModalOpen(false);
  };

  // Save and Leave
  const handleSaveAndLeave = () => {
    const clientName = selectedClient ? selectedClient.name : "Walk-in Client";
    const receiptNum = `REC-2025-${Math.floor(100 + Math.random() * 900)}`;

    Alert.alert(
      "Receipt Saved",
      `Receipt ${receiptNum} for ${clientName} totaling € ${totalAmount.toFixed(2)} was successfully issued and saved.`,
      [
        {
          text: "View Receipts",
          onPress: () => router.replace("/(drawer)/(tabs)/finance" as any),
        },
        {
          text: "Done",
          onPress: () => router.back(),
        },
      ]
    );
  };

  // Filtered Clients
  const filteredClients = mockClientsList.filter((c) =>
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.phone.includes(clientSearchTerm)
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* ======================================================== */}
      {/* TOP HEADER: < Checkout  |  / Dashboard                   */}
      {/* ======================================================== */}
      <View style={styles.topNavHeader}>
        <TouchableOpacity
          style={styles.backNavBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
          <Text style={styles.headerTitleText}>Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.breadcrumbLink}
          onPress={() => router.replace("/(drawer)/(tabs)/(home)" as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={14} color="#635BFF" />
          <Text style={styles.breadcrumbText}>/ Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================== */}
        {/* 1. CLIENT INFORMATION SECTION                            */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Client Information</Text>
              <Text style={styles.sectionSubtitle}>
                Select a client or proceed as walk-in customer.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsClientModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionActionLink}>
                {selectedClient ? "Change Client" : "Select Client"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Client Box */}
          <TouchableOpacity
            style={styles.clientBoxDashed}
            onPress={() => setIsClientModalOpen(true)}
            activeOpacity={0.8}
          >
            {selectedClient ? (
              <View style={styles.selectedClientRow}>
                <Avatar name={selectedClient.name} uri={selectedClient.avatar} size={44} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.selectedClientName}>{selectedClient.name}</Text>
                  <Text style={styles.selectedClientSub}>{selectedClient.phone} • {selectedClient.email}</Text>
                </View>
                <View style={styles.changeClientBtn}>
                  <Text style={styles.changeClientBtnText}>Change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.walkInRow}>
                <View style={styles.walkInIconCircle}>
                  <Ionicons name="person-outline" size={22} color="#635BFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.walkInTitle}>Walk-in Client (None Selected)</Text>
                  <Text style={styles.walkInSub}>
                    Click to assign a registered client to this receipt
                  </Text>
                </View>
                <View style={styles.selectClientChip}>
                  <Text style={styles.selectClientChipText}>Select Client</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ======================================================== */}
        {/* 2. PAYMENT METHODS SECTION                               */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <Text style={styles.sectionSubtitle}>Select one or more methods.</Text>
            </View>
            <TouchableOpacity
              style={styles.continuePaymentBtn}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={styles.continuePaymentBtnText}>Continue Payment</Text>
            </TouchableOpacity>
          </View>

          {/* 4 Methods Grid (2 per row) */}
          <View style={styles.paymentMethodsContainer}>
            <View style={styles.paymentMethodRow}>
              {[
                { id: "Cash", label: "Cash", icon: "cash-outline" },
                { id: "Card Terminal", label: "Card Terminal", icon: "card-outline" },
              ].map((pm) => {
                const isSelected = selectedPaymentMethods.includes(pm.id);
                return (
                  <TouchableOpacity
                    key={pm.id}
                    style={[
                      styles.paymentMethodCard,
                      isSelected && styles.paymentMethodCardActive,
                    ]}
                    onPress={() => togglePaymentMethod(pm.id)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.paymentMethodIconBox,
                        isSelected && styles.paymentMethodIconBoxActive,
                      ]}
                    >
                      <Ionicons
                        name={pm.icon as any}
                        size={24}
                        color={isSelected ? "#635BFF" : "#64748B"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.paymentMethodLabel,
                        isSelected && styles.paymentMethodLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {pm.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedCheckBadge}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.paymentMethodRow}>
              {[
                { id: "Online Payment", label: "Online Payment", icon: "globe-outline" },
                { id: "Gift Card", label: "Gift Card", icon: "gift-outline" },
              ].map((pm) => {
                const isSelected = selectedPaymentMethods.includes(pm.id);
                return (
                  <TouchableOpacity
                    key={pm.id}
                    style={[
                      styles.paymentMethodCard,
                      isSelected && styles.paymentMethodCardActive,
                    ]}
                    onPress={() => togglePaymentMethod(pm.id)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.paymentMethodIconBox,
                        isSelected && styles.paymentMethodIconBoxActive,
                      ]}
                    >
                      <Ionicons
                        name={pm.icon as any}
                        size={24}
                        color={isSelected ? "#635BFF" : "#64748B"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.paymentMethodLabel,
                        isSelected && styles.paymentMethodLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {pm.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedCheckBadge}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* 3. SERVICES SECTION                                      */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity
              style={styles.addServiceBtn}
              onPress={() => setIsAddServiceModalOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#635BFF" />
              <Text style={styles.addServiceBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>

          {/* Services List */}
          <View style={styles.servicesListContainer}>
            {services.map((srv, idx) => (
              <View key={srv.id} style={styles.serviceItemCard}>
                {/* Top Info: Service name & Price */}
                <View style={styles.serviceItemTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceItemName}>{srv.name}</Text>
                    <View style={styles.serviceMetaRow}>
                      <View style={styles.metaBadge}>
                        <Ionicons name="calendar-outline" size={12} color="#64748B" />
                        <Text style={styles.metaBadgeText}>{srv.date}</Text>
                      </View>
                      <View style={styles.metaBadge}>
                        <Ionicons name="time-outline" size={12} color="#64748B" />
                        <Text style={styles.metaBadgeText}>{srv.startTime} ({srv.duration})</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.servicePriceBox}>
                    <Text style={styles.servicePriceText}>€ {srv.price}</Text>
                  </View>
                </View>

                {/* Bottom Row: Employee & Delete */}
                <View style={styles.serviceItemBottom}>
                  <TouchableOpacity
                    style={styles.employeeChip}
                    onPress={() => {
                      setSelectedServiceForStaff(srv.id);
                      setIsStaffSelectModalOpen(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Avatar
                      name={srv.employee}
                      uri={srv.employeeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      size={22}
                    />
                    <Text style={styles.employeeChipText}>{srv.employee}</Text>
                    <Ionicons name="chevron-down" size={12} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteServiceBtn}
                    onPress={() => handleRemoveService(srv.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ======================================================== */}
        {/* 4. ORDER SUMMARY SECTION                                 */}
        {/* ======================================================== */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryVal}>€ {subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryVal}>0</Text>
            </View>

            {/* Discount Row */}
            <View style={styles.summaryRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.summaryLabel}>Discount</Text>
                {discountValue > 0 ? (
                  <TouchableOpacity onPress={handleOpenDiscountModal}>
                    <Text style={styles.editDiscountLink}>Edit</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleOpenDiscountModal}>
                    <Text style={styles.addDiscountLink}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.summaryVal, discountValue > 0 && { color: "#EF4444" }]}>
                {discountValue > 0 ? `- € ${discountAmount.toFixed(2)}` : "0"}
              </Text>
            </View>

            {/* Tip Row (if added) */}
            {tipAmount > 0 && (
              <View style={styles.summaryRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.summaryLabel}>Tip ({tipEmployee})</Text>
                  <TouchableOpacity onPress={handleOpenTipModal}>
                    <Text style={styles.editDiscountLink}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.summaryVal, { color: "#10B981" }]}>
                  + € {tipAmount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.summaryDivider} />

            {/* Total Row */}
            <View style={styles.summaryTotalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>€ {totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ======================================================== */}
      {/* FIXED BOTTOM ACTION BAR (Always visible at bottom)       */}
      {/* ======================================================== */}
      <View
        style={[
          styles.bottomActionBarFixed,
          { paddingBottom: Math.max(insets.bottom + 10, 22) },
        ]}
      >
        <TouchableOpacity
          style={styles.backFooterBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backFooterBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.rightActionsRow}>
          {/* More actions popup button (...) */}
          <TouchableOpacity
            ref={moreBtnRef}
            style={styles.moreOptionsBtn}
            onPress={handleOpenMoreMenu}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Save and Leave */}
          <TouchableOpacity
            style={styles.saveAndLeaveBtn}
            onPress={handleSaveAndLeave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveAndLeaveBtnText}>Save and Leave</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ======================================================== */}
      {/* 5. MORE OPTIONS DROPDOWN MODAL (Add Tip / Add Discount) */}
      {/* ======================================================== */}
      <Modal
        visible={isMoreMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMoreMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMoreMenuOpen(false)}>
          <View style={styles.menuModalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuPopoverCard,
                  {
                    position: "absolute",
                    bottom: moreMenuAnchor.bottom,
                    right: moreMenuAnchor.right,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuPopoverItem}
                  onPress={() => {
                    setIsMoreMenuOpen(false);
                    handleOpenTipModal();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="wallet-outline" size={16} color="#475569" />
                  <Text style={styles.menuPopoverItemText}>Add a Tip</Text>
                </TouchableOpacity>

                <View style={styles.popoverDivider} />

                <TouchableOpacity
                  style={styles.menuPopoverItem}
                  onPress={() => {
                    setIsMoreMenuOpen(false);
                    handleOpenDiscountModal();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pricetag-outline" size={16} color="#475569" />
                  <Text style={styles.menuPopoverItemText}>Add a Discount</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ======================================================== */}
      {/* 6. ASSIGN TEAM MEMBER TO SERVICE BOTTOM SHEET           */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isStaffSelectModalOpen}
        onClose={() => setIsStaffSelectModalOpen(false)}
        title="Assign Staff Member"
      >
        <View style={styles.staffOptionsList}>
          {mockStaffMembers.map((staff) => {
            const activeSrv = services.find((s) => s.id === selectedServiceForStaff);
            const isSelected = activeSrv?.employee === staff.name;
            return (
              <TouchableOpacity
                key={staff.name}
                style={[
                  styles.staffOptionRow,
                  isSelected && styles.staffOptionRowActive,
                ]}
                onPress={() => {
                  if (selectedServiceForStaff) {
                    setServices((prev) =>
                      prev.map((s) =>
                        s.id === selectedServiceForStaff
                          ? { ...s, employee: staff.name, employeeAvatar: staff.avatar }
                          : s
                      )
                    );
                  }
                  setIsStaffSelectModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Avatar name={staff.name} uri={staff.avatar} size={38} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.staffOptionName}>{staff.name}</Text>
                  <Text style={styles.staffOptionRole}>Stylist / Professional</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color="#635BFF" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 7. SELECT TIP RECIPIENT BOTTOM SHEET                    */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isTipStaffSelectModalOpen}
        onClose={() => setIsTipStaffSelectModalOpen(false)}
        title="Select Tip Recipient"
      >
        <View style={styles.staffOptionsList}>
          {mockStaffMembers.map((staff) => {
            const isSelected = tipEmployee === staff.name;
            return (
              <TouchableOpacity
                key={staff.name}
                style={[
                  styles.staffOptionRow,
                  isSelected && styles.staffOptionRowActive,
                ]}
                onPress={() => {
                  setTipEmployee(staff.name);
                  setIsTipStaffSelectModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Avatar name={staff.name} uri={staff.avatar} size={38} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.staffOptionName}>{staff.name}</Text>
                  <Text style={styles.staffOptionRole}>Stylist / Professional</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color="#635BFF" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 8. SELECT STYLIST FOR ADD SERVICE                       */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isAddServiceStaffSelectModalOpen}
        onClose={() => setIsAddServiceStaffSelectModalOpen(false)}
        title="Select Stylist"
      >
        <View style={styles.staffOptionsList}>
          {mockStaffMembers.map((staff) => {
            const isSelected = newServiceEmployee === staff.name;
            return (
              <TouchableOpacity
                key={staff.name}
                style={[
                  styles.staffOptionRow,
                  isSelected && styles.staffOptionRowActive,
                ]}
                onPress={() => {
                  setNewServiceEmployee(staff.name);
                  setIsAddServiceStaffSelectModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Avatar name={staff.name} uri={staff.avatar} size={38} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.staffOptionName}>{staff.name}</Text>
                  <Text style={styles.staffOptionRole}>Stylist / Professional</Text>
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color="#635BFF" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 9. SEND A TIP BOTTOM SHEET                              */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        title="Send a Tip"
      >
        <View style={{ gap: 12 }}>
          {/* Employee Selector */}
          <Text style={styles.inputFieldLabel}>Employee *</Text>
          <TouchableOpacity
            style={styles.employeeSelectorBox}
            onPress={() => setIsTipStaffSelectModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.employeeSelectorText}>{tipEmployee}</Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Tip Amount Grid */}
          <Text style={[styles.inputFieldLabel, { marginTop: 4 }]}>Amount *</Text>
          <View style={styles.tipGrid}>
            {[
              { label: "No Tip", pct: 0 },
              { label: "10%", pct: 10 },
              { label: "18%", pct: 18 },
              { label: "25%", pct: 25 },
              { label: "35%", pct: 35 },
              { label: "45%", pct: 45 },
            ].map((t) => {
              const isAct = tempTipPercent === t.pct;
              const tipVal = ((subtotal * t.pct) / 100).toFixed(2).replace(".", ",");
              return (
                <TouchableOpacity
                  key={t.label}
                  style={[styles.tipBox, isAct && styles.tipBoxActive]}
                  onPress={() => setTempTipPercent(t.pct)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tipBoxTitle, isAct && styles.tipBoxTitleActive]}>
                    {t.label}
                  </Text>
                  {t.pct > 0 && <Text style={styles.tipBoxSub}>€ {tipVal}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Tip */}
          <TouchableOpacity
            style={[
              styles.customTipBox,
              tempTipPercent === "custom" && styles.tipBoxActive,
            ]}
            onPress={() => setTempTipPercent("custom")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tipBoxTitle,
                tempTipPercent === "custom" && styles.tipBoxTitleActive,
              ]}
            >
              Custom Tip
            </Text>
          </TouchableOpacity>

          {tempTipPercent === "custom" && (
            <View style={styles.customTipInputWrap}>
              <TextInput
                style={styles.customTipInput}
                placeholder="Enter custom tip amount in €"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={customTipInput}
                onChangeText={setCustomTipInput}
                autoFocus
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.modalPrimaryActionBtn, { marginTop: 4 }]}
            onPress={handleSaveTip}
            activeOpacity={0.85}
          >
            <Text style={styles.modalPrimaryActionBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 10. ADD CART DISCOUNT BOTTOM SHEET                      */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        title="Add Cart Discount"
      >
        <View style={{ gap: 12 }}>
          <Text style={styles.modalSubtitleGrey}>
            Taxes will be recalculated after the discount has been applied.
          </Text>

          <View style={styles.discountInputsRow}>
            {/* Type */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>Type *</Text>
              <TouchableOpacity
                style={styles.typeDropdown}
                onPress={() =>
                  setTempDiscountType((prev) =>
                    prev === "Fixed Amount" ? "Percentage" : "Fixed Amount"
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.typeDropdownText}>{tempDiscountType}</Text>
                <Ionicons name="chevron-down" size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>Amount ({tempDiscountType === "Fixed Amount" ? "€" : "%"}) *</Text>
              <TextInput
                style={styles.discountAmountInput}
                placeholder="Enter amount"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={tempDiscountInput}
                onChangeText={setTempDiscountInput}
              />
            </View>
          </View>

          {(() => {
            const val = parseFloat(tempDiscountInput) || 0;
            const calcDisc =
              tempDiscountType === "Fixed Amount"
                ? Math.min(val, subtotal)
                : Math.min((subtotal * val) / 100, subtotal);
            const previewTotal = Math.max(0, subtotal - calcDisc + tipAmount);

            return (
              <View style={styles.discountPreviewBadge}>
                <Text style={styles.discountPreviewText}>
                  Total After Discount: € {previewTotal.toFixed(2)}
                </Text>
              </View>
            );
          })()}

          <TouchableOpacity
            style={[styles.modalPrimaryActionBtn, { marginTop: 4 }]}
            onPress={handleSaveDiscount}
            activeOpacity={0.85}
          >
            <Text style={styles.modalPrimaryActionBtnText}>Add Discount</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 11. SELECT CLIENT BOTTOM SHEET                          */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        title="Select Client"
      >
        <View style={{ gap: 10 }}>
          {/* Walk-in selection */}
          <TouchableOpacity
            style={styles.clientOptionItem}
            onPress={() => {
              setSelectedClient(null);
              setIsClientModalOpen(false);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.walkInIconSmall}>
              <Ionicons name="person-outline" size={18} color="#635BFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.clientOptionName}>Walk-in Client</Text>
              <Text style={styles.clientOptionSub}>No registered profile</Text>
            </View>
            {!selectedClient && (
              <Ionicons name="checkmark-circle" size={20} color="#635BFF" />
            )}
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search registered client"
              placeholderTextColor="#94A3B8"
              value={clientSearchTerm}
              onChangeText={setClientSearchTerm}
            />
          </View>

          <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
            {filteredClients.map((c) => {
              const isCurrent = selectedClient?.id === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.clientOptionItem,
                    isCurrent && styles.clientOptionItemActive,
                  ]}
                  onPress={() => {
                    setSelectedClient(c);
                    setIsClientModalOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Avatar name={c.name} uri={c.avatar} size={36} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.clientOptionName}>{c.name}</Text>
                    <Text style={styles.clientOptionSub}>{c.phone}</Text>
                  </View>
                  {isCurrent && (
                    <Ionicons name="checkmark-circle" size={20} color="#635BFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </CustomBottomSheet>

      {/* ======================================================== */}
      {/* 12. ADD SERVICE BOTTOM SHEET                            */}
      {/* ======================================================== */}
      <CustomBottomSheet
        visible={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        title="Add Service to Receipt"
      >
        <View style={{ gap: 14 }}>
          {/* Service chips */}
          <Text style={styles.inputFieldLabel}>Choose Service</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {mockAvailableServices.map((srv) => {
                const isSel = newServiceName === srv.name;
                return (
                  <TouchableOpacity
                    key={srv.name}
                    style={[styles.serviceChoiceChip, isSel && styles.serviceChoiceChipActive]}
                    onPress={() => {
                      setNewServiceName(srv.name);
                      setNewServicePrice(String(srv.price));
                      setNewServiceDuration(srv.duration);
                    }}
                  >
                    <Text style={[styles.serviceChoiceChipText, isSel && styles.serviceChoiceChipTextActive]}>
                      {srv.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>Price (€)</Text>
              <TextInput
                style={styles.textInputRegular}
                value={newServicePrice}
                onChangeText={setNewServicePrice}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputFieldLabel}>Duration</Text>
              <TextInput
                style={styles.textInputRegular}
                value={newServiceDuration}
                onChangeText={setNewServiceDuration}
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputFieldLabel}>Stylist / Employee</Text>
            <TouchableOpacity
              style={styles.employeeSelectorBox}
              onPress={() => setIsAddServiceStaffSelectModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.employeeSelectorText}>{newServiceEmployee}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.modalPrimaryActionBtn, { marginTop: 4 }]}
            onPress={handleConfirmAddService}
            activeOpacity={0.85}
          >
            <Text style={styles.modalPrimaryActionBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topNavHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitleText: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  breadcrumbLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  breadcrumbText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  sectionActionLink: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Client Box
  clientBoxDashed: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 12,
  },
  walkInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  walkInIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  walkInTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  walkInSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  selectClientChip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectClientChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  selectedClientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedClientName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  selectedClientSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  changeClientBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  changeClientBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },

  // Payment Methods
  continuePaymentBtn: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  continuePaymentBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  paymentMethodsContainer: {
    gap: 10,
  },
  paymentMethodRow: {
    flexDirection: "row",
    gap: 10,
  },
  paymentMethodCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  paymentMethodCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF9FF",
  },
  paymentMethodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  paymentMethodIconBoxActive: {
    backgroundColor: "#EEF2FF",
  },
  paymentMethodLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    textAlign: "center",
  },
  paymentMethodLabelActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  selectedCheckBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Services
  addServiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addServiceBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  servicesListContainer: {
    gap: 10,
  },
  serviceItemCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F8FAFC",
  },
  serviceItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  serviceItemName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  serviceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  servicePriceBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  servicePriceText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  serviceItemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  employeeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  employeeChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  deleteServiceBtn: {
    padding: 6,
  },

  // Summary
  summaryList: {
    marginTop: 12,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  summaryVal: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  addDiscountLink: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  editDiscountLink: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#0284C7",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  totalVal: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },

  // Fixed Bottom Action Bar
  bottomActionBarFixed: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  backFooterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  backFooterBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  rightActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  moreOptionsBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveAndLeaveBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveAndLeaveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // More Menu Popover
  menuModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
  },
  menuPopoverCard: {
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  menuPopoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  menuPopoverItemText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  popoverDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  // Modal Generic
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  bottomSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },

  // Tip Modal (Screenshot 4)
  tipModalCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tipModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  tipModalTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  inputFieldLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginBottom: 6,
  },
  employeeSelectorBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  employeeSelectorText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  tipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tipBox: {
    width: "31.5%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  tipBoxActive: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  tipBoxTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tipBoxTitleActive: {
    color: "#635BFF",
  },
  tipBoxSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  customTipBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    marginTop: 8,
  },
  customTipInputWrap: {
    marginTop: 8,
  },
  customTipInput: {
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  modalPrimaryActionBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalPrimaryActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Discount Modal (Screenshot 5)
  discountModalCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalSubtitleGrey: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginBottom: 14,
  },
  discountInputsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  typeDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  typeDropdownText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  discountAmountInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  discountPreviewBadge: {
    backgroundColor: "#CCFBF1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  discountPreviewText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#0F766E",
  },

  // Select Client bottom sheet
  clientOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  clientOptionItemActive: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF9FF",
  },
  walkInIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientOptionName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  clientOptionSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },

  // Add service modal
  serviceChoiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  serviceChoiceChipActive: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  serviceChoiceChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  serviceChoiceChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  textInputRegular: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  staffOptionsList: {
    gap: 8,
    marginTop: 4,
  },
  staffOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  staffOptionRowActive: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF9FF",
  },
  staffOptionName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  staffOptionRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
});
