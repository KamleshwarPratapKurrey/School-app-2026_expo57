import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Icon } from "expo-router";
import { useUser } from "@/context/UserContext";

export default function AppTabs() {
  const { colors } = useTheme();
  const { user } = useUser();

  // Keep the bar visually separate from the content while preserving the
  // platform-native tab behavior and safe-area handling.
  // const tabBarBackground = `${colors.card}F2`;
  const tabBarBackground = `${colors.background}F2`;

  return (
    <NativeTabs
      backgroundColor={tabBarBackground}
      blurEffect={Platform.OS === "ios" ? "systemMaterial" : "none"}
      disableTransparentOnScrollEdge
      shadowColor={colors.shadowClr}
      iconColor={colors.icon}
      tintColor={colors.tint}
      rippleColor={`${colors.tint}22`}
      indicatorColor={`${colors.tint}20`}
      labelStyle={{
        default: {
          color: colors.subtext,
          fontSize: 11,
          fontWeight: "500",
        },
        selected: {
          color: colors.tint,
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <NativeTabs.Trigger
        name={user?.role === "Student" ? "student_home" : "teacher_home"}
      >
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        {Platform.OS === "ios" ? (
          <Icon sf={{ default: "house", selected: "house.fill" }} />
        ) : (
          <Icon md={{ default: "home", selected: "home_filled" }} />
        )}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        {Platform.OS === "ios" ? (
          <Icon
            sf={{
              default: "person.crop.circle",
              selected: "person.crop.circle.fill",
            }}
          />
        ) : (
          <Icon md={{ default: "person_outline", selected: "person" }} />
        )}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
