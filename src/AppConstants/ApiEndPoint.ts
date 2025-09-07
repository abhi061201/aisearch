// API Configuration
export const BaseUrl = 'https://api.example.com'; // Replace with your actual base URL

// Gemini AI Configuration
export const GEMINI_CONFIG = {
  API_KEY: 'AIzaSyAZEBJhvC2u**this is wrong api key**80',
  BASE_URL:
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
};

// Alternative AI APIs (you can switch between these)
export const OPENAI_CONFIG = {
  API_KEY: 'YOUR_OPENAI_API_KEY',
  BASE_URL: 'https://api.openai.com/v1/chat/completions',
};

export const ANTHROPIC_CONFIG = {
  API_KEY: 'YOUR_ANTHROPIC_API_KEY',
  BASE_URL: 'https://api.anthropic.com/v1/messages',
};
