import { getMyReceipts } from '@/services/receiptsService';
import { Receipt } from '@/types/receipt';
export interface CategoryStats {
  name: string;
  totalSpent: number;
  mostPopularStore: string | null;
  thisMonthsSpendings: number;
}

export const fetchCategoryStatsByName = async(categoryName:string):Promise<CategoryStats> => {
  const receipts = await getMyReceipts();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const filteredReceipts = receipts.filter((receipt: Receipt) =>
    receipt.items.some(item => item.categories?.includes(categoryName))
  );
  let totalSpent = 0;
  let thisMonthsSpendings = 0;
  const storeCounts: Record<string, number> = {};
  
  filteredReceipts.forEach((receipt: Receipt) => {
    const matchingItems = receipt.items.filter(item => item.categories?.includes(categoryName));
    const matchingTotal = matchingItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    totalSpent += matchingTotal;
    const receiptDate = new Date(receipt.date);
    if ( receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear) {
      thisMonthsSpendings += matchingTotal;
    }
    const store = receipt.store || 'Unknown';
    storeCounts[store] = (storeCounts[store] || 0) + 1;
  });
  
  let mostPopularStore: string | null = null;
  let maxCount = 0;
  for (const [store, count] of Object.entries(storeCounts)) {
    if (count > maxCount) {
      mostPopularStore = store;
      maxCount = count;
    }
  }
  
  return { name: categoryName, totalSpent, mostPopularStore, thisMonthsSpendings, };
};