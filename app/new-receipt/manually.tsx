import { CreateReceipt } from '@/types/receipt';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ManuallyReceipt = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [proceed, setProceed] = useState(true);
    const receipt: CreateReceipt = {
      store: "",
      date: "",
      items: [],
      totalAmount: 0,
      paymentMethod: "Other",
      note: "",
      tags: []
    };

    useEffect(() => {
        if (proceed && !loading) {
          router.replace({
            pathname: '/new-receipt/edit',
            params: {
              mode: 'new',
              data: JSON.stringify(receipt), 
            },
          });
        }
      }, [proceed]);

    return (
        <SafeAreaProvider>
            <SafeAreaView className='flex-1'>
                <View />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ManuallyReceipt;