import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { api_url } from "@/components/common/ApiUrls";
import { StatusCode } from "@/constants/app_constants";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTeacherStudents } from "@/store/slices/teacherStudentsSlice";
import { StudentItem } from "@/types/student";
import { Stack } from "expo-router";

export default function StudentsScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const {
    data: groups,
    status,
    error,
  } = useAppSelector((state) => state.teacherStudents);

  const loadData = async () => {
    await dispatch(
      fetchTeacherStudents({
        endpoint: `${api_url}/teacher/students`,
        token,
      }),
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentGroup = groups[selectedGroupIndex] ?? null;
  const rawStudents = currentGroup?.students ?? [];

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return rawStudents;
    const q = searchQuery.toLowerCase();
    return rawStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admission_number.toString().includes(q) ||
        (s.roll_no && s.roll_no.toLowerCase().includes(q)),
    );
  }, [rawStudents, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-multiple-outline"
                  size={18}
                  color="#06B6D4"
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {rawStudents.length} Students
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
        locations={[0, 0.3, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.tabletScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          <View
            style={[styles.innerWrapper, isTablet && styles.tabletInnerWrapper]}
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
                  Class Roster
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Enrolled students & records
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-multiple-outline"
                  size={18}
                  color="#06B6D4"
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {rawStudents.length} Students
                </Text>
              </View>
            </View> */}

            {/* Search Input */}
            <View
              style={[
                styles.searchBarWrapper,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.borderL,
                  shadowColor: colors.shadowClr,
                },
              ]}
            >
              <Feather name="search" size={18} color={colors.subtext} />
              <TextInput
                placeholder="Search by name, roll no, or admission..."
                placeholderTextColor={colors.subtext}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                  styles.searchInput,
                  { color: colors.text, fontSize: colors.font14 },
                ]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.subtext}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Class Switcher Tabs if multiple classes exist */}
            {groups.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.classTabsContainer}
              >
                {groups.map((grp, index) => {
                  const isSelected = index === selectedGroupIndex;
                  return (
                    <TouchableOpacity
                      key={`${grp.class_id}-${index}`}
                      onPress={() => setSelectedGroupIndex(index)}
                      activeOpacity={0.8}
                      style={[
                        styles.classPill,
                        {
                          backgroundColor: isSelected ? "#06B6D4" : colors.card,
                          borderColor: isSelected ? "#06B6D4" : colors.borderL,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.classPillText,
                          {
                            color: isSelected ? "#FFFFFF" : colors.text,
                            fontFamily: isSelected
                              ? Fonts?.semibold || "System"
                              : Fonts?.regular || "System",
                          },
                        ]}
                      >
                        Class ID: {grp.class_id}
                        {grp.section_id ? ` (Sec: ${grp.section_id})` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Content Status Handling */}
            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#06B6D4" />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to retrieve student directory."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredStudents.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-search-outline"
                  size={46}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  {searchQuery
                    ? "No matching students found"
                    : "No students enrolled in this group"}
                </Text>
              </View>
            ) : (
              /* Students Adaptive Grid */
              <View
                style={[
                  styles.studentGrid,
                  isTablet && styles.tabletStudentGrid,
                ]}
              >
                {filteredStudents.map((student: StudentItem) => (
                  <View
                    key={student.admission_number}
                    style={[
                      styles.studentCard,
                      isTablet && styles.tabletStudentCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    <View style={styles.cardMain}>
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#064e3b", "#0f766e"]
                            : ["#CFFAFE", "#E0F2FE"]
                        }
                        style={styles.avatarWrap}
                      >
                        <Text
                          style={[
                            styles.avatarText,
                            { color: isDark ? "#A7F3D0" : "#0891B2" },
                          ]}
                        >
                          {getInitials(student.name)}
                        </Text>
                      </LinearGradient>

                      <View style={styles.studentInfo}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.studentName,
                            { color: colors.text, fontSize: colors.font16 },
                          ]}
                        >
                          {student.name}
                        </Text>

                        <View style={styles.chipRow}>
                          <View
                            style={[
                              styles.rollChip,
                              {
                                backgroundColor: isDark
                                  ? colors.borderL
                                  : "#F1F5F9",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                { color: colors.subtext },
                              ]}
                            >
                              Roll: {student.roll_no || "N/A"}
                            </Text>
                          </View>

                          {student.gender && (
                            <View
                              style={[
                                styles.genderChip,
                                {
                                  backgroundColor:
                                    student.gender.toLowerCase() === "male"
                                      ? isDark
                                        ? "rgba(59, 130, 246, 0.15)"
                                        : "#EFF6FF"
                                      : isDark
                                        ? "rgba(236, 72, 153, 0.15)"
                                        : "#FDF2F8",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.chipText,
                                  {
                                    color:
                                      student.gender.toLowerCase() === "male"
                                        ? "#3B82F6"
                                        : "#EC4899",
                                  },
                                ]}
                              >
                                {student.gender}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: colors.borderL },
                      ]}
                    >
                      <Text
                        style={[
                          styles.admissionText,
                          { color: colors.subtext, fontSize: colors.font12 },
                        ]}
                      >
                        Adm No: #{student.admission_number}
                      </Text>
                      {/* <Feather
                        name="chevron-right"
                        size={16}
                        color={colors.icon}
                      /> */}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
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
    maxWidth: 1040,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginBottom: 4,
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
  countBadge: {
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
  countBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 0,
  },
  searchInput: {
    flex: 1,
    padding: 0,
  },
  classTabsContainer: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 12,
  },
  classPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 0,
  },
  classPillText: {
    fontSize: 13,
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyCard: {
    padding: 36,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  emptyText: {
    fontFamily: Fonts?.regular || "System",
    textAlign: "center",
  },
  studentGrid: {
    flexDirection: "column",
    gap: 12,
  },
  tabletStudentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  studentCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0,
  },
  tabletStudentCard: {
    width: "48.8%",
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    fontSize: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rollChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genderChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  admissionText: {
    fontFamily: Fonts?.regular || "System",
  },
});
