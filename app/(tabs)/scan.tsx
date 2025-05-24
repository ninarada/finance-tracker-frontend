import { CreateReceipt } from "@/types/receipt";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ScanReceipt = () => {
  const router = useRouter();
  
  const receiptInitial: CreateReceipt  = {
    items: [],
    note: "",
    paymentMethod: undefined,
    tags: [],
    store: "",
    date: "",
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full pb-7 items-center justify-center">
          <View className="items-center">
            <Text className="text-2xl font-bold my-5 text-slate-700 ita">Scan Receipts</Text>
          </View>

          <View className="gap-2 ">
            <Pressable onPress={() => {router.push("/scanReceipt")}} className="bg-primary-300 py-2 rounded-3xl  my-2">
              <Text className="text-white font-bold text-lg text-center">Take a Photo</Text>
            </Pressable>

            <Pressable onPress={() => {router.push("/addNewReceipt")}} className="bg-primary-200 px-10 py-2 rounded-3xl my-2">
              <Text className="text-white font-bold text-lg text-center">Add New Manually</Text>
            </Pressable>
          </View>
          
          {/* <ScanNewReceipt /> */}

          {/* <Pressable onPress={()=>setNewReceiptVisible(true)} className="bg-primary-200 px-4 py-2 rounded-3xl self-center my-2">
            <Text className="text-white font-bold text-lg text-center">Add New Receipt Manually</Text>
          </Pressable>
          {newReceiptVisible && <AddNewReceipt visible={true} onClose={() => setNewReceiptVisible(false)} receipt={receiptInitial}/>}   */}
          
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ScanReceipt;
