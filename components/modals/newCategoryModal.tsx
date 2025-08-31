import { createCategory } from '@/services/receiptsService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: (categoryName: string) => void;
}

const NewCategoryModal: React.FC<ModalProps> = ({ visible, onClose, onSuccess }) => {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState('');

    const handleCreate = async (nameInput: string) => {
        if (!nameInput) {
            Alert.alert("Error", "Category name is required.");
            return;
        }
        const name = nameInput.trim();
        try {
            await createCategory(name);
            onSuccess(name);
            Alert.alert('Success', 'Category created successfully.',
              [
                {
                  text: 'Close', style: 'cancel',
                },
                {
                  text: 'See Category', onPress: () =>  router.push({ pathname: '/categoryOverview', params: { name }}), style: 'default',
                },
              ],
              { cancelable: true }
            );
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to create category.');
          }
    }

    const handleClose = () => {
        setCategoryName('');
        onClose();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View className="bg-white w-full rounded-2xl p-5 gap-4">
                    <Text className="text-xl font-bold text-center text-primary-700">New Category</Text>
                    <Text className='text-slate-500 text-center mb-2'>
                        Enter a name for your new category to help organize your receipts and expenses. 
                    </Text>
                    <View className='bg-primary-50 rounded-full shadow-sm'>
                        <TextInput
                        placeholder="Category Name"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        className="border border-gray-200 rounded-2xl px-3 py-2"
                        textAlignVertical="center"
                        autoCapitalize="none"
                    />
                    </View>
                    

                    <View className="flex-row justify-end gap-2">
                        <SecondaryButton title='Cancel' onPress={handleClose} fontSize='text-md'/>
                        <PrimaryButton title='Create' onPress={()=>handleCreate(categoryName)} fontSize='text-md'/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default NewCategoryModal;