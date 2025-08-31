import { useAuth } from "@/AuthContext";
import { images } from "@/constants/images";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { getMyProfile, getUserStats, updateProfile } from "../../services/userService";

const Profile = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<any>(images.profile_picture);
  const [stats, setStats] = useState<any>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editUserPhoto, setEditUserPhoto] = useState<any>(images.profile_picture);

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      const statsData = await getUserStats();
      setUser(profile);
      if (profile.photo !== "/public/images/profile-picture.png") {
        setUserPhoto({ uri: profile.photo });
        setEditUserPhoto({ uri: profile.photo });
      }
      setEditUser(profile);
      setStats(statsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data.");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchUserProfile();
  }, [token, fetchUserProfile]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      router.replace("/onboarding");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
      quality: 1,
      base64: true, 
    });
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setEditUser({
        ...editUser,
        photo: {
          uri: selectedImage.uri,
          name: selectedImage.fileName || "photo.jpg",
          type: selectedImage.type || "image/jpeg",
        },
      });
      setEditUserPhoto(selectedImage.uri);
    }
  };  

  const handleCancelEdit = async () => {
    setEditUser(user);
    setEditingMode(false);
  }

  const handleSaveEdit = async () => {
    try {
      if(editUser.name && editUser.surname) {
        await updateProfile({
          name: editUser.name,
          surname: editUser.surname,
          location: editUser.location,
          bio: editUser.bio,
          photo: editUser.photo,
        });
        setEditingMode(false);
        setUser(editUser)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  }

  const handleCategoryPress = (name: string) => {
    router.push({
      pathname: "/categoryOverview",
      params: { name },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="bg-primary-10">
       {user && ( 
        <ScrollView className="min-h-full p-2">
          <View className="relative h-65 pb-5 mx-2 justify-center items-center">
            <View className="absolute inset-0">
              <View className="flex-1 bg-primary-100 shadow-sm"  style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,}}/>
              <View className="flex-1 bg-background-light shadow-sm" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 16,}}/>
            </View>
            <Pressable
              onPress={() => router.push("/settings")}
              className="absolute top-4 right-4 z-10"
            >
              <View className='shadow-sm'>
                <FontAwesome size={32} name="gear" color="#9ca3af"/>
              </View>
            </Pressable>
            <View className="items-center z-1 gap-2">
              <View className='shadow-sm'>
                  <Image source={userPhoto} className="w-32 h-32 rounded-full border-2 border-white mb-1 mt-12" />
              </View>
             
              <Text className="text-xl font-semibold">{user?.name || "Loading..."} {user?.surname || "Loading..."}</Text>
              <Text className="text-gray-600">@{user?.username || "Loading..."}</Text>
            </View>
          </View>

          <View className='bg-background-light rounded-xl m-2 py-3  shadow-sm'> 
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

          <View className='flex-row justify-between bg-background-light rounded-xl m-2 py-5 px-4  shadow-sm'>
            <Text className="text-text text-lg font-medium">This Month's Spending: </Text>
            <Text className="text-text text-lg font-medium">{stats?.currentMonthSpent}€</Text>
          </View>

          <View className='bg-background-light rounded-xl m-2 py-5 px-4 flex-row justify-evenly gap-2  shadow-sm'>
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

          <View className='bg-background-light rounded-xl m-2 py-5 px-4 flex-col gap-2  shadow-sm'>
            <Text className="text-text text-md text-center font-medium mb-2 uppercase">Top Categories</Text>
            <View className='flex-row gap-3 flex-wrap justify-center'>
            {stats?.topCategories.length > 0 ? stats?.topCategories.map((item: { category: string }, index: React.Key ) => {
                return (
                  <TouchableOpacity
                      key={index}
                      onPress={() => handleCategoryPress(item.category)}
                      className="justify-center items-center bg-primary-50 rounded-3xl px-6 py-1 shadow-sm" 
                    >
                      <Text className="text-primary-250 text-center text-xl font-semibold">{item.category}</Text>
                    </TouchableOpacity>
                );
              }) : (
                <Text className="text-slate-600">You don’t have any top categories yet.</Text> 
              )}
            </View>
          </View>

          <View className="flex-row mt-4 mb-5">
            <View className='w-1/2'>
            <Pressable onPress={() => setEditingMode(true)} className="mr-1 h-20 justify-center items-center shadow-sm bg-primary-200 rounded-xl">
              <Text className="text-white text-center text-xl font-semibold uppercase">Edit</Text>
            </Pressable></View>
            <View className='w-1/2'>
            <Pressable onPress={handleLogout} className="ml-1 h-20 justify-center items-center bg-primary-100 rounded-xl shadow-sm">
              <Text className="text-white text-center text-xl font-semibold uppercase">Log Out</Text>
            </Pressable></View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={editingMode}
            onRequestClose={() => setEditingMode(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/70 px-5">
              <View className="bg-white w-full rounded-2xl p-5 gap-1">
              <Pressable onPress={pickImage} className="items-center mb-3">
                {/* <Image
                  source={{ uri: editUser?.photo || user?.photo }}
                  className="w-24 h-24 rounded-full border-2 border-gray-300"
                /> */}
                <Image source={editUserPhoto} className="w-32 h-32 rounded-full border-2 border-white mb-1 mt-12" />
                <Text className="text-primary-250 mt-1">Change Photo</Text>
              </Pressable>
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
      )}
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
};

export default Profile;
