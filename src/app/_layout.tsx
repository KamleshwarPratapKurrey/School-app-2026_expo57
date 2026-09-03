// import { ToastConfig } from "@/components/common/Toast/ToastConfig";
import { ToastConfig } from "@/components/common/Toast/ToastConfig";
import RootStack from "@/components/stack_navig/RootStack";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { store } from "@/store";
// import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
// import Toast from "react-native-toast-message";
// import { Provider as ReduxProvider } from "react-redux";
// import { store } from "@/store";

SplashScreen.preventAutoHideAsync(); // imp.

function AppContent() {
  const { loading, user } = useUser();
  const { theme, colors } = useTheme();
  //   const [loaded] = useFonts({
  //   PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
  //   PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  // });

  // const [loaded, error] = useFonts({
  //   regular: require("../../assets/fonts/MiSansLatin-Regular.ttf"),
  //   light: require("../../assets/fonts/MiSansLatin-Light.ttf"),
  //   heavy: require("../../assets/fonts/MiSansLatin-Heavy.ttf"),
  //   semibold: require("../../assets/fonts/MiSansLatin-Semibold.ttf"),
  // });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  // if (!loaded && !error) {
  //   return null;
  // }

  //imp.
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // if (!loaded) {
  //   return null;
  // }
  if (loading) return null; //imp.

  // return (
  //   <>
  //     <Slot />
  //     <Toast config={ToastConfig(theme === "dark")} />
  //   </>
  // );

  return (
    <>
      <RootStack />
        <StatusBar style={theme === "dark"? "light": "dark"} />

      <Toast config={ToastConfig(theme === "dark")} />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
    <ThemeProvider>
      <UserProvider>
        <AppContent />
        {/* <StatusBar style="auto" /> */}
      </UserProvider>
    </ThemeProvider>
    </Provider>
  );
}
