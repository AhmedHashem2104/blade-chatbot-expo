import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import LoginComponent from "../components/home/LoginComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      // if (item) {
      //   console.log(`${key} was used 🔐 \n`);
      // } else {
      //   console.log("No values stored under key: " + key);
      // }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <StatusBar style="dark" backgroundColor="#f3f3f3" />
        <SignedIn>
          <Stack
            screenOptions={{
              statusBarStyle: "dark",
              statusBarColor: "#f3f3f3",
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="datasource" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SignedIn>
        <SignedOut>
          <LoginComponent />
        </SignedOut>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
