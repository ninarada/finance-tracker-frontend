import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

type DataPoint = {
  date: string;
  total: number;
};

type Props = {
  data: DataPoint[];
  category: String;
  timeFrame: number;
};

const SpendingLineChart: React.FC<Props> = ({ data, category, timeFrame }) => {
    const cumulativeTotals: number[] = [];
    let runningTotal = 0;
    let chosenData = data;

    if(timeFrame<12) {
        chosenData = data.filter((receipt) => {
            const date = new Date(receipt.date);
            return date.getMonth() == timeFrame;
        })
        if (chosenData.length < 1) {
            return (<Text className="text-gray-500 mt-10">No data available.</Text>);
        }
    }
    

    chosenData.forEach((d) => {
        runningTotal += d.total;
        cumulativeTotals.push(parseFloat(runningTotal.toFixed(2))); 
    });

    const chartData = {
        labels: chosenData.map(d => d.date.slice(5)), // MM-DD
        datasets: [
          {
            data: cumulativeTotals,
          },
        ],
    };

  return (
    <View className="w-full">
        <LineChart
            data={chartData}
            width={screenWidth - 48} 
            height={220}
            yAxisLabel="€"
            chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(119, 123, 247, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#8184e6",
                },
            }}
            bezier
            style={{
                borderRadius: 10,
                backgroundColor: '#fff',
                padding: 10,
                margin: 10,
                alignItems: 'center',
            }}
      />
    </View>
  );
};

export default SpendingLineChart;
