# DIGO Store

A simple upload-and-sell ecommerce starter:

- Admin uploads a product image, name, price, and description.
- Products appear on the storefront.
- Customers add products to cart.
- Stripe Checkout takes payment.
- Stripe webhook records paid orders in Supabase.

## 1. Create Supabase

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy these values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 2. Create Stripe

1. Create a Stripe account.
2. Copy your secret key into `STRIPE_SECRET_KEY`.
3. After deployment, create a webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## 3. Local setup

Copy `.env.example` to `.env.local`, then fill in the values.

```bash
pnpm install
pnpm dev
```

Open:

- Storefront: `http://localhost:3000`
- Admin upload page: `http://localhost:3000/admin`

The admin page uses `ADMIN_SECRET` from `.env.local` as its password.

## 4. Deploy

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add every `.env.local` value as a Vercel environment variable.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
5. Add the Stripe webhook after Vercel gives you a production URL.

## Notes

This is an MVP admin flow. It is protected by a shared admin password, which is fine for a first private launch. For a larger team, replace it with Supabase Auth or a proper admin login.


## Payment integration setup and verification

See [PAYMENT_SETUP.md](PAYMENT_SETUP.md) for test-only Stripe configuration, the exact webhook URL, and end-to-end acceptance checks.
