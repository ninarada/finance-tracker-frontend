import { loginUser } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(username, password);
      await AsyncStorage.setItem('token', response.token);
      router.replace('/');
    } catch (error) {
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
      setLoading(false);
    } 
  };

  const handleSwitch = () => {
    router.replace('/sign-up');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-5 gap-4 bg-primary-50">
            <View className='gap-3'>
               <Text className="text-4xl font-bold text-center text-primary-700">Welcome back!</Text>
              <Text className="text-lg text-center text-slate-700 mb-5">Please log in to continue.</Text>
            </View>
            <View className='gap-4'>
              <TextInput
                className="w-full bg-primary-10 shadow-sm rounded-full px-4 py-3"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                className="w-full bg-primary-10 shadow-sm rounded-full px-4 py-3"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View className='gap-1'>
              <View className='shadow-sm mt-5'>
                <TouchableOpacity onPress={handleLogin} className="bg-primary-200 rounded-full py-3">
                  <Text className="text-white text-center text-lg uppercase font-bold shadow-sm">
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center items-center gap-2">
                <Text className="text-slate-700 italic">Don't have an account?</Text>
                <TouchableOpacity onPress={handleSwitch} >
                  <Text className="text-primary-600 text-center text-lg font-semibold">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    
    </KeyboardAvoidingView>
  );
};

export default SignIn;