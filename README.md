# Evana

An editorial, mobile-first storefront and owner dashboard for Evana's hand-poured candles. Built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, NextAuth credentials, Zod, Resend, and Cloudinary.

MongoDB is used because orders, customer snapshots, items, and status history fit naturally into documents, while Atlas provides managed hosting and transaction support for safe stock adjustments.

## Local setup

1. Install Node.js 20.19+ and create a MongoDB Atlas database. Create a database user with access only to the Evana database and allow your deployment IP in Atlas Network Access.
2. Copy `.env.example` to `.env.local`. Set `MONGODB_URI`, a unique `NEXTAUTH_SECRET` (for example, `openssl rand -base64 32`), and owner credentials. Use a unique admin password of at least 12 characters. Never commit `.env.local`.
3. Install dependencies and seed:

   ```bash
   npm install
   npm run seed
   ```

   This creates a bcrypt-hashed owner account, 12 sample products, three collections, and default shipping settings. Products and collections are inserted idempotently; the owner hash is updated from the environment on each run.

4. Run `npm run dev`, then open `http://localhost:3000`. The owner dashboard is at `/admin/login`.

## Vercel deployment

Import the repository into Vercel and configure the variables from `.env.example` in Project Settings. Set both `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production origin, and use a newly generated production `NEXTAUTH_SECRET`. Restrict Atlas network access according to your plan. Run `npm run seed` against the production database once from a trusted environment before opening orders; do not seed development credentials into production.

Configure a verified Resend sender domain and set `RESEND_API_KEY`, `EMAIL_FROM`, and `OWNER_EMAIL` for order notifications. Set the Cloudinary variables to enable product image uploads. Without these optional integrations, checkout and URL-based product images remain available; skipped email delivery is logged.

## Payments

Cash on delivery is the only active payment method. `src/lib/payments/provider.ts` defines the provider interface and a COD implementation. To add Razorpay or Stripe, implement a provider behind that interface, add a server-side payment-intent route and verified webhook handling, persist provider references, and update payment/order status only after a verified server event. Never trust client-submitted totals or a payment redirect as proof of payment. Keep checkout options disabled until credentials, webhooks, and failure/replay tests are in place.

## Operational notes

- Checkout recalculates prices from MongoDB and persists an immutable customer/address snapshot. Orders start `PENDING`; inventory is decremented upon acceptance and restored when a previously accepted order is cancelled. Stock/status changes run in a MongoDB transaction, so use Atlas or a replica set.
- Rate limiting is currently process-local. Before relying on it across multiple Vercel/serverless instances, replace it with a shared Redis/Upstash-backed store.
- Seed the MongoDB products before accepting checkout orders. Demo product photos use Unsplash; use owned/licensed assets in production.
- Confirm business address, support email, returns policy, shipping promises, WhatsApp number, tax treatment, and all customer-facing legal copy before launch.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deployment.
