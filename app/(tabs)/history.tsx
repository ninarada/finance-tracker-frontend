import { getMyReceipts } from "@/services/receiptsService";
import { Receipt } from "@/types/receipt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const History = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    router.replace("/sign-in");
                } else {
                    const data = await getMyReceipts(token);
                    setReceipts(data);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to load receipts data.");
            }
        }

        fetchReceipts();
    }, []);
    
    return (
        <SafeAreaProvider>
        <SafeAreaView>
            <ScrollView className="px-5">
                <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold my-5">History</Text>
                </View>

                {receipts.length === 0 ? (
                    <Text className="text-center text-gray-500">No receipts yet.</Text>
                ) : (
                    receipts.map((receipt, index) => (
                        <TouchableOpacity
                            key={receipt._id || index}
                            onPress={() => setSelectedReceipt(receipt)}
                            className="bg-white rounded-2xl p-4 mb-5 shadow"
                        >
                            <Text className="text-lg font-semibold mb-1">Store: {receipt.store || 'Unknown'}</Text>
                            <Text className="text-sm text-gray-500 mb-1">Date: {new Date(receipt.date).toLocaleDateString()}</Text>
                            <Text className="text-sm text-gray-700 mb-2">Total: €{receipt.totalAmount?.toFixed(2)}</Text>
                            
                            <View className="flex-row border-b border-gray-200 pb-1 mb-1">
                                <Text className="w-1/3 font-medium text-xs">Name</Text>
                                <Text className="w-1/6 font-medium text-right text-xs">Unit</Text>
                                <Text className="w-1/6 font-medium text-right text-xs">Qty</Text>
                                <Text className="w-1/3 font-medium text-right text-xs">Price</Text>
                            </View>
                            
                            <View className="mb-1">
                                {receipt.items.slice(0, 2).map((item, i) => (
                                    <View key={i} className="flex-row">
                                        <Text className="w-1/3 text-xs text-gray-600">{item.name}</Text>
                                        <Text className="w-1/6 text-xs text-right text-gray-600">€{item.unitPrice?.toFixed(2)}</Text>
                                        <Text className="w-1/6 text-xs text-right text-gray-600">{item.quantity}</Text>
                                        <Text className="w-1/3 text-xs text-right text-gray-600">€{item.totalPrice?.toFixed(2)}</Text>
                                    </View>
                                ))}
                            
                                {receipt.items.length > 2 && (
                                    <Text className="text-xs text-primary-250 mt-1">
                                    + {receipt.items.length - 2} more
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity> 
                    ))
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!selectedReceipt}
                    onRequestClose={() => setSelectedReceipt(null)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50 px-5">
                        <View className="bg-white w-full rounded-2xl p-5">
                            <Text className="text-xl font-bold mb-2">{selectedReceipt?.store || "Receipt"}</Text>
                            <Text className="text-sm text-gray-500 mb-2">Date: {selectedReceipt ? new Date(selectedReceipt.date).toLocaleDateString() : ""}</Text>

                            <View className="mb-3 border-b border-gray-200">
                                {/* Header Row */}
                                <View className="flex-row border-b border-gray-200 pb-1 mb-1">
                                    <Text className="w-1/3 font-semibold">Name</Text>
                                    <Text className="w-1/6 font-semibold text-right">Unit</Text>
                                    <Text className="w-1/6 font-semibold text-right">Qty</Text>
                                    <Text className="w-1/3 font-semibold text-right">Price</Text>
                                </View>

                                {/* Item Rows */}
                                {selectedReceipt?.items.map((item, i) => (
                                    <View key={i} className="flex-row py-1">
                                        <Text className="w-1/3 text-gray-700">{item.name}</Text>
                                        <Text className="w-1/6 text-right text-gray-700">€{item.unitPrice?.toFixed(2)}</Text>
                                        <Text className="w-1/6 text-right text-gray-700">{item.quantity}</Text>
                                        <Text className="w-1/3 text-right text-gray-700">€{item.totalPrice?.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text className="text-gray-800 text-right mb-2">Total: €{selectedReceipt?.totalAmount.toFixed(2)}</Text>
                            <Text className="text-sm text-gray-500 mb-1">Payment: {selectedReceipt?.paymentMethod}</Text>

                            {selectedReceipt?.note && (
                                <Text className="text-xs text-gray-400 italic mb-2">Note: {selectedReceipt.note}</Text>
                            )}

                            {selectedReceipt?.tags && selectedReceipt.tags.length > 0 && (
                                <Text className="text-xs text-gray-500 mb-2">
                                    Tags: {selectedReceipt.tags.join(", ")}
                                </Text>
                            )}

                            <Pressable
                                className="mt-3 bg-primary-250 px-4 py-2 rounded-xl"
                                onPress={() => setSelectedReceipt(null)}
                            >
                                <Text className="text-white text-center font-semibold">Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
        </SafeAreaProvider>
        
    );
};

export default History;
