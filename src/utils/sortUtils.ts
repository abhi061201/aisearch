import { SortOption } from '../components/filters';

interface Recommendation {
  product: {
    brand: string;
    product_name: string;
    price: number;
    category: string;
    description: string;
  };
  match_score: number;
  explanation: string;
}

/**
 * Sort recommendations based on selected option
 */
export function sortRecommendations(
  recommendations: Recommendation[],
  sortOption: SortOption
): Recommendation[] {
  const sortedRecommendations = [...recommendations];

  switch (sortOption) {
    case 'match_score':
      return sortedRecommendations.sort((a, b) => b.match_score - a.match_score);
    
    case 'price_low_to_high':
      return sortedRecommendations.sort((a, b) => a.product.price - b.product.price);
    
    case 'price_high_to_low':
      return sortedRecommendations.sort((a, b) => b.product.price - a.product.price);
    
    default:
      return sortedRecommendations;
  }
}

/**
 * Get sort description for UI feedback
 */
export function getSortDescription(sortOption: SortOption): string {
  switch (sortOption) {
    case 'match_score':
      return 'Sorted by best match to your needs';
    case 'price_low_to_high':
      return 'Sorted by price: lowest first';
    case 'price_high_to_low':
      return 'Sorted by price: highest first';
    default:
      return 'Default sorting';
  }
}
