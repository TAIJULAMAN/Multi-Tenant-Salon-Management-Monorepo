import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSwitch from "@/components/ui/CustomSwitch";

export default function AddGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Wizard state
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [numCards, setNumCards] = useState("1");
  const [amount, setAmount] = useState("170");
  const [currency, setCurrency] = useState("€ EUR");
  const [hideAmount, setHideAmount] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<1 | 2 | 3>(1);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Step 2 state
  const [selectedLogo, setSelectedLogo] = useState<1 | 2 | 3 | 4>(2);
  const [salonName, setSalonName] = useState("CEU HAREM ACCONCIATURE");
  const [website, setWebsite] = useState("www.degradepartenassafra.it");
  const [address, setAddress] = useState("Via Rodipuglia 44/A - MASSAFRA (TA)");
  const [issueDate, setIssueDate] = useState("02/09/2025");
  const [expirationDate, setExpirationDate] = useState("02/20/2025");
  const [usageLimit, setUsageLimit] = useState("1");
  const [eligibleServices, setEligibleServices] = useState("All Services");
  const [receiverName, setReceiverName] = useState("");
  const [gifterName, setGifterName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const handleNext = () => {
    if (!amount.trim() && !hideAmount) {
      Alert.alert("Required", "Please enter gift card amount.");
      return;
    }
    setStep(2);
  };

  const handleCreate = () => {
    Alert.alert(
      "Gift Card Issued",
      `Successfully created ${numCards} Gift Card voucher(s) for ${salonName}!`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 2) setStep(1);
            else router.back();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Gift Card</Text>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ========================================================================= */}
        {/* STEP 1: BASIC DETAILS & TEMPLATES */}
        {/* ========================================================================= */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            {/* Basic Details Card */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Basic Details</Text>

              {/* How many cards */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>How many gift cards do you want to create? *</Text>
                <TextInput
                  style={styles.input}
                  value={numCards}
                  onChangeText={setNumCards}
                  keyboardType="numeric"
                  placeholder="1"
                />
              </View>

              {/* Amount & Hide Amount Switch */}
              <View style={styles.formGroup}>
                <View style={styles.amountHeaderRow}>
                  <Text style={styles.label}>Amount *</Text>
                  <TouchableOpacity
                    style={styles.hideAmountCol}
                    activeOpacity={0.7}
                    onPress={() => setHideAmount(!hideAmount)}
                  >
                    <Text style={styles.hideAmountText}>Hide amount</Text>
                    <CustomSwitch value={hideAmount} onValueChange={setHideAmount} />
                  </TouchableOpacity>
                </View>

                <View style={styles.amountInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }, hideAmount && styles.inputDisabled]}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Enter amount"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    editable={!hideAmount}
                  />

                  {/* Currency Selector */}
                  <TouchableOpacity
                    style={styles.currencyBtn}
                    onPress={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.currencyBtnText}>{currency}</Text>
                    <Ionicons name="chevron-down" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {currencyDropdownOpen && (
                  <View style={styles.currencyMenu}>
                    {["€ EUR", "$ USD", "£ GBP"].map((curr) => (
                      <TouchableOpacity
                        key={curr}
                        style={[styles.currencyItem, currency === curr && styles.currencyItemActive]}
                        onPress={() => {
                          setCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                      >
                        <Text style={[styles.currencyItemText, currency === curr && styles.currencyItemTextActive]}>
                          {curr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Select Template Card */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Select Template</Text>

              {/* Template 1 */}
              <TouchableOpacity
                style={[styles.templateCard, selectedTemplate === 1 && styles.templateCardActive]}
                onPress={() => setSelectedTemplate(1)}
                activeOpacity={0.85}
              >
                {/* Visual Art Box */}
                <View style={[styles.templateArtBox, { backgroundColor: "#635BFF" }]}>
                  <View style={styles.templateLogoBadge}>
                    <Ionicons name="sparkles" size={12} color="#635BFF" />
                    <Text style={styles.templateLogoBadgeText}>Your logo</Text>
                  </View>
                  <Ionicons name="gift" size={48} color="#A7F3D0" style={styles.templateArtIcon} />
                  <Text style={styles.templateArtTitle}>Gift Card</Text>
                </View>

                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>Celebration Sparkle Template</Text>
                  <Text style={styles.templateDesc}>Vibrant festive card with custom logo and gift illustration.</Text>
                </View>
              </TouchableOpacity>

              {/* Template 2 */}
              <TouchableOpacity
                style={[styles.templateCard, selectedTemplate === 2 && styles.templateCardActive]}
                onPress={() => setSelectedTemplate(2)}
                activeOpacity={0.85}
              >
                {/* Visual Art Box */}
                <View style={[styles.templateArtBox, { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0" }]}>
                  <View style={styles.templateLogoBadge}>
                    <Ionicons name="sparkles" size={12} color="#1E293B" />
                    <Text style={[styles.templateLogoBadgeText, { color: "#1E293B" }]}>Your logo</Text>
                  </View>
                  <View style={styles.vipMedallion}>
                    <Ionicons name="ribbon" size={24} color="#D97706" />
                    <Text style={styles.vipMedallionText}>VIP</Text>
                  </View>
                  <Text style={[styles.templateArtTitle, { color: "#B45309" }]}>GIFT CARD</Text>
                </View>

                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>VIP Gold Luxury Template</Text>
                  <Text style={styles.templateDesc}>Premium metallic elegance with golden medallion emblem.</Text>
                </View>
              </TouchableOpacity>

              {/* Custom Upload Card */}
              <TouchableOpacity
                style={styles.customUploadCard}
                onPress={() => Alert.alert("Upload", "Select custom graphic from library...")}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconBox}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#635BFF" />
                </View>
                <Text style={styles.uploadTitle}>Upload Custom Gift Card</Text>
                <Text style={styles.uploadSub}>PNG, JPG or SVG up to 5MB</Text>
              </TouchableOpacity>
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: LOGO & BRANDING, DETAILS & LIVE PREVIEW */}
        {/* ========================================================================= */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            {/* Section 1: Logo & Branding */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Logo and Branding</Text>
              <Text style={styles.label}>Choose Logo</Text>

              <View style={styles.logosGrid}>
                {[
                  { id: 1 as const, label: "No logo", icon: "ban" },
                  { id: 2 as const, label: "Main Logo", icon: "sparkles" },
                  { id: 3 as const, label: "Alternative Logo", icon: "diamond" },
                  { id: 4 as const, label: "Minimal Logo", icon: "ellipse" },
                ].map((item) => {
                  const isSelected = selectedLogo === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.logoOptionCard, isSelected && styles.logoOptionCardActive]}
                      onPress={() => setSelectedLogo(item.id)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.logoIconCircle, isSelected && styles.logoIconCircleActive]}>
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color={isSelected ? "#635BFF" : "#64748B"}
                        />
                      </View>
                      <Text style={[styles.logoOptionLabel, isSelected && styles.logoOptionLabelActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.customizeLogoRow}>
                <Text style={styles.label}>Template Colors</Text>
                <TouchableOpacity
                  style={styles.customizeLogoBtn}
                  onPress={() => Alert.alert("Colors", "Customize accent colors for salon branding.")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="color-palette-outline" size={14} color="#635BFF" />
                  <Text style={styles.customizeLogoBtnText}>Customize Logo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Live Preview Card */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Live Preview</Text>

              {/* Graphic Voucher */}
              <View
                style={[
                  styles.previewVoucher,
                  selectedTemplate === 2
                    ? { backgroundColor: "#1E293B" }
                    : { backgroundColor: "#635BFF" },
                ]}
              >
                {/* Top Logo & Title */}
                <View style={styles.voucherHeaderRow}>
                  <View style={styles.voucherLogoBox}>
                    <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                    <Text style={styles.voucherLogoText}>
                      {selectedLogo === 1 ? "No Logo" : salonName}
                    </Text>
                  </View>
                  {!hideAmount && (
                    <Text style={styles.voucherAmountTag}>
                      {currency.split(" ")[0]} {amount}
                    </Text>
                  )}
                </View>

                {/* Central Art */}
                <View style={styles.voucherArtCenter}>
                  <Ionicons
                    name={selectedTemplate === 2 ? "ribbon" : "gift"}
                    size={42}
                    color="#FDE68A"
                  />
                  <Text style={styles.voucherMainTitle}>
                    {selectedTemplate === 2 ? "VIP GIFT CARD" : "GIFT CARD"}
                  </Text>
                </View>

                {/* Bottom Details */}
                <View style={styles.voucherBottomRow}>
                  <View>
                    <Text style={styles.voucherSubLabel}>Recipient</Text>
                    <Text style={styles.voucherSubValue}>
                      {receiverName || "Receiver Name"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.voucherSubLabel}>From</Text>
                    <Text style={styles.voucherSubValue}>
                      {gifterName || "Gifter Name"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Section 3: Gift Card Details Form */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Gift Card Details</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Salon Name *</Text>
                <TextInput
                  style={styles.input}
                  value={salonName}
                  onChangeText={setSalonName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Website *</Text>
                <TextInput
                  style={styles.input}
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Date of Issue *</Text>
                  <TextInput
                    style={styles.input}
                    value={issueDate}
                    onChangeText={setIssueDate}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Date of Expiration *</Text>
                  <TextInput
                    style={styles.input}
                    value={expirationDate}
                    onChangeText={setExpirationDate}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Usage Limit *</Text>
                  <TextInput
                    style={styles.input}
                    value={usageLimit}
                    onChangeText={setUsageLimit}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Eligible Services *</Text>
                  <TextInput
                    style={styles.input}
                    value={eligibleServices}
                    onChangeText={setEligibleServices}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Receiver Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter receiver name"
                    placeholderTextColor="#94A3B8"
                    value={receiverName}
                    onChangeText={setReceiverName}
                  />
                </View>
                <View style={styles.formCol}>
                  <Text style={styles.label}>Gifter Name (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter gifter name"
                    placeholderTextColor="#94A3B8"
                    value={gifterName}
                    onChangeText={setGifterName}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Personal Message (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter a greeting or personal note"
                  placeholderTextColor="#94A3B8"
                  value={personalMessage}
                  onChangeText={setPersonalMessage}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.step2FooterRow}>
              <TouchableOpacity
                style={styles.backStepBtn}
                onPress={() => setStep(1)}
                activeOpacity={0.7}
              >
                <Text style={styles.backStepBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleCreate}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.createBtnText}>Create Gift Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  stepContainer: {
    gap: 16,
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  formGroup: {
    gap: 6,
    position: "relative",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formCol: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  amountHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  hideAmountCol: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  hideAmountText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  amountInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  inputDisabled: {
    backgroundColor: "#F8FAFC",
    color: "#94A3B8",
  },
  currencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  currencyBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  currencyMenu: {
    position: "absolute",
    top: 76,
    right: 0,
    width: 110,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  currencyItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  currencyItemActive: {
    backgroundColor: "#F5F3FF",
  },
  currencyItemText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  currencyItemTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  templateCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  templateCardActive: {
    borderColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  templateArtBox: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  templateLogoBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  templateLogoBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  templateArtIcon: {
    marginTop: 8,
  },
  templateArtTitle: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
    letterSpacing: 1,
    marginTop: 4,
  },
  vipMedallion: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F59E0B",
    marginTop: 6,
  },
  vipMedallionText: {
    fontSize: 8,
    fontFamily: "Manrope_800ExtraBold",
    color: "#B45309",
  },
  templateInfo: {
    padding: 12,
    gap: 3,
  },
  templateName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  templateDesc: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 16,
  },
  customUploadCard: {
    borderWidth: 1.5,
    borderColor: "#635BFF",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  uploadIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  uploadSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Step 2 styles
  logosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  logoOptionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  logoOptionCardActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  logoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  logoIconCircleActive: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  logoOptionLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  logoOptionLabelActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  customizeLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  customizeLogoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  customizeLogoBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  previewVoucher: {
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  voucherHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherLogoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  voucherLogoText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  voucherAmountTag: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  voucherArtCenter: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  voucherMainTitle: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  voucherBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 8,
  },
  voucherSubLabel: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "rgba(255,255,255,0.7)",
  },
  voucherSubValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    marginTop: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  step2FooterRow: {
    flexDirection: "row",
    gap: 12,
  },
  backStepBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  backStepBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  createBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
