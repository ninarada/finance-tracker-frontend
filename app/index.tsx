import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "./onboarding";

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <SafeAreaView className="bg-primary-200 h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Text className="text-lg">Main App Screen (Home/Login)</Text>
        </View>
      </ScrollView> 

  
    </SafeAreaView>

    // <View className="flex-1 justify-center items-center">
    //   <Text className="text-5xl text-primary-200">Welcome.</Text>
    //   <Link href={"/onboarding"}>Onboarding</Link>
    // </View>
  );
}
