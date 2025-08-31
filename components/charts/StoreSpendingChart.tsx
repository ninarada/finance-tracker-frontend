import { Receipt } from "@/types/receipt";
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface StoreSpendingChartProps {
    receipts: Receipt[];
}

const screenWidth = Dimensions.get("window").width;

const StoreSpendingChart: React.FC<StoreSpendingChartProps> = ({ receipts }) => {
    const pieColors = ["#5F66F5", "#BCBEFB", "#e3e4ff", "#e67eba", "#111F9A", "#FBCFE8"];
    let colorIndex = 0;

    const storeData = useMemo(() => {
        const totals: Record<string, number> = {};
        receipts.forEach(({ store, totalAmount }) => {
          if (!store) return;
          totals[store] = (totals[store] || 0) + totalAmount;
        });
        const sortedStores = Object.entries(totals).sort(([, a], [, b]) => b - a);
        const topStores = sortedStores.slice(0, 4);
        const otherSum = sortedStores.slice(4).reduce((sum, [, total]) => sum + total, 0);
        const data = topStores.map(([store, total]) => ({
          name: `€   ${store}`,
          amount: Number(total.toFixed(2)),
          color: getRandomColor(),
          legendFontColor: "#333",
          legendFontSize: 12,
        }));
        if (otherSum > 0) {
          data.push({
            name: "€  Other",
            amount: Number(otherSum.toFixed(2)),
            color: getRandomColor(),
            legendFontColor: "#333",
            legendFontSize: 12,
          });
        }
        return data;
    }, [receipts]);

    if (storeData.length === 0) {
        return <Text className="text-center text-gray-500 mt-5">No store data available.</Text>;
    }
    
    function getRandomColor() {
        const color = pieColors[colorIndex];
        colorIndex = (colorIndex + 1) % pieColors.length; 
        return color;
    }

    return (
        <View className="mt-5 w-full py-2 px-3 rounded-2xl bg-white shadow-sm ">
            <Text className="text-2xl font-semibold text-center mt-5 mb-4 text-[#174982]">
                Spending by Store
            </Text>
            <PieChart
                data={storeData}
                width={screenWidth - 70}
                height={220}
                chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(23, 73, 130, ${opacity})`,
                }}
                accessor={"amount"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
            />
        </View>
    );
};

export default StoreSpendingChart;
