import React from "react";
import { BottomSheet as ExpoBottomSheet, BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function CustomBottomSheet({
  visible,
  onClose,
  title,
  headerRight,
  children,
}: CustomBottomSheetProps) {
  return (
    <ExpoBottomSheet
      index={visible ? 0 : -1}
      onClose={onClose}
      enablePanDownToClose
      enableDynamicSizing
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.sheetContainer}>
        {(title || headerRight) && (
          <View style={styles.sheetHeader}>
            {title ? <Text style={styles.sheetTitle}>{title}</Text> : <View />}
            {headerRight}
          </View>
        )}
        {children}
      </BottomSheetView>
    </ExpoBottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
  },
  sheetContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
});
