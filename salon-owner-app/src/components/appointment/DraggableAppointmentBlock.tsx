import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import {
  CalAppointment,
  StaffMember,
} from "./types";
import {
  statusTheme,
  timeToMinutes,
  minutesToTime,
  START_HOUR,
  END_HOUR,
  TIME_COLUMN_WIDTH,
} from "./data";
import Avatar from "@/components/Avatar";

interface Props {
  appointment: CalAppointment;
  staff: StaffMember;
  columnIndex: number;
  baseLeft: number;
  colWidth: number;
  hourHeight: number;
  staffList: StaffMember[];
  onPress: (appt: CalAppointment) => void;
  onDragStart?: (appt: CalAppointment) => void;
  onDragUpdate?: (
    appt: CalAppointment,
    hoverStaff: StaffMember,
    snappedStart: string,
    snappedEnd: string
  ) => void;
  onDragEnd?: (
    appt: CalAppointment,
    newStaff: StaffMember,
    newStart: string,
    newEnd: string
  ) => void;
}

export default function DraggableAppointmentBlock({
  appointment,
  staff,
  columnIndex,
  baseLeft,
  colWidth,
  hourHeight,
  staffList,
  onPress,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: Props) {
  const startMin = timeToMinutes(appointment.startTime);
  const endMin = timeToMinutes(appointment.endTime);
  const durationMin = Math.max(15, endMin - startMin);
  const startHourMin = START_HOUR * 60;
  const endHourMin = (END_HOUR + 1) * 60;
  const staffCount = staffList.length;

  // Position within column
  const topPos = ((startMin - startHourMin) / 60) * hourHeight;
  const blockHeight = Math.max(42, (durationMin / 60) * hourHeight);

  const theme = statusTheme[appointment.status] || statusTheme.Booked;

  // Single source of absolute positioning via Reanimated shared values
  // This eliminates the 1-frame double-offset jump during React state synchronization
  const posX = useSharedValue(baseLeft);
  const posY = useSharedValue(topPos);
  const startX = useSharedValue(baseLeft);
  const startY = useSharedValue(topPos);
  const isDragging = useSharedValue(false);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(10);

  // Synchronize when external props update (or when dropped into state)
  useEffect(() => {
    if (!isDragging.value) {
      posX.value = baseLeft;
      posY.value = topPos;
      startX.value = baseLeft;
      startY.value = topPos;
      zIndex.value = 10;
    }
  }, [baseLeft, topPos]);

  const calculateTarget = (tx: number, ty: number) => {
    const currentLeft = columnIndex * colWidth;
    const targetX = currentLeft + tx + colWidth / 2;
    const targetColIdx = Math.max(
      0,
      Math.min(staffCount - 1, Math.floor(targetX / colWidth))
    );
    const targetStaff = staffList[targetColIdx];

    const currentTopMin = startMin;
    const deltaMin = Math.round(((ty / hourHeight) * 60) / 15) * 15;
    const rawNewStart = currentTopMin + deltaMin;
    const minAllowed = startHourMin;
    const maxAllowed = endHourMin - durationMin;
    const clampedStart = Math.max(minAllowed, Math.min(maxAllowed, rawNewStart));
    const clampedEnd = clampedStart + durationMin;

    return {
      targetStaff,
      targetColIdx,
      clampedStart,
      snappedStart: minutesToTime(clampedStart),
      snappedEnd: minutesToTime(clampedEnd),
    };
  };

  const handleStart = () => {
    if (onDragStart) {
      onDragStart(appointment);
    }
  };

  const handleUpdate = (tx: number, ty: number) => {
    if (onDragUpdate) {
      const { targetStaff, snappedStart, snappedEnd } = calculateTarget(tx, ty);
      onDragUpdate(appointment, targetStaff, snappedStart, snappedEnd);
    }
  };

  const handleFinish = (tx: number, ty: number) => {
    const { targetStaff, snappedStart, snappedEnd } = calculateTarget(tx, ty);
    if (onDragEnd) {
      onDragEnd(appointment, targetStaff, snappedStart, snappedEnd);
    }
  };

  const handleTap = () => {
    onPress(appointment);
  };

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(160)
    .onStart(() => {
      "worklet";
      isDragging.value = true;
      scale.value = withSpring(1.03);
      zIndex.value = 999;
      startX.value = posX.value;
      startY.value = posY.value;
      runOnJS(handleStart)();
    })
    .onUpdate((e) => {
      "worklet";
      posX.value = startX.value + e.translationX;
      posY.value = startY.value + e.translationY;
      runOnJS(handleUpdate)(e.translationX, e.translationY);
    })
    .onEnd((e) => {
      "worklet";
      isDragging.value = false;
      scale.value = withTiming(1, { duration: 120 });

      // Calculate target column
      const currentLeft = columnIndex * colWidth;
      const targetX = currentLeft + e.translationX + colWidth / 2;
      const targetColIdx = Math.max(
        0,
        Math.min(staffCount - 1, Math.floor(targetX / colWidth))
      );
      const targetLeft = TIME_COLUMN_WIDTH + targetColIdx * colWidth + 4;

      // Calculate target time
      const deltaMin = Math.round(((e.translationY / hourHeight) * 60) / 15) * 15;
      const rawNewStart = startMin + deltaMin;
      const minAllowed = startHourMin;
      const maxAllowed = endHourMin - durationMin;
      const clampedStart = Math.max(minAllowed, Math.min(maxAllowed, rawNewStart));
      const targetTop = ((clampedStart - startHourMin) / 60) * hourHeight;

      // Animate directly to target slot with fluid timing curve
      const animConfig = {
        duration: 120,
        easing: Easing.out(Easing.quad),
      };

      posX.value = withTiming(targetLeft, animConfig);
      posY.value = withTiming(targetTop, animConfig, (finished) => {
        if (finished) {
          zIndex.value = 10;
          runOnJS(handleFinish)(e.translationX, e.translationY);
        }
      });
    })
    .onFinalize((isFinished) => {
      "worklet";
      if (!isFinished) {
        isDragging.value = false;
        scale.value = withTiming(1, { duration: 100 });
        zIndex.value = 10;
        posX.value = withTiming(baseLeft, { duration: 100 });
        posY.value = withTiming(topPos, { duration: 100 });
      }
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      "worklet";
      runOnJS(handleTap)();
    });

  const composedGesture = Gesture.Exclusive(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: posX.value },
        { translateY: posY.value },
        { scale: scale.value },
      ],
      zIndex: zIndex.value,
      shadowOpacity: isDragging.value ? 0.3 : 0.08,
      shadowRadius: isDragging.value ? 12 : 3,
      elevation: isDragging.value ? 16 : 2,
    };
  });

  // Duration layout breakpoints matching Web Dashboard AppPill.tsx
  const isShortCard = durationMin <= 35; // 30m or less
  const isMediumCard = durationMin > 35 && durationMin <= 50; // 45m (e.g. Beard Trim)
  const isTallCard = durationMin > 50; // 60m+

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.block,
          {
            width: colWidth - 8,
            height: blockHeight,
            backgroundColor: theme.bg,
            borderLeftColor: theme.border,
          },
          animatedStyle,
        ]}
      >
        {isShortCard ? (
          /* Short Card Layout (<= 35m, e.g. 30m) */
          <View style={styles.shortLayout}>
            <View style={styles.topRow}>
              <Avatar
                name={appointment.clientName}
                uri={appointment.clientAvatar}
                size={16}
              />
              <Text
                style={[styles.clientNameCompact, { color: theme.text }]}
                numberOfLines={1}
              >
                {appointment.clientName}
              </Text>
              <View
                style={[
                  styles.badgeCompact,
                  { backgroundColor: theme.badgeBg },
                ]}
              >
                <Text
                  style={[styles.badgeTextCompact, { color: theme.badgeText }]}
                  numberOfLines={1}
                >
                  {appointment.status}
                </Text>
              </View>
            </View>
            <View style={styles.compactSubRow}>
              <Text style={styles.timeTextCompact} numberOfLines={1}>
                {appointment.startTime} - {appointment.endTime} • {appointment.service}
              </Text>
            </View>
          </View>
        ) : isMediumCard ? (
          /* Medium Card Layout (36-50m, e.g. Beard Trim 45m) */
          <View style={styles.mediumLayout}>
            <View style={styles.topRow}>
              <Avatar
                name={appointment.clientName}
                uri={appointment.clientAvatar}
                size={18}
              />
              <Text
                style={[styles.clientNameMedium, { color: theme.text }]}
                numberOfLines={1}
              >
                {appointment.clientName}
              </Text>
              <View
                style={[
                  styles.badgeCompact,
                  { backgroundColor: theme.badgeBg },
                ]}
              >
                <Text
                  style={[styles.badgeTextCompact, { color: theme.badgeText }]}
                  numberOfLines={1}
                >
                  {appointment.status}
                </Text>
              </View>
            </View>

            <Text style={styles.serviceNameMedium} numberOfLines={1}>
              {appointment.service}
            </Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={11} color="#6B7280" />
              <Text style={styles.timeTextMedium} numberOfLines={1}>
                {appointment.startTime} - {appointment.endTime}
              </Text>
            </View>
          </View>
        ) : (
          /* Tall Card Layout (50m+, e.g. 60m, 75m, 90m+) */
          <View style={styles.tallLayout}>
            <View style={styles.topRow}>
              <Avatar
                name={appointment.clientName}
                uri={appointment.clientAvatar}
                size={22}
              />
              <Text
                style={[styles.clientNameTall, { color: theme.text }]}
                numberOfLines={1}
              >
                {appointment.clientName}
              </Text>
              <View
                style={[styles.badgeTall, { backgroundColor: theme.badgeBg }]}
              >
                <Text style={[styles.badgeTextTall, { color: theme.badgeText }]}>
                  {appointment.status}
                </Text>
              </View>
            </View>

            <Text style={styles.serviceNameTall} numberOfLines={1}>
              {appointment.service}
            </Text>

            <View style={styles.tallFooter}>
              <View style={styles.timeBadgeRow}>
                <Ionicons name="time-outline" size={12} color="#6B7280" />
                <Text style={styles.timeTextTall}>
                  {appointment.startTime} - {appointment.endTime}
                </Text>
              </View>
              {durationMin >= 75 && (
                <View style={styles.extraDetailsRow}>
                  <Text style={styles.priceTag}>{appointment.price}</Text>
                  <Text style={styles.durationTag}>• {appointment.duration}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 10,
    borderLeftWidth: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  badgeTextCompact: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9,
  },
  badgeTall: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    flexShrink: 0,
  },
  badgeTextTall: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  shortLayout: {
    flex: 1,
    justifyContent: "space-between",
  },
  clientNameCompact: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10.5,
    flex: 1,
  },
  compactSubRow: {
    marginTop: 1,
  },
  timeTextCompact: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9,
    color: "#6B7280",
  },
  mediumLayout: {
    flex: 1,
    justifyContent: "space-between",
  },
  clientNameMedium: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    flex: 1,
  },
  serviceNameMedium: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#4B5563",
  },
  timeTextMedium: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#6B7280",
  },
  tallLayout: {
    flex: 1,
    justifyContent: "space-between",
  },
  clientNameTall: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    flex: 1,
  },
  serviceNameTall: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#4B5563",
    marginTop: 1,
  },
  tallFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 3,
  },
  timeBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  timeTextTall: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#6B7280",
  },
  extraDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  priceTag: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
    color: "#1F2937",
  },
  durationTag: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#9CA3AF",
  },
});
