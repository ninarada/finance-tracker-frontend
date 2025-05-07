import { loginUser } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await loginUser(username, password);
      await AsyncStorage.setItem('token', response.token);
      router.replace('/');
    } catch (error) {
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } 
  };

  const handleSwitch = () => {
    router.replace('/sign-up');
  };

  return (
    <View className="flex-1 justify-center px-5">
      <Text className="text-4xl font-bold text-center mb-2 text-[#174982]">Welcome back!</Text>
      <Text className="text-lg text-center mb-10">Please log in to continue.</Text>
      <Image
        source={require('@/assets/images/login.png')}
        className="w-[250px] h-[250px] self-center mb-5"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-full px-4 py-3 mb-5"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full border border-gray-300 rounded-full px-4 py-3 mb-5"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable 
        onPress={handleLogin} 
        className="bg-primary-300 rounded-full py-3 mb-4">
        <Text className="text-white text-center text-lg font-semibold">
          Log In
        </Text>
      </Pressable>
      <View className="flex-row justify-center items-center mt-5">
        <Text className="text-base italic mr-2">Don't have an account?</Text>
        <Pressable onPress={handleSwitch} >
          <Text className="text-primary-500 text-center text-lg font-semibold">
            Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;