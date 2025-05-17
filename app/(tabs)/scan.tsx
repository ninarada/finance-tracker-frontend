import { detectText } from "@/services/googleCloudVisionAPI";
import { extractItemsFromText, ReceiptItem } from '@/utils/parseReceipt';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Button, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScanReceipt = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleExtract = (ocrText: string) => {
    const items: ReceiptItem[] = extractItemsFromText(ocrText);
    console.log(items);
  };

  const pickImageAndDetectText = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64Image = result.assets[0].base64;
      setImage(result.assets[0].uri);

      try {
        const text = await detectText(base64Image);
        setExtractedText(text);
        console.log(text);
        console.log("------------------------");
        handleExtract(text);
      } catch (error) {
        setExtractedText('Failed to extract text.');
      }
    }
  };

  return (
    <SafeAreaView className="h-full">
      <Button title="Pick Image and Scan Text" onPress={pickImageAndDetectText} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
      <Text>Extracted Text:</Text>
      <Text>{extractedText}</Text>
    </SafeAreaView>
  );
};

export default ScanReceipt;
