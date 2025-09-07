export interface Recommendation {
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

export interface AIResponse {
  recommendations: Recommendation[];
  summary: string;
  error?: boolean;
}
