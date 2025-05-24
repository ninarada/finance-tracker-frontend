// pozovi sa:  convertParsedReceiptToMongooseFormat(parsedReceipt);

interface ParsedItem {
    itemName: string;
    itemQuantity: string; 
    itemUnitPrice: string; 
    itemTotalPrice: string; 
  }
  
  interface ParsedReceipt {
    date: string; 
    items: ParsedItem[];
    location?: string;
    paymentMethod?: string;
    storeName?: string;
    totalAmount?: string;
    note?: string;
    tags?: string[];
  }
  
  interface ConvertedItem {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category?: string;
  }
  
  interface ReceiptData {
    date: Date;
    items: ConvertedItem[];
    totalAmount?: number;
    note?: string;
    paymentMethod?: 'Cash' | 'Card' | 'Mobile' | 'Other';
    tags?: string[];
    store?: string;
  }
  
  export function convertParsedReceiptToMongooseFormat(
    parsed: ParsedReceipt
  ): ReceiptData {
    const convertedItems: ConvertedItem[] = parsed.items.map((item) => {
      // Normalize and clean quantity: remove 'x', 'X', and surrounding spaces
      const rawQty = item.itemQuantity.toLowerCase().replace(/\s*/g, '');
      let quantity = 0;
  
      if (rawQty.includes('x')) {
        // Match formats like '3x' or 'x3' or '3x1'
        const match = rawQty.match(/(\d+(?:\.\d+)?)[x×](\d+(?:\.\d+)?)/);
        if (match) {
          quantity = parseFloat(match[1]) * parseFloat(match[2]);
        } else {
          quantity = parseFloat(rawQty.replace(/[x×]/g, ''));
        }
      } else {
        quantity = parseFloat(rawQty);
      }
  
      const unitPrice = parseFloat(item.itemUnitPrice.replace(',', '.')) || 0;
      const totalPrice = parseFloat(item.itemTotalPrice.replace(',', '.')) || 0;
  
      return {
        name: item.itemName.trim(),
        quantity,
        unitPrice,
        totalPrice,
      };
    });
  
    const [day, month, year] = parsed.date.split('.');
    const isoDate = new Date(`${year}-${month}-${day}`);
  
    return {
      date: isoDate,
      items: convertedItems,
      note: parsed.note || '',
      paymentMethod: convertPaymentMethod(parsed.paymentMethod),
      tags: parsed.tags || [],
      store: parsed.storeName || '',
    };
  }
  
  function convertPaymentMethod(method?: string): 'Cash' | 'Card' | 'Mobile' | 'Other' {
    if (!method) return 'Other';
  
    const normalized = method.toUpperCase();
  
    if (normalized.includes('GOTOVINA')) return 'Cash';
    if (normalized.includes('KARTICA')) return 'Card';
    if (normalized.includes('MOBILNO')) return 'Mobile';
  
    return 'Other';
  }
  