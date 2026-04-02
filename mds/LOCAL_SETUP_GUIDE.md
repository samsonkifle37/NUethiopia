# Local Development Setup Guide
## Running NU Ethiopia App on Localhost

---

## Prerequisites

### Required
- Node.js 18+ (18.17 or newer recommended)
- npm 9+ or yarn
- Git
- PostgreSQL or access to Supabase database
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Check Your Environment
```bash
node --version        # Should be v18.17.0 or higher
npm --version        # Should be 9.0.0 or higher
```

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /path/to/NuAddisAbaba

# Install all npm packages
npm install

# Install missing QR code dependency
npm install qrcode.react
```

**Expected output:**
```
added XXX packages, and audited XXX packages in XXs
found 0 vulnerabilities
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/nu_ethiopia

# JWT Secret (Generate a random string)
JWT_SECRET=your_very_long_random_secret_key_here_min_32_chars

# Site URL (for share links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ Important:**
- Never commit `.env.local` to Git
- Keep secrets confidential
- Use different keys for dev/prod

### 3. Database Setup

#### Option A: Using Supabase (Recommended)
```bash
# Push schema to Supabase
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

#### Option B: Local PostgreSQL
```bash
# Make sure PostgreSQL is running
# Then run migrations
npx prisma migrate dev --name init

# Or push schema
npx prisma db push
```

**Verify connection:**
```bash
npx prisma studio  # Opens Prisma data browser on http://localhost:5555
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

This creates TypeScript types from your schema.

### 5. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> v2@0.1.0 dev
> next dev

  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 6. Open in Browser

Visit **http://localhost:3000** in your browser.

---

## Verification Checklist

After starting the dev server, verify these things:

```
[ ] App loads at http://localhost:3000
[ ] No red errors in browser console
[ ] BottomNav visible with 8 icons
[ ] Can click to different pages
[ ] Images load properly
[ ] No API errors in Network tab
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'qrcode.react'"
**Solution:**
```bash
npm install qrcode.react --save
```

### Issue: "DATABASE_URL is not configured"
**Solution:**
- Check `.env.local` exists
- Verify DATABASE_URL is set
- Restart dev server: `Ctrl+C` then `npm run dev`

### Issue: "Prisma Client not found"
**Solution:**
```bash
npx prisma generate
npm run dev
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process using port 3000
# On Mac/Linux:
lsof -ti :3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Issue: "Cannot connect to database"
**Solution:**
- Verify DATABASE_URL is correct
- Test connection: `npx prisma db execute --stdin`
- Check if database server is running
- For Supabase: verify project URL and key

### Issue: "Module not found" errors
**Solution:**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Next.js build errors
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## Development Workflow

### Running the App
```bash
npm run dev
```
Visit http://localhost:3000

### Making Code Changes
- Edit files in `src/` directory
- Changes hot-reload automatically
- Check browser console for errors

### Database Changes
```bash
# If you modify schema (prisma/schema.prisma):
npx prisma generate      # Generate types
npx prisma db push       # Apply changes to database
```

### Testing API Endpoints
```bash
# Via browser Network tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Make API calls in app
4. Watch requests/responses

# Via Prisma Studio:
npx prisma studio
# Opens http://localhost:5555
# Explore and test data
```

---

## Testing the Features

### Test Collections (Days 1-2)
```
1. Navigate to /favorites
2. Click "Create Collection"
3. Fill form (name, emoji, color)
4. Submit
5. See collection appear in grid
6. Add a place to collection (via heart button)
7. Click collection to view details
```

### Test Itineraries (Days 3-5)
```
1. Navigate to /itineraries
2. Click "Create New Itinerary"
3. Fill form (title, city, duration)
4. Submit
5. Click "Edit" to open editor
6. Expand days to view/add activities
7. Add activities to days
```

### Test Sharing (Days 5-6)
```
1. In itinerary editor, click "Share"
2. Select expiration time
3. Click "Create Share Link"
4. Copy URL
5. Open in new browser/incognito window
6. View shared itinerary (no login needed)
7. Check view count increments
```

---

## Debugging Tips

### View Console Logs
```bash
# Browser console (F12)
- Shows client-side errors
- Shows network request details
- Shows React warnings

# Server console (terminal)
- Shows server-side errors
- Shows API logs
- Shows build messages
```

### Use Prisma Studio
```bash
npx prisma studio
# Visual database explorer
# View, create, edit, delete records
# Test queries
```

### Check Network Requests
```
F12 → Network tab
- Watch API calls
- See request/response data
- Monitor response times
- Check status codes
```

### Use React Query DevTools
```
Open: http://localhost:3000
Look for React Query icon in DevTools
- Monitor cache
- Inspect queries
- Track mutations
```

---

## Performance Tips

### Fast Reload During Development
```bash
# Next.js Hot Reload is enabled by default
# Changes appear instantly (usually < 1s)
# No need to refresh browser
```

### Optimize Images
```bash
# Next.js optimizes images automatically
# But you can test performance:
1. Open DevTools → Performance tab
2. Record a session
3. Take screenshots
4. Check image load times
```

### Monitor Bundle Size
```bash
npm run build
# Shows bundle analysis
# Next.js will warn about large imports
```

---

## Next Steps

### After Verification
1. ✅ Run through TESTING_PLAN.md
2. ✅ Test all features on localhost
3. ✅ Fix any issues found
4. ✅ Document limitations
5. ✅ Prepare for deployment

### Deployment Preparation
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Environment variables ready for production
- [ ] Security audit complete

---

## Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Prisma
npx prisma generate      # Generate client
npx prisma studio        # Open data browser
npx prisma db push       # Push schema to DB
npx prisma migrate dev   # Create migration
```

### Cleanup
```bash
rm -rf .next             # Clear Next.js cache
rm -rf node_modules      # Clear dependencies
npm install              # Reinstall packages
```

---

## FAQ

**Q: Can I use yarn instead of npm?**
A: Yes! Just use `yarn` instead of `npm`

**Q: Do I need a database running locally?**
A: Only if using local PostgreSQL. Supabase is easier.

**Q: How do I debug API calls?**
A: Use DevTools Network tab or Prisma Studio

**Q: Can I modify the database schema?**
A: Yes, edit `prisma/schema.prisma` then `npx prisma db push`

**Q: How do I add new environment variables?**
A: Edit `.env.local` and restart dev server

**Q: Is it safe to share .env.local?**
A: NO! Never share secrets. Add to .gitignore

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Ready to start local testing? Run `npm run dev` and open http://localhost:3000!**
