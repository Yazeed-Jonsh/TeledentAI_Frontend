// ==================================================================================
// API Service for DentalAI - FastAPI Backend Integration
// ==================================================================================
// This file contains all API calls to the FastAPI backend for dental image analysis
// Adapted from the Integration project's TypeScript api.ts file
// ==================================================================================

// Import API Configuration
import { API_BASE_URL } from '../config/apiConfig';

console.log('[API] Using API Base URL:', API_BASE_URL);

/**
 * ==================================================================================
 * HELPER FUNCTION: Convert base64 image data URL to Blob for API upload
 * ==================================================================================
 * This function extracts the base64 data and converts it to a Blob object
 * that can be sent in FormData to the FastAPI backend
 * 
 * @param {string} base64 - Base64 encoded image data URL (e.g., "data:image/jpeg;base64,...")
 * @returns {Blob} - Image blob ready for FormData upload
 * 
 * Process:
 * 1. Split the data URL to extract content type and base64 data
 * 2. Decode base64 string using atob()
 * 3. Convert to Uint8Array for binary data
 * 4. Create Blob with correct MIME type
 */
function base64ToBlob(base64) {
  try {
    // Extract content type (e.g., "image/jpeg") and base64 data
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    
    // Decode base64 to binary string
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    
    // Convert binary string to typed array
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    // Create and return Blob with correct MIME type
    const blob = new Blob([uInt8Array], { type: contentType });
    console.log(`[API] Converted base64 to blob: ${contentType}, size: ${blob.size} bytes`);
    return blob;
  } catch (error) {
    console.error('[API] Error converting base64 to blob:', error);
    throw new Error('Failed to convert image data for upload');
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
    // Step 1: Convert base64 image to Blob
    // The API expects a file upload, so we convert the base64 data URL to a Blob
    // ==================================================================================
    const blob = base64ToBlob(imageDataUrl);
    
    // ==================================================================================
    // Step 2: Create FormData with 'file' parameter
    // FastAPI's File(...) parameter expects a multipart/form-data upload
    // The parameter name MUST be 'file' to match the FastAPI endpoint signature
    // ==================================================================================
    const formData = new FormData();
    formData.append('file', blob, 'dental-image.jpg');  // filename is required for proper MIME handling

    console.log('[API] Sending POST to /img_object_detection_to_json...');
    
    // ==================================================================================
    // Step 3: Send POST request to FastAPI detection endpoint
    // Endpoint: POST /img_object_detection_to_json
    // Returns: JSON with detect_objects_names and detect_objects array
    // ==================================================================================
    const response = await fetch(`${API_BASE_URL}/img_object_detection_to_json`, {
      method: 'POST',
      body: formData,
      // Note: Do NOT set Content-Type header - browser will set it automatically
      // with the correct boundary for multipart/form-data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Detection request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    // ==================================================================================
    // Step 4: Parse and return JSON response
    // Expected format: { detect_objects_names: string, detect_objects: [{name, confidence}] }
    // ==================================================================================
    const data = await response.json();
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
    // Step 1: Convert base64 image to Blob
    // ==================================================================================
    const blob = base64ToBlob(imageDataUrl);
    
    // ==================================================================================
    // Step 2: Create FormData with 'file' parameter
    // ==================================================================================
    const formData = new FormData();
    formData.append('file', blob, 'dental-image.jpg');

    console.log('[API] Sending POST to /img_object_detection_to_img...');
    
    // ==================================================================================
    // Step 3: Send POST request to FastAPI annotation endpoint
    // Endpoint: POST /img_object_detection_to_img
    // Returns: JPEG image with bounding boxes drawn (StreamingResponse)
    // ==================================================================================
    const response = await fetch(`${API_BASE_URL}/img_object_detection_to_img`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Annotation request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    // ==================================================================================
    // Step 4: Convert response image blob back to base64 data URL
    // The API returns a JPEG image with bounding boxes drawn on it
    // We convert it back to base64 so it can be displayed in <img> tags
    // ==================================================================================
    const imageBlob = await response.blob();
    console.log(`[API] Received annotated image: ${imageBlob.size} bytes`);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('[API] Annotation successful - image converted to base64');
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error('[API] Error converting annotated image to base64:', error);
        reject(error);
      };
      reader.readAsDataURL(imageBlob);
    });
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
    console.log('[API] Checking API health at', `${API_BASE_URL}/healthcheck`);
    
    // ==================================================================================
    // Health Check Endpoint: GET /healthcheck
    // Returns: { "healthcheck": "Everything OK!" }
    // This verifies that the FastAPI server is running and responsive
    // ==================================================================================
    const response = await fetch(`${API_BASE_URL}/healthcheck`, {
      method: 'GET',
      // Add timeout using AbortController
      signal: AbortSignal.timeout(5000)  // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[API] Health check passed:', data);
      return true;
    } else {
      console.warn('[API] Health check returned non-OK status:', response.status);
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

