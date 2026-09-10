import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";

import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Fonts } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAllLeaves,
  resetLeaveState,
  submitLeaveApplication,
} from "@/store/slices/leaveSlice";
import { api_url } from "@/components/common/ApiUrls";
import { StatusCode } from "@/constants/app_constants";
import { showInfoToast } from "@/components/common/Toast/ToastService";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value: string, fallback = new Date()) => {
  const [year, month, day] = value.split("-").map(Number);
  if (year && month && day) {
    return new Date(year, month - 1, day);
  }
  return fallback;
};

export default function LeaveFormScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  // Form Fields
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Defaults to "YYYY-MM-DD"
  });
  const [toDate, setToDate] = useState("");
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const { status, error, successMessage } = useAppSelector(
    (state) => state.leave,
  );

  useEffect(() => {
    if (status === StatusCode.SUCCEEDED && successMessage) {
      Alert.alert("Success", successMessage, [
        {
          text: "OK",
          onPress: () => {
            setReason("");
            setSelectedPhoto(null);
            dispatch(resetLeaveState());
            // await dispatch(
            //   fetchAllLeaves({
            //     endpoint: `${api_url}/leave`,
            //     token,
            //   }),
            // );
            router.back();
          },
        },
      ]);
    } else if (status === StatusCode.FAILED && error) {
      Alert.alert("Submission Failed", error, [
        { text: "Dismiss", onPress: () => dispatch(resetLeaveState()) },
      ]);

      //   console.log("sum-failed->", error)
    }
  }, [status, successMessage, error, dispatch, router]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access to upload documents.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Modern API (resolves the deprecation warning)
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const rawAsset = result.assets[0];

      // Compress and resize image
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        rawAsset.uri,
        [{ resize: { width: 1080 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.WEBP },
      );

      const filename =
        manipulatedResult.uri.split("/").pop() || "compressed_attachment.webp";

      setSelectedPhoto({
        uri: manipulatedResult.uri,
        name: filename,
        type: "image/webp", // Matches WEBP SaveFormat
      });
    }
  };

  const handleDateChange = (
    type: "from" | "to",
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    setShowFromDatePicker(false);
    setShowToDatePicker(false);

    if (event.type === "dismissed" || !date) return;

    const formattedDate = formatDate(date);
    if (type === "from") {
      setFromDate(formattedDate);
      if (toDate && parseDate(toDate) < date) setToDate(formattedDate);
    } else {
      setToDate(formattedDate);
    }
  };

  const handleSubmit = () => {
    if (!fromDate.trim()) {
      //   Alert.alert("Required", "Please enter start date (YYYY-MM-DD).");
      showInfoToast("Required", "Please enter start date (YYYY-MM-DD).");
      return;
    } else if (!toDate.trim()) {
      //   Alert.alert("Required", "Please enter end date (YYYY-MM-DD).");
      showInfoToast("Required", "Please enter end date (YYYY-MM-DD).");
      return;
    } else if (!reason.trim()) {
      //   Alert.alert(
      //     "Required",
      //     "Please provide a reason for the leave application.",
      //   );
      showInfoToast(
        "Required",
        "Please provide a reason for the leave application.",
      );
      return;
    }
    dispatch(
      submitLeaveApplication({
        endpoint: `${api_url}/leave`,
        token,
        formData: {
          from_date: fromDate.trim(),
          to_date: toDate.trim(),
          reason: reason.trim(),
          photo: selectedPhoto,
        },
      }),
    );
  };

  const isSubmitting = status === StatusCode.LOADING;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <View
                style={[
                  styles.headerBadge,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-account"
                  size={18}
                  color="#6366F1"
                />
                <Text style={[styles.headerBadgeText, { color: colors.text }]}>
                  Request Form
                </Text>
              </View>
            );
          },
        }}
      />
      {/* <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <View style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isTablet && styles.tabletScrollContent,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable
              onPress={Keyboard.dismiss}
              style={styles.keyboardPressableWrapper}
            >
              <View
                style={[
                  styles.innerWrapper,
                  isTablet && styles.tabletInnerWrapper,
                ]}
              >
                {/* Header */}
                {/* <View style={styles.header}>
                  <View>
                    <Text
                      style={[
                        styles.headerTitle,
                        { color: colors.text, fontSize: colors.font28 },
                      ]}
                    >
                      Apply for Leave
                    </Text>
                    <Text
                      style={[
                        styles.headerSubtitle,
                        { color: colors.subtext, fontSize: colors.font13 },
                      ]}
                    >
                      Submit your absence request for official review
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.headerBadge,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="calendar-account"
                      size={18}
                      color="#6366F1"
                    />
                    <Text style={[styles.headerBadgeText, { color: colors.text }]}>
                      Request Form
                    </Text>
                  </View>
                </View> */}

                {/* Form Card */}
                <View
                  style={[
                    styles.formCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                >
                  {/* Date Selection Inputs */}
                  <View
                    style={[styles.datesRow, isTablet && styles.tabletDatesRow]}
                  >
                    <View style={styles.dateCol}>
                      <Text
                        style={[
                          styles.fieldLabel,
                          { color: colors.text, fontSize: colors.font14 },
                        ]}
                      >
                        From Date (YYYY-MM-DD){" "}
                        <Text style={{ color: "#EF4444" }}>*</Text>
                      </Text>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F8FAFC",
                            borderColor: colors.borderL,
                          },
                        ]}
                      >
                        <Feather
                          name="calendar"
                          size={16}
                          color={colors.subtext}
                        />
                        {Platform.OS === "web" ? (
                          <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            value={fromDate}
                            onChangeText={setFromDate}
                          />
                        ) : (
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => setShowFromDatePicker(true)}
                            style={styles.datePickerButton}
                          >
                            <Text
                              style={[styles.textInput, { color: colors.text }]}
                            >
                              {fromDate}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                      {showFromDatePicker && Platform.OS !== "web" && (
                        <DateTimePicker
                          value={parseDate(fromDate)}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "compact" : "default"
                          }
                          onChange={(event, date) =>
                            handleDateChange("from", event, date)
                          }
                        />
                      )}
                    </View>

                    <View style={styles.dateCol}>
                      <Text
                        style={[
                          styles.fieldLabel,
                          { color: colors.text, fontSize: colors.font14 },
                        ]}
                      >
                        To Date (YYYY-MM-DD){" "}
                        <Text style={{ color: "#EF4444" }}>*</Text>
                      </Text>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F8FAFC",
                            borderColor: colors.borderL,
                          },
                        ]}
                      >
                        <Feather
                          name="calendar"
                          size={16}
                          color={colors.subtext}
                        />
                        {Platform.OS === "web" ? (
                          <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={colors.subtext}
                            value={toDate}
                            onChangeText={setToDate}
                          />
                        ) : (
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => setShowToDatePicker(true)}
                            style={styles.datePickerButton}
                          >
                            <Text
                              style={[
                                styles.textInput,
                                {
                                  color: toDate ? colors.text : colors.subtext,
                                },
                              ]}
                            >
                              {toDate || "Select to date"}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                      {showToDatePicker && Platform.OS !== "web" && (
                        <DateTimePicker
                          value={parseDate(toDate, parseDate(fromDate))}
                          minimumDate={parseDate(fromDate)}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "compact" : "default"
                          }
                          onChange={(event, date) =>
                            handleDateChange("to", event, date)
                          }
                        />
                      )}
                    </View>
                  </View>

                  {/* Reason Textarea */}
                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: colors.text, fontSize: colors.font14 },
                      ]}
                    >
                      Leave Reason <Text style={{ color: "#EF4444" }}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.textAreaInput,
                        {
                          backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                          borderColor: colors.borderL,
                          color: colors.text,
                        },
                      ]}
                      placeholder="Specify the reason for your absence..."
                      placeholderTextColor={colors.subtext}
                      value={reason}
                      onChangeText={setReason}
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  {/* Photo / Document Upload */}
                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: colors.text, fontSize: colors.font14 },
                      ]}
                    >
                      Medical / Supporting Document (Optional)
                    </Text>

                    {selectedPhoto ? (
                      <View
                        style={[
                          styles.previewCard,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F8FAFC",
                            borderColor: colors.borderL,
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: selectedPhoto.uri }}
                          style={styles.previewImage}
                        />
                        <View style={styles.previewMeta}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.previewFilename,
                              { color: colors.text, fontSize: colors.font14 },
                            ]}
                          >
                            {selectedPhoto.name}
                          </Text>
                          <Text
                            style={[
                              styles.previewSubtext,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            Ready to upload
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => setSelectedPhoto(null)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={22}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handlePickImage}
                        style={[
                          styles.uploadBox,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F8FAFC",
                            borderColor: colors.borderL,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="cloud-upload-outline"
                          size={32}
                          color={colors.tint}
                        />
                        <Text
                          style={[
                            styles.uploadTitle,
                            { color: colors.text, fontSize: colors.font14 },
                          ]}
                        >
                          Upload Attachment
                        </Text>
                        <Text
                          style={[
                            styles.uploadSubtitle,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          JPEG, PNG image from device gallery
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { opacity: isSubmitting ? 0.7 : 1 },
                    ]}
                    activeOpacity={0.85}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <LinearGradient
                      colors={["#6366F1", "#4F46E5"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.submitGradient}
                    >
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Feather name="send" size={16} color="#FFFFFF" />
                          <Text style={styles.submitButtonText}>
                            Submit Application
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tabletScrollContent: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 12,
  },
  keyboardPressableWrapper: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    flexGrow: 1,
    // justifyContent: "center",
  },
  innerWrapper: {
    width: "100%",
  },
  tabletInnerWrapper: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 0,
  },
  headerBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 0,
  },
  datesRow: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },
  tabletDatesRow: {
    flexDirection: "row",
    gap: 16,
  },
  dateCol: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 14,
    height: 48,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts?.regular || "System",
    fontSize: 14,
    paddingTop: 14,
  },
  datePickerButton: {
    flex: 1,
    justifyContent: "center",
  },
  textAreaInput: {
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 110,
    fontFamily: Fonts?.regular || "System",
    fontSize: 14,
  },
  uploadBox: {
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  uploadTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginTop: 4,
  },
  uploadSubtitle: {
    fontFamily: Fonts?.regular || "System",
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 0,
    padding: 12,
    gap: 12,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  previewMeta: {
    flex: 1,
  },
  previewFilename: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
  },
  previewSubtext: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  submitButton: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 8,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    fontSize: 16,
  },
});
