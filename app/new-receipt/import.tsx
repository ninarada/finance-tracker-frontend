import { processReceiptImage } from "@/services/gcloudAPI";
import { CreateReceipt } from "@/types/receipt";
import { convertParsedReceiptToMongooseFormat } from "@/utils/convertParsedReceiptToMongooseFormat";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const initialReceipt: CreateReceipt = {
    store: "",
    date: "",
    items: [],
    totalAmount: 0,
    paymentMethod: "Other",
    note: "",
    tags: []
};

const ImportReceipt = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [proceed, setProceed] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [receipt, setReceipt] = useState<CreateReceipt>(initialReceipt);

    useEffect(() => {
        const pickImage = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              base64: true,
            });
            if (result.canceled) {
                router.back();
                return;
            }
            if (result.assets && result.assets[0].base64) {
              setImage(result.assets[0].uri);
              setImageBase64(result.assets[0].base64);
            }
        };
        pickImage();
        setLoading(false);
    }, []);

    useEffect(() => {
        if (imageBase64) {
          detectTextFromImage();
        }
    }, [imageBase64]);

    useEffect(() => {
        if (proceed && !loading) {
          router.push({
            pathname: '/new-receipt/edit',
            params: {
              mode: 'new',
              data: JSON.stringify(receipt), 
            },
          });
        }
      }, [proceed]);
    
    const detectTextFromImage = async () => {
        if (!image) return;
        setLoading(true);
        setReceipt(initialReceipt);
        try {
          const result = await processReceiptImage({
            uri: image,
            type: 'image/jpeg',
            name: 'receipt.jpg',
          });
          console.log("Parsed Receipt Data:", result);
          setReceipt(convertParsedReceiptToMongooseFormat(result));
          //setReceipt(result);
          setProceed(true);
        } catch (error) {
          console.error(error);
          setReceipt(initialReceipt);
        } finally {
          setLoading(false);
        }
        console.log(receipt);
    };

    return (
        <View className="flex-1 pt-12 bg-black/50">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#fff" />
                    <Text className="mt-4 text-white">Extracting receipt data...</Text>
                </View>
            ) : (
                   <View /> 
            )}
            <View className="py-8"></View>
        </View>
    );    
};

export default ImportReceipt;