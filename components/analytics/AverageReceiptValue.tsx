import { Receipt } from "@/types/receipt";
import React, { useMemo, useState } from "react";
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from 'react-native-progress';

interface AverageReceiptValueProps {
  receipts: Receipt[];
}

const fullMonths = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

const AverageReceiptValue: React.FC<AverageReceiptValueProps> = ({ receipts }) => {
    const [selectedValue, setSelectedValue] = useState<string | number>("all");
    const [modalVisible, setModalVisible] = useState(false);

    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentYear = today.getFullYear();

    const lastSixMonths = useMemo(() => {
        const months = [];
        for (let i = 0; i < 6; i++) {
            let monthIndex = currentMonth - i;
            if (monthIndex < 0) monthIndex += 12;
            months.push({ label: fullMonths[monthIndex], value: monthIndex });
        }
        return months;
    }, [currentMonth]);

    const filteredReceipts = useMemo(() => {
        if (selectedValue === "all") return receipts;
        return receipts.filter((r) => new Date(r.date).getMonth() === selectedValue);
    }, [receipts, selectedValue]);

    const { average, max } = useMemo(() => {
        if (filteredReceipts.length === 0) return { average: 0, max: 0 };
            let sum = 0;
            let maxValue = 0;
            filteredReceipts.forEach((r) => {
                sum += r.totalAmount;
                if (r.totalAmount > maxValue) maxValue = r.totalAmount;
            });
        return {
            average: sum / filteredReceipts.length,
            max: maxValue,
        };
    }, [filteredReceipts]);

    const progressPercent = max === 0 ? 0 : average / max;
    const maxLabelWidth = 70;

    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 16 * 2;
    const barWidth = screenWidth - containerPadding - maxLabelWidth - 8;

    const selectedLabel = selectedValue === "all" ? "All" : fullMonths[selectedValue as number];

    return (
        <View className="w-full bg-white rounded-2xl p-4 shadow-sm mt-5">
            <Text className="text-2xl font-semibold text-center text-[#174982] mb-4"> Average Receipt Value ({currentYear})</Text>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                }}
            >
                <Text style={{ fontSize: 16 }}>{selectedLabel}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
                <Progress.Bar
                    progress={progressPercent}
                    width={barWidth}
                    height={10}
                    borderRadius={20}
                    color="#5F66F5"
                    unfilledColor="#E5E7EB"
                />
                <View style={{ marginLeft: 8, width: maxLabelWidth, alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>Max</Text>
                    <Text style={{ fontWeight: "600", color: "#374151" }}>${max.toFixed(2)}</Text>
                </View>
            </View>

            <View
                style={{
                    position: "relative",
                    left: progressPercent * barWidth - 30,
                    width: 60,
                    alignItems: "center",
                    marginTop: -24,
                }}
            >
                <Text style={{ fontSize: 12, color: "#6B7280" }}>Avg</Text>
                <Text style={{ fontWeight: "600", color: "#374151" }}>${average.toFixed(2)}</Text>
            </View>

            <Modal visible={modalVisible} transparent animationType="slide">
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: "#00000066", justifyContent: "center" }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View className="mx-10 bg-white rounded-xl max-h-[300px]">
                        <ScrollView>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedValue("all");
                                    setModalVisible(false);
                                }}
                                style={{
                                    paddingVertical: 15,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#eee",
                                }}
                            >
                                <Text style={{ fontSize: 16 }}>All</Text>
                            </TouchableOpacity>

                        {lastSixMonths.map((option) => (
                            <TouchableOpacity
                            key={option.value.toString()}
                            onPress={() => {
                                setSelectedValue(option.value);
                                setModalVisible(false);
                            }}
                            style={{
                                paddingVertical: 15,
                                paddingHorizontal: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: "#eee",
                            }}
                            >
                            <Text style={{ fontSize: 16 }}>
                                {option.label} {currentYear}
                            </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
        </View>
    );
};

export default AverageReceiptValue;
