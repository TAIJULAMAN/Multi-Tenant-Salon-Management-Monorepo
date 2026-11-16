import React, { useState, useMemo, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import {
  staffList,
  availableServices as defaultServices,
  addAppointmentToStore,
} from "@/components/appointment/data";
import { CalAppointment, ServiceItem, StaffMember } from "@/components/appointment/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ScheduledServiceItem {
  id: string;
  serviceId: string;
  name: string;
  duration: number; // in minutes
  price: string;
  priceNum: number;
  staffId: string;
  slotHour: number; // 0 - 23 (e.g. 1 = 1:00 AM)
  startTime: string; // e.g. "1:00 AM"
  endTime: string; // e.g. "1:40 AM"
  date: string;
  dayNum?: number;
  dayName?: string;
}

const recentlyScheduledClients = [
  {
    id: "rc1",
    name: "Maria Fernandez",
    email: "maria@gmail.com",
    phone: "+39 345 678 9123",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    isStaff: false,
  },
  {
    id: "rc2",
    name: "Virgie Sutton",
    email: "virgie.s@gmail.com",
    phone: "+39 345 678 9123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    isStaff: false,
  },
  {
    id: "rc3",
    name: "Virgie Sutton",
    email: "virgie.sutton@gmail.com",
    phone: "+39 345 678 9123",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    isStaff: false,
  },
  {
    id: "rc4",
    name: "Lois Gregory",
    email: "lois.gregory@salon.com",
    phone: "Staff",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    isStaff: true,
  },
];

const hoursList = [
  { hour: 0, label: "12:00 AM" },
  { hour: 1, label: "1:00 AM" },
  { hour: 2, label: "2:00 AM" },
  { hour: 3, label: "3:00 AM" },
  { hour: 4, label: "4:00 AM" },
  { hour: 5, label: "5:00 AM" },
  { hour: 6, label: "6:00 AM" },
  { hour: 7, label: "7:00 AM" },
  { hour: 8, label: "8:00 AM" },
  { hour: 9, label: "9:00 AM" },
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: 12, label: "12:00 PM" },
  { hour: 13, label: "1:00 PM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
  { hour: 16, label: "4:00 PM" },
  { hour: 17, label: "5:00 PM" },
  { hour: 18, label: "6:00 PM" },
  { hour: 19, label: "7:00 PM" },
  { hour: 20, label: "8:00 PM" },
  { hour: 21, label: "9:00 PM" },
  { hour: 22, label: "10:00 PM" },
  { hour: 23, label: "11:00 PM" },
];

const weekDays = [
  { day: "Mon", dateNum: "01", full: "Monday Sep 01" },
  { day: "Tue", dateNum: "02", full: "Tuesday Sep 02" },
  { day: "Wed", dateNum: "03", full: "Wednesday Sep 03" },
  { day: "Thu", dateNum: "04", full: "Thursday Sep 04" },
  { day: "Fri", dateNum: "05", full: "Friday Sep 05" },
  { day: "Sat", dateNum: "06", full: "Saturday Sep 06" },
  { day: "Sun", dateNum: "07", full: "Sunday Sep 07" },
];

const paymentMethodOptions = [
  { id: "cash", label: "Cash", icon: "cash-outline" as const },
  { id: "gift_card", label: "Gift Card", icon: "gift-outline" as const },
  { id: "card_terminal", label: "Card Terminal", icon: "card-outline" as const },
  { id: "online_payment", label: "Online Payment", icon: "globe-outline" as const },
];

const STAFF_COL_WIDTH = 145;
const TIME_COL_WIDTH = 74;
const HOUR_ROW_HEIGHT = 68;

export default function AddAppointmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";
  const statusBarHeight = isAndroid ? (StatusBar.currentHeight || 28) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight) + 8;
  const safeBottom = Math.max(insets.bottom, isAndroid ? 48 : 20) + 16;

  // Wizard Step: 1 = Details, 2 = Review, 3 = Payment
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // View Mode: "day" | "week" | "month"
  const [activeViewMode, setActiveViewMode] = useState<"day" | "week" | "month">("month");
  // Full screen calendar modal
  const [isFullScreenCalendar, setIsFullScreenCalendar] = useState(false);

  // Client Selection
  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  }>({
    id: recentlyScheduledClients[0].id,
    name: recentlyScheduledClients[0].name,
    email: recentlyScheduledClients[0].email,
    phone: recentlyScheduledClients[0].phone,
    avatar: recentlyScheduledClients[0].avatar,
  });

  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Schedule Controls State
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>("all");
  const [activeDateText, setActiveDateText] = useState("Tuesday Sep 02");
  const [selectedMonthDay, setSelectedMonthDay] = useState<number>(2);
  const [frequency, setFrequency] = useState("Doesn't repeat");

  // Available Services
  const [servicesList, setServicesList] = useState<ServiceItem[]>([
    { id: "srv-1", name: "Haircut", duration: 40, durationText: "40 min", price: "€ 170", priceNum: 170 },
    { id: "srv-2", name: "Makeup", duration: 40, durationText: "40 min", price: "€ 170", priceNum: 170 },
    { id: "srv-3", name: "Beard Trim", duration: 30, durationText: "30 min", price: "€ 90", priceNum: 90 },
    { id: "srv-4", name: "Hair Coloring", duration: 60, durationText: "60 min", price: "€ 220", priceNum: 220 },
  ]);

  // Active selected service (for click-to-place on cells)
  const [activeSelectedServiceId, setActiveSelectedServiceId] = useState<string>("srv-1");

  // Scheduled Services on Timeline (defaults with Beard Trim on Day 2)
  const [scheduledServices, setScheduledServices] = useState<ScheduledServiceItem[]>([
    {
      id: "sch-1",
      serviceId: "srv-3",
      name: "Beard Trim",
      duration: 30,
      price: "€ 90",
      priceNum: 90,
      staffId: staffList[0]?.id || "st1",
      slotHour: 1,
      startTime: "1:00 AM",
      endTime: "1:30 AM",
      date: "02/08/2025",
      dayNum: 2,
      dayName: "Tue",
    },
  ]);

  // Step 2 & 3 States
  const [status, setStatus] = useState<"Booked" | "Confirmed" | "Arrived" | "Started" | "Completed" | "Canceled">("Booked");
  const [isRepeating, setIsRepeating] = useState(false);
  const [note, setNote] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");

  // Modals / Sheets
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isStaffFilterModalOpen, setIsStaffFilterModalOpen] = useState(false);
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [staffPickerTargetItemIndex, setStaffPickerTargetItemIndex] = useState<number | null>(null);

  // Position for Team Filter Dropdown (anchored below the button)
  const teamFilterBtnRef = useRef<View>(null);
  const [staffFilterMenuPos, setStaffFilterMenuPos] = useState({ top: 200, left: 16 });

  const handleOpenStaffFilter = () => {
    if (teamFilterBtnRef.current && (teamFilterBtnRef.current as any).measureInWindow) {
      (teamFilterBtnRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (y && height) {
            setStaffFilterMenuPos({
              top: y + height + 6,
              left: Math.max(16, x),
            });
          }
          setIsStaffFilterModalOpen(true);
        }
      );
    } else {
      setIsStaffFilterModalOpen(true);
    }
  };

  // Exact "Add New Service" Modal
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("40 min");
  const [newServicePrice, setNewServicePrice] = useState("€ 170");

  // Filtered Services
  const filteredAvailableServices = useMemo(() => {
    if (!serviceSearch.trim()) return servicesList;
    return servicesList.filter((s) =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [servicesList, serviceSearch]);

  // Staff members visible in schedule
  const visibleStaff = useMemo(() => {
    if (selectedStaffFilter === "all") return staffList.slice(0, 4);
    return staffList.filter((s) => s.id === selectedStaffFilter);
  }, [selectedStaffFilter]);

  // Totals calculation
  const totalPriceNum = useMemo(() => {
    return scheduledServices.reduce((acc, curr) => acc + curr.priceNum, 0);
  }, [scheduledServices]);

  const totalDurationMin = useMemo(() => {
    return scheduledServices.reduce((acc, curr) => acc + curr.duration, 0);
  }, [scheduledServices]);

  // Step 2: Review Popover & Actions
  const noteInputRef = useRef<TextInput>(null);
  const reviewKebabRef = useRef<View>(null);
  const [isReviewActionMenuOpen, setIsReviewActionMenuOpen] = useState(false);
  const [reviewMenuPos, setReviewMenuPos] = useState({ bottom: 80, right: 16 });

  const handleOpenReviewMenu = () => {
    if (reviewKebabRef.current && (reviewKebabRef.current as any).measureInWindow) {
      (reviewKebabRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (y) {
            setReviewMenuPos({
              bottom: Math.max(60, SCREEN_HEIGHT - y + 6),
              right: Math.max(16, SCREEN_WIDTH - (x + width)),
            });
          }
          setIsReviewActionMenuOpen(true);
        }
      );
    } else {
      setIsReviewActionMenuOpen(true);
    }
  };

  // Upfront Payment Modal State (Image 2)
  const [isUpfrontPaymentModalOpen, setIsUpfrontPaymentModalOpen] = useState(false);
  const [upfrontAmountInput, setUpfrontAmountInput] = useState("");
  const [selectedUpfrontMethod, setSelectedUpfrontMethod] = useState("cash");
  const [upfrontPayment, setUpfrontPayment] = useState<{
    amount: number;
    method: string;
  } | null>(null);

  const handleSaveUpfrontPayment = () => {
    const val = parseFloat(upfrontAmountInput.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid upfront payment amount.");
      return;
    }
    setUpfrontPayment({
      amount: val,
      method: selectedUpfrontMethod,
    });
    setIsUpfrontPaymentModalOpen(false);
  };

  // Step 2: Add Service Modal State (Image 3)
  const [isAddServiceReviewModalOpen, setIsAddServiceReviewModalOpen] = useState(false);
  const [selectedReviewServiceId, setSelectedReviewServiceId] = useState<string>(
    servicesList[1]?.id || servicesList[0]?.id || "srv-1"
  );
  const [isReviewServiceDropdownOpen, setIsReviewServiceDropdownOpen] = useState(false);

  const handleAddServiceToReview = () => {
    const srv = servicesList.find((s) => s.id === selectedReviewServiceId) || servicesList[0];
    if (!srv) return;

    const newId = "sch-" + Date.now();
    const lastService = scheduledServices[scheduledServices.length - 1];
    const nextHour = lastService ? (lastService.slotHour + 1) % 24 : 11;
    const startLabel = hoursList.find((h) => h.hour === nextHour)?.label || "11:00 AM";
    const endHour = (nextHour + 1) % 24;
    const endLabel = hoursList.find((h) => h.hour === endHour)?.label || "12:00 PM";

    const newItem: ScheduledServiceItem = {
      id: newId,
      serviceId: srv.id,
      name: srv.name,
      duration: srv.duration,
      price: srv.price,
      priceNum: srv.priceNum,
      staffId: staffList.find((s) => s.name === "Maria Rodriguez")?.id || staffList[0]?.id || "st6",
      slotHour: nextHour,
      startTime: startLabel,
      endTime: endLabel,
      date: "02/08/2025",
      dayNum: selectedMonthDay,
      dayName: "Tue",
    };

    setScheduledServices((prev) => [...prev, newItem]);
    setIsAddServiceReviewModalOpen(false);
    setIsReviewServiceDropdownOpen(false);
  };

  // Step 3: Payment Actions, Discount & Tip States
  const paymentKebabRef = useRef<View>(null);
  const [isPaymentActionMenuOpen, setIsPaymentActionMenuOpen] = useState(false);
  const [paymentMenuPos, setPaymentMenuPos] = useState({ bottom: 80, right: 16 });

  const handleOpenPaymentMenu = () => {
    if (paymentKebabRef.current && (paymentKebabRef.current as any).measureInWindow) {
      (paymentKebabRef.current as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          if (y) {
            setPaymentMenuPos({
              bottom: Math.max(60, SCREEN_HEIGHT - y + 6),
              right: Math.max(16, SCREEN_WIDTH - (x + width)),
            });
          }
          setIsPaymentActionMenuOpen(true);
        }
      );
    } else {
      setIsPaymentActionMenuOpen(true);
    }
  };

  // Discount State (Cart Discount Modal)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [isDiscountTypeDropdownOpen, setIsDiscountTypeDropdownOpen] = useState(false);
  const [discountInputAmount, setDiscountInputAmount] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: "fixed" | "percentage";
    value: number;
  } | null>(null);

  const handleApplyDiscount = () => {
    const val = parseFloat(discountInputAmount.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid discount amount.");
      return;
    }
    setAppliedDiscount({ type: discountType, value: val });
    setIsDiscountModalOpen(false);
    setDiscountInputAmount("");
    setIsDiscountTypeDropdownOpen(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  // Tip State (Send a Tip Modal)
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipStaffId, setTipStaffId] = useState<string>(
    scheduledServices[0]?.staffId || staffList[0]?.id || "st6"
  );
  const [isTipStaffDropdownOpen, setIsTipStaffDropdownOpen] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState<
    "none" | "10" | "18" | "25" | "35" | "45" | "custom"
  >("none");
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [appliedTip, setAppliedTip] = useState<{
    staffId: string;
    amount: number;
  } | null>(null);

  const handleApplyTip = () => {
    let tipVal = 0;
    if (selectedTipOption === "none") {
      tipVal = 0;
    } else if (selectedTipOption === "custom") {
      tipVal = parseFloat(customTipAmount.replace(",", ".")) || 0;
    } else {
      const pct = parseInt(selectedTipOption, 10);
      tipVal = (totalPriceNum * pct) / 100;
    }

    if (tipVal > 0) {
      setAppliedTip({
        staffId: tipStaffId,
        amount: tipVal,
      });
    } else {
      setAppliedTip(null);
    }
    setIsTipModalOpen(false);
    setIsTipStaffDropdownOpen(false);
  };

  const handleRemoveTip = () => {
    setAppliedTip(null);
    setSelectedTipOption("none");
    setCustomTipAmount("");
  };

  const formatCurrency = (val: number) => {
    if (val % 1 === 0) {
      return "€ " + val;
    }
    return "€ " + val.toFixed(2).replace(".", ",");
  };

  const calculatedDiscountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "fixed") {
      return Math.min(totalPriceNum, appliedDiscount.value);
    }
    return (totalPriceNum * appliedDiscount.value) / 100;
  }, [appliedDiscount, totalPriceNum]);

  const calculatedTipAmount = useMemo(() => {
    return appliedTip ? appliedTip.amount : 0;
  }, [appliedTip]);

  const finalOrderTotal = useMemo(() => {
    const upfrontVal = upfrontPayment ? upfrontPayment.amount : 0;
    return Math.max(0, totalPriceNum - calculatedDiscountAmount + calculatedTipAmount - upfrontVal);
  }, [totalPriceNum, calculatedDiscountAmount, calculatedTipAmount, upfrontPayment]);

  // Remove a scheduled service block
  const handleRemoveScheduledService = (id: string) => {
    setScheduledServices((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle clicking a slot on the Day/Week schedule grid
  const handleCellPress = (staffMember: StaffMember, hourObj: { hour: number; label: string }, dayCol?: string) => {
    const existing = scheduledServices.find((s) => {
      if (activeViewMode === "week") {
        return (s.dayName || "Tue") === (dayCol || "Tue") && s.slotHour === hourObj.hour;
      }
      return s.staffId === staffMember.id && s.slotHour === hourObj.hour;
    });

    if (existing) {
      handleRemoveScheduledService(existing.id);
    } else {
      const srv = servicesList.find((s) => s.id === activeSelectedServiceId) || servicesList[0];
      const newId = `sch-${Date.now()}`;
      const nextHour = (hourObj.hour + 1) % 24;
      const endLabel = hoursList.find((h) => h.hour === nextHour)?.label || hourObj.label;

      const newItem: ScheduledServiceItem = {
        id: newId,
        serviceId: srv.id,
        name: srv.name,
        duration: srv.duration,
        price: srv.price,
        priceNum: srv.priceNum,
        staffId: staffMember.id,
        slotHour: hourObj.hour,
        startTime: hourObj.label,
        endTime: endLabel,
        date: "02/08/2025",
        dayNum: selectedMonthDay,
        dayName: dayCol || "Tue",
      };

      setScheduledServices((prev) => [...prev, newItem]);
    }
  };

  // Handle clicking a date cell on the Month View grid
  const handleMonthDayPress = (dayNum: number) => {
    setSelectedMonthDay(dayNum);
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    setActiveDateText(`Tuesday Sep ${dayStr}`);

    const existingIndex = scheduledServices.findIndex(
      (s) => s.dayNum === dayNum || (dayNum === 2 && s.dayNum === undefined)
    );

    if (existingIndex !== -1) {
      setScheduledServices((prev) =>
        prev.filter((s) => !(s.dayNum === dayNum || (dayNum === 2 && s.dayNum === undefined)))
      );
    } else {
      const srv = servicesList.find((s) => s.id === activeSelectedServiceId) || servicesList[0];
      const newId = `sch-${Date.now()}`;
      const targetStaff = visibleStaff[0] || staffList[0];

      const newItem: ScheduledServiceItem = {
        id: newId,
        serviceId: srv.id,
        name: srv.name,
        duration: srv.duration,
        price: srv.price,
        priceNum: srv.priceNum,
        staffId: targetStaff.id,
        slotHour: 9,
        startTime: "9:00 AM",
        endTime: `9:${srv.duration} AM`,
        date: `${dayStr}/08/2025`,
        dayNum: dayNum,
        dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][(dayNum - 1) % 7],
      };

      setScheduledServices((prev) => [...prev, newItem]);
    }
  };

  // Add a service directly from available services list
  const handleAddServiceToSchedule = (service: ServiceItem, targetStaff?: StaffMember, targetHour?: number) => {
    setActiveSelectedServiceId(service.id);
    const assignedStaff = targetStaff || visibleStaff[0] || staffList[0];
    const newId = `sch-${Date.now()}`;
    const nextHour = targetHour !== undefined
      ? targetHour
      : scheduledServices.length > 0
      ? (scheduledServices[scheduledServices.length - 1].slotHour + 1) % 24
      : 1;
    const startObj = hoursList.find((h) => h.hour === nextHour) || hoursList[1];

    const newItem: ScheduledServiceItem = {
      id: newId,
      serviceId: service.id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      priceNum: service.priceNum,
      staffId: assignedStaff.id,
      slotHour: nextHour,
      startTime: startObj.label,
      endTime: `${(nextHour + 1) % 24}:00`,
      date: "02/08/2025",
      dayNum: selectedMonthDay,
      dayName: "Tue",
    };
    setScheduledServices((prev) => [...prev, newItem]);
  };

  // Assign staff to a service in Review step
  const handleAssignStaff = (staffId: string) => {
    if (staffPickerTargetItemIndex === null) return;
    setScheduledServices((prev) => {
      const next = [...prev];
      if (next[staffPickerTargetItemIndex]) {
        next[staffPickerTargetItemIndex] = {
          ...next[staffPickerTargetItemIndex],
          staffId,
        };
      }
      return next;
    });
    setIsStaffPickerOpen(false);
    setStaffPickerTargetItemIndex(null);
  };

  // Create new service from Modal
  const handleCreateNewService = () => {
    if (!newServiceName.trim()) {
      Alert.alert("Required", "Please enter a service name");
      return;
    }

    const parsedPrice = parseFloat(newServicePrice.replace(/[^0-9.]/g, "")) || 100;
    const parsedDuration = parseInt(newServiceDuration.replace(/[^0-9]/g, ""), 10) || 40;

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      duration: parsedDuration,
      durationText: newServiceDuration.includes("min") ? newServiceDuration : `${parsedDuration} min`,
      price: newServicePrice.includes("€") ? newServicePrice : `€ ${parsedPrice}`,
      priceNum: parsedPrice,
    };

    setServicesList((prev) => [newService, ...prev]);
    setActiveSelectedServiceId(newService.id);
    setIsCreateServiceModalOpen(false);
    setNewServiceName("");
    setNewServiceDuration("40 min");
    setNewServicePrice("€ 170");
  };

  // Save and leave
  const handleSaveAndLeave = () => {
    if (scheduledServices.length === 0) {
      Alert.alert("No Services Added", "Please add at least one service before saving.");
      return;
    }

    const firstService = scheduledServices[0];
    const newAppointment: CalAppointment = {
      id: `appt-${Date.now()}`,
      staffId: firstService.staffId,
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      clientAvatar: selectedClient.avatar,
      service: scheduledServices.map((s) => s.name).join(", "),
      startTime: firstService.startTime,
      endTime: firstService.endTime,
      duration: `${totalDurationMin} min`,
      price: formatCurrency(finalOrderTotal),
      status: status,
      paymentStatus: step === 3 ? "Paid" : upfrontPayment ? "Partially Paid" : "Unpaid",
      notes: note + (upfrontPayment ? " | Upfront: € " + upfrontPayment.amount + " (" + (paymentMethodOptions.find((p) => p.id === upfrontPayment.method)?.label || upfrontPayment.method) + ")" : ""),
      date: "2026-02-13",
    };

    addAppointmentToStore(newAppointment);
    Alert.alert("Success", "Appointment created successfully!", [
      {
        text: "OK",
        onPress: () => router.push("/calendar"),
      },
    ]);
  };

  // Dedicated Segmented Control Component (Guaranteed full room, never clipped)
  const renderViewChangingTabs = (isFullWidth: boolean = false) => (
    <View style={[styles.segmentedControl, isFullWidth && styles.segmentedControlFullWidth]}>
      <TouchableOpacity
        style={[styles.segmentBtn, activeViewMode === "month" && styles.segmentBtnActive]}
        onPress={() => setActiveViewMode("month")}
        activeOpacity={0.7}
      >
        <Text style={[styles.segmentText, activeViewMode === "month" && styles.segmentTextActive]}>
          Month
        </Text>
      </TouchableOpacity>
      <View style={styles.segmentDivider} />
      <TouchableOpacity
        style={[styles.segmentBtn, activeViewMode === "week" && styles.segmentBtnActive]}
        onPress={() => setActiveViewMode("week")}
        activeOpacity={0.7}
      >
        <Text style={[styles.segmentText, activeViewMode === "week" && styles.segmentTextActive]}>
          Week
        </Text>
      </TouchableOpacity>
      <View style={styles.segmentDivider} />
      <TouchableOpacity
        style={[styles.segmentBtn, activeViewMode === "day" && styles.segmentBtnActive]}
        onPress={() => setActiveViewMode("day")}
        activeOpacity={0.7}
      >
        <Text style={[styles.segmentText, activeViewMode === "day" && styles.segmentTextActive]}>
          Day
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Available Services section with DEDICATED SEARCH ROW
  const renderAvailableServicesSection = () => {
    const activeService = servicesList.find((s) => s.id === activeSelectedServiceId);

    return (
      <View style={styles.servicesTopSection}>
        {/* Row 1: Section Title + Add Service Button */}
        <View style={styles.servicesHeaderRow}>
          <Text style={styles.servicesSectionTitle}>Available Services</Text>
          <TouchableOpacity
            style={styles.addServiceDedicatedBtn}
            onPress={() => setIsCreateServiceModalOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={15} color="#635BFF" />
            <Text style={styles.addServiceDedicatedBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Dedicated Full-Width Search Bar */}
        <View style={styles.dedicatedSearchRow}>
          <Ionicons name="search" size={15} color="#94A3B8" />
          <TextInput
            style={styles.dedicatedSearchInput}
            placeholder="Search services..."
            placeholderTextColor="#94A3B8"
            value={serviceSearch}
            onChangeText={setServiceSearch}
          />
          {serviceSearch.length > 0 && (
            <TouchableOpacity
              onPress={() => setServiceSearch("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Row 3: Clear Instructions Banner */}
        <View style={styles.hintBanner}>
          <Ionicons name="information-circle" size={15} color="#4F46E5" />
          <Text style={styles.servicesHintText}>
            {activeService ? (
              <Text>
                Active: <Text style={{ fontFamily: "Manrope_700Bold", color: "#4338CA" }}>{activeService.name}</Text> ({activeService.durationText} • {activeService.price}) — Click any cell below to schedule or remove!
              </Text>
            ) : (
              "Click a service to select, then click any cell on the calendar to schedule."
            )}
          </Text>
        </View>

        {/* Row 4: Services Cards List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesHorizontalContainer}
          style={{ marginTop: 4 }}
        >
          {filteredAvailableServices.map((srv) => {
            const isSelected = activeSelectedServiceId === srv.id;

            return (
              <TouchableOpacity
                key={srv.id}
                style={[
                  styles.serviceCard,
                  isSelected && styles.serviceCardActive,
                ]}
                onPress={() => setActiveSelectedServiceId(srv.id)}
                activeOpacity={0.7}
              >
                {/* Radio selection indicator */}
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={18}
                  color={isSelected ? "#635BFF" : "#9CA3AF"}
                />

                {/* Service Info */}
                <View style={{ flex: 1, paddingVertical: 2 }}>
                  <Text
                    style={[
                      styles.serviceCardTitle,
                      isSelected && styles.serviceCardTitleActive,
                    ]}
                    numberOfLines={1}
                  >
                    {srv.name}
                  </Text>
                  <Text style={styles.serviceCardMeta}>
                    {srv.durationText} • {srv.price}
                  </Text>
                </View>

                {/* Quick Add Button */}
                <TouchableOpacity
                  style={[
                    styles.serviceCardAddBtn,
                    isSelected && styles.serviceCardAddBtnActive,
                  ]}
                  onPress={() => handleAddServiceToSchedule(srv)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={isSelected ? "checkmark" : "add"}
                    size={14}
                    color={isSelected ? "#FFFFFF" : "#635BFF"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render Calendar Grid Content (Day, Week, or Month)
  const renderCalendarGrid = (isFullScreen: boolean = false) => {
    const activeStaffList = visibleStaff;
    const isWeek = activeViewMode === "week";
    const isMonth = activeViewMode === "month";
    const colCount = isWeek ? weekDays.length : activeStaffList.length;
    const totalGridWidth = TIME_COL_WIDTH + colCount * STAFF_COL_WIDTH;

    return (
      <View style={[styles.dayGridContainer, isFullScreen && { flex: 1 }]}>
        {isMonth ? (
          /* ================= BIGGER & CLICKABLE MONTH VIEW ================= */
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
            <View style={styles.monthViewContainer}>
              {/* Month View Instructions Hint */}
              <View style={styles.monthInstructionRow}>
                <Ionicons name="calendar-outline" size={14} color="#635BFF" />
                <Text style={styles.monthInstructionText}>
                  Click empty date to schedule • Click appointment to remove it
                </Text>
              </View>

              {/* Weekday Column Headers */}
              <View style={styles.monthWeekHeaderRow}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <Text key={d} style={styles.monthWeekHeaderCell}>{d}</Text>
                ))}
              </View>

              {/* 30 Days Grid - Large & Fully Clickable */}
              <View style={styles.monthDaysGrid}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                  const dayAppts = scheduledServices.filter(
                    (s) => s.dayNum === dayNum || (dayNum === 2 && s.dayNum === undefined)
                  );
                  const isSelectedDay = selectedMonthDay === dayNum;
                  const hasAppt = dayAppts.length > 0;

                  return (
                    <TouchableOpacity
                      key={dayNum}
                      style={[
                        styles.monthDayCell,
                        isSelectedDay && styles.monthDayCellActive,
                        hasAppt && styles.monthDayCellWithAppt,
                      ]}
                      onPress={() => handleMonthDayPress(dayNum)}
                      activeOpacity={0.65}
                    >
                      {/* Day Header Row */}
                      <View style={styles.monthDayNumRow}>
                        <Text
                          style={[
                            styles.monthDayNumText,
                            isSelectedDay && styles.monthDayNumTextActive,
                          ]}
                        >
                          {dayNum}
                        </Text>
                        <Ionicons
                          name={hasAppt ? "close-circle-outline" : "add-circle-outline"}
                          size={14}
                          color={hasAppt ? "#EF4444" : isSelectedDay ? "#635BFF" : "#CBD5E1"}
                        />
                      </View>

                      {/* Scheduled Appointment Badges inside Cell */}
                      <View style={styles.monthApptsContainer}>
                        {dayAppts.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={styles.monthApptPill}
                            onPress={() => handleRemoveScheduledService(item.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.monthApptPillText} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Ionicons name="close-circle" size={12} color="#EF4444" />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        ) : (
          /* ================= DAY & WEEK VIEW ================= */
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            nestedScrollEnabled={true}
            style={isFullScreen ? { flex: 1 } : undefined}
            contentContainerStyle={isFullScreen ? { flexGrow: 1 } : undefined}
          >
            <View style={[{ width: totalGridWidth }, isFullScreen && { flex: 1 }]}>
              {/* Column Headers */}
              <View style={styles.dayGridStaffHeader}>
                <View style={styles.dayGridTimeHeaderBlank}>
                  <Text style={styles.timeAxisTitle}>Time</Text>
                </View>

                {isWeek ? (
                  weekDays.map((wd) => (
                    <View key={wd.day} style={styles.dayGridStaffColHeader}>
                      <Text style={styles.weekColHeaderDay}>{wd.day}</Text>
                      <Text style={styles.weekColHeaderDate}>{wd.dateNum}</Text>
                    </View>
                  ))
                ) : (
                  activeStaffList.map((staff) => (
                    <View key={staff.id} style={styles.dayGridStaffColHeader}>
                      <Avatar name={staff.name} uri={staff.avatar} size={28} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dayGridStaffName} numberOfLines={1}>
                          {staff.name}
                        </Text>
                        <Text style={styles.dayGridStaffRole} numberOfLines={1}>
                          {staff.role}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Vertical Scroll for Hourly Slots - Expands to fill 100% in fullscreen */}
              <ScrollView
                style={[
                  styles.dayGridBodyScroll,
                  isFullScreen ? { flex: 1 } : { height: 420 },
                ]}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={[styles.dayGridBody, { height: hoursList.length * HOUR_ROW_HEIGHT }]}>
                  {/* Time Labels Column */}
                  <View style={styles.timeLabelsAxis}>
                    {hoursList.map((slot) => (
                      <View key={`label-${slot.hour}`} style={styles.timeSlotLabelCell}>
                        <Text style={styles.timeSlotLabelText}>{slot.label}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Horizontal Grid Divider Lines */}
                  {hoursList.map((slot, idx) => (
                    <View
                      key={`line-${slot.hour}`}
                      style={[styles.timeSlotDividerLine, { top: idx * HOUR_ROW_HEIGHT }]}
                    />
                  ))}

                  {/* Interactive Staff/Day Columns - Click to Place or Remove */}
                  {(isWeek ? weekDays : activeStaffList).map((colItem: any, colIdx: number) => {
                    const colLeft = TIME_COL_WIDTH + colIdx * STAFF_COL_WIDTH;
                    const staffObj = isWeek ? activeStaffList[0] : (colItem as StaffMember);
                    const dayName = isWeek ? (colItem as typeof weekDays[0]).day : "Tue";

                    return (
                      <View
                        key={`col-${isWeek ? colItem.day : colItem.id}`}
                        style={[styles.staffGridCol, { left: colLeft, width: STAFF_COL_WIDTH }]}
                      >
                        {hoursList.map((slot) => {
                          return (
                            <TouchableOpacity
                              key={`slot-${colIdx}-${slot.hour}`}
                              style={[
                                styles.gridSlotCell,
                                { top: slot.hour * HOUR_ROW_HEIGHT },
                              ]}
                              activeOpacity={0.6}
                              onPress={() => handleCellPress(staffObj, slot, dayName)}
                            />
                          );
                        })}
                      </View>
                    );
                  })}

                  {/* Scheduled Appointment Blocks - Tapping removes the appointment */}
                  {scheduledServices.map((item) => {
                    let colIdx = 0;
                    if (isWeek) {
                      colIdx = weekDays.findIndex((w) => w.day === (item.dayName || "Tue"));
                      if (colIdx === -1) colIdx = 1;
                    } else {
                      colIdx = activeStaffList.findIndex((s) => s.id === item.staffId);
                      if (colIdx === -1) colIdx = 0;
                    }

                    const blockLeft = TIME_COL_WIDTH + colIdx * STAFF_COL_WIDTH + 4;
                    const blockTop = item.slotHour * HOUR_ROW_HEIGHT + 4;
                    const blockHeight = HOUR_ROW_HEIGHT - 8;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.75}
                        onPress={() => handleRemoveScheduledService(item.id)}
                        style={[
                          styles.gridScheduledBlock,
                          {
                            top: blockTop,
                            left: blockLeft,
                            width: STAFF_COL_WIDTH - 8,
                            height: blockHeight,
                          },
                        ]}
                      >
                        <Ionicons name="checkmark-circle" size={15} color="#635BFF" />
                        <View style={{ flex: 1, marginHorizontal: 6 }}>
                          <Text style={styles.gridBlockTitle} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.gridBlockMeta} numberOfLines={1}>
                            {item.duration} min • {item.price}
                          </Text>
                        </View>
                        <Ionicons name="close-circle" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      {/* 1. Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#1F2937" />
          <Text style={styles.headerTitle}>Add Appointment</Text>
        </TouchableOpacity>

        {/* Breadcrumb right */}
        <View style={styles.breadcrumb}>
          <Ionicons name="home-outline" size={14} color="#6B7280" />
          <Text style={styles.breadcrumbDivider}>/</Text>
          <Text style={styles.breadcrumbText}>Appointments</Text>
        </View>
      </View>

      {/* 2. Step Bar Navigation - Fixed Row with Details, Review, Payment */}
      <View style={styles.stepBarContainer}>
        <View style={styles.stepBarRow}>
          <TouchableOpacity
            style={[styles.stepTab, step === 1 && styles.stepTabActive]}
            onPress={() => setStep(1)}
            activeOpacity={0.7}
          >
            <View style={[styles.stepIconWrap, step === 1 && styles.stepIconWrapActive]}>
              <Ionicons
                name="calendar-outline"
                size={15}
                color={step === 1 ? "#635BFF" : "#9CA3AF"}
              />
            </View>
            <Text style={[styles.stepTabText, step === 1 && styles.stepTabTextActive]}>
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepTab, step === 2 && styles.stepTabActive]}
            onPress={() => setStep(2)}
            activeOpacity={0.7}
          >
            <View style={[styles.stepIconWrap, step === 2 && styles.stepIconWrapActive]}>
              <Ionicons
                name="reader-outline"
                size={15}
                color={step === 2 ? "#635BFF" : "#9CA3AF"}
              />
            </View>
            <Text style={[styles.stepTabText, step === 2 && styles.stepTabTextActive]}>
              Review
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stepTab, step === 3 && styles.stepTabActive]}
            onPress={() => setStep(3)}
            activeOpacity={0.7}
          >
            <View style={[styles.stepIconWrap, step === 3 && styles.stepIconWrapActive]}>
              <Ionicons
                name="cash-outline"
                size={15}
                color={step === 3 ? "#635BFF" : "#9CA3AF"}
              />
            </View>
            <Text style={[styles.stepTabText, step === 3 && styles.stepTabTextActive]}>
              Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Main Body Scroll */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: safeBottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          /* ================= STEP 1: DETAILS ================= */
          <>
            {/* Client Section Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderWithSearch}>
                <Text style={styles.cardTitle}>Client</Text>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={14} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#9CA3AF"
                    value={clientSearch}
                    onChangeText={setClientSearch}
                  />
                </View>
              </View>

              {/* Action Buttons: Walk-In & Add New Client */}
              <View style={styles.clientActionRow}>
                <TouchableOpacity
                  style={[
                    styles.clientActionCard,
                    selectedClient.name === "Walk-In" && styles.clientActionCardActive,
                  ]}
                  onPress={() =>
                    setSelectedClient({
                      id: "walkin",
                      name: "Walk-In",
                      email: "walkin@salon.com",
                      phone: "N/A",
                      avatar: "",
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.clientActionIconCircle}>
                    <Ionicons name="walk-outline" size={22} color="#635BFF" />
                  </View>
                  <Text style={styles.clientActionLabel}>Walk-In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clientActionCard}
                  onPress={() => {
                    Alert.prompt
                      ? Alert.prompt("Add New Client", "Enter client full name:", (name) => {
                          if (name?.trim()) {
                            const newC = {
                              id: `c-${Date.now()}`,
                              name: name.trim(),
                              email: `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
                              phone: "+1 555 123 4567",
                              avatar: "",
                            };
                            setSelectedClient(newC);
                          }
                        })
                      : Alert.alert("Add New Client", "Please select a client from the list.");
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.clientActionIconCircle}>
                    <Ionicons name="person-add-outline" size={20} color="#635BFF" />
                  </View>
                  <Text style={styles.clientActionLabel}>Add New Client</Text>
                </TouchableOpacity>
              </View>

              {/* Recently Scheduled Clients */}
              <Text style={styles.subSectionTitle}>Recently Scheduled Clients</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentClientsScroll}
              >
                {recentlyScheduledClients.map((client) => {
                  const isSelected = selectedClient.id === client.id;
                  return (
                    <TouchableOpacity
                      key={client.id}
                      style={[
                        styles.recentClientCard,
                        isSelected && styles.recentClientCardActive,
                      ]}
                      onPress={() => setSelectedClient(client)}
                      activeOpacity={0.7}
                    >
                      <Avatar name={client.name} uri={client.avatar} size={44} />
                      <Text style={styles.recentClientName} numberOfLines={1}>
                        {client.name}
                      </Text>
                      <Text style={styles.recentClientPhone} numberOfLines={1}>
                        {client.phone}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Interactive Calendar Card */}
            <View style={styles.card}>
              {/* Calendar Controls Bar - Clean, Multi-Row Layout */}
              <View style={styles.calendarControlBar}>
                {/* Row 1: Team Filter + Date Nav + Fullscreen button */}
                <View style={styles.controlBarRow1}>
                  <TouchableOpacity
                    ref={teamFilterBtnRef}
                    style={styles.teamFilterBtn}
                    onPress={handleOpenStaffFilter}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="people-outline" size={15} color="#526B7A" />
                    <Text style={styles.teamFilterBtnText}>
                      {selectedStaffFilter === "all"
                        ? "All Team"
                        : staffList.find((s) => s.id === selectedStaffFilter)?.name.split(" ")[0] || "Team"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#526B7A" />
                  </TouchableOpacity>

                  <View style={styles.dateNavigator}>
                    <TouchableOpacity
                      style={styles.dateNavArrow}
                      onPress={() => setActiveDateText("Monday Sep 01")}
                    >
                      <Ionicons name="chevron-back" size={15} color="#4B5563" />
                    </TouchableOpacity>
                    <Text style={styles.dateNavText}>{activeDateText}</Text>
                    <TouchableOpacity
                      style={styles.dateNavArrow}
                      onPress={() => setActiveDateText("Wednesday Sep 03")}
                    >
                      <Ionicons name="chevron-forward" size={15} color="#4B5563" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.fullscreenIconBtn}
                    onPress={() => setIsFullScreenCalendar(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="scan-outline" size={18} color="#334155" />
                  </TouchableOpacity>
                </View>

                {/* Row 2: Full-Width View Changing Tabs [Month | Week | Day] */}
                <View style={styles.controlBarRow2}>
                  {renderViewChangingTabs(true)}
                </View>
              </View>

              {/* Main Scheduler Area: Natural Stacked Layout */}
              <View style={styles.stackedSchedulerWrap}>
                {/* Available Services Section on Top */}
                {renderAvailableServicesSection()}

                {/* Full-width Calendar Grid Below */}
                <View style={styles.fullWidthGridWrap}>
                  {renderCalendarGrid(false)}
                </View>
              </View>

              {/* Schedule Footer Bar */}
              <View style={styles.scheduleBottomBar}>
                <Text style={styles.scheduleCountText}>
                  {scheduledServices.length} appointments scheduled
                </Text>
                <View style={styles.scheduleBottomButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveSmallBtn}
                    onPress={handleSaveAndLeave}
                  >
                    <Text style={styles.saveSmallBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Frequency Section Card */}
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Frequency *</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setIsFrequencyModalOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownInputText}>{frequency}</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.frequencyLinkBtn}
                onPress={() => setIsFrequencyModalOpen(true)}
              >
                <Text style={styles.frequencyLinkText}>Set up frequency</Text>
              </TouchableOpacity>
            </View>

            {/* Next Button */}
            <View style={styles.stepFooter}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setStep(2)}
                activeOpacity={0.8}
              >
                <Text style={styles.nextBtnText}>Next</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          /* ================= STEP 2: REVIEW ================= */
          <>
            {/* Basic Informations Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Basic Informations</Text>
                <Text style={styles.cardIdBadge}>#000</Text>
              </View>

              <Text style={styles.fieldSubLabel}>Client</Text>
              <View style={styles.clientProfileRow}>
                <Avatar
                  name={selectedClient.name}
                  uri={selectedClient.avatar}
                  size={46}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.clientProfileName}>{selectedClient.name}</Text>
                  <Text style={styles.clientProfileEmail}>{selectedClient.email}</Text>
                </View>
                <TouchableOpacity style={styles.viewProfileBtn}>
                  <Text style={styles.viewProfileBtnText}>View Profile</Text>
                </TouchableOpacity>
              </View>

              {/* 2x2 Info Grid */}
              <View style={styles.infoGridRow}>
                <View style={styles.infoGridCol}>
                  <Text style={styles.infoGridLabel}>Date</Text>
                  <Text style={styles.infoGridValue}>02/08/2025</Text>
                </View>
                <View style={styles.infoGridCol}>
                  <Text style={styles.infoGridLabel}>Time</Text>
                  <Text style={styles.infoGridValue}>11:00 - 11:15</Text>
                </View>
              </View>

              <View style={[styles.infoGridRow, { marginTop: 14 }]}>
                <View style={styles.infoGridCol}>
                  <Text style={styles.infoGridLabel}>Status</Text>
                  <TouchableOpacity
                    style={styles.statusPillBtn}
                    onPress={() => setIsStatusDropdownOpen(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.statusPillText}>{status}</Text>
                    <Ionicons name="chevron-down" size={14} color="#635BFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.infoGridCol}>
                  <Text style={styles.infoGridLabel}>Repeating</Text>
                  <TouchableOpacity
                    style={[
                      styles.repeatingBtn,
                      isRepeating && styles.repeatingBtnActive,
                    ]}
                    onPress={() => setIsRepeating(!isRepeating)}
                  >
                    <Text
                      style={[
                        styles.repeatingBtnText,
                        isRepeating && styles.repeatingBtnTextActive,
                      ]}
                    >
                      {isRepeating ? "Repeating Set" : "Set as Repeating"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Note Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Note</Text>
              <TextInput
                ref={noteInputRef}
                style={styles.noteTextArea}
                placeholder="Add a note..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Review Appointment Services Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Review Appointment</Text>

              {/* Services Table List */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableColHeader, { flex: 2 }]}>Service</Text>
                <Text style={[styles.tableColHeader, { flex: 1.5 }]}>Date</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Price</Text>
                <Text style={[styles.tableColHeader, { flex: 1.2 }]}>Start Time</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Duration</Text>
                <Text style={[styles.tableColHeader, { flex: 2.2 }]}>Employee</Text>
                <Text style={[styles.tableColHeader, { width: 30 }]}></Text>
              </View>

              {scheduledServices.map((item, idx) => {
                const staff = staffList.find((s) => s.id === item.staffId) || staffList[0];
                return (
                  <View key={item.id} style={styles.tableItemRow}>
                    <Text style={[styles.tableItemText, { flex: 2, fontFamily: "Manrope_700Bold" }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.tableItemText, { flex: 1.5 }]}>{item.date}</Text>
                    <Text style={[styles.tableItemText, { flex: 1 }]}>{item.price}</Text>
                    <Text style={[styles.tableItemText, { flex: 1.2 }]}>{item.startTime}</Text>
                    <Text style={[styles.tableItemText, { flex: 1 }]}>{item.duration} min</Text>

                    <TouchableOpacity
                      style={[styles.tableEmployeeBtn, { flex: 2.2 }]}
                      onPress={() => {
                        setStaffPickerTargetItemIndex(idx);
                        setIsStaffPickerOpen(true);
                      }}
                    >
                      <Avatar name={staff.name} uri={staff.avatar} size={20} />
                      <Text style={styles.tableEmployeeName} numberOfLines={1}>
                        {staff.name}
                      </Text>
                      <Ionicons name="chevron-down" size={13} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.trashBtn}
                      onPress={() => handleRemoveScheduledService(item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Table Bottom Controls */}
              <View style={styles.tableBottomControlsRow}>
                <TouchableOpacity
                  style={styles.addServicePillBtn}
                  onPress={() => {
                    setSelectedReviewServiceId(servicesList[0]?.id || "srv-1");
                    setIsReviewServiceDropdownOpen(false);
                    setIsAddServiceReviewModalOpen(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={16} color="#635BFF" />
                  <Text style={styles.addServicePillText}>Add Service</Text>
                </TouchableOpacity>

                <View style={styles.totalTimePill}>
                  <Text style={styles.totalTimeLabel}>Total Time</Text>
                  <Text style={styles.totalTimeBadge}>{totalDurationMin} min</Text>
                </View>
              </View>

              {/* Upfront Payment Row (if requested) */}
              {upfrontPayment && (
                <View style={styles.upfrontReviewRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name="card-outline" size={15} color="#635BFF" />
                    <Text style={styles.upfrontReviewLabel}>Upfront Payment Requested:</Text>
                    <Text style={styles.upfrontReviewValue}>
                      € {upfrontPayment.amount} ({paymentMethodOptions.find((p) => p.id === upfrontPayment.method)?.label || upfrontPayment.method})
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setUpfrontPayment(null)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="close-circle" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Total Row */}
              <View style={styles.tableTotalRow}>
                <Text style={styles.totalRowLabel}>Total</Text>
                <Text style={styles.totalRowValue}>€ {totalPriceNum}</Text>
              </View>
            </View>

            {/* Bottom Actions Bar */}
            <View style={styles.stepActionBar}>
              <TouchableOpacity
                style={styles.actionBackBtn}
                onPress={() => setStep(1)}
              >
                <Text style={styles.actionBackBtnText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.actionRightButtons}>
                <TouchableOpacity
                  ref={reviewKebabRef}
                  style={styles.kebabBtn}
                  onPress={handleOpenReviewMenu}
                  activeOpacity={0.7}
                >
                  <Ionicons name="ellipsis-vertical" size={17} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkoutSecondaryBtn}
                  onPress={() => setStep(3)}
                >
                  <Text style={styles.checkoutSecondaryBtnText}>Checkout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveAndLeaveBtn}
                  onPress={handleSaveAndLeave}
                >
                  <Text style={styles.saveAndLeaveBtnText}>Save and Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {step === 3 && (
          /* ================= STEP 3: PAYMENT ================= */
          <>
            {/* Payment Methods Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Payment Methods</Text>
              <View style={styles.paymentMethodsGrid}>
                {paymentMethodOptions.map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[
                        styles.paymentMethodCard,
                        isSelected && styles.paymentMethodCardActive,
                      ]}
                      onPress={() => setSelectedPaymentMethod(method.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.paymentMethodIconCircle,
                          isSelected && styles.paymentMethodIconCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={method.icon}
                          size={24}
                          color={isSelected ? "#635BFF" : "#6B7280"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.paymentMethodLabel,
                          isSelected && styles.paymentMethodLabelActive,
                        ]}
                      >
                        {method.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Services Summary Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Services</Text>

              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableColHeader, { flex: 2 }]}>Service</Text>
                <Text style={[styles.tableColHeader, { flex: 1.8 }]}>Date</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Price</Text>
                <Text style={[styles.tableColHeader, { flex: 1.8 }]}>Start Time</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Duration</Text>
                <Text style={[styles.tableColHeader, { flex: 2.2 }]}>Employee</Text>
              </View>

              {scheduledServices.map((item, itemIdx) => {
                const staff = staffList.find((s) => s.id === item.staffId) || staffList[0];
                return (
                  <View key={item.id} style={styles.tableItemRow}>
                    <Text style={[styles.tableItemText, { flex: 2, fontFamily: "Manrope_700Bold" }]}>
                      {item.name}
                    </Text>
                    <View style={[{ flex: 1.8, flexDirection: "row", alignItems: "center", gap: 4 }]}>
                      <Text style={styles.tableItemText}>{item.date}</Text>
                      <Ionicons name="calendar-outline" size={13} color="#9CA3AF" />
                    </View>
                    <Text style={[styles.tableItemText, { flex: 1 }]}>{item.price}</Text>
                    <View style={[{ flex: 1.8, flexDirection: "row", alignItems: "center", gap: 4 }]}>
                      <Text style={styles.tableItemText}>{item.startTime}</Text>
                      <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                    </View>
                    <Text style={[styles.tableItemText, { flex: 1 }]}>{item.duration} min</Text>
                    <TouchableOpacity
                      style={[styles.tableEmployeeBtn, { flex: 2.2 }]}
                      onPress={() => {
                        setStaffPickerTargetItemIndex(itemIdx);
                        setIsStaffPickerOpen(true);
                      }}
                      activeOpacity={0.7}
                    >
                      <Avatar name={staff.name} uri={staff.avatar} size={20} />
                      <Text style={styles.tableEmployeeName} numberOfLines={1}>
                        {staff.name}
                      </Text>
                      <Ionicons name="chevron-down" size={13} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Order Summary Box */}
              <View style={styles.orderSummaryBox}>
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Tax</Text>
                  <Text style={styles.orderSummaryVal}>0</Text>
                </View>

                {/* Discount Row */}
                <View style={styles.orderSummaryRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={styles.orderSummaryLabel}>Discount</Text>
                    {appliedDiscount ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <TouchableOpacity
                          onPress={() => setIsDiscountModalOpen(true)}
                          style={styles.discountAppliedBadge}
                        >
                          <Text style={styles.discountAppliedBadgeText}>
                            {appliedDiscount.type === "fixed" ? "Fixed € " + appliedDiscount.value : appliedDiscount.value + "%"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleRemoveDiscount}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Ionicons name="close-circle" size={15} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => setIsDiscountModalOpen(true)}>
                        <Text style={styles.addDiscountLink}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.orderSummaryVal}>
                    {appliedDiscount ? "- " + formatCurrency(calculatedDiscountAmount) : "0"}
                  </Text>
                </View>

                {/* Tip Row (if applied) */}
                {appliedTip && appliedTip.amount > 0 && (
                  <View style={styles.orderSummaryRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.orderSummaryLabel}>
                        {"Tip (" + (staffList.find((s) => s.id === appliedTip.staffId)?.name || "Employee") + ")"}
                      </Text>
                      <TouchableOpacity
                        onPress={handleRemoveTip}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="close-circle" size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.orderSummaryVal, { color: "#16A34A" }]}>
                      {"+ " + formatCurrency(calculatedTipAmount)}
                    </Text>
                  </View>
                )}

                {/* Upfront Payment Row (if applied) */}
                {upfrontPayment && (
                  <View style={styles.orderSummaryRow}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.orderSummaryLabel}>
                        {"Upfront (" + (paymentMethodOptions.find((p) => p.id === upfrontPayment.method)?.label || upfrontPayment.method) + ")"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setUpfrontPayment(null)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Ionicons name="close-circle" size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.orderSummaryVal, { color: "#16A34A" }]}>
                      {"- " + formatCurrency(upfrontPayment.amount)}
                    </Text>
                  </View>
                )}

                {/* Total Row */}
                <View style={[styles.orderSummaryRow, styles.orderSummaryTotalRow]}>
                  <Text style={styles.orderSummaryTotalLabel}>Total</Text>
                  <Text style={styles.orderSummaryTotalVal}>
                    {formatCurrency(finalOrderTotal)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.stepActionBar}>
              <TouchableOpacity
                style={styles.actionBackBtn}
                onPress={() => setStep(2)}
              >
                <Text style={styles.actionBackBtnText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.actionRightButtons}>
                <TouchableOpacity
                  ref={paymentKebabRef}
                  style={styles.kebabBtn}
                  onPress={handleOpenPaymentMenu}
                  activeOpacity={0.7}
                >
                  <Ionicons name="ellipsis-vertical" size={17} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveAndLeaveBtn}
                  onPress={handleSaveAndLeave}
                >
                  <Text style={styles.saveAndLeaveBtnText}>Save and Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* ================= FULLSCREEN CALENDAR MODAL ================= */}
      <Modal visible={isFullScreenCalendar} animationType="slide">
        {/* paddingBottom uses insets.bottom without extra large padding so grid reaches screen bottom */}
        <View style={[styles.fullScreenModalContainer, { paddingTop: safeTop, paddingBottom: Math.max(insets.bottom, 6) }]}>
          {/* Header of Full Screen Modal - Multi-row, Spacious & Never Cramped */}
          <View style={styles.fullScreenModalHeader}>
            {/* Row 1: Back/Close + Title + Done Button */}
            <View style={styles.fullScreenTopRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <TouchableOpacity
                  style={styles.fullScreenCloseBtn}
                  onPress={() => setIsFullScreenCalendar(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.fullScreenTitle}>Calendar Scheduler</Text>
              </View>

              <TouchableOpacity
                style={styles.fullScreenDoneBtn}
                onPress={() => setIsFullScreenCalendar(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.fullScreenDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: Dedicated Full-Width View Switcher [Month | Week | Day] */}
            <View style={styles.fullScreenViewSwitcherRow}>
              {renderViewChangingTabs(true)}
            </View>
          </View>

          {/* Available Services Tray in Fullscreen */}
          {renderAvailableServicesSection()}

          {/* Full Screen Calendar Content: fills 100% of the screen height */}
          <View style={{ flex: 1, marginTop: 4 }}>
            {renderCalendarGrid(true)}
          </View>
        </View>
      </Modal>

      {/* ================= EXACT "ADD NEW SERVICE" MODAL ================= */}
      <Modal visible={isCreateServiceModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsCreateServiceModalOpen(false)}
        >
          <View
            style={styles.createServiceModalCard}
            onStartShouldSetResponder={() => true}
          >
            {/* Modal Header */}
            <View style={styles.createServiceModalHeader}>
              <Text style={styles.createServiceModalTitle}>Add New Service</Text>
              <TouchableOpacity
                onPress={() => setIsCreateServiceModalOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Service Name Field */}
            <View style={styles.createServiceFieldGroup}>
              <Text style={styles.createServiceLabel}>Service Name</Text>
              <TextInput
                style={styles.createServiceInput}
                placeholder="e.g. Haircut, Facial, Coloring"
                placeholderTextColor="#9CA3AF"
                value={newServiceName}
                onChangeText={setNewServiceName}
              />
            </View>

            {/* Duration & Price Fields Row */}
            <View style={styles.createServiceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.createServiceLabel}>Duration</Text>
                <TextInput
                  style={styles.createServiceInput}
                  placeholder="40 min"
                  placeholderTextColor="#9CA3AF"
                  value={newServiceDuration}
                  onChangeText={setNewServiceDuration}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.createServiceLabel}>Price</Text>
                <TextInput
                  style={styles.createServiceInput}
                  placeholder="€ 170"
                  placeholderTextColor="#9CA3AF"
                  value={newServicePrice}
                  onChangeText={setNewServicePrice}
                />
              </View>
            </View>

            {/* Modal Bottom Actions */}
            <View style={styles.createServiceModalFooter}>
              <TouchableOpacity
                style={styles.createServiceCancelBtn}
                onPress={() => setIsCreateServiceModalOpen(false)}
              >
                <Text style={styles.createServiceCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createServiceSubmitBtn}
                onPress={handleCreateNewService}
              >
                <Text style={styles.createServiceSubmitText}>Add Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= TEAM FILTER DROPDOWN (Positioned directly below the button, as in Image 2) ================= */}
      <Modal visible={isStaffFilterModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsStaffFilterModalOpen(false)}
        >
          <View
            style={[
              styles.anchoredDropdownCard,
              {
                top: staffFilterMenuPos.top,
                left: staffFilterMenuPos.left,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.dropdownTitle}>Filter Team</Text>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedStaffFilter === "all" && styles.dropdownItemActive,
              ]}
              onPress={() => {
                setSelectedStaffFilter("all");
                setIsStaffFilterModalOpen(false);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.dropdownIconCircle, selectedStaffFilter === "all" && styles.dropdownIconCircleActive]}>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={selectedStaffFilter === "all" ? "#635BFF" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedStaffFilter === "all" && styles.dropdownItemTextActive,
                ]}
              >
                All Team
              </Text>
              {selectedStaffFilter === "all" && (
                <Ionicons name="checkmark" size={16} color="#635BFF" />
              )}
            </TouchableOpacity>

            {staffList.map((s) => {
              const isSelected = selectedStaffFilter === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedStaffFilter(s.id);
                    setIsStaffFilterModalOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Avatar name={s.name} uri={s.avatar} size={26} />
                  <Text
                    style={[
                      styles.dropdownItemText,
                      isSelected && styles.dropdownItemTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {s.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#635BFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={isStatusDropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsStatusDropdownOpen(false)}
        >
          <View style={styles.modalMenuCard}>
            <Text style={styles.modalMenuTitle}>Select Status</Text>
            {(["Booked", "Confirmed", "Arrived", "Started", "Completed", "Canceled"] as const).map(
              (st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.modalMenuItem, status === st && styles.modalMenuItemActive]}
                  onPress={() => {
                    setStatus(st);
                    setIsStatusDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalMenuItemText,
                      status === st && styles.modalMenuItemTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                  {status === st && <Ionicons name="checkmark" size={16} color="#635BFF" />}
                </TouchableOpacity>
              )
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Frequency Picker Custom Sheet (Replaces middle popup modal from Image 1) */}
      <CustomBottomSheet
        visible={isFrequencyModalOpen}
        onClose={() => setIsFrequencyModalOpen(false)}
        title="Select Frequency"
      >
        <View style={styles.sheetContentList}>
          {[
            "Doesn't repeat",
            "Every day",
            "Every week on Tuesday",
            "Every month on 1st Tuesday",
            "Custom...",
          ].map((f) => {
            const isSelected = frequency === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.sheetMenuItem, isSelected && styles.sheetMenuItemActive]}
                onPress={() => {
                  setFrequency(f);
                  setIsFrequencyModalOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sheetMenuItemText,
                    isSelected && styles.sheetMenuItemTextActive,
                  ]}
                >
                  {f}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={18} color="#635BFF" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </CustomBottomSheet>

      {/* Staff Picker Modal (Review step) */}
      <Modal visible={isStaffPickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsStaffPickerOpen(false)}
        >
          <View style={styles.modalMenuCard}>
            <Text style={styles.modalMenuTitle}>Assign Staff</Text>
            {staffList.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.modalMenuItem}
                onPress={() => handleAssignStaff(s.id)}
              >
                <Avatar name={s.name} uri={s.avatar} size={24} />
                <Text style={[styles.modalMenuItemText, { marginLeft: 10 }]}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= REVIEW ACTIONS POPOVER MENU (Add a Note / Request upfront payment) ================= */}
      <Modal visible={isReviewActionMenuOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsReviewActionMenuOpen(false)}
        >
          <View
            style={[
              styles.paymentPopoverCard,
              {
                width: 220,
                bottom: reviewMenuPos.bottom,
                right: reviewMenuPos.right,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.paymentPopoverItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsReviewActionMenuOpen(false);
                noteInputRef.current?.focus();
              }}
            >
              <Ionicons name="document-text-outline" size={17} color="#4B5563" />
              <Text style={styles.paymentPopoverItemText}>Add a Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentPopoverItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsReviewActionMenuOpen(false);
                setIsUpfrontPaymentModalOpen(true);
              }}
            >
              <Ionicons name="card-outline" size={17} color="#4B5563" />
              <Text style={styles.paymentPopoverItemText}>Request upfront payment</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= REQUEST UPFRONT PAYMENT MODAL (Image 2) ================= */}
      <Modal visible={isUpfrontPaymentModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsUpfrontPaymentModalOpen(false)}
        >
          <View
            style={styles.upfrontModalCard}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.upfrontModalHeader}>
              <Text style={styles.upfrontModalTitle}>Request upfront payment</Text>
              <TouchableOpacity
                onPress={() => setIsUpfrontPaymentModalOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Amount Field */}
            <View style={{ marginBottom: 18 }}>
              <Text style={styles.upfrontFieldLabel}>Ammount *</Text>
              <TextInput
                style={styles.upfrontAmountInput}
                placeholder="Enter ammount"
                placeholderTextColor="#9CA3AF"
                value={upfrontAmountInput}
                onChangeText={setUpfrontAmountInput}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Payment Methods 2x2 Grid */}
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.upfrontFieldLabel}>Payment Methods *</Text>
              <View style={styles.upfrontMethodsGrid}>
                {paymentMethodOptions.map((method) => {
                  const isSelected = selectedUpfrontMethod === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[
                        styles.upfrontMethodCard,
                        isSelected && styles.upfrontMethodCardActive,
                      ]}
                      onPress={() => setSelectedUpfrontMethod(method.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.upfrontMethodIconCircle,
                          isSelected && styles.upfrontMethodIconCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={method.icon}
                          size={24}
                          color={isSelected ? "#635BFF" : "#635BFF"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.upfrontMethodLabel,
                          isSelected && styles.upfrontMethodLabelActive,
                        ]}
                      >
                        {method.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Save Button */}
            <View style={styles.upfrontModalFooter}>
              <TouchableOpacity
                style={styles.upfrontSaveBtn}
                onPress={handleSaveUpfrontPayment}
                activeOpacity={0.8}
              >
                <Text style={styles.upfrontSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= ADD SERVICE REVIEW MODAL (Image 3) ================= */}
      <Modal visible={isAddServiceReviewModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => {
            setIsAddServiceReviewModalOpen(false);
            setIsReviewServiceDropdownOpen(false);
          }}
        >
          <View
            style={styles.addServiceReviewModalCard}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.addServiceReviewHeader}>
              <Text style={styles.addServiceReviewTitle}>Add Service</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsAddServiceReviewModalOpen(false);
                  setIsReviewServiceDropdownOpen(false);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Service Dropdown Selector */}
            <View style={{ marginBottom: 28 }}>
              <Text style={styles.addServiceReviewFieldLabel}>Service *</Text>
              <TouchableOpacity
                style={[
                  styles.addServiceReviewTrigger,
                  isReviewServiceDropdownOpen && styles.addServiceReviewTriggerActive,
                ]}
                onPress={() => setIsReviewServiceDropdownOpen(!isReviewServiceDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.addServiceReviewTriggerText}>
                  {servicesList.find((s) => s.id === selectedReviewServiceId)?.name || "Select Service"}
                </Text>
                <Ionicons
                  name={isReviewServiceDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {/* Services Dropdown Menu */}
              {isReviewServiceDropdownOpen && (
                <View style={styles.addServiceReviewMenu}>
                  {servicesList.map((s) => {
                    const isSelected = selectedReviewServiceId === s.id;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[
                          styles.addServiceReviewMenuItem,
                          isSelected && styles.addServiceReviewMenuItemActive,
                        ]}
                        onPress={() => {
                          setSelectedReviewServiceId(s.id);
                          setIsReviewServiceDropdownOpen(false);
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.addServiceReviewMenuItemText,
                              isSelected && styles.addServiceReviewMenuItemTextActive,
                            ]}
                          >
                            {s.name}
                          </Text>
                          <Text style={styles.addServiceReviewMenuItemSub}>
                            {s.durationText} • {s.price}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color="#635BFF" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Save Button */}
            <View style={styles.addServiceReviewFooter}>
              <TouchableOpacity
                style={styles.addServiceReviewSaveBtn}
                onPress={handleAddServiceToReview}
                activeOpacity={0.8}
              >
                <Text style={styles.addServiceReviewSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= PAYMENT ACTIONS POPOVER MENU (Add a Tip / Add a Discount) ================= */}
      <Modal visible={isPaymentActionMenuOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsPaymentActionMenuOpen(false)}
        >
          <View
            style={[
              styles.paymentPopoverCard,
              {
                bottom: paymentMenuPos.bottom,
                right: paymentMenuPos.right,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.paymentPopoverItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsPaymentActionMenuOpen(false);
                setIsTipModalOpen(true);
              }}
            >
              <Ionicons name="bag-handle-outline" size={17} color="#4B5563" />
              <Text style={styles.paymentPopoverItemText}>Add a Tip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentPopoverItem}
              activeOpacity={0.7}
              onPress={() => {
                setIsPaymentActionMenuOpen(false);
                setIsDiscountModalOpen(true);
              }}
            >
              <Ionicons name="pricetag-outline" size={17} color="#4B5563" />
              <Text style={styles.paymentPopoverItemText}>Add a Discount</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= ADD CART DISCOUNT MODAL ================= */}
      <Modal visible={isDiscountModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => {
            setIsDiscountModalOpen(false);
            setIsDiscountTypeDropdownOpen(false);
          }}
        >
          <View
            style={styles.discountModalCard}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.discountModalHeader}>
              <Text style={styles.discountModalTitle}>Add Cart Discount</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsDiscountModalOpen(false);
                  setIsDiscountTypeDropdownOpen(false);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.discountModalSubtitle}>
              Taxes will be recalculated after the discount has been applied.
            </Text>

            {/* Row: Type * and Amount * */}
            <View style={styles.discountFieldsRow}>
              {/* Type Column */}
              <View style={styles.discountCol}>
                <Text style={styles.discountFieldLabel}>Type *</Text>
                <TouchableOpacity
                  style={[
                    styles.discountDropdownTrigger,
                    isDiscountTypeDropdownOpen && styles.discountDropdownTriggerActive,
                  ]}
                  onPress={() => setIsDiscountTypeDropdownOpen(!isDiscountTypeDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.discountDropdownTriggerText}>
                    {discountType === "fixed" ? "Fixed Amount" : "Percentage"}
                  </Text>
                  <Ionicons
                    name={isDiscountTypeDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={15}
                    color={isDiscountTypeDropdownOpen ? "#635BFF" : "#9CA3AF"}
                  />
                </TouchableOpacity>

                {/* Type Dropdown Menu */}
                {isDiscountTypeDropdownOpen && (
                  <View style={styles.discountTypeMenu}>
                    <TouchableOpacity
                      style={[
                        styles.discountTypeMenuItem,
                        discountType === "percentage" && styles.discountTypeMenuItemActive,
                      ]}
                      onPress={() => {
                        setDiscountType("percentage");
                        setIsDiscountTypeDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.discountTypeMenuItemText,
                          discountType === "percentage" && styles.discountTypeMenuItemTextActive,
                        ]}
                      >
                        Percentage
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.discountTypeMenuItem,
                        discountType === "fixed" && styles.discountTypeMenuItemActive,
                      ]}
                      onPress={() => {
                        setDiscountType("fixed");
                        setIsDiscountTypeDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.discountTypeMenuItemText,
                          discountType === "fixed" && styles.discountTypeMenuItemTextActive,
                        ]}
                      >
                        Fixed Amount
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Amount Column */}
              <View style={styles.discountCol}>
                <Text style={styles.discountFieldLabel}>
                  {discountType === "fixed" ? "Amount (€) *" : "Amount (%) *"}
                </Text>
                <TextInput
                  style={styles.discountAmountInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#9CA3AF"
                  value={discountInputAmount}
                  onChangeText={setDiscountInputAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Footer / Submit Button */}
            <View style={styles.discountModalFooter}>
              <TouchableOpacity
                style={styles.addDiscountSubmitBtn}
                onPress={handleApplyDiscount}
                activeOpacity={0.8}
              >
                <Text style={styles.addDiscountSubmitBtnText}>Add Discount</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= SEND A TIP MODAL ================= */}
      <Modal visible={isTipModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => {
            setIsTipModalOpen(false);
            setIsTipStaffDropdownOpen(false);
          }}
        >
          <View
            style={styles.tipModalCard}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View style={styles.tipModalHeader}>
              <Text style={styles.tipModalTitle}>Send a Tip</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsTipModalOpen(false);
                  setIsTipStaffDropdownOpen(false);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Employee Selector */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.tipFieldLabel}>Employee *</Text>
              <TouchableOpacity
                style={[
                  styles.tipStaffTrigger,
                  isTipStaffDropdownOpen && styles.tipStaffTriggerActive,
                ]}
                onPress={() => setIsTipStaffDropdownOpen(!isTipStaffDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.tipStaffTriggerText}>
                  {staffList.find((s) => s.id === tipStaffId)?.name || "Maria Rodriguez"}
                </Text>
                <Ionicons
                  name={isTipStaffDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {/* Staff Dropdown list */}
              {isTipStaffDropdownOpen && (
                <View style={styles.tipStaffMenu}>
                  {staffList.map((s) => {
                    const isSelected = tipStaffId === s.id;
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[
                          styles.tipStaffMenuItem,
                          isSelected && styles.tipStaffMenuItemActive,
                        ]}
                        onPress={() => {
                          setTipStaffId(s.id);
                          setIsTipStaffDropdownOpen(false);
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Avatar name={s.name} uri={s.avatar} size={24} />
                          <Text
                            style={[
                              styles.tipStaffMenuItemText,
                              isSelected && styles.tipStaffMenuItemTextActive,
                            ]}
                          >
                            {s.name}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color="#635BFF" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Amount Header */}
            <Text style={styles.tipFieldLabel}>Amount *</Text>

            {/* Tip Option Grid (3 Columns) */}
            <View style={styles.tipGrid}>
              {/* No Tip */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "none" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("none")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "none" && styles.tipGridCardTitleActive,
                  ]}
                >
                  No Tip
                </Text>
              </TouchableOpacity>

              {/* 10% */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "10" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("10")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "10" && styles.tipGridCardTitleActive,
                  ]}
                >
                  10%
                </Text>
                <Text style={styles.tipGridCardSub}>
                  {formatCurrency((totalPriceNum * 10) / 100)}
                </Text>
              </TouchableOpacity>

              {/* 18% */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "18" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("18")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "18" && styles.tipGridCardTitleActive,
                  ]}
                >
                  18%
                </Text>
                <Text style={styles.tipGridCardSub}>
                  {formatCurrency((totalPriceNum * 18) / 100)}
                </Text>
              </TouchableOpacity>

              {/* 25% */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "25" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("25")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "25" && styles.tipGridCardTitleActive,
                  ]}
                >
                  25%
                </Text>
                <Text style={styles.tipGridCardSub}>
                  {formatCurrency((totalPriceNum * 25) / 100)}
                </Text>
              </TouchableOpacity>

              {/* 35% */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "35" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("35")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "35" && styles.tipGridCardTitleActive,
                  ]}
                >
                  35%
                </Text>
                <Text style={styles.tipGridCardSub}>
                  {formatCurrency((totalPriceNum * 35) / 100)}
                </Text>
              </TouchableOpacity>

              {/* 45% */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "45" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("45")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "45" && styles.tipGridCardTitleActive,
                  ]}
                >
                  45%
                </Text>
                <Text style={styles.tipGridCardSub}>
                  {formatCurrency((totalPriceNum * 45) / 100)}
                </Text>
              </TouchableOpacity>

              {/* Custom Tip */}
              <TouchableOpacity
                style={[
                  styles.tipGridCard,
                  selectedTipOption === "custom" && styles.tipGridCardActive,
                ]}
                onPress={() => setSelectedTipOption("custom")}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tipGridCardTitle,
                    selectedTipOption === "custom" && styles.tipGridCardTitleActive,
                  ]}
                >
                  Custom Tip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Tip Input if selected */}
            {selectedTipOption === "custom" && (
              <View style={styles.customTipInputWrap}>
                <Text style={styles.tipFieldLabel}>Custom Tip Amount (€) *</Text>
                <TextInput
                  style={styles.discountAmountInput}
                  placeholder="e.g. 15"
                  placeholderTextColor="#9CA3AF"
                  value={customTipAmount}
                  onChangeText={setCustomTipAmount}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            )}

            {/* Footer Save Button */}
            <View style={styles.tipModalFooter}>
              <TouchableOpacity
                style={styles.tipSaveBtn}
                onPress={handleApplyTip}
                activeOpacity={0.8}
              >
                <Text style={styles.tipSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFF2F6",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbDivider: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  breadcrumbText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#635BFF",
  },

  /* Step Bar - Fixed Row with Details, Review, Payment */
  stepBarContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF2F6",
  },
  stepBarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  stepTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },
  stepTabActive: {
    backgroundColor: "#EEF2FF",
  },
  stepIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconWrapActive: {
    backgroundColor: "#E0E7FF",
  },
  stepTabText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#6B7280",
  },
  stepTabTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#4F46E5",
  },

  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  cardHeaderWithSearch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
    width: 140,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#1F2937",
    padding: 0,
  },
  clientActionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  clientActionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    gap: 8,
  },
  clientActionCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  clientActionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientActionLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  subSectionTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  recentClientsScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  recentClientCard: {
    width: 130,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  recentClientCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  recentClientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#1F2937",
    textAlign: "center",
  },
  recentClientPhone: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
  },

  /* Calendar Control Bar - Multi-Row Spacious Layout */
  calendarControlBar: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF2F6",
    gap: 10,
  },
  controlBarRow1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlBarRow2: {
    width: "100%",
  },
  teamFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  teamFilterBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#374151",
  },
  dateNavigator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateNavArrow: {
    padding: 4,
  },
  dateNavText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#4F46E5",
  },

  /* Full-Room Segmented Control [Month | Week | Day] */
  segmentedControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    height: 38,
    overflow: "hidden",
  },
  segmentedControlFullWidth: {
    width: "100%",
  },
  segmentBtn: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  segmentBtnActive: {
    backgroundColor: "#E0E7FF",
  },
  segmentDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E2E8F0",
  },
  segmentText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#2563EB",
  },
  segmentTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  fullscreenIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Natural Stacked Layout (Services on top, Calendar full width below) */
  stackedSchedulerWrap: {
    marginTop: 12,
    gap: 12,
  },
  servicesTopSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  servicesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  servicesSectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1E293B",
  },
  addServiceDedicatedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  addServiceDedicatedBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11.5,
    color: "#635BFF",
  },

  /* DEDICATED SEARCH BAR ROW */
  dedicatedSearchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    marginBottom: 8,
    gap: 8,
  },
  dedicatedSearchInput: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#1E293B",
    padding: 0,
  },

  hintBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  servicesHintText: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#475569",
  },
  servicesHorizontalContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minWidth: 155,
    gap: 8,
  },
  serviceCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  serviceCardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#1E293B",
  },
  serviceCardTitleActive: {
    color: "#4F46E5",
  },
  serviceCardMeta: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#64748B",
  },
  serviceCardAddBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceCardAddBtnActive: {
    backgroundColor: "#635BFF",
  },

  /* Full Width Grid Wrap */
  fullWidthGridWrap: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  /* Day Grid & Time Column */
  dayGridContainer: {
    backgroundColor: "#FFFFFF",
  },
  dayGridStaffHeader: {
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  dayGridTimeHeaderBlank: {
    width: TIME_COL_WIDTH,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  timeAxisTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#94A3B8",
  },
  dayGridStaffColHeader: {
    width: STAFF_COL_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  dayGridStaffName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11.5,
    color: "#1E293B",
  },
  dayGridStaffRole: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#64748B",
  },
  weekColHeaderDay: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#1E293B",
    marginRight: 4,
  },
  weekColHeaderDate: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#635BFF",
  },
  dayGridBodyScroll: {
    backgroundColor: "#FFFFFF",
  },
  dayGridBody: {
    position: "relative",
  },
  timeLabelsAxis: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: TIME_COL_WIDTH,
    backgroundColor: "#F8FAFC",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  timeSlotLabelCell: {
    height: HOUR_ROW_HEIGHT,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  timeSlotLabelText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },
  timeSlotDividerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  staffGridCol: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  gridSlotCell: {
    position: "absolute",
    left: 0,
    right: 0,
    height: HOUR_ROW_HEIGHT,
    backgroundColor: "transparent",
  },

  /* Scheduled Appointment Block */
  gridScheduledBlock: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#635BFF",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  gridBlockTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#4338CA",
  },
  gridBlockMeta: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9,
    color: "#6366F1",
    marginTop: 1,
  },

  /* ================= BIGGER & CLICKABLE MONTH VIEW STYLES ================= */
  monthViewContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  monthInstructionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    marginBottom: 10,
  },
  monthInstructionText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#166534",
  },
  monthWeekHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 8,
    marginBottom: 6,
  },
  monthWeekHeaderCell: {
    flex: 1,
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  monthDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  monthDayCell: {
    width: "14.28%",
    minHeight: 96,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    padding: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
  },
  monthDayCellActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#635BFF",
  },
  monthDayCellWithAppt: {
    backgroundColor: "#FAFAFE",
  },
  monthDayNumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  monthDayNumText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#1E293B",
  },
  monthDayNumTextActive: {
    color: "#4F46E5",
  },
  monthApptsContainer: {
    gap: 3,
  },
  monthApptPill: {
    backgroundColor: "#EEF2FF",
    borderLeftWidth: 3,
    borderLeftColor: "#635BFF",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthApptPillText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 9.5,
    color: "#4338CA",
    flex: 1,
    marginRight: 2,
  },

  /* Full Screen Calendar Modal Container */
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fullScreenModalHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  fullScreenTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fullScreenCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreenTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  fullScreenDoneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: "#635BFF",
  },
  fullScreenDoneBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  fullScreenViewSwitcherRow: {
    width: "100%",
  },

  /* Custom Sheet List Styles */
  sheetContentList: {
    paddingTop: 4,
    paddingBottom: 8,
    gap: 4,
  },
  sheetMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sheetMenuItemActive: {
    backgroundColor: "#EEF2FF",
  },
  sheetMenuItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#334155",
  },
  sheetMenuItemTextActive: {
    color: "#4F46E5",
    fontFamily: "Manrope_700Bold",
  },

  scheduleBottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  scheduleCountText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  scheduleBottomButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#374151",
  },
  saveSmallBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: "#635BFF",
  },
  saveSmallBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  fieldLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  fieldSubLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#FFFFFF",
  },
  dropdownInputText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
  },
  frequencyLinkBtn: {
    marginTop: 8,
  },
  frequencyLinkText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#635BFF",
  },
  stepFooter: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  nextBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },

  /* STEP 2 & 3 STYLES */
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardIdBadge: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#374151",
  },
  clientProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  clientProfileName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  clientProfileEmail: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  viewProfileBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
  },
  viewProfileBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#635BFF",
  },
  infoGridRow: {
    flexDirection: "row",
    gap: 20,
  },
  infoGridCol: {
    flex: 1,
  },
  infoGridLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  infoGridValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1F2937",
  },
  statusPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusPillText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#635BFF",
  },
  repeatingBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  repeatingBtnActive: {
    backgroundColor: "#EEF2FF",
  },
  repeatingBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#4B5563",
  },
  repeatingBtnTextActive: {
    color: "#635BFF",
  },
  noteTextArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
    marginTop: 8,
    minHeight: 70,
    textAlignVertical: "top",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF2F6",
    marginTop: 8,
  },
  tableColHeader: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#6B7280",
  },
  tableItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableItemText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#1F2937",
  },
  tableEmployeeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tableEmployeeName: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#374151",
  },
  trashBtn: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tableBottomControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  addServicePillBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addServicePillText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#635BFF",
  },
  totalTimePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalTimeLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#374151",
  },
  totalTimeBadge: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#0D9488",
    backgroundColor: "#E6FBF9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tableTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 14,
  },
  totalRowLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  totalRowValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  stepActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  actionBackBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionBackBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  actionRightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  kebabBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutSecondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
  },
  checkoutSecondaryBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#635BFF",
  },
  saveAndLeaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: "#635BFF",
  },
  saveAndLeaveBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  paymentMethodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  paymentMethodCard: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  paymentMethodCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F8FAFF",
  },
  paymentMethodIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodIconCircleActive: {
    backgroundColor: "#E0E7FF",
  },
  paymentMethodLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  paymentMethodLabelActive: {
    fontFamily: "Manrope_700Bold",
    color: "#4F46E5",
  },
  orderSummaryBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  orderSummaryTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#1F2937",
    marginBottom: 4,
  },
  orderSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderSummaryLabel: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  orderSummaryVal: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#1F2937",
  },
  addDiscountLink: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#635BFF",
  },
  orderSummaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 4,
  },
  orderSummaryTotalLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  orderSummaryTotalVal: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },

  /* EXACT "ADD NEW SERVICE" MODAL */
  createServiceModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 10,
  },
  createServiceModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  createServiceModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  createServiceFieldGroup: {
    marginBottom: 14,
  },
  createServiceLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#475569",
    marginBottom: 6,
  },
  createServiceInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  createServiceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  createServiceModalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  createServiceCancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  createServiceCancelText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#475569",
  },
  createServiceSubmitBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  createServiceSubmitText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },

  /* Standard Center Dropdown Menu Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalMenuCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalMenuTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 12,
  },
  modalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalMenuItemActive: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  modalMenuItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  modalMenuItemTextActive: {
    color: "#635BFF",
  },

  /* ANCHORED DROPDOWN MODAL (Placed directly below button) */
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  anchoredDropdownCard: {
    position: "absolute",
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
  },
  dropdownTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1E293B",
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemActive: {
    backgroundColor: "#EEF2FF",
  },
  dropdownIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownIconCircleActive: {
    backgroundColor: "#E0E7FF",
  },
  dropdownItemText: {
    flex: 1,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#334155",
  },
  dropdownItemTextActive: {
    color: "#4338CA",
    fontFamily: "Manrope_700Bold",
  },

  /* PAYMENT ACTION POPOVER (Add a Tip / Add a Discount) */
  paymentPopoverCard: {
    position: "absolute",
    width: 175,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  paymentPopoverItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 10,
  },
  paymentPopoverItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#334155",
  },

  /* ADD CART DISCOUNT MODAL */
  discountModalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  discountModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16.5,
    color: "#1E293B",
  },
  discountModalSubtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  discountFieldsRow: {
    flexDirection: "row",
    gap: 12,
  },
  discountCol: {
    flex: 1,
    position: "relative",
    zIndex: 10,
  },
  discountFieldLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#334155",
    marginBottom: 6,
  },
  discountDropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  discountDropdownTriggerActive: {
    borderColor: "#635BFF",
  },
  discountDropdownTriggerText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1E293B",
  },
  discountTypeMenu: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  discountTypeMenuItem: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  discountTypeMenuItemActive: {
    backgroundColor: "#F5F3FF",
  },
  discountTypeMenuItemText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#334155",
  },
  discountTypeMenuItemTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  discountAmountInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  discountModalFooter: {
    alignItems: "flex-end",
    marginTop: 24,
  },
  addDiscountSubmitBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addDiscountSubmitBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  discountAppliedBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountAppliedBadgeText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#635BFF",
  },

  /* SEND A TIP MODAL */
  tipModalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  tipModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  tipModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16.5,
    color: "#1E293B",
  },
  tipFieldLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#334155",
    marginBottom: 6,
  },
  tipStaffTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#1E293B",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  tipStaffTriggerActive: {
    borderColor: "#635BFF",
  },
  tipStaffTriggerText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1E293B",
  },
  tipStaffMenu: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    maxHeight: 180,
  },
  tipStaffMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tipStaffMenuItemActive: {
    backgroundColor: "#F5F3FF",
  },
  tipStaffMenuItemText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#334155",
  },
  tipStaffMenuItemTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  tipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tipGridCard: {
    width: "31.5%",
    height: 82,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tipGridCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  tipGridCardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  tipGridCardTitleActive: {
    color: "#1E293B",
  },
  tipGridCardSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#64748B",
  },
  customTipInputWrap: {
    marginTop: 12,
  },
  tipModalFooter: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  tipSaveBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tipSaveBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },

  /* UPFRONT PAYMENT REVIEW ROW */
  upfrontReviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  upfrontReviewLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#4338CA",
  },
  upfrontReviewValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#4338CA",
  },

  /* REQUEST UPFRONT PAYMENT MODAL */
  upfrontModalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  upfrontModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  upfrontModalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#1E293B",
  },
  upfrontFieldLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#334155",
    marginBottom: 8,
  },
  upfrontAmountInput: {
    borderWidth: 1.5,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  upfrontMethodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  upfrontMethodCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  upfrontMethodCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF5FF",
    borderWidth: 1.5,
  },
  upfrontMethodIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  upfrontMethodIconCircleActive: {
    backgroundColor: "#E0E7FF",
  },
  upfrontMethodLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#334155",
  },
  upfrontMethodLabelActive: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  upfrontModalFooter: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  upfrontSaveBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 8,
  },
  upfrontSaveBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },

  /* ADD SERVICE REVIEW MODAL (Image 3) */
  addServiceReviewModalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  addServiceReviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addServiceReviewTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
    color: "#1E293B",
  },
  addServiceReviewFieldLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#334155",
    marginBottom: 8,
  },
  addServiceReviewTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: "#FFFFFF",
  },
  addServiceReviewTriggerActive: {
    borderColor: "#635BFF",
  },
  addServiceReviewTriggerText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13.5,
    color: "#1E293B",
  },
  addServiceReviewMenu: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  addServiceReviewMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addServiceReviewMenuItemActive: {
    backgroundColor: "#F5F3FF",
  },
  addServiceReviewMenuItemText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1E293B",
  },
  addServiceReviewMenuItemTextActive: {
    color: "#635BFF",
  },
  addServiceReviewMenuItemSub: {
    fontFamily: "Manrope_400Regular",
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: 2,
  },
  addServiceReviewFooter: {
    alignItems: "flex-end",
    marginTop: 14,
  },
  addServiceReviewSaveBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 8,
  },
  addServiceReviewSaveBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#FFFFFF",
  },
});
