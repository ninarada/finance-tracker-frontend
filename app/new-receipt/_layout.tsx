import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const NewReceiptLayout = () => {
  return (
    <View className='flex-1'>
       <Slot />
    </View>
  );
};

export default NewReceiptLayout;