import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light p-4">
      <ScrollView>
        <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
              <FontAwesome size={24} name="arrow-left" color="#94a3b8"/>
              <Text className="text-slate-500 font-bold text-lg">back</Text>
            </Pressable>
        </View>
        <View className="flex-row items-center justify-center">
            <Text className="text-2xl font-bold mb-2">Settings</Text>
        </View>
        

        {/* App Preferences */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">App Preferences</Text>
          <View className="flex-row justify-between items-center py-2">
            <Text>Dark Mode</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text>Currency</Text>
            <Text className="text-primary-250">€</Text>
          </View>
        </View>

        {/* Account */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Account</Text>
          <Pressable onPress={() => Alert.alert("Coming soon")}>
            <Text className="text-primary-300">Change Password</Text>
          </Pressable>
          <Pressable onPress={() => Alert.alert("Coming soon")} className="mt-3">
            <Text className="text-error-dark">Delete Account</Text>
          </Pressable>
        </View>

        {/* Legal */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Legal</Text>
          <Pressable onPress={() => Alert.alert("T&C placeholder")}>
            <Text className="text-primary-300">Terms & Conditions</Text>
          </Pressable>
          <Pressable onPress={() => Alert.alert("Privacy Policy placeholder")} className="mt-2">
            <Text className="text-primary-300">Privacy Policy</Text>
          </Pressable>
        </View>


        <Pressable
          onPress={handleLogout}
          className="bg-primary-200 rounded-xl p-4 mt-4 justify-center items-center"
        >
          <Text className="text-white font-semibold text-lg">Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
