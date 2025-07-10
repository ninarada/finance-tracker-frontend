import NewCategoryModal from '@/components/newCategoryModal';
import { createCategory } from '@/services/receiptsService';
import { getMyProfile } from '@/services/userService';
import { CategoryStats, fetchCategoryStatsByName } from '@/utils/categoryStats';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const AllCategories = () => {
    const router = useRouter();
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState<"name" | "total">("total");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
      
    // useEffect(() => {
    //     const fetchCategoriesAndStats = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         if (!token) {
    //             router.replace('/sign-in');
    //             return;
    //         }
    //         const profile = await getMyProfile(token);
    //         const categories = profile.categories || [];
    //         const statsPromises = categories.map((category: string) =>fetchCategoryStatsByName(token, category));
    //         const statsResults = await Promise.all(statsPromises);
    //         setCategoryStats(statsResults);
    //     } catch (error) {
    //         Alert.alert('Error', 'Failed to load categories and stats.');
    //     } finally {
    //         setLoading(false);
    //     }
    //     };
    //     fetchCategoriesAndStats();
    // }, []);
    
    const fetchCategoriesAndStats = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            router.replace('/sign-in');
            return;
          }
          const profile = await getMyProfile(token);
          const categories = profile.categories || [];
          const statsPromises = categories.map((category: string) =>
            fetchCategoryStatsByName(token, category)
          );
          const statsResults = await Promise.all(statsPromises);
          setCategoryStats(statsResults);
        } catch (error) {
          Alert.alert('Error', 'Failed to load categories and stats.');
        } finally {
          setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
          fetchCategoriesAndStats();
        }, [])
    );

    const handleCategoryPress = (name: string) => {
        router.push({
        pathname: '/categoryOverview',
        params: { name },
        });
    };

    const sortedCategoryStats = [...categoryStats].sort((a, b) => {
        if (sortOption === "total") {
          return sortDirection === "asc"
            ? a.totalSpent - b.totalSpent
            : b.totalSpent - a.totalSpent;
        }
        // sortOption === "name"
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
    });
    
    const openSortMenu = () => {
        setSortMenuVisible(true);
    };
    
    const onSelectSortOption = (option: 'name' | 'total', direction: 'asc' | 'desc') => {
        setSortOption(option);
        setSortDirection(direction);
        setSortMenuVisible(false);
    };

    const handleCreateCategory = async (name: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              router.replace("/sign-in");
              return;
            } 
            const data = await createCategory(token, name);
            const newCategoryStats = await fetchCategoryStatsByName(token, name);
            setCategoryStats(prev => [...prev, newCategoryStats]);
            setNewCategoryModalVisible(false);
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
    }

    return (
        <SafeAreaProvider>
        <SafeAreaView className="flex-1">
            <ScrollView className="p-4">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 mb-2">
                    <FontAwesome size={20} name="arrow-left" color="#64748b" />
                    <Text className="text-slate-500 font-medium text-xl">Back</Text>
                </Pressable>

                <View className="flex-1 items-center">
                    <Text className="text-2xl font-bold mb-3 text-purple-900">Categories</Text>
                </View>

                <View className='flex-row mt-2 mb-4 justify-between'>
                    <TouchableOpacity
                        onPress={openSortMenu}
                        className="bg-primary-200 px-10 py-2 rounded-full"
                    >
                        <Text className="text-white font-semibold text-center">Sort</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setNewCategoryModalVisible(true)}
                        className="bg-primary-50 px-10 py-2 rounded-full"
                    >
                        <Text className="text-primary-250 font-semibold text-center">Add New +</Text>
                    </TouchableOpacity>
                </View>
                
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <Text>Loading categories...</Text>
                    </View>
                ) : categoryStats.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-500">No categories available.</Text>
                    </View>
                ) : (
                    <View className="flex-col gap-4">
                        {sortedCategoryStats.map(({ name, totalSpent, mostPopularStore }) => (
                            <TouchableOpacity
                                key={name}
                                onPress={() => handleCategoryPress(name)}
                                className="bg-white rounded-2xl p-4 mb-5 shadow"
                            >
                                <Text className="text-slate-700 font-bold text-lg mb-1">{name}</Text>
                                <Text className="text-sm text-gray-700">Total spent: €{totalSpent.toFixed(2)}</Text>
                                <Text className="text-sm text-gray-700">Most popular store: {mostPopularStore || 'N/A'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
            )}

        <Modal
            transparent
            visible={sortMenuVisible}
            animationType="fade"
            onRequestClose={() => setSortMenuVisible(false)}
        >
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setSortMenuVisible(false)}>
                <View className="absolute bg-white rounded-xl py-2 w-[220px] shadow-lg mt-52 ml-3">
                    {[
                    { label: 'Name (A → Z)', option: 'name', direction: 'asc' },
                    { label: 'Name (Z → A)', option: 'name', direction: 'desc' },
                    { label: 'Total Spent (Low → High)', option: 'total', direction: 'asc' },
                    { label: 'Total Spent (High → Low)', option: 'total', direction: 'desc' },
                    ].map(({ label, option, direction }) => {
                        const isActive = sortOption === option && sortDirection === direction;
                        return (
                            <TouchableOpacity
                            key={label}
                            onPress={() => onSelectSortOption(option as 'name' | 'total', direction as 'asc' | 'desc')}
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
          <NewCategoryModal 
            visible={newCategoryModalVisible}
            onClose={() => setNewCategoryModalVisible(false)}
            onCreate={handleCreateCategory}
          />
            </ScrollView>
        </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AllCategories;
