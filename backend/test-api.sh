#!/bin/bash

# Quick Notes API Test Script
# Make this file executable: chmod +x test-api.sh

API_URL="http://localhost:3000"
USER_ID="test-user"

echo "🧪 Testing Quick Notes API"
echo "================================"

# Health Check
echo -e "\n✅ 1. Health Check"
curl -s "${API_URL}/health" | jq

# Create a Notebook
echo -e "\n📚 2. Create Notebook"
NOTEBOOK_RESPONSE=$(curl -s -X POST "${API_URL}/api/notebooks" \
  -H "Content-Type: application/json" \
  -H "x-user-id: ${USER_ID}" \
  -d '{
    "name": "Personal",
    "color": "#007AFF",
    "icon": "📝"
  }')
echo "$NOTEBOOK_RESPONSE" | jq
NOTEBOOK_ID=$(echo "$NOTEBOOK_RESPONSE" | jq -r '.id')

# Create Sub-Notebook
echo -e "\n📚 3. Create Sub-Notebook"
curl -s -X POST "${API_URL}/api/notebooks" \
  -H "Content-Type: application/json" \
  -H "x-user-id: ${USER_ID}" \
  -d "{
    \"name\": \"Daily Journal\",
    \"parentId\": \"${NOTEBOOK_ID}\",
    \"color\": \"#5856D6\",
    \"icon\": \"📔\"
  }" | jq

# Create a Note
echo -e "\n📝 4. Create Note in Notebook"
NOTE_RESPONSE=$(curl -s -X POST "${API_URL}/api/notes" \
  -H "Content-Type: application/json" \
  -H "x-user-id: ${USER_ID}" \
  -d "{
    \"title\": \"Test Note\",
    \"content\": \"This is a test note created via API\",
    \"notebookId\": \"${NOTEBOOK_ID}\",
    \"contentType\": \"text\"
  }")
echo "$NOTE_RESPONSE" | jq
NOTE_ID=$(echo "$NOTE_RESPONSE" | jq -r '.id')

# Create Another Note (Unorganized)
echo -e "\n📝 5. Create Unorganized Note"
curl -s -X POST "${API_URL}/api/notes" \
  -H "Content-Type: application/json" \
  -H "x-user-id: ${USER_ID}" \
  -d '{
    "title": "Quick Note",
    "content": "This note is not in any notebook",
    "contentType": "text"
  }' | jq

# Get All Notebooks (Tree)
echo -e "\n📚 6. Get All Notebooks (Tree Structure)"
curl -s "${API_URL}/api/notebooks" \
  -H "x-user-id: ${USER_ID}" | jq

# Get All Notes
echo -e "\n📝 7. Get All Notes"
curl -s "${API_URL}/api/notes" \
  -H "x-user-id: ${USER_ID}" | jq

# Pin a Note
echo -e "\n📌 8. Pin Note"
curl -s -X PATCH "${API_URL}/api/notes/${NOTE_ID}/pin" \
  -H "x-user-id: ${USER_ID}" | jq

# Get Pinned Notes
echo -e "\n📌 9. Get Pinned Notes"
curl -s "${API_URL}/api/notes?pinned=true" \
  -H "x-user-id: ${USER_ID}" | jq

# Update Note
echo -e "\n✏️  10. Update Note"
curl -s -X PUT "${API_URL}/api/notes/${NOTE_ID}" \
  -H "Content-Type: application/json" \
  -H "x-user-id: ${USER_ID}" \
  -d '{
    "title": "Updated Test Note",
    "content": "This note has been updated!"
  }' | jq

# Search Notes
echo -e "\n🔍 11. Search Notes"
curl -s "${API_URL}/api/notes/search?q=test" \
  -H "x-user-id: ${USER_ID}" | jq

echo -e "\n✅ Test Complete!"
echo "================================"
