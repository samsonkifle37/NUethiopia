import { pool } from '../src/lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

const IMAGE_DATABASE: Record<string, string[]> = {
  'Tolip Olympia Hotel': [
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=800&h=600&fit=crop',
  ],
};

const GENERIC_HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e143?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1587612036782-bc099d4b37c9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1631049307038-da31d85f56cf?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586725318404-8f8ef4efb0fe?w=800&h=600&fit=crop',
];

function getImagesForHotel(hotelName: string): string[] {
  return IMAGE_DATABASE[hotelName] || GENERIC_HOTEL_IMAGES;
}

async function main() {
  console.log('🏨 Hotel Image Database Updater\n');

  const client = await pool.connect();

  try {
    console.log('Searching for hotels in database...\n');

    const hotelData: Record<string, { id: string; images: string[] }> = {};

    // Find each hotel in the database
    for (const hotelName of HOTEL_NAMES) {
      const query = `
        SELECT id, name, city
        FROM "Place"
        WHERE name ILIKE $1 AND city = 'Addis Ababa'
        LIMIT 1
      `;

      const result = await client.query(query, [`%${hotelName}%`]);

      if (result.rows.length > 0) {
        const hotel = result.rows[0];
        hotelData[hotel.id] = {
          id: hotel.id,
          images: getImagesForHotel(hotelName)
        };
        console.log(`✓ Found: ${hotelName} (ID: ${hotel.id})`);
      } else {
        console.log(`⚠️  Not found: ${hotelName}`);
      }
    }

    console.log(`\nFound ${Object.keys(hotelData).length} hotels\n`);

    // Prepare SQL for insertion
    const insertStatements: string[] = [];
    insertStatements.push('BEGIN;');
    insertStatements.push('');

    for (const [placeId, data] of Object.entries(hotelData)) {
      for (let idx = 0; idx < data.images.length; idx++) {
        const imageId = uuidv4();
        const imageUrl = data.images[idx];
        const priority = idx; // 0 = cover, 1+ = gallery
        const createdAt = new Date().toISOString();

        const statement = `
          INSERT INTO "PlaceImage" (id, "placeId", "imageUrl", "imageSource", "priority", "status", "qualityScore", "imageTruthType", "createdAt")
          VALUES ('${imageId}', '${placeId}', '${imageUrl.replace(/'/g, "''")}', 'unsplash', ${priority}, 'PENDING', 75, 'place_real', '${createdAt}');
        `.trim();

        insertStatements.push(statement);
      }
    }

    insertStatements.push('');
    insertStatements.push('COMMIT;');

    // Save SQL file
    const sqlContent = insertStatements.join('\n');
    const outputPath = path.join(process.cwd(), 'hotel-images-data', 'insert_hotel_images_final.sql');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sqlContent);

    console.log(`✓ SQL file generated: ${outputPath}`);
    console.log(`\nReady to insert ${Object.values(hotelData).reduce((sum, d) => sum + d.images.length, 0)} images`);
    console.log('\nRun the following to apply updates:');
    console.log(`psql $DIRECT_URL -f ${outputPath}`);

  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
