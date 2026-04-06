#!/usr/bin/env node
/**
 * Hotel Image Fetcher Script
 * Fetches images for hotels and updates the database
 * Usage: node scripts/fetch-hotel-images.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();

// Hotels to process
const HOTEL_NAMES = [
  'Tolip Olympia Hotel',
  'Monarch Parkview Hotel',
  'Addissinia Hotel',
  'Dreamliner Hotel',
  'Swiss Inn Nexus Hotel',
  'Saro-Maria Hotel',
  'Getfam Hotel',
  'Ramada by Wyndham Addis Ababa',
  'Inter Luxury Hotel',
  'Elilly International Hotel',
  'Capital Hotel & Spa',
  'Marriott Executive Apartments Addis Ababa',
  'Radisson Blu Hotel, Addis Ababa',
  'Hyatt Regency Addis Ababa',
  'Golden Tulip Addis Ababa',
  'Momona Hotel',
  'Hilton Addis Ababa'
];

// Image sources for scraping (fallback URLs)
const IMAGE_SOURCES = {
  'Tolip Olympia Hotel': [
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop&q=75'
  ],
  'Monarch Parkview Hotel': [
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop&q=75',
  ],
  // Add more hotels as needed...
};

// Create images directory if it doesn't exist
const IMAGES_DIR = path.join(process.cwd(), 'public', 'hotel-images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

/**
 * Download image from URL
 */
async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

/**
 * Get or create hotel image records
 */
async function processHotel(hotelName) {
  try {
    // Find hotel in database
    const place = await prisma.place.findFirst({
      where: {
        name: hotelName,
        city: 'Addis Ababa'
      }
    });

    if (!place) {
      console.log(`⚠️  Hotel not found: ${hotelName}`);
      return null;
    }

    console.log(`✓ Found: ${hotelName} (ID: ${place.id})`);

    // Check existing images
    const existingImages = await prisma.placeImage.findMany({
      where: { placeId: place.id }
    });

    console.log(`  Current images: ${existingImages.length}`);

    // Get image URLs for this hotel (or use generic hotel images)
    const imageUrls = IMAGE_SOURCES[hotelName] || [
      'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=400&h=300&fit=crop',
    ];

    return {
      placeId: place.id,
      hotelName,
      imageUrls
    };
  } catch (error) {
    console.error(`Error processing ${hotelName}:`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🏨 Hotel Image Fetcher\n');
  console.log(`Processing ${HOTEL_NAMES.length} hotels...\n`);

  const hotelData = [];

  // Process each hotel
  for (const hotelName of HOTEL_NAMES) {
    const data = await processHotel(hotelName);
    if (data) {
      hotelData.push(data);
    }
  }

  console.log(`\n✓ Found ${hotelData.length} hotels in database\n`);

  // Display found hotels
  console.log('=== NEXT STEPS ===');
  console.log('1. Review the hotels found above');
  console.log('2. Update IMAGE_SOURCES object with specific hotel images');
  console.log('3. Run the image download and database update script\n');

  // Generate SQL for manual insertion (for reference)
  console.log('=== SQL TEMPLATE FOR MANUAL UPDATE ===');
  hotelData.slice(0, 3).forEach(hotel => {
    console.log(`
-- ${hotel.hotelName}
INSERT INTO "PlaceImage" ("id", "placeId", "imageUrl", "imageSource", "priority", "status", "createdAt")
VALUES
  (gen_random_uuid(), '${hotel.placeId}', '${hotel.imageUrls[0]}', 'unsplash', 0, 'PENDING', NOW()),
  (gen_random_uuid(), '${hotel.placeId}', '${hotel.imageUrls[1]}', 'unsplash', 1, 'PENDING', NOW()),
  (gen_random_uuid(), '${hotel.placeId}', '${hotel.imageUrls[2]}', 'unsplash', 2, 'PENDING', NOW());
    `);
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
