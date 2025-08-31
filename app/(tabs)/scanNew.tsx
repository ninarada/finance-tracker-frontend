import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ScanReceipt = () => {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full pb-7 items-center justify-center bg-primary-10">
          <View className="items-center">
            <Text className="text-2xl font-bold my-5 text-slate-700 ita">Scan Receipts</Text>
          </View>
          <View className="gap-2 ">
            <Pressable onPress={() => {router.push("/new-receipt/scan")}} className="bg-primary-300 py-2 rounded-3xl  my-2 shadow-sm">
              <Text className="text-white font-bold text-lg text-center shadow-md">Take a Photo</Text>
            </Pressable>

            <Pressable onPress={() => {router.push("/new-receipt/import")}} className="bg-primary-200 px-10 py-2 rounded-3xl  my-2 shadow-sm">
              <Text className="text-white font-bold text-lg text-center shadow-md">Import Photo From Library</Text>
            </Pressable>

            <Pressable onPress={() => {router.push("/new-receipt/manually")}} className="bg-primary-100 py-2 rounded-3xl my-2 shadow-sm">
              <Text className="text-white font-bold text-lg text-center shadow-md">Add New Manually</Text>
            </Pressable>
          </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ScanReceipt;
