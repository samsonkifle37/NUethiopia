# NU Ethiopia - Feature Implementation Plan
## User Favorites/Wishlist System

**Timeline:** This Week (7 Days)
**Priority:** Favorites → Itineraries → Sharing
**Status:** Ready for Implementation

---

## QUICK SUMMARY

This plan covers implementing three interconnected features:

1. **User Favorites/Collections** - Organize saved places into themed collections
2. **Custom Itineraries** - Build multi-day trip plans from saved places
3. **Shareable Itineraries** - Generate public links for sharing trips with friends

Total Effort: ~48-60 hours of development work across 7 days

---

## DATABASE SCHEMA

### New Models Required

```prisma
// Collections for organizing favorites
model FavoriteCollection {
  id          String
  userId      String
  name        String        // "Weekend Getaway", "Coffee Tour"
  description String?
  emoji       String?       // 🏖️, ☕
  color       String?       // Hex color for UI
  isDefault   Boolean
  favorites   FavoriteInCollection[]
  createdAt   DateTime
  updatedAt   DateTime
}

// Trip planning
model Itinerary {
  id              String
  userId          String
  title           String
  description     String?
  city            String
  durationDays    Int           // How many days
  startDate       DateTime?
  endDate         DateTime?
  isPublished     Boolean
  days            ItineraryDay[]
  shareLink       ItineraryShare?
  createdAt       DateTime
  updatedAt       DateTime
}

model ItineraryDay {
  id          String
  itineraryId String
  dayNumber   Int           // 1, 2, 3
  title       String?       // "Coffee & Culture"
  activities  ItineraryActivity[]
  createdAt   DateTime
}

model ItineraryActivity {
  id        String
  dayId     String
  placeId   String
  place     Place             // Link to existing Place model
  timeSlot  String?           // "9:00 AM"
  notes     String?           // User's custom notes
  createdAt DateTime
}

// Sharing
model ItineraryShare {
  id            String
  itineraryId   String
  shareToken    String        // Short URL slug
  isPublic      Boolean
  expiresAt     DateTime?
  viewCount     Int
  lastViewedAt  DateTime?
  createdAt     DateTime
}
```

**Total new database models:** 4 (+ 1 relationship table)

---

## API ENDPOINTS

### Collections API (7 endpoints)
```
POST   /api/user/collections              - Create collection
GET    /api/user/collections              - List all collections
GET    /api/user/collections/[id]         - Get collection with favorites
PATCH  /api/user/collections/[id]         - Update collection
DELETE /api/user/collections/[id]         - Delete collection
POST   /api/user/collections/[id]/favorites      - Add to collection
PATCH  /api/user/collections/[id]/favorites/reorder - Reorder items
```

### Itinerary API (14 endpoints)
```
POST   /api/user/itineraries              - Create itinerary
GET    /api/user/itineraries              - List user's itineraries
GET    /api/user/itineraries/[id]         - Get full itinerary
PATCH  /api/user/itineraries/[id]         - Update metadata
DELETE /api/user/itineraries/[id]         - Delete itinerary

POST   /api/user/itineraries/[id]/days    - Add day
PATCH  /api/user/itineraries/[id]/days/[dayId] - Update day
DELETE /api/user/itineraries/[id]/days/[dayId] - Delete day

POST   /api/user/itineraries/[id]/days/[dayId]/activities - Add place
PATCH  /api/user/itineraries/[id]/days/[dayId]/activities/[activityId] - Update
DELETE /api/user/itineraries/[id]/days/[dayId]/activities/[activityId] - Delete
PATCH  /api/user/itineraries/[id]/days/[dayId]/activities/reorder - Reorder
```

### Sharing API (5 endpoints)
```
POST   /api/user/itineraries/[id]/share   - Generate share link
PATCH  /api/user/itineraries/[id]/share   - Update share settings
DELETE /api/user/itineraries/[id]/share   - Revoke link
GET    /api/itinerary/share/[token]       - View shared itinerary (PUBLIC)
```

**Total endpoints:** 26 new routes

---

## FRONTEND PAGES & COMPONENTS

### New Pages
```
/app/favorites/                    - Favorites hub with tabs
/app/favorites/collection/[id]     - Single collection view
/app/itineraries/                  - List user's itineraries
/app/itineraries/[id]              - Itinerary editor (drag-drop)
/app/itinerary/share/[token]       - Public shared itinerary
```

### New Components
```
<FavoriteButton />          - Heart icon to save places
<CollectionManager />       - Create/manage collections modal
<CollectionCard />          - Display collection card
<ItineraryDayCard />        - Single day container (drag-drop)
<ItineraryActivityItem />   - Place in itinerary with time
<ShareItineraryModal />     - Generate & copy share link
<ItineraryPreview />        - Card showing itinerary summary
<PlaceQuickAdd />           - Search & add places to itinerary
```

**Total new components:** 8

---

## 7-DAY IMPLEMENTATION TIMELINE

### **Day 1 - Database & Collection API**
- [ ] Create Prisma migrations for collections
- [ ] Create `/api/user/collections/*` endpoints (6 routes)
- [ ] Test with Postman
- **Time:** 8-10 hours

### **Day 2 - Collections Frontend**
- [ ] Create `/app/favorites/page.tsx` (tabs layout)
- [ ] Create `/app/favorites/collection/[id]/page.tsx`
- [ ] Build `<FavoriteButton />` component
- [ ] Build `<CollectionManager />` modal
- [ ] Integrate with existing place cards
- **Time:** 6-8 hours

### **Day 3 - Itinerary Database & API**
- [ ] Create Prisma migrations for itineraries
- [ ] Create `/api/user/itineraries/*` endpoints (10 routes)
- [ ] Create TanStack Query custom hooks
- [ ] Test all endpoints
- **Time:** 8-10 hours

### **Day 4-5 - Itinerary Frontend (Part 1)**
- [ ] Create `/app/itineraries/page.tsx` (list view)
- [ ] Create `/app/itineraries/[id]/page.tsx` (editor)
- [ ] Build `<ItineraryDayCard />` component
- [ ] Build `<ItineraryActivityItem />` component
- [ ] Integrate drag-drop library (@dnd-kit/core)
- [ ] Add/remove activities functionality
- **Time:** 12-14 hours

### **Day 5-6 - Itinerary Frontend (Part 2) + Sharing API**
- [ ] Create Prisma migrations for sharing
- [ ] Create `/api/user/itineraries/[id]/share/*` endpoints
- [ ] Build `<ShareItineraryModal />` component
- [ ] Integrate QR code generation
- [ ] Implement copy-to-clipboard
- **Time:** 10-12 hours

### **Day 6-7 - Sharing Frontend & Polish**
- [ ] Create `/app/itinerary/share/[token]/page.tsx` (public)
- [ ] Build public itinerary viewer (read-only)
- [ ] Add "Clone itinerary" functionality
- [ ] Add social share buttons (WhatsApp, Twitter, etc.)
- [ ] Testing & bug fixes
- [ ] Deploy to Vercel
- **Time:** 10-12 hours

---

## KEY FILES TO CREATE

### Database
- `prisma/migrations/[timestamp]_add_collections/migration.sql`
- `prisma/migrations/[timestamp]_add_itineraries/migration.sql`
- `prisma/migrations/[timestamp]_add_sharing/migration.sql`

### API Routes (26 new route files)
```
src/app/api/user/collections/
  ├── route.ts (POST, GET)
  ├── [id]/route.ts (GET, PATCH, DELETE)
  ├── [id]/favorites/route.ts (POST, DELETE)
  └── [id]/favorites/reorder/route.ts (PATCH)

src/app/api/user/itineraries/
  ├── route.ts (POST, GET)
  ├── [id]/
  │   ├── route.ts (GET, PATCH, DELETE)
  │   ├── days/route.ts (POST)
  │   ├── days/[dayId]/route.ts (PATCH, DELETE)
  │   ├── days/[dayId]/activities/route.ts (POST)
  │   ├── days/[dayId]/activities/[activityId]/route.ts (PATCH, DELETE)
  │   ├── days/[dayId]/activities/reorder/route.ts (PATCH)
  │   └── share/route.ts (POST, PATCH, DELETE)
  └── share/[token]/route.ts (GET - PUBLIC)
```

### Pages (5 new)
```
src/app/favorites/page.tsx
src/app/favorites/collection/[id]/page.tsx
src/app/itineraries/page.tsx
src/app/itineraries/[id]/page.tsx
src/app/itinerary/share/[token]/page.tsx
```

### Components (8 new)
```
src/components/
  ├── FavoriteButton.tsx
  ├── CollectionManager.tsx
  ├── CollectionCard.tsx
  ├── ItineraryDayCard.tsx
  ├── ItineraryActivityItem.tsx
  ├── ShareItineraryModal.tsx
  ├── ItineraryPreview.tsx
  └── PlaceQuickAdd.tsx
```

### Utilities
```
src/lib/hooks/
  ├── useCollections.ts
  ├── useItineraries.ts
  ├── useActivities.ts
  └── useSharing.ts

src/lib/sharing.ts (QR code, token generation)
src/types/itinerary.ts
src/types/collection.ts
```

---

## TESTING CHECKLIST

### Collections
- [ ] Create/update/delete collections
- [ ] Add/remove places to collections
- [ ] Reorder places in collection
- [ ] View all collections with place counts

### Itineraries
- [ ] Create itinerary with specified duration
- [ ] Add/remove days
- [ ] Add/remove activities to days
- [ ] Reorder activities (drag-drop)
- [ ] Edit activity time and notes
- [ ] Publish/unpublish itinerary

### Sharing
- [ ] Generate share link
- [ ] View shared itinerary publicly (no auth)
- [ ] Copy share link to clipboard
- [ ] Generate QR code
- [ ] Clone shared itinerary to own
- [ ] Revoke/expire share link

### Mobile Testing
- [ ] All interactions work on mobile (375px)
- [ ] Drag-drop alternative for touch devices
- [ ] Share buttons work properly

---

## TECH STACK

| Layer | Technology |
|-------|-----------|
| Backend | Next.js 16.1.6 (API routes), Prisma ORM, PostgreSQL |
| Frontend | React, TypeScript, TanStack Query, Tailwind CSS |
| Drag-Drop | @dnd-kit/core (or react-beautiful-dnd) |
| QR Code | qrcode.react |
| Auth | Existing JWT + cookies system |
| Deployment | Vercel + Supabase |

---

## SUCCESS CRITERIA

- ✅ Users can save places to collections
- ✅ Users can create multi-day itineraries
- ✅ Users can share itineraries via link
- ✅ Shared itineraries viewable without login
- ✅ All features responsive on mobile
- ✅ No TypeScript errors in production build
- ✅ Database migrations run cleanly on Supabase
- ✅ All new API endpoints tested and working

---

## RISKS & MITIGATION

| Risk | Mitigation |
|------|-----------|
| Large itinerary slow (100+ activities) | Pagination, lazy load days |
| Drag-drop library compatibility | Test thoroughly, provide button fallback |
| Database migration issues | Test on staging first |
| Public share page abuse | Rate limiting (future), view tracking |
| Permission/authorization bugs | Test with multiple user accounts |

---

## WHAT'S NEXT?

**Option 1: Start Now**
Begin with Day 1 (Database + Collections API)

**Option 2: Review First**
Review plan, ask questions, adjust timeline

**Option 3: Prioritize Differently**
Choose different features from roadmap first

I'm ready to implement whenever you give the go-ahead. Which day would you like me to start with?
