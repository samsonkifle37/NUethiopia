-- Run these queries to find placeIds for each hotel
-- Then update the PLACE_ID_HERE placeholders in insert_hotel_images.sql

SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Tolip Olympia Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Monarch Parkview Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Addissinia Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Dreamliner Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Swiss Inn Nexus Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Saro-Maria Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Getfam Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Ramada by Wyndham Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Inter Luxury Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Elilly International Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Capital Hotel & Spa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Marriott Executive Apartments Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Radisson Blu Hotel, Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Hyatt Regency Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Golden Tulip Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Momona Hotel%' AND city = 'Addis Ababa' LIMIT 5;
SELECT id, name, city, created_at FROM "Place" WHERE name ILIKE '%Hilton Addis Ababa%' AND city = 'Addis Ababa' LIMIT 5;