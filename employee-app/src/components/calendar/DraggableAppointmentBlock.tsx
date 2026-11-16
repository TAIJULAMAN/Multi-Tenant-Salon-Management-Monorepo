import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import {
  CalAppointment,
  StaffMember,
} from "./types";
import {
  statusTheme,
  timeToMinutes,
  minutesToTime,
  to12h,
  START_HOUR,
  END_HOUR,
  TIME_COLUMN_WIDTH,
} from "./data";

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
    if (!isDragging.get()) {
      posX.set(baseLeft);
      posY.set(topPos);
      startX.set(baseLeft);
      startY.set(topPos);
      zIndex.set(10);
    }
  }, [baseLeft, topPos, isDragging, posX, posY, startX, startY, zIndex]);

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
      isDragging.set(true);
      scale.set(withSpring(1.03));
      zIndex.set(999);
      startX.set(posX.get());
      startY.set(posY.get());
      runOnJS(handleStart)();
    })
    .onUpdate((e) => {
      "worklet";
      posX.set(startX.get() + e.translationX);
      posY.set(startY.get() + e.translationY);
      runOnJS(handleUpdate)(e.translationX, e.translationY);
    })
    .onEnd((e) => {
      "worklet";
      isDragging.set(false);
      scale.set(withTiming(1, { duration: 120 }));

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

      posX.set(withTiming(targetLeft, animConfig));
      posY.set(withTiming(targetTop, animConfig, (finished) => {
        if (finished) {
          zIndex.set(10);
          runOnJS(handleFinish)(e.translationX, e.translationY);
        }
      }));
    })
    .onFinalize((isFinished) => {
      "worklet";
      if (!isFinished) {
        isDragging.set(false);
        scale.set(withTiming(1, { duration: 100 }));
        zIndex.set(10);
        posX.set(withTiming(baseLeft, { duration: 100 }));
        posY.set(withTiming(topPos, { duration: 100 }));
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
        { translateX: posX.get() },
        { translateY: posY.get() },
        { scale: scale.get() },
      ],
      zIndex: zIndex.get(),
      shadowOpacity: isDragging.get() ? 0.3 : 0.08,
      shadowRadius: isDragging.get() ? 12 : 3,
      elevation: isDragging.get() ? 16 : 2,
    };
  });

  // Figma "label": tinted status background, 3px status border on the left,
  // "Service (Client Name) - start - end" in the status colour.
  const isTall = blockHeight >= 56;

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
        <Text style={[styles.label, { color: theme.text }]} numberOfLines={isTall ? 2 : 1}>
          {appointment.service} ({appointment.clientName}) - {to12h(appointment.startTime)} - {to12h(appointment.endTime)}
        </Text>
        {isTall && (
          <Text style={[styles.meta, { color: theme.text }]} numberOfLines={1}>
            {staff.name}
          </Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 6,
    borderLeftWidth: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
    overflow: "hidden",
    shadowColor: "#AFB6C9",
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontFamily: "Manrope_400Regular",
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
});
