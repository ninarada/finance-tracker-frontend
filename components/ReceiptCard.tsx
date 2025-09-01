import { Receipt } from '@/types/receipt';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  receipt: Receipt;
};

const ReceiptCard: React.FC<Props> = ({ receipt }) => {
  return (
    <View>
      <Text className="text-lg font-semibold mb-1">{receipt.store || "Unknown"}</Text>
      <Text className="text-sm text-gray-500 mb-1">
        Date: {new Date(receipt.date).toLocaleDateString()}
      </Text>
      <Text className="text-sm text-gray-700 mb-2">
        Total: €{receipt.totalAmount?.toFixed(2)}
      </Text>

      <View className="flex-row border-b border-gray-200 pb-1 mb-1">
        <Text className="w-1/3 font-medium text-xs">Name</Text>
        <Text className="w-1/6 font-medium text-right text-xs">Unit</Text>
        <Text className="w-1/6 font-medium text-right text-xs">Qty</Text>
        <Text className="w-1/3 font-medium text-right text-xs">Price</Text>
      </View>

      <View className="mb-1">
        {receipt.items.slice(0, 2).map((item, i) => (
          <View key={i} className="flex-row">
            <Text className="w-1/3 text-xs text-gray-600">{item.name}</Text>
            <Text className="w-1/6 text-xs text-right text-gray-600">
              €{item.unitPrice?.toFixed(2)}
            </Text>
            <Text className="w-1/6 text-xs text-right text-gray-600">{item.quantity}</Text>
            <Text className="w-1/3 text-xs text-right text-gray-600">
              €{item.totalPrice?.toFixed(2)}
            </Text>
          </View>
        ))}

        {receipt.items.length > 2 && (
          <Text className="text-xs text-gray-400">
            + {receipt.items.length - 2} more items...
          </Text>
        )}
      </View>
    </View>
  );
};

export default ReceiptCard;
