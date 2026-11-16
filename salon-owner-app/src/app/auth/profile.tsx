import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "@/components/ui/CustomInput";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { useDispatch } from "react-redux";
import { setAuthState } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BUSINESS_TYPES = ["Salon", "Barbershop", "Clinic/Medical", "Spa/Wellness", "Other"];

const GOALS = [
  "Manage team & shifts",
  "Automate reminders",
  "Online bookings",
  "Inventory management",
  "Financial reports",
  "Grow revenue",
];

const CITIES = ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Florence"];
const POSTCODES = ["00100", "20100", "80100", "10100", "90100", "16100", "50100"];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1); // Steps 1 to 4

  // Step 1: Personal Information
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("Darlene Robertson");
  const [email, setEmail] = useState("wildzr18@gmail.com");
  const [phone, setPhone] = useState("0931567890");

  // Step 2: Contact & Business Information
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [certifiedEmail, setCertifiedEmail] = useState("");
  const [vatId, setVatId] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showPostcodePicker, setShowPostcodePicker] = useState(false);

  // Step 3: Business Type
  const [selectedBusinessType, setSelectedBusinessType] = useState("");

  // Step 4: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      dispatch(setAuthState({ isAuthenticated: true }));
      router.replace("/subscription" as any);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressHeader}>Profile Setup</Text>
        <View style={styles.progressBarRow}>
          {[1, 2, 3, 4].map((i) => {
            const isActive = i <= step;
            return (
              <View
                key={i}
                style={[
                  styles.progressBarSegment,
                  isActive ? styles.progressBarSegmentActive : styles.progressBarSegmentInactive,
                ]}
              />
            );
          })}
        </View>
        <Text style={styles.stepIndicatorText}>Step {step} of 4</Text>
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepWrapper}>
            <Text style={styles.stepTitle}>Your Profile Photo</Text>
            <Text style={styles.stepSubtitle}>
              Upload a professional photo to help others recognize you.
            </Text>

            {/* Photo Upload Circle */}
            <View style={styles.uploadCircleContainer}>
              <TouchableOpacity style={styles.uploadCircle} activeOpacity={0.8}>
                <Ionicons name="camera-outline" size={28} color="#9CA3AF" />
                <View style={styles.editBadge}>
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Personal Information Form */}
            <Text style={styles.sectionHeader}>Personal Information</Text>

            <CustomInput
              label="Full Name"
              placeholder="Full Name"
              iconName="person-outline"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              label="Email Address"
              placeholder="Email Address"
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={false}
              style={styles.disabledInput}
            />

            <View style={styles.phoneFieldContainer}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.flagBadge}>
                  <Text style={styles.flagEmoji}>🇮🇹</Text>
                  <Text style={styles.countryCode}>+39</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0931 567 890"
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepWrapper}>
            <Text style={styles.stepTitle}>Your Business Logo</Text>
            <Text style={styles.stepSubtitle}>
              Upload your business logo to help others recognize you.
            </Text>

            {/* Logo Upload Circle */}
            <View style={styles.uploadCircleContainer}>
              <TouchableOpacity style={styles.uploadCircle} activeOpacity={0.8}>
                <Ionicons name="image-outline" size={28} color="#9CA3AF" />
                <View style={styles.editBadge}>
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Contact & Business Info Form */}
            <Text style={styles.sectionHeader}>Contact & Business Information</Text>

            <CustomInput
              label="Legal business name"
              placeholder="Enter legal business name"
              iconName="business-outline"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <CustomInput
              label="Certified Email (PEC)"
              placeholder="Company@pec.it"
              iconName="mail-outline"
              value={certifiedEmail}
              onChangeText={setCertifiedEmail}
              keyboardType="email-address"
            />

            <CustomInput
              label="VAT ID *"
              placeholder="e.g. 1234567890"
              iconName="card-outline"
              value={vatId}
              onChangeText={setVatId}
              keyboardType="numeric"
            />

            <CustomInput
              label="Address Line 1"
              placeholder="Office Address"
              iconName="location-outline"
              value={address1}
              onChangeText={setAddress1}
            />

            <CustomInput
              label="Address Line 2"
              placeholder="Office Address"
              iconName="location-outline"
              value={address2}
              onChangeText={setAddress2}
            />

            <View style={styles.dropdownRow}>
              {/* City */}
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>City Name</Text>
                <TouchableOpacity
                  style={styles.halfDropdown}
                  onPress={() => setShowCityPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownValueText, !city && styles.placeholderText]}>
                    {city || "Select city"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Post Code */}
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Post Code</Text>
                <TouchableOpacity
                  style={styles.halfDropdown}
                  onPress={() => setShowPostcodePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownValueText, !postcode && styles.placeholderText]}>
                    {postcode || "Select code"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepWrapper}>
            <Text style={styles.stepTitle}>What best describes Your Business?</Text>
            <Text style={styles.stepSubtitle}>
              This helps us tailor the experience to your business needs.
            </Text>

            <Text style={styles.sectionHeader}>Select one option to continue</Text>

            <View style={styles.businessOptionsContainer}>
              {BUSINESS_TYPES.map((type) => {
                const isSelected = selectedBusinessType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedBusinessType(type)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepWrapper}>
            <Text style={styles.stepTitle}>What are you looking to achieve first?</Text>
            <Text style={styles.stepSubtitle}>
              Choose the goals that are most important to you right now.
            </Text>

            <Text style={styles.sectionHeader}>Select all that apply</Text>

            <View style={styles.goalsContainer}>
              {GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                    onPress={() => toggleGoal(goal)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ paddingTop: Math.max(insets.top, 12) }}>
        {renderProgressBar()}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Footer Navigation Buttons */}
      <View style={[styles.footerContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (step === 3 && !selectedBusinessType) || (step === 4 && selectedGoals.length === 0)
              ? styles.continueButtonDisabled
              : null,
          ]}
          onPress={handleNext}
          disabled={(step === 3 && !selectedBusinessType) || (step === 4 && selectedGoals.length === 0)}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>
            {step === 4 ? "Complete" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* City Picker Bottom Sheet */}
      <CustomBottomSheet
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        title="Select City"
      >
        <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
          {CITIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.pickerItem}
              onPress={() => {
                setCity(c);
                setShowCityPicker(false);
              }}
            >
              <Text style={styles.pickerItemText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomBottomSheet>

      {/* Postcode Picker Bottom Sheet */}
      <CustomBottomSheet
        visible={showPostcodePicker}
        onClose={() => setShowPostcodePicker(false)}
        title="Select Post Code"
      >
        <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
          {POSTCODES.map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.pickerItem}
              onPress={() => {
                setPostcode(p);
                setShowPostcodePicker(false);
              }}
            >
              <Text style={styles.pickerItemText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </CustomBottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  progressHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
    alignSelf: "center",
    marginBottom: 12,
    fontFamily: "System",
  },
  progressBarRow: {
    flexDirection: "row",
    height: 4,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressBarSegment: {
    flex: 1,
    height: "100%",
    borderRadius: 2,
    marginHorizontal: 2,
  },
  progressBarSegmentActive: {
    backgroundColor: "#635BFF",
  },
  progressBarSegmentInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepIndicatorText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    alignSelf: "center",
    fontFamily: "System",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stepWrapper: {
    width: "100%",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
    fontFamily: "System",
  },
  stepSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
    fontFamily: "System",
  },
  uploadCircleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  uploadCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
    marginBottom: 16,
    fontFamily: "System",
  },
  disabledInput: {
    backgroundColor: "#F9FAFB",
    color: "#9CA3AF",
  },
  phoneFieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    fontFamily: "System",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    height: 48,
    backgroundColor: "#FFFFFF",
  },
  flagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    height: "100%",
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "System",
  },
  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    color: "#1F2937",
    fontSize: 14,
    fontFamily: "System",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfField: {
    width: "48%",
    marginBottom: 16,
  },
  halfDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  dropdownValueText: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "System",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  businessOptionsContainer: {
    width: "100%",
  },
  optionCard: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  optionCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEECFF",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    fontFamily: "System",
  },
  optionTextSelected: {
    color: "#635BFF",
    fontWeight: "600",
  },
  goalsContainer: {
    width: "100%",
  },
  goalCard: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  goalCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEECFF",
  },
  goalText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    fontFamily: "System",
  },
  goalTextSelected: {
    color: "#635BFF",
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: "48%",
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#635BFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "System",
  },
  continueButton: {
    width: "48%",
    height: 48,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "System",
  },
  pickerScroll: {
    maxHeight: 250,
  },
  pickerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerItemText: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "System",
  },
});
