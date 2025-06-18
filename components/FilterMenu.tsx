import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type FilterOptions = {
  storeName: string;
  minPrice: string;
  maxPrice: string;
  paymentMethod: string;
  startDate: Date | null;
  endDate: Date | null;
};

type FilterMenuProps = {
  initialFilters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
  onCancel: () => void;
};

const paymentMethods = ["", "Cash", "Card", "Mobile", "Other"];

const FilterMenu: React.FC<FilterMenuProps> = ({ initialFilters, onApply, onCancel }) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFilters(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFilters(prev => ({ ...prev, endDate: selectedDate }));
    }
  };

  const clearFilters = () => {
    setFilters({
      storeName: "",
      minPrice: "",
      maxPrice: "",
      paymentMethod: "",
      startDate: null,
      endDate: null,
    });
  };

  return (
    <TouchableWithoutFeedback>
    <View className="pb-5 px-5 pt-2">

        <View className='flex-row justify-end mb-2'>
            <TouchableOpacity onPress={clearFilters}>
                <Text className="text-slate-500 font-medium">clear</Text>
            </TouchableOpacity>
        </View>

       
      {/* Store Name */}
      <Text className="font-semibold mb-1">Store Name</Text>
      <TextInput
        placeholder="Enter store name"
        value={filters.storeName}
        onChangeText={text => setFilters(prev => ({ ...prev, storeName: text }))}
        className="border border-gray-300 rounded-md p-2 mb-4"
      />

      {/* Price Range */}
      <Text className="font-semibold mb-1">Price Range (€)</Text>
      <View className="flex-row space-x-2 mb-4">
        <TextInput
          placeholder="Min"
          keyboardType="numeric"
          value={filters.minPrice}
          onChangeText={text => setFilters(prev => ({ ...prev, minPrice: text }))}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <TextInput
          placeholder="Max"
          keyboardType="numeric"
          value={filters.maxPrice}
          onChangeText={text => setFilters(prev => ({ ...prev, maxPrice: text }))}
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
      </View>

      {/* Payment Method */}
      <Text className="font-semibold mb-1">Payment Method</Text>
      <View className="border border-gray-300 rounded-md mb-4">
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method}
            onPress={() => setFilters(prev => ({ ...prev, paymentMethod: method }))}
            className={`p-2 ${filters.paymentMethod === method ? "bg-primary-50" : ""}`}
          >
            <Text className={`${filters.paymentMethod === method ? "text-primary-300" : "text-black"}`}>
              {method === "" ? "Any" : method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Range */}
      <Text className="font-semibold mb-1">Date Range</Text>
      <View className="flex-row space-x-2 mb-4">
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm flex-row items-center justify-between">
          <Text className={`text-gray-800 ${filters.startDate ? "" : "text-gray-400"}`}>{filters.startDate ? filters.startDate.toLocaleDateString() : "Start Date"}</Text>
          <Feather name="calendar" size={16} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm flex-row items-center justify-between">
          <Text className={`text-gray-800 ${filters.startDate ? "" : "text-gray-400"}`}>{filters.endDate ? filters.endDate.toLocaleDateString() : "End Date"}</Text>
          <Feather name="calendar" size={16} color="#888" />
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={filters.startDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeStartDate}
          maximumDate={filters.endDate || undefined}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={filters.endDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeEndDate}
          minimumDate={filters.startDate || undefined}
          maximumDate={new Date()}
        />
      )}

      {/* Buttons */}
        <View className="flex-row justify-end  space-x-4 mt-2">
          <TouchableOpacity onPress={onCancel} className="bg-gray-300 rounded-md py-2 px-5">
            <Text className="font-semibold text-black">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onApply(filters)} className="bg-primary-250 rounded-2xl py-2 px-5">
            <Text className="text-white font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default FilterMenu;
export type { FilterOptions };
