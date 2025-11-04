# Deployment Checklist

## Pre-Deployment ✅

- [x] All tests passing (178 tests)
- [x] Build succeeds locally
- [x] Neon database connected to Vercel
- [x] DATABASE_URL environment variable set in Vercel
- [x] Vercel.json configured

## Deployment Steps

### Option 1: Automatic (Recommended)

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: configure for production deployment"
   git push
   ```

2. **Vercel automatically:**
   - Detects push
   - Runs build with migrations
   - Deploys to production

3. **Check deployment:**
   - Go to https://vercel.com/dashboard
   - Click on your project
   - Watch build logs
   - Visit deployment URL

### Option 2: Manual via Vercel Dashboard

1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Or push to trigger new deployment

## First Deployment - Database Setup

### Option A: Use db push (Easier)

The build command will:
1. Generate Prisma Client
2. Try migrations (if they exist)
3. Fall back to `db push` if no migrations
4. Build the app

This works for first deployment!

### Option B: Create migrations first

If you want proper migrations:

1. **Get DATABASE_URL from Vercel:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Copy DATABASE_URL

2. **Create migration locally:**
   ```bash
   DATABASE_URL="your-production-url" npx prisma migrate dev --name init
   ```

3. **Commit migration files:**
   ```bash
   git add prisma/migrations
   git commit -m "feat: add initial database migration"
   git push
   ```

## After Deployment

1. **Seed production database (one-time):**
   ```bash
   # Get DATABASE_URL from Vercel dashboard
   DATABASE_URL="your-production-url" npm run db:seed
   ```

2. **Test your app:**
   - Visit your Vercel URL
   - Test all pages
   - Verify database queries work

3. **Monitor:**
   - Check Vercel logs for errors
   - Check Neon dashboard for database usage

## Troubleshooting

### Build fails: "Missing DATABASE_URL"
- Check Vercel → Settings → Environment Variables
- Ensure Neon database is connected
- Verify DATABASE_URL is set for Production environment

### Build fails: "Migration failed"
- First deployment: Use `db push` (already configured)
- Subsequent: Check migration files are committed
- Check Neon database is accessible

### Database connection timeout
- Check Neon dashboard
- Verify database is running
- Check connection limits

## What Happens During Build

1. `npm install` - Install dependencies
2. `prisma generate` - Generate Prisma Client (via postinstall too)
3. `prisma migrate deploy` OR `prisma db push` - Set up database
4. `npm run build` - Build Next.js app
5. Deploy to Vercel edge network

## Quick Deploy Command

```bash
# Commit and push (triggers auto-deploy)
git add . && git commit -m "Deploy to production" && git push
```

That's it! Vercel handles the rest automatically.

