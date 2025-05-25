export interface ReceiptItem {
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    categories?: string[];
}

export type PaymentMethod = 'Cash' | 'Card' | 'Mobile' | 'Other';

  
export interface Receipt {
    _id: string;
    user: string;
    store?: string;
    date: string;
    totalAmount: number;
    items: ReceiptItem[];
    paymentMethod?: PaymentMethod;
    note?: string;
    tags?: string[];
}

export interface CreateReceipt{
    items: ReceiptItem[];
    note?: string;
    paymentMethod?: "Cash" | "Card" | "Mobile" | "Other";
    tags?: string[];
    store?: string;
    date?: string | Date;
}

export interface MostExpensiveItem {
    name: string;
    totalPrice: number;
    date: string; 
};
  
export interface AnalysisResult {
    totalSpentThisMonth: number;
    receiptCountThisMonth: number;
    mostExpensiveItemThisMonth: MostExpensiveItem | null;
    mostSpendingCategoryThisMonth: string | null;
    mostSpendingCategoryAmountThisMonth: number;
    currentMonthName: string;
};