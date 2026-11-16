import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomModal from "@/components/ui/CustomModal";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

interface InviteSalonBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newInvitation: {
    salonName: string;
    email: string;
    plan: string;
    share: string;
  }) => void;
}

const BADGE_OPTIONS = ["SRL", "SPA", "SRLS", "SNC", "SAS", "Ind."];
const PLAN_OPTIONS = [
  { name: "Basic", price: "€1,000 / yr", desc: "For single-chair & independent salons" },
  { name: "Premium", price: "€2,000 / yr", desc: "For medium salons with staff up to 10" },
  { name: "Enterprise", price: "€3,000 / yr", desc: "For salon chains & spa franchises" },
];
const REFERRAL_OPTIONS = ["10%", "15%", "20%", "30%"];

export default function InviteSalonBottomSheet({
  visible,
  onClose,
  onSuccess,
}: InviteSalonBottomSheetProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State matching web
  const [salonName, setSalonName] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [badge, setBadge] = useState("SRL");
  const [city, setCity] = useState("");

  // Step 2 State matching web
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 3 State matching web
  const [plan, setPlan] = useState<"Basic" | "Premium" | "Enterprise">("Premium");
  const [referralShare, setReferralShare] = useState("30%");
  const [hasConsent, setHasConsent] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

  const handleReset = () => {
    setStep(1);
    setSalonName("");
    setCommercialName("");
    setVatNumber("");
    setBadge("SRL");
    setCity("");
    setOwnerName("");
    setEmail("");
    setPhone("");
    setPlan("Premium");
    setReferralShare("30%");
    setHasConsent(false);
    setIsTermsExpanded(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleNext = () => {
    if (step === 1) {
      if (!salonName.trim()) {
        Alert.alert("Missing Field", "Please enter the company legal name.");
        return;
      }
      if (!city.trim()) {
        Alert.alert("Missing Field", "Please enter the salon city/location.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!ownerName.trim()) {
        Alert.alert("Missing Field", "Please enter the salon owner's full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        Alert.alert("Invalid Email", "Please enter a valid owner email address.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!hasConsent) {
        Alert.alert("Consent Required", "Please confirm that you have obtained consent from the salon owner to proceed.");
        return;
      }
      onSuccess({
        salonName: commercialName.trim() || salonName,
        email,
        plan,
        share: referralShare,
      });
      handleReset();
    }
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title={`Invite New Salon (Step ${step} of 3)`}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.stepIndicatorItem}>
              <View
                style={[
                  styles.stepCircle,
                  step >= s ? styles.stepCircleActive : styles.stepCircleInactive,
                ]}
              >
                <Text
                  style={[
                    styles.stepCircleText,
                    step >= s ? styles.stepCircleTextActive : styles.stepCircleTextInactive,
                  ]}
                >
                  {s}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step >= s ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}
              >
                {s === 1 ? "Salon Info" : s === 2 ? "Contacts" : "Plan & Consent"}
              </Text>
            </View>
          ))}
        </View>

        {/* STEP 1: Salon Information */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <CustomInput
              label="Company Legal Name *"
              value={salonName}
              onChangeText={setSalonName}
              placeholder="e.g. Glamour Beauty Roma S.R.L."
              iconName="business-outline"
            />

            <CustomInput
              label="Commercial / Insegna Name"
              value={commercialName}
              onChangeText={setCommercialName}
              placeholder="e.g. Glamour Beauty"
              iconName="storefront-outline"
            />

            <CustomInput
              label="VAT Number / Partita IVA"
              value={vatNumber}
              onChangeText={setVatNumber}
              placeholder="e.g. IT12345678901"
              iconName="receipt-outline"
            />

            <Text style={styles.inputLabel}>Legal Structure *</Text>
            <View style={styles.badgeWrapRow}>
              {BADGE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.badgeOption,
                    badge === opt && styles.badgeOptionActive,
                  ]}
                  onPress={() => setBadge(opt)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.badgeOptionText,
                      badge === opt && styles.badgeOptionTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}\n            </View>

            <CustomInput
              label="City / Location *"
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Roma"
              iconName="location-outline"
            />
          </View>
        )}

        {/* STEP 2: Owner Contacts */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <CustomInput
              label="Owner Full Name *"
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="e.g. Roberto Marini"
              iconName="person-outline"
            />
            <CustomInput
              label="Owner Email Address *"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. roberto@salon.com"
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail-outline"
            />
            <CustomInput
              label="Phone Number (Optional)"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. +39 06 1234567"
              keyboardType="phone-pad"
              iconName="call-outline"
            />
          </View>
        )}

        {/* STEP 3: Plan Preference & Referral & Consent */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.inputLabel}>Select Subscription Plan *</Text>
            <View style={styles.plansContainer}>
              {PLAN_OPTIONS.map((p) => {
                const isSelected = plan === p.name;
                return (
                  <TouchableOpacity
                    key={p.name}
                    style={[styles.planCard, isSelected && styles.planCardActive]}
                    onPress={() => setPlan(p.name as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.planHeader}>
                      <Text style={[styles.planTitle, isSelected && styles.planTitleActive]}>
                        {p.name}
                      </Text>
                      <Text style={[styles.planPrice, isSelected && styles.planPriceActive]}>
                        {p.price}
                      </Text>
                    </View>
                    <Text style={styles.planDesc}>{p.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              Accountant Referral Share % *
            </Text>
            <View style={styles.referralRow}>
              {REFERRAL_OPTIONS.map((rate) => {
                const isSelected = referralShare === rate;
                return (
                  <TouchableOpacity
                    key={rate}
                    style={[
                      styles.referralChip,
                      isSelected && styles.referralChipActive,
                    ]}
                    onPress={() => setReferralShare(rate)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.referralChipText,
                        isSelected && styles.referralChipTextActive,
                      ]}
                    >
                      {rate}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Terms Accordion */}
            <TouchableOpacity
              style={styles.termsAccordionBtn}
              onPress={() => setIsTermsExpanded(!isTermsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.termsAccordionTitle}>Delegation Regulations & Terms</Text>
              <Ionicons
                name={isTermsExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>

            {isTermsExpanded && (
              <View style={styles.termsBox}>
                <Text style={styles.termsText}>
                  By inviting this salon, you confirm that you are an authorized commercialista / accountant under Italian fiscal laws. You will receive read-write delegation to submit F24, consult cashier closures, and audit cedolini.
                </Text>
              </View>
            )}

            {/* GDPR Consent Checkbox */}
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => setHasConsent(!hasConsent)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, hasConsent && styles.checkboxActive]}>
                {hasConsent && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.consentText}>
                I certify that I have obtained legal authorization and consent from the salon owner to act as their delegated fiscal accountant.
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.bottomButtonsRow}>
          {step > 1 ? (
            <CustomButton
              title="Back"
              onPress={() => setStep((s) => (s - 1) as any)}
              variant="outline"
              style={styles.actionBtn}
            />
          ) : (
            <CustomButton
              title="Cancel"
              onPress={handleClose}
              variant="ghost"
              style={styles.actionBtn}
            />
          )}

          <CustomButton
            title={step === 3 ? "Send Invitation" : "Next Step"}
            onPress={handleNext}
            variant={step === 3 && !hasConsent ? "outline" : "primary"}
            style={styles.actionBtn}
            icon={
              step === 3 ? (
                <Ionicons name="send" size={16} color={hasConsent ? "#FFFFFF" : "#9CA3AF"} />
              ) : (
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              )
            }
            iconPosition="right"
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 520,
  },
  stepIndicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  stepIndicatorItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: "#635BFF",
  },
  stepCircleInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  stepCircleTextActive: {
    color: "#FFFFFF",
  },
  stepCircleTextInactive: {
    color: "#6B7280",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  stepLabelActive: {
    color: "#635BFF",
  },
  stepLabelInactive: {
    color: "#9CA3AF",
  },
  stepContent: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  badgeWrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  badgeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  badgeOptionActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  badgeOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  badgeOptionTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  plansContainer: {
    gap: 10,
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },
  planCardActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#635BFF",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  planTitleActive: {
    color: "#635BFF",
  },
  planPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  planPriceActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  planDesc: {
    fontSize: 11,
    color: "#6B7280",
  },
  referralRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  referralChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  referralChipActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  referralChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  referralChipTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  termsAccordionBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  termsAccordionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  termsBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#635BFF",
  },
  termsText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  consentText: {
    flex: 1,
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
  bottomButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 6,
  },
  actionBtn: {
    flex: 1,
  },
});
