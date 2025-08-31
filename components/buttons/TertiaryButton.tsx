import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

interface TertiaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  fontSize?: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  uppercase?: boolean;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  title,
  onPress,
  fontSize = "font-medium",
  backgroundColor = "", 
  textColor = "text-slate-500",
  disabled = false,
  uppercase = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${backgroundColor} justify-center`}
      disabled={disabled} 
    >
      <Text className={`${textColor} text-center ${fontSize} ${uppercase ? "uppercase" : ""}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};