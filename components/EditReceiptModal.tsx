import { PaymentMethod, Receipt } from "@/types/receipt";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AddToCategoryModal from "./AddToCategoryModal";

interface EditReceiptModalProps {
  receipt: Receipt | null;
  onClose: () => void;
  onSave: (updatedReceipt: Receipt) => void;
}

const paymentMethods: PaymentMethod[] = ["Cash", "Card", "Mobile", "Other"]; 

const ItemListHeader = () => (
    <View className="flex-row pt-1 px-4 border-b border-gray-200 pb-1 mb-1 justify-center items-center">
        <Text className="w-1/3 font-semibold text-sm text-slate-600">Name</Text>
        <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right pr-2">Unit</Text>
        <Text className="w-2/12 font-semibold text-sm text-slate-600 text-right pr-2">Qty</Text>
        <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right pr-2">Price</Text>
        <Text className="w-1/12 font-semibold text-sm text-slate-600 text-right pr-2"> </Text>
    </View>
);

const EditReceiptModal: React.FC<EditReceiptModalProps> = ({ receipt, onClose, onSave }) => {
    if (!receipt) return null;

    const [editedReceipt, setEditedReceipt] = useState(receipt);
    const [store, setStore] = useState(receipt?.store || "");
    const [date, setDate] = useState(new Date(receipt.date));
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(receipt?.paymentMethod);
    const [note, setNote] = useState(receipt?.note || "");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [itemCategories, setItemCategories] = useState<{ [key: number]: string[] }>({});
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [addNewItemOpen, setAddNewItemOpen] = useState(false);

    const handleSave = () => {
        if (!store.trim()) {
            Alert.alert("Validation", "Store name cannot be empty.");
            return;
        }
        if (!paymentMethod) {
            Alert.alert("Validation", "Please select a payment method.");
            return;
        }

        const updatedReceipt: Receipt = {
            ...receipt!,
            store: store.trim(),
            date: new Date(date).toISOString(),
            paymentMethod,
            note: note.trim(),
        };

        onSave(updatedReceipt);
        onClose();
    };

    const onChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false); 
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleAddToCategory = (i: React.SetStateAction<number | null>) => {
        setSelectedItemIndex(i);
        setAddCategoryModalVisible(true);
    }

    const ItemList = () => (
        <View className="mb-4">
            {receipt.items.map((item, i) => (
                <View key={i} className="py-2 ">
                    <View className="flex-row pt-1 px-4 justify-center items-center pb-2">                                    
                        <Text className="w-1/3 text-gray-700">{item.name}</Text>
                        <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${item.unitPrice?.toFixed(2)}`}</Text>
                        <Text className="w-2/12 text-right text-gray-700 pr-2">{item.quantity}</Text>
                        <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${item.totalPrice?.toFixed(2)}`}</Text>
                        <Pressable className="w-1/12">
                            <FontAwesome name="close" size={18} color="#6b7280" />
                        </Pressable>
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
            
        </View>
    )

    const TagsList = () => (
        <>
        <View className="flex-row items-center mb-3">
            <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-2 py-2 mr-2"
                placeholder="Add a tag"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={() => {
                    if (tagInput.trim()) {
                        setEditedReceipt({
                            ...editedReceipt,
                            tags: [...(editedReceipt.tags || []), tagInput.trim()],
                        });
                        setTagInput("");
                    }
                }}
            />
            
            <Pressable className="bg-primary-100 px-4 py-2 rounded-lg" onPress={() => {
                if (tagInput.trim()) {
                    setEditedReceipt({
                        ...editedReceipt,
                        tags: [...(editedReceipt.tags || []), tagInput.trim()],
                    });
                    setTagInput("");
                }}}
            >
                <Text className="text-white font-bold">Add</Text>
            </Pressable>
        </View>
                        
        {Array.isArray(editedReceipt.tags) &&  editedReceipt.tags?.length > 0  && (
            <ScrollView horizontal className="mb-3 flex-row gap-2">
                {editedReceipt.tags.map((tag, index) => (
                    <View key={index} className="bg-gray-200 px-3 py-1 rounded-full flex-row items-center" >
                        <Text className="mr-2 text-sm text-gray-700">{tag}</Text>
                        <Pressable onPress={() => { setEditedReceipt({ ...editedReceipt, tags: editedReceipt.tags!.filter((_, i) => i !== index),}); }}>
                            <Text className="text-red-500 font-bold text-sm">x</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        )}
        </>
    )

    return (
        <View className="flex-1 justify-center items-center bg-black/50 px-5">
            <View className="bg-white w-full rounded-2xl p-5">
                <ScrollView nestedScrollEnabled={true} scrollEnabled={receipt.items.length > 2}>
                        <Text className="text-xl font-bold mb-4 text-center">Edit Receipt</Text>

                        {/* Store Name */}
                        <Text className="font-semibold mb-2">Store</Text>
                        <TextInput
                            value={store}
                            onChangeText={setStore}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            placeholder="Store Name"
                        />

                        {/* Date */}
                        <Text className="font-semibold mb-2">Date</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                            <Text className="text-gray-700">{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <View>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()} 
                                onChange={onChange}
                            />
                            {Platform.OS === 'ios' && (
                                <Pressable
                                    onPress={() => setShowDatePicker(false)}
                                    className="bg-primary-50 px-4 py-2 mb-3 rounded-2xl"
                                >
                                    <Text className="text-primary-300 text-center">Done</Text>
                                </Pressable>
                            )}
                            </View>
                        )}

                        {/* Payment Method */}
                        <Text className="font-semibold mb-2">Payment Method</Text>
                        <View className="flex-row mb-6">
                            {paymentMethods.map((method) => (
                            <Pressable
                                key={method}
                                onPress={() => setPaymentMethod(method)}
                                className={`px-4 py-2 rounded-full mr-2 ${paymentMethod === method ? "bg-primary-200" : "bg-gray-200"}`}
                            >
                                <Text className={paymentMethod === method ? "text-white" : "text-gray-700"}>
                                {method}
                                </Text>
                            </Pressable>
                            ))}
                        </View>

                        {/* Items */}
                        <Text className="font-semibold mb-2">Items</Text>
                        {receipt.items.length > 0 && (<ItemListHeader />)}
                        <ItemList />
                        {!addNewItemOpen && (
                            <View className="flex-row justify-center my-2 border-t pt-3 border-gray-200 ">
                                <Pressable onPress={()=> setAddNewItemOpen(true)} className="bg-primary-50 text-primary-50 rounded-3xl px-4 py-2">
                                    <FontAwesome name="plus" size={16} color="#8184e6" />
                                </Pressable>
                            </View>
                        )}

                        {/* Tags */}
                        <Text className="font-semibold mb-2">Tags</Text>
                        {receipt?.tags?.length && receipt?.tags?.length > 0 && (
                            <Text className="text-xs text-gray-500 mb-2">
                                Tags: {receipt.tags.join(", ")}
                            </Text>
                        )}
                        <TagsList />

                        {/* Note */}
                        <Text className="font-semibold mb-2">Note</Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            placeholder="Add a note (optional)"
                        />

                        {/* Buttons */}
                        <View className="flex-row justify-between">
                            <TouchableOpacity onPress={onClose} className="bg-gray-300 px-1 py-2 rounded-xl">
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className="bg-primary-250 px-5 py-2 rounded-3xl">
                                <Text className="text-white font-semibold">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                {/* Modal for adding categories */}
                {addCategoryModalVisible && selectedItemIndex !== null && (
                    <AddToCategoryModal
                        itemCategories={itemCategories}
                        setItemCategories={setItemCategories}
                        selectedItemIndex={selectedItemIndex}
                        onDone={() => setAddCategoryModalVisible(false)}
                    />
                )}

        </View>
    );
};

export default EditReceiptModal;
