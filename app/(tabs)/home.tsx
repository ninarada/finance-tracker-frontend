import { images } from "@/constants/images";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getMyProfile } from "../../services/userService";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<any>(images.profile_picture); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/sign-in");
          setUser(null);
        } else {
          const profile = await getMyProfile(token);
          setUser(profile);
          if (profile.photo !== "/public/images/profile-picture.png") {
            setUserPhoto({ uri: profile.photo }); 
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, []);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ height: '100%'}} className="p-5">
          <View className="flex-row justify-between items-center mb-10">
            <View className="flex-row items-center gap-3">
              <Image source={userPhoto} className="w-14 h-14 rounded-full" resizeMode="contain"/>
              <View>
                <Text className="text-xl font-bold text-text">Hello, </Text>
                <Text className="text-xl font-bold text-text">{user?.name ? `${user.name}` : ""}!</Text>
              </View>
            </View>
            <FontAwesome size={32} name="bell-o" color="#64748B"/>
          </View>

          <View className="gap-3 mb-7">
            <Text className="text-xl  text-text">Quick Actions</Text>
            <View className="flex-row justify-evenly">
              <View className="h-24 w-24 rounded-full bg-primary-100"></View>
              <View className="h-24 w-24 rounded-full bg-primary-100"></View>
              <View className="h-24 w-24 rounded-full bg-primary-100"></View>
              <View className="h-24 w-24 rounded-full bg-primary-100"></View>
            </View>
          </View>

          <View className="gap-3 mb-7">
            <Text className="text-xl  text-text">Spending Highlights</Text>
            <View className="h-52 w-100 rounded-lg bg-primary-200"></View>
          </View>

          <View className="gap-3 mb-7">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl  text-text">Categories</Text>
              <Pressable onPress={() => router.push('/')} className="bg-primary-50 rounded-full px-3">
                <Text className="text-primary-200 text-center text-lg font-semibold">
                  add new +
                </Text>
              </Pressable>
            </View>
            <View className="flex-row flex-wrap gap-3 justify-evenly">
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
              <View className="h-10 w-28 rounded-2xl bg-primary-100"></View>
            </View>
            <View className="flex-row justify-center">
              <Pressable onPress={() => router.push('/')} className="px-5 py-1  rounded-2xl bg-primary-50 ">
                <Text className="text-primary-200 text-center text-lg font-semibold">
                  see more
                </Text>
              </Pressable>
            </View>
            
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Home;