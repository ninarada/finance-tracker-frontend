import { Receipt } from '@/types/receipt';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

type MonthlySpending = {
    month: string; 
    total: number;
};

type Props = {
  receipts: Receipt[];
};

function getMonthlySpendingLast4Months(receipts: Receipt[]): MonthlySpending[] {
    const now = new Date();
    const monthlyTotals = Array(4).fill(0);
    receipts.forEach((receipt) => {
      const date = new Date(receipt.date);
      const diffMonth = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      if (diffMonth >= 0 && diffMonth < 4) {
        monthlyTotals[3 - diffMonth] += receipt.totalAmount;
      }
    });
    const result: MonthlySpending[] = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      result.push({
        month: label,
        total: parseFloat(monthlyTotals[3 - i].toFixed(2)),
      });
    }
    return result;
}

const MonthsBarChart: React.FC<Props> = ({ receipts }) =>  {
    const spending = getMonthlySpendingLast4Months(receipts);
    const totalSum = spending.reduce((acc, m) => acc + m.total, 0);
    const fadeAnim = useRef(new Animated.Value(0)).current; 
    const scaleAnim = useRef(new Animated.Value(0.8)).current; 

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true, }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true, }),
      ]).start();
    }, [fadeAnim, scaleAnim]);

    if (totalSum === 0) {
        return <Text className="text-gray-500 mt-10 text-center">No data available for the last 4 months.</Text>;
    }

    const chartData = {
        labels: spending.map(s => s.month),
        datasets: [ { data: spending.map(s => s.total), }, ],
    };

    return (
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scaleY: scaleAnim }], }}
          className='pr-2 py-4 h-64 w-96 bg-white rounded-3xl justify-center items-center'
        >
          <BarChart
              data={chartData}
              width={screenWidth - 90}
              height={200}
              yAxisLabel="€"
              yAxisSuffix="" 
              chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(119, 123, 247, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForLabels: {
                      fontSize: 10,
                    }
              }}
              style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: 'white',
              }}
              fromZero
          />
        </Animated.View>
    );
};

export default MonthsBarChart;
