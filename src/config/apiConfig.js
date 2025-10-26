// ==================================================================================
// API Configuration File
// ==================================================================================
// Centralized configuration for the FastAPI backend connection
// Change API_BASE_URL here if your backend runs on a different port or domain
// ==================================================================================

/**
 * Base URL for the API backend
 * 
 * DEVELOPMENT:
 * - Uses relative URLs (/api/*) which will be proxied by Vercel dev server
 * - The actual Hugging Face Space URL is only in serverless functions
 * 
 * PRODUCTION:
 * - Uses relative URLs (/api/*) which are handled by Vercel serverless functions
 * - The HF Space URL and token are stored securely in environment variables
 * 
 * SECURITY NOTE:
 * - The Hugging Face Space URL and token are NEVER exposed to the frontend
 * - All API calls go through secure serverless functions
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * API Endpoints
 * All endpoints now use Vercel serverless functions for security
 * These map to the /api/* functions which proxy to Hugging Face Space
 */
export const API_ENDPOINTS = {
  HEALTH_CHECK: '/api/health',
  DETECT_JSON: '/api/predict-json',
  DETECT_IMAGE: '/api/predict-image',
};

/**
 * API Configuration Settings
 */
export const API_CONFIG = {
  // Timeout for API requests (milliseconds)
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Image upload settings
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
};

/**
 * Get full API URL for an endpoint
 * @param {string} endpoint - Endpoint key from API_ENDPOINTS
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint] || endpoint}`;
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Log API calls in development mode
 * @param {string} message - Log message
 * @param {any} data - Optional data to log
 */
export function apiLog(message, data = null) {
  if (isDevelopment()) {
    console.log(`[API] ${message}`, data || '');
  }
}

// Export default configuration object
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  getApiUrl,
  isDevelopment,
  apiLog,
};

