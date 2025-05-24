import clothing from './categories/clothing';
import electronics from './categories/electronics';
import groceries from './categories/groceries';
import pharmacy from './categories/pharmacy';
import restaurants from './categories/restaurants';

export type Category =
  | 'Groceries'
  | 'Electronics'
  | 'Clothing'
  | 'Restaurants'
  | 'Pharmacy';

export type CategoryKeywordsMap = {
  [key in Category]: string[];
};

const categoryKeywords: CategoryKeywordsMap = {
  Groceries: groceries,
  Electronics: electronics,
  Clothing: clothing,
  Restaurants: restaurants,
  Pharmacy: pharmacy,
};

export default categoryKeywords;
