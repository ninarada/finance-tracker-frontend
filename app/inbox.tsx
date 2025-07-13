import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Inbox = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary-10 px-4 pt-6">
      <View className="flex-row items-center justify-between mb-6">
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <FontAwesome name="arrow-left" size={20} color="#64748b" />
          <Text className="ml-2 text-slate-600 font-medium text-base">Back</Text>
        </Pressable>
      </View>
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-slate-800">Inbox</Text>
        <Text className="text-slate-500 text-base mt-1">Check your latest messages</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-1">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="font-semibold text-slate-700 mb-1">No new messages</Text>
          <Text className="text-slate-500 text-sm">You're all caught up for now.</Text>
        </View>
        {/* Example for future messages */}
        {/*         
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-slate-200">
          <Text className="font-semibold text-slate-800 mb-1">Message Title</Text>
          <Text className="text-slate-600 text-sm">This is a short preview of the message content...</Text>
          <Text className="text-xs text-slate-400 mt-2">2 hours ago</Text>
        </View> 
        */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inbox;
