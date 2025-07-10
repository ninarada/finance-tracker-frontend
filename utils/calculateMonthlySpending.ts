import { Receipt } from "@/types/receipt";

export const getMonthlySpending = (receipts: Receipt[], targetMonth: string): number => {
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