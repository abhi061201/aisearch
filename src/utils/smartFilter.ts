// Smart local filtering system - filters products before sending to AI
import { ICatalog } from '../interfaces/Product';
import logger from './logger';

interface FilterResult {
  filteredProducts: ICatalog[];
  filterReason: string;
  originalCount: number;
  filteredCount: number;
}

// Category keywords mapping
const CATEGORY_KEYWORDS = {
  'Healthtech and Wellness': [
    'pain', 'health', 'massage', 'therapy', 'wellness', 'medical', 'fitness', 
    'recovery', 'relief', 'treatment', 'healing', 'body', 'muscle', 'stress'
  ],
  'Personal Care': [
    'hair', 'beauty', 'care', 'styling', 'grooming', 'skin', 'personal', 
    'hygiene', 'cosmetic', 'appearance'
  ],
  'Entertainment': [
    'music', 'gaming', 'fun', 'play', 'entertainment', 'audio', 'video', 
    'kids', 'children', 'game', 'sound', 'speaker', 'headphone', 'toy'
  ],
  'Kitchen Appliances': [
    'cooking', 'kitchen', 'food', 'coffee', 'appliance', 'chef', 'cook', 
    'recipe', 'meal', 'dining', 'beverage'
  ],
  'Home Improvement': [
    'home', 'cleaning', 'vacuum', 'air', 'smart home', 'automation', 
    'house', 'clean', 'purifier', 'improvement', 'maintenance'
  ],
  'Travel & Lifestyle': [
    'travel', 'luggage', 'backpack', 'wallet', 'lifestyle', 'journey', 
    'trip', 'portable', 'mobile', 'bag', 'suitcase', 'carry', 'pack'
  ],
  'Smart Mobility': [
    'mobility', 'wheelchair', 'scooter', 'transportation', 'movement', 
    'vehicle', 'ride', 'move'
  ],
  'Security & Surveillance': [
    'security', 'camera', 'lock', 'surveillance', 'safety', 'protection', 
    'monitor', 'guard', 'secure', 'watch'
  ]
};

/**
 * Main filtering function - reduces 50+ products to 5-10 relevant ones
 */
export function filterProducts(userQuery: string, allProducts: ICatalog[]): FilterResult {
    const query = userQuery.toLowerCase();
    let filteredProducts = [...allProducts];
    const filterSteps: string[] = [];

    logger.debug('🔍 Starting filter for query:', { query: userQuery });

    // Step 1: Extract price constraints
    const priceConstraints = extractPriceConstraints(query);
    if (priceConstraints.max) {
      filteredProducts = filteredProducts.filter(p => p.price! <= priceConstraints.max!);
      filterSteps.push(`Price filter: ≤₹${priceConstraints.max}`);
      logger.debug(`💰 After price filter: ${filteredProducts.length} products`);
    }

    // Step 2: Direct keyword matching FIRST (most important)
    const directMatches = findKeywordMatches(query, filteredProducts);
    if (directMatches.length > 0) {
      filteredProducts = directMatches;
      filterSteps.push('Direct keyword matching');
      logger.debug(`🎯 After direct keyword matching: ${filteredProducts.length} products`);
    } else {
      // Step 3: Category-based filtering (fallback)
      const relevantCategories = findRelevantCategories(query);
      if (relevantCategories.length > 0) {
        const categoryFiltered = filteredProducts.filter(p => 
          relevantCategories.includes(p.category!)
        );
        if (categoryFiltered.length > 0) {
          filteredProducts = categoryFiltered;
          filterSteps.push(`Categories: ${relevantCategories.join(', ')}`);
          logger.debug(`📂 After category filter: ${filteredProducts.length} products`);
        }
      }
    }

    // Step 4: If too few results, broaden search
    if (filteredProducts.length < 3) {
      filteredProducts = broadenSearch(query, allProducts);
      filterSteps.push('Broadened search for more results');
      logger.debug(`🔄 After broadened search: ${filteredProducts.length} products`);
    }

    // Step 5: Limit to top 10 products to keep AI prompt manageable
    if (filteredProducts.length > 10) {
      filteredProducts = filteredProducts.slice(0, 10);
      filterSteps.push('Limited to top 10 products');
      logger.debug(`✂️ Limited to top 10 products`);
    }

    logger.debug('✅ Final filtered products:', { products: filteredProducts.map(p => p.product_name) });

    return {
      filteredProducts,
      filterReason: filterSteps.join(' → '),
      originalCount: allProducts.length,
      filteredCount: filteredProducts.length
    };
}

/**
 * Extract price constraints from user query
 */
function extractPriceConstraints(query: string): { max?: number; min?: number } {
    const constraints: { max?: number; min?: number } = {};
    
    // Match patterns like "under 5000", "below ₹10000", "within 15000"
    const pricePatterns = [
      /under\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i,
      /below\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i,
      /less\s+than\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i,
      /within\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i,
      /budget.*?(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i
    ];

    for (const pattern of pricePatterns) {
      const match = query.match(pattern);
      if (match) {
        constraints.max = parseInt(match[1].replace(/,/g, ''));
        break;
      }
    }

    return constraints;
}

/**
 * Find relevant categories based on user query
 */
function findRelevantCategories(query: string): string[] {
    const relevantCategories: string[] = [];

    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      const hasMatch = keywords.some(keyword => 
        query.includes(keyword)
      );
      
      if (hasMatch) {
        relevantCategories.push(category);
      }
    });

    return relevantCategories;
}

/**
 * Find products that match keywords in name/description
 */
function findKeywordMatches(query: string, products: ICatalog[]): ICatalog[] {
    const queryWords = query.split(' ').filter(word => word.length > 2);
    logger.debug('🔤 Query words:', { words: queryWords });
    
    const matches = products.filter(product => {
      const productText = `${product.product_name} ${product.description} ${product.brand}`.toLowerCase();
      
      // Check if product matches query keywords
      const matchScore = queryWords.reduce((score, word) => {
        if (productText.includes(word)) {
          // Higher score for matches in product name vs description
          const nameMatch = product.product_name!.toLowerCase().includes(word);
          return score + (nameMatch ? 3 : 1) + (word.length > 4 ? 1 : 0);
        }
        return score;
      }, 0);

      const hasMatch = matchScore > 0;
      if (hasMatch) {
        logger.debug(`✅ Match found: "${product.product_name}" (score: ${matchScore})`);
      }
      
      return hasMatch;
    }).sort((a, b) => {
      // Sort by relevance (products with more keyword matches first)
      const aText = `${a.product_name} ${a.description}`.toLowerCase();
      const bText = `${b.product_name} ${b.description}`.toLowerCase();
      
      const aScore = queryWords.reduce((score, word) => {
        const nameMatch = a.product_name!.toLowerCase().includes(word);
        const descMatch = aText.includes(word);
        return score + (nameMatch ? 3 : 0) + (descMatch ? 1 : 0);
      }, 0);
      
      const bScore = queryWords.reduce((score, word) => {
        const nameMatch = b.product_name!.toLowerCase().includes(word);
        const descMatch = bText.includes(word);
        return score + (nameMatch ? 3 : 0) + (descMatch ? 1 : 0);
      }, 0);
      
      return bScore - aScore;
    });

    logger.debug(`🎯 Found ${matches.length} direct keyword matches`);
    return matches;
}

/**
 * Broaden search when too few results found
 */
function broadenSearch(query: string, allProducts: ICatalog[]): ICatalog[] {
    // Try partial keyword matching
    const queryWords = query.split(' ').filter(word => word.length > 3);
    
    return allProducts.filter(product => {
      const productText = `${product.product_name} ${product.description}`.toLowerCase();
      
      // More lenient matching - even one word match counts
      return queryWords.some(word => 
        productText.includes(word.substring(0, 4)) // Match first 4 characters
      );
    }).slice(0, 8); // Limit to 8 products
}

/**
 * Get filter statistics for debugging
 */
export function getFilterStats(result: FilterResult): string {
    const reductionPercent = Math.round(
      ((result.originalCount - result.filteredCount) / result.originalCount) * 100
    );
    
    return `Filtered ${result.originalCount} → ${result.filteredCount} products (${reductionPercent}% reduction)`;
}
