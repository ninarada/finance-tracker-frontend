import React from 'react'
import { Pressable, Text } from 'react-native'

const PrimaryButton = () => {
  return (
    <Pressable 
        onPress={() => console.log("Get Started")} 
        className="bg-primary-300 rounded-full py-3 mb-4">
        <Text className="text-white text-center text-lg font-semibold">
            Get Started
        </Text>
    </Pressable>
  )
}

export default PrimaryButton