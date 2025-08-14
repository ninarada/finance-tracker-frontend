import React, { useState } from 'react';
import { Alert, Modal, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { SecondaryButton } from '../buttons/SecondaryButton';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

const NewCategoryModal: React.FC<ModalProps> = ({ visible, onClose, onCreate }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleCreate = () => {
        if (!categoryName) {
            Alert.alert("Error", "Category name is required.");
            return;
        }
        if (categoryName.trim() !== '') {
            onCreate(categoryName.trim());
            setCategoryName('');
            onClose();
        }
    };

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
                        <PrimaryButton title='Create' onPress={handleCreate} fontSize='text-md'/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default NewCategoryModal;