import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const CategorySpendingPieChart = ({ receipts }) => {
    const categoryMap: Record<string, number> = {};

  receipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
        const category = item.category || 'Other';
        categoryMap[category] = (categoryMap[category] || 0) + item.totalPrice;
    });
  });

  const sortedEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const top5 = sortedEntries.slice(0, 5);
  const others = sortedEntries.slice(5);
  const othersTotal = others.reduce((sum, [, amount]) => sum + amount, 0);

  const pieColors = [ "#5F66F5", "#BCBEFB", "#e3e4ff", "#e67eba", "#111F9A", "#FBCFE8", ];
  
  const chartData = [...top5, ["Other", othersTotal]]
    .filter(([, amount]) => Number(amount) > 0)
    .map(([category, amount], i) => ({
        name: category,
        population: parseFloat(Number(amount).toFixed(2)),
        color: pieColors[i % pieColors.length],
        legendFontColor: "#333",
        legendFontSize: 12,
  }));

  return (
    <View>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

export default CategorySpendingPieChart;
