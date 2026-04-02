# Collections API Testing Guide

## Setup

### 1. Get Authentication Token
First, you need a valid JWT token. You can either:
- Login through the app at `/api/auth/login`
- Or extract from browser cookies after logging in

### 2. Test Environment
- **Base URL:** `http://localhost:3000` (local) or `https://nu-ethiopia.vercel.app` (production)
- **Headers:** `Content-Type: application/json`
- **Cookie:** `auth-token=<your_jwt_token>`

---

## API Endpoints Testing

### 1. Create Collection

**Request:**
```bash
curl -X POST http://localhost:3000/api/user/collections \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<your_token>" \
  -d '{
    "name": "Weekend Getaway",
    "description": "Places for a weekend in Addis",
    "emoji": "🏖️",
    "color": "#FF6B6B"
  }'
```

**Expected Response (201):**
```json
{
  "collection": {
    "id": "uuid-here",
    "name": "Weekend Getaway",
    "description": "Places for a weekend in Addis",
    "emoji": "🏖️",
    "color": "#FF6B6B",
    "isDefault": false,
    "favoriteCount": 0,
    "createdAt": "2026-04-01T..."
  }
}
```

**Test Cases:**
- ✅ Create with all fields
- ✅ Create with only name (description, emoji, color optional)
- ❌ Create without name → 400
- ❌ Create duplicate name → 409
- ❌ No auth token → 401

---

### 2. List All Collections

**Request:**
```bash
curl -X GET http://localhost:3000/api/user/collections \
  -H "Cookie: auth-token=<your_token>"
```

**Expected Response (200):**
```json
{
  "collections": [
    {
      "id": "uuid-1",
      "name": "Weekend Getaway",
      "description": "...",
      "emoji": "🏖️",
      "color": "#FF6B6B",
      "isDefault": false,
      "favoriteCount": 5,
      "createdAt": "2026-04-01T..."
    },
    {
      "id": "uuid-2",
      "name": "Coffee Tour",
      "description": "...",
      "emoji": "☕",
      "color": "#6F4E37",
      "isDefault": false,
      "favoriteCount": 3,
      "createdAt": "2026-04-01T..."
    }
  ]
}
```

---

### 3. Get Single Collection with Favorites

**Request:**
```bash
curl -X GET http://localhost:3000/api/user/collections/{collection_id} \
  -H "Cookie: auth-token=<your_token>"
```

**Expected Response (200):**
```json
{
  "collection": {
    "id": "uuid-1",
    "userId": "user-uuid",
    "name": "Weekend Getaway",
    "description": "Places for a weekend",
    "emoji": "🏖️",
    "color": "#FF6B6B",
    "isDefault": false,
    "createdAt": "2026-04-01T...",
    "updatedAt": "2026-04-01T...",
    "favorites": [
      {
        "id": "fav-uuid-1",
        "place": {
          "id": "place-uuid",
          "name": "Liule Hotel",
          "slug": "liule-hotel-addis-ababa",
          "type": "hotel",
          "city": "Addis Ababa",
          "shortDescription": "Beautiful 3-star hotel with pool",
          "priceLevel": "$$$",
          "image": "https://...",
          "reviewCount": 15,
          "favoriteCount": 42
        },
        "addedAt": "2026-04-01T..."
      }
    ]
  }
}
```

**Test Cases:**
- ✅ Get existing collection with favorites
- ✅ Get collection with no favorites (empty array)
- ❌ Get non-existent collection → 404
- ❌ Get another user's collection → 404

---

### 4. Update Collection

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/user/collections/{collection_id} \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<your_token>" \
  -d '{
    "name": "Weekend Adventure",
    "emoji": "🎒",
    "color": "#4ECDC4"
  }'
```

**Expected Response (200):**
```json
{
  "collection": {
    "id": "uuid-1",
    "name": "Weekend Adventure",
    "description": "...",
    "emoji": "🎒",
    "color": "#4ECDC4",
    "isDefault": false,
    "createdAt": "2026-04-01T...",
    "updatedAt": "2026-04-01T..." (updated)
  }
}
```

**Test Cases:**
- ✅ Update single field
- ✅ Update multiple fields
- ✅ Update to different name
- ❌ Update to existing name of another collection → 409
- ❌ Update non-existent collection → 404

---

### 5. Delete Collection

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/user/collections/{collection_id} \
  -H "Cookie: auth-token=<your_token>"
```

**Expected Response (200):**
```json
{ "success": true }
```

**Test Cases:**
- ✅ Delete empty collection
- ✅ Delete collection with favorites (cascades)
- ❌ Delete non-existent collection → 404

---

### 6. Add Place to Collection

**Prerequisites:**
- Need a valid `placeId` from your database
- Collection must exist

**Request:**
```bash
curl -X POST http://localhost:3000/api/user/collections/{collection_id}/favorites \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<your_token>" \
  -d '{
    "placeId": "place-uuid-here"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "favoriteInCollection": {
    "id": "fic-uuid",
    "collectionId": "collection-uuid",
    "favoriteId": "favorite-uuid",
    "orderIndex": 0,
    "addedAt": "2026-04-01T..."
  }
}
```

**Test Cases:**
- ✅ Add place to collection
- ✅ Add creates Favorite if doesn't exist
- ❌ Add non-existent place → 400
- ❌ Add duplicate place → 409
- ❌ Add to non-existent collection → 404

---

### 7. Remove Place from Collection

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/user/collections/{collection_id}/favorites \
  -H "Cookie: auth-token=<your_token>" \
  -G --data-urlencode "placeId=place-uuid-here"
```

**Expected Response (200):**
```json
{ "success": true }
```

**Note:** placeId is passed as query parameter, not in body

---

### 8. Reorder Favorites in Collection

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/user/collections/{collection_id}/favorites/reorder \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=<your_token>" \
  -d '{
    "favoriteIds": [
      "favorite-uuid-3",
      "favorite-uuid-1",
      "favorite-uuid-2"
    ]
  }'
```

**Expected Response (200):**
```json
{ "success": true }
```

**What It Does:**
- Updates `orderIndex` for each favorite based on array position
- Index 0 becomes the first item, Index 1 becomes second, etc.
- Used for drag-drop reordering on frontend

**Test Cases:**
- ✅ Reorder with valid favorite IDs
- ✅ Partial reorder (some favorites)
- ❌ Empty array → 400
- ❌ Non-existent favorite ID (silently skips or errors)

---

## Quick Test Script (Bash)

Save as `test-api.sh`:

```bash
#!/bin/bash

TOKEN="your_jwt_token_here"
BASE_URL="http://localhost:3000"

echo "=== Testing Collections API ==="

# 1. Create collection
echo -e "\n1. Creating collection..."
COLLECTION=$(curl -s -X POST $BASE_URL/api/user/collections \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{"name":"Test Collection","emoji":"⭐"}')
echo $COLLECTION | jq .

COLLECTION_ID=$(echo $COLLECTION | jq -r '.collection.id')
echo "Collection ID: $COLLECTION_ID"

# 2. List collections
echo -e "\n2. Listing collections..."
curl -s -X GET $BASE_URL/api/user/collections \
  -H "Cookie: auth-token=$TOKEN" | jq .

# 3. Get single collection
echo -e "\n3. Getting single collection..."
curl -s -X GET "$BASE_URL/api/user/collections/$COLLECTION_ID" \
  -H "Cookie: auth-token=$TOKEN" | jq .

# 4. Update collection
echo -e "\n4. Updating collection..."
curl -s -X PATCH "$BASE_URL/api/user/collections/$COLLECTION_ID" \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=$TOKEN" \
  -d '{"name":"Updated Collection"}' | jq .

# 5. Delete collection
echo -e "\n5. Deleting collection..."
curl -s -X DELETE "$BASE_URL/api/user/collections/$COLLECTION_ID" \
  -H "Cookie: auth-token=$TOKEN" | jq .

echo -e "\n=== Tests Complete ==="
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Using Postman

1. Create new Collection in Postman
2. Create requests for each endpoint:
   - POST `/api/user/collections`
   - GET `/api/user/collections`
   - GET `/api/user/collections/{{collectionId}}`
   - PATCH `/api/user/collections/{{collectionId}}`
   - DELETE `/api/user/collections/{{collectionId}}`
   - POST `/api/user/collections/{{collectionId}}/favorites`
   - DELETE `/api/user/collections/{{collectionId}}/favorites`
   - PATCH `/api/user/collections/{{collectionId}}/favorites/reorder`

3. Set environment variable:
   - `{{auth_token}}` = your JWT token
   - `{{base_url}}` = http://localhost:3000 or https://nu-ethiopia.vercel.app

4. Add cookie to requests:
   - Cookie: `auth-token={{auth_token}}`

---

## Common Errors

| Status | Error | Cause | Fix |
|--------|-------|-------|-----|
| 401 | Unauthorized | No auth token or invalid | Login and get valid token |
| 400 | Missing name | Empty collection name | Provide valid name |
| 409 | Duplicate name | Collection name already exists | Use unique name |
| 404 | Not found | Collection doesn't exist | Verify collection ID |
| 500 | Server error | Database or code error | Check server logs |

---

## What to Test

**Core Functionality:**
- ✅ Create multiple collections
- ✅ Update collection metadata
- ✅ Add places to collection
- ✅ Remove places from collection
- ✅ Reorder favorites
- ✅ Delete collection

**Edge Cases:**
- ✅ Duplicate collection names
- ✅ Adding same place twice
- ✅ Authorization (wrong user)
- ✅ Non-existent resources

**Data Integrity:**
- ✅ Favorites cascade properly
- ✅ Order index updates correctly
- ✅ User isolation (can't access other user's data)

---

This API is ready for testing and integration!
