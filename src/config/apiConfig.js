// ==================================================================================
// API Configuration File
// ==================================================================================
// Centralized configuration for the FastAPI backend connection
// Change API_BASE_URL here if your backend runs on a different port or domain
// ==================================================================================

/**
 * Base URL for the FastAPI backend
 * 
 * DEVELOPMENT:
 * - Default: http://localhost:8000 (FastAPI default port)
 * - If you change the FastAPI port, update this URL
 * 
 * PRODUCTION:
 * - Replace with your production API domain
 * - Example: https://api.dentalai.com
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://nawaf707-teledentai.hf.space';

/**
 * API Endpoints
 * All endpoints relative to API_BASE_URL
 */
export const API_ENDPOINTS = {
  HEALTH_CHECK: '/healthcheck',
  DETECT_JSON: '/img_object_detection_to_json',
  DETECT_IMAGE: '/img_object_detection_to_img',
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

