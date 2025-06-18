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
    __v?: number;               
    createdAt: string;          
    updatedAt: string; 
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
    totalAmount?: number;
}

export interface ScannedItem {
    itemName: string;
    itemQuantity: string;      
    itemTotalPrice: string;    
    itemUnitPrice: string; 
    categories?: string[];
}
  
export  interface ScannedReceipt {
    date: string;              
    items: ScannedItem[];
    location?: string;
    paymentMethod?: string;
    storeName?: string;
    totalAmount?: string;      
    note?: string;
    tags?: string[];
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