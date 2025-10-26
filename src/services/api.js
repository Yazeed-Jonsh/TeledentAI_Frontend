// ==================================================================================
// API Service for DentalAI - FastAPI Backend Integration
// ==================================================================================
// This file contains all API calls to the FastAPI backend for dental image analysis
// Adapted from the Integration project's TypeScript api.ts file
// ==================================================================================

// Import API Configuration
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

console.log('[API] Using API Base URL:', API_BASE_URL || '(relative URLs)');
console.log('[API] Security Mode: All requests proxied through Vercel serverless functions');

/**
 * ==================================================================================
 * HELPER FUNCTION: Safely parse JSON response and detect HTML errors
 * ==================================================================================
 * This prevents "Unexpected token '<'" errors when API returns HTML instead of JSON
 */
async function safeJsonParse(response) {
  const contentType = response.headers.get('content-type');
  const responseText = await response.text();
  
  console.log('[API] Response Content-Type:', contentType);
  console.log('[API] Response status:', response.status);
  
  // Check if response is HTML (common error when routing is broken)
  if (contentType && contentType.includes('text/html')) {
    console.error('[API] ERROR: Received HTML instead of JSON!');
    console.error('[API] This usually means the API endpoint is not found or routing is misconfigured');
    console.error('[API] Response preview:', responseText.substring(0, 200));
    throw new Error('API returned HTML instead of JSON. Check if /api/* endpoints are properly configured.');
  }
  
  // Try to parse as JSON
  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error('[API] Failed to parse JSON response');
    console.error('[API] Response text:', responseText.substring(0, 500));
    throw new Error(`Invalid JSON response from API: ${error.message}`);
  }
}

/**
 * ==================================================================================
 * PRIMARY API FUNCTION: Detect dental conditions from image
 * ==================================================================================
 * Sends an image to the FastAPI backend and receives JSON results with detected objects
 * 
 * @param {string} imageDataUrl - Base64 encoded image data URL from camera/upload
 * @returns {Promise<Object>} Detection results with format:
 *   {
 *     detect_objects_names: string,  // Comma-separated list of detected objects
 *     detect_objects: Array<{        // Array of individual detections
 *       name: string,                // Name of detected condition (e.g., "Cavity", "DMF")
 *       confidence: number           // Confidence score (0-1)
 *     }>
 *   }
 * 
 * API Endpoint: POST /img_object_detection_to_json
 * This corresponds to the FastAPI endpoint in Integration/main.py
 */
export async function detectObjectsFromImage(imageDataUrl) {
  try {
    console.log('[API] detectObjectsFromImage - Starting detection request...');
    
    // ==================================================================================
    // SECURITY UPDATE: Now calls Vercel serverless function instead of direct HF API
    // The serverless function handles the Hugging Face Space communication securely
    // ==================================================================================
    
    const endpoint = `${API_BASE_URL}${API_ENDPOINTS.DETECT_JSON}`;
    console.log(`[API] Sending POST to ${endpoint}`);
    
    // ==================================================================================
    // Send JSON request with base64 image to Vercel serverless function
    // The serverless function will convert this to FormData and forward to HF Space
    // ==================================================================================
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl
      }),
    });

    if (!response.ok) {
      const errorData = await safeJsonParse(response).catch(() => ({ error: 'Unknown error' }));
      console.error(`[API] Detection request failed: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    // ==================================================================================
    // Parse and return JSON response with safe HTML detection
    // Expected format: { detect_objects_names: string, detect_objects: [{name, confidence}] }
    // ==================================================================================
    const data = await safeJsonParse(response);
    console.log('[API] Detection successful:', data);
    return data;
  } catch (error) {
    console.error('[API] Error detecting objects from image:', error);
    throw error;
  }
}

/**
 * ==================================================================================
 * SECONDARY API FUNCTION: Get annotated image with bounding boxes
 * ==================================================================================
 * Sends an image to the FastAPI backend and receives an annotated image
 * with bounding boxes drawn around detected dental conditions
 * 
 * @param {string} imageDataUrl - Base64 encoded image data URL
 * @returns {Promise<string>} Base64 encoded annotated image with bounding boxes
 * 
 * API Endpoint: POST /img_object_detection_to_img
 * This corresponds to the FastAPI endpoint in Integration/main.py
 */
export async function getAnnotatedImage(imageDataUrl) {
  try {
    console.log('[API] getAnnotatedImage - Starting annotation request...');
    
    // ==================================================================================
    // SECURITY UPDATE: Now calls Vercel serverless function instead of direct HF API
    // The serverless function handles the Hugging Face Space communication securely
    // ==================================================================================
    
    const endpoint = `${API_BASE_URL}${API_ENDPOINTS.DETECT_IMAGE}`;
    console.log(`[API] Sending POST to ${endpoint}`);
    
    // ==================================================================================
    // Send JSON request with base64 image to Vercel serverless function
    // The serverless function will convert this to FormData and forward to HF Space
    // ==================================================================================
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl
      }),
    });

    if (!response.ok) {
      const errorData = await safeJsonParse(response).catch(() => ({ error: 'Unknown error' }));
      console.error(`[API] Annotation request failed: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    // ==================================================================================
    // Parse JSON response containing the base64 annotated image with safe HTML detection
    // The serverless function returns: { image: "data:image/jpeg;base64,...", size: number }
    // ==================================================================================
    const data = await safeJsonParse(response);
    console.log(`[API] Received annotated image: ${data.size} bytes`);
    
    return data.image;
  } catch (error) {
    console.error('[API] Error getting annotated image:', error);
    throw error;
  }
}

/**
 * ==================================================================================
 * HEALTH CHECK FUNCTION: Verify FastAPI server is running
 * ==================================================================================
 * Checks if the FastAPI backend is accessible and responding
 * Useful for displaying connection status to users
 * 
 * @returns {Promise<boolean>} True if server is running, false otherwise
 * 
 * API Endpoint: GET /healthcheck
 * This corresponds to the FastAPI endpoint in Integration/main.py
 */
export async function checkApiHealth() {
  try {
    const endpoint = `${API_BASE_URL}${API_ENDPOINTS.HEALTH_CHECK}`;
    console.log('[API] Checking API health at', endpoint);
    
    // ==================================================================================
    // SECURITY UPDATE: Health Check now goes through Vercel serverless function
    // Returns: { "healthcheck": "ok", "HF_SPACE_URL": "set", "HF_TOKEN": "not set", ... }
    // This verifies the serverless function is working and environment is configured
    // ==================================================================================
    const response = await fetch(endpoint, {
      method: 'GET',
      // Add timeout using AbortController
      signal: AbortSignal.timeout(5000)  // 5 second timeout
    });
    
    if (response.ok) {
      const data = await safeJsonParse(response);
      console.log('[API] Health check passed:', data);
      return true;
    } else {
      console.warn('[API] Health check returned non-OK status:', response.status);
      const errorData = await safeJsonParse(response).catch(() => ({ error: 'Unknown error' }));
      console.warn('[API] Health check error data:', errorData);
      return false;
    }
  } catch (error) {
    console.error('[API] Health check failed:', error.message);
    return false;
  }
}

/**
 * ==================================================================================
 * BATCH PROCESSING FUNCTION: Process multiple images
 * ==================================================================================
 * Processes multiple dental images (from different views) and returns combined results
 * This is useful for the Capture page where users can take multiple views
 * 
 * @param {Object} images - Object containing image data URLs keyed by view name
 *   Example: { front: "data:image/png;base64,...", left: "data:image/png;base64,..." }
 * @returns {Promise<Object>} Results keyed by view name with detection data
 */
export async function detectObjectsFromMultipleImages(images) {
  try {
    const results = {};
    
    // Process each image view
    for (const [viewName, imageDataUrl] of Object.entries(images)) {
      if (imageDataUrl) {
        try {
          // Detect objects in this image
          const detection = await detectObjectsFromImage(imageDataUrl);
          results[viewName] = {
            success: true,
            data: detection,
          };
        } catch (error) {
          // If one image fails, mark it but continue with others
          results[viewName] = {
            success: false,
            error: error.message,
          };
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error processing multiple images:', error);
    throw error;
  }
}

/**
 * ==================================================================================
 * UTILITY FUNCTION: Get annotated images for all views
 * ==================================================================================
 * Gets annotated versions (with bounding boxes) for all captured images
 * 
 * @param {Object} images - Object containing image data URLs keyed by view name
 * @returns {Promise<Object>} Annotated images keyed by view name
 */
export async function getAnnotatedImagesForAllViews(images) {
  try {
    const annotatedImages = {};
    
    // Process each image view
    for (const [viewName, imageDataUrl] of Object.entries(images)) {
      if (imageDataUrl) {
        try {
          // Get annotated image for this view
          const annotated = await getAnnotatedImage(imageDataUrl);
          annotatedImages[viewName] = annotated;
        } catch (error) {
          console.error(`Error annotating ${viewName} image:`, error);
          // If annotation fails, use original image
          annotatedImages[viewName] = imageDataUrl;
        }
      }
    }
    
    return annotatedImages;
  } catch (error) {
    console.error('Error getting annotated images:', error);
    throw error;
  }
}

