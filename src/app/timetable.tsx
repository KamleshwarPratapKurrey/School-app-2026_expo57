import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

import { api_url } from "@/components/common/ApiUrls";
import { StatusCode } from "@/constants/app_constants";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchExamTimeTable } from "@/store/slices/timetableSlice";

export default function TimeTableScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExamIndex, setSelectedExamIndex] = useState(0);

  const {
    data: exams,
    status,
    error,
  } = useAppSelector((state) => state.timetable);

  const loadData = async () => {
    await dispatch(
      fetchExamTimeTable({
        endpoint: `${api_url}/exam-time-table`,
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

  const currentExam = exams[selectedExamIndex] ?? null;
  const schedules = currentExam?.schedules ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
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
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font28 },
                  ]}
                >
                  Exam Schedule
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Upcoming exam dates and timings
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
                  name="calendar-clock"
                  size={16}
                  color={colors.tint}
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {exams.length} Exams
                </Text>
              </View>
            </View>

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to fetch timetable records."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : exams.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-remove-outline"
                  size={46}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No published exam schedules at this time
                </Text>
              </View>
            ) : (
              <>
                {/* Horizontal Segmented Tabs */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tabScrollContainer}
                >
                  {exams.map((exam, index) => {
                    const isSelected = index === selectedExamIndex;
                    return (
                      <TouchableOpacity
                        key={`${exam.exam_name}-${index}`}
                        onPress={() => setSelectedExamIndex(index)}
                        activeOpacity={0.8}
                        style={[
                          styles.tabPill,
                          {
                            backgroundColor: isSelected
                              ? colors.tint
                              : colors.card,
                            borderColor: isSelected
                              ? colors.tint
                              : colors.borderL,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tabPillText,
                            {
                              color: isSelected ? "#FFFFFF" : colors.text,
                              fontFamily: isSelected
                                ? Fonts?.semibold || "System"
                                : Fonts?.regular || "System",
                            },
                          ]}
                        >
                          {exam.exam_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Exam Schedule Grid */}
                <View
                  style={[
                    styles.scheduleGrid,
                    isTablet && styles.tabletScheduleGrid,
                  ]}
                >
                  {schedules.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.scheduleCard,
                        isTablet && styles.tabletScheduleCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      {/* Top Header Row */}
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.subjectContainer}>
                          <Text
                            style={[
                              styles.subjectText,
                              { color: colors.text, fontSize: colors.font18 },
                            ]}
                          >
                            {item.subject}
                          </Text>
                          <View
                            style={[
                              styles.classChip,
                              {
                                backgroundColor: isDark
                                  ? "rgba(99, 102, 241, 0.15)"
                                  : "#EEF2FF",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.classChipText,
                                { color: colors.tint },
                              ]}
                            >
                              Class {item.class}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.roomChip,
                            {
                              backgroundColor: isDark
                                ? colors.borderL
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <Feather
                            name="map-pin"
                            size={12}
                            color={colors.subtext}
                          />
                          <Text
                            style={[
                              styles.roomChipText,
                              { color: colors.subtext },
                            ]}
                          >
                            {item.room_no.startsWith("Room")
                              ? item.room_no
                              : `Room ${item.room_no}`}
                          </Text>
                        </View>
                      </View>

                      {/* Divider */}
                      <View
                        style={[
                          styles.divider,
                          { backgroundColor: colors.borderL },
                        ]}
                      />

                      {/* Time and Date Row */}
                      <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={15}
                            color={colors.tint}
                          />
                          <Text
                            style={[
                              styles.metaText,
                              { color: colors.text, fontSize: colors.font13 },
                            ]}
                          >
                            {item.date}
                          </Text>
                        </View>

                        <View style={styles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={15}
                            color="#10B981"
                          />
                          <Text
                            style={[
                              styles.metaText,
                              { color: colors.text, fontSize: colors.font13 },
                            ]}
                          >
                            {item.start_time} - {item.end_time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
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
  tabScrollContainer: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0,
  },
  tabPillText: {
    fontSize: 14,
  },
  scheduleGrid: {
    flexDirection: "column",
    gap: 12,
  },
  tabletScheduleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  scheduleCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 0,
  },
  tabletScheduleCard: {
    width: "48.8%",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  subjectText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
  classChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  classChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  roomChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roomChipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: Fonts?.regular || "System",
  },
});
