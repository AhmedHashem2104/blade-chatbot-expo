import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginComponent() {
  useWarmUpBrowser();

  const { startOAuthFlow: startOAuthFlowGoogle } = useOAuth({
    strategy: "oauth_google",
  });

  const { startOAuthFlow: startOAuthFlowFacebook } = useOAuth({
    strategy: "oauth_facebook",
  });

  const { startOAuthFlow: startOAuthFlowDiscord } = useOAuth({
    strategy: "oauth_discord",
  });

  const onPress = React.useCallback(
    async (type: "google" | "facebook" | "discord") => {
      try {
        const { createdSessionId, signIn, signUp, setActive } =
          type === "google"
            ? await startOAuthFlowGoogle({
                redirectUrl: Linking.createURL("/dashboard", {
                  scheme: "myapp",
                }),
              })
            : type === "discord"
            ? await startOAuthFlowDiscord({
                redirectUrl: Linking.createURL("/dashboard", {
                  scheme: "myapp",
                }),
              })
            : await startOAuthFlowFacebook({
                redirectUrl: Linking.createURL("/dashboard", {
                  scheme: "myapp",
                }),
              });

        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        } else {
          // Use signIn or signUp for next steps such as MFA
        }
      } catch (err) {
        console.error("OAuth error", err);
      }
    },
    []
  );

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Image
        className="w-36 h-36 mb-10"
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRhtmZnxlAEvLTwqyu6_T3O8w4OdyqmXhiIg&s",
        }}
        resizeMode="cover"
      />
      <TouchableOpacity
        className="w-3/5 bg-blue-600 p-4 rounded-full shadow-md mb-4"
        onPress={() => onPress("google")}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Sign in with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-3/5 bg-blue-800 p-4 rounded-full shadow-md mb-4"
        onPress={() => onPress("facebook")}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Sign in with Facebook
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-3/5 bg-gray-900 p-4 rounded-full shadow-md"
        onPress={() => onPress("discord")}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Sign in with Discord
        </Text>
      </TouchableOpacity>
    </View>
  );
}
