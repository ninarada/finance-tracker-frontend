import { Receipt } from '@/types/receipt';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  receipts: Receipt[];
};

const MonthlySpendingCard = ({ receipts }: Props) => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; 
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const getMonthlySpending = (receipts: Receipt[], targetMonth: string): number => {
    let total = 0;
    receipts.forEach((receipt) => {
      const date = new Date(receipt.date);
      const receiptMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (receiptMonth === targetMonth) {
        total += receipt.totalAmount;
      }
    });
    return total;
};  

  const thisMonthSpendings = getMonthlySpending(receipts, thisMonth);
  const lastMonthSpendings = getMonthlySpending(receipts, lastMonth);

  return (
    <View className="w-full p-5 rounded-2xl bg-white shadow-sm">
      <Text className="text-2xl font-semibold text-center mb-4 text-[#174982]">
        Monthly Spending
      </Text>
      <View className="flex-row justify-evenly">
        <View >
            <Text className="mb-2 text-sm text-gray-500 uppercase tracking-wide">Last Month</Text>
            <Text className='text-3xl text-gray-500'>€{lastMonthSpendings.toFixed(2)}</Text>
        </View>
        <View className='border-r-2 border-slate-300'></View>
        <View>
            <Text className="mb-2 text-sm text-gray-600 font-bold uppercase tracking-wide">This Month</Text>
            <Text className='text-3xl text-gray-600'>€{thisMonthSpendings.toFixed(2)}</Text>
        </View>
      </View>
    </View>

  );
};

export default MonthlySpendingCard;
