import { api_url } from "@/components/common/ApiUrls";
import { User } from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Updates from "expo-updates";

type UserContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const disptach = useAppDispatch();

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await SecureStore.getItemAsync("token");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedToken) {
          setToken(storedToken);
        }
        // console.log("onboarddd-.", storedOnboardingProfile);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (authToken: string, userData: User) => {
    await SecureStore.setItemAsync("token", authToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };
  
  const logoutK = async () => {
    await SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("stored_notices_count");
    await AsyncStorage.removeItem("stored_leave_count");
    setToken(null);
    setUser(null);
    await userLogoutFun();
    // disptach(resetSchoolState());
    await Updates.reloadAsync();
  };

  const userLogoutFun = async () => {
    try {
      const res = await fetch(`${api_url}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e: any) {
      // console.log("e->")
    }
  };
  const triggerLogoutAlert = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled by user"),
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutK();
            } catch (error) {
              console.error("Error during session tear-down:", error);
            }
          },
        },
      ],
      { cancelable: true }, // Allows users to dismiss the alert box by clicking outside of it on Android
    );
  };

  // ONBOARDING PROFILE HANDLER ----start
  // const ONBOARDING_STORAGE_KEY = "onboarding_profile";

  // async function getOnboardingProfile(): Promise<IOnboardingProfile | void> {
  //   const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
  //   // return raw ? JSON.parse(raw) : {};
  //   const stored = raw ? JSON.parse(raw) : {};
  //   setOnboarding(stored);
  // }

  // async function saveOnboardingProfile(
  //   profile: IOnboardingProfile,
  // ): Promise<IOnboardingProfile> {
  //   const current = await getOnboardingProfile();
  //   const next = { ...current, ...profile };
  //   await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(next));
  //   return next;
  // }
  // ONBOARDING PROFILE HANDLER ----start

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout: triggerLogoutAlert,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}
