import CategorySpendingPieChart from "@/components/charts/CategoryPieChart";
import SpendingLineChart from "@/components/charts/SpendingLineChart";
import { getMyReceipts } from "@/services/receiptsService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import tw from 'tailwind-react-native-classnames';
type Receipt = {
  _id: string;
  user: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category?: string;
  }[];
  totalAmount: number;
  note?: string;
  paymentMethod?: 'Cash' | 'Card' | 'Mobile' | 'Other';
  tags?: string[];
  store?: string;
};

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
                router.replace("/sign-in");
            } else {
                const data = await getMyReceipts(token);
                setReceipts(data);
                const spendingsTemp = data.map((r: { date: string | any[]; totalAmount: any; }) => ({
                  date: r.date.slice(0, 10), // YYYY-MM-DD
                  total: r.totalAmount,
                })).sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime());;
                // console.log(data);
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
      <SafeAreaView className="h-screen-safe">
        <View className="flex-1 items-center px-5 ">
          <Text className="text-2xl font-bold mb-5">Analytics</Text>

              <Text className="text-2xl font-semibold text-center mb-4 text-[#174982]">
                Spending Overview by Category
              </Text>
  
              {receipts.length > 0 ? (
                <CategorySpendingPieChart receipts={receipts} />
              ) : (
                <Text className="text-gray-500 mt-10">No data available.</Text>
              )}

              <Text className="text-2xl font-semibold text-center mt-5 mb-4 text-[#174982]">
                  Spending Over Time
              </Text>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Analytics;
