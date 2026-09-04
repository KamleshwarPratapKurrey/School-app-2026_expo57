import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
import DropDownPicker from "react-native-dropdown-picker";

import { api_url } from "@/components/common/ApiUrls";
import { showInfoToast } from "@/components/common/Toast/ToastService";
import { StatusCode } from "@/constants/app_constants";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    resetComplaintState,
    submitComplaint,
} from "@/store/slices/comlaintSlice";
import { fetchTeacherStudents } from "@/store/slices/teacherStudentsSlice";
import { Stack } from "expo-router";

export default function ComplaintsScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  // Dropdown States
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaintDate, setComplaintDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Defaults to "YYYY-MM-DD"
  });

  // Redux Selectors
  const { data: studentGroups, status: studentStatus } = useAppSelector(
    (state) => state.teacherStudents,
  );
  const {
    status: submitStatus,
    error: submitError,
    successMessage,
  } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(
      fetchTeacherStudents({
        endpoint: `${api_url}/teacher/students`,
        token,
      }),
    );
  }, [dispatch, token]);

  useEffect(() => {
    if (submitStatus === StatusCode.SUCCEEDED && successMessage) {
      Alert.alert("Success", successMessage, [
        {
          text: "OK",
          onPress: () => {
            setSelectedStudentId(null);
            setTitle("");
            setDescription("");
            dispatch(resetComplaintState());
          },
        },
      ]);
    } else if (submitStatus === StatusCode.FAILED && submitError) {
      Alert.alert("Submission Failed", submitError, [
        { text: "Dismiss", onPress: () => dispatch(resetComplaintState()) },
      ]);
    }
  }, [submitStatus, successMessage, submitError, dispatch]);

  // Flatten students from all groups into dropdown items
  const studentItems = useMemo(() => {
    const list: { label: string; value: number }[] = [];
    studentGroups.forEach((group) => {
      group.students.forEach((student) => {
        list.push({
          label: `${student.name} (Adm: #${student.admission_number}${
            student.roll_no ? ` | Roll: ${student.roll_no}` : ""
          })`,
          value: student.admission_number,
        });
      });
    });
    return list;
  }, [studentGroups]);

  const handleSubmit = () => {
    if (!selectedStudentId) {
      //   Alert.alert("Required", "Please select a student from the list.");
      showInfoToast("Required", "Please select a student from the list.");
      return;
    } else if (!title.trim()) {
      //   Alert.alert("Required", "Please enter a complaint title.");
      showInfoToast("Required", "Please enter a complaint title.");
      return;
    } else if (!description.trim()) {
      //   Alert.alert("Required", "Please enter the complaint description.");
      showInfoToast("Required", "Please enter the complaint description.");
      return;
    }

    dispatch(
      submitComplaint({
        endpoint: `${api_url}/complaints`,
        token,
        formData: {
          student_id: selectedStudentId,
          title: title.trim(),
          description: description.trim(),
          complaint_date: complaintDate,
        },
      }),
    );
  };

  const isSubmitting = submitStatus === StatusCode.LOADING;

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
                  name="alert-octagon-outline"
                  size={18}
                  color="#EF4444"
                />
                <Text style={[styles.headerBadgeText, { color: colors.text }]}>
                  Faculty Notice
                </Text>
              </View>
            );
          },
        }}
      />
      {/* <LinearGradient
        colors={
          isDark
            ? ["#06232d", "#08131d", colors.background]
            : ["#CFFAFE", "#F0FDFA", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Adjust for header height if needed
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
                    Register Complaint
                  </Text>
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: colors.subtext, fontSize: colors.font13 },
                    ]}
                  >
                    File an official disciplinary or academic notice
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
                    name="alert-octagon-outline"
                    size={18}
                    color="#EF4444"
                  />
                  <Text style={[styles.headerBadgeText, { color: colors.text }]}>
                    Faculty Notice
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
                {/* Student Dropdown */}
                <View
                  style={[styles.fieldGroup, { zIndex: 3000, elevation: 3000 }]}
                >
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    Target Student <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>

                  {studentStatus === StatusCode.LOADING ? (
                    <ActivityIndicator
                      size="small"
                      color="#06B6D4"
                      style={{ alignSelf: "flex-start", marginVertical: 8 }}
                    />
                  ) : (
                    <DropDownPicker
                      open={openDropdown}
                      value={selectedStudentId}
                      items={studentItems}
                      setOpen={setOpenDropdown}
                      setValue={setSelectedStudentId}
                      placeholder="Select an enrolled student..."
                      searchable={true}
                      searchPlaceholder="Search student name or admission..."
                      style={[
                        styles.dropdownStyle,
                        {
                          backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                          borderColor: colors.borderL,
                        },
                      ]}
                      textStyle={{
                        color: colors.text,
                        fontFamily: Fonts?.regular || "System",
                        fontSize: 14,
                      }}
                      dropDownContainerStyle={[
                        styles.dropdownContainerStyle,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                        },
                      ]}
                      searchTextInputStyle={{
                        color: colors.text,
                        borderColor: colors.borderL,
                      }}
                      listMode="SCROLLVIEW"
                    />
                  )}
                </View>

                {/* Complaint Title */}
                <View style={[styles.fieldGroup, { zIndex: 1, elevation: 1 }]}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    Complaint Title <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                        borderColor: colors.borderL,
                        color: colors.text,
                      },
                    ]}
                    placeholder="e.g. Missing Books"
                    placeholderTextColor={colors.subtext}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Complaint Date */}
                <View style={[styles.fieldGroup, { zIndex: 1, elevation: 1 }]}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    Complaint Date (YYYY-MM-DD){" "}
                    <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                        borderColor: colors.borderL,
                        color: colors.text,
                      },
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.subtext}
                    value={complaintDate}
                    onChangeText={setComplaintDate}
                  />
                </View>

                {/* Description */}
                <View style={[styles.fieldGroup, { zIndex: 1, elevation: 1 }]}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    Incident Description{" "}
                    <Text style={{ color: "#EF4444" }}>*</Text>
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
                    placeholder="Write detailed notes regarding the student's behavior or issue..."
                    placeholderTextColor={colors.subtext}
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Action Submit Button */}
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
                    colors={["#EF4444", "#DC2626"]}
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
                          Submit Complaint
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  keyboardPressableWrapper: {
    width: "100%",
    maxWidth: 640,
    marginHorizontal: "auto",
    justifyContent: "center",
  },
  tabletScrollContent: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 12,
  },
  innerWrapper: {
    width: "100%",
  },
  tabletInnerWrapper: {
    maxWidth: 720,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginBottom: 10,
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
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdownStyle: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  dropdownContainerStyle: {
    borderRadius: 14,
    borderWidth: 1,
    maxHeight: 220,
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: Fonts?.regular || "System",
    fontSize: 14,
  },
  textAreaInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 110,
    fontFamily: Fonts?.regular || "System",
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
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
