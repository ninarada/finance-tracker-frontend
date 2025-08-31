import { useAuth } from "@/AuthContext";
import AverageReceiptValue from "@/components/analytics/AverageReceiptValue";
import MonthlySpendingCard from "@/components/analytics/MonthlySpendingCard";
import CategorySpendingPieChart from "@/components/charts/CategoryPieChart";
import MonthsBarChart from "@/components/charts/MonthsBarChart";
import StoreSpendingChart from "@/components/charts/StoreSpendingChart";
import FilterByCategoryModal from "@/components/modals/FilterByCategoryModal";
import { getMyReceipts } from "@/services/receiptsService";
import { getMyProfile } from "@/services/userService";
import { Receipt } from "@/types/receipt";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { token } = useAuth();
  const [filterByCategoryModalVisible, setFilterByCategoryModalVisible] = useState(false);

  const fetchReceipts = useCallback(async () => {
    try {
      const data = await getMyReceipts();
      setReceipts(data);
      const profileData = await getMyProfile();
      setUser(profileData);
    } catch (error) {
        Alert.alert("Error", "Failed to load receipts data.");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchReceipts();
  }, [token, fetchReceipts]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 bg-primary-10'>
        {receipts.length < 1 ? (
          <View className="flex-1 px-5">
            <View className="bg-primary-50 rounded-xl shadow-sm mb-5">
              <Text className="text-2xl text-center font-bold my-5 text-purple-900 uppercase">Analytics</Text>
            </View>
            <View className="flex-1 justify-center items-center gap-7 mb-10">
              <Ionicons name="receipt-outline" size={74} color="#6b7280" />
              <Text className="text-2xl text-primary-700 font-semibold">No Receipts Available</Text>
              <Text className="text-base text-gray-600 text-center">It looks like you haven't added any receipts yet. Once you start scanning, your spending insights and trends will appear here.</Text>
              <View className='bg-primary-200 px-6 py-3 rounded-full shadow-sm'>
                <TouchableOpacity onPress={()=>router.push('/scanNew')} className="flex-row gap-2 items-center">
                  <Text className="text-white text-xl uppercase font-bold">Start Creating</Text>
                  <SimpleLineIcons name="note" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView className="px-5" >
            <View className="bg-primary-50 rounded-xl shadow-sm mb-5">
              <Text className="text-2xl text-center font-bold my-5 text-purple-900 uppercase">Analytics</Text>
            </View>
            <MonthlySpendingCard receipts={receipts}/>
            <AverageReceiptValue receipts={receipts} />

            <View className="mt-5 w-full py-2 px-3 rounded-2xl bg-white shadow-sm">
              <Text className="text-2xl font-semibold text-center mt-5 mb-4 text-[#174982]">Spending Overview by Category</Text>
              <CategorySpendingPieChart receipts={receipts} />
            </View>

            {receipts && (
              <View className="mt-5 bg-white  rounded-2xl shadow-sm">
                <Text className="text-2xl font-semibold text-center mt-5 mb-4 text-[#174982]">Spendings of Last 4 Months</Text>
                {/* <View className="flex-row px-8">
                  <TouchableOpacity onPress={()=> setFilterByCategoryModalVisible(true)} className="bg-slate-200 py-1 px-4 rounded-2xl">
                    <Text className="text-sm text-slate-700 font-medium">Filter by Category</Text>
                  </TouchableOpacity>
                </View> */}
                
                <MonthsBarChart receipts={receipts} />
              </View>
            )}

            <StoreSpendingChart receipts={receipts} />
          
            <View className="p-5"></View>
          
          </ScrollView> 
        )}

        {user && (
           <FilterByCategoryModal 
            visible={filterByCategoryModalVisible}
            onClose={() => setFilterByCategoryModalVisible(false)}
            categories={user.categories}
          />
        )}
       
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Analytics;
