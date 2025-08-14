import AverageReceiptValue from "@/components/analytics/AverageReceiptValue";
import MonthlySpendingCard from "@/components/analytics/MonthlySpendingCard";
import CategorySpendingPieChart from "@/components/charts/CategoryPieChart";
import SpendingLineChart from "@/components/charts/SpendingLineChart";
import StoreSpendingChart from "@/components/charts/StoreSpendingChart";
import { getMyReceipts } from "@/services/receiptsService";
import { Receipt } from "@/types/receipt";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import tw from 'tailwind-react-native-classnames';

const optionsTimeframe = [
  { label: 'All', value: 12 },
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
];


const Analytics = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [spendingData, setSpendingData]=useState([]);
  const [chosenCategory, setChosenCategory]=useState('all');
  const [chosenTimeFrame, setChosenTimeFrame]=useState({ label: 'All', value: 12 });
  const [timeframeMenuVisible, setTimeframeMenuVisible] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState(optionsTimeframe);
  const [timeframeValue, setTimeframeValue] = useState(12);  

  useEffect(() => {
    const fetchReceipts = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace("/onboarding");
            } else {
                const data = await getMyReceipts(token);
                setReceipts(data);
                const spendingsTemp = data.map((r: { date: string | any[]; totalAmount: any; }) => ({
                  date: r.date.slice(0, 10), // YYYY-MM-DD
                  total: r.totalAmount,
                })).sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime());;
                setSpendingData(spendingsTemp);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load receipts data.");
        }
    }

    fetchReceipts();
  }, [])

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
          
            <View className="mt-5 w-full py-2 px-3 rounded-2xl bg-white shadow-sm">
              <Text className="text-2xl font-semibold text-center mt-5 mb-4 text-[#174982]">Spending Over Time</Text>
              <View className="w-full  mb-2">
                <View>
                  <DropDownPicker
                        open={timeframeMenuVisible}
                        value={chosenTimeFrame.value}
                        items={items}
                        setOpen={setTimeframeMenuVisible}
                        setValue={(val) => {
                          const value = typeof val === 'function' ? val((prev: any) => prev) : val;
                          setTimeframeValue(value);
                          const selected = optionsTimeframe.find(option => option.value === value);
                          if (selected) setChosenTimeFrame(selected);
                        }}
                        setItems={setItems}
                        placeholder="Select month"

                        style={tw`bg-white border border-gray-300 rounded-3xl px-6 py-1 `}
                        textStyle={tw`text-sm text-gray-700`}
                        dropDownContainerStyle={tw`bg-white border border-gray-300 z-50`}
                        labelStyle={tw`text-gray-800`}
                        selectedItemLabelStyle={tw`font-bold text-black`}
                        listItemLabelStyle={tw`text-gray-700`}
                        placeholderStyle={tw`text-gray-400`}
                        arrowIconStyle={tw`text-gray-600 text-sm`}
                        tickIconStyle={tw`text-green-500 text-sm`}
                      />                
                </View>
              </View>

              {spendingData.length > 0 ? (
                <SpendingLineChart data={spendingData} category={chosenCategory} timeFrame={chosenTimeFrame.value}/> 
              ) :(
                <Text className="text-gray-500 mt-10">No data available.</Text>
              )}
            </View>

            <StoreSpendingChart receipts={receipts} />
          
            <View className="p-5"></View>
          
          </ScrollView> 
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Analytics;
