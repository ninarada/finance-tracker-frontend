import MonthsBarChart from "@/components/charts/MonthsBarChart";
import NewCategoryModal from "@/components/newCategoryModal";
import { images } from "@/constants/images";
import { createCategory, getMyReceipts } from "@/services/receiptsService";
import { AnalysisResult, Receipt } from "@/types/receipt";
import { analyzeReceiptsThisMonth } from "@/utils/analyzeReceiptsThisMonth";
import { Ionicons } from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getMyProfile } from "../../services/userService";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [userPhoto, setUserPhoto] = useState<any>(images.profile_picture); 
  const [thisMonthData, setThisMonthData] = useState<AnalysisResult>();
  const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/sign-in");
          setUser(null);
        } else {
          const profile = await getMyProfile(token);
          setUser(profile);
          if (profile.photo !== "/public/images/profile-picture.png") {
            setUserPhoto({ uri: profile.photo }); 
          }
          const data = await getMyReceipts(token);
          setReceipts(data);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if(receipts) {
      const temp = analyzeReceiptsThisMonth(receipts);
      setThisMonthData(temp);
    }
    console.log(thisMonthData)
    
  }, [receipts]);

  const handleCategoryPress = (name: string) => {
    router.push({
      pathname: "/categoryOverview",
      params: { name },
    });
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace("/sign-in");
        setUser(null);
        return;
      } 
      const data = await createCategory(token, name);
      setUser((prevUser: any) => ({
        ...prevUser,
        categories: data.categories,
      }));
      Alert.alert('Success', 'Category created successfully.',
        [
          {
            text: 'Close',
            onPress: () => console.log('Alert closed'),  
            style: 'cancel',
          },
          {
            text: 'See Category',
            onPress: () => {handleCategoryPress(name)},
            style: 'default',
          },
        ],
        { cancelable: true }
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create category.');
    }
  };
  
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className="p-5">
          <View className="flex-row justify-between items-center mb-10">
            <View className="flex-row items-center gap-3">
              <Image source={userPhoto} className="w-14 h-14 rounded-full" resizeMode="contain"/>
              <View>
                <Text className="text-xl font-bold text-text">Hello, </Text>
                <Text className="text-xl font-bold text-text">{user?.name ? `${user.name}` : ""}!</Text>
              </View>
            </View>
            <FontAwesome size={32} name="bell-o" color="#64748B"/>
          </View>

          <View className="gap-3 mb-7">
            <Text className="text-xl  text-text">Quick Actions</Text>
            <View className="flex-row justify-evenly">
              <Pressable onPress={()=> router.push('/scanReceipt')} className="justify-center items-center gap-2">
                <View className="h-24 w-24 rounded-full justify-center items-center bg-primary-200">
                  <Ionicons name="camera-outline" size={40} color="white" />
                </View>
                <Text className="text-sm text-slate-500">scan</Text>
              </Pressable>

              <Pressable onPress={()=> router.push('/importReceipt')} className="justify-center items-center gap-2">
                <View className="h-24 w-24 rounded-full justify-center items-center bg-primary-200">
                  <FontAwesome name="photo" size={32} color="white" />
                </View>
                <Text className="text-sm text-slate-500">import</Text>
              </Pressable>

              <Pressable onPress={()=> router.push('/addNewReceipt')} className="justify-center items-center gap-2">
                <View className="h-24 w-24 rounded-full justify-center items-center bg-primary-200">
                  <FontAwesome6 name="pencil" size={30} color="white" />
                </View>
                <Text className="text-sm text-slate-500">create</Text>
              </Pressable>
            </View>
          </View>

          <View className="gap-1 mb-7">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row">
                <Text className="text-xl font-medium text-text">Spending Highlights For </Text>
                <Text className="text-xl font-semibold italic text-text">{thisMonthData?.currentMonthName}</Text>
              </View>
              
              <View className="flex-row gap-2">
                <Ionicons name="chevron-back-outline" size={18} color="#9ca3af" />
                <Ionicons name="chevron-forward-outline" size={18} color="#9ca3af" />
              </View>
            </View>
            {thisMonthData && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mx-1"
            >
              <View className="mr-4 w-80 rounded-2xl bg-white shadow-lg overflow-hidden p-5 flex-row justify-between">
                <View className="w-2/3 gap-1 border-l-2 border-slate-300 pl-4 justify-center">
                  <Text className="text-sm text-gray-500 uppercase tracking-wide">Total Spent</Text>
                  <Text className="text-lg font-bold text-gray-900">€{thisMonthData?.totalSpentThisMonth}</Text>
                  <View className="flex-row">
                    <Text className="text-md text-gray-600">across </Text>
                    <Text className="text-md font-semibold text-gray-700">{thisMonthData?.receiptCountThisMonth} </Text>
                    <Text className="text-md text-gray-600">receipts</Text>
                  </View>
                </View>
                <View className="flex-1 justify-center items-center">
                  <Ionicons name="wallet-outline" size={56} color="#374151" />
                </View>
              </View>
              <View className="mr-4 w-80 rounded-2xl bg-white shadow-lg overflow-hidden p-5 flex-row justify-between">
                <View className="w-2/3 gap-1 border-l-2 border-slate-300 pl-4 justify-center">
                  <Text className="text-sm text-gray-500 uppercase tracking-wide">Biggest Purchase</Text>
                  <Text className="text-lg font-medium text-gray-900">{thisMonthData.mostExpensiveItemThisMonth?.name}</Text>
                  <View className="flex-row gap-1">
                    <Text className="text-md font-medium text-gray-700">€{thisMonthData.mostExpensiveItemThisMonth?.totalPrice}</Text>
                    <Text className="text-md text-gray-600">on</Text>
                    <Text className="text-md font-medium text-gray-700">{thisMonthData.mostExpensiveItemThisMonth?.date}</Text>
                  </View>
                </View>
                <View className="flex-1 justify-center items-center">
                  <EvilIcons name="trophy" size={64} color="#4b5563" />
                </View>
              </View>
              <View className="w-80 rounded-2xl bg-white shadow-lg overflow-hidden p-5 flex-row justify-between">
                <View className="w-2/3 gap-1 border-l-2 border-slate-300 pl-4 justify-center">
                  <Text className="text-sm text-gray-500 uppercase tracking-wide">Top Spending Category</Text>
                  <Text className="text-lg font-medium text-gray-900">{thisMonthData?.mostSpendingCategoryThisMonth}</Text>
                  <View className="flex-row">
                    <Text className="text-md font-semibold text-gray-700">€{thisMonthData?.mostSpendingCategoryAmountThisMonth} </Text>
                    <Text className="text-md text-gray-600">total</Text>
                  </View>
                  
                </View>
                <View className="flex-1 justify-center items-center">
                  <EvilIcons name="archive" size={70} color="#4b5563" />
                </View>
              </View>
            </ScrollView>
            )}
          </View>

          <View className="mb-7 gap-4">
            <Text className="text-xl font-medium text-text">Spending Last 6 Months</Text>
            {receipts && (<MonthsBarChart receipts={receipts} />)}
          </View>

          <View className="gap-3 mb-7">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl  text-text">Categories</Text>
              <Pressable onPress={() => setNewCategoryModalVisible(true)} className="bg-primary-50 rounded-full px-3">
                <Text className="text-primary-200 text-center text-md py-1 font-semibold">
                  add new +
                </Text>
              </Pressable>
            </View>
            {user && (
              <View className="flex-row flex-wrap gap-3 justify-evenly">
                {user.categories.length > 0 &&  user.categories.slice(0, 6).map((category: string, index: React.Key | null | undefined) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCategoryPress(category)}
                      className="px-4 py-2 rounded-2xl bg-primary-100 items-center justify-center" 
                    >
                      <Text className="text-white  font-semibold">{category}</Text>
                    </TouchableOpacity>
                ))}
              </View>
            )}
            <View className="flex-row justify-center">
              <Pressable onPress={() => router.push('/categories')} className="px-5 py-1  rounded-2xl bg-primary-50 ">
                <Text className="text-primary-200 text-center text-lg font-semibold">
                  see more
                </Text>
              </Pressable>
            </View>
            
          </View>

          <NewCategoryModal 
            visible={newCategoryModalVisible}
            onClose={() => setNewCategoryModalVisible(false)}
            onCreate={handleCreateCategory}
          />
          
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Home;