import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  fontSize?: string;
  backgroundColor?: string;
  backgroundVersion?: string;
  textColor?: string;
  disabled?: boolean;
  uppercase?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  fontSize = "text-lg",
  backgroundColor = "bg-primary-200",
  backgroundVersion, 
  textColor = "text-white",
  disabled = false,
  uppercase = false,
}) => {

  let bgColor = backgroundColor;
  if(backgroundVersion==='light') {
      bgColor = "bg-primary-200";
  } else if (backgroundVersion==='dark'){
      bgColor =  "bg-primary-300";
  } 

  if (backgroundColor === 'error') bgColor = 'bg-error-dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${bgColor} rounded-full py-2 px-5 justify-center`}
      disabled={disabled}
    >
      <Text className={`${textColor} text-center ${fontSize} font-bold shadow-sm ${uppercase ? "uppercase" : ""}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};