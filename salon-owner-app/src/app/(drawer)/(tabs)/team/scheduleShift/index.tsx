import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  initialMatrixScheduledShifts,
  MatrixScheduledShift,
} from "@/components/team/teamData";
import ScheduledShiftsView from "@/components/team/ScheduledShiftsView";
import AddOptionsDropdownModal, { ScheduledAddOption } from "@/components/team/modals/AddOptionsDropdownModal";
import AddTimeOffModal from "@/components/team/modals/AddTimeOffModal";
import AddBlockedTimeModal from "@/components/team/modals/AddBlockedTimeModal";
import AddClosedPeriodModal from "@/components/team/modals/AddClosedPeriodModal";
import AddWorkedShiftModal from "@/components/team/modals/AddWorkedShiftModal";
import EditShiftModal from "@/components/team/modals/EditShiftModal";

export default function ScheduledShiftsIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [matrixShifts, setMatrixShifts] = useState<MatrixScheduledShift[]>(initialMatrixScheduledShifts);

  // Modals state
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState<{ top: number; right: number } | null>(null);
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);
  const [isBlockedTimeOpen, setIsBlockedTimeOpen] = useState(false);
  const [isClosedPeriodOpen, setIsClosedPeriodOpen] = useState(false);
  const [isAddWorkedShiftOpen, setIsAddWorkedShiftOpen] = useState(false);

  // Editing Shift
  const [editingMatrixShift, setEditingMatrixShift] = useState<{
    member: MatrixScheduledShift;
    dayKey: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
    currentVal?: string | null;
  } | null>(null);

  const handleExportScheduled = () => {
    Alert.alert("Export Data", "Exporting weekly scheduled shifts report (CSV/PDF)...");
  };

  const handleSelectAddOption = (option: ScheduledAddOption) => {
    setIsAddMenuOpen(false);
    if (option === "shift") {
      setIsAddWorkedShiftOpen(true);
    } else if (option === "time_off") {
      setIsTimeOffOpen(true);
    } else if (option === "blocked_time") {
      setIsBlockedTimeOpen(true);
    } else if (option === "closed_period") {
      setIsClosedPeriodOpen(true);
    }
  };

  const handleSaveShift = (startTime: string, endTime: string) => {
    if (editingMatrixShift) {
      const timeStr = `${startTime} - ${endTime}`;
      setMatrixShifts((prev) =>
        prev.map((m) =>
          m.id === editingMatrixShift.member.id
            ? {
                ...m,
                shifts: {
                  ...m.shifts,
                  [editingMatrixShift.dayKey]: timeStr,
                },
              }
            : m
        )
      );
      setEditingMatrixShift(null);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 15) }]}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheduled Shifts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Schedule Component (Zero Horizontal Table Scrolling) */}
        <ScheduledShiftsView
          matrixShifts={matrixShifts}
          onExport={handleExportScheduled}
          onAdd={(pos) => {
            if (pos) setAddMenuAnchor(pos);
            setIsAddMenuOpen(true);
          }}
          onEditShift={(member, dayKey, currentVal) => {
            setEditingMatrixShift({ member, dayKey, currentVal });
          }}
        />
      </ScrollView>

      {/* Add Options Menu Modal */}
      <AddOptionsDropdownModal
        visible={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelectOption={handleSelectAddOption}
        top={addMenuAnchor?.top ?? 240}
        right={addMenuAnchor?.right ?? 16}
      />

      {/* Modals from Add dropdown */}
      <AddTimeOffModal visible={isTimeOffOpen} onClose={() => setIsTimeOffOpen(false)} />
      <AddBlockedTimeModal visible={isBlockedTimeOpen} onClose={() => setIsBlockedTimeOpen(false)} />
      <AddClosedPeriodModal visible={isClosedPeriodOpen} onClose={() => setIsClosedPeriodOpen(false)} />
      <AddWorkedShiftModal visible={isAddWorkedShiftOpen} onClose={() => setIsAddWorkedShiftOpen(false)} />

      {/* Edit Shift Modal */}
      <EditShiftModal
        visible={!!editingMatrixShift}
        onClose={() => setEditingMatrixShift(null)}
        initialTime={editingMatrixShift?.currentVal || "09:00 - 17:00"}
        memberName={editingMatrixShift?.member.name}
        onSave={handleSaveShift}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#111827",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
