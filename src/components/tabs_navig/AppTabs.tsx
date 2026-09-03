import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Icon } from "expo-router";

export default function AppTabs() {
  //   const colors = Colors[scheme === "unspecified" ? "light" : scheme];
  const { colors } = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.tint}
      labelStyle={{
        default: { color: colors.subtext },
        selected: { color: colors.text },
      }}
      // tintColor={{
      //   default: colors.tabIconDefault,
      //   selected: colors.tabIconSelected,
      // }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        {/* <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        /> */}
        {Platform.OS === "ios" ? (
          <Icon sf={{ default: "house", selected: "house.fill" }} />
        ) : (
          // <Icon
          //   src={<VectorIcon family={MaterialCommunityIcons} name="home" />}
          // />

          // Google fonts: Material icon glyph name. See the Material icons for the complete catalog.
          <Icon md={{ default: "home", selected: "home_app_logo" }} />
        )}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        {/* {Platform.OS === "ios" ? (
          <Icon sf={{ default: "person", selected: "person.fill" }} />
        ) : (
          <Icon md={{ default: "person_outline", selected: "person" }} />
        )} */}
        {Platform.OS === "ios" ? (
          <Icon
            sf={{
              default: "person.crop.circle",
              selected: "person.crop.circle.fill",
            }}
          />
        ) : (
          <Icon
            md={{ default: "account_circle", selected: "account_circle" }}
          />
        )}
      </NativeTabs.Trigger>

      {/* <NativeTabs.Trigger name="studies">
        <NativeTabs.Trigger.Label>Studies</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}
