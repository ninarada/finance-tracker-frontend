import { registerUser } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegistration = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please enter username, email and password.');
      return;
    }
    try {
      const response = await registerUser(username, email, password);
      await AsyncStorage.setItem('token', response.token);
      router.replace('/');
    } catch (error) {
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.');
    } 
  }

  const handleSwitch = () => {
    router.replace('/sign-in');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-5">
            <Text className="text-4xl font-bold text-center mb-2 text-[#174982]">Create an Account</Text>
            <Text className="text-lg text-center mb-10">Let’s get you set up! Join us today.</Text>
            <Image
              source={require('@/assets/images/signup.png')}
              className="w-[250px] h-[250px] self-center mb-5"
            />
            <TextInput
              className="w-full border border-gray-300 rounded-full px-4 py-3 mb-3"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              className="w-full border border-gray-300 rounded-full px-4 py-3 mb-3"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              className="w-full border border-gray-300 rounded-full px-4 py-3 mb-3"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Pressable 
              onPress={handleRegistration} 
              className="bg-primary-300 rounded-full py-3 mb-4">
              <Text className="text-white text-center text-lg font-semibold">
                Sign Up
              </Text>
            </Pressable>
            <View className="flex-row justify-center items-center">
              <Text className="italic mr-2">Already have an account?</Text>
              <Pressable onPress={handleSwitch} >
                <Text className="text-primary-500 text-center text-lg font-semibold">
                  Log In
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  )
}

export default SignUp