import { loginUser } from '@/services/userService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-7 gap-4 bg-primary-50">
            <View className='gap-3'>
               <Text className="text-4xl font-bold text-center text-primary-700">Welcome Back!</Text>
              <Text className="text-lg text-center text-slate-700 mb-5">Enter your credentials to access your account.</Text>
            </View>
            <View className='gap-4'>
              <TextInput
                className="w-full bg-primary-10 shadow-sm rounded-full px-4 py-3"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <View className="w-full shadow-sm bg-primary-10 rounded-full px-4 py-3 flex-row justify-between">
                <TextInput
                  className="flex-1"
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity className="" onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
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