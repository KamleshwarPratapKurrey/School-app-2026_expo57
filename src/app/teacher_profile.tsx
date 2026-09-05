import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { fetchTeacherProfile } from "@/store/slices/teacherProfileSlice";

export default function TeacherProfileScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profile,
    status,
    error,
  } = useAppSelector((state) => state.teacherProfile);

  const loadData = async () => {
    await dispatch(
      fetchTeacherProfile({
        endpoint: `${api_url}/teacher/profile`,
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

  const handleCall = (phoneNumber: string) => {
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

  const personal = profile?.personal_details;
  const subjectsTaught = profile?.subjects_taught || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#06232d", "#08131d", colors.background]
            : ["#CFFAFE", "#F0FDFA", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      />

      {/* <SafeAreaView edges={["top"]} style={styles.safeArea}> */}
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
              tintColor="#06B6D4"
            />
          }
        >
          <View
            style={[styles.innerWrapper, isTablet && styles.tabletInnerWrapper]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font28 },
                  ]}
                >
                  Faculty Profile
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Personal data and teaching allocations
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
                  name="card-account-details-outline"
                  size={18}
                  color="#06B6D4"
                />
                <Text style={[styles.headerBadgeText, { color: colors.text }]}>
                  Staff Details
                </Text>
              </View>
            </View>

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#06B6D4" />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to load teacher profile."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : !personal ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-off-outline"
                  size={46}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No profile information available
                </Text>
              </View>
            ) : (
              <View
                style={[styles.mainLayout, isTablet && styles.tabletMainLayout]}
              >
                {/* Column 1: Personal Details Card */}
                <View
                  style={[
                    styles.leftColumn,
                    isTablet && styles.tabletLeftColumn,
                  ]}
                >
                  <View
                    style={[
                      styles.profileCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isDark ? ["#064e3b", "#0f766e"] : ["#CFFAFE", "#E0F2FE"]
                      }
                      style={styles.profileBanner}
                    >
                      <View style={styles.avatarWrap}>
                        <Text
                          style={[
                            styles.avatarText,
                            { color: isDark ? "#A7F3D0" : "#0891B2" },
                          ]}
                        >
                          {getInitials(personal.name)}
                        </Text>
                      </View>
                    </LinearGradient>

                    <View style={styles.profileBody}>
                      <Text
                        style={[
                          styles.profileName,
                          { color: colors.text, fontSize: colors.font22 },
                        ]}
                      >
                        {personal.name}
                      </Text>
                      <Text
                        style={[
                          styles.profileDept,
                          { color: colors.subtext, fontSize: colors.font14 },
                        ]}
                      >
                        Department of {personal.department}
                      </Text>

                      <View style={styles.badgesRow}>
                        <View
                          style={[
                            styles.infoBadge,
                            {
                              backgroundColor: isDark
                                ? "rgba(6, 182, 212, 0.15)"
                                : "#ECFEFF",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="briefcase-outline"
                            size={14}
                            color="#06B6D4"
                          />
                          <Text
                            style={[styles.infoBadgeText, { color: "#06B6D4" }]}
                          >
                            {personal.staff_type} Staff
                          </Text>
                        </View>
                      </View>

                      {/* Phone Contact Button */}
                      <TouchableOpacity
                        style={[
                          styles.callButton,
                          { backgroundColor: "#06B6D4" },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleCall(personal.phone)}
                      >
                        <Feather name="phone-call" size={16} color="#FFFFFF" />
                        <Text style={styles.callButtonText}>
                          Call {personal.phone}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Column 2: Subjects Taught List */}
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
                    Subjects & Classes Taught
                  </Text>

                  <View style={styles.subjectsStack}>
                    {subjectsTaught.map((item, index) => (
                      <View
                        key={`${item.subject}-${item.class_id}-${index}`}
                        style={[
                          styles.subjectCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.borderL,
                            shadowColor: colors.shadowClr,
                          },
                        ]}
                      >
                        <View style={styles.subjectLeftGroup}>
                          <View
                            style={[
                              styles.subjectIconBox,
                              {
                                backgroundColor: isDark
                                  ? "rgba(6, 182, 212, 0.15)"
                                  : "#ECFEFF",
                              },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="book-education-outline"
                              size={22}
                              color="#06B6D4"
                            />
                          </View>

                          <View style={styles.subjectInfo}>
                            <Text
                              style={[
                                styles.subjectName,
                                { color: colors.text, fontSize: colors.font16 },
                              ]}
                            >
                              {item.subject}
                            </Text>
                            <Text
                              style={[
                                styles.subjectClassId,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              Class ID: #{item.class_id}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.subTypeChip,
                            {
                              backgroundColor: isDark
                                ? colors.borderL
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.subTypeText,
                              { color: colors.subtext },
                            ]}
                          >
                            {item.sub_type}
                          </Text>
                        </View>
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
    flex: 1.3,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 0,
  },
  profileBanner: {
    height: 90,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -34,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
    fontSize: 20,
  },
  profileBody: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 24,
  },
  profileName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  profileDept: {
    fontFamily: Fonts?.regular || "System",
    textAlign: "center",
    marginBottom: 14,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  infoBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    width: "100%",
  },
  callButtonText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    fontSize: 14,
  },
  subjectsStack: {
    gap: 12,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0,
  },
  subjectLeftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 2,
  },
  subjectClassId: {
    fontFamily: Fonts?.regular || "System",
  },
  subTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subTypeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Fonts?.semibold || "System",
    textTransform: "capitalize",
  },
});
