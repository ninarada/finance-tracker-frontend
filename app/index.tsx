import { useAuth } from "@/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";


export default function Index() {
  const { token, loading } = useAuth();
  
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-200">
        <ActivityIndicator />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
