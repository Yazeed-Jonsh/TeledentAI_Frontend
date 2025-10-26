// ==================================================================================
// Vercel Serverless Function: Health Check
// ==================================================================================
// Returns the health status of the API and environment configuration
// This endpoint works independently and doesn't require the HF Space to be running
// ==================================================================================

/**
 * Main handler for the serverless function
 */
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // Get environment variables
    const HF_SPACE_URL = process.env.HF_SPACE_URL || '';
    const HF_TOKEN = process.env.HF_TOKEN || '';

    // Log environment check (without exposing sensitive data)
    console.log('[API Health] Health check requested');
    console.log('[API Health] HF_SPACE_URL:', HF_SPACE_URL ? 'SET' : 'NOT SET');
    console.log('[API Health] HF_TOKEN:', HF_TOKEN ? 'SET' : 'NOT SET');

    // Build response
    const response = {
      healthcheck: 'ok',
      HF_SPACE_URL: HF_SPACE_URL ? 'set' : 'not set',
      HF_TOKEN: HF_TOKEN ? 'set' : 'not set',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    // If HF_SPACE_URL is set, include it (but not the token)
    if (HF_SPACE_URL) {
      response.HF_SPACE_URL_value = HF_SPACE_URL;
    }

    console.log('[API Health] Response:', response);

    return res.status(200).json(response);

  } catch (error) {
    console.error('[API Health] Error:', error.name, error.message);
    
    return res.status(500).json({ 
      healthcheck: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

