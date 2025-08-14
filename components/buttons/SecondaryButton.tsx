import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";

interface SecondaryButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    fontSize?: string;
    backgroundColor?: string;
    textColor?: string;
    disabled?: boolean;
    uppercase?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    title,
    onPress,
    fontSize = "text-lg",
    backgroundColor = "bg-gray-300", 
    textColor = "text-black",
    disabled = false,
    uppercase = false,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`${backgroundColor} rounded-full py-2 px-5 justify-center`}
            disabled={disabled} 
        >
            <Text className={`${textColor} text-center ${fontSize} font-medium ${uppercase ? "uppercase" : ""}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};