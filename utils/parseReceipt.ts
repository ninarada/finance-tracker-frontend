export interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  
  export const extractItemsFromText = (text: string): ReceiptItem[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const items: ReceiptItem[] = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
  
      if (
        line.toLowerCase().includes("račun") ||
        line.toLowerCase().includes("artikel") ||
        line.toLowerCase().includes("kol") ||
        line.toLowerCase().includes("ddv") ||
        line.toLowerCase().includes("skupaj") ||
        line.toLowerCase().includes("način plačila") ||
        line.toLowerCase().includes("za plačilo") ||
        line.toLowerCase().includes("www") ||
        line.toLowerCase().includes("hvala")
      ) {
        continue;
      }
  
      const isMaybeItem = /^[A-ZČŠŽa-zčšž\s]+$/.test(line) && line.length > 1;
      const next1 = lines[i + 1];
      const next2 = lines[i + 2];
      const next3 = lines[i + 3];
  
      const quantityMatch = next2?.match(/^(\d+)x$/i);
      const unitPrice = next1 ? parseFloat(next1.replace(',', '.')) : NaN;
      const totalPrice = next3 ? parseFloat(next3.replace(',', '.')) : NaN;
  
      if (isMaybeItem && quantityMatch && !isNaN(unitPrice) && !isNaN(totalPrice)) {
        const name = line.trim();
        const quantity = parseInt(quantityMatch[1], 10);
  
        items.push({
          name,
          quantity,
          unitPrice,
          totalPrice,
        });
      }
    }
  
    return items;
  };
  