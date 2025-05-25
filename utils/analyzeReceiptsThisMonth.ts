import { AnalysisResult, Receipt } from '@/types/receipt';

export function analyzeReceiptsThisMonth(receipts: Receipt[]): AnalysisResult {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  let totalSpent = 0;
  let receiptCount = 0;

  let mostExpensiveItem: { item: Receipt['items'][0]; date: Date } | null = null;
  const categoryTotals: Record<string, number> = {};

  receipts.forEach((receipt) => {
    const receiptDate = new Date(receipt.date);

    if (receiptDate >= startOfMonth && receiptDate <= endOfMonth) {
      receiptCount++;
      totalSpent += receipt.totalAmount || 0;

      receipt.items.forEach((item) => {
        if (!mostExpensiveItem || item.totalPrice > mostExpensiveItem.item.totalPrice) {
          mostExpensiveItem = { item, date: receiptDate };
        }

        const categories = item.categories && item.categories.length > 0 ? item.categories : ['Other'];
        const mainCategory = categories[0]; // Only use the first category

        categoryTotals[mainCategory] = (categoryTotals[mainCategory] || 0) + item.totalPrice;
      });
    }
  });

  let maxCategory: string | null = null;
  let maxCategoryAmount = 0;
  for (const [cat, amount] of Object.entries(categoryTotals)) {
    if (amount > maxCategoryAmount) {
      maxCategoryAmount = amount;
      maxCategory = cat;
    }
  }

  return {
    totalSpentThisMonth: totalSpent,
    receiptCountThisMonth: receiptCount,
    mostExpensiveItemThisMonth: mostExpensiveItem
      ? {
          name: mostExpensiveItem.item.name,
          totalPrice: mostExpensiveItem.item.totalPrice,
          date: mostExpensiveItem.date.toLocaleString('default', { month: 'short', day: 'numeric' }),
        }
      : null,
    mostSpendingCategoryThisMonth: maxCategory,
    mostSpendingCategoryAmountThisMonth: maxCategoryAmount,
    currentMonthName: now.toLocaleString('default', { month: 'long' }) // e.g., "May"
  };
}
