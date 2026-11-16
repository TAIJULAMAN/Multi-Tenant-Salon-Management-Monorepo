import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  buttonStyle,
  textStyle,
  icon,
  iconPosition = "left",
  ...rest
}: CustomButtonProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return styles.primaryContainer;
      case "secondary":
        return styles.secondaryContainer;
      case "outline":
        return styles.outlineContainer;
      case "danger":
        return styles.dangerContainer;
      case "ghost":
        return styles.ghostContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case "primary":
      case "danger":
        return styles.primaryText;
      case "secondary":
        return styles.secondaryText;
      case "outline":
      case "ghost":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return styles.smallContainer;
      case "medium":
        return styles.mediumContainer;
      case "large":
        return styles.largeContainer;
      default:
        return styles.mediumContainer;
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case "small":
        return styles.smallText;
      case "medium":
        return styles.mediumText;
      case "large":
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getVariantStyle(),
        getSizeStyle(),
        (disabled || isLoading) && styles.disabledContainer,
        style,
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#2B63E1" : "#FFFFFF"
          }
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <Text
            style={[
              styles.text,
              getVariantTextStyle(),
              getSizeTextStyle(),
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    gap: 8,
  },
  primaryContainer: {
    backgroundColor: "#2B63E1",
  },
  secondaryContainer: {
    backgroundColor: "#F3F4F6",
  },
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dangerContainer: {
    backgroundColor: "#EF4444",
  },
  ghostContainer: {
    backgroundColor: "transparent",
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  largeContainer: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#1F2937",
  },
  outlineText: {
    color: "#111827",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledContainer: {
    opacity: 0.6,
  },
});
