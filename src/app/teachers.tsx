import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
import { fetchTeachers } from "@/store/slices/teacherSlice";
import { Stack } from "expo-router";

export default function TeachersScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: teachersData,
    status,
    error,
  } = useAppSelector((state) => state.teachers);

  const loadData = async () => {
    await dispatch(
      fetchTeachers({
        endpoint: `${api_url}/teachers`,
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

  const handleCall = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const classTeacher = teachersData?.class_teacher;
  const subjectTeachers = teachersData?.subject_teachers || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.3, 0.7]}
        style={StyleSheet.absoluteFill}
      />

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
                  name="account-group-outline"
                  size={18}
                  color={colors.tint}
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {subjectTeachers.length + (classTeacher ? 1 : 0)} Total
                </Text>
              </View>
            );
          },
        }}
      />
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            { paddingTop: 20 },
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
                  Faculty & Staff
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Assigned class and subject educators
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
                  name="account-group-outline"
                  size={18}
                  color={colors.tint}
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {subjectTeachers.length + (classTeacher ? 1 : 0)} Total
                </Text>
              </View>
            </View> */}

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to retrieve faculty directory."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[styles.mainLayout, isTablet && styles.tabletMainLayout]}
              >
                {/* Left Column (Tablet) / Top Section (Mobile): Class Teacher */}
                <View
                  style={[
                    styles.leftColumn,
                    isTablet && styles.tabletLeftColumn,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: colors.subtext, fontSize: colors.font13 },
                    ]}
                  >
                    Class Mentor
                  </Text>

                  {classTeacher ? (
                    <View
                      style={[
                        styles.classTeacherCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#312E81", "#1E1B4B"]
                            : ["#EEF2FF", "#E0E7FF"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardHeaderBanner}
                      >
                        <MaterialCommunityIcons
                          name="star-box-outline"
                          size={24}
                          color={colors.tint}
                        />
                        <Text
                          style={[styles.bannerTag, { color: colors.tint }]}
                        >
                          Head of Class
                        </Text>
                      </LinearGradient>

                      <View
                        style={[
                          styles.classTeacherBody,
                          { padding: colors.pad },
                        ]}
                      >
                        <View style={styles.avatarWrap}>
                          <LinearGradient
                            colors={["#6366F1", "#A855F7"]}
                            style={styles.avatarRing}
                          >
                            <View
                              style={[
                                styles.avatarPlaceholder,
                                {
                                  backgroundColor: isDark
                                    ? "#1C1C1E"
                                    : "#FFFFFF",
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.avatarText,
                                  {
                                    color: colors.tint,
                                    fontSize: colors.font24,
                                  },
                                ]}
                              >
                                {getInitials(classTeacher.name)}
                              </Text>
                            </View>
                          </LinearGradient>
                        </View>

                        <Text
                          style={[
                            styles.teacherName,
                            { color: colors.text, fontSize: colors.font20 },
                          ]}
                        >
                          {classTeacher.name}
                        </Text>
                        <Text
                          style={[
                            styles.teacherRole,
                            { color: colors.subtext, fontSize: colors.font13 },
                          ]}
                        >
                          Class Teacher
                        </Text>

                        {classTeacher.phone ? (
                          <TouchableOpacity
                            style={[
                              styles.callActionButton,
                              { backgroundColor: colors.tint },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleCall(classTeacher.phone)}
                          >
                            <Feather
                              name="phone-call"
                              size={16}
                              color="#FFFFFF"
                            />
                            <Text style={styles.callActionText}>
                              Call {classTeacher.phone}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.noPhoneBadge,
                              {
                                backgroundColor: isDark
                                  ? colors.borderL
                                  : "#F1F5F9",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.noPhoneText,
                                { color: colors.subtext },
                              ]}
                            >
                              Phone not available
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.emptyCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                        },
                      ]}
                    >
                      <Text style={{ color: colors.subtext }}>
                        No Class Teacher Assigned
                      </Text>
                    </View>
                  )}
                </View>

                {/* Right Column (Tablet) / Bottom Section (Mobile): Subject Teachers */}
                <View
                  style={[
                    styles.rightColumn,
                    isTablet && styles.tabletRightColumn,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: colors.subtext, fontSize: colors.font13 },
                    ]}
                  >
                    Subject Educators
                  </Text>

                  <View style={styles.subjectList}>
                    {subjectTeachers.map((teacher, index) => (
                      <View
                        key={`${teacher.name}-${teacher.subject}-${index}`}
                        style={[
                          styles.subjectCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.borderL,
                            shadowColor: colors.shadowClr,
                          },
                        ]}
                      >
                        <View style={styles.cardLeftGroup}>
                          <View
                            style={[
                              styles.initialsSquare,
                              {
                                backgroundColor: isDark
                                  ? "rgba(99, 102, 241, 0.15)"
                                  : "#EEF2FF",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.initialsText,
                                { color: colors.tint },
                              ]}
                            >
                              {getInitials(teacher.name)}
                            </Text>
                          </View>

                          <View style={styles.teacherDetails}>
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.teacherCardTitle,
                                { color: colors.text, fontSize: colors.font16 },
                              ]}
                            >
                              {teacher.name}
                            </Text>
                            <View style={styles.subjectRow}>
                              <MaterialCommunityIcons
                                name="book-open-page-variant-outline"
                                size={14}
                                color={colors.subtext}
                              />
                              <Text
                                style={[
                                  styles.teacherCardSubject,
                                  {
                                    color: colors.subtext,
                                    fontSize: colors.font13,
                                  },
                                ]}
                              >
                                {teacher.subject}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Call Action Icon Button */}
                        {teacher.phone ? (
                          <TouchableOpacity
                            style={[
                              styles.smallCallBtn,
                              {
                                backgroundColor: isDark
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : "#DCFCE7",
                              },
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleCall(teacher.phone)}
                          >
                            <Ionicons name="call" size={17} color="#10B981" />
                          </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.smallCallDisabled,
                              {
                                backgroundColor: isDark
                                  ? colors.borderL
                                  : "#F1F5F9",
                              },
                            ]}
                          >
                            <Ionicons
                              name="call-outline"
                              size={16}
                              color={colors.subtext}
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
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
    // elevation: 0,
  },
  countBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
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
  sectionLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  mainLayout: {
    flexDirection: "column",
    gap: 20,
  },
  tabletMainLayout: {
    flexDirection: "row",
    gap: 28,
    alignItems: "flex-start",
  },
  leftColumn: {
    width: "100%",
  },
  tabletLeftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: "100%",
  },
  tabletRightColumn: {
    flex: 1.4,
  },
  classTeacherCard: {
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    // elevation: 0,
  },
  cardHeaderBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  bannerTag: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "uppercase",
  },
  classTeacherBody: {
    alignItems: "center",
  },
  avatarWrap: {
    marginBottom: 14,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
  },
  teacherName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  teacherRole: {
    fontFamily: Fonts?.regular || "System",
    marginBottom: 16,
  },
  callActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    width: "100%",
    justifyContent: "center",
  },
  callActionText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    fontSize: 14,
  },
  noPhoneBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  noPhoneText: {
    fontFamily: Fonts?.regular || "System",
    fontSize: 12,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 0,
  },
  cardLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  initialsSquare: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    fontSize: 16,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherCardTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginBottom: 3,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  teacherCardSubject: {
    fontFamily: Fonts?.regular || "System",
  },
  smallCallBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCallDisabled: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
});
