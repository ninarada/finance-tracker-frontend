export interface ReceiptItem {
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
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