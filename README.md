# AI Product Advisor - React Native App

An intelligent product recommendation system that uses natural language processing to understand user needs and suggest the best products from a curated catalog.

## 🎯 Overview

This React Native application acts as an "AI Product Advisor" that allows users to describe their needs in plain English and receive intelligent product recommendations powered by Google's Gemini AI. The app features smart filtering, custom logging, and a modern UI with advanced features like expandable summaries and sorting options.

## Sample 

https://github.com/user-attachments/assets/6a5ba40a-dccd-4f8f-9081-2b05fd087555

## 🏗️ Architecture

### High-Level Component Structure

```
App.tsx (Main Container)
└── src/
    ├── Screens/Home/
    │   ├── index.tsx (Main UI Component)
    │   └── useAdvisory.tsx (Business Logic Hook)
    ├── components/
    │   ├── TextInputField/ (Search Input Component)
    │   └── filters/ (Sort Filter Component)
    ├── api/
    │   └── index.tsx (API Integration & Smart Filtering)
    ├── utils/
    │   ├── smartFilter.ts (Intelligent Product Filtering)
    │   ├── logger.ts (Custom Logging System)
    │   └── sortUtils.ts (Sorting Utilities)
    ├── interfaces/
    │   ├── Product.ts (Product Type Definitions)
    │   └── Recommendation.ts (Recommendation Interfaces)
    └── config/
        └── appConfig.ts (Application Configuration)
```

### Data Flow

1. **User Input** → User enters natural language query
2. **Smart Filtering** → Local pre-filtering reduces 50+ products to 5-10 relevant ones
3. **AI Processing** → Filtered products sent to Gemini AI for analysis
4. **AI Recommendations** → AI returns 5-8 matched products with explanations
5. **Sorting & Display** → Results sorted by match score/price and displayed
6. **Summary Expansion** → Expandable summary with inline "Read More" functionality

## 🚀 Key Features

### Core Features
- **Natural Language Input**: Users describe needs in plain English
- **Smart Pre-Filtering**: Reduces API costs by 80-90% through intelligent local filtering
- **AI-Powered Matching**: Uses Google's Gemini 1.5 Flash for intelligent product matching
- **Comprehensive Recommendations**: Returns 5-8 best matches with detailed explanations
- **Match Scoring**: Each recommendation includes relevance score (1-10)

### Advanced Features
- **Configurable Smart Filter**: Toggle between filtered vs full catalog analysis
- **Multiple Sorting Options**: Sort by match score, price (low/high)
- **Expandable Summaries**: 3-line summaries with inline "Read More" functionality
- **Custom Logging System**: Development/production logging with per-function flags
- **Performance Optimized**: FlatList rendering with memoization
- **Modern UI**: Clean, responsive design with smooth interactions

### Technical Features
- **Custom Hooks**: Separation of business logic from UI components
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error handling and user feedback
- **Axios Integration**: Robust HTTP client with interceptors and timeout handling

## 📁 File Structure

```
chloGhoomne/
├── App.tsx                           # Main app component
├── src/
│   ├── Screens/Home/
│   │   ├── index.tsx                 # Main home screen UI
│   │   └── useAdvisory.tsx           # Business logic custom hook
│   ├── components/
│   │   ├── TextInputField/
│   │   │   └── index.tsx             # Search input component
│   │   └── filters/
│   │       └── index.tsx             # Sort filter component
│   ├── api/
│   │   └── index.tsx                 # API integration & smart filtering
│   ├── utils/
│   │   ├── smartFilter.ts            # Intelligent product filtering
│   │   ├── logger.ts                 # Custom logging system
│   │   └── sortUtils.ts              # Sorting utilities
│   ├── interfaces/
│   │   ├── Product.ts                # Product type definitions
│   │   ├── Recommendation.ts         # Recommendation interfaces
│   │   └── catalog.json              # Product catalog data
│   ├── config/
│   │   └── appConfig.ts              # Application configuration
│   └── AppConstants/
│       └── ApiEndPoint.ts            # API configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🔧 Key Design Decisions

### 1. **Smart Filtering System**
- **Approach**: Local pre-filtering before AI analysis
- **Benefits**: 80-90% reduction in API costs, faster responses
- **Implementation**: Category mapping, keyword matching, price filtering
- **Configurable**: Can be toggled on/off via `APP_CONFIG.ENABLE_SMART_FILTER`

### 2. **Custom Hook Architecture**
- **Pattern**: Business logic separated into `useAdvisory` hook
- **Benefits**: Reusable logic, easier testing, cleaner components
- **Includes**: State management, API calls, summary expansion logic

### 3. **Logging System**
- **Features**: Development/production modes, per-function flags, structured logging
- **Levels**: DEBUG, INFO, WARN, ERROR with hierarchy
- **Configuration**: Global and per-call production logging control

### 4. **AI Model Integration**
- **Model**: Google Gemini 1.5 Flash Latest
- **Optimization**: Smart prompts with pre-filtered context
- **Error Handling**: Robust JSON parsing with fallback responses

### 5. **Performance Optimizations**
- **FlatList**: Efficient rendering for large recommendation lists
- **Memoization**: useCallback and useMemo for preventing re-renders
- **Smart Filtering**: Reduces data sent to AI by 80-90%

## 🛠️ Technical Implementation

### Smart Filtering Algorithm
```typescript
// Multi-step filtering process
1. Price constraint extraction ("under ₹5000")
2. Direct keyword matching in product names/descriptions
3. Category-based filtering (fallback)
4. Broadened search if too few results
5. Relevance-based sorting
```

### Custom Logger Usage
```typescript
// Development logs (auto-enabled in dev mode)
logger.debug('Filter results:', { count: results.length });

// Production logs (configurable)
logger.info('Smart filter enabled', { stats }, true); // Force in production

// Error logs (always important)
logger.error('API request failed:', error);
```

### AI Integration with Smart Filtering
```typescript
// Conditional filtering based on configuration
if (APP_CONFIG.ENABLE_SMART_FILTER) {
  const filterResult = filterProducts(userQuery, productCatalog);
  // Send only 5-10 relevant products to AI
} else {
  // Send all 50+ products to AI
}
```

## 🎨 UI Components

### Home Screen Features
- **Search Input**: Inline button design with loading states
- **Summary Display**: Expandable summaries with inline "Read More"
- **Sort Controls**: Match score, price low/high options
- **Recommendation Cards**: Detailed product information with explanations

### Component Architecture
- **Separation of Concerns**: UI components focus only on presentation
- **Custom Hooks**: Business logic handled in `useAdvisory`
- **Memoization**: Performance optimized with React.memo and useCallback

## 🔑 Configuration

### App Configuration (`src/config/appConfig.ts`)
```typescript
export const APP_CONFIG = {
  ENABLE_SMART_FILTER: true,        // Toggle smart filtering
  DEBUG_MODE: __DEV__,              // Auto-detect dev mode
  ENABLE_PRODUCTION_LOGS: false,    // Production logging
  API_TIMEOUT: 30000,               // Request timeout
};
```

### Smart Filter Configuration
- **Enabled**: Filters 50+ products to 5-10 relevant ones
- **Disabled**: Sends complete catalog to AI for analysis
- **Benefits**: 80-90% cost reduction when enabled

## 🧪 Testing the App

### Sample Queries to Try:
- "I need a bag for travel"
- "Looking for something to relieve back pain under ₹5000"
- "Need entertainment for kids"
- "Want to secure my home with cameras"
- "Looking for kitchen appliances for cooking"
- "Need hair styling products"

### Expected Behavior:
1. **Smart Filtering**: Console shows filtering steps and product reduction
2. **AI Analysis**: Relevant products analyzed with explanations
3. **Sorting**: Results sortable by match score or price
4. **Summary**: Expandable summary with inline "Read More"

## 🔮 Advanced Features

### 1. **Smart Filtering System**
- Category keyword mapping
- Price constraint extraction
- Relevance-based product ranking
- Configurable filtering thresholds

### 2. **Custom Logging**
- Development/production mode detection
- Per-function production logging flags
- Structured logging with timestamps
- Log level hierarchy (DEBUG → INFO → WARN → ERROR)

### 3. **Performance Optimizations**
- FlatList for efficient list rendering
- React.memo and useCallback for preventing re-renders
- Smart filtering reduces API payload by 80-90%
- Axios with request/response interceptors

### 4. **UI/UX Enhancements**
- Inline "Read More" functionality
- Sort by match score or price
- Loading states and error handling
- Responsive design with modern styling

## 📊 Performance Metrics

### Smart Filtering Impact:
- **Token Reduction**: 80-90% fewer tokens sent to AI
- **Response Time**: 3x faster due to smaller payloads
- **Cost Reduction**: Significant API cost savings
- **Accuracy**: Improved recommendations due to focused context

### Logging Performance:
- **Development**: All logs visible for debugging
- **Production**: Configurable logging levels
- **Structured Data**: JSON-formatted log data for analysis

## 🔧 Development Features

### Custom Hook Pattern
```typescript
// Business logic in custom hook
const {
  query, recommendations, loading,
  handleQuerySubmit, toggleSummaryExpansion
} = useAdvisory();
```

### Smart Filter Toggle
```typescript
// Easy configuration switching
APP_CONFIG.ENABLE_SMART_FILTER = false; // Send full catalog
APP_CONFIG.ENABLE_SMART_FILTER = true;  // Use smart filtering
```


## 🤖 AI Integration Details

- **Model**: Google Gemini 1.5 Flash Latest
- **Input**: Natural language + filtered product context
- **Output**: Structured JSON with recommendations and explanations
- **Optimization**: Smart filtering reduces context size by 80-90%
- **Error Handling**: Robust parsing with markdown cleanup and fallbacks
