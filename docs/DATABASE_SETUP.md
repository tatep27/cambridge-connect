# Database Setup Guide

## Overview

Cambridge Connect uses **Neon PostgreSQL** for production and **SQLite** for local development.

## Environment Variables

### Local Development (SQLite)

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
```

### Production (Vercel + Neon)

Vercel automatically sets `DATABASE_URL` when you connect Neon database. No manual setup needed!

The connection string format:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Database Commands

### Development

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (quick dev workflow)
npm run db:push

# Create and run migrations (recommended)
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Production

```bash
# Run migrations in production (Vercel does this automatically)
npm run db:migrate:deploy
```

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Create database and run migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Seed initial data:**
   ```bash
   npm run db:seed
   ```

6. **Start dev server:**
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

1. **Connect Neon Database** (already done ✅)
   - Vercel automatically sets `DATABASE_URL`
   - No manual configuration needed

2. **Vercel Build Process:**
   - `postinstall` script runs `prisma generate` automatically
   - Migrations run automatically via `db:migrate:deploy` in build

3. **First Deployment:**
   - After connecting Neon, deploy your project
   - Run migrations: `npm run db:migrate:deploy` (or set up in Vercel build command)
   - Seed production database: `npm run db:seed` (manual one-time setup)

## Database Schema

The database includes:
- **Organization** - Cambridge organizations
- **Forum** - Discussion forums
- **ForumPost** - Posts within forums
- **ForumReply** - Replies to posts

All relationships are maintained with foreign keys and cascade deletes.

## Migrations

### Create a new migration:
```bash
npm run db:migrate
# Enter migration name when prompted
```

### Apply migrations in production:
```bash
npm run db:migrate:deploy
```

## Troubleshooting

### "Missing DATABASE_URL" error
- Make sure `.env` file exists with `DATABASE_URL`
- For production, check Vercel environment variables

### "Database does not exist" error
- Run migrations: `npm run db:migrate`
- Or push schema: `npm run db:push` (dev only)

### Connection timeout (production)
- Check Neon database is running
- Verify `DATABASE_URL` in Vercel dashboard
- Check Neon dashboard for connection limits

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)

