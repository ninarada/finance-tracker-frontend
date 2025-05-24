import { createReceipt } from '@/services/receiptsService';
import { CreateReceipt, ReceiptItem } from '@/types/receipt';
import { convertParsedReceiptToMongooseFormat } from '@/utils/convertParsedReceiptToMongooseFormat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const itemInitial: ReceiptItem = {
  name: "",
  unitPrice: 0,
  quantity: 0,
  totalPrice: 0,
}

const receiptInitial: CreateReceipt  = {
  items: [],
  note: "",
  paymentMethod: undefined,
  tags: [],
  store: "",
  date: "",
}

const AddNewReceipt = () => {
    const router = useRouter();
    const { data, mode } = useLocalSearchParams();
    const parsedReceipt = data ? convertParsedReceiptToMongooseFormat(JSON.parse(data as string)) : null;
    const [newReceipt, setNewReceipt] = useState<CreateReceipt>(parsedReceipt || receiptInitial);
    const [totalAmountReceipt, setTotalAmountReceipt] = useState(0);
    const [newItem, setNewItem] = useState<ReceiptItem>(itemInitial);
    const [addNewItemOpen, setAddNewItemOpen] = useState(false);

    const [showPicker, setShowPicker] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());


  const handleAddItem = () => {
    const { name, unitPrice, quantity, totalPrice } = newItem;
  
    if (!name.trim()) {
      alert("Input item name.");
      return;
    }
    if (unitPrice <= 0 || quantity <= 0) {
      alert("Input positive price and quantity.");
      return;
    }
    
    const itemToAdd: ReceiptItem = {
      ...newItem,
      totalPrice: unitPrice * quantity,
    };
    const updatedItems = [...(newReceipt.items || []), itemToAdd];
    const updatedTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
    setNewReceipt({ ...newReceipt, items: updatedItems, });
    setTotalAmountReceipt(updatedTotalAmount);
    setNewItem(itemInitial);
    setAddNewItemOpen(false);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = newReceipt.items.filter((_, i) => i !== index);
    const updatedTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setNewReceipt({ ...newReceipt, items: updatedItems, });
    setTotalAmountReceipt(updatedTotalAmount);
  };

  const handleSaveReceipt = async() => {
    if (!newReceipt.store?.trim()) {
      alert("Input store name");
      return;
    }

    if(newReceipt.items.length < 1) {
      alert("Input at least one item.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if(token && newReceipt.store && newReceipt.items.length>0) {
        const response = await createReceipt(token, newReceipt);
        console.log("Response:", response);
      }
    } catch (error) {
      Alert.alert('Creating new receipt failed', 'Something went wrong. Please try again.');
    }

    setNewReceipt(receiptInitial);
    router.back();
  }

  return (
    <View className='flex-1 pt-12 bg-black/50'>
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-2 px-4 py-2">
                        <FontAwesome size={20} name="arrow-left" color="#cbd5e1"/>
                        <Text className="text-slate-300 font-bold text-xl">back</Text>
                     </Pressable>
        <View className="flex-grow justify-center">
            <View className="justify-center border border-slate-400 rounded-3xl m-5 bg-background-light">
                <View className='px-6 pb-4'>
                    <Text className="text-2xl font-bold mt-2 mb-6 text-slate-700 self-center">New Receipt</Text>
           
                    {/* Store Name */}
                    <TextInput 
                        className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                        placeholder="Store Name"
                        value={newReceipt?.store}
                        onChangeText={(text) => setNewReceipt({ ...newReceipt, store: text })}
                    />

                    {/* Date */}
                    <Pressable onPress={() => setShowDatePicker(true)} className="border border-gray-300 rounded-xl px-4 py-2 mb-3">
                        <Text className="text-gray-700">{newReceipt.date ? new Date(newReceipt.date).toLocaleDateString() : "Select Date"}</Text>
                    </Pressable>
                    {showDatePicker && (
                            <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            maximumDate={new Date()}
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) {
                                setSelectedDate(date);
                                const formatted = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
                                setNewReceipt({ ...newReceipt, date: formatted });
                                }
                            }}
                            />
                    )}

                    {/* Items */}
                    <View className="flex-row pb-1 mt-4 mb-1">
                        <Text className="w-1/3 italic font-semibold">Items:</Text>
                    </View>
                    {newReceipt.items.length > 0 && (
                            <View className="flex-row pt-1 px-3 border-b border-gray-200 pb-1 mb-1 justify-center items-center">
                            <Text className="w-1/3 font-semibold text-sm text-slate-600">Name</Text>
                            <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right  pr-2">Unit</Text>
                            <Text className="w-2/12 font-semibold text-sm text-slate-600 text-right  pr-2">Qty</Text>
                            <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right  pr-2">Price</Text>
                            <Text className="w-1/12 font-semibold text-sm text-slate-600 text-right  pr-2"> </Text>
                            </View>
                    )}

                    <View style={{ maxHeight: newReceipt.items.length > 5 ? 150 : undefined }}>
                        <ScrollView nestedScrollEnabled={true} scrollEnabled={newReceipt.items.length > 5}>
                            {newReceipt.items.map((item, i) => (
                                <View key={i} className="flex-row pt-1 px-4 justify-center items-center pb-2">                                    
                                    <Text className="w-1/3 text-gray-700">{item.name}</Text>
                                    <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${item.unitPrice?.toFixed(2)}`}</Text>
                                    <Text className="w-2/12 text-right text-gray-700 pr-2">{item.quantity}</Text>
                                    <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${item.totalPrice?.toFixed(2)}`}</Text>
                                    <Pressable onPress={() => handleDeleteItem(i)} className="w-1/12">
                                        <FontAwesome name="close" size={18} color="#6b7280" />
                                    </Pressable>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {!addNewItemOpen && (
                            <View className="flex-row justify-center my-2 border-t pt-3 border-gray-200 ">
                            <Pressable onPress={()=> setAddNewItemOpen(true)} className="bg-primary-50 text-primary-50 rounded-3xl px-4 py-2">
                                <FontAwesome name="plus" size={16} color="#8184e6" />
                            </Pressable>
                            </View>
                    ) }

                    <Modal
                        visible={addNewItemOpen}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setAddNewItemOpen(false)}
                    >
                    <View className="flex-1 justify-center items-center bg-black/60 px-5">
                        <View className="bg-white w-11/12 rounded-2xl p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-800">Add New Item</Text>
                            <Pressable onPress={() => setAddNewItemOpen(false)}>
                                <FontAwesome name="close" size={20} color="#6b7280" />
                            </Pressable>
                        </View>

                        <View className="mb-3">
                            <Text className="text-sm text-gray-600 mb-1">Name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-2"
                                placeholder="Item Name"
                                value={newItem.name}
                                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                            />
                        </View>
                        <View className="mb-3">
                            <Text className="text-sm text-gray-600 mb-1">Unit Price</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-2 text-right"
                                keyboardType="numeric"
                                placeholder="Unit Price"
                                value={newItem.unitPrice?.toString() ?? ""}
                                onChangeText={(text) =>
                                    setNewItem({ ...newItem, unitPrice: parseFloat(text.replace(',', '.')) || 0 })
                                }
                            />
                        </View>
                        <View className="mb-3">
                            <Text className="text-sm text-gray-600 mb-1">Quantity</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-2 text-right"
                                keyboardType="numeric"
                                placeholder="Quantity"
                                value={newItem.quantity?.toString() ?? ""}
                                onChangeText={(text) =>
                                    setNewItem({ ...newItem, quantity: parseFloat(text.replace(',', '.')) || 0 })
                                }
                            />
                        </View>

                        <Pressable
                            onPress={handleAddItem}
                            className="bg-primary-200 py-2 rounded-2xl items-center mt-4"
                        >
                            <Text className="text-white font-semibold">Add Item</Text>
                        </Pressable>
                        </View>
                    </View>
                    </Modal>


                    {/* Total Amount */}
                    <View className="items-end mb-4">
                            <Text className="font-bold">Total:  {Number(totalAmountReceipt).toFixed(2)}€</Text>
                    </View>

                    {/* Payment Method */}
                    <Pressable onPress={() => setShowPicker(true)} className="border border-gray-300 rounded-xl px-4 py-2 mb-3" >
                            <Text className="text-gray-700">{newReceipt.paymentMethod || "Select Payment Method"}</Text>
                    </Pressable>
                    {showPicker && (
                            <View className="border border-gray-300 rounded-xl mb-3">
                            <Picker
                                selectedValue={newReceipt.paymentMethod}
                                onValueChange={(value) => {
                                setNewReceipt({ ...newReceipt, paymentMethod: value });
                                setShowPicker(false); 
                                }}
                            >
                                <Picker.Item label="Select Payment Method..." value="" />
                                <Picker.Item label="Cash" value="Cash" />
                                <Picker.Item label="Card" value="Card" />
                                <Picker.Item label="Mobile" value="Mobile" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                            </View>
                    )}

                    {/* Note */}
                    <TextInput 
                        className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                            placeholder="Note"
                            value={newReceipt?.note}
                        onChangeText={(text) => setNewReceipt({ ...newReceipt, note: text })}
                    />

                    {/* Tags */}
                        <View className="flex-row items-center mb-3">
                            <TextInput
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 mr-2"
                            placeholder="Add a tag"
                            value={tagInput}
                            onChangeText={setTagInput}
                            onSubmitEditing={() => {
                                if (tagInput.trim()) {
                                setNewReceipt({
                                    ...newReceipt,
                                    tags: [...(newReceipt.tags || []), tagInput.trim()],
                                });
                                setTagInput("");
                                }
                            }}
                            />
                            <Pressable className="bg-primary-100 px-4 py-2 rounded-xl" onPress={() => {
                            if (tagInput.trim()) {
                                setNewReceipt({
                                ...newReceipt,
                                tags: [...(newReceipt.tags || []), tagInput.trim()],
                                });
                                setTagInput("");
                            }}}
                            >
                            <Text className="text-white font-bold">Add</Text>
                            </Pressable>
                        </View>
                        
                        {Array.isArray(newReceipt.tags) &&  newReceipt.tags?.length > 0  && (
                            <ScrollView horizontal className="mb-3 flex-row gap-2">
                            {newReceipt.tags.map((tag, index) => (
                                <View key={index} className="bg-gray-200 px-3 py-1 rounded-full flex-row items-center" >
                                <Text className="mr-2 text-sm text-gray-700">{tag}</Text>
                                <Pressable onPress={() => { setNewReceipt({ ...newReceipt, tags: newReceipt.tags!.filter((_, i) => i !== index),}); }}>
                                    <Text className="text-red-500 font-bold text-sm">x</Text>
                                </Pressable>
                                </View>
                            ))}
                            </ScrollView>
                        )}
                    </View>
                    <View className="flex-row justify-center mt-2 mb-4">
                        <Pressable onPress={handleSaveReceipt} className="bg-primary-200 px-4 py-2 rounded-3xl">
                            <Text className="text-white font-bold text-lg">Save</Text>
                        </Pressable>
                    </View>
            </View>
        </View>
        <View className="py-5"></View>
    </View>
  );
};

export default AddNewReceipt;