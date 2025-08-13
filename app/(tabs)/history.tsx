import FilterMenu, { FilterOptions } from "@/components/FilterMenu";
import ReceiptModal from '@/components/ReceiptModal';
import SortButton, { SortOption } from "@/components/SortMenu";
import { getMyReceipts } from "@/services/receiptsService";
import { Receipt } from "@/types/receipt";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 5;

const History = () => {
    const router = useRouter();
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>("recent");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isEditing, setIsEditing] = useState(false);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        storeName: "",
        minPrice: "",
        maxPrice: "",
        paymentMethod: "",
        startDate: null,
        endDate: null,
    });

    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
        const fetchReceipts = async () => {
            try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                router.replace("/sign-in");
            } else {
                const data = await getMyReceipts(token);
                setReceipts(data);
                setVisibleCount(PAGE_SIZE);
            }
            } catch (error) {
            Alert.alert("Error", "Failed to load receipts data.");
            }
        };

        fetchReceipts();
        }, [])
    );

    const getFilteredReceipts = () => {
        return receipts.filter((receipt) => {
            if (
                filterOptions.storeName &&
                !receipt.store?.toLowerCase().includes(filterOptions.storeName.toLowerCase())
            ) return false;

            if (
                filterOptions.paymentMethod &&
                receipt.paymentMethod !== filterOptions.paymentMethod
            ) return false;

            const min = parseFloat(filterOptions.minPrice);
            const max = parseFloat(filterOptions.maxPrice);
            if (!isNaN(min) && (receipt.totalAmount ?? 0) < min) return false;
            if (!isNaN(max) && (receipt.totalAmount ?? 0) > max) return false;

            const receiptDate = new Date(receipt.date);
            if (filterOptions.startDate && receiptDate < filterOptions.startDate) return false;
            if (filterOptions.endDate && receiptDate > filterOptions.endDate) return false;

            return true;
        });
    };

    const getSortedReceipts = () => {
        const filtered = getFilteredReceipts();
        const sorted = [...filtered];
        sorted.sort((a, b) => {
        let valA: number = 0;
        let valB: number = 0;

        switch (sortOption) {
            case "recent":
            valA = new Date(a.createdAt!).getTime();
            valB = new Date(b.createdAt!).getTime();
            break;
            case "date":
            valA = new Date(a.date).getTime();
            valB = new Date(b.date).getTime();
            break;
            case "total":
            valA = a.totalAmount ?? 0;
            valB = b.totalAmount ?? 0;
            break;
        }
        return sortDirection === "asc" ? valA - valB : valB - valA;
        });
        return sorted;
    };

    const displayedReceipts = getSortedReceipts().slice(0, visibleCount);

    const loadMore = () => {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, receipts.length));
    };

    const openFilterModal = () => {
        setModalVisible(true);
    };

    const applyFilters = (filters: FilterOptions) => {
        setFilterOptions(filters);
        setVisibleCount(PAGE_SIZE);
        setModalVisible(false);
    };

    const cancelFilters = () => {
        setModalVisible(false);
    };

    const openReceiptModal = (receipt: Receipt) => {
        setSelectedReceipt(receipt);
        setIsEditing(false);
    };
    
    const closeModals = () => {
        setSelectedReceipt(null);
        setIsEditing(false);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className='flex-1 bg-primary-10'>
                {receipts.length === 0 ? (
                    <View className="flex-1 px-5">
                        <View className="bg-primary-50 rounded-xl shadow-sm mb-5">
                        <Text className="text-2xl text-center font-bold my-5 text-purple-900 uppercase">History</Text>
                        </View>
                        <View className="flex-1 justify-center items-center gap-7 mb-10">
                        <Ionicons name="receipt-outline" size={74} color="#6b7280" />
                        <Text className="text-2xl text-primary-700 font-semibold">No Receipts Available</Text>
                        <Text className="text-base text-gray-600 text-center">You haven't added any receipts yet. Once you start scanning, your receipt history will appear here for easy access and review.</Text>
                        <View className='bg-primary-200 px-6 py-3 rounded-full shadow-sm'>
                            <TouchableOpacity onPress={()=>router.push('/scan')} className="flex-row gap-2 items-center">
                            <Text className="text-white text-xl uppercase font-bold">Start Creating</Text>
                            <SimpleLineIcons name="note" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                ) : (
                    <ScrollView className="px-5">
                        <View className="bg-primary-50 rounded-xl shadow-sm mb-5">
                            <Text className="text-2xl text-center font-bold my-5 text-purple-900 uppercase">History</Text>
                        </View>
                        <View className="flex-row items-center justify-between mb-1">
                            <SortButton
                                sortOption={sortOption}
                                sortDirection={sortDirection}
                                setSortOption={setSortOption}
                                setSortDirection={setSortDirection}
                            />
                            <TouchableOpacity onPress={openFilterModal} className="bg-primary-300 px-4 py-2 rounded-full w-32 mb-2">
                                <Text className="text-white text-center font-semibold">Filter</Text>
                            </TouchableOpacity>
                        </View>
                        {displayedReceipts.map((receipt, index) => (
                            <TouchableOpacity
                                key={receipt._id || index}
                                onPress={() => openReceiptModal(receipt)}
                                className="bg-white rounded-2xl p-4 mb-5 shadow-sm"
                            >
                                <Text className="text-lg font-semibold mb-1">Store: {receipt.store || "Unknown"}</Text>
                                <Text className="text-sm text-gray-500 mb-1">
                                    Date: {new Date(receipt.date).toLocaleDateString()}
                                </Text>
                                <Text className="text-sm text-gray-700 mb-2">
                                    Total: €{receipt.totalAmount?.toFixed(2)}
                                </Text>
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
                                            <Text className="w-1/6 text-xs text-right text-gray-600">
                                            €{item.unitPrice?.toFixed(2)}
                                            </Text>
                                            <Text className="w-1/6 text-xs text-right text-gray-600">{item.quantity}</Text>
                                            <Text className="w-1/3 text-xs text-right text-gray-600">
                                            €{item.totalPrice?.toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                    {receipt.items.length > 2 && (
                                        <Text className="text-xs text-gray-400">
                                            + {receipt.items.length - 2} more items...
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}

                        {visibleCount < getSortedReceipts().length && (
                            <TouchableOpacity onPress={loadMore} className="bg-primary-250 py-2 rounded-full mb-10">
                                <Text className="text-center text-white font-semibold">Load More</Text>
                            </TouchableOpacity>
                        )}

                        {/* Modal for Filter Menu */}
                        <Modal visible={modalVisible} animationType="slide" transparent>
                            <Pressable
                                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
                                onPress={cancelFilters}
                            >
                                <View className="mt-auto bg-white rounded-t-2xl p-5 max-h-[80%]">
                                    <FilterMenu
                                        initialFilters={filterOptions}
                                        onApply={applyFilters}
                                        onCancel={cancelFilters}
                                    />
                                </View>
                            </Pressable>
                        </Modal>

                        {selectedReceipt && !isEditing && (
                            <ReceiptModal
                                receipt={selectedReceipt}
                                onClose={closeModals}
                            />
                        )}

                    </ScrollView>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default History;
