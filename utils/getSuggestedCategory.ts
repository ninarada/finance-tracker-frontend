import categoryKeywords, { Category } from './categoryKeywords';

export type CategoryWithOther = Category | 'Other';

export function getSuggestedCategory(itemName: string): CategoryWithOther {
  const normalizedItem = itemName.toLowerCase();

  for (const category in categoryKeywords) {
    const keywords = categoryKeywords[category as Category];
    if (keywords.some(keyword => normalizedItem.includes(keyword))) {
      return category as Category;
    }
  }

  return 'Other'; 
}
