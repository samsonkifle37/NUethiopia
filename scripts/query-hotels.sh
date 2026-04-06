#!/bin/bash
# Query Addis Ababa hotels from the database

echo "🏨 Querying hotels from database..."
echo ""

# Load environment variables
export $(grep -v '^#' /sessions/loving-laughing-clarke/mnt/NuAddisAbaba/.env | xargs)

# Query to find all Addis Ababa hotels
psql "$DIRECT_URL" << EOF
SELECT
  id,
  name,
  city,
  COALESCE((SELECT COUNT(*) FROM "PlaceImage" WHERE "placeId" = p.id), 0) as existing_images
FROM "Place" p
WHERE city = 'Addis Ababa'
  AND type = 'hotel'
ORDER BY name;
EOF
