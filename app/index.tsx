import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "./onboarding";

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          router.replace("/(tabs)/home"); 
        } else {
          setShowOnboarding(true); 
        }
      } catch (error) {
        console.error("Error checking token", error);
        setShowOnboarding(true);
      } 
    };

    checkToken();
  }, []);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className="bg-primary-200 h-full flex-1">
        <ScrollView contentContainerStyle={{ height: '100%'}}>
         {showOnboarding && <Onboarding />}
        </ScrollView>  
      </SafeAreaView>
    </SafeAreaProvider>

    // <View className="flex-1 justify-center items-center">
    //   <Text className="text-5xl text-primary-200">Welcome.</Text>
    //   <Link href={"/onboarding"}>Onboarding</Link>
    // </View>
  );
}
