import React from "react";
import { View, Text, StyleSheet, Image, Platform, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Rect, Stop } from "react-native-svg";
import { colors, fonts } from "@/constants/figmaTheme";
import { GiftCardLogo, GiftCardTemplate } from "../clientsData";

const LOGO_SOURCE = require("../../../../assets/app/transparentIcon.png");
const SERIF = Platform.select({ ios: "Georgia", android: "serif", default: "serif" });
const GOLD = "#A9864E";

/**
 * Brand mark used on the gift cards. Figma shows a "Your logo" placeholder; per the branding rule the shared
 * GlamPro logo (transparentIcon + "GlamPro") is used instead.
 * main = colored mark + primary text, alternative = dark mark + dark text, minimal = mark only.
 */
export function BrandMark({
  logo,
  light,
  size = 14,
}: {
  logo: GiftCardLogo;
  light?: boolean;
  size?: number;
}) {
  if (logo === "none") return null;
  const textColor = light ? colors.white : logo === "alternative" ? colors.text : colors.primary;
  const tint = light ? colors.white : logo === "alternative" ? colors.text : undefined;
  return (
    <View style={styles.logoRow}>
      <Image source={LOGO_SOURCE} style={{ width: size * 1.4, height: size * 1.4, tintColor: tint }} resizeMode="contain" />
      {logo !== "minimal" && (
        <Text style={[styles.logoText, { color: textColor, fontSize: size }]}>GlamPro</Text>
      )}
    </View>
  );
}

/** Gift box with ribbon + confetti (template 1 artwork). */
function GiftArtwork({ faded }: { faded?: boolean }) {
  const op = faded ? 0.35 : 1;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 180" preserveAspectRatio="xMaxYMax meet">
      {!faded && (
        <>
          <Polygon points="50,20 54,30 64,30 56,36 59,46 50,40 41,46 44,36 36,30 46,30" fill="none" stroke={colors.teal} strokeWidth={2} />
          <Polygon points="125,12 128,20 136,20 130,25 132,33 125,28 118,33 120,25 114,20 122,20" fill="none" stroke={colors.pink} strokeWidth={2} />
          <Circle cx={20} cy={70} r={6} fill="none" stroke={colors.teal} strokeWidth={2} />
          <Circle cx={168} cy={36} r={6} fill="none" stroke={colors.teal} strokeWidth={2} />
          <Circle cx={180} cy={80} r={5} fill="none" stroke={colors.pink} strokeWidth={2} />
          <Path d="M88 8 q6 6 0 12 q-6 6 0 12 q6 6 0 12" stroke={colors.teal} strokeWidth={2} fill="none" />
          <Path d="M10 40 q6 4 2 10 q-4 6 2 10" stroke={colors.pink} strokeWidth={2} fill="none" />
          <Path d="M150 50 q6 -4 10 2 q4 6 10 2" stroke={colors.teal} strokeWidth={2} fill="none" />
        </>
      )}
      {/* bow */}
      <Path d="M100 92 C 70 50, 52 80, 70 96 Z" fill={colors.pink} opacity={op} />
      <Path d="M100 92 C 130 50, 148 80, 130 96 Z" fill={colors.pink} opacity={op} />
      <Path d="M100 92 C 80 66, 70 82, 78 92 Z" fill="#7B2FBF" opacity={op * 0.7} />
      <Path d="M100 92 C 120 66, 130 82, 122 92 Z" fill="#7B2FBF" opacity={op * 0.7} />
      {/* lid + box */}
      <Rect x={40} y={94} width={120} height={30} rx={4} fill={faded ? colors.white : colors.teal} opacity={faded ? 0.35 : 1} />
      <Rect x={48} y={124} width={104} height={60} fill={faded ? colors.white : colors.teal} opacity={faded ? 0.3 : 0.92} />
      <Rect x={92} y={92} width={16} height={92} fill={faded ? "#7B2FBF" : colors.pink} opacity={faded ? 0.5 : 1} />
    </Svg>
  );
}

/** Front of the gift card (template 1 = violet "Gift card", template 2 = gold "GIFT CARD" VIP). */
export function GiftCardFront({
  template,
  amount,
  currency = "€",
  hideAmount,
  logo = "main",
  height = 180,
  style,
}: {
  template: GiftCardTemplate;
  amount: number | string;
  currency?: string;
  hideAmount?: boolean;
  logo?: GiftCardLogo;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  if (template === 1) {
    return (
      <View style={style}>
        <View style={[styles.front, styles.violet, { height }]}>
          <View style={styles.artRight}>
            <GiftArtwork />
          </View>
          <BrandMark logo={logo} light />
          <View style={styles.front1Body}>
            {!hideAmount && (
              <Text style={[styles.amountValue, { fontSize: height * 0.26 }]} numberOfLines={1}>
                {currency}
                {" "}
                {amount || 0}
              </Text>
            )}
            <View style={styles.giftScriptRow}>
              <Text style={[styles.giftScript, { fontSize: height * 0.2 }]}>Gift</Text>
              <Text style={[styles.cardScript, { fontSize: height * 0.09 }]}>card</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardShadow} />
      </View>
    );
  }
  return (
    <View style={style}>
      <View style={[styles.front, styles.gold, { height }]}>
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 300 180" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="goldBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F4F1EA" />
              <Stop offset="1" stopColor="#B9AA8E" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={300} height={180} fill="url(#goldBg)" />
          {[0, 40, 80, 120, 160, 200, 240, 280].map((x) => (
            <Polygon key={x} points={`${x},0 ${x + 18},0 ${x - 60},180 ${x - 78},180`} fill="#A08C68" opacity={0.35} />
          ))}
        </Svg>
        <View style={styles.goldInner}>
          <Text style={[styles.giftCaps, { fontSize: height * 0.15 }]}>GIFT CARD</Text>
          <Text style={styles.goldText} numberOfLines={3}>
            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book.
          </Text>
          {!hideAmount && (
            <Text style={styles.goldAmount}>
              {currency} {amount || 0}
            </Text>
          )}
          <View style={{ marginTop: "auto" }}>
            <BrandMark logo={logo === "main" ? "alternative" : logo} size={10} />
          </View>
          <View style={styles.vipSeal}>
            <View style={styles.vipInner}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cardShadow} />
    </View>
  );
}

/** Back of the gift card (Figma "From / To" side): gifter, receiver, message, salon info. */
export function GiftCardBack({
  salonName,
  address,
  website,
  gifterName,
  receiverName,
  message,
  height = 200,
}: {
  salonName: string;
  address: string;
  website: string;
  gifterName: string;
  receiverName: string;
  message: string;
  height?: number;
}) {
  return (
    <View>
      <View style={[styles.front, styles.violet, styles.back, { height }]}>
        <View style={[styles.artRight, { opacity: 0.9 }]}>
          <GiftArtwork faded />
        </View>
        <Text style={styles.fromLabel}>From</Text>
        <Text style={styles.fromValue} numberOfLines={1}>
          {gifterName || "Gifter Name"}
        </Text>
        <Text style={[styles.fromLabel, { marginTop: 8 }]}>To</Text>
        <Text style={styles.fromValue} numberOfLines={1}>
          {receiverName || "Receiver Name"}
        </Text>
        <View style={styles.backBottom}>
          <Text style={styles.message} numberOfLines={5}>
            {message ||
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."}
          </Text>
          <View style={styles.salonBlock}>
            <Text style={styles.salonName} numberOfLines={2}>
              {salonName || "Salon Name"}
            </Text>
            <Text style={styles.salonMeta} numberOfLines={1}>
              {address || "Address"}
            </Text>
            <Text style={styles.salonMeta} numberOfLines={1}>
              {website || "Website"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  front: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 18,
  },
  violet: {
    backgroundColor: colors.primary,
  },
  gold: {
    padding: 14,
  },
  cardShadow: {
    height: 10,
    marginHorizontal: 12,
    marginTop: -2,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "rgba(41, 52, 61, 0.18)",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoText: {
    fontFamily: fonts.semibold,
  },
  artRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 8,
    width: "58%",
  },
  front1Body: {
    flex: 1,
    justifyContent: "flex-end",
    width: "55%",
  },
  amountValue: {
    fontFamily: fonts.bold,
    color: colors.white,
  },
  giftScriptRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: -4,
  },
  giftScript: {
    fontFamily: fonts.medium,
    fontStyle: "italic",
    color: colors.teal,
  },
  cardScript: {
    fontFamily: fonts.semibold,
    color: colors.teal,
    marginLeft: 2,
    marginBottom: 4,
  },
  goldInner: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  giftCaps: {
    fontFamily: SERIF,
    color: GOLD,
    letterSpacing: 1.5,
  },
  goldText: {
    width: "62%",
    fontSize: 7,
    lineHeight: 10,
    fontFamily: fonts.regular,
    color: GOLD,
  },
  goldAmount: {
    fontSize: 14,
    fontFamily: SERIF,
    color: GOLD,
  },
  vipSeal: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#C9A55C",
    borderWidth: 3,
    borderColor: "#8A6A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  vipInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F7F1E3",
    alignItems: "center",
    justifyContent: "center",
  },
  vipText: {
    fontFamily: SERIF,
    fontSize: 16,
    fontWeight: "700",
    color: "#6B4F1D",
  },
  back: {
    padding: 22,
  },
  fromLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  fromValue: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.regular,
    color: colors.white,
    width: "60%",
  },
  backBottom: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 8,
    lineHeight: 12,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  salonBlock: {
    width: "40%",
    alignItems: "flex-end",
  },
  salonName: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: "right",
  },
  salonMeta: {
    fontSize: 7,
    fontFamily: fonts.regular,
    color: colors.white,
    opacity: 0.85,
  },
});
