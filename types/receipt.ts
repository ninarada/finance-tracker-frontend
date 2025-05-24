export interface ReceiptItem {
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    categories?: string[];
}
  
export interface Receipt {
    _id: string;
    store: string;
    date: string;
    totalAmount: number;
    items: ReceiptItem[];
    paymentMethod?: string;
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