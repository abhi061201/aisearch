import axios from 'axios';
import { BaseUrl, GEMINI_CONFIG } from '../AppConstants/ApiEndPoint';
import { ICatalog } from '../interfaces/Product';
import { filterProducts, getFilterStats } from '../utils/smartFilter';
import { APP_CONFIG } from '../config/appConfig';
import { logger } from '../utils/logger';

const axiosInstance = axios.create({
  baseURL: BaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
export async function getData(url?: string, params?: Record<string, any>) {
  const param = params ? `?${new URLSearchParams(params).toString()}` : '';
  const finalUrl = BaseUrl + param;

  try {
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200) {
      return await response.json();
    } else {
      throw new Error(`Exception occur ${response.status}`);
    }
  } catch (e) {
    throw new Error(`Exception occur ${e}`);
  }
}

axiosInstance.interceptors.request.use(
  config => {
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;

    // Use qs to handle nested objects/arrays properly
    const queryParams = config.params
      ? `?${new URLSearchParams(config.params).toString()}`
      : '';

    const completeUrl = `${fullUrl}${queryParams}`;

    logger.debug('=== DETAILED API REQUEST ===');
    logger.debug('Method:', { method: config.method?.toUpperCase() || 'GET' });
    logger.debug('Full URL:', { url: completeUrl });
    logger.debug('Headers:', { headers: config.headers });

    if (config.data) {
      logger.debug('Request Body:', { body: config.data });
    }

    if (config.params) {
      logger.debug('URL Parameters:', { params: config.params });
    }

    logger.debug('Timeout:', { timeout: config.timeout });
    logger.debug('============================');

    return config;
  },
  error => {
    logger.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

export async function rootApiCall<T>(
  method: 'get' | 'post',
  url: string,
  requestData: object = {},
  requestHeader: object = {},
): Promise<T> {
  logger.debug('Request data:', { data: requestData });
  try {
    let res;
    if (method == 'get') {
      res = await axiosInstance.get(url, requestData);
    } else {
      res = await axiosInstance.post(url, requestData, requestHeader);
    }
    const response = res.data;
    return response;
  } catch (e) {
    return Promise.reject({ success: false, error: e });
  }
}

export async function rootGetApiCall(url: string, config: {}): Promise<any> {
  return rootApiCall('get', url, config);
}

// AI API Integration for Product Recommendations
export async function getAIRecommendations(
  userQuery: string,
  productCatalog: ICatalog[],
) {
  const GEMINI_API_KEY = GEMINI_CONFIG.API_KEY;
  const GEMINI_API_URL = GEMINI_CONFIG.BASE_URL;

  let productsToSend: ICatalog[];
  let promptContext: string;

  if (APP_CONFIG.ENABLE_SMART_FILTER) {
    // Smart filtering enabled - reduce products from 50+ to 5-10 relevant ones
    const filterResult = filterProducts(userQuery, productCatalog);
    logger.info('🔍 Smart Filter ENABLED:', { stats: getFilterStats(filterResult) });
    logger.info('📋 Filter Logic:', { logic: filterResult.filterReason });
    
    productsToSend = filterResult.filteredProducts;
    promptContext = `Pre-filtered Products (${filterResult.filteredCount} most relevant out of ${filterResult.originalCount} total):
${JSON.stringify(filterResult.filteredProducts, null, 2)}

Filter Applied: ${filterResult.filterReason}`;
  } else {
    // Smart filtering disabled - send all products to AI
    logger.info('🚫 Smart Filter DISABLED - sending all products to AI');
    productsToSend = productCatalog;
    promptContext = `All Available Products (${productCatalog.length} total):
${JSON.stringify(productCatalog, null, 2)}

Note: No filtering applied - analyzing complete product catalog.`;
  }

  // Create prompt based on filtering status
  const prompt = `You are an AI Product Advisor. A user has described their needs${APP_CONFIG.ENABLE_SMART_FILTER ? ', and I\'ve pre-filtered the most relevant products for you to analyze' : ''}.

User Query: "${userQuery}"

${promptContext}

Instructions:
1. Analyze the user's query against these ${APP_CONFIG.ENABLE_SMART_FILTER ? 'pre-selected relevant' : 'available'} products
2. Recommend ${APP_CONFIG.ENABLE_SMART_FILTER ? '3-5' : '5-8'} best products that match their needs
3. Provide detailed explanations for each recommendation
4. Include match scores (1-10) based on how well each product fits their requirements

Return your response as a JSON object:
{
  "recommendations": [
    {
      "product": {
        "brand": "exact brand from catalog",
        "product_name": "exact product name from catalog", 
        "price": exact_price_number,
        "category": "exact category from catalog",
        "description": "exact description from catalog"
      },
      "match_score": number_between_1_and_10,
      "explanation": "detailed explanation of why this product matches the user's needs"
    }
  ],
  "summary": "brief summary of recommendations with focus on why these specific products were chosen"
}

Only return valid JSON, no additional text.`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    logger.debug('Request body:', { body: requestBody });

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      },
    );

    const data = response.data;

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Clean the response text (remove markdown formatting if present)
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\n?/, '')
          .replace(/\n?```$/, '');
      }

      try {
        const parsedResponse = JSON.parse(cleanResponse);
        return parsedResponse;
      } catch (parseError) {
        logger.error('JSON Parse Error:', parseError);
        logger.error('Raw AI Response:', { response: aiResponse });

        // Fallback response
        return {
          recommendations: [],
          summary: 'Unable to parse AI response. Please try again.',
          error: true,
        };
      }
    } else {
      throw new Error('Invalid response structure from API');
    }
  } catch (error) {
    logger.error('AI API Error:', error);

    // Handle axios-specific errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.error?.message || error.message;

      return {
        recommendations: [],
        summary: `API Error (${status}): ${errorMessage}`,
        error: true,
      };
    }

    return {
      recommendations: [],
      summary: `Error connecting to AI service: ${error.message}`,
      error: true,
    };
  }
}
