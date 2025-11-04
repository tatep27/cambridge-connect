# Cambridge Connect

A collaboration platform for Cambridge-based organizations (nonprofits, public library, community centers, grassroots, arts/venues).

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Prisma ORM
- PostgreSQL (Neon) / SQLite (local dev)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Database Setup

See [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md) for detailed database setup instructions.

Quick reference:
- **Local:** SQLite (`file:./dev.db`)
- **Production:** PostgreSQL (Neon via Vercel)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Create and run migrations
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## Phase Status

- ✅ Phase 0: Project Setup
- ✅ Phase 1: Frontend Screens with Mock Data
- ✅ Phase 2: API Routes (Mock-Backed)
- ✅ Phase 3: Database + Prisma Integration
- ⏳ Phase 4: Auth + Org Context (Upcoming)

See `implementation_notes/` for detailed phase documentation.
