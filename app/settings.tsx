import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

const settings = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleAddDataSource = () => {
    console.log("Add data source clicked");
    router.navigate("/datasource");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    signOut();
  };

  return (
    isLoaded && (
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="flex-row p-4 items-center  shadow-md">
          <TouchableOpacity onPress={() => router.navigate("/")}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold -ml-6">Settings</Text>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 pt-5">
          {/* Profile Section */}
          <View className="mb-5">
            <Text className="text-xl font-semibold mb-2">Profile</Text>
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: user?.imageUrl,
                }}
                resizeMode="cover"
                className="rounded-full mr-4"
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <View>
                <Text className="text-lg">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-base text-gray-600">
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity className="mb-3" onPress={handleEditProfile}>
            <View className="flex-row items-center p-4 bg-white shadow-md rounded-xl">
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#007AFF"
              />
              <Text className="ml-5 text-lg">Edit Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="mb-3" onPress={handleAddDataSource}>
            <View className="flex-row items-center p-4 bg-white shadow-md rounded-xl">
              <Ionicons name="cloud-upload-outline" size={24} color="#007AFF" />
              <Text className="ml-5 text-lg">Add Data Source</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <View className="flex-row items-center p-4 bg-white shadow-md rounded-xl">
              <Ionicons name="log-out-outline" size={24} color="#007AFF" />
              <Text className="ml-5 text-lg">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default settings;
