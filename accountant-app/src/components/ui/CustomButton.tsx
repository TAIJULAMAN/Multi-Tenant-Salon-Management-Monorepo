import React from "react";
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from "react-native";
import { Host } from "@expo/ui";
import {
  Button as ComposeButton,
  OutlinedButton,
  TextButton,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "filled" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  buttonStyle,
  fullWidth = true,
}: CustomButtonProps) {
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return styles.smallContainer;
      case "large":
        return styles.largeContainer;
      case "medium":
      default:
        return styles.mediumContainer;
    }
  };

  const isOutlined =
    variant === "outline" || variant === "outlined" || variant === "ghost";
  const isText = variant === "text";

  const ComposeBtn = isText
    ? TextButton
    : isOutlined
    ? OutlinedButton
    : ComposeButton;

  const btnModifiers = fullWidth ? [fillMaxWidth()] : undefined;

  return (
    <View style={[styles.wrapper, getSizeStyle(), style, buttonStyle]}>
      <Host
        matchContents={false}
        colorScheme="light"
        style={styles.hostStyle}
      >
        <ComposeBtn
          onClick={disabled ? undefined : onPress}
          enabled={!disabled}
          modifiers={btnModifiers}
        >
          <ComposeText maxLines={1}>{title}</ComposeText>
        </ComposeBtn>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "stretch",
  },
  hostStyle: {
    width: "100%",
    height: "100%",
  },
  smallContainer: {
    minHeight: 36,
    height: 36,
  },
  mediumContainer: {
    minHeight: 46,
    height: 46,
  },
  largeContainer: {
    minHeight: 54,
    height: 54,
  },
});
