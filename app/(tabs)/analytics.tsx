import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();


  return (
    <SafeAreaProvider>
    <SafeAreaView>
        <ScrollView>
            <View className="flex-1 items-center px-5">
                <Text className="text-2xl font-bold mb-5">
                Analytics
                </Text>
            </View>
        </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Analytics;
