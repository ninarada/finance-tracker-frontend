// components/ReceiptModal.tsx
import { Receipt } from "@/types/receipt";
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface ReceiptModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!receipt}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View className="bg-white w-full rounded-2xl p-5">
          <Text className="text-xl font-bold mb-2">{receipt?.store || "Receipt"}</Text>
          <Text className="text-sm text-gray-500 mb-2">
            Date: {receipt ? new Date(receipt.date).toLocaleDateString() : ""}
          </Text>

          <View className="mb-3 border-b border-gray-200">
            <View className="flex-row border-b border-gray-200 pb-1 mb-1">
              <Text className="w-1/3 font-semibold">Name</Text>
              <Text className="w-1/6 font-semibold text-right">Unit</Text>
              <Text className="w-1/6 font-semibold text-right">Qty</Text>
              <Text className="w-1/3 font-semibold text-right">Price</Text>
            </View>

            {receipt?.items.map((item, i) => (
              <View key={i} className="py-2">
                <View className="flex-row">
                  <Text className="w-1/3 text-gray-700">{item.name}</Text>
                  <Text className="w-1/6 text-right text-gray-700">€{item.unitPrice?.toFixed(2)}</Text>
                  <Text className="w-1/6 text-right text-gray-700">{item.quantity}</Text>
                  <Text className="w-1/3 text-right text-gray-700">€{item.totalPrice?.toFixed(2)}</Text>
                </View>
                {Array.isArray(item.categories) && item.categories?.length > 0 && (
                  <Text className="text-xs text-gray-500 pl-1 my-1">
                    Categories: {item.categories.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {receipt?.totalAmount && (
            <Text className="text-gray-800 text-right mb-2">Total: €{receipt.totalAmount.toFixed(2)}</Text>
          )}
          <Text className="text-sm text-gray-500 mb-1">Payment: {receipt?.paymentMethod}</Text>

          {receipt?.note && (
            <Text className="text-xs text-gray-400 italic mb-2">Note: {receipt.note}</Text>
          )}
          {Array.isArray(receipt?.tags) && receipt?.tags?.length > 0 && (
            <Text className="text-xs text-gray-500 mb-2">Tags: {receipt.tags.join(", ")}</Text>
          )}

          <Pressable
            className="mt-3 bg-primary-250 px-4 py-2 rounded-xl"
            onPress={onClose}
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ReceiptModal;
