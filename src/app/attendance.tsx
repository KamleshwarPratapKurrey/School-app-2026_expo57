import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { StatusCode } from "@/constants/app_constants";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAttendance } from "@/store/slices/attendanceSlice";
import { Stack } from "expo-router";

export default function AttendanceScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const { summary, records, status, error } = useAppSelector(
    (state) => state.attendance,
  );

  const loadData = async () => {
    await dispatch(
      fetchAttendance({
        endpoint: "http://192.168.1.17:7000/api/attendance",
        token,
      }),
    );
  };

  useEffect(() => {
    if (records.length === 0) {
      loadData();
    }
  }, [dispatch, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const overallPercent = summary?.overall_percentage ?? 0;
  const totalPresent = summary?.total_present ?? 0;
  const totalAbsent = summary?.total_absent ?? 0;
  const totalDays = summary?.total_working_days ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                  styles.filterBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.tint}
                />
                <Text
                  style={[
                    styles.filterText,
                    { color: colors.text, fontSize: colors.font13 },
                  ]}
                >
                  2026 Academic
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
            {/* Top App Bar */}
            {/* <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font28 },
                  ]}
                >
                  Attendance
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Session Academic Log
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.tint}
                />
                <Text
                  style={[
                    styles.filterText,
                    { color: colors.text, fontSize: colors.font13 },
                  ]}
                >
                  2026 Academic
                </Text>
              </TouchableOpacity>
            </View> */}

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to load attendance."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Responsive Split Grid */
              <View
                style={[styles.mainLayout, isTablet && styles.tabletMainLayout]}
              >
                {/* Left Column (Tablet) / Top Overview (Mobile) */}
                <View
                  style={[
                    styles.leftColumn,
                    isTablet && styles.tabletLeftColumn,
                  ]}
                >
                  {/* Overall Percentage Card */}
                  <View
                    style={[
                      styles.heroCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    <View style={styles.circularMetricWrap}>
                      <View
                        style={[
                          styles.outerRing,
                          {
                            borderColor: isDark ? colors.borderL : "#EEF2FF",
                            backgroundColor: isDark
                              ? "rgba(99, 102, 241, 0.08)"
                              : "#F5F7FF",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.percentageValue,
                            { color: colors.text, fontSize: colors.font42 },
                          ]}
                        >
                          {overallPercent}%
                        </Text>
                        <Text
                          style={[
                            styles.percentageLabel,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          Overall Attendance
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar Display */}
                    <View
                      style={[
                        styles.progressTrack,
                        {
                          backgroundColor: isDark ? colors.borderL : "#E2E8F0",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor:
                              overallPercent >= 75 ? "#a2e6cf" : "#eaaaaa",
                            width: `${Math.min(overallPercent, 100)}%`,
                          },
                        ]}
                      />
                    </View>

                    {/* Present vs Absent KPI Cards */}
                    <View style={styles.statsRow}>
                      <View
                        style={[
                          styles.kpiBox,
                          //   {
                          //     backgroundColor: isDark
                          //       ? "rgba(16, 185, 129, 0.12)"
                          //       : "#ECFDF5",
                          //     borderColor: "rgba(16, 185, 129, 0.2)",
                          //   },
                          {
                            backgroundColor: colors.background,
                            borderColor: "rgba(16, 185, 129, 0.2)",
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="check-circle-outline"
                          size={22}
                          color="#10B981"
                        />
                        <Text
                          style={[
                            styles.kpiNumber,
                            // { color: "#10B981", fontSize: colors.font20 },
                            { color: colors.text, fontSize: colors.font20 },
                          ]}
                        >
                          {totalPresent}
                        </Text>
                        <Text
                          style={[
                            styles.kpiLabel,
                            // { color: isDark ? "#A7F3D0" : "#065F46" },
                            { color: colors.subtext },
                          ]}
                        >
                          Present Days
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.kpiBox,
                          //   {
                          //     backgroundColor: isDark
                          //       ? "#ef43431f"
                          //       : colors.background,
                          //     borderColor: "rgba(239, 68, 68, 0.2)",
                          //   },
                          {
                            backgroundColor: colors.background,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={22}
                          color="#EF4444"
                        />
                        <Text
                          style={[
                            styles.kpiNumber,
                            { color: colors.text, fontSize: colors.font20 },
                          ]}
                        >
                          {totalAbsent}
                        </Text>
                        <Text
                          style={[styles.kpiLabel, { color: colors.subtext }]}
                        >
                          Absent Days
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.kpiBox,
                          //   {
                          //     backgroundColor: isDark
                          //       ? "rgba(99, 102, 241, 0.12)"
                          //       : "#EEF2FF",
                          //     borderColor: "rgba(99, 102, 241, 0.2)",
                          //   },
                          {
                            backgroundColor: colors.background,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="calendar-month-outline"
                          size={22}
                          color="#6366F1"
                        />
                        <Text
                          style={[
                            styles.kpiNumber,
                            { color: colors.text, fontSize: colors.font20 },
                          ]}
                        >
                          {totalDays}
                        </Text>
                        <Text
                          style={[styles.kpiLabel, { color: colors.subtext }]}
                        >
                          Total Sessions
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Right Column (Tablet) / Monthly List (Mobile) */}
                <View
                  style={[
                    styles.rightColumn,
                    isTablet && styles.tabletRightColumn,
                  ]}
                >
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.text, fontSize: colors.font18 },
                      ]}
                    >
                      Monthly Log Breakdown
                    </Text>
                  </View>

                  <View style={styles.cardsStack}>
                    {records.map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.monthCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.borderL,
                            shadowColor: colors.shadowClr,
                          },
                        ]}
                      >
                        <View style={styles.monthCardTop}>
                          <View style={styles.monthBadgeWrap}>
                            <Text
                              style={[
                                styles.monthName,
                                { color: colors.text, fontSize: colors.font16 },
                              ]}
                            >
                              {item.month}
                            </Text>
                            <Text
                              style={[
                                styles.monthDaysCount,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              {item.working_days} working days
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.rateBadge,
                              {
                                backgroundColor:
                                  item.percentage >= 90
                                    ? isDark
                                      ? "#10b77f26"
                                      : "#DCFCE7"
                                    : isDark
                                      ? "#ef444426"
                                      : "#FEE2E2",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.rateBadgeText,
                                {
                                  color:
                                    item.percentage >= 90
                                      ? "#10B981"
                                      : "#EF4444",
                                  fontSize: colors.font13,
                                },
                              ]}
                            >
                              {item.percentage}%
                            </Text>
                          </View>
                        </View>

                        {/* Visual Breakdown Bar */}
                        <View
                          style={[
                            styles.breakdownBarTrack,
                            {
                              backgroundColor: isDark
                                ? colors.borderL
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.breakdownBarFill,
                              {
                                backgroundColor:
                                  item.percentage >= 90 ? "#a0e8d0" : "#efa3a3",
                                width: `${Math.min(item.percentage, 100)}%`,
                              },
                            ]}
                          />
                        </View>

                        {/* Breakdown Metrics */}
                        <View style={styles.monthBreakdownRow}>
                          <View style={styles.breakdownPill}>
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: "#10B981" },
                              ]}
                            />
                            <Text
                              style={[
                                styles.pillText,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              Present:{" "}
                              <Text
                                style={{
                                  color: colors.text,
                                  fontWeight: "600",
                                }}
                              >
                                {item.present}
                              </Text>
                            </Text>
                          </View>

                          <View style={styles.breakdownPill}>
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: "#EF4444" },
                              ]}
                            />
                            <Text
                              style={[
                                styles.pillText,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              Absent:{" "}
                              <Text
                                style={{
                                  color: colors.text,
                                  fontWeight: "600",
                                }}
                              >
                                {item.absent}
                              </Text>
                            </Text>
                          </View>
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
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
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
  filterBtn: {
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
  filterText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
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
    flex: 1.1,
  },
  rightColumn: {
    width: "100%",
  },
  tabletRightColumn: {
    flex: 1.4,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 24,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 0,
  },
  circularMetricWrap: {
    marginBottom: 20,
  },
  outerRing: {
    width: 200,
    height: 140,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageValue: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
    letterSpacing: -1,
  },
  percentageLabel: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  progressTrack: {
    width: "100%",
    height: 50,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBar: {
    height: "100%",
    borderRadius: 18,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  kpiBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    // borderWidth: 0,
    alignItems: "center",
  },
  kpiNumber: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 2,
  },
  kpiLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
  },
  cardsStack: {
    gap: 14,
  },
  monthCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0,
  },
  monthCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthBadgeWrap: {
    flex: 1,
  },
  monthName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
  monthDaysCount: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  rateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rateBadgeText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
  },
  breakdownBarTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  breakdownBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  monthBreakdownRow: {
    flexDirection: "row",
    gap: 16,
  },
  breakdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontFamily: Fonts?.regular || "System",
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
});
