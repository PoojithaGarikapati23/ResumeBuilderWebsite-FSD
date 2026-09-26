# Deployment Guide

This project is configured as a full-stack Next.js application, which means both the frontend and the backend API routes are contained within the same repository.

## Vercel Deployment (Recommended for Full-Stack Next.js)

Since this is a Next.js application, deploying to Vercel is the easiest and most robust option, as Vercel natively supports Next.js API routes and serverless functions without the need for a separate backend service.

### Settings:
- **Repository:** `PoojithaGarikapati23/ResumeBuilderWebsite-FSD`
- **Root Directory:** `/`
- **Framework:** `Next.js`
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output configuration:** Default Next.js configuration

### Required Environment Variables:
| Variable | Platform | Purpose | Example format |
|---|---|---|---|
| `DATABASE_URL` | Vercel (or Render) | PostgreSQL connection string | `postgresql://user:password@host:port/database` |
| `NEXTAUTH_SECRET` | Vercel | Secret for NextAuth sessions | `your_random_secret_string` |
| `NEXTAUTH_URL` | Vercel | The production URL of your app | `https://your-app.vercel.app` |
| `OPENAI_API_KEY` | Vercel | Key for AI processing | `sk-...` |

## Render Deployment (If a separate backend is desired)

If you specifically need to deploy this to Render, note that Next.js applications run perfectly as web services on Render. Render will serve both the frontend and the backend Next.js API routes.

### Settings:
- **Service Type:** Web Service
- **Repository:** `PoojithaGarikapati23/ResumeBuilderWebsite-FSD`
- **Root Directory:** `/`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Required Environment Variables:
(Same as the Vercel table above)

---

**Note on Database:**
You must provision a PostgreSQL database (e.g., via Supabase, Neon, or Render PostgreSQL) and add the connection string as `DATABASE_URL` before the application can function in production. Prisma will automatically handle the connection when you run migrations.
