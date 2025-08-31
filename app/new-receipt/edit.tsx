import AddToCategoryModal from '@/components/modals/AddToCategoryModal';
import { createReceipt, updateReceipt } from '@/services/receiptsService';
import { CreateReceipt, PaymentMethod, ReceiptItem } from '@/types/receipt';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const paymentMethods: PaymentMethod[] = ["Cash", "Card", "Mobile", "Other"]; 

const itemInitial: ReceiptItem = {
    name: "",
    unitPrice: 0,
    quantity: 0,
    totalPrice: 0,
    categories: [],
}

const isPaymentMethod = (v: unknown): v is PaymentMethod => paymentMethods.includes(v as PaymentMethod);

const ItemListHeader = () => (
    <View className="flex-row pt-1 px-4 border-b border-gray-200 pb-1 mb-1 justify-center items-center">
        <Text className="w-1/3 font-semibold text-sm text-slate-600">Name</Text>
        <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right pr-2">Unit</Text>
        <Text className="w-2/12 font-semibold text-sm text-slate-600 text-right pr-2">Qty</Text>
        <Text className="w-3/12 font-semibold text-sm text-slate-600 text-right pr-2">Price</Text>
        <Text className="w-1/12 font-semibold text-sm text-slate-600 text-right pr-2"> </Text>
    </View>
);

const EditReceipt = () => {
    const router = useRouter();
    const { data, mode, receiptId } = useLocalSearchParams();
    const parsedData = JSON.parse(data as string);

    const [store, setStore] = useState(parsedData.store);
    const [date, setDate] = useState<Date | undefined>(parsedData.date ? new Date(parsedData.date) : undefined);
    const [createdAt, setCreatedAt] = useState(mode==='existing' ? new Date(parsedData.createdAt) : undefined);
    const [updatedAt, setUpdatedAt] = useState(mode==='existing' ? new Date(parsedData.updatedAt) : undefined);
    const [totalAmount, setTotalAmount] = useState(parsedData.totalAmount);
    const [items, setItems] = useState(parsedData.items);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isPaymentMethod(parsedData.paymentMethod) ? parsedData.paymentMethod : "Other");
    const [note, setNote] = useState(parsedData.note);
    const [tags, setTags] = useState(parsedData.tags);
    
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [addNewItemOpen, setAddNewItemOpen] = useState(false);
    const [newItem, setNewItem] = useState<ReceiptItem>(itemInitial);
    const [unitPriceInput, setUnitPriceInput] = useState<string>("");
    const [isPickerVisible, setPickerVisible] = useState(false);

    const handleSave = async () => {
        if (store===""){
            Alert.alert("Validation", "Store name cannot be empty.");
            return;
        }
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            Alert.alert("Validation", "Please select a valid date.");
            return;
        }
        if (!items || items.length === 0) {
            Alert.alert("Validation", "Receipt must have at least one item.");
            return;
        }
        for (const [index, item] of items.entries()) {
            if (!item.name.trim()) {
                Alert.alert("Validation", `Item ${index + 1} is missing a name.`);
                return;
            }
            if (item.unitPrice <= 0) {
                Alert.alert("Validation", `Item ${index + 1} has invalid unit price.`);
                return;
            }
            if (item.quantity <= 0) {
                Alert.alert("Validation", `Item ${index + 1} has invalid quantity.`);
                return;
            }
        }
        if (totalAmount <= 0) {
            Alert.alert("Validation", "Total amount must be greater than 0.");
            return;
        }
        if (!isPaymentMethod(paymentMethod)) {
            Alert.alert("Validation", "Invalid payment method.");
            return;
        }

        const receiptData: CreateReceipt = {
            store: store.trim(),
            date: date ? date.toISOString() : undefined,
            items: items ? items : [],
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            note: note ? note : "",
            tags: tags ? tags : [],
        }

        try {
            if(mode==="update") {
                if (!receiptId) {
                    Alert.alert("Error", "Missing receipt ID for update.");
                    return;
                }
                await updateReceipt(receiptId as string, receiptData);
                Alert.alert("Success", "Receipt updated successfully.");
                router.push({
                    pathname: "/history",
                    params: { receiptId },
                });
            } else {
                await createReceipt(receiptData);
                Alert.alert("Success", "Receipt created successfully.");
                router.push({
                    pathname: "/history",
                    params: { receiptId },
                });
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update receipt.");
            console.error(error);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            "Cancel Editing",
            "Are you sure you want to cancel your changes?",
            [
              { text: "No", style: "cancel" },
              {
                text: "Yes",
                onPress: () => {
                  router.replace('/');
                }
              }
            ]
        );
    }

    const handlePreview = () => {
        const receiptData: CreateReceipt = {
            store: store.trim(),
            date: date ? date.toISOString() : undefined,
            items: items ? items : [],
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            note: note ? note : "",
            tags: tags ? tags : [],
        }
        router.push({
            pathname: "/new-receipt/preview",
            params: {
              data: JSON.stringify(receiptData), 
            },
        });
    }

    const handleAddToCategory = (i: number) => {
        setSelectedItemIndex(i);
        setAddCategoryModalVisible(true);
    };

    const ItemList = () => (
        <View>
            {items && items.map((item: any, i:any) => (
                <View key={i} className="py-2 ">
                    <View className="flex-row pt-1 px-4 justify-center items-center pb-2">                                    
                        <Text className="w-1/3 text-gray-700">{item.name}</Text>
                        <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${item.unitPrice?.toFixed(2)}`}</Text>
                        <Text className="w-2/12 text-right text-gray-700 pr-2">{item.quantity}</Text>
                        <Text className="w-3/12 text-right text-gray-700 pr-2">{`€${(parseFloat(String(item.totalPrice ?? 0).replace(',', '.')) || 0).toFixed(2)}`}
                        </Text>
                        <Pressable onPress={() => handleDeleteItem(i)} className="w-1/12">
                            <FontAwesome name="close" size={18} color="#6b7280" />
                        </Pressable>
                    </View>
                    {(item.categories?.length ?? 0) > 0 ? (
                        <View className="flex-row flex-wrap gap-1 px-2">
                            {item.categories!.map((cat: any, idx: any) => (
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
        const updatedItems = [...(items || []), itemToAdd];
        const updatedTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
        setItems(updatedItems);
        setTotalAmount(updatedTotalAmount);
        setNewItem(itemInitial);
        setAddNewItemOpen(false);
      };
    
    const handleDeleteItem = (index: number) => {
        const updatedItems = items?.filter((_:any, i:any) => i !== index);
        const updatedTotalAmount = updatedItems?.reduce((sum:any, item:any) => sum + item.totalPrice, 0);
    
        setItems(updatedItems);
        setTotalAmount(updatedTotalAmount);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className='flex-1'>
                <ScrollView className="px-5">
                    <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
                        <FontAwesome size={15} name="arrow-left" color="#64748b"/>
                        <Text className="text-slate-500 font-medium text-xl">back</Text>
                    </Pressable>
                    {mode==="existing" ? (
                        <View>
                            <Text className="text-2xl mt-3 font-bold mb-2 text-center">Edit Receipt</Text>
                            <View className='items-center mb-6'>
                                <Text className='text-slate-600 text-sm italic'>Created: {createdAt ? createdAt?.toLocaleDateString() : ''}</Text>
                                <Text className='text-slate-600 text-sm italic'>Last updated: {updatedAt ? updatedAt?.toLocaleDateString() : ''}</Text>
                            </View>
                        </View>
                    ) : (
                        <Text className="text-2xl mt-3 font-bold mb-4 text-center">New Receipt</Text>
                    )}
                    {/* Store Name */}
                    <Text className="font-semibold mb-2">Store</Text>
                    <TextInput
                        value={store}
                        onChangeText={setStore}
                        className="border border-gray-300 bg-white rounded-lg p-2 mb-4"
                        placeholder="Store Name"
                    />

                    {/* Date */}
                    <TouchableOpacity onPress={() => setPickerVisible(true)} className="border border-gray-300 bg-white rounded-xl px-4 py-2 mb-6">
                        <Text className="text-gray-700">{date ? date.toLocaleDateString("en-GB") : "Select date"}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isPickerVisible}
                        mode="date"
                        date={date ?? new Date()}
                        maximumDate={new Date()}
                        onConfirm={(picked: Date) => {
                            setDate(new Date(picked.setHours(0,0,0,0))); 
                            setPickerVisible(false)
                        }}
                        onCancel={() => setPickerVisible(false)}
                    />

                    {/* Payment Method */}
                    <View className='bg-white rounded-2xl p-4 shadow mb-6 items-center'>
                        <Text className="font-semibold mb-4 text-center">Payment Method</Text>
                        <View className="flex-row">
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
                    </View>

                    {/* Items */}
                    <View className='bg-white rounded-2xl p-4 shadow mb-6'>
                        <Text className="font-semibold mb-4 text-center">Items</Text>
                        {items && items.length > 0 && (<ItemListHeader />)}
                        <ItemList />
                        {!addNewItemOpen && (
                            <View className="flex-row justify-center my-1 border-t pt-3 border-gray-200 ">
                                <Pressable onPress={()=> setAddNewItemOpen(true)} className="bg-primary-50 text-primary-50 rounded-3xl px-4 py-2">
                                    <FontAwesome name="plus" size={16} color="#8184e6" />
                                </Pressable>
                            </View>
                        )}
                    </View>

                    {/* Total Amount */}
                    <Text className="font-semibold mb-2">Total Amount</Text>
                    <Text className="mb-4 border border-gray-300 rounded-lg p-2 bg-gray-200 text-gray-700">
                        € {(((+String(totalAmount ?? 0).replace(',', '.')) || 0)).toFixed(2)}
                    </Text>

                    {/* Tags */}
                    <Text className="font-semibold mb-2">Tags</Text>
                    <View className="flex-row items-center mb-3">
                        <TextInput
                            className="flex-1 border border-gray-300 bg-white rounded-lg px-2 py-2 mr-2"
                            placeholder="Add a tag"
                            value={tagInput}
                            onChangeText={setTagInput}
                            onSubmitEditing={() => {
                                const normalizedTags = tags?.map((tag:any) => tag.toLowerCase().trim());
                                const normalizedInput = tagInput.trim().toLowerCase();

                                if (tagInput.trim() && !normalizedTags?.includes(normalizedInput)) {
                                    setTags([...(tags || []), tagInput.trim()]);
                                    setTagInput("");
                                }
                            }}
                        />
                        <Pressable className="bg-indigo-300 px-4 py-2 rounded-lg" onPress={() => {
                            const normalizedTags = tags?.map((tag:any) => tag.toLowerCase().trim());
                            const normalizedInput = tagInput.trim().toLowerCase();

                            if (tagInput.trim() && !normalizedTags?.includes(normalizedInput)) {
                                setTags([...(tags || []), tagInput.trim()]);
                            }
                            setTagInput("");
                        }}>
                            <Text className="text-white font-medium">Add</Text>
                        </Pressable>
                    </View>
                    {tags && (
                        <View className="mb-3 flex-row flex-wrap gap-2">
                            {tags.map((tag:any, index:any) => (
                                <View key={index} className="bg-primary-50 px-3 py-1 rounded-full flex-row items-center" >
                                    <Text className="mr-2 text-sm text-gray-700">{tag}</Text>
                                    <Pressable onPress={() => { setTags(tags!.filter((_:any, i:any) => i !== index),); }}>
                                        <Text className="text-red-500 font-bold text-sm">x</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Note */}
                    <Text className="font-semibold mb-2">Note</Text>
                    <TextInput
                        value={note}
                        onChangeText={setNote}
                        className="border border-gray-300 bg-white rounded-lg p-2 mb-4"
                        placeholder="Add a note (optional)"
                    />

                    {/* Buttons */}
                    <View className="flex-row justify-center gap-2 mt-3">
                        <TouchableOpacity onPress={handleCancel} className="bg-gray-300 px-5 py-2 rounded-3xl">
                            <Text className="text-gray-600 font-medium text-lg">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} className="bg-primary-250 px-5 py-2 rounded-3xl">
                            <Text className="text-white font-semibold text-xl">Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePreview} className="bg-gray-300 px-5 py-2 rounded-3xl">
                            <Text className="text-gray-600 font-medium text-lg">Preview</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Modal for adding categories */}
                {addCategoryModalVisible && selectedItemIndex !== null && (
                    <AddToCategoryModal
                    initialCategories={items[selectedItemIndex]?.categories ?? []}
                    onDone={(cats) => {
                      setItems((prev: any[]) =>
                        prev.map((it, idx) => (idx === selectedItemIndex ? { ...it, categories: cats } : it))
                      );
                      setAddCategoryModalVisible(false);
                      setSelectedItemIndex(null);
                    }}
                    onCancel={() => {
                      setAddCategoryModalVisible(false);
                      setSelectedItemIndex(null);
                    }}
                  />
                )}
                
                {/* Modal for adding new item */}
                <Modal
                    visible={addNewItemOpen}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setAddNewItemOpen(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/60 px-5">
                        <View className="bg-white w-11/12 rounded-2xl p-4">
                            <Pressable onPress={() => setAddNewItemOpen(false)}>
                                <Text className='text-right text-slate-600'>close</Text>
                            </Pressable>
                            <Text className="mb-4 text-lg font-bold text-center text-gray-800">Add New Item</Text>

                            
                            <Text className="text-sm text-gray-600 font-semibold mb-2">Name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl mb-4 px-4 py-2"
                                placeholder="Item Name"
                                value={newItem.name}
                                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                            />

                            <Text className="text-sm text-gray-600 font-semibold mb-2">Unit Price</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl mb-4 px-4 py-2 text-right"
                                keyboardType="decimal-pad"
                                value={unitPriceInput}
                                onChangeText={(text: string) => {
                                    const normalized = text.replace(',', '.');
                                    setUnitPriceInput(text);
                                    const parsed = parseFloat(normalized);
                                    if (!isNaN(parsed)) {
                                      setNewItem({ ...newItem, unitPrice: parsed });
                                    } 
                                  }}
                            />

                            <Text className="text-sm text-gray-600 font-semibold mb-2">Quantity</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl mb-4 px-4 py-2 text-right"
                                inputMode="numeric"
                                value={newItem.quantity?.toString() ?? ""}
                                onChangeText={(text) =>
                                    setNewItem({ ...newItem, quantity: parseFloat(text.replace(',', '.')) || 0 })
                                }
                            />

                            <Pressable onPress={handleAddItem} className="bg-primary-200 py-2 rounded-2xl items-center mt-4">
                                <Text className="text-white font-semibold">Add Item</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default EditReceipt;