import { getMyProfile } from "@/services/userService";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "../buttons/PrimaryButton";

// interface CategoryModalProps {
//     itemCategories: { [key: number]: string[] };
//     setItemCategories: React.Dispatch<React.SetStateAction<{ [key: number]: string[] }>>;
//     selectedItemIndex: number;
//     onDone: () => void;
// }

interface CategoryModalProps {
  initialCategories: string[];
  onDone: (categories: string[]) => void;
  onCancel: () => void;
}

const AddToCategoryModal: React.FC<CategoryModalProps> = ({  initialCategories, onDone, onCancel, }) =>  {
    const [categoryInput, setCategoryInput] = useState<string>('');
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories ?? []);

    useEffect(() => { setSelectedCategories(initialCategories ?? []); }, [initialCategories]);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getMyProfile();
                setAvailableCategories(profile.categories);
            } catch (error) {
                Alert.alert("Error", "Failed to load profile data.");
            }
        };
        fetchUserProfile();
    }, []);

    const filteredCategories = useMemo(() => {
        return categoryInput.trim()
          ? availableCategories.filter((cat) =>
              cat.toLowerCase().startsWith(categoryInput.trim().toLowerCase())
            )
          : availableCategories;
    }, [categoryInput, availableCategories]);

    const norm = (s: string) => s.trim().toLowerCase();

    const handleAddNewCategory = () => {
        const raw = categoryInput.trim();
        if (!raw) return;

        const existsInAvailable = availableCategories.some((c) => norm(c) === norm(raw));
        const existsInSelected = selectedCategories.some((c) => norm(c) === norm(raw));

        if (!existsInAvailable) {
            setAvailableCategories((prev) => [...prev, raw]);
          }
          if (!existsInSelected) {
            setSelectedCategories((prev) => [...prev, raw]);
          }
          setCategoryInput("");

        // if (categoryInput.trim() && selectedItemIndex !== null) {
        //   const newCat = categoryInput.trim();
        //   setAvailableCategories((prev) =>
        //     prev.includes(newCat) ? prev : [...prev, newCat]
        //   );
        //   setItemCategories((prev) => ({
        //     ...prev,
        //     [selectedItemIndex]: [...(prev[selectedItemIndex] || []), newCat],
        //   }));
        //   setCategoryInput('');
        // }
    };

    const handleToggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
          prev.some((c) => norm(c) === norm(category))
            ? prev.filter((c) => norm(c) !== norm(category))
            : [...prev, category]
        );
    };

    // const handleToggleCategory = (category: string, selected: boolean) => {
    //     if (selectedItemIndex === null) return;
      
    //     setItemCategories((prev) => {
    //       const existing = prev[selectedItemIndex] || [];
    //       const updated = selected
    //         ? existing.filter((cat) => cat !== category)
    //         : [...existing, category];
    //       return { ...prev, [selectedItemIndex]: updated };
    //     });
    // };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={onCancel}
        >
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50">
                <View className="w-11/12 max-h-[71%] bg-white rounded-2xl p-4">
                    <Text className="text-xl font-semibold mb-6 text-center text-primary-700">Choose or Create Categories</Text>
                    <View className="flex-row items-center gap-2 my-4 mb-5">
                        <TextInput
                            placeholder="New category"
                            className="flex-1 border border-gray-300 px-3 py-3 rounded-2xl text-md"
                            value={categoryInput}
                            onChangeText={setCategoryInput}
                        />
                    </View>
                    {categoryInput.trim() && !availableCategories.some(
                        (cat) => cat.toLowerCase() === categoryInput.trim().toLowerCase()
                    ) && (
                            // <Pressable onPress={handleAddNewCategory} className="bg-primary-50 px-3 py-2 rounded-2xl mb-2 border border-primary-300">
                            //     <Text className="text-primary-300 italic">+ Create "{categoryInput.trim()}"</Text>
                            // </Pressable>
                        <View className="flex-row justify-center mb-4">
                            <PrimaryButton title={`+ Create ${categoryInput.trim()}`} onPress={handleAddNewCategory} fontSize="text-md"/>
                        </View>
                    )}
                    {filteredCategories.length > 0 ? (
                        <Text className="text-slate-500 mb-2 italic">Your existing categories:</Text>
                    ) : (
                        <Text className="text-slate-500 mb-2 italic">No matching categories</Text>
                    )}
                    <ScrollView className="mb-3">
                        {filteredCategories.map((category, index) => {
                            const selected = selectedCategories.some((c) => norm(c) === norm(category));
                            return (
                                <Pressable key={index} onPress={() => handleToggleCategory(category)} className={`px-4 py-2 rounded-full mb-2 ${selected ? "bg-primary-100" : "bg-primary-50" }`}>
                                    <Text className="text-gray-700">{category}</Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <PrimaryButton title="Done" onPress={() => onDone(selectedCategories)}/>
                </View>
            </View>
        </Modal>
    );
};

export default AddToCategoryModal;
