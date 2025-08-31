import { Receipt } from "@/types/receipt";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}


interface ValueProps {
  receipts: Receipt[];
}

const CategorySpendingPieChart: React.FC<ValueProps> = ({ receipts }) => {
  const size = 180;
  const radius = size / 2;
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const isFocused = useIsFocused();

  const categoryMap: Record<string, number> = {};

  receipts.forEach((receipt: { items: any[]; }) => {
    receipt.items.forEach((item) => {
      const categories = item.categories?.length ? item.categories : ["Other"];
      const splitAmount = item.totalPrice / categories.length;

      categories.forEach((category: string | number) => {
        categoryMap[category] = (categoryMap[category] || 0) + splitAmount;
      });
    });
  });

  const sortedEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const top5 = sortedEntries.slice(0, 5);
  const others = sortedEntries.slice(5);
  const othersTotal = others.reduce((sum, [, amount]) => sum + amount, 0);

  const pieColors = ["#5F66F5", "#BCBEFB", "#e3e4ff", "#e67eba", "#111F9A", "#FBCFE8"];

  const chartData = [...top5, ["Other", othersTotal]]
    .filter(([, amount]) => Number(amount) > 0)
    .map(([category, amount], i) => ({
      name: category,
      value: parseFloat(Number(amount).toFixed(2)),
      color: pieColors[i % pieColors.length],
    }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (!isFocused) return;
    const anim = new Animated.Value(0);
    anim.addListener(({ value }) => {
      setAnimatedProgress(value);
    });

    Animated.timing(anim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => anim.removeAllListeners();
  }, [isFocused]);

  let cumulativeAngle = 0;

  return (
    <View className="items-center justify-center py-5 ">
      <View className="flex-row">
        <Svg width={size} height={size}>
          <G x={0} y={0}>
            {chartData.map((slice, i) => {
              const startAngle = cumulativeAngle;
              const fullAngle = (slice.value / total) * 360;
              const animatedFullAngle = fullAngle * animatedProgress;
              const endAngle = startAngle + animatedFullAngle;
              cumulativeAngle += fullAngle;
              const d = describeArc(radius, radius, radius, startAngle, endAngle);
              return <Path key={i} d={d} fill={slice.color} />;
            })}
          </G>
        </Svg>

        <View className="flex-1 justify-center items-center">
          {chartData.map((slice, i) => (
            <View key={i} className="flex-row items-center mb-2 ">
              <View style={[styles.colorBox, { backgroundColor: slice.color }]}/>
              <Text className="text-sm text-slate-600 text-wrap">
                {slice.name}:   {slice.value.toFixed(2)}€
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colorBox: {
    width: 14,
    height: 14,
    marginRight: 8,
    borderRadius: 3,
  },
});

export default CategorySpendingPieChart;
