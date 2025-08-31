import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SecondaryButton } from '../buttons/SecondaryButton';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    categories: [];
}

const FilterByCategoryModal: React.FC<ModalProps> = ({  visible, onClose, categories }) => {

    const handleClose = () => {
        onClose();
    }

    const handleToggleCategory = () => {

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
                    <Text className="text-xl font-bold text-center text-primary-700">Select Category</Text>
                    <ScrollView className="mb-3" style={{ maxHeight: 300 }} >
                        {categories.length > 0 && categories.map((category, index) => (
                            <TouchableOpacity  key={index} onPress={() => handleToggleCategory()} className='px-4 py-2 rounded-full mb-2 bg-primary-50'>
                                <Text className="text-gray-700">{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>   
                    <View className="flex-row justify-end gap-2">
                        <SecondaryButton title='Cancel' onPress={handleClose} fontSize='text-md'/>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default FilterByCategoryModal;