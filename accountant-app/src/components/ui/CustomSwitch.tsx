import React from "react";
import { View, StyleSheet, ViewStyle, Switch, Platform } from "react-native";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
  scale?: number;
}

export default function CustomSwitch({
  value,
  onValueChange,
  activeColor = "#635BFF",
  inactiveColor = "#E2E8F0",
  style,
  scale = 0.85,
}: CustomSwitchProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.scaledWrapper, { transform: [{ scale }] }]}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: inactiveColor, true: activeColor }}
          thumbColor={Platform.OS === "android" ? (value ? "#FFFFFF" : "#F8FAFC") : "#FFFFFF"}
          ios_backgroundColor={inactiveColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  scaledWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
