import React, { useState, ComponentProps } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  label?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  isPassword?: boolean;
}

export default function CustomInput({
  label,
  iconName,
  error,
  isPassword,
  style,
  ...props
}: CustomInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
        {iconName && (
          <Ionicons
            name={iconName as any}
            size={20}
            color="#9CA3AF"
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  inputErrorBorder: {
    borderColor: "#EF4444",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#1E293B",
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#EF4444",
    marginTop: 4,
  },
});
