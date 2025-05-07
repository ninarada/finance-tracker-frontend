import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const AuthLayout = () => {
  return (
    <View className='flex-1'>
       <Slot />
    </View>
  );
};

export default AuthLayout;