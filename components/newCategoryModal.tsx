import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

const NewCategoryModal: React.FC<ModalProps> = ({ visible, onClose, onCreate }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleCreate = () => {
        if (categoryName.trim() !== '') {
            onCreate(categoryName.trim());
            setCategoryName('');
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View className="bg-white w-full rounded-2xl p-5">
                    <Text className="text-xl font-bold mb-4 text-slate-800">New Category</Text>
                    <TextInput
                        placeholder="Category name"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        className="border border-gray-300 rounded-2xl px-3 py-2 mb-4 "
                        textAlignVertical="center"
                    />

                    <View className="flex-row justify-end space-x-4">
                        <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                            <Text className="font-medium text-black">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreate} className="px-4 py-2 bg-primary-250 rounded-3xl">
                            <Text className="font-medium text-white">Create</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default NewCategoryModal;