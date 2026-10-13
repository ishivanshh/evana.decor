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

   This creates a bcrypt-hashed owner account, 20 sample candles, two wax-bar products, four collections, and default shipping settings. Sample candle prices are ₹499–₹699 and wax bars are ₹150 each. Re-running the seed updates prices for those sample products; the owner hash is updated from the environment on each run.

4. Run `npm run dev`, then open `http://localhost:3000`. The owner dashboard is at `/admin/login`.

## Customer accounts and checkout

Customers can create an account at `/register` with an email and password, then sign in at `/login`. From the shopping bag, choose **Place order**: signed-in customers continue to the COD checkout/payment page, while signed-out visitors are sent to sign-in (or account creation) and returned to checkout after successful authentication. Direct visits to `/checkout` use the same protection. Customer accounts are stored separately by role from the owner account; registration cannot grant admin access.

The feedback page is available to signed-in customers only. Signed-out visitors are redirected to customer sign-in and returned to feedback afterward. The `/instagram` page uses the local Instagram profile image in `public/insta.jpg` and includes four reusable reel slots. To display a reel, pass its Instagram reel URL to the `url` prop of `InstagramReel` in `src/app/instagram/page.tsx`; until then, each slot shows a local candle image.

## Checking orders as the owner

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`, then run `npm run seed` once. The password is stored as a bcrypt hash; sign in at `/admin/login`.
2. Open **Orders** from the left navigation in the owner dashboard (`/admin/orders`). Use the status/date filters or search by order ID, customer name, or phone number to find an order.
3. Select an order ID to open its detail view and inspect the customer's contact information, full shipping address, items and quantities, COD payment method, totals, and current status. Pending orders can be accepted or rejected from the order list; rejection requires a reason.

The public track-order page at `/track-order` is intended for customers; use the protected admin order details for the full order record.

## Vercel deployment

Import the repository into Vercel and configure the variables from `.env.example` under **Project Settings → Environment Variables**. For Production, set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your canonical HTTPS domain (for example, `https://www.example.com`) and set `NEXTAUTH_SECRET` to a newly generated secret (`openssl rand -base64 32`). Do not reuse an account password as the secret. Apply the variables to the environments you use, then redeploy so the deployment receives them. Restrict Atlas network access according to your plan. Run `npm run seed` against the production database once from a trusted environment before opening orders; do not seed development credentials into production.

Configure a verified Resend sender domain and set `RESEND_API_KEY`, `EMAIL_FROM`, and `OWNER_EMAIL` for order notifications. Set the Cloudinary variables to enable product image uploads. Without these optional integrations, checkout and URL-based product images remain available; skipped email delivery is logged.

## Payments

Cash on delivery is the only active payment method. `src/lib/payments/provider.ts` defines the provider interface and a COD implementation. To add Razorpay or Stripe, implement a provider behind that interface, add a server-side payment-intent route and verified webhook handling, persist provider references, and update payment/order status only after a verified server event. Never trust client-submitted totals or a payment redirect as proof of payment. Keep checkout options disabled until credentials, webhooks, and failure/replay tests are in place.

## Operational notes

- Checkout recalculates prices from MongoDB and persists an immutable customer/address snapshot. Orders start `PENDING`; inventory is decremented upon acceptance and restored when a previously accepted order is cancelled. Stock/status changes run in a MongoDB transaction, so use Atlas or a replica set.
- Rate limiting is currently process-local. Before relying on it across multiple Vercel/serverless instances, replace it with a shared Redis/Upstash-backed store.
- Seed the MongoDB products before accepting checkout orders. Re-running the seed updates legacy Unsplash demo photos to the local brand assets, but preserves other existing product data and custom image URLs.
- Candle and wax-bar gallery assets are stored locally under `public/candle/` and `public/waxbars/`; add new images to those folders and include their path and descriptive alt text in `src/lib/brand-images.ts` to show them in the galleries. The seed script adds or refreshes matching sample candle products so gallery images open their own product details.
- The home event-photo slider reads up to five image files from `public/event/`; add photos there and redeploy to include them. The bulk-order review photo cards read up to three images from `public/reviews/` and reserve empty cards until more are added. Bulk-order Instagram embeds are configured in `src/app/bulk-orders/page.tsx`.
- Confirm business address, support email, returns policy, shipping promises, WhatsApp number, tax treatment, and all customer-facing legal copy before launch.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` before deployment.
