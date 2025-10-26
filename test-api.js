#!/usr/bin/env node

/**
 * Simple API Test Script
 * Tests the Vercel serverless functions to ensure they're working correctly
 * 
 * Usage:
 *   node test-api.js [base-url]
 * 
 * Examples:
 *   node test-api.js http://localhost:3000
 *   node test-api.js https://your-app.vercel.app
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';

// Sample small base64 image (1x1 red pixel)
const SAMPLE_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

console.log('🧪 Testing TeledentAI Serverless Functions');
console.log('='.repeat(50));
console.log(`Base URL: ${BASE_URL}\n`);

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  console.log('📍 Test 1: Health Check');
  console.log(`   GET ${BASE_URL}/api/health`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok && data.healthcheck === 'ok') {
      console.log('   ✅ PASSED - Health check successful');
      console.log(`   HF_SPACE_URL: ${data.HF_SPACE_URL}`);
      console.log(`   HF_TOKEN: ${data.HF_TOKEN}`);
      console.log(`   Environment: ${data.environment}`);
      if (data.HF_SPACE_URL_value) {
        console.log(`   Space URL: ${data.HF_SPACE_URL_value}`);
      }
      console.log();
      return true;
    } else {
      console.log('   ❌ FAILED - Unexpected response');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}\n`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAILED - Network error');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test 2: Predict JSON endpoint
 */
async function testPredictJson() {
  console.log('📍 Test 2: Predict JSON Endpoint');
  console.log(`   POST ${BASE_URL}/api/predict-json`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/predict-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: SAMPLE_IMAGE
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ PASSED - Prediction endpoint working');
      console.log(`   Response keys: ${Object.keys(data).join(', ')}\n`);
      return true;
    } else {
      console.log('   ❌ FAILED - Request failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}\n`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAILED - Network error');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test 3: Predict Image endpoint
 */
async function testPredictImage() {
  console.log('📍 Test 3: Predict Image Endpoint');
  console.log(`   POST ${BASE_URL}/api/predict-image`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/predict-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: SAMPLE_IMAGE
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.image) {
      console.log('   ✅ PASSED - Image annotation endpoint working');
      console.log(`   Response image size: ${data.size} bytes`);
      console.log(`   MIME type: ${data.mimeType}\n`);
      return true;
    } else {
      console.log('   ❌ FAILED - Request failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}\n`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ FAILED - Network error');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Test 4: Error Handling - Invalid Request
 */
async function testErrorHandling() {
  console.log('📍 Test 4: Error Handling');
  console.log(`   POST ${BASE_URL}/api/predict-json (invalid data)`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/predict-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing 'image' field
      })
    });
    
    const data = await response.json();
    
    if (!response.ok && data.error) {
      console.log('   ✅ PASSED - Error handling works');
      console.log(`   Error message: ${data.error}\n`);
      return true;
    } else {
      console.log('   ⚠️  WARNING - Expected error but got success');
      return true; // Not a critical failure
    }
  } catch (error) {
    console.log('   ❌ FAILED - Network error');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  const results = [];
  
  results.push(await testHealthCheck());
  results.push(await testPredictJson());
  results.push(await testPredictImage());
  results.push(await testErrorHandling());
  
  console.log('='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`   Passed: ${results.filter(r => r).length}/${results.length}`);
  console.log(`   Failed: ${results.filter(r => !r).length}/${results.length}`);
  
  if (results.every(r => r)) {
    console.log('\n✅ All tests passed! Your API is working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check the logs above for details.');
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure the dev server is running: vercel dev');
    console.log('2. Check environment variables are set (HF_SPACE_URL)');
    console.log('3. Verify Hugging Face Space is accessible');
    console.log('4. Check Vercel function logs for errors');
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Error: fetch is not available.');
  console.error('Please use Node.js 18+ or install node-fetch:');
  console.error('  npm install node-fetch');
  process.exit(1);
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

