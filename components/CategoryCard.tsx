import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type CategoryCardProps = {
    name: string;
    totalSpent: number;
    thisMonthsSpendings: number;
    mostPopularStore: string | null;
  };

const CategoryCard: React.FC<CategoryCardProps> = ({ name, totalSpent, thisMonthsSpendings, mostPopularStore, }) =>{
  return (
    <View className="bg-primary-50 rounded-2xl px-5 pb-4 pt-3 mb-7 mt-3 shadow">
      <View className="flex-row justify-between">
        <TouchableOpacity>
          <View className="shadow-sm">
            <FontAwesome name={ 'star' } size={24} color={'#FACC15'}/>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center mb-4">
        <Text className="text-3xl font-bold my-1 text-purple-800">{name}</Text>
      </View>

      <View className="gap-2 items-center pb-2">
        <Text className="text-md font-medium">Total spent: €{totalSpent.toFixed(2)}</Text>
        <Text className="text-md font-medium">This months spending: €{thisMonthsSpendings.toFixed(2)}</Text>
        <Text className="text-md font-medium">
          Most popular store: {mostPopularStore || 'N/A'}
        </Text>
      </View>
    </View>
  )
}

export default CategoryCard