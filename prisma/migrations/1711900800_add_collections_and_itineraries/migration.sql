-- Create FavoriteCollection table
CREATE TABLE "FavoriteCollection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "emoji" TEXT,
  "color" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FavoriteCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create unique index on userId and name
CREATE UNIQUE INDEX "FavoriteCollection_userId_name_key" ON "FavoriteCollection"("userId", "name");

-- Create index on userId
CREATE INDEX "FavoriteCollection_userId_idx" ON "FavoriteCollection"("userId");

-- Create FavoriteInCollection table (relationship table)
CREATE TABLE "FavoriteInCollection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "collectionId" TEXT NOT NULL,
  "favoriteId" TEXT NOT NULL,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FavoriteInCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "FavoriteCollection" ("id") ON DELETE CASCADE,
  CONSTRAINT "FavoriteInCollection_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite" ("id") ON DELETE CASCADE
);

-- Create unique index on collectionId and favoriteId
CREATE UNIQUE INDEX "FavoriteInCollection_collectionId_favoriteId_key" ON "FavoriteInCollection"("collectionId", "favoriteId");

-- Create indexes
CREATE INDEX "FavoriteInCollection_collectionId_idx" ON "FavoriteInCollection"("collectionId");
CREATE INDEX "FavoriteInCollection_favoriteId_idx" ON "FavoriteInCollection"("favoriteId");

-- Create Itinerary table
CREATE TABLE "Itinerary" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "city" TEXT NOT NULL,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "durationDays" INTEGER NOT NULL DEFAULT 3,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create indexes on Itinerary
CREATE INDEX "Itinerary_userId_idx" ON "Itinerary"("userId");
CREATE INDEX "Itinerary_isPublished_idx" ON "Itinerary"("isPublished");

-- Create ItineraryDay table
CREATE TABLE "ItineraryDay" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "itineraryId" TEXT NOT NULL,
  "dayNumber" INTEGER NOT NULL,
  "title" TEXT,
  "description" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ItineraryDay_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary" ("id") ON DELETE CASCADE
);

-- Create unique index on itineraryId and dayNumber
CREATE UNIQUE INDEX "ItineraryDay_itineraryId_dayNumber_key" ON "ItineraryDay"("itineraryId", "dayNumber");

-- Create index on itineraryId
CREATE INDEX "ItineraryDay_itineraryId_idx" ON "ItineraryDay"("itineraryId");

-- Create ItineraryActivity table
CREATE TABLE "ItineraryActivity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "dayId" TEXT NOT NULL,
  "placeId" TEXT NOT NULL,
  "timeSlot" TEXT,
  "notes" TEXT,
  "orderIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ItineraryActivity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "ItineraryDay" ("id") ON DELETE CASCADE,
  CONSTRAINT "ItineraryActivity_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE CASCADE
);

-- Create indexes on ItineraryActivity
CREATE INDEX "ItineraryActivity_dayId_idx" ON "ItineraryActivity"("dayId");
CREATE INDEX "ItineraryActivity_placeId_idx" ON "ItineraryActivity"("placeId");

-- Create ItineraryShare table
CREATE TABLE "ItineraryShare" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "itineraryId" TEXT NOT NULL,
  "shareToken" TEXT NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "expiresAt" TIMESTAMP(3),
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "lastViewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ItineraryShare_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary" ("id") ON DELETE CASCADE
);

-- Create unique indexes on ItineraryShare
CREATE UNIQUE INDEX "ItineraryShare_itineraryId_key" ON "ItineraryShare"("itineraryId");
CREATE UNIQUE INDEX "ItineraryShare_shareToken_key" ON "ItineraryShare"("shareToken");

-- Create indexes on ItineraryShare
CREATE INDEX "ItineraryShare_shareToken_idx" ON "ItineraryShare"("shareToken");
CREATE INDEX "ItineraryShare_itineraryId_idx" ON "ItineraryShare"("itineraryId");
