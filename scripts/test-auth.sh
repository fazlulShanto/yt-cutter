#!/bin/bash

# Authentication System Test Script

set -e

echo "🧪 Testing YT-Cutter Authentication System"
echo "==========================================="
echo ""

# Get admin key from .env
ADMIN_KEY=$(grep ADMIN_KEY .env | cut -d '=' -f2)

if [ -z "$ADMIN_KEY" ]; then
    echo "❌ ADMIN_KEY not found in .env file"
    exit 1
fi

echo "✓ Admin key loaded from .env"
echo ""

# Test 1: Create API Key
echo "📝 Test 1: Creating API Key..."
RESPONSE=$(curl -s -X POST http://localhost:3000/admin/api-keys \
    -H "Content-Type: application/json" \
    -H "x-admin-key: $ADMIN_KEY" \
    -d '{"name":"Test Key","maxConcurrent":2}')

echo "Response: $RESPONSE"

# Extract API key from response
API_KEY=$(echo $RESPONSE | grep -o '"key":"[^"]*"' | cut -d'"' -f4)

if [ -z "$API_KEY" ]; then
    echo "❌ Failed to create API key"
    exit 1
fi

echo "✅ API Key created: $API_KEY"
echo ""

# Test 2: List API Keys
echo "📋 Test 2: Listing API Keys..."
curl -s http://localhost:3000/admin/api-keys \
    -H "x-admin-key: $ADMIN_KEY" | jq '.'
echo ""

# Test 3: Try download without API key (should fail)
echo "🚫 Test 3: Download without API key (should fail)..."
curl -s "http://localhost:3000/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&start=00:00:00&end=00:00:05" | jq '.'
echo ""

# Test 4: Try download with invalid API key (should fail)
echo "🚫 Test 4: Download with invalid API key (should fail)..."
curl -s "http://localhost:3000/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&start=00:00:00&end=00:00:05" \
    -H "x-api-key: invalid-key" | jq '.'
echo ""

# Test 5: Health check
echo "💚 Test 5: Health check..."
curl -s http://localhost:3000/health | jq '.'
echo ""

echo "==========================================="
echo "✅ All tests completed!"
echo ""
echo "To test a real download with the API key:"
echo "curl \"http://localhost:3000/download?url=VIDEO_URL&start=00:00:00&end=00:00:05\" \\"
echo "  -H \"x-api-key: $API_KEY\""
echo ""
echo "Created API Key: $API_KEY"
echo "Save this key for future requests!"
