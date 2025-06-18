import { CreateReceipt, ReceiptItem, ScannedReceipt } from "@/types/receipt";

export function convertParsedReceiptToMongooseFormat(
  parsed: ScannedReceipt
): CreateReceipt {
  const convertedItems: ReceiptItem[] = parsed.items.map((item: any) => {
    const rawQty = item.itemQuantity?.toLowerCase().replace(/\s*/g, '') || '';
    let quantity = 0;

    if (rawQty.includes('x')) {
      const match = rawQty.match(/(\d+(?:\.\d+)?)[x×](\d+(?:\.\d+)?)/);
      if (match) {
        quantity = parseFloat(match[1]) * parseFloat(match[2]);
      } else {
        quantity = parseFloat(rawQty.replace(/[x×]/g, ''));
      }
    } else {
      quantity = parseFloat(rawQty);
    }

    const unitPrice = parseFloat(item.itemUnitPrice?.replace(',', '.') || '0');
    const totalPrice = parseFloat(item.itemTotalPrice?.replace(',', '.') || '0');

    const convertedItem: ReceiptItem = {
      name: item.itemName?.trim() || '',
      quantity,
      unitPrice,
      totalPrice,
      categories: Array.isArray(item.categories) ? item.categories : undefined,
    };

    return convertedItem;
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
    totalAmount: parseFloat(parsed.totalAmount?.replace(',', '.') || '0'),
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
  