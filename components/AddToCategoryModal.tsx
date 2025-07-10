import { getMyProfile } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface CategoryModalProps {
    itemCategories: { [key: number]: string[] };
    setItemCategories: React.Dispatch<React.SetStateAction<{ [key: number]: string[] }>>;
    selectedItemIndex: number;
    onDone: () => void;
}

const AddToCategoryModal: React.FC<CategoryModalProps> = ({  itemCategories, setItemCategories, selectedItemIndex, onDone }) =>  {
    const [categoryInput, setCategoryInput] = useState<string>('');
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
    }, []);

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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onDone}
        >
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50">
                <View className="w-11/12 max-h-[71%] bg-white rounded-2xl p-4">
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

                    <Pressable onPress={onDone} className="mt-4 bg-primary-250 px-4 py-2 rounded-xl">
                        <Text className="text-white text-center font-semibold">Done</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default AddToCategoryModal;
