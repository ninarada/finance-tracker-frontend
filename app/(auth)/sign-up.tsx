import { registerUser } from '@/services/userService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const SignUp = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  const handleRegistration = async () => {
    if (!name || name.trim().length === 0 || name.length < 2 || name.length > 15 || !/^[a-zA-Z\s'-]+$/.test(name.trim()) ) {
      Alert.alert('Error', 'Please enter valid name between 2 and 15 characters. Name can only contain letters, spaces, apostrophes, and hyphens.');
      return;
    }
    if (!surname || surname.trim().length === 0 || surname.length < 2 || surname.length > 15 || !/^[a-zA-Z\s'-]+$/.test(surname.trim()) ) {
      Alert.alert('Error', 'Please enter valid surname between 2 and 15 characters. surname can only contain letters, spaces, apostrophes, and hyphens.');
      return;
    }
    if (!username || username.trim().length === 0 || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username) || username.includes('__')) {
      Alert.alert('Error', 'Please enter valid username. Username must be between 3 and 20 characters, only contain letters, numbers, and underscores and cannot contain consecutive underscores.');
      return;
    }
    if (!email || email.trim().length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Error', 'Please enter valid email.');
      return;
    }
    if (!password || !password2 || password.length < 6) {
      Alert.alert('Error', 'Please enter valid password. Password must be at least 6 characters long.');
      return;
    }
    if (password !== password2) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      const response = await registerUser(username, email, password, name, surname);
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
              <View className='flex-row gap-2'>
                <TextInput
                  className="flex-1 bg-primary-10 shadow-sm rounded-full px-4 py-3"
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  className="w-1/2 bg-primary-10 shadow-sm rounded-full px-4 py-3"
                  placeholder="Surname"
                  value={surname}
                  onChangeText={setSurname}
                />
              </View>
              <TextInput
                className="w-full bg-primary-10 shadow-sm rounded-full px-4 py-3"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TextInput
                className="w-full shadow-sm bg-primary-10 rounded-full px-4 py-3"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
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
              <View className="w-full shadow-sm bg-primary-10 rounded-full px-4 py-3 flex-row justify-between">
                <TextInput
                  className="flex-1"
                  placeholder="Confirm Password"
                  secureTextEntry={!showPassword2}
                  value={password2}
                  onChangeText={setPassword2}
                  autoCapitalize="none"
                />
                <TouchableOpacity className="" onPress={() => setShowPassword2(!showPassword2)}>
                  <Ionicons name={showPassword2 ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
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