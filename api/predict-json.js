// ==================================================================================
// Vercel Serverless Function: Predict JSON
// ==================================================================================
// This function acts as a secure proxy between the frontend and Hugging Face API
// It prevents exposing the HF Space URL and allows for server-side rate limiting
// ==================================================================================

const fetch = require('node-fetch');
const FormData = require('form-data');
const { Readable } = require('stream');

/**
 * Convert buffer to stream for form-data
 * @param {Buffer} buffer 
 * @returns {Readable}
 */
function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}

/**
 * Main handler for the serverless function
 */
module.exports = async function handler(req, res) {
  // Get Hugging Face Space URL from environment variables
  const HF_SPACE_URL = process.env.HF_SPACE_URL || 'https://nawaf707-teledentai.hf.space';
  const HF_TOKEN = process.env.HF_TOKEN; // Optional: for private spaces

  // Log environment variables (without exposing token)
  console.log('[API Predict-JSON] Environment check:');
  console.log('[API Predict-JSON] HF_SPACE_URL:', HF_SPACE_URL);
  console.log('[API Predict-JSON] HF_TOKEN:', HF_TOKEN ? '***SET***' : 'NOT SET');
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    console.log('[API Predict-JSON] Received prediction request (JSON mode)');

    // Parse the incoming request body
    let imageBuffer;
    let contentType = req.headers['content-type'] || '';
    
    console.log('[API Predict-JSON] Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
      // If the frontend sends multipart/form-data directly
      // Note: Vercel automatically parses this, but we need to handle it
      return res.status(400).json({ 
        error: 'Please send image as base64 JSON: { "image": "data:image/jpeg;base64,..." }' 
      });
    } else if (contentType.includes('application/json')) {
      // Expect JSON with base64 image
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'Missing "image" field in request body' });
      }

      // Validate base64 format
      if (!image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Image must be a valid base64 data URL' });
      }

      // Extract base64 data
      const base64Data = image.split(';base64,').pop();
      
      if (!base64Data) {
        return res.status(400).json({ error: 'Invalid base64 image format' });
      }

      // Convert base64 to buffer
      imageBuffer = Buffer.from(base64Data, 'base64');
      console.log(`[API Predict-JSON] Converted base64 image to buffer: ${imageBuffer.length} bytes`);
    } else {
      return res.status(400).json({ 
        error: 'Content-Type must be application/json with base64 image' 
      });
    }

    // Validate image size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (imageBuffer.length > MAX_SIZE) {
      return res.status(400).json({ 
        error: `Image too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` 
      });
    }

    // Create FormData for Hugging Face API
    const form = new FormData();
    form.append('file', bufferToStream(imageBuffer), {
      filename: 'dental-image.jpg',
      contentType: 'image/jpeg'
    });

    // Build request headers
    const headers = {
      ...form.getHeaders(),
    };

    // Add authorization if HF_TOKEN is provided (for private spaces)
    if (HF_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_TOKEN}`;
      console.log('[API Predict-JSON] Using HF_TOKEN for authentication');
    }

    console.log(`[API Predict-JSON] Forwarding request to: ${HF_SPACE_URL}/img_object_detection_to_json`);

    // Create abort controller for timeout
    const AbortController = require('abort-controller');
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 second timeout

    // Forward request to Hugging Face Space
    const hfResponse = await fetch(`${HF_SPACE_URL}/img_object_detection_to_json`, {
      method: 'POST',
      body: form,
      headers: headers,
      signal: controller.signal
    });

    clearTimeout(timeout);

    // Enhanced error handling with detailed logging for debugging
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      
      // Special handling for 404 errors - log everything for debugging
      if (hfResponse.status === 404) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[API Predict-JSON] ❌ 404 NOT FOUND ERROR');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[API Predict-JSON] Requested URL:', `${HF_SPACE_URL}/img_object_detection_to_json`);
        console.error('[API Predict-JSON] Method: POST');
        console.error('[API Predict-JSON] HF Space URL:', HF_SPACE_URL);
        console.error('[API Predict-JSON] Image size:', imageBuffer.length, 'bytes');
        console.error('[API Predict-JSON] Authorization:', HF_TOKEN ? 'Bearer token included (***SET***)' : 'No token');
        console.error('[API Predict-JSON] Response body:', errorText.substring(0, 500));
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[API Predict-JSON] ⚠️  TROUBLESHOOTING TIPS:');
        console.error('[API Predict-JSON] 1. Verify your HF Space is running at:', HF_SPACE_URL);
        console.error('[API Predict-JSON] 2. Check if endpoint exists: /img_object_detection_to_json');
        console.error('[API Predict-JSON] 3. Verify Space accepts POST with multipart/form-data');
        console.error('[API Predict-JSON] 4. Check Space logs in Hugging Face dashboard');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return res.status(404).json({ 
          error: 'Endpoint not found on Hugging Face Space',
          details: `The endpoint ${HF_SPACE_URL}/img_object_detection_to_json returned 404`,
          requestedUrl: `${HF_SPACE_URL}/img_object_detection_to_json`,
          troubleshooting: [
            'Verify the Space is running and accessible',
            'Check if the endpoint path is correct',
            'Ensure the Space API matches the expected interface'
          ]
        });
      }
      
      // Log other errors
      console.error(`[API Predict-JSON] HF API error: ${hfResponse.status} - ${hfResponse.statusText}`);
      console.error(`[API Predict-JSON] URL: ${HF_SPACE_URL}/img_object_detection_to_json`);
      console.error(`[API Predict-JSON] Response:`, errorText.substring(0, 500));
      
      return res.status(hfResponse.status).json({ 
        error: `Hugging Face API error: ${hfResponse.statusText}`,
        details: errorText,
        requestedUrl: `${HF_SPACE_URL}/img_object_detection_to_json`
      });
    }

    // Parse and return the JSON response
    const result = await hfResponse.json();
    console.log('[API Predict-JSON] Successfully received prediction results');
    
    // Validate response structure
    if (!result.detect_objects_names && !result.detect_objects) {
      console.warn('[API Predict-JSON] Unexpected response format from HF API');
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('[API Predict-JSON] Error processing prediction request:', error.name, error.message);
    
    // Handle abort/timeout
    if (error.name === 'AbortError') {
      return res.status(503).json({ 
        error: 'Request timeout (30 seconds)',
        details: 'The AI service took too long to respond'
      });
    }
    
    // Handle specific error types
    if (error.name === 'FetchError') {
      return res.status(503).json({ 
        error: 'Unable to reach AI service. Please try again later.',
        details: error.message
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

