import { images } from "@/constants/images";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: '1',
    title: 'Welcome to FinTrack',
    text: 'Take control of your personal finances. Track spending, scan receipts, and analyze expenses.',
    image: images.onboarding1,
  },
  {
    key: '2',
    title: 'Smart Expense Tracking',
    text: 'Log and categorize your expenses easily. Understand where your money goes.',
    image: images.onboarding2,
  },
  {
    key: '3',
    title: 'Scan & Save Time',
    text: 'Snap a photo of your receipt - we\'ll handle the rest.',
    image: images.onboarding3,
  },
  {
    key: '4',
    title: 'Insights & Reports',
    text: 'Get visual reports and smart tips to improve your spending habits.',
    image: images.onboarding4,
  },
];

export default function Onboarding() {
  
  const renderItem = ({ item }: { item: typeof slides[number] }) => (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-4xl font-bold text-center text-white pb-10 shadow">
        {item.title}
      </Text>
      <Image source={item.image} className="w-64 h-64 mb-6 shadow" resizeMode="contain" />
      <Text className="px-6 text-xl font-semibold text-gray-100 text-center shadow-sm">
        {item.text}
      </Text>
    </View>
  );

  return (
    <View className="h-full  bg-primary-200 ">
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        showNextButton={false}
        showDoneButton={false}
        bottomButton={false}
      />

      <View className="px-6 mb-10">
        <Pressable 
          onPress={() => router.push('/(auth)/sign-up')} 
          className="bg-primary-300 rounded-full py-3 mb-4">
          <Text className="text-white text-center text-lg font-semibold">
            Get Started
          </Text>
        </Pressable>

        <Pressable 
          onPress={() =>  router.push('/(auth)/sign-in')} 
          className="bg-transparent border-2 border-white rounded-full py-3">
          <Text className="text-white text-center text-lg font-semibold">
            Log In
          </Text>
        </Pressable>
      </View>

    </View>
  )
}