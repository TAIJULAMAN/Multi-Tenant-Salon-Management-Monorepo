import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Host, Switch as ExpoSwitch } from "@expo/ui";

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
  style,
  scale = 0.72,
}: CustomSwitchProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.scaledWrapper, { transform: [{ scale }] }]}>
        <Host matchContents colorScheme="light" seedColor={activeColor}>
          <ExpoSwitch
            value={value}
            onValueChange={onValueChange}
          />
        </Host>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scaledWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
