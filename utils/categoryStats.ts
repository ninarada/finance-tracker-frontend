import { getMyReceipts } from '@/services/receiptsService';

export interface CategoryStats {
  name: string;
  totalSpent: number;
  mostPopularStore: string | null;
  thisMonthsSpendings: number;
}

export const fetchCategoryStatsByName = async (
    token: string,
    categoryName: string
  ): Promise<CategoryStats> => {
    const receipts = await getMyReceipts(token);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    // Filter receipts where any item includes the categoryName in categories array
    const filteredReceipts = receipts.filter(receipt =>
      receipt.items.some(item => item.categories?.includes(categoryName))
    );
  
    let totalSpent = 0;
    let thisMonthsSpendings = 0;
    const storeCounts: Record<string, number> = {};
  
    filteredReceipts.forEach(receipt => {
      const receiptTotal = receipt.totalAmount || 0;
      totalSpent += receipt.totalAmount || 0; // use totalAmount from receipt

      const receiptDate = new Date(receipt.date);
      if (receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear) {
        thisMonthsSpendings += receiptTotal;
      }
  
      const store = receipt.store || 'Unknown';
      storeCounts[store] = (storeCounts[store] || 0) + 1;
    });
  
    // Determine most popular store
    let mostPopularStore: string | null = null;
    let maxCount = 0;
  
    for (const [store, count] of Object.entries(storeCounts)) {
      if (count > maxCount) {
        mostPopularStore = store;
        maxCount = count;
      }
    }
  
    return {
      name: categoryName,
      totalSpent,
      mostPopularStore,
      thisMonthsSpendings,
    };
  };
  
