import { getMyReceipts } from '@/services/receiptsService';

export interface CategoryStats {
  name: string;
  totalSpent: number;
  mostPopularStore: string | null;
}

export const fetchCategoryStatsByName = async (
    token: string,
    categoryName: string
  ): Promise<CategoryStats> => {
    const receipts = await getMyReceipts(token);
  
    // Filter receipts where any item includes the categoryName in categories array
    const filteredReceipts = receipts.filter(receipt =>
      receipt.items.some(item => item.categories?.includes(categoryName))
    );
  
    let totalSpent = 0;
    const storeCounts: Record<string, number> = {};
  
    filteredReceipts.forEach(receipt => {
      totalSpent += receipt.totalAmount || 0; // use totalAmount from receipt
  
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
    };
  };
  
