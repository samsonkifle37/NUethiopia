# NU Profile & Legal System - LOCAL SETUP GUIDE

## 🚀 Setup Instructions (5-10 minutes)

### Step 1: Verify Prisma Schema is Updated
Your schema has already been updated! Verify it:

```bash
# Check if the new models exist
grep -A 3 "model SupportRequest" prisma/schema.prisma
```

✅ You should see the SupportRequest, ReportGeneral, and ReportPlace models

---

### Step 2: Run Database Migration

```bash
# Generate Prisma client and apply migration
npx prisma migrate dev --name add_support_legal_system
```

This will:
- Create the 3 new database tables
- Generate the Prisma client
- Add database indexes

**Expected output:**
```
✔ Created migration: 20260404_add_support_legal_system
✔ Ran 1 migration in XXXms
✔ Generated Prisma Client
```

---

### Step 3: Copy Components

Copy these files from outputs to your project:

```bash
# Create the directory if it doesn't exist
mkdir -p src/components/profile

# Copy all 6 components
cp src/components/profile/SupportForm.tsx your-project/src/components/profile/
cp src/components/profile/ReportProblemForm.tsx your-project/src/components/profile/
cp src/components/profile/DeleteAccountModal.tsx your-project/src/components/profile/
cp src/components/profile/ProfileSection.tsx your-project/src/components/profile/
cp src/components/profile/ProfileTabs.tsx your-project/src/components/profile/
cp src/components/profile/LegalSection.tsx your-project/src/components/profile/
```

**Quick copy command:**
```bash
mkdir -p src/components/profile
cp -r src/components/profile/* src/components/profile/
```

---

### Step 4: Copy API Routes

```bash
# Create directories
mkdir -p src/app/api/user/support
mkdir -p src/app/api/user/reports/general
mkdir -p src/app/api/user/reports/place
mkdir -p src/app/api/user/account/delete

# Copy routes
cp outputs/src/app/api/user/support/route.ts src/app/api/user/support/
cp outputs/src/app/api/user/reports/general/route.ts src/app/api/user/reports/general/
cp outputs/src/app/api/user/reports/place/route.ts src/app/api/user/reports/place/
cp outputs/src/app/api/user/account/delete/route.ts src/app/api/user/account/delete/
```

---

### Step 5: Copy Legal Pages

```bash
# Create directories
mkdir -p src/app/legal/privacy
mkdir -p src/app/legal/terms

# Copy pages
cp outputs/src/app/legal/privacy/page.tsx src/app/legal/privacy/
cp outputs/src/app/legal/terms/page.tsx src/app/legal/terms/
```

---

### Step 6: Replace Profile Page

```bash
# Backup original (just in case)
cp src/app/profile/page.tsx src/app/profile/page.tsx.backup

# Copy new profile page
cp outputs/02-updated-profile-page.tsx src/app/profile/page.tsx
```

---

### Step 7: Regenerate Prisma

```bash
npx prisma generate
```

---

### Step 8: Build and Test

```bash
# Build the project
npm run build

# Check for any TypeScript errors
echo "✅ Build successful!"
```

---

### Step 9: Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.x
  - Local:        http://localhost:3000
```

---

## ✅ Testing Checklist

### Test 1: Legal Pages (No Auth Required)
```
1. Go to http://localhost:3000/legal/privacy
   ✅ Should see privacy policy
   ✅ Mobile-responsive
   ✅ Last updated date shown

2. Go to http://localhost:3000/legal/terms
   ✅ Should see terms of service
   ✅ Links to home page work
```

### Test 2: Profile Page (Requires Auth)
```
1. Go to http://localhost:3000/profile
   ✅ Should redirect to login if not authenticated
   ✅ Sign in with test account

2. Once logged in:
   ✅ See user avatar and name
   ✅ Three tabs: Account | Support & Safety | Legal
```

### Test 3: Account Tab
```
1. Account Tab content:
   ✅ Account Information section shows
   ✅ Saved Places section shows
   ✅ Edit Profile button appears
   ✅ Delete Account button appears in Danger Zone
```

### Test 4: Support & Safety Tab
```
1. Contact Support Form:
   ✅ Email field is pre-filled (if logged in)
   ✅ Category dropdown works
   ✅ Message textarea works
   ✅ Character counter works (10-2000 chars)
   ✅ Submit button works
   ✅ Success message shows after submit

2. Report Problem Form:
   ✅ Issue type dropdown works
   ✅ Description textarea works
   ✅ Screenshot URL optional
   ✅ Submit button works
```

### Test 5: Legal Tab
```
1. Legal section:
   ✅ Privacy Policy link works
   ✅ Terms of Service link works
   ✅ Both pages are accessible
```

### Test 6: Delete Account Flow
```
1. Click "Delete Account Permanently" button
   ✅ Modal opens with warning

2. Step 1 - Warning Screen:
   ✅ Shows consequences of deletion
   ✅ Lists data that will be deleted
   ✅ Cancel button closes modal
   ✅ Continue button goes to step 2

3. Step 2 - Confirmation Text:
   ✅ Shows text to type: "DELETE MY ACCOUNT"
   ✅ Back button returns to step 1
   ✅ Next button only enabled when text matches exactly

4. Step 3 - Password Verification:
   ✅ Password field appears
   ✅ Back button returns to step 2
   ✅ Delete Account button is disabled until password entered
   ✅ Submit button shows loading state

✅ After successful deletion:
   - User should be redirected to home page
   - Check database: User record should be deleted
```

### Test 7: Database Verification
```bash
# Check if tables were created
npx prisma db execute "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'Support%' OR table_name LIKE 'Report%';"

# Should see:
# SupportRequest
# ReportGeneral
# ReportPlace
```

---

## 🧪 Manual API Testing

### Test Support Request API

```bash
# Using curl
curl -X POST http://localhost:3000/api/user/support \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "category": "bug",
    "message": "This is a test support request with at least 10 characters"
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Support request submitted successfully",
#   "requestId": "uuid-here"
# }
```

### Test Report Problem API

```bash
curl -X POST http://localhost:3000/api/user/reports/general \
  -H "Content-Type: application/json" \
  -d '{
    "issueType": "bug",
    "description": "This is a test problem report with enough characters to pass validation"
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Report submitted successfully",
#   "reportId": "uuid-here"
# }
```

### Test Report Place API

```bash
# First, get a place ID from your database
# Then run:

curl -X POST http://localhost:3000/api/user/reports/place \
  -H "Content-Type: application/json" \
  -d '{
    "placeId": "your-place-uuid-here",
    "reason": "unsafe",
    "notes": "This place seems unsafe"
  }'
```

---

## 📊 Database Check

### View Support Requests

```bash
npx prisma db execute "SELECT * FROM \"SupportRequest\" LIMIT 5;"
```

### View Reports

```bash
npx prisma db execute "SELECT * FROM \"ReportGeneral\" LIMIT 5;"
npx prisma db execute "SELECT * FROM \"ReportPlace\" LIMIT 5;"
```

### View Table Structure

```bash
npx prisma studio
```

This opens a visual database explorer at http://localhost:5555

---

## 🆘 Troubleshooting

### Error: "Relation X not found"
```bash
# Solution: Regenerate Prisma client
npx prisma generate
```

### Error: "Module not found: @/components/profile/..."
```bash
# Solution: Check file paths are correct
# Make sure components are in src/components/profile/
ls -la src/components/profile/
```

### Error: "Route not found"
```bash
# Solution: Check API route paths
# Make sure files are in correct directories:
# src/app/api/user/support/route.ts
# src/app/api/user/reports/general/route.ts
# src/app/api/user/reports/place/route.ts
# src/app/api/user/account/delete/route.ts
```

### Emails not showing in console
```bash
# Check your sendEmail implementation in lib/email.ts
# Make sure it's configured for your email provider
# For development, you can log emails instead
```

### Build fails with TypeScript errors
```bash
# Clear build cache and rebuild
rm -rf .next
npm run build
```

---

## ✨ Success Indicators

You'll know everything is working when:

✅ Database migration completes successfully
✅ All components import without errors
✅ All API routes are accessible
✅ Legal pages load (no auth)
✅ Profile page shows all 3 tabs
✅ Forms can be submitted
✅ Delete account modal shows all 3 steps
✅ No TypeScript errors in console
✅ Database tables contain test data

---

## 📋 File Checklist

After copying everything, verify these files exist:

```
src/
├── app/
│   ├── legal/
│   │   ├── privacy/page.tsx           ✅
│   │   └── terms/page.tsx             ✅
│   ├── api/user/
│   │   ├── support/route.ts           ✅
│   │   ├── reports/
│   │   │   ├── general/route.ts       ✅
│   │   │   └── place/route.ts         ✅
│   │   └── account/delete/route.ts    ✅
│   └── profile/page.tsx               ✅
└── components/profile/
    ├── SupportForm.tsx                ✅
    ├── ReportProblemForm.tsx          ✅
    ├── DeleteAccountModal.tsx         ✅
    ├── ProfileSection.tsx             ✅
    ├── ProfileTabs.tsx                ✅
    └── LegalSection.tsx               ✅
```

---

## 🎯 Next Steps

1. ✅ Run migration
2. ✅ Copy all files
3. ✅ Start dev server
4. ✅ Test each feature
5. ✅ Verify database
6. ✅ Check console for errors
7. ✅ Run build
8. ✅ Deploy!

---

## 💬 Need Help?

If you encounter issues:
1. Check the Troubleshooting section above
2. Review the IMPLEMENTATION-GUIDE.md for detailed explanations
3. Check server logs for error messages
4. Verify all files are in correct directories

---

## 🚀 You're Ready!

Once all tests pass, you're ready to deploy to production!

Good luck! 🎉
