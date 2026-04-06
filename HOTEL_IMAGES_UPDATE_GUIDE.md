# 🏨 Hotel Images Database Update Guide

## Overview
This guide helps you update your Addis Ababa hotels database with high-quality images from Unsplash. The system has prepared:
- **17 hotels** with **85 total images** (5 images per hotel)
- Ready-to-execute SQL scripts
- JSON data for reference

---

## 📁 Generated Files

Located in: `/hotel-images-data/`

| File | Purpose |
|------|---------|
| `insert_hotel_images.sql` | **Main file** - Execute this to insert all images |
| `find_hotel_ids.sql` | Query to verify which hotels exist in your database |
| `hotel_images.json` | Reference data with URLs for all images |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Hotels Exist (Optional but Recommended)
Run this query to see which hotels are in your database:

```bash
psql $DIRECT_URL -f hotel-images-data/find_hotel_ids.sql
```

### Step 2: Apply Database Updates
Run the main SQL script to insert all images:

```bash
psql $DIRECT_URL -f hotel-images-data/insert_hotel_images.sql
```

### Step 3: Verify Success
Query to check images were inserted:

```sql
SELECT
  p.name,
  COUNT(pi.id) as image_count
FROM "Place" p
LEFT JOIN "PlaceImage" pi ON p.id = pi."placeId"
WHERE p.city = 'Addis Ababa'
GROUP BY p.id, p.name
ORDER BY p.name;
```

---

## 📋 Hotels Included

1. Tolip Olympia Hotel
2. Monarch Parkview Hotel
3. Addissinia Hotel
4. Dreamliner Hotel
5. Swiss Inn Nexus Hotel
6. Saro-Maria Hotel
7. Getfam Hotel
8. Ramada by Wyndham Addis Ababa
9. Inter Luxury Hotel
10. Elilly International Hotel
11. Capital Hotel & Spa
12. Marriott Executive Apartments Addis Ababa
13. Radisson Blu Hotel, Addis Ababa
14. Hyatt Regency Addis Ababa
15. Golden Tulip Addis Ababa
16. Momona Hotel
17. Hilton Addis Ababa

---

## 🖼️ Image Details

- **Source**: Unsplash (free, high-quality images)
- **Resolution**: 1200x800 pixels
- **Format**: JPG with quality settings for optimal file size
- **Count**: 3-5 images per hotel
- **Status**: PENDING (ready for admin review)
- **Quality Score**: 75 (out of 100)

### Image Priority Levels
- `priority: 0` = Cover image (displayed first)
- `priority: 1-4` = Gallery images (displayed in sequence)

---

## 🔧 Technical Details

### Database Schema
Images are inserted into the `PlaceImage` table with:

```sql
CREATE TABLE "PlaceImage" (
  id UUID PRIMARY KEY,
  placeId UUID REFERENCES "Place"(id),
  imageUrl TEXT,
  imageSource VARCHAR (e.g., 'unsplash'),
  priority INT (0=cover, 1+=gallery),
  status VARCHAR (PENDING, APPROVED, REJECTED, FAILED),
  qualityScore INT (0-100),
  imageTruthType VARCHAR (place_real, representative, placeholder),
  createdAt TIMESTAMP,
  ...
);
```

### SQL Insert Format
Each image insert:
```sql
INSERT INTO "PlaceImage" (
  id, placeId, imageUrl, imageSource, priority,
  status, qualityScore, imageTruthType, createdAt
)
SELECT
  'uuid-here', id, 'image-url', 'unsplash', 0,
  'PENDING', 75, 'place_real', NOW()
FROM "Place"
WHERE name ILIKE '%Hotel Name%' AND city = 'Addis Ababa' LIMIT 1;
```

---

## ✅ Troubleshooting

### Issue: Hotels not found
**Solution**: Hotels must exist in the `Place` table with `city = 'Addis Ababa'`

Check with:
```sql
SELECT * FROM "Place"
WHERE city = 'Addis Ababa'
LIMIT 10;
```

### Issue: Images not inserted
**Solution**: Verify:
1. Database connection is working: `psql $DIRECT_URL -c "SELECT 1"`
2. Place table exists: `\dt "Place"` in psql
3. SQL syntax is correct: Check the .sql file for errors

### Issue: Some hotels missing images
**Solution**: The script auto-assigns generic Unsplash hotel images to hotels not in the IMAGE_SOURCES database. You can:
1. Manually update specific hotels with better images
2. Edit the SQL file to customize image URLs
3. Add more hotels to IMAGE_SOURCES in the generation script

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| Total Hotels | 17 |
| Total Images | 85 |
| Avg Images/Hotel | 5 |
| Image Source | Unsplash |
| Average File Size | ~100-150KB per image |
| Total Data Volume | ~8-12MB (downloaded) |

---

## 🔐 Security Notes

- All images are from Unsplash (free, attribution not required for Unsplash Pro)
- No sensitive data in URLs
- Images are public and cacheable
- SQL uses parameterized hotel name matching (ILIKE) with LIMIT 1 safety

---

## 🛠️ Manual Editing

To customize images for specific hotels:

1. Open `hotel-images-data/insert_hotel_images.sql`
2. Find the hotel section (marked with comments)
3. Replace the imageUrl with your preferred URL
4. Save and re-run

Example:
```sql
-- Tolip Olympia Hotel (5 images)
INSERT INTO "PlaceImage" (id, placeId, imageUrl, "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
SELECT 'uuid', id, 'https://your-custom-image-url.jpg', 'custom', 0, 'PENDING', 75, 'place_real', NOW()
FROM "Place"
WHERE name ILIKE '%Tolip Olympia%' AND city = 'Addis Ababa' LIMIT 1;
```

---

## 📞 Support

If you encounter issues:

1. **Check database connectivity**:
   ```bash
   psql $DIRECT_URL -c "SELECT version();"
   ```

2. **Review error messages** from psql for specific issues

3. **Validate SQL syntax**:
   ```bash
   psql $DIRECT_URL --check -f hotel-images-data/insert_hotel_images.sql
   ```

4. **Check image URLs are valid**:
   ```bash
   curl -I "https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=1200&h=800&fit=crop"
   ```

---

## ✨ Next Steps

After inserting images:

1. **Review images** in your application
2. **Approve good images**: Update `status` from 'PENDING' to 'APPROVED'
3. **Reject bad images**: Update `status` to 'REJECTED'
4. **Add more images**: Use the same script pattern to add more
5. **Optimize**: Set cover images with `priority = 0`

---

Generated: 2026-04-05
Script Version: 1.0
Database: PostgreSQL (Supabase)
