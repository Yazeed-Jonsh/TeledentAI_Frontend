// ==================================================================================
// Vercel Serverless Function: Predict Image (Annotated)
// ==================================================================================
// This function returns an annotated image with bounding boxes drawn
// It proxies requests to the Hugging Face Space securely
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
  readable._read = () => {};
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
  console.log('[API Predict-Image] Environment check:');
  console.log('[API Predict-Image] HF_SPACE_URL:', HF_SPACE_URL);
  console.log('[API Predict-Image] HF_TOKEN:', HF_TOKEN ? '***SET***' : 'NOT SET');
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
    console.log('[API Predict-Image] Received prediction request (Image annotation mode)');

    // Parse the incoming request body
    let imageBuffer;
    let contentType = req.headers['content-type'] || '';
    
    console.log('[API Predict-Image] Content-Type:', contentType);

    if (contentType.includes('application/json')) {
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
      console.log(`[API Predict-Image] Converted base64 image to buffer: ${imageBuffer.length} bytes`);
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
      console.log('[API Predict-Image] Using HF_TOKEN for authentication');
    }

    console.log(`[API Predict-Image] Forwarding request to: ${HF_SPACE_URL}/img_object_detection_to_img`);

    // Create abort controller for timeout
    const AbortController = require('abort-controller');
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 second timeout

    // Forward request to Hugging Face Space
    const hfResponse = await fetch(`${HF_SPACE_URL}/img_object_detection_to_img`, {
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
        console.error('[API Predict-Image] ❌ 404 NOT FOUND ERROR');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[API Predict-Image] Requested URL:', `${HF_SPACE_URL}/img_object_detection_to_img`);
        console.error('[API Predict-Image] Method: POST');
        console.error('[API Predict-Image] HF Space URL:', HF_SPACE_URL);
        console.error('[API Predict-Image] Image size:', imageBuffer.length, 'bytes');
        console.error('[API Predict-Image] Authorization:', HF_TOKEN ? 'Bearer token included (***SET***)' : 'No token');
        console.error('[API Predict-Image] Response body:', errorText.substring(0, 500));
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[API Predict-Image] ⚠️  TROUBLESHOOTING TIPS:');
        console.error('[API Predict-Image] 1. Verify your HF Space is running at:', HF_SPACE_URL);
        console.error('[API Predict-Image] 2. Check if endpoint exists: /img_object_detection_to_img');
        console.error('[API Predict-Image] 3. Verify Space accepts POST with multipart/form-data');
        console.error('[API Predict-Image] 4. Check Space logs in Hugging Face dashboard');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return res.status(404).json({ 
          error: 'Endpoint not found on Hugging Face Space',
          details: `The endpoint ${HF_SPACE_URL}/img_object_detection_to_img returned 404`,
          requestedUrl: `${HF_SPACE_URL}/img_object_detection_to_img`,
          troubleshooting: [
            'Verify the Space is running and accessible',
            'Check if the endpoint path is correct',
            'Ensure the Space API matches the expected interface'
          ]
        });
      }
      
      // Log other errors
      console.error(`[API Predict-Image] HF API error: ${hfResponse.status} - ${hfResponse.statusText}`);
      console.error(`[API Predict-Image] URL: ${HF_SPACE_URL}/img_object_detection_to_img`);
      console.error(`[API Predict-Image] Response:`, errorText.substring(0, 500));
      
      return res.status(hfResponse.status).json({ 
        error: `Hugging Face API error: ${hfResponse.statusText}`,
        details: errorText,
        requestedUrl: `${HF_SPACE_URL}/img_object_detection_to_img`
      });
    }

    // Get the image buffer from response
    const imageResponseBuffer = await hfResponse.buffer();
    console.log(`[API Predict-Image] Successfully received annotated image: ${imageResponseBuffer.length} bytes`);

    // Convert to base64 for JSON response
    const base64Image = imageResponseBuffer.toString('base64');
    const mimeType = hfResponse.headers.get('content-type') || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Return as JSON with base64 image
    return res.status(200).json({ 
      image: dataUrl,
      size: imageResponseBuffer.length,
      mimeType: mimeType
    });

  } catch (error) {
    console.error('[API Predict-Image] Error processing image annotation request:', error.name, error.message);
    
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

