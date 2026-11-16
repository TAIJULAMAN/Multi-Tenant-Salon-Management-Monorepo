import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import TabRootInset from "@/components/ui/TabRootInset";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import {
  ALLERGY_COLORS,
  CLIENT_SINCE_OPTIONS,
  Client,
  LAST_APPOINTMENT_OPTIONS,
  REGISTRATION_OPTIONS,
  clientsStore,
  fullName,
  useClients,
} from "@/components/clients/clientsData";
import {
  CheckState,
  ChipGroup,
  CompactDropdown,
  EmptyState,
  FigmaCheckbox,
  KebabMenu,
  Label,
  Pagination,
  usePagination,
} from "@/components/clients/common";
import ClientFormModal from "@/components/clients/modals/ClientFormModal";
import ConfirmDeleteModal from "@/components/clients/modals/ConfirmDeleteModal";
import RecordCard, { RecordList } from "@/components/ui/RecordCard";

const DAYS_BY_RANGE: Record<string, number> = {
  "Last 7 days": 7,
  "Last 14 days": 14,
  "Last Month": 30,
  "Last 3 Months": 90,
};

/** Clients list — Figma 1:43482 (list + row menu), 1:43819 (select mode), 1:44157 (all selected + Mass Deletion). */
export default function ClientsScreen() {
  const router = useRouter();
  const clients = useClients();

  const [clientSince, setClientSince] = useState("All Years");
  const [registration, setRegistration] = useState("All");
  const [salesMin, setSalesMin] = useState("");
  const [salesMax, setSalesMax] = useState("");
  const [lastAppointment, setLastAppointment] = useState("Last 7 days");
  const [search, setSearch] = useState("");

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = parseFloat(salesMin);
    const max = parseFloat(salesMax);
    const days = DAYS_BY_RANGE[lastAppointment];
    return clients.filter((c) => {
      if (q && !`${fullName(c)} ${c.email} ${c.phone}`.toLowerCase().includes(q)) return false;
      if (clientSince !== "All Years" && !c.createdAt.endsWith(clientSince)) return false;
      if (registration !== "All" && c.registration !== registration) return false;
      if (!isNaN(min) && c.totalSales < min) return false;
      if (!isNaN(max) && c.totalSales > max) return false;
      if (days && c.lastAppointmentDaysAgo > days) return false;
      return true;
    });
  }, [clients, search, clientSince, registration, salesMin, salesMax, lastAppointment]);

  const pagination = usePagination(filtered, 5);
  const visibleSelected = selected.filter((id) => filtered.some((c) => c.id === id));
  const allSelected = filtered.length > 0 && visibleSelected.length === filtered.length;
  const headerState: CheckState = !selectMode ? "unchecked" : allSelected ? "checked" : "indeterminate";

  const toggleSelected = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onHeaderCheckbox = () => {
    if (!selectMode) setSelectMode(true);
    else {
      setSelectMode(false);
      setSelected([]);
    }
  };
  const toggleSelectAll = () => setSelected(allSelected ? [] : filtered.map((c) => c.id));

  const handleMenuAction = (c: Client, action: string) => {
    if (action === "view") router.push(`/(drawer)/(tabs)/clients/${c.id}` as never);
    if (action === "book") router.push("/(drawer)/(tabs)/calendar/add" as never);
    if (action === "edit") {
      setEditingClient(c);
      setFormMode("edit");
    }
    if (action === "delete") setDeleteIds([c.id]);
  };

  return (
    <TabRootInset>
      <View style={styles.container}>
        <Header />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Title + actions + filters */}
          <View style={styles.card}>
            <Text style={styles.title}>Clients</Text>
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => router.push("/(drawer)/(tabs)/clients/import" as never)}
                activeOpacity={0.8}
              >
                <Text style={styles.outlineBtnText} numberOfLines={1}>
                  Import Clients
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.softBtn}
                onPress={() => Alert.alert("Export Data", `${filtered.length} client(s) exported to clients_export.csv.`)}
                activeOpacity={0.8}
              >
                <Ionicons name="download-outline" size={18} color={colors.primary} />
                <Text style={styles.outlineBtnText} numberOfLines={1}>
                  Export Data
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                setEditingClient(undefined);
                setFormMode("add");
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={20} color={colors.white} />
              <Text style={styles.primaryBtnText}>Add Client</Text>
            </TouchableOpacity>

            <View>
              <View style={styles.filterLabelRow}>
                <Text style={styles.filterLabel}>Client Since</Text>
                <Ionicons name="funnel-outline" size={13} color={colors.textMuted} />
              </View>
              <ChipGroup options={CLIENT_SINCE_OPTIONS} value={clientSince} onChange={setClientSince} />
            </View>
            <View>
              <Text style={styles.filterLabel}>Registration</Text>
              <ChipGroup options={REGISTRATION_OPTIONS} value={registration} onChange={setRegistration} />
            </View>
            <View style={styles.filterSplit}>
              <View style={{ flex: 1.4 }}>
                <Text style={styles.filterLabel}>Sales</Text>
                <View style={styles.rangeRow}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="€ 0"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={salesMin}
                    onChangeText={setSalesMin}
                  />
                  <Text style={styles.rangeDash}>-</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="€ 200"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={salesMax}
                    onChangeText={setSalesMax}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.filterLabel}>Last Appointment</Text>
                <CompactDropdown value={lastAppointment} options={LAST_APPOINTMENT_OPTIONS} onChange={setLastAppointment} />
              </View>
            </View>
          </View>

          {/* Table card */}
          <View style={styles.card}>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={colors.text} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor={colors.textMuted}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              {selectMode && visibleSelected.length > 0 && (
                <TouchableOpacity style={styles.massDeleteBtn} onPress={() => setDeleteIds(visibleSelected)} activeOpacity={0.8}>
                  <Text style={styles.massDeleteText}>Mass Deletion</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.selectRow}>
              <FigmaCheckbox state={headerState} onPress={onHeaderCheckbox} label="Select clients" />
              {selectMode ? (
                <TouchableOpacity onPress={toggleSelectAll}>
                  <Text style={styles.selectAllLink}>{allSelected ? "Unselect All Clients" : "Select All Clients"}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.selectLabel}>Select</Text>
              )}
            </View>

            <RecordList>
              {pagination.pageItems.map((c) => {
                const allergy = c.allergies[0];
                const isSelected = selected.includes(c.id);
                return (
                  <RecordCard
                    key={c.id}
                    selected={selectMode && isSelected}
                    onPress={() =>
                      selectMode ? toggleSelected(c.id) : router.push(`/(drawer)/(tabs)/clients/${c.id}` as never)
                    }
                    leading={
                      <>
                        {selectMode && (
                          <FigmaCheckbox
                            state={isSelected ? "checked" : "unchecked"}
                            onPress={() => toggleSelected(c.id)}
                            label={`Select ${fullName(c)}`}
                          />
                        )}
                        <Image source={{ uri: c.avatar }} style={styles.avatar} />
                      </>
                    }
                    title={fullName(c)}
                    subtitle={c.phone}
                    trailing={
                      <KebabMenu
                        items={[
                          { key: "view", label: "View Details", icon: "eye" },
                          { key: "book", label: "Book now", icon: "calendar-clear-outline", color: colors.green },
                          { key: "edit", label: "Edit", icon: "pencil-outline", color: colors.teal },
                          { key: "delete", label: "Delete", icon: "trash-outline", color: colors.pink },
                        ]}
                        onSelect={(k) => handleMenuAction(c, k)}
                      />
                    }
                    fields={[
                      { label: "Last Appointment", value: c.lastAppointment },
                      {
                        label: "Allergies",
                        value: allergy ? (
                          <Label label={allergy.name} styleDef={{ bg: ALLERGY_COLORS[allergy.color], text: colors.white }} />
                        ) : (
                          "-"
                        ),
                      },
                      { label: "Created at", value: c.createdAt },
                    ]}
                  />
                );
              })}
            </RecordList>
            {pagination.pageItems.length === 0 && <EmptyState icon="people-outline" text="No clients match your filters" />}
            {filtered.length > 0 && <Pagination {...pagination} />}
          </View>
        </ScrollView>

        <ClientFormModal
          visible={formMode !== null}
          mode={formMode ?? "add"}
          client={editingClient}
          onClose={() => setFormMode(null)}
        />

        <ConfirmDeleteModal
          visible={!!deleteIds}
          onClose={() => setDeleteIds(null)}
          title={deleteIds && deleteIds.length > 1 ? "Delete Clients" : "Delete Client"}
          message={
            deleteIds && deleteIds.length > 1
              ? `Are you sure you want to delete ${deleteIds.length} clients? This action cannot be undone.`
              : "Are you sure you want to delete this client? This action cannot be undone."
          }
          onConfirm={() => {
            if (deleteIds) {
              clientsStore.remove(deleteIds);
              setSelected((s) => s.filter((id) => !deleteIds.includes(id)));
            }
          }}
        />
      </View>
    </TabRootInset>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
    ...shadows.card,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  actionBar: {
    flexDirection: "row",
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  softBtn: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  primaryBtn: {
    flexDirection: "row",
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.primary,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  filterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
  },
  filterSplit: {
    flexDirection: "row",
    gap: 12,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rangeInput: {
    flex: 1,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  rangeDash: {
    color: colors.text,
    fontFamily: fonts.medium,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: 0,
  },
  massDeleteBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.pinkSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  massDeleteText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.pink,
  },
  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  selectAllLink: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.medium,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
  },
});
