import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import { getMyProfile } from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/sign-in");
          setUser(null);
        } else {
          const profile = await getMyProfile(token);
          setUser(profile);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-2xl font-bold mb-5">
        Welcome{user?.username ? `, ${user.username}` : ""}
      </Text>
      <Text className="text-base mb-5">Email: {user?.email || "Loading..."}</Text>
      <View className="w-full mt-4">
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default Profile;
