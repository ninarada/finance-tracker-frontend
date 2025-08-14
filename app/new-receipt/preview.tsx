import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const PreviewReceipt = () => {
    const router = useRouter();
    const { data } = useLocalSearchParams();
    const parsedData = JSON.parse(data as string);
    const receipt = {
        store: parsedData.store || "",
        date: new Date(parsedData.date).toLocaleDateString("en-GB") || "",
        items: parsedData.items || [],
        totalAmount: parsedData.totalAmount,
        paymentMethod: parsedData.paymentMethod || "Other",
        note: parsedData.note || "",
        tags: parsedData.tags || [],
    }

    return (
        <View className='flex-1 pt-12 bg-black/50'>
        <View className='flex-1 justify-between'>
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 px-4 py-2">
                <FontAwesome size={20} name="arrow-left" color="#cbd5e1"/>
                <Text className="text-slate-300 font-bold text-xl">back</Text>
            </Pressable>
            <View className="flex-1 justify-center">
                <View className="items-center">
                    <Text className="font-bold text-2xl text-slate-200 italic">Scanned Receipt Preview</Text>
                </View>
                <View className="px-8 pt-5 pb-10 justify-center border border-slate-400 rounded-3xl m-5 bg-background-light">
                    <Text className="text-xl font-bold mb-3 ">{receipt.store || "Receipt"}</Text>
                    <Text className="text-sm text-gray-700 mb-4">Date: {receipt.date}</Text>
                    {receipt.items.length > 0 && (
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
                                    {receipt.items.map((item:any, i:any) => (
                                        <View key={i} className="py-2 border-t border-slate-200">
                                            <View className="flex-row pb-1 ">
                                                <Text className="w-1/3 text-gray-700">{item.name}</Text>
                                                <Text className="w-1/6 text-right text-gray-700">€{item.unitPrice}</Text>
                                                <Text className="w-1/6 text-right text-gray-700">{item.quantity}</Text>
                                                <Text className="w-1/3 text-right text-gray-700">€{item.totalPrice}</Text>
                                            </View>
                                            {item.categories && item.categories.length > 0 && (
                                                <View className="flex-row flex-wrap gap-1 px-2">
                                                    {item.categories.map((category:any, i:any) => (
                                                        <View key={i} className="bg-purple-100 px-2 py-1 rounded-2xl">
                                                            <Text className="text-purple-900 font-medium text-xs">{category}</Text>
                                                        </View>
                                                    ))}
                                                </View>
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
                    <Pressable onPress={() => router.back()} className="mt-3 bg-primary-250 px-4 py-2 rounded-xl">
                        <Text className="text-white text-center font-semibold">Okay</Text>
                    </Pressable>
                </View>
            </View>
            <View className="py-5"></View>
        </View>
        </View>
    );
};

export default PreviewReceipt;
