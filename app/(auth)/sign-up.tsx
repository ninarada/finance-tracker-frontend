import { registerUser } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

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
          <View className="flex-1 justify-center px-7 gap-4 bg-primary-50">
            <View className='gap-3'>
              <Text className="text-4xl font-bold text-center text-primary-700">Create an Account</Text>
              <Text className="text-lg text-center text-slate-700 mb-5">Let’s get you set up! Join us today.</Text>
            </View>
            <View className='gap-4'>
              <TextInput
                className="w-full bg-primary-10 shadow-sm rounded-full px-4 py-3"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                className="w-full shadow-sm bg-primary-10 rounded-full px-4 py-3"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                className="w-full shadow-sm bg-primary-10 rounded-full px-4 py-3"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View className='gap-1'>
              <View className='shadow-sm mt-5'>
                <TouchableOpacity onPress={handleRegistration} className="bg-primary-200 rounded-full py-3">
                  <Text className="text-white text-center text-lg uppercase font-bold shadow-sm">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center items-center gap-2">
                <Text className="italic text-slate-700">Already have an account?</Text>
                <TouchableOpacity onPress={handleSwitch} >
                  <Text className="text-primary-600 text-center text-lg font-semibold">
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  )
}

export default SignUp