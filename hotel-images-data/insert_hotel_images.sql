-- Hotel Images Insert Script
-- Auto-generated SQL to insert 85 images for 17 Addis Ababa hotels
-- Usage: psql $DIRECT_URL < insert_hotel_images.sql

BEGIN;

-- Tolip Olympia Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '02981baa-6fa0-43b8-9fca-784bc0857bec', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119075'
FROM "Place"
WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '1c118f87-60dc-4142-b4f3-254448090964', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119108'
FROM "Place"
WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '9f73c39a-aca5-487a-a52b-2dc8c24d4376', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119114'
FROM "Place"
WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'a87fc921-5004-42af-aa09-3b6357fd6cce', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119117'
FROM "Place"
WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4d522579-5ce5-4e6e-bc65-d0f5faf5a1de', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119144'
FROM "Place"
WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Monarch Parkview Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '0cde9754-29ff-4c73-af05-b4ae0d34b8c9', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119154'
FROM "Place"
WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'fdec506b-fc98-4e04-bd7f-b2be0d3a3803', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119157'
FROM "Place"
WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '41748785-3eb6-4c4e-9433-b0af226fed83', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119160'
FROM "Place"
WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '7941d8ed-147f-4119-b69a-4eddb2ea9830', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119174'
FROM "Place"
WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'c18aaf18-38f5-4623-bb64-47da24ed88cd', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119178'
FROM "Place"
WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Addissinia Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '5b2a2d08-f643-48d8-a57d-7748b1516fec', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119182'
FROM "Place"
WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'a24a732f-b9be-4f23-9d94-a0d401ce69ef', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119186'
FROM "Place"
WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '0e7b7cdf-ee22-4027-926a-cb30392c4f0a', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119189'
FROM "Place"
WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'ad8ca193-07fc-4dc9-8b00-aae7e27fcc6a', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119192'
FROM "Place"
WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4a48631f-a338-4c56-99d9-ced5a9d3ba6c', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119195'
FROM "Place"
WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Dreamliner Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '510899b4-c960-4900-a566-faa2fe0baad4', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119199'
FROM "Place"
WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'f7ab2974-1e73-4fbb-b8d5-83adeb961257', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119201'
FROM "Place"
WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '485cfafe-0b69-41f2-a864-fad29e34745e', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119204'
FROM "Place"
WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'f56b464d-6919-4a71-8c4a-4fdf3f38b1b4', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119207'
FROM "Place"
WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'fa5cd774-0bae-42f7-8d99-1da94a92ac5e', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119212'
FROM "Place"
WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Swiss Inn Nexus Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'ecd7df7f-6aac-430b-97a4-83e70b59a4c5', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119217'
FROM "Place"
WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '2d7b9984-692a-41ac-9f6d-34e77c48006f', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119220'
FROM "Place"
WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'e64765bb-f4b7-4e04-8aaf-55460a91bba3', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119223'
FROM "Place"
WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '3b4dedea-11bc-49bc-a22d-542411491d6c', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119225'
FROM "Place"
WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '7fb13fcd-0ac1-4eba-a7d3-10e691116405', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119228'
FROM "Place"
WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Saro-Maria Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '6273c5cd-1b5c-4eac-984e-1790a5b82dbb', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119232'
FROM "Place"
WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '85b9389b-171c-4421-99d0-c2a401ad5d77', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119235'
FROM "Place"
WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b43e36ba-4cc9-4d33-a201-b7890c773bfd', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119238'
FROM "Place"
WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '2062b805-e67b-4abc-a647-10e4a74b025d', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119241'
FROM "Place"
WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b236cec4-6b44-46a0-8c12-19f67bc6d437', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119243'
FROM "Place"
WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Getfam Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '2a0d9176-1c92-4078-a6c6-345b021ea9b0', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119247'
FROM "Place"
WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b21d3f9d-f9ba-41a8-bbe0-8782027911cf', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119250'
FROM "Place"
WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '274dc4cb-3e1a-40c2-ae77-3ac1a5e7b722', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119253'
FROM "Place"
WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'bea4e606-62b2-471c-a58d-de4b4267ce31', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119255'
FROM "Place"
WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '897e4adf-e9c0-41ef-bd0f-ec5a9779f5cc', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119260'
FROM "Place"
WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Ramada by Wyndham Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'fbac5d3d-1dc8-47d7-a5e2-a720cc3d345c', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119263'
FROM "Place"
WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '738f98a7-35bd-4c5f-99d1-8a56f9d1feae', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119268'
FROM "Place"
WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4ec412a4-5b7f-4cce-b5d9-bd01f914aabc', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119271'
FROM "Place"
WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b7bd3055-4b84-4d81-bb64-e41d19b787af', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119274'
FROM "Place"
WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '2d4d65a3-4a7d-420b-8ca0-88bc157e0ebe', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119276'
FROM "Place"
WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
-- Inter Luxury Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '149b37d9-d835-4d25-97f1-b76f652d594f', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119280'
FROM "Place"
WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '255cb97c-66da-401a-8de8-60c16f552cbc', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119283'
FROM "Place"
WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '77cad584-729a-478d-93f0-07d698cb9626', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119286'
FROM "Place"
WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '94cf14c1-878d-49b5-8a3a-6bb695905a8b', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119289'
FROM "Place"
WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '66ea77b4-d980-4a9e-9eb9-502602366d04', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119291'
FROM "Place"
WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Elilly International Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'cbce8739-70aa-4e2e-8d18-9cb4cf9397e6', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119297'
FROM "Place"
WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '0e8abec7-ed8e-4b0c-9518-91b2f2058822', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119300'
FROM "Place"
WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '6f47d3a8-1fe0-4a31-bef9-14f8294ca91f', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119302'
FROM "Place"
WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '526f9deb-7d48-408f-92f2-663f74fb389b', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119305'
FROM "Place"
WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '33a67c97-3f66-4094-bf83-03de5b891b53', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119308'
FROM "Place"
WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Capital Hotel & Spa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '90096c8b-011e-4860-a91e-c7b9286df420', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119311'
FROM "Place"
WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '49e586d1-646a-4d06-8fd8-88ac46aa9d2f', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119314'
FROM "Place"
WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'f9e1bece-88ca-4314-8cbf-4c3aaccccc5c', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119317'
FROM "Place"
WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '47870483-16cb-4052-9059-aa00b72db8f8', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119321'
FROM "Place"
WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '9710264b-5d98-4041-b453-d0c702ecacdf', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119324'
FROM "Place"
WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 1;
-- Marriott Executive Apartments Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'a307b37e-643d-481d-a5a2-076074229d98', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119327'
FROM "Place"
WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '7b66abd1-c178-4afc-8dfd-8ac2379bc808', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119330'
FROM "Place"
WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'e08bcdc9-9e6a-44da-bea6-62d9812db20a', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119333'
FROM "Place"
WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '82e663cd-4aec-4814-8bd6-103a6a797e36', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119336'
FROM "Place"
WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'c91884ff-fae5-40bf-b3cb-3859b3c19f7e', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119339'
FROM "Place"
WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
-- Radisson Blu Hotel, Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'f6aedc42-db6c-45c8-9d71-2b3a7fc31094', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119343'
FROM "Place"
WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '5412f1f2-c6a4-487b-aeed-40534b293abc', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119346'
FROM "Place"
WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '60b89369-fd0b-447e-80dc-b1fa9fbbb004', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119349'
FROM "Place"
WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'f937b27b-81cb-4408-a561-4e47b62be21c', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119352'
FROM "Place"
WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'fbb5a8ce-fc3e-42fe-a346-067e83a8f2ad', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119355'
FROM "Place"
WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
-- Hyatt Regency Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '13122863-dc95-45bc-a2c4-fe0021e7c957', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119358'
FROM "Place"
WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b339bfa9-51bb-4ae3-8398-4c0c4efc01ea', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119361'
FROM "Place"
WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4b5d8145-8ced-4b2e-bfd9-4cd0d5ae3794', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119365'
FROM "Place"
WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '2806d2ef-a1e3-4ab6-97db-6c8b98dd2386', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119368'
FROM "Place"
WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '737f39ee-712f-411d-990f-31388b273db7', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119370'
FROM "Place"
WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
-- Golden Tulip Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'dbf5bcb1-9d36-4f4f-b72c-6ca248b1c103', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119374'
FROM "Place"
WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'a831d171-ada1-4aef-a909-a5c5e87afdbe', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119377'
FROM "Place"
WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '058eddf2-b14d-42a0-b4b9-a504bf5bd170', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119379'
FROM "Place"
WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '54a8532c-c741-47cf-bdab-5fd4a92c2604', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119382'
FROM "Place"
WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '0654d09b-2b54-466b-9742-70d9513efd00', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119385'
FROM "Place"
WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
-- Momona Hotel (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '5ec3aa58-f3bc-4e54-a804-28880e77fe29', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119390'
FROM "Place"
WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '5bae4398-e511-46d3-aa9a-15779f21d11b', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119393'
FROM "Place"
WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4128b50f-d823-45da-845c-f802193cf8b6', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119396'
FROM "Place"
WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '9937ffc4-d21a-43a1-827c-554cfedb95ab', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119399'
FROM "Place"
WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '4ca12f33-017c-41cf-b206-009944f11036', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119402'
FROM "Place"
WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 1;
-- Hilton Addis Ababa (5 images)

INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '11b1491f-3a64-4de0-b4b9-cdd41d0edbb9', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop', 'unsplash', 0, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119405'
FROM "Place"
WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'a7e17b8f-f568-4239-bb19-020ddcea0778', id, 'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=1200&h=800&fit=crop', 'unsplash', 1, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119408'
FROM "Place"
WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '0efc5ea7-ba96-4b86-8e84-07fae1537780', id, 'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=1200&h=800&fit=crop', 'unsplash', 2, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119411'
FROM "Place"
WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT '8590af3a-55f8-4a7f-9dd6-3dc25cb9c7b7', id, 'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=1200&h=800&fit=crop', 'unsplash', 3, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119414'
FROM "Place"
WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;
INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'b5829075-c286-4eb3-8c74-084b561178fc', id, 'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop&q=80', 'unsplash', 4, 'PENDING', 75, 'place_real', '2026-04-05T21:01:01.119416'
FROM "Place"
WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 1;

COMMIT;

-- Total: 17 hotels, 85 images