import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import {
  ExpenseItem,
  INITIAL_EXPENSES,
} from "@/data/financesData";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";

const SALONS = ["All Salons", "Glamour Beauty", "Style Studio", "Chic Hair & Beauty"];
const MACRO_CATEGORIES = ["All Categories", "Products", "HR", "Taxes", "Services", "Consumables", "Utilities", "Internet"];
const SUBCATEGORIES = ["All Subcategories", "Category 1", "Category 2", "Category 3"];
const SUPPLIERS = ["All Suppliers", "Supplier Name", "L'Oréal Professionnel", "Enel Energia", "Studio Commercialista"];
const PAYMENT_METHODS = ["All Methods", "Cash", "Credit Card", "Online Payment", "Card Terminal"];

type FilterType = "salon" | "macro" | "category" | "supplier" | "method" | null;

export default function FinancesExpenseTab() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [selectedSalon, setSelectedSalon] = useState("All Salons");
  const [selectedMacro, setSelectedMacro] = useState("All Categories");
  const [selectedCategory, setSelectedCategory] = useState("All Subcategories");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All Methods");

  // Native DatePicker State
  const [pickerDate, setPickerDate] = useState<Date>(new Date(2025, 0, 2));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Active Dropdown state for non-date filters
  const [activeFilterPicker, setActiveFilterPicker] = useState<FilterType>(null);

  // Export dropdown
  const [isExportOpen, setIsExportOpen] = useState(false);

  // 3-dot dropdown popover state per card
  const [activeMenuExpenseId, setActiveMenuExpenseId] = useState<string | null>(null);

  // Actions Popover / Modals
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState<ExpenseItem | null>(null);

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [editSupplier, setEditSupplier] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editSalon, setEditSalon] = useState("");
  const [editMacroCategory, setEditMacroCategory] = useState<ExpenseItem["macroCategory"]>("Products");
  const [editCategory, setEditCategory] = useState("");
  const [editMethod, setEditMethod] = useState<ExpenseItem["paymentMethod"]>("Credit Card");
  const [editNote, setEditNote] = useState("");

  // New Expense Form State
  const [newSupplier, setNewSupplier] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newSalon, setNewSalon] = useState("Glamour Beauty");
  const [newMacroCategory, setNewMacroCategory] = useState<ExpenseItem["macroCategory"]>("Products");
  const [newCategory, setNewCategory] = useState("Category 1");
  const [newMethod, setNewMethod] = useState<ExpenseItem["paymentMethod"]>("Credit Card");
  const [newNote, setNewNote] = useState("");
  const [hasSimulatedAttachment, setHasSimulatedAttachment] = useState(false);

  const hasActiveFilters =
    selectedDate !== "All Dates" ||
    selectedSalon !== "All Salons" ||
    selectedMacro !== "All Categories" ||
    selectedCategory !== "All Subcategories" ||
    selectedSupplier !== "All Suppliers" ||
    selectedPaymentMethod !== "All Methods";

  const handleResetFilters = () => {
    setSelectedDate("All Dates");
    setSelectedSalon("All Salons");
    setSelectedMacro("All Categories");
    setSelectedCategory("All Subcategories");
    setSelectedSupplier("All Suppliers");
    setSelectedPaymentMethod("All Methods");
    setActiveFilterPicker(null);
    setShowDatePicker(false);
    setActiveMenuExpenseId(null);
  };

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salon.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate === "All Dates" || item.date.includes(selectedDate);
    const matchesMacro = selectedMacro === "All Categories" || item.macroCategory === selectedMacro;
    const matchesSalon = selectedSalon === "All Salons" || item.salon === selectedSalon;
    const matchesCategory = selectedCategory === "All Subcategories" || item.category === selectedCategory;
    const matchesSupplier = selectedSupplier === "All Suppliers" || item.supplier === selectedSupplier;
    const matchesMethod = selectedPaymentMethod === "All Methods" || item.paymentMethod === selectedPaymentMethod;
    return matchesSearch && matchesDate && matchesMacro && matchesSalon && matchesCategory && matchesSupplier && matchesMethod;
  });

  const handleExport = (type: "PDF" | "CSV") => {
    setIsExportOpen(false);
    Alert.alert("Exporting Report", `Generating ${type} expense report...`);
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setExpenses((prev) => prev.filter((e) => e.id !== id));
            Alert.alert("Deleted", "Expense record was removed.");
          },
        },
      ]
    );
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditingExpense(item);
    setEditSupplier(item.supplier);
    setEditCost(item.cost.toString());
    setEditSalon(item.salon);
    setEditMacroCategory(item.macroCategory);
    setEditCategory(item.category);
    setEditMethod(item.paymentMethod);
    setEditNote(item.note || "");
  };

  const handleSaveEdit = () => {
    if (!editingExpense) return;
    if (!editSupplier.trim() || !editCost.trim()) {
      Alert.alert("Missing Fields", "Please enter a supplier name and expense amount.");
      return;
    }

    const costNum = parseFloat(editCost) || editingExpense.cost;

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingExpense.id
          ? {
              ...e,
              supplier: editSupplier,
              cost: costNum,
              salon: editSalon,
              macroCategory: editMacroCategory,
              category: editCategory,
              paymentMethod: editMethod,
              note: editNote,
            }
          : e
      )
    );

    setEditingExpense(null);
    Alert.alert("Expense Updated", "The expense record has been successfully updated.");
  };

  const handleAttachReceipt = async (item: ExpenseItem) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setExpenses((prev) =>
          prev.map((e) => (e.id === item.id ? { ...e, hasAttachment: true } : e))
        );
        Alert.alert(
          "Receipt Attached",
          `Receipt "${res.assets[0].name}" attached to ${item.supplier}.`
        );
      }
    } catch (e) {
      Alert.alert("Attach Receipt", "Receipt selection cancelled.");
    }
  };

  const handleDownloadAttachment = (item: ExpenseItem) => {
    Alert.alert(
      "Download Attachment",
      `Downloading receipt for ${item.supplier} (${item.supplier.toLowerCase().replace(/[^a-z]/g, "")}_invoice.pdf)...`
    );
  };

  const handleAddExpenseSubmit = () => {
    if (!newSupplier.trim() || !newCost.trim()) {
      Alert.alert("Missing Fields", "Please enter a supplier name and expense amount.");
      return;
    }

    const costNum = parseFloat(newCost) || 0;

    const created: ExpenseItem = {
      id: `exp-${Date.now()}`,
      date: "02/01/2025 17:00",
      salon: newSalon,
      macroCategory: newMacroCategory,
      category: newCategory,
      cost: costNum,
      supplier: newSupplier,
      paymentMethod: newMethod,
      note: newNote || "Standard branch expenditure",
      hasAttachment: hasSimulatedAttachment,
      avatarEmoji: "🧾",
    };

    setExpenses([created, ...expenses]);
    resetForm();
    setIsAddOpen(false);
    Alert.alert("Expense Added", "New operational expense has been logged successfully.");
  };

  const resetForm = () => {
    setNewSupplier("");
    setNewCost("");
    setNewNote("");
    setHasSimulatedAttachment(false);
  };

  const getMacroBadgeStyle = (macro: ExpenseItem["macroCategory"]) => {
    switch (macro) {
      case "Products":
        return { bg: "#F3E8FF", text: "#9333EA" };
      case "HR":
        return { bg: "#EDE9FE", text: "#8B5CF6" };
      case "Taxes":
        return { bg: "#FCE7F3", text: "#EC4899" };
      case "Services":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "Consumables":
        return { bg: "#DCFCE7", text: "#16A34A" };
      case "Utilities":
        return { bg: "#CFFAFE", text: "#0891B2" };
      case "Internet":
        return { bg: "#ECFDF5", text: "#059669" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const getPaymentMethodBadgeStyle = (method: ExpenseItem["paymentMethod"]) => {
    switch (method) {
      case "Cash":
        return { bg: "#DCFCE7", text: "#16A34A" };
      case "Credit Card":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "Online Payment":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "Card Terminal":
        return { bg: "#E0F2FE", text: "#0284C7" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const OTHER_FILTER_CONFIGS: {
    id: Exclude<FilterType, null>;
    label: string;
    iconName: "chevron-down";
    value: string;
    options: string[];
    onChange: (val: string) => void;
    isCustomActive: boolean;
  }[] = [
    {
      id: "salon",
      label: "Salons",
      iconName: "chevron-down",
      value: selectedSalon,
      options: SALONS,
      onChange: setSelectedSalon,
      isCustomActive: selectedSalon !== "All Salons",
    },
    {
      id: "macro",
      label: "Macro-categories",
      iconName: "chevron-down",
      value: selectedMacro,
      options: MACRO_CATEGORIES,
      onChange: setSelectedMacro,
      isCustomActive: selectedMacro !== "All Categories",
    },
    {
      id: "category",
      label: "Category",
      iconName: "chevron-down",
      value: selectedCategory,
      options: SUBCATEGORIES,
      onChange: setSelectedCategory,
      isCustomActive: selectedCategory !== "All Subcategories",
    },
    {
      id: "supplier",
      label: "Supplier",
      iconName: "chevron-down",
      value: selectedSupplier,
      options: SUPPLIERS,
      onChange: setSelectedSupplier,
      isCustomActive: selectedSupplier !== "All Suppliers",
    },
    {
      id: "method",
      label: "Payment Method",
      iconName: "chevron-down",
      value: selectedPaymentMethod,
      options: PAYMENT_METHODS,
      onChange: setSelectedPaymentMethod,
      isCustomActive: selectedPaymentMethod !== "All Methods",
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.headerCard}>
        {/* Title & Subtitle */}
        <View style={styles.headerTitleWrap}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.headerTitle}>Expense Management</Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={handleResetFilters} style={styles.resetFiltersBtn}>
                <Ionicons name="refresh" size={12} color="#635BFF" style={{ marginRight: 3 }} />
                <Text style={styles.resetFiltersText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.headerSubtitle}>Manage and track salon expense registers</Text>
        </View>

        {/* Action Buttons Row */}
        <View style={[styles.headerButtonsRow, { zIndex: 100 }]}>
          {/* Export Dropdown */}
          <View style={{ flex: 1, position: "relative", zIndex: 100 }}>
            <TouchableOpacity
              style={styles.exportReportBtn}
              onPress={() => {
                setActiveFilterPicker(null);
                setShowDatePicker(false);
                setActiveMenuExpenseId(null);
                setIsExportOpen(!isExportOpen);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={14} color="#374151" style={{ marginRight: 4 }} />
              <Text style={styles.exportReportBtnText}>Export Report</Text>
              <Ionicons
                name={isExportOpen ? "chevron-up" : "chevron-down"}
                size={14}
                color="#374151"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            {isExportOpen && (
              <View style={styles.exportDropdownMenu}>
                <TouchableOpacity
                  style={styles.exportOptionItem}
                  onPress={() => handleExport("PDF")}
                >
                  <Ionicons name="document-text-outline" size={15} color="#635BFF" style={{ marginRight: 6 }} />
                  <Text style={styles.exportOptionText}>PDF</Text>
                </TouchableOpacity>
                <View style={styles.exportDivider} />
                <TouchableOpacity
                  style={styles.exportOptionItem}
                  onPress={() => handleExport("CSV")}
                >
                  <Ionicons name="grid-outline" size={15} color="#10B981" style={{ marginRight: 6 }} />
                  <Text style={styles.exportOptionText}>CSV</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* + Add Expense Button */}
          <TouchableOpacity
            style={styles.addExpenseBtn}
            onPress={() => {
              setActiveFilterPicker(null);
              setShowDatePicker(false);
              setActiveMenuExpenseId(null);
              setIsExportOpen(false);
              setIsAddOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addExpenseBtnText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerDivider} />

        {/* 2. Mobile-friendly Filter Grid */}
        <View style={styles.filtersGrid}>
          {/* A. Date Filter using Expo UI DateTimePicker */}
          <View style={[styles.filterGroup, { zIndex: 35 }]}>
            <Text style={styles.filterLabel}>Date</Text>
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedDate !== "All Dates" && styles.filterPillActive,
                showDatePicker && styles.filterPillOpen,
              ]}
              onPress={() => {
                setIsExportOpen(false);
                setActiveFilterPicker(null);
                setActiveMenuExpenseId(null);
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedDate !== "All Dates" && styles.filterPillTextActive,
                ]}
                numberOfLines={1}
              >
                {selectedDate}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={selectedDate !== "All Dates" || showDatePicker ? "#635BFF" : "#9CA3AF"}
              />
            </TouchableOpacity>

            {/* Expo UI Native DateTimePicker */}
            {showDatePicker && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                onValueChange={(_event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setPickerDate(date);
                    const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
                    setSelectedDate(formatted);
                  }
                }}
                onDismiss={() => setShowDatePicker(false)}
              />
            )}
          </View>

          {/* B. Remaining 5 Dropdown Filters */}
          {OTHER_FILTER_CONFIGS.map((filter, index) => {
            const isOpen = activeFilterPicker === filter.id;
            const rowNumber = Math.floor((index + 1) / 2);
            const zIndex = isOpen ? 999 : 30 - rowNumber * 5;

            return (
              <View key={filter.id} style={[styles.filterGroup, { zIndex }]}>
                <Text style={styles.filterLabel}>{filter.label}</Text>
                <TouchableOpacity
                  style={[
                    styles.filterPill,
                    filter.isCustomActive && styles.filterPillActive,
                    isOpen && styles.filterPillOpen,
                  ]}
                  onPress={() => {
                    setIsExportOpen(false);
                    setShowDatePicker(false);
                    setActiveMenuExpenseId(null);
                    setActiveFilterPicker(isOpen ? null : filter.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      filter.isCustomActive && styles.filterPillTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {filter.value}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : filter.iconName}
                    size={12}
                    color={filter.isCustomActive || isOpen ? "#635BFF" : "#9CA3AF"}
                  />
                </TouchableOpacity>

                {/* Dropdown Menu directly below the filter pill */}
                {isOpen && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={{ maxHeight: 180 }}
                      showsVerticalScrollIndicator={true}
                    >
                      {filter.options.map((opt, optIdx) => {
                        const isSelected = opt === filter.value;
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[
                              styles.dropdownOptionItem,
                              isSelected && styles.dropdownOptionItemActive,
                              optIdx === filter.options.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => {
                              filter.onChange(opt);
                              setActiveFilterPicker(null);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                isSelected && styles.dropdownOptionTextActive,
                              ]}
                              numberOfLines={1}
                            >
                              {opt}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark" size={14} color="#635BFF" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 3. Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => {
            setActiveFilterPicker(null);
            setShowDatePicker(false);
            setActiveMenuExpenseId(null);
            setIsExportOpen(false);
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 4. Expenses List / Cards */}
      <View style={styles.expenseCardsList}>
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <Ionicons name="search-outline" size={36} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No expenses matched</Text>
            <Text style={styles.emptyStateSub}>Try adjusting your filter selection or search keywords.</Text>
            <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtnEmpty}>
              <Text style={styles.resetBtnEmptyText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredExpenses.map((item, itemIdx) => {
            const macroStyle = getMacroBadgeStyle(item.macroCategory);
            const methodStyle = getPaymentMethodBadgeStyle(item.paymentMethod);
            const isMenuOpen = activeMenuExpenseId === item.id;
            const cardZIndex = isMenuOpen ? 200 : (filteredExpenses.length - itemIdx);

            return (
              <View
                key={item.id}
                style={[
                  styles.expenseCard,
                  { zIndex: cardZIndex },
                ]}
              >
                {/* Top Row: Date & Salon on left, Cost on right */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardSalonInfo}>
                    <View style={styles.salonAvatarBox}>
                      <Text style={{ fontSize: 16 }}>{item.avatarEmoji}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardSalonName}>{item.salon}</Text>
                      <Text style={styles.cardDateText}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.cardCostText}>€ {item.cost.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Middle Row: Supplier */}
                <View style={styles.cardSupplierRow}>
                  <Text style={styles.cardSupplierLabel}>Supplier:</Text>
                  <Text style={styles.cardSupplierValue}>{item.supplier}</Text>
                </View>

                {/* Badges Row: Macro, Category, Payment Method */}
                <View style={styles.cardBadgesRow}>
                  <View style={[styles.badgePill, { backgroundColor: macroStyle.bg }]}>
                    <Text style={[styles.badgePillText, { color: macroStyle.text }]}>
                      {item.macroCategory}
                    </Text>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: "#ECFDF5" }]}>
                    <Text style={[styles.badgePillText, { color: "#10B981" }]}>
                      {item.category}
                    </Text>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: methodStyle.bg }]}>
                    <Text style={[styles.badgePillText, { color: methodStyle.text }]}>
                      {item.paymentMethod}
                    </Text>
                  </View>
                </View>

                {/* Bottom Row: View, Delete, and 3-Dot More Actions Menu */}
                <View style={styles.cardActionsIconRow}>
                  {/* Left Action Buttons: View & Delete */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {/* 1. View */}
                    <TouchableOpacity
                      style={[styles.cardIconBtn, { backgroundColor: "#EEECFF" }]}
                      onPress={() => {
                        setActiveMenuExpenseId(null);
                        setSelectedExpense(item);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={17} color="#635BFF" />
                    </TouchableOpacity>

                    {/* 2. Delete */}
                    <TouchableOpacity
                      style={[styles.cardIconBtn, { backgroundColor: "#FEE2E2" }]}
                      onPress={() => {
                        setActiveMenuExpenseId(null);
                        handleDeleteExpense(item.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* 3. 3-Dots Button with Small Dropdown Modal Below */}
                  <View style={{ position: "relative", zIndex: 300 }}>
                    <TouchableOpacity
                      style={[
                        styles.cardIconBtn,
                        { backgroundColor: isMenuOpen ? "#EEECFF" : "#F3F4F6" },
                      ]}
                      onPress={() => {
                        setActiveMenuExpenseId(isMenuOpen ? null : item.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={17}
                        color={isMenuOpen ? "#635BFF" : "#4B5563"}
                      />
                    </TouchableOpacity>

                    {/* Small Modal / Popover Menu directly below the 3-dot */}
                    {isMenuOpen && (
                      <View style={styles.moreActionsDropdown}>
                        {/* Edit */}
                        <TouchableOpacity
                          style={styles.moreActionItem}
                          onPress={() => {
                            setActiveMenuExpenseId(null);
                            handleOpenEdit(item);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={15} color="#0284C7" style={{ marginRight: 8 }} />
                          <Text style={styles.moreActionText}>Edit</Text>
                        </TouchableOpacity>

                        {/* Attach */}
                        <TouchableOpacity
                          style={styles.moreActionItem}
                          onPress={() => {
                            setActiveMenuExpenseId(null);
                            handleAttachReceipt(item);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="attach-outline" size={16} color="#9333EA" style={{ marginRight: 8 }} />
                          <Text style={styles.moreActionText}>Attach Receipt</Text>
                        </TouchableOpacity>

                        {/* View Attachment */}
                        <TouchableOpacity
                          style={styles.moreActionItem}
                          onPress={() => {
                            setActiveMenuExpenseId(null);
                            setShowAttachmentModal(item);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="document-text-outline" size={15} color="#10B981" style={{ marginRight: 8 }} />
                          <Text style={styles.moreActionText}>View Attachment</Text>
                        </TouchableOpacity>

                        {/* Download Attachment */}
                        <TouchableOpacity
                          style={[styles.moreActionItem, { borderBottomWidth: 0 }]}
                          onPress={() => {
                            setActiveMenuExpenseId(null);
                            handleDownloadAttachment(item);
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="download-outline" size={15} color="#D97706" style={{ marginRight: 8 }} />
                          <Text style={styles.moreActionText}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 5. Pagination Card */}
      <View style={styles.paginationCard}>
        <Text style={styles.paginationCountText} numberOfLines={1}>
          Showing 1 to {filteredExpenses.length} of {expenses.length} transactions
        </Text>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={styles.pageArrowBtn}
            onPress={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={12} color="#6B7280" style={{ marginRight: 2 }} />
            <Text style={styles.pageArrowText}>Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pageNumberBtn, currentPage === 1 && styles.pageNumberBtnActive]}
            onPress={() => setCurrentPage(1)}
          >
            <Text style={[styles.pageNumberText, currentPage === 1 && styles.pageNumberTextActive]}>
              1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pageNumberBtn, currentPage === 2 && styles.pageNumberBtnActive]}
            onPress={() => setCurrentPage(2)}
          >
            <Text style={[styles.pageNumberText, currentPage === 2 && styles.pageNumberTextActive]}>
              2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pageArrowBtn}
            onPress={() => setCurrentPage(2)}
            disabled={currentPage === 2}
          >
            <Text style={styles.pageArrowText}>Next</Text>
            <Ionicons name="chevron-forward" size={12} color="#6B7280" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 6. Add Expense Modal */}
      <CustomModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Salon Expense"
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
          <View style={{ gap: 10, paddingTop: 4 }}>
            <CustomInput
              label="Supplier / Vendor *"
              value={newSupplier}
              onChangeText={setNewSupplier}
              placeholder="e.g. Supplier Name, L'Oréal"
              iconName="business-outline"
            />

            <CustomInput
              label="Cost Amount (€) *"
              value={newCost}
              onChangeText={setNewCost}
              placeholder="e.g. 5535.52"
              keyboardType="decimal-pad"
              iconName="cash-outline"
            />

            <Text style={styles.fieldLabel}>Macro Category</Text>
            <View style={styles.categoryPicker}>
              {MACRO_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.catOption,
                    newMacroCategory === c && styles.catOptionActive,
                  ]}
                  onPress={() => setNewMacroCategory(c as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      newMacroCategory === c && styles.catOptionTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Payment Method</Text>
            <View style={styles.categoryPicker}>
              {PAYMENT_METHODS.filter((m) => m !== "All Methods").map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.catOption,
                    newMethod === m && styles.catOptionActive,
                  ]}
                  onPress={() => setNewMethod(m as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      newMethod === m && styles.catOptionTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CustomInput
              label="Internal Note"
              value={newNote}
              onChangeText={setNewNote}
              placeholder="e.g. Monthly stock replenishment"
              iconName="create-outline"
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              <CustomButton
                title="Cancel"
                onPress={() => setIsAddOpen(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <CustomButton
                title="Save Expense"
                onPress={handleAddExpenseSubmit}
                variant="primary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </ScrollView>
      </CustomModal>

      {/* 7. Edit Expense Modal */}
      {editingExpense && (
        <CustomModal
          visible={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          title="Edit Expense Record"
        >
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
            <View style={{ gap: 10, paddingTop: 4 }}>
              <CustomInput
                label="Supplier / Vendor *"
                value={editSupplier}
                onChangeText={setEditSupplier}
                placeholder="e.g. Supplier Name"
                iconName="business-outline"
              />

              <CustomInput
                label="Cost Amount (€) *"
                value={editCost}
                onChangeText={setEditCost}
                placeholder="e.g. 1200.00"
                keyboardType="decimal-pad"
                iconName="cash-outline"
              />

              <Text style={styles.fieldLabel}>Macro Category</Text>
              <View style={styles.categoryPicker}>
                {MACRO_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.catOption,
                      editMacroCategory === c && styles.catOptionActive,
                    ]}
                    onPress={() => setEditMacroCategory(c as any)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.catOptionText,
                        editMacroCategory === c && styles.catOptionTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Payment Method</Text>
              <View style={styles.categoryPicker}>
                {PAYMENT_METHODS.filter((m) => m !== "All Methods").map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.catOption,
                      editMethod === m && styles.catOptionActive,
                    ]}
                    onPress={() => setEditMethod(m as any)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.catOptionText,
                        editMethod === m && styles.catOptionTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <CustomInput
                label="Internal Note"
                value={editNote}
                onChangeText={setEditNote}
                placeholder="e.g. Stock replenishment"
                iconName="create-outline"
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                <CustomButton
                  title="Cancel"
                  onPress={() => setEditingExpense(null)}
                  variant="outline"
                  style={{ flex: 1 }}
                />
                <CustomButton
                  title="Update"
                  onPress={handleSaveEdit}
                  variant="primary"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </ScrollView>
        </CustomModal>
      )}

      {/* 8. Expense Detail View Modal */}
      {selectedExpense && (
        <CustomModal
          visible={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          title="Expense Details"
        >
          <View style={{ gap: 12 }}>
            <View style={styles.detailHeader}>
              <View style={styles.detailAvatarBox}>
                <Text style={{ fontSize: 22 }}>{selectedExpense.avatarEmoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailSupplierName}>{selectedExpense.supplier}</Text>
                <Text style={styles.detailDateText}>{selectedExpense.date} • {selectedExpense.salon}</Text>
              </View>
              <Text style={styles.detailCostText}>€ {selectedExpense.cost.toFixed(2)}</Text>
            </View>

            <View style={styles.detailBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Macro Category:</Text>
                <Text style={styles.detailVal}>{selectedExpense.macroCategory}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subcategory:</Text>
                <Text style={styles.detailVal}>{selectedExpense.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <Text style={styles.detailVal}>{selectedExpense.paymentMethod}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Note:</Text>
                <Text style={styles.detailVal}>{selectedExpense.note || "None"}</Text>
              </View>
            </View>

            <CustomButton
              title="Close"
              onPress={() => setSelectedExpense(null)}
              variant="outline"
            />
          </View>
        </CustomModal>
      )}

      {/* 9. Receipt Attachment Preview Modal */}
      {showAttachmentModal && (
        <CustomModal
          visible={!!showAttachmentModal}
          onClose={() => setShowAttachmentModal(null)}
          title="Invoice Receipt Attachment"
        >
          <View style={{ gap: 12 }}>
            <View style={styles.attachmentCard}>
              <Ionicons name="document-text" size={40} color="#635BFF" />
              <Text style={styles.attachmentName}>
                {showAttachmentModal.supplier.toLowerCase().replace(/[^a-z]/g, "")}_invoice.pdf
              </Text>
              <Text style={styles.attachmentSub}>
                Document Total: € {showAttachmentModal.cost.toFixed(2)} • Verified SDI Fattura
              </Text>
            </View>

            <CustomButton
              title="Download Receipt Copy"
              onPress={() => {
                Alert.alert("Downloaded", "Receipt file saved to device storage.");
                setShowAttachmentModal(null);
              }}
              variant="primary"
              icon={<Ionicons name="download-outline" size={16} color="#FFFFFF" />}
            />
          </View>
        </CustomModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    zIndex: 50,
  },
  headerTitleWrap: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  resetFiltersBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetFiltersText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  headerButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  exportReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportReportBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  exportDropdownMenu: {
    position: "absolute",
    top: 38,
    left: 0,
    width: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 999,
  },
  exportOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  exportOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  exportDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  addExpenseBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addExpenseBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 10,
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  filterGroup: {
    width: "48%",
    position: "relative",
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterPillActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  filterPillOpen: {
    borderColor: "#635BFF",
    backgroundColor: "#FFFFFF",
  },
  filterPillText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    marginRight: 4,
  },
  filterPillTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  dropdownContainer: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 1000,
    overflow: "hidden",
  },
  dropdownOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownOptionItemActive: {
    backgroundColor: "#EEECFF",
  },
  dropdownOptionText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    marginRight: 4,
  },
  dropdownOptionTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    padding: 0,
  },
  expenseCardsList: {
    gap: 10,
    zIndex: 1,
  },
  emptyStateBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  emptyStateSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "center",
  },
  resetBtnEmpty: {
    marginTop: 12,
    backgroundColor: "#EEECFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetBtnEmptyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  expenseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
    position: "relative",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSalonInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  salonAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardSalonName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cardDateText: {
    fontSize: 10,
    color: "#6B7280",
  },
  cardCostText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#EF4444",
  },
  cardSupplierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardSupplierLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  cardSupplierValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  cardBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 2,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardActionsIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 4,
  },
  cardIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  moreActionsDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 25,
    zIndex: 999,
    paddingVertical: 4,
  },
  moreActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  moreActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  paginationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  paginationCountText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    flexShrink: 1,
    marginRight: 6,
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  pageArrowBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  pageArrowText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
  pageNumberBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  pageNumberBtnActive: {
    backgroundColor: "#635BFF",
  },
  pageNumberText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  pageNumberTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
    marginTop: 4,
  },
  categoryPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  catOptionActive: {
    backgroundColor: "#635BFF",
  },
  catOptionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  catOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  detailSupplierName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  detailDateText: {
    fontSize: 11,
    color: "#6B7280",
  },
  detailCostText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
  },
  detailBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  detailVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  attachmentCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  attachmentSub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
});
