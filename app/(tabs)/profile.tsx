import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getMyProfile, getUserStats, updateProfile } from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/sign-in");
          setUser(null);
        } else {
          const profile = await getMyProfile(token);
          const statsData = await getUserStats(token);
          setUser(profile);
          setEditUser(profile);
          setStats(statsData);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleCancelEdit = async () => {
    setEditUser(user);
    setEditingMode(false);
  }

  const handleSaveEdit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if(token && editUser.name && editUser.surname) {
        await updateProfile(token, {
          name: editUser.name,
          surname: editUser.surname,
          location: editUser.location,
          bio: editUser.bio,
        });
        setEditingMode(false);
        setUser(editUser)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className="min-h-full p-2">
          <View className="relative h-65 pb-5 mx-2 justify-center items-center">
            <View className="absolute inset-0">
              <View className="flex-1 bg-primary-100 rounded-xl" />
              <View className="flex-1 bg-background-light rounded-xl" />
            </View>
            <Pressable
              onPress={handleLogout}
              className="absolute top-4 right-4 z-10"
            >
              <FontAwesome size={32} name="gear" color="#64748B"/>
            </Pressable>
            <View className="items-center z-1 gap-2">
              <Image
                source={{ uri: user?.photo }}
                className="w-32 h-32 rounded-full border-4 border-white mb-1 mt-12"
              />
              <Text className="text-xl font-semibold">{user?.name || "Loading..."} {user?.surname || "Loading..."}</Text>
              <Text className="text-gray-600">@{user?.username || "Loading..."}</Text>
            </View>
          </View>

          <View className='bg-background-light rounded-xl m-2 py-3'> 
            <View className="bg-background-light p-2 rounded-lg mx-2">
              <Text className="text-text-light text-md">Email</Text>
              <Text className="text-text text-lg font-medium">{user?.email}</Text>
            </View>
            <View className="bg-background-light p-2 rounded-lg mx-2">
              <Text className="text-text-light text-md">Location</Text>
              <Text className="text-text text-lg font-medium">{user?.location || "Not specified"}</Text>
            </View>
            <View className="bg-background-light p-2 rounded-lg mx-2">
              <Text className="text-text-light text-md">Bio</Text>
              <Text className="text-text text-lg font-medium">{user?.bio || "No bio yet."}</Text>
            </View>
            <View className="bg-background-light p-2 rounded-lg mx-2">
              <Text className="text-text-light text-md">Joined</Text>
              <Text className="text-text text-lg font-medium">
                {new Date(user?.joined).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                
              </Text>
            </View>
          </View>

          <View className='flex-row justify-between bg-background-light rounded-xl m-2 py-5 px-4'>
            <Text className="text-text text-lg font-medium">This Month's Spending: </Text>
            <Text className="text-text text-lg font-medium">{stats?.currentMonthSpent}€</Text>
          </View>

          <View className='bg-background-light rounded-xl m-2 py-5 px-4 flex-row justify-evenly gap-2'>
            <View className='justify-center items-center'>
              <Text className="text-text text-lg font-medium">Receipts</Text>
              <Text className="text-text text-lg font-medium">{stats?.totalReceipts}</Text>
            </View >
            <View className='border-r-2 border-r-slate-200'></View>
            <View className='justify-center items-center'>
              <Text className="text-text text-lg font-medium">Total Spent</Text>
              <Text className="text-text text-lg font-medium">{stats?.totalSpent}€</Text>
            </View>
            <View className='border-r-2 border-r-slate-200'></View>
            <View className='justify-center items-center'>
              <Text className="text-text text-lg font-medium">Avg/Receipt</Text>
              <Text className="text-text text-lg font-medium">{stats?.avgPerReceipt}€</Text>
            </View>
          </View>

          <View className='bg-background-light rounded-xl m-2 py-5 px-4 flex-col gap-2'>
            <Text className="text-text text-lg font-medium mb-2">Top Categories:</Text>
            <View className='flex-row gap-3 flex-wrap justify-center'>
            {stats?.topCategories.length > 0 ? stats?.topCategories.map((item, index) => {
                return (
                  <Pressable key={index} className="justify-center items-center bg-primary-50 rounded-3xl px-6 py-1">
                    <Text className="text-primary-250 text-center text-xl font-semibold">
                      {item.category}
                    </Text>
                  </Pressable>
                );
              }) : (
                <Text>No categories.</Text>
              )}
            </View>
          </View>

          <View className="flex-row mt-4 h-20 gap-2 mb-5">
            <Pressable onPress={() => setEditingMode(true)} className="flex-1 justify-center items-center bg-primary-250 rounded-xl">
              <Text className="text-white text-center text-xl font-semibold uppercase">Edit</Text>
            </Pressable>
            <Pressable onPress={handleLogout} className="w-1/2 justify-center items-center bg-primary-200 rounded-xl">
              <Text className="text-white text-center text-xl font-semibold uppercase">Log Out</Text>
            </Pressable>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={editingMode}
            onRequestClose={() => setEditingMode(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/70 px-5">
              <View className="bg-white w-full rounded-2xl p-5 gap-1">
                <Text className="text-text-light text-md">Name</Text>
                <TextInput 
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                  placeholder="Name"
                  value={editUser?.name}
                  onChangeText={(text) => setEditUser({ ...editUser, name: text })}
                />
                <Text className="text-text-light text-md">Surname</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                  placeholder="Surname"
                  value={editUser?.surname}
                  onChangeText={(text) => setEditUser({ ...editUser, surname: text })}
                />
                <Text className="text-text-light text-md">Username</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3 text-slate-500"
                  placeholder="Surname"
                  value={'@'+editUser?.username}
                  editable={false}
                />
                <Text className="text-text-light text-md">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3 text-slate-500"
                  placeholder="Email"
                  value={editUser?.email}
                  editable={false}
                />
                <Text className="text-text-light text-md">Location</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                  placeholder="Location"
                  value={editUser?.location}
                  onChangeText={(text) => setEditUser({ ...editUser, location: text })}
                />
                <Text className="text-text-light text-md">Bio</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-2 mb-3"
                  placeholder="Bio"
                  value={editUser?.bio}
                  onChangeText={(text) => setEditUser({ ...editUser, bio: text })}
                  multiline
                />
                
                <View className='flex-row justify-between'>
                  <Pressable className="w-1/3 mt-3 bg-primary-100 px-4 py-2 rounded-2xl" onPress={handleCancelEdit}>
                   <Text className="text-white text-center">Close</Text>
                  </Pressable>
                  <Pressable className="w-1/3 mt-3 bg-primary-250 px-4 py-2 rounded-2xl" onPress={handleSaveEdit}>
                   <Text className="text-white text-center">Save</Text>
                  </Pressable>
                </View>
                
              </View>
            </View>
          </Modal>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
};

export default Profile;
