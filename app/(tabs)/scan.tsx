import React, { useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const ScanReceipt = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          setImageUri(uri);
        }
      console.log("Selected image URI:", uri);
      // You can call OCR processing here
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="flex-1 bg-white p-4">
        <View className="mb-4">
          <Button title="Select Receipt Image" onPress={pickImage} />
        </View>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-60 mb-4 rounded"
            resizeMode="contain"
          />
        )}

        <View>
          <Text className="text-lg font-bold mb-2">Scanned Text:</Text>
          {scannedText.length > 0 ? (
            scannedText.map((line, index) => (
              <Text key={index} className="mb-1 text-gray-700">
                {line}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500">No text extracted yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanReceipt;
