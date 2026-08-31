import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootStack() {
  const { loading, user } = useUser();
  const { theme, colors } = useTheme();
  return (
    <Stack
      // screenOptions={{
      //   headerStyle: {
      //     backgroundColor: colors.background,
      //   },
      //   headerTintColor: colors.text,
      //   headerTitleStyle: {
      //     fontWeight: "bold",
      //   },
      //   // headerShown: false
      // }}

      screenOptions={{
        // headerStyle: { backgroundColor: colors.background + "aa" },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: Fonts.semibold },

        animation: "slide_from_right",
        presentation: "card",
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,

        gestureEnabled: true,
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Protected guard={!!user}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            title: "Home",
            // headerTransparent: true,
          }}
        />

        {/* <Stack.Screen
            name="trips/ongoing_trip/9"
            options={{
              title: "Start New Trip",
              headerShown: true, // Shows the back button
              presentation: "card", // standard slide animation
              presentation: "fullScreenModal",
              gestureEnabled: true
            }}
          /> */}
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* <Stack.Protected guard={onboarding?.onboarding_process === "pending"}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack.Protected> */}

        {/* APPROVAL SCREENS======
        ========================== */}

        {/* <Stack.Screen
          name="approval/professional_form"
          options={{
            headerShown: true,
            presentation: "formSheet",
            title: "Professional Info",
          }}
        />
        <Stack.Screen
          name="approval/upload_docform"
          options={{ headerShown: true, presentation: "formSheet" }}
        /> */}

        <Stack.Screen
          name="login"
          options={{ title: "Login", headerShown: false }}
        />
      </Stack.Protected>

      {/* WITHOUT PROTECTED screens --- */}
      {/* <Stack.Screen
        name="demo_screen"
        options={{
          title: "Add Hotel Stay",
          headerShown: true,
          
        }}
      >
        <Stack.Screen.BackButton displayMode="minimal">
          Back
        </Stack.Screen.BackButton>
        <Stack.Title large>Demo Screen</Stack.Title>
        <Stack.Toolbar placement="left">
            <Stack.Toolbar.Button
              icon="sidebar.left"
              onPress={() => alert("Left button pressed!")}
            />
          </Stack.Toolbar>
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              icon="ellipsis.circle"
              onPress={() => alert("Right button pressed!")}
            />
          </Stack.Toolbar>
      </Stack.Screen> */}
    </Stack>
  );
}
