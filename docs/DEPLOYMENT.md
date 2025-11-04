# Vercel Deployment Guide

## Quick Start

Since your GitHub repo is already connected to Vercel, deployment is automatic!

### Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: configure for production deployment with Neon PostgreSQL"
   git push
   ```

2. **Vercel automatically deploys:**
   - Vercel detects the push
   - Runs build with migrations
   - Deploys to production

3. **Check deployment:**
   - Go to your Vercel dashboard
   - Watch the build logs
   - Visit your deployment URL

### First Deployment Steps

After your first deployment:

1. **Verify database connection:**
   - Check Vercel logs for any database connection errors
   - Ensure `DATABASE_URL` is set in Vercel environment variables

2. **Run migrations (if needed):**
   - Migrations run automatically during build (`vercel.json`)
   - If migrations fail, you can run manually:
     ```bash
     npx vercel env pull .env.production
     npm run db:migrate:deploy
     ```

3. **Seed production database (one-time):**
   ```bash
   # In Vercel dashboard, go to your project → Settings → Environment Variables
   # Copy DATABASE_URL
   # Then run locally:
   DATABASE_URL="your-production-url" npm run db:seed
   ```

## Manual Deployment (Vercel CLI)

If you prefer using the CLI:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Build Process

Vercel runs these commands automatically:

1. `npm install` - Install dependencies
2. `prisma generate` - Generate Prisma Client (via `postinstall` script)
3. `prisma migrate deploy` - Run database migrations
4. `npm run build` - Build Next.js app
5. Deploy to Vercel edge network

## Environment Variables

Vercel automatically sets:
- `DATABASE_URL` - From Neon database connection

You can add more in:
- Vercel Dashboard → Project → Settings → Environment Variables

## Troubleshooting

### Build fails with "Missing DATABASE_URL"
- Check Vercel dashboard → Environment Variables
- Ensure Neon database is connected
- Verify `DATABASE_URL` is set for Production, Preview, and Development

### Migrations fail
- Check build logs in Vercel dashboard
- Ensure database is accessible from Vercel
- Verify Prisma schema is correct

### Database connection timeout
- Check Neon dashboard for connection limits
- Verify database is running
- Check network settings in Neon

## After Deployment

1. **Test your app:**
   - Visit your Vercel URL
   - Test all pages and features
   - Check database queries work

2. **Monitor:**
   - Vercel Dashboard → Analytics
   - Check for errors in logs
   - Monitor database usage in Neon dashboard

3. **Set up custom domain (optional):**
   - Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain

## Continuous Deployment

Every push to your main branch automatically:
- Triggers a new deployment
- Runs migrations
- Deploys to production

Preview deployments are created for:
- Pull requests
- Other branches

