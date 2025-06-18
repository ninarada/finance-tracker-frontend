import { processReceiptImage } from "@/services/gcloudAPI";
import { createReceipt } from "@/services/receiptsService";
import { getMyProfile } from "@/services/userService";
import { ScannedReceipt } from "@/types/receipt";
import { convertParsedReceiptToMongooseFormat } from "@/utils/convertParsedReceiptToMongooseFormat";
import { getSuggestedCategory } from '@/utils/getSuggestedCategory';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const initialScannedReceipt: ScannedReceipt = {
    date: "",
    items: [],
    location: "",
    paymentMethod: "",
    storeName: "",
    totalAmount: "",
    note: "",
    tags: []
};

const ScanNewReceipt = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [receipt, setReceipt] = useState<ScannedReceipt>(initialScannedReceipt);
    
    const [suggestedChecked, setSuggestedChecked] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [itemCategories, setItemCategories] = useState<{ [key: number]: string[] }>({});
    const [categoryInput, setCategoryInput] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    
    const filteredCategories = useMemo(() => {
        return categoryInput.trim()
          ? availableCategories.filter((cat) =>
              cat.toLowerCase().startsWith(categoryInput.trim().toLowerCase())
            )
          : availableCategories;
    }, [categoryInput, availableCategories]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (token) {
                const profile = await getMyProfile(token);
                setAvailableCategories(profile.categories);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to load profile data.");
            }
        };

        fetchUserProfile();

        const openCamera = async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Camera permission is required');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                base64: true,
            });

            if (result.canceled) {
                router.back();
                return;
            }

            if (result.assets[0].base64) {
                setImage(result.assets[0].uri);
                setImageBase64(result.assets[0].base64);
            }
        };

        openCamera();
        //setReceipt(demo);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (imageBase64) {
          detectTextFromImage();
        }
    }, [imageBase64]);
    
    const detectTextFromImage = async () => {
        if (!image) return;
        setLoading(true);
        setReceipt(initialScannedReceipt);
        try {
          const result = await processReceiptImage({
            uri: image,
            type: 'image/jpeg',
            name: 'receipt.jpg',
          });
          console.log("Parsed Receipt Data:", result);
          setReceipt(result);
        } catch (error) {
          console.error(error);
          setReceipt(initialScannedReceipt);
        } finally {
          setLoading(false);
        }
    };

    const handleEdit = (receipt: any) => {
        // console.log(convertParsedReceiptToMongooseFormat(receipt));  // ovako je spremno za spremanje u bazu 
        router.push({
          pathname: '/addNewReceipt',
          params: {
            mode: 'edit',
            data: JSON.stringify(receipt), 
          },
        });
    };

    const handleAddToCategory = (i: React.SetStateAction<number | null>) => {
        setSelectedItemIndex(i);
        setModalVisible(true);
    }

    const handleAddNewCategory = () => {
        if (categoryInput.trim() && selectedItemIndex !== null) {
          const newCat = categoryInput.trim();
          setAvailableCategories((prev) =>
            prev.includes(newCat) ? prev : [...prev, newCat]
          );
          setItemCategories((prev) => ({
            ...prev,
            [selectedItemIndex]: [...(prev[selectedItemIndex] || []), newCat],
          }));
          setCategoryInput('');
        }
    };

    const handleToggleCategory = (category: string, selected: boolean) => {
        if (selectedItemIndex === null) return;
      
        setItemCategories((prev) => {
          const existing = prev[selectedItemIndex] || [];
          const updated = selected
            ? existing.filter((cat) => cat !== category)
            : [...existing, category];
          return { ...prev, [selectedItemIndex]: updated };
        });
    };      
    
    const handleDoneCategorySelection = () => {
        setModalVisible(false);
        setSelectedItemIndex(null);
    };      

    const handleSuggestedCategories = () => {
        const newChecked = !suggestedChecked;
        setSuggestedChecked(newChecked);
      
        if (newChecked && receipt?.items?.length) {
          const autoCategories: { [key: number]: string[] } = {};
      
          receipt.items.forEach((item: { itemName: string; }, index:  number) => {
            const suggested = getSuggestedCategory(item.itemName);
            autoCategories[index] = [suggested];
          });
      
          setItemCategories(autoCategories);
        } else {
          setItemCategories({});
        }
    };  

    const handleSave = async() => {
        const itemsWithCategories = receipt.items.map((item, index) => ({
            ...item,
            categories: itemCategories[index] || [],
        }));
          
        const updatedReceipt = {
            ...receipt,
            items: itemsWithCategories,
        };
        
        const parsed = convertParsedReceiptToMongooseFormat(updatedReceipt);

        try {
            const token = await AsyncStorage.getItem('token');
            
            if(token && parsed.store && parsed.items.length>0) {
              const response = await createReceipt(token, parsed);
              console.log("Response:", response);
            }
          } catch (error) {
            Alert.alert('Creating new receipt failed', 'Something went wrong. Please try again.');
          }
      
          setReceipt(initialScannedReceipt);
          router.back();
    }

    return (
            <View className="flex-1 pt-12 bg-black/50">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#fff" />
                        <Text className="mt-4 text-white">Extracting receipt data...</Text>
                    </View>
                ) : (
                    <View className="flex-1 justify-between">
                     <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 px-4 py-2">
                        <FontAwesome size={20} name="arrow-left" color="#cbd5e1"/>
                        <Text className="text-slate-300 font-bold text-xl">back</Text>
                     </Pressable>
                     {receipt && (
                     <View>
                        <View className="items-center">
                            <Text className="font-bold text-2xl text-slate-200 italic">Scanned Receipt Preview</Text>
                        </View>
                        <View className="px-8 pt-5 pb-10 justify-center border border-slate-400 rounded-3xl m-5 bg-background-light">
                            <Pressable onPress={() => handleEdit(receipt)} className="flex-row justify-end items-center gap-1 pb-3">
                                <Text className="text-slate-600">edit</Text>
                                <FontAwesome name="pencil" size={16} color="#6b7280" />
                            </Pressable>
                            <Text className="text-xl font-bold mb-3 ">{receipt?.storeName || "Receipt"}</Text>
                            <Text className="text-sm text-gray-700 mb-4">Date: {receipt?.date}</Text>

                            <View className="mb-4 flex-row gap-1 items-center">
                                <Pressable onPress={handleSuggestedCategories}>
                                    <FontAwesome name={suggestedChecked ? "check-square" : "square-o"}  size={16} color="#6b7280" />
                                </Pressable>
                                <Text className="text-sm italic text-slate-500">Suggested categories for each item</Text>
                            </View>

                            {receipt?.items?.length > 0 && (
                                <>
                                <View className="mb-3 pb-2 border-b-2 border-gray-300">
                                    <View className="flex-row pb-1 mb-1">
                                        <Text className="w-1/3 font-semibold">Name</Text>
                                        <Text className="w-1/6 font-semibold text-right">Unit</Text>
                                        <Text className="w-1/6 font-semibold text-right">Qty</Text>
                                        <Text className="w-1/3 font-semibold text-right">Price</Text>
                                    </View>
                                    <View style={{ maxHeight: receipt.items.length > 10 ? 300 : 'auto' }}>
                                        <ScrollView nestedScrollEnabled={true}>
                                            {receipt.items.map((item, i) => (
                                                <View key={i} className="py-2 border-t border-slate-200">
                                                    <View className="flex-row pb-1 ">
                                                        <Text className="w-1/3 text-gray-700">{item.itemName}</Text>
                                                        <Text className="w-1/6 text-right text-gray-700">€{item.itemUnitPrice}</Text>
                                                        <Text className="w-1/6 text-right text-gray-700">{item.itemQuantity}</Text>
                                                        <Text className="w-1/3 text-right text-gray-700">€{item.itemTotalPrice}</Text>
                                                    </View>
                                                    {itemCategories[i]?.length > 0 ? (
                                                        <View className="flex-row flex-wrap gap-1 px-2">
                                                            {itemCategories[i].map((cat, idx) => (
                                                                <View key={idx} className="bg-purple-100 px-2 py-1 rounded-2xl">
                                                                    <Text className="text-purple-900 font-medium text-xs">{cat}</Text>
                                                                </View>
                                                            ))}
                                                            <Pressable onPress={() => handleAddToCategory(i)} className="bg-gray-100 px-2 py-1 rounded-2xl">
                                                                <Text className="text-gray-800 text-xs italic">edit</Text>
                                                            </Pressable>
                                                        </View>
                                                        ) : (
                                                        <Pressable onPress={() => handleAddToCategory(i)} className="bg-purple-50 px-3 mx-2 py-1 self-start rounded-3xl mt-1">
                                                            <Text className="text-purple-700 text-sm italic">add to category</Text>
                                                        </Pressable>
                                                        )}
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                    {receipt.items.length > 10 && (
                                        <Text className="text-xs text-center italic text-gray-400 mt-2">* Scroll to view more items *</Text>
                                    )}
                                </View>
                                <Text className="text-gray-800 text-right mb-2">Total: €{receipt.totalAmount}</Text>
                                <Text className="text-sm text-gray-500 mb-1">Payment: {receipt.paymentMethod}</Text>
    
                                {receipt?.note && (
                                    <Text className="text-xs text-gray-400 italic mb-2">Note: {receipt.note}</Text>
                                )}
                                {receipt?.tags?.length > 0 && (
                                    <Text className="text-xs text-gray-500 mb-2">
                                        Tags: {receipt.tags.join(", ")}
                                    </Text>
                                )}
                                </>
                            )}
                            <Pressable onPress={handleSave} className="mt-3 bg-primary-250 px-4 py-2 rounded-xl">
                                <Text className="text-white text-center font-semibold">Save</Text>
                            </Pressable>
                        </View>
                     </View>
                     )}
                     {modalVisible && selectedItemIndex !== null && (
                        <View className="absolute top-0 left-0 right-0 bottom-0 px-5 bg-black/50 justify-center items-center z-50">
                            <View className="w-11/12 max-h-[70%] bg-white rounded-2xl p-4">
                                <Text className="text-lg font-semibold mb-1 text-center">Choose or Create New Categories</Text>
                                <View className="flex-row items-center gap-2 my-4">
                                    <TextInput
                                        placeholder="New category"
                                        className="flex-1 border border-gray-300 px-3 py-2 rounded-2xl text-sm"
                                        value={categoryInput}
                                        onChangeText={setCategoryInput}
                                    />
                                </View>
                                <ScrollView className="mb-3">
                                    {categoryInput.trim() && !availableCategories.some(
                                        (cat) => cat.toLowerCase() === categoryInput.trim().toLowerCase()
                                    ) && (
                                        <Pressable onPress={handleAddNewCategory} className="bg-primary-50 px-3 py-2 rounded-2xl mb-2 border border-primary-300">
                                            <Text className="text-primary-300 italic">+ Create "{categoryInput.trim()}"</Text>
                                        </Pressable>
                                    )}
                                    {filteredCategories.map((category, index) => {
                                        const selected = itemCategories[selectedItemIndex]?.includes(category);
                                        return (
                                            <Pressable key={index} onPress={() => handleToggleCategory(category, selected)} className={`px-3 py-2 rounded-xl mb-2 ${selected ? "bg-purple-200" : "bg-gray-100" }`}>
                                                <Text className="text-gray-800">{category}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>

                            <Pressable onPress={handleDoneCategorySelection} className="mt-4 bg-primary-250 px-4 py-2 rounded-xl">
                                <Text className="text-white text-center font-semibold">Done</Text>
                            </Pressable>
                            </View>
                        </View>
                        )}
                     <View className="py-8"></View>
                    </View>
                )}
            </View>
    );    
};

export default ScanNewReceipt;