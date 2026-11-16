import React from "react";
import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

interface LogoIconProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

export default function LogoIcon({
  width = 130,
  height = 35,
  style,
}: LogoIconProps) {
  return (
    <Image
      source={require("../../../assets/app/logo_text.png")}
      style={[
        styles.logo,
        { width, height },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    marginLeft: -10,
  },
});
