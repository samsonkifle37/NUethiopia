# Testing Plan - Day 7
## Complete Feature Testing on Localhost

**Date:** April 2, 2026
**Environment:** Localhost (http://localhost:3000)
**Scope:** Full end-to-end testing of all 6 days of features

---

## Setup & Prerequisites

### Environment Setup
- [x] Node.js 18+ installed
- [x] npm dependencies installed
- [x] .env.local configured
- [x] Database connected
- [x] Development server running

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Testing Categories

### 1. Collections System (Days 1-2)

#### API Endpoints Testing
```
[ ] GET /api/user/collections - List collections
[ ] POST /api/user/collections - Create collection
[ ] GET /api/user/collections/[id] - Get collection with favorites
[ ] PATCH /api/user/collections/[id] - Update collection
[ ] DELETE /api/user/collections/[id] - Delete collection
[ ] POST /api/user/collections/[id]/favorites - Add to collection
[ ] DELETE /api/user/collections/[id]/favorites - Remove from collection
[ ] PATCH /api/user/collections/[id]/favorites/reorder - Reorder favorites
```

#### Frontend Testing
```
[ ] Navigate to /favorites page
[ ] Collections tab displays all collections
[ ] All Favorites tab shows all saved places
[ ] Create collection form works
  - [ ] Title input validates
  - [ ] Emoji picker works
  - [ ] Color selection works
  - [ ] Submit creates collection
[ ] Click collection to view details
[ ] Add place to collection (FavoriteButton component)
[ ] Remove place from collection
[ ] Delete collection with confirmation
[ ] Reorder collections
```

---

### 2. Itinerary System (Days 3-6)

#### API Endpoints Testing

**Main Itinerary Routes:**
```
[ ] GET /api/user/itineraries - List with sorting
  - [ ] sortBy=recent works
  - [ ] sortBy=oldest works
  - [ ] sortBy=title works
  - [ ] published=draft filtering works
  - [ ] published=published filtering works
[ ] POST /api/user/itineraries - Create new
  - [ ] Title validation (required)
  - [ ] City validation (required)
  - [ ] Duration clamped to 1-14 days
  - [ ] Default duration = 3
[ ] GET /api/user/itineraries/[id] - Get single
  - [ ] Returns full itinerary with days/activities
  - [ ] Ownership verified
[ ] PATCH /api/user/itineraries/[id] - Update
  - [ ] Title update works
  - [ ] Description update works
  - [ ] Publish status toggle works
  - [ ] Duration update works
[ ] DELETE /api/user/itineraries/[id] - Delete
  - [ ] Cascade deletes days and activities
```

**Day Management Routes:**
```
[ ] GET /api/user/itineraries/[id]/days - List days
  - [ ] Returns in correct order
[ ] POST /api/user/itineraries/[id]/days - Create day
  - [ ] dayNumber validation
  - [ ] Title validation
  - [ ] Default title generation
[ ] GET /api/user/itineraries/[id]/days/[dayId] - Get day
[ ] PATCH /api/user/itineraries/[id]/days/[dayId] - Update day
[ ] DELETE /api/user/itineraries/[id]/days/[dayId] - Delete day
  - [ ] Cascade deletes activities
```

**Activity Management Routes:**
```
[ ] GET /api/user/itineraries/[id]/days/[dayId]/activities - List
[ ] POST /api/user/itineraries/[id]/days/[dayId]/activities - Add
  - [ ] PlaceId validation
  - [ ] Duplicate prevention
  - [ ] OrderIndex calculation
[ ] GET /api/user/itineraries/[id]/days/[dayId]/activities/[activityId]
[ ] PATCH /api/user/itineraries/[id]/days/[dayId]/activities/[activityId]
  - [ ] TimeSlot update
  - [ ] Notes update
[ ] DELETE /api/user/itineraries/[id]/days/[dayId]/activities/[activityId]
[ ] PATCH /api/user/itineraries/[id]/days/[dayId]/activities/reorder
  - [ ] Reorder works
  - [ ] OrderIndex updates
```

**Share Routes:**
```
[ ] GET /api/user/itineraries/[id]/share - Get share link
[ ] POST /api/user/itineraries/[id]/share - Create share link
  - [ ] Token generation (64 chars)
  - [ ] Expiration date handling
  - [ ] One link per itinerary enforced
[ ] DELETE /api/user/itineraries/[id]/share - Delete share link
[ ] GET /api/itineraries/share/[token] - Public view
  - [ ] No auth required
  - [ ] View count increments
  - [ ] Expiration validated
  - [ ] Privacy respected
```

#### Frontend Testing

**List Page (/app/itineraries/page.tsx)**
```
[ ] Page loads with itineraries list
[ ] Create itinerary button works
  - [ ] Form validation
  - [ ] Title required
  - [ ] City required
  - [ ] Duration selector works
  - [ ] Submit creates itinerary
[ ] Grid displays itineraries
  - [ ] Shows title, city, duration
  - [ ] Shows activity count
  - [ ] Shows status (Draft/Published)
  - [ ] Shows share indicator
[ ] Edit button navigates to editor
[ ] Delete button removes itinerary
[ ] Empty state when no itineraries
[ ] Loading state visible
[ ] Error handling works
```

**Editor Page (/app/itineraries/[id]/page.tsx)**
```
[ ] Page loads with itinerary data
[ ] Back button works
[ ] Settings button opens edit form
  - [ ] Edit title
  - [ ] Edit description
  - [ ] Toggle publish status
  - [ ] Save changes
  - [ ] Delete itinerary
[ ] Days display correctly
[ ] Click day to expand/collapse
[ ] Activities list shows per day
  - [ ] Shows images
  - [ ] Shows time slots
  - [ ] Shows notes
[ ] Add activity button works
  - [ ] Form displays
  - [ ] Can add time slot
  - [ ] Can add notes
  - [ ] Submit adds activity
[ ] Delete activity button works
[ ] Delete day button works with confirmation
[ ] Share button opens modal
```

**Sharing Features**

**ShareItineraryModal Component:**
```
[ ] Modal opens when share button clicked
[ ] Modal closes when X clicked or backdrop clicked

Create Share Link:
[ ] Create form displays
[ ] Expiration options work
  - [ ] 7 days option
  - [ ] 30 days option
  - [ ] Never (permanent) option
[ ] Create button submits
[ ] Share link displays in code block
[ ] Copy button works
  - [ ] Copies URL to clipboard
  - [ ] Shows "Copied" feedback
[ ] QR code button shows/hides

QR Code:
[ ] QR code generates correctly
[ ] Can scan with phone camera
[ ] Points to correct share URL

Social Sharing:
[ ] Twitter button opens share dialog
[ ] WhatsApp button opens with message
[ ] Facebook button opens share dialog
[ ] URLs are encoded correctly

Share Analytics:
[ ] View count displays
[ ] Share date displays
[ ] Expiration date shows if applicable

Revoke:
[ ] Revoke button works
[ ] Confirmation dialog appears
[ ] Link becomes invalid after revoke
```

**Public Share Page (/app/itinerary/share/[token])**
```
[ ] Page loads without authentication
[ ] Page title and description display
[ ] City and duration show
[ ] Shared by info displays
[ ] View count increments on access
[ ] Days display correctly
  - [ ] Day titles
  - [ ] Day descriptions
  - [ ] Activity counts
[ ] Activities show with timeline
  - [ ] Numbered activities
  - [ ] Images display
  - [ ] Place name and type
  - [ ] Time slots display
  - [ ] Notes display
  - [ ] Statistics (reviews, favorites)
[ ] Invalid token shows 404
[ ] Expired link shows appropriate message
[ ] CTA section encourages app signup
```

---

### 3. Navigation & Integration

```
[ ] BottomNav displays all 8 items
  - [ ] Home
  - [ ] Stays
  - [ ] Tours
  - [ ] Dining
  - [ ] Transport
  - [ ] Plans (Itineraries)
  - [ ] Favorites
  - [ ] Profile
[ ] All nav links work
[ ] Active state highlights correctly
[ ] Translation works (English/Amharic)
  - [ ] nav.itineraries = "Plans" (English)
  - [ ] nav.itineraries = "መርሃግብር" (Amharic)
```

---

### 4. Performance Testing

```
[ ] List page loads in < 1s
[ ] Editor page loads in < 2s
[ ] Form submission < 500ms
[ ] Share modal opens instantly
[ ] Public share page < 2s
[ ] No layout shifts
[ ] Images lazy load correctly
[ ] Smooth animations
[ ] No console errors
[ ] No memory leaks
```

---

### 5. Responsive Design Testing

**Mobile (375px)**
```
[ ] Collections list responsive
[ ] Itineraries grid responsive
[ ] Forms stack properly
[ ] Modals fit screen
[ ] Images scale correctly
[ ] Touch targets adequate (44px+)
[ ] No horizontal scroll
```

**Tablet (768px)**
```
[ ] 2-column layout works
[ ] Cards size properly
[ ] Forms readable
[ ] Modal centered
```

**Desktop (1024px+)**
```
[ ] 3-column layout works
[ ] Full width properly used
[ ] Cards sized well
[ ] Modal positioning correct
```

---

### 6. Error Handling Testing

```
[ ] Invalid itinerary ID shows 404
[ ] Expired share link shows message
[ ] Invalid share token shows 404
[ ] Network error shows message
[ ] Form validation errors display
[ ] Unauthorized access blocked
[ ] API errors handled gracefully
```

---

### 7. State Management Testing

```
[ ] React Query caching works
[ ] Mutations invalidate correct queries
[ ] Optimistic updates work
[ ] Loading states display
[ ] Error states display
[ ] No stale data displayed
[ ] Refresh gets fresh data
```

---

### 8. Authentication Testing

```
[ ] Can only access own collections
[ ] Can only edit own itineraries
[ ] Can only delete own share links
[ ] Public shares accessible without auth
[ ] JWT validation works
[ ] Cookie-based auth works
```

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Fresh npm install
- [ ] Environment variables configured
- [ ] Database connection verified
- [ ] Dev server running on localhost:3000
- [ ] Browser console open (check for errors)
- [ ] Network tab open (monitor API calls)

### Testing Sessions

#### Session 1: Collections System (1-2 hours)
```
Start time: ____
End time: ____
Issues found: ____
Status: [ ] Pass [ ] Fail
```

#### Session 2: Itinerary CRUD (1-2 hours)
```
Start time: ____
End time: ____
Issues found: ____
Status: [ ] Pass [ ] Fail
```

#### Session 3: Sharing Features (1 hour)
```
Start time: ____
End time: ____
Issues found: ____
Status: [ ] Pass [ ] Fail
```

#### Session 4: Responsive Design (45 mins)
```
Start time: ____
End time: ____
Issues found: ____
Status: [ ] Pass [ ] Fail
```

#### Session 5: Performance & Optimization (1 hour)
```
Start time: ____
End time: ____
Issues found: ____
Status: [ ] Pass [ ] Fail
```

---

## Issue Tracking

### Critical Issues (Blocking)
```
[ ] Issue: ___________________
    Severity: CRITICAL
    Status: [ ] Open [ ] Fixed [ ] Verified

[ ] Issue: ___________________
    Severity: CRITICAL
    Status: [ ] Open [ ] Fixed [ ] Verified
```

### High Priority Issues
```
[ ] Issue: ___________________
    Status: [ ] Open [ ] Fixed [ ] Verified

[ ] Issue: ___________________
    Status: [ ] Open [ ] Fixed [ ] Verified
```

### Medium Priority Issues
```
[ ] Issue: ___________________
    Status: [ ] Open [ ] Fixed [ ] Verified
```

### Low Priority / Nice-to-Have
```
[ ] Issue: ___________________
    Status: [ ] Open [ ] Deferred
```

---

## Sign-Off

- [ ] All critical tests pass
- [ ] All high priority tests pass
- [ ] No blocking issues remain
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Security verified
- [ ] Ready for deployment

**Tester Name:** _______________
**Date:** _______________
**Sign-Off:** _______________

---

## Next Steps After Testing

1. Fix any critical issues found
2. Document any known limitations
3. Prepare deployment checklist
4. Deploy to Vercel
5. Run post-deployment smoke tests
6. Monitor for production issues

---

## Testing Tools & Resources

### Browser DevTools
- Inspector (verify DOM structure)
- Console (check for errors)
- Network (monitor API calls)
- Performance (check load times)
- Lighthouse (audit performance)

### Testing Devices
- Desktop browser (Chrome/Firefox/Safari)
- Mobile browser (iOS Safari/Chrome)
- Tablet browser

### API Testing
- Thunder Client or Postman (optional)
- Browser Network tab (monitor calls)
- React Query DevTools (state management)

---

## Success Criteria

✅ **All Tests Pass When:**
1. All features work as designed
2. No critical bugs present
3. Performance acceptable (< 2s page load)
4. Mobile responsive across devices
5. Error handling graceful
6. No console errors/warnings
7. Data persists correctly
8. Authentication secure

---

**Ready to begin testing on localhost!**
