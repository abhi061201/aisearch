// Application configuration settings
export const APP_CONFIG = {
  // Smart Filter Configuration
  ENABLE_SMART_FILTER: true, // Set to false to send full product list to AI
  
  // Logger Configuration
  DEBUG_MODE: __DEV__, // Automatically detects dev mode
  ENABLE_PRODUCTION_LOGS: false, // Set to true to show logs in production builds
  
  // API Configuration
  API_TIMEOUT: 30000,
};
