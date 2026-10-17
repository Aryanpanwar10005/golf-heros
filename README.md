# Digital Heroes Golf

A prototype of a subscription golf platform where members log their scores, a monthly prize draw runs off those scores, and part of the money goes to charity. I designed the data model and wrote the draw, prize-pool and payment logic and the main screens in Next.js and Supabase. The screens still use placeholder data, and the [Status](#status) section says exactly what is and isn't wired up.

**Live demo:** [golfheros.vercel.app](https://golfheros.vercel.app). Payments run in Razorpay **test mode** only, so no real money moves.

## How it works

### Rolling-5 index
The `insert_score_rolling` Postgres function inserts a new score and recalculates the player's `golf_index` as the average of their five most recent scores, in a single database call. Players can log one score per day, and gross scores must be between 1 and 145.

### Draws
`src/lib/draw-engine/draw-logic.ts` has two draw modes:
- **Random:** picks 5 unique numbers from 1 to 45.
- **Algorithmic:** a weighted random pick that favours either the most frequent or the least frequent scores in the player pool.

`countMatches` compares a player's scores with the winning numbers. Matching 3, 4 or 5 numbers puts the player in a prize tier.

### Prize pool
`src/lib/prize-pool/calculator.ts` sets the pool as a percentage of subscription revenue and splits it into 5-match (plus any rolled-over jackpot), 4-match and 3-match tiers. Each tier is shared equally among its winners. The admin screen defaults to a 40 / 35 / 25 split.

### Payments
Razorpay, in test mode. A server-side helper creates subscriptions, and the webhook at `/api/webhooks/razorpay` verifies the Razorpay signature before handling subscription activated, charged, cancelled and halted events.

### Data and security
The Supabase schema has `profiles`, `subscriptions`, `scores`, `draws` and `winners` tables. Row-level security on profiles, scores and subscriptions limits users to their own rows. A scheduled GitHub Action pings the Supabase API every three days so the free-tier project doesn't pause.

## Status

Built and in the repo:
- Database schema, RLS policies and the rolling-5 function
- Draw logic (random and frequency-weighted) and prize-pool maths
- Razorpay subscription helper and signature-checked webhook (test mode)
- Landing, login, signup, dashboard and admin screens, deployed on Vercel

Not wired up yet:
- The dashboard and admin screens show placeholder data. Submitting a score updates the screen but doesn't call Supabase.
- The login and signup forms aren't connected to Supabase Auth, and the route guard in `middleware.ts` is a stub.
- The admin draw buttons simulate a run. They don't call the draw functions yet.
- The webhook logs subscription events but doesn't update the database, and the dashboard's payment button is a placeholder.

## Tech stack
- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Lucide icons
- **Backend:** Supabase (Postgres, row-level security)
- **Payments:** Razorpay Node SDK (test mode)
- **Hosting:** Vercel

## How to run
1. `npm install`
2. Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   RAZORPAY_KEY_ID=            # test-mode key
   RAZORPAY_KEY_SECRET=
   RAZORPAY_WEBHOOK_SECRET=
   ```
3. Run `supabase/migrations/20260422_init.sql` in the Supabase SQL editor.
4. `npm run dev`

## Project structure
```
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Landing page
│   │   ├── (auth)/login, (auth)/signup   # Auth screens
│   │   ├── (dashboard)/dashboard         # Player dashboard
│   │   ├── (admin)/admin                 # Draw and prize-pool controls
│   │   └── api/webhooks/razorpay         # Razorpay webhook
│   ├── components/                       # Navigation, ScoreModal
│   ├── lib/
│   │   ├── draw-engine/draw-logic.ts     # Random and weighted draws
│   │   ├── prize-pool/calculator.ts      # Pool split and per-winner prizes
│   │   ├── razorpay/                     # Client, subscription helper, signature check
│   │   └── supabase/                     # Supabase client
│   └── middleware.ts                     # Route guard (stub)
├── supabase/migrations/20260422_init.sql # Schema, RLS, rolling-5 function
├── docs/                                 # Implementation plan and product requirements
└── .github/workflows/keep-alive.yml      # Keeps the Supabase project awake
```

---

Built by [Aryan Panwar](https://aryanpanwar.in).
