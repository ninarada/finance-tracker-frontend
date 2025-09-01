import DottedLine from '@/assets/svg/dottedLine';
import ReceiptModal from '@/components/modals/ReceiptModal';
import { getCategoryItems, getReceiptById } from '@/services/receiptsService';
import { addCategoryToFavourites, deleteCategory, getMyProfile } from '@/services/userService';
import { CategoryStats, fetchCategoryStatsByName } from '@/utils/categoryStats';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CategoryOverview = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const [categoryItems, setCategoryItems] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [sortOption, setSortOption] = useState<'name' | 'totalPrice'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [favouritesCount, setFavouritesCount] = useState(0);
  
  const fetchCategoryItems = useCallback(async () => {
    try {
      const data = await getCategoryItems(name);
      setCategoryItems(data);
      const dataStats = await fetchCategoryStatsByName(name);
      setCategoryStats([dataStats]); 
      const userData = await getMyProfile();
      const isFavourite = userData.favouriteCategories.includes(name);
      setIsFavourited(isFavourite);
      const count = userData.favouriteCategories.lenght;
      setFavouritesCount(count)
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data.");
    }
  }, []);

  useEffect(() => {
    fetchCategoryItems();
  }, [fetchCategoryItems]);

  const handleViewReceipt = async (receiptId: string) => {
    try {
      const receipt = await getReceiptById(receiptId);
      setSelectedReceipt(receipt);
    } catch (error) {
      Alert.alert("Error", "Failed to load receipt.");
    }
  };

  const sortedCategoryItems = [...categoryItems].sort((a, b) => {
    if (sortOption === 'name') {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    } else if (sortOption === 'totalPrice') {
      if (sortDirection === 'asc') {
        return a.totalPrice - b.totalPrice;
      } else {
        return b.totalPrice - a.totalPrice;
      }
    }
    return 0;
  });  

  const handleDelete = async () => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete the category "${name}"? This will remove it from all receipts.`,
      [
        { text: "Cancel", style: "cancel",},
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(name);
              Alert.alert("Deleted", `Category "${name}" was deleted successfully.`);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete category.");
            }
          },
        },
      ]
    );
  };


  const handleAddToFavourites = async() => {
    try {
      const response = await addCategoryToFavourites( name, !isFavourited);
      const isNowFavourited = response.favouriteCategories.includes(name);
      setIsFavourited(isNowFavourited);
    } catch (error: any) {
      const message = error?.message || "Failed to update favourites.";
      if (message.toLowerCase().includes("favourites limit reached")) {
        Alert.alert("Limit Reached", "Favourites are full. You can't add more.");
      } else {
        Alert.alert("Error", message);
      }
    }
  }



  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 bg-primary-10'>
            <ScrollView className="px-5">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
                    <FontAwesome size={15} name="arrow-left" color="#64748b"/>
                    <Text className="text-slate-500 font-medium text-xl">back</Text>
                </Pressable>

                {categoryStats.length > 0 && (
                  <View className="bg-primary-50 rounded-2xl px-5 pb-4 pt-3 mb-7 mt-3 shadow-sm">
                    <View className='flex-row justify-between'>
                      <TouchableOpacity onPress={handleAddToFavourites}>
                        <View className='shadow-sm'>
                          <FontAwesome name={isFavourited ? "star" : "star-o"} size={24} color={isFavourited ? "#FACC15" : "black"} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleDelete} >
                        <Text className='text-primary-300 text-sm font-medium'>delete</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-1 items-center mb-4">
                      <Text className="text-3xl font-bold my-1 text-purple-800">{name}</Text>
                    </View>
                    <View className='flex-row items-center p-2 gap-1'>
                      <View className='w-8 items-center'>
                        <FontAwesome5 name="money-bill-alt" size={16} color="#374151" />
                      </View>
                      <Text className="text-md font-medium">total spent</Text>
                      <View className="flex-1 mx-2 justify-end pb-1"><DottedLine /></View>
                      <Text className="text-md font-medium">€{categoryStats[0].totalSpent.toFixed(2)}</Text>
                    </View>
                    <View className='flex-row items-center p-2 gap-1'>
                      <View className='w-8 items-center'>
                        <FontAwesome name="shopping-cart" size={16} color="#374151" />
                      </View>
                      <Text className="text-md font-medium">this months spendings</Text>
                      <View className="flex-1 mx-2 justify-end pb-1"><DottedLine /></View>
                      <Text className="text-md font-medium">€{categoryStats[0].thisMonthsSpendings.toFixed(2)}</Text>
                    </View>
                    <View className='flex-row items-center p-2 gap-1'>
                      <View className='w-8 items-center'>
                        <Entypo name="shop" size={16} color="#374151" />
                      </View>
                      <Text className="text-md font-medium">most popular store</Text>
                      <View className="flex-1 mx-2 justify-end pb-1"><DottedLine /></View>
                      <Text className="text-md font-medium">{categoryStats[0].mostPopularStore || 'N/A'}</Text>
                    </View>
                </View>
                )}

                {categoryItems.length >0 && (<View className="flex-row mb-3">
                  <View className='bg-primary-200 px-6 py-1 rounded-full shadow-sm'>
                    <TouchableOpacity onPress={() => setSortMenuVisible(true)}>
                      <Text className="text-white text-md font-bold text-center" >Sort</Text>
                    </TouchableOpacity>  
                  </View>
                  
                </View>)}

                {categoryItems.length === 0 ? (
                    <Text className="text-center text-gray-500">No items found in this category.</Text>
                ) : (
                  sortedCategoryItems.map((item, index) => (
                    <View key={index} className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
                        <View className='flex-row justify-between'>
                            <Text className="font-bold text-lg text-purple-950">{item.name}</Text>
                            <Text className="text-md text-gray-700">
                                {item.receiptDate ? new Date(item.receiptDate).toLocaleDateString() : "Unknown"}
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-700">Quantity: {item.quantity}</Text>
                        <Text className="text-sm text-gray-700">Unit Price: ${item.unitPrice}</Text>
                        <Text className="text-sm text-gray-700">Total Price: ${item.totalPrice}</Text>

                        <View className="mt-2 border-t border-gray-200 pt-2 flex-row justify-between items-center">
                            <View>
                                <Text className="text-xs text-gray-600">
                                    Store: <Text className="font-bold">{item.receiptStore || "Unknown"}</Text>
                                </Text>
                                <Text className="text-xs text-gray-600">Receipt Total: ${item.receiptTotal ?? "N/A"}</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => handleViewReceipt(item.receiptId)}
                                className="px-4 py-1 rounded-2xl bg-primary-50 items-center justify-center" 
                            >
                                <Text className="text-primary-250 text-sm font-semibold">View Receipt</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    ))
                )}

                <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)}/>

                <Modal
                  transparent
                  visible={sortMenuVisible}
                  animationType="fade"
                  onRequestClose={() => setSortMenuVisible(false)}
                >
                  <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                    onPress={() => setSortMenuVisible(false)}
                  >
                    <View className="absolute bg-white rounded-xl py-2 w-[220px] shadow-lg mt-80 ml-5">
                      {[
                        { label: 'Name (A → Z)', option: 'name', direction: 'asc' },
                        { label: 'Name (Z → A)', option: 'name', direction: 'desc' },
                        { label: 'Total Price (Low → High)', option: 'totalPrice', direction: 'asc' },
                        { label: 'Total Price (High → Low)', option: 'totalPrice', direction: 'desc' },
                      ].map(({ label, option, direction }) => {
                        const isActive = sortOption === option && sortDirection === direction;
                        return (
                          <TouchableOpacity
                            key={label}
                            onPress={() => {
                              setSortOption(option as 'name' | 'totalPrice');
                              setSortDirection(direction as 'asc' | 'desc');
                              setSortMenuVisible(false);
                            }}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 16,
                              backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                              borderRadius: 8,
                            }}
                          >
                            <Text
                              style={{
                                color: isActive ? '#4f46e5' : '#111827',
                                fontWeight: isActive ? '600' : '400',
                              }}
                            >
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </Pressable>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CategoryOverview;
