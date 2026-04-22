# Digital Heroes Golf Platform — Full Implementation Plan v2.0
## Corrected & Verified · April 2026

---

## Executive Summary

This is the fully corrected implementation plan for the Digital Heroes Golf Platform assignment — a subscription-driven web app combining golf score tracking, monthly prize draws, and charity fundraising. All tools below are **free**, **available in India**, and **verified as of April 2026**. This plan replaces v1.0 and incorporates all corrections including payment gateway, Vercel plan policy, and Supabase pause prevention.

---

## ⚠️ Corrections from v1.0

| Issue | v1.0 (Wrong) | v2.0 (Correct) |
|-------|-------------|----------------|
| Payment Gateway | Stripe (invite-only, restricted in India) | **Razorpay** (primary) / **Cashfree** (alternate) |
| Vercel plan | Hobby plan assumed fine for any project | Hobby = **non-commercial only**; assessment project qualifies but do NOT add real revenue |
| Supabase pause | Not addressed | Add GitHub Actions ping to prevent 7-day pause |
| Stripe env vars | `STRIPE_*` | `RAZORPAY_*` / `CASHFREE_*` |

---

## 1. GitHub Reference Repositories

No public repo exists that matches this exact PRD (golf + subscriptions + charity + draw engine combined). Use these as scaffolding references:

| Repo | Purpose | Use For |
|------|---------|---------|
| `KolbySisk/next-supabase-stripe-starter` | Next.js 15 + Supabase + Stripe + shadcn/ui + Resend | Base scaffold — swap Stripe → Razorpay |
| `nextjs/saas-starter` | Official Next.js + Supabase + Stripe template | Auth + subscription pattern reference |
| `piyushyadav1617/razorpay-next` | Razorpay + Next.js integration | Payment integration reference |
| `travisvn/supabase-pause-prevention` | GitHub Actions cron to prevent Supabase pause | Copy this workflow directly |
| `gmalewicz/golf-web` | Golf Stableford scoring front-end (Angular) | Score logic reference only |

**Recommended approach:** Clone `KolbySisk/next-supabase-stripe-starter`, remove Stripe, add Razorpay using `piyushyadav1617/razorpay-next` as reference.

---

## 2. Verified Free Tech Stack (India, April 2026)

### Full Stack Selection

```
Framework:     Next.js 15 (App Router, TypeScript)  ← Definitive 2026 choice
Styling:       Tailwind CSS v4 + shadcn/ui
Database:      Supabase (PostgreSQL) — Free tier
Auth:          Supabase Auth (email/password + magic link)
Payments:      Razorpay (Test Mode for assessment) — PRIMARY
               Cashfree (Sandbox for assessment) — ALTERNATE
Email:         Resend Free (3,000/month, 100/day)
Hosting:       Vercel Hobby (non-commercial — valid for assessment)
Storage:       Supabase Storage (winner proof screenshots)
Forms:         React Hook Form + Zod
Icons:         Lucide React
Charts:        Recharts (admin analytics)
State:         Zustand (client state only)
```

### Free Tier Limits — Verified

| Service | Free Allowance | India? | Key Constraint |
|---------|---------------|--------|----------------|
| Vercel Hobby | 100GB bandwidth, unlimited deploys | ✅ | Non-commercial only — assessment qualifies |
| Supabase Free | 500MB DB, 50K MAUs, 1GB storage | ✅ | Pauses after 7 days inactivity → fix with cron |
| Razorpay Test Mode | Unlimited test transactions | ✅ | No KYC needed for test/sandbox mode |
| Cashfree Sandbox | Full sandbox, auto API keys generated | ✅ | Endpoint: `sandbox.cashfree.com` |
| Resend Free | 3,000 emails/month, 100/day | ✅ | Sufficient for assessment |
| GitHub Free | Unlimited private repos | ✅ | — |

---

## 3. Payment Gateway — Razorpay (Primary Choice)

Razorpay is the best fit for this assessment. It has full subscription billing, is PCI-compliant (satisfying PRD §04), has a complete sandbox environment, and requires no KYC or business registration to use test mode.

### Why Razorpay Over Cashfree for This Project

| Factor | Razorpay | Cashfree |
|--------|----------|----------|
| Subscription API maturity | ✅ Full Plans + Subscriptions API | ✅ Subscriptions available |
| Next.js integration docs | ✅ Excellent (official + community) | ⚠️ Limited Next.js-specific docs |
| Sandbox API key generation | ✅ Instant, no KYC | ✅ Auto-generated in test mode |
| Webhook events | ✅ Rich: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed` | ✅ Similar webhook support |
| Test mode | ✅ Test VPA: `success@razorpay` / `failure@razorpay` | ✅ Test cards + test UPI VPAs |
| Transaction fee (production) | 2% domestic | 1.2–2.4% + GST |

**Use Cashfree if:** Razorpay account signup hits any roadblock. Cashfree auto-generates sandbox API keys (`TEST_` prefix) instantly with no approval wait.

### Razorpay Subscription Flow (replaces Stripe in PRD)

```
1. Admin creates Plans in Razorpay Dashboard:
   - Plan A: "monthly_golf" — ₹X/month (or GBP equivalent)
   - Plan B: "yearly_golf"  — ₹Y/year (discounted)

2. User subscribes:
   a. Server Action creates Razorpay Subscription via API (POST /v1/subscriptions)
      — passes plan_id, total_count, notes: { userId }
   b. Returns subscription_id + short_url
   c. Client opens Razorpay Checkout modal with subscription_id
   d. User pays via UPI / Card / Net Banking

3. Razorpay fires webhooks to /api/webhooks/razorpay:
   - subscription.activated   → INSERT subscriptions (status: active)
   - subscription.charged     → UPDATE current_period_end
   - subscription.cancelled   → UPDATE status: cancelled
   - subscription.halted      → UPDATE status: lapsed, send email
   - payment.failed           → send payment failure email

4. Webhook verification (HMAC-SHA256):
   const expectedSig = crypto
     .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
     .update(rawBody)
     .digest('hex');
   if (expectedSig !== req.headers['x-razorpay-signature']) → reject 400
```

### Cashfree Subscription Flow (Alternate)

```
1. Create Plans in Cashfree Dashboard (Subscriptions → Plans)
2. Server-side: POST to sandbox.cashfree.com/api/v2/subscriptions
   Headers:
     x-client-id: TEST_APP_ID
     x-client-secret: TEST_SECRET_KEY
     x-api-version: 2025-01-01
3. Client: load Cashfree JS SDK, open checkout with session token
4. Webhooks to /api/webhooks/cashfree
   Events: SUBSCRIPTION_ACTIVATED, SUBSCRIPTION_CHARGED, SUBSCRIPTION_CANCELLED
```

---

## 4. Supabase Pause Prevention

Free tier projects pause after **7 consecutive days of inactivity**. For an assessment, the reviewer will visit your live URL — if it's paused, it fails. Fix this with a GitHub Actions scheduled workflow.

### GitHub Actions Cron (copy from `travisvn/supabase-pause-prevention`)

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Supabase Keep-Alive
on:
  schedule:
    - cron: '0 12 */5 * *'   # Runs every 5 days at noon UTC
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase project
        run: |
          curl -s "${{ secrets.SUPABASE_URL }}/rest/v1/" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to GitHub repository secrets. This silently keeps the project active without any database writes.

---

## 5. Database Schema (Supabase / PostgreSQL)

Enable **Row-Level Security (RLS)** on every table. Enable `pgcrypto` extension for `gen_random_uuid()`.

### 5.1 `profiles`
```sql
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  email       text UNIQUE NOT NULL,
  avatar_url  text,
  role        text DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

### 5.2 `subscriptions`
```sql
CREATE TABLE subscriptions (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  razorpay_customer_id      text,
  razorpay_subscription_id  text UNIQUE,
  plan_type                 text CHECK (plan_type IN ('monthly', 'yearly')),
  status                    text DEFAULT 'inactive'
                            CHECK (status IN ('active','inactive','cancelled','lapsed')),
  current_period_start      timestamptz,
  current_period_end        timestamptz,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);
```

### 5.3 `golf_scores`
```sql
CREATE TABLE golf_scores (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score       int NOT NULL CHECK (score >= 1 AND score <= 45),
  score_date  date NOT NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, score_date)   -- PRD §13: one score per date
);

-- Index for fast rolling-5 queries
CREATE INDEX idx_golf_scores_user_date ON golf_scores(user_id, score_date DESC);
```

### 5.4 `charities`
```sql
CREATE TABLE charities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  description  text,
  image_url    text,
  website_url  text,
  is_featured  boolean DEFAULT false,
  is_active    boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);
```

### 5.5 `charity_events`
```sql
CREATE TABLE charity_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id  uuid REFERENCES charities(id) ON DELETE CASCADE,
  title       text NOT NULL,
  event_date  date,
  description text,
  created_at  timestamptz DEFAULT now()
);
```

### 5.6 `user_charity_selections`
```sql
CREATE TABLE user_charity_selections (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  charity_id           uuid REFERENCES charities(id),
  contribution_percent int DEFAULT 10 CHECK (contribution_percent >= 10 AND contribution_percent <= 100),
  updated_at           timestamptz DEFAULT now()
);
```

### 5.7 `prize_pool_config`
```sql
CREATE TABLE prize_pool_config (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_pool_pct   numeric DEFAULT 30,  -- % of subscription fee to prize pool
  match5_pct              numeric DEFAULT 40,
  match4_pct              numeric DEFAULT 35,
  match3_pct              numeric DEFAULT 25,
  updated_at              timestamptz DEFAULT now()
);
-- Seed with one row; admin edits this row only
INSERT INTO prize_pool_config DEFAULT VALUES;
```

### 5.8 `draws`
```sql
CREATE TABLE draws (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month      date NOT NULL UNIQUE,  -- first day of month e.g. 2026-04-01
  draw_type       text CHECK (draw_type IN ('random', 'algorithmic')),
  algo_mode       text CHECK (algo_mode IN ('most_frequent', 'least_frequent')),
  winning_numbers int[] NOT NULL,         -- 5 numbers [1..45]
  status          text DEFAULT 'draft'
                  CHECK (status IN ('draft', 'simulated', 'published')),
  jackpot_pool    numeric(12,2) DEFAULT 0,
  pool_4match     numeric(12,2) DEFAULT 0,
  pool_3match     numeric(12,2) DEFAULT 0,
  jackpot_rollover_from_prev numeric(12,2) DEFAULT 0,
  created_by      uuid REFERENCES profiles(id),
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);
```

### 5.9 `draw_entries`
```sql
CREATE TABLE draw_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id     uuid REFERENCES draws(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES profiles(id),
  scores      int[] NOT NULL,   -- snapshot of user's 5 scores at publish time
  match_count int DEFAULT 0,    -- 0, 3, 4, or 5
  created_at  timestamptz DEFAULT now(),
  UNIQUE (draw_id, user_id)
);
```

### 5.10 `winners`
```sql
CREATE TABLE winners (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id             uuid REFERENCES draws(id),
  user_id             uuid REFERENCES profiles(id),
  match_type          text CHECK (match_type IN ('5_match','4_match','3_match')),
  prize_amount        numeric(12,2),
  proof_storage_path  text,               -- Supabase Storage object path
  verification_status text DEFAULT 'pending'
                      CHECK (verification_status IN ('pending','approved','rejected')),
  payment_status      text DEFAULT 'pending'
                      CHECK (payment_status IN ('pending','paid')),
  admin_notes         text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
```

### RLS Policy Summary

```sql
-- profiles: users manage own row; admins read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON profiles
  USING (auth.uid() = id);
CREATE POLICY "admin_read_all" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- golf_scores: users manage own scores only
ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_scores" ON golf_scores
  USING (auth.uid() = user_id);

-- subscriptions: users read own; webhooks use service_role (bypasses RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_subscription" ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- draws: published draws are public read; admin full write
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published_draws_public" ON draws FOR SELECT
  USING (status = 'published');

-- charities: public read; admin write
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "charities_public_read" ON charities FOR SELECT USING (true);

-- winners: users read own; admin full
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_winners" ON winners FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 6. Application Architecture

### 6.1 Folder Structure (Next.js 15 App Router)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Landing homepage
│   │   ├── charities/page.tsx        # Public charity directory
│   │   └── how-it-works/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/                  # Protected: active subscriber only
│   │   ├── dashboard/page.tsx
│   │   ├── scores/page.tsx
│   │   ├── draws/page.tsx
│   │   ├── charity/page.tsx
│   │   ├── winners/page.tsx
│   │   └── settings/page.tsx
│   └── (admin)/                      # Protected: role=admin only
│       └── admin/
│           ├── page.tsx              # Overview + metrics
│           ├── users/page.tsx
│           ├── draws/page.tsx        # Configure, simulate, publish
│           ├── charities/page.tsx
│           ├── winners/page.tsx      # Verify + mark paid
│           └── reports/page.tsx
├── api/
│   └── webhooks/
│       └── razorpay/route.ts         # Webhook handler (Route Handler, not Server Action)
├── components/
│   ├── ui/                           # shadcn/ui base components
│   ├── score/                        # ScoreCard, ScoreEntryForm, ScoreList
│   ├── draw/                         # DrawNumbers, DrawResults, DrawTimer
│   ├── charity/                      # CharityCard, CharitySelector, ContributionSlider
│   └── admin/                        # AdminTable, DrawConfig, WinnerVerify
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server component client
│   │   └── middleware.ts             # Session refresh
│   ├── razorpay/
│   │   ├── client.ts                 # Razorpay instance (server only)
│   │   └── helpers.ts                # createSubscription, verifyWebhook
│   ├── draw-engine/
│   │   └── draw-logic.ts             # random draw + algorithmic draw
│   ├── prize-pool/
│   │   └── calculator.ts             # pool amounts, winner splits
│   └── email/
│       ├── resend.ts
│       └── templates/                # React Email .tsx templates
├── actions/
│   ├── score.ts                      # submitScore, editScore, deleteScore
│   ├── charity.ts                    # selectCharity, updateContribution
│   ├── subscription.ts               # createSubscription, cancelSubscription
│   ├── draw.ts                       # simulateDraw, publishDraw (admin)
│   └── winner.ts                     # uploadProof, verifyWinner, markPaid (admin)
└── middleware.ts                     # Route protection + role guards
```

### 6.2 Middleware Logic

```typescript
// middleware.ts — runs on every request
// 1. Refresh Supabase session cookie
// 2. Read user session → get user id
// 3. For /dashboard/* routes: no session → redirect /login
// 4. For /dashboard/* routes: check subscriptions.status = 'active' → else redirect /settings
// 5. For /admin/* routes: check profiles.role = 'admin' → else redirect /dashboard
// 6. /api/webhooks/* → skip auth, handled internally by signature verification
```

---

## 7. Core Feature Logic

### 7.1 Score Management (PRD §05)

**Server Action: `submitScore(score: number, date: string)`**

```
1. Get userId from Supabase session
2. Validate score: must be integer, 1 ≤ score ≤ 45 (reject otherwise)
3. Validate date: must be valid date, not in future
4. Check UNIQUE constraint: SELECT FROM golf_scores WHERE user_id = ? AND score_date = ?
   → If exists: return error "A score already exists for this date. Edit or delete it."
5. Count user's current scores: SELECT COUNT(*) FROM golf_scores WHERE user_id = ?
6. If count >= 5:
   → SELECT id FROM golf_scores WHERE user_id = ? ORDER BY score_date ASC LIMIT 1
   → DELETE that row
7. INSERT new score (user_id, score, score_date)
8. Return refreshed score list ORDER BY score_date DESC LIMIT 5
```

**Server Action: `editScore(scoreId: string, newScore: number)`**

```
1. Verify ownership: SELECT FROM golf_scores WHERE id = ? AND user_id = auth.uid()
   (RLS also enforces this at DB level)
2. Validate newScore: 1 ≤ newScore ≤ 45
3. UPDATE golf_scores SET score = newScore, updated_at = now() WHERE id = ?
4. Note: date cannot be changed via edit — to change date, delete + re-enter
```

**PostgreSQL function for atomic rolling-5 insert (recommended):**

```sql
CREATE OR REPLACE FUNCTION insert_score_rolling(
  p_user_id uuid, p_score int, p_score_date date
) RETURNS void AS $$
DECLARE
  score_count int;
  oldest_id uuid;
BEGIN
  SELECT COUNT(*) INTO score_count FROM golf_scores WHERE user_id = p_user_id;
  IF score_count >= 5 THEN
    SELECT id INTO oldest_id FROM golf_scores
      WHERE user_id = p_user_id ORDER BY score_date ASC LIMIT 1;
    DELETE FROM golf_scores WHERE id = oldest_id;
  END IF;
  INSERT INTO golf_scores (user_id, score, score_date) VALUES (p_user_id, p_score, p_score_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Call from Server Action via `supabase.rpc('insert_score_rolling', { p_user_id, p_score, p_score_date })`.

### 7.2 Draw Engine (PRD §06)

Located at `lib/draw-engine/draw-logic.ts`. Exports two functions:

**`generateRandomDraw(): number[]`**
```
1. Initialize empty Set
2. While set.size < 5:
   a. Generate random int: Math.floor(Math.random() * 45) + 1
   b. Add to Set (auto-deduplicates)
3. Return Array.from(set).sort((a,b) => a - b)
```

**`generateAlgorithmicDraw(mode: 'most_frequent' | 'least_frequent'): Promise<number[]>`**
```
1. Query all active subscribers' scores:
   SELECT score FROM golf_scores gs
   JOIN subscriptions s ON s.user_id = gs.user_id
   WHERE s.status = 'active'

2. Build frequency map: Map<number, number> (score → count)
   Fill missing values [1..45] with count = 0

3. If mode = 'most_frequent':
   weights[score] = frequency[score] + 1   (higher freq = higher weight)
If mode = 'least_frequent':
   maxFreq = max(all frequencies)
   weights[score] = (maxFreq - frequency[score]) + 1  (lower freq = higher weight)

4. Weighted random selection (no replacement):
   totalWeight = sum(all weights)
   For each of 5 picks:
     random = Math.random() * totalWeight
     Walk weights array, accumulate, pick where cumulative >= random
     Remove picked number from pool, recalculate totalWeight

5. Return sorted array of 5 selected numbers
```

**`matchScores(userScores: number[], winningNumbers: number[]): number`**
```
return userScores.filter(s => winningNumbers.includes(s)).length
// Returns 0, 1, 2, 3, 4, or 5
// Only 3, 4, 5 qualify for prizes per PRD
```

### 7.3 Prize Pool Calculator (PRD §07)

Located at `lib/prize-pool/calculator.ts`:

```typescript
interface PoolResult {
  jackpot: number;    // 40% of pool + any rollover
  match4: number;     // 35%
  match3: number;     // 25%
  totalPool: number;
}

async function calculatePrizePool(
  monthlySubscriptionRevenue: number,
  rolloverAmount: number = 0,
  config: PrizePoolConfig
): Promise<PoolResult> {
  const pool = monthlySubscriptionRevenue * (config.subscription_pool_pct / 100);
  return {
    totalPool: pool,
    jackpot:   (pool * 0.40) + rolloverAmount,
    match4:    pool * 0.35,
    match3:    pool * 0.25,
  };
}

function calculateIndividualPrizes(
  tierPool: number,
  winnerCount: number
): number {
  if (winnerCount === 0) return 0;
  return parseFloat((tierPool / winnerCount).toFixed(2));
}
```

**Jackpot rollover logic:**
```
On draw publish:
  5_match_winners = COUNT FROM winners WHERE draw_id = ? AND match_type = '5_match'
  If 5_match_winners === 0:
    UPDATE draws SET jackpot_rollover = true
    Next month's draw: jackpot_pool += this month's unclaimed jackpot_pool
```

### 7.4 Admin Draw Publish Flow

```
Admin actions in /admin/draws:

STEP 1 — Configure
  - Select draw_type: 'random' | 'algorithmic'
  - If algorithmic: select algo_mode: 'most_frequent' | 'least_frequent'
  - Save to draws table with status='draft'

STEP 2 — Generate Numbers
  - Call generateRandomDraw() or generateAlgorithmicDraw()
  - Preview winning_numbers (shown to admin only)
  - Can regenerate until satisfied
  - Save winning_numbers to draws table

STEP 3 — Simulate (dry run)
  - For all active subscribers, run matchScores()
  - Show: X users with 5 match, Y with 4 match, Z with 3 match
  - Show calculated prize amounts per winner
  - Status = 'simulated' — nothing written to draw_entries or winners yet

STEP 4 — Publish
  - Set status = 'published', published_at = now()
  - Snapshot each active subscriber's current scores → INSERT draw_entries
  - Run match detection → INSERT winners (where match_count >= 3)
  - Calculate prize amounts → UPDATE winners.prize_amount
  - Handle jackpot rollover if no 5-match winner
  - Trigger Resend emails: draw results to all subscribers, winner notification to winners
```

### 7.5 Winner Verification Flow (PRD §09)

```
State machine: pending → approved OR rejected → paid

WINNER SIDE:
  /winners page shows: draw date, match type, prize amount, upload button
  Winner uploads screenshot → POST to Supabase Storage bucket 'winner-proofs'
  Path: winner-proofs/{draw_id}/{user_id}/proof.{ext}
  UPDATE winners SET proof_storage_path = path

ADMIN SIDE:
  /admin/winners table shows all winners with verification_status filter
  Admin views proof image (fetched via Supabase Storage signed URL)
  Approve → UPDATE verification_status = 'approved'
           → Trigger email: "Your prize has been approved"
  Reject  → UPDATE verification_status = 'rejected', admin_notes = reason
           → Trigger email: "Verification rejected" with reason
  Mark Paid → UPDATE payment_status = 'paid'
            → Trigger email: "Your payment has been sent"
```

---

## 8. UI/UX Design System

### 8.1 Design Direction

The PRD explicitly says: **not a traditional golf website**. Design must be **emotion-driven**, leading with charitable impact. Think: Monzo, Linear, Notion — not a golf club brochure.

**Art Direction:** Dark-first, premium, modern. Charitable mission leads. Golf is the mechanic, not the brand.

### 8.2 Custom Color Palette

```css
:root, [data-theme="dark"] {
  /* Surfaces — near-black premium feel */
  --color-bg:              #0d1117;
  --color-surface:         #161b22;
  --color-surface-2:       #1c2128;
  --color-surface-offset:  #21262d;
  --color-border:          oklch(from #e6edf3 l c h / 0.12);

  /* Text */
  --color-text:            #e6edf3;
  --color-text-muted:      #8b949e;
  --color-text-faint:      #484f58;

  /* Primary — Emerald Green (charity/hope/nature) */
  --color-primary:         #2ea043;
  --color-primary-hover:   #238636;
  --color-primary-active:  #196c2e;

  /* Gold — Prize/Reward/Win */
  --color-gold:            #d29922;
  --color-gold-light:      #f0c842;

  /* Semantic */
  --color-error:           #f85149;
  --color-success:         #3fb950;
  --color-warning:         #d29922;
}

[data-theme="light"] {
  --color-bg:              #ffffff;
  --color-surface:         #f6f8fa;
  --color-surface-2:       #eaeef2;
  --color-surface-offset:  #d0d7de;
  --color-border:          oklch(from #1f2328 l c h / 0.15);
  --color-text:            #1f2328;
  --color-text-muted:      #636c76;
  --color-text-faint:      #9198a1;
  --color-primary:         #1a7f37;
  --color-primary-hover:   #116329;
  --color-gold:            #9a6700;
  --color-gold-light:      #bf8700;
  --color-error:           #d1242f;
  --color-success:         #1a7f37;
}
```

### 8.3 Typography

```
Display Font: 'Cabinet Grotesk' (Fontshare) — geometric, modern, confident
Body Font:    'Satoshi' (Fontshare) — clean, readable, warm

CDN:
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">

Usage:
--font-display: 'Cabinet Grotesk', 'Inter', sans-serif;
--font-body:    'Satoshi', 'Inter', sans-serif;
```

### 8.4 Page-by-Page Design Briefs

**Homepage (Public)**
- Full-viewport dark hero, Cabinet Grotesk 900 weight headline:
  "Play Golf. Win Prizes. Change Lives."
- Three animated counter stats (gold color): Total prize pool, Charities supported, Members
- "How It Works" — 3-step flow with icons (Subscribe → Enter Scores → Win)
- Featured charity spotlight with image
- Prominent CTA: "Start Your Subscription" (emerald, large, above the fold)
- AVOID: green fairways, golf club imagery, plaid patterns, country club aesthetics

**User Dashboard**
- Top: Subscription status card + renewal countdown
- Score widget: 5 slots, dates visible, animated entry
- Next draw countdown timer (gold, prominent)
- Charity + contribution percentage mini-card
- Recent draw results summary

**Score Entry Page**
- Mobile-focused number input (large touch target, min 44x44px)
- Date picker (no future dates; duplicate dates blocked with inline error)
- 5-score history list: newest first, each card shows score + date + edit/delete actions

**Draw Results Page**
- Slot-machine-style animated number reveal (CSS `@keyframes` spin, 600ms each)
- User's scores displayed alongside winning numbers
- Matched numbers highlighted in gold
- Prize status badge: "🏆 4 Numbers Matched · £XX Won" or "Better luck next month"

**Admin Dashboard**
- Metric cards: Active subscribers, Total prize pool, Monthly charity total, Pending verifications
- Draw panel: tabbed workflow — Configure → Simulate → Publish
- User table: search, filter by status, inline edit
- Winners table: filter by verification status, proof viewer panel, action buttons

### 8.5 Key Animations

| Animation | Trigger | Tech |
|-----------|---------|------|
| Number slot reveal | Draw results page load | CSS `@keyframes` + staggered JS delay |
| Dashboard stat count-up | Page mount | requestAnimationFrame loop |
| Score card slide-in | New score submitted | CSS `transform: translateX` + `opacity` |
| Winner confetti | Prize notification | `canvas-confetti` CDN (free, 3KB gzip) |
| CTA button pulse | On page load (once) | CSS `@keyframes` pulse, stops after 3s |
| Subscription badge shimmer | Skeleton loading | CSS shimmer animation |

All animations respect `prefers-reduced-motion: reduce`.

---

## 9. Email Templates (Resend + React Email)

Install: `npm install resend @react-email/components`

| Template File | Trigger | Key Content |
|---------------|---------|-------------|
| `welcome.tsx` | Signup complete | Platform intro, how it works, CTA to enter scores |
| `subscription-confirmed.tsx` | Webhook: subscription.activated | Plan name, next billing date, CTA to dashboard |
| `payment-failed.tsx` | Webhook: subscription.halted | Clear message, update payment method CTA |
| `draw-results.tsx` | Admin publishes draw | Winning numbers, user's scores, match result, prize if any |
| `winner-notification.tsx` | Winner detected | Prize amount, instructions to upload proof |
| `proof-approved.tsx` | Admin approves verification | Congratulations, payment timeline |
| `proof-rejected.tsx` | Admin rejects | Reason from admin_notes, resubmit instructions |

Resend free tier: 3,000/month, 100/day — sufficient for this assessment.

---

## 10. Environment Variables

```env
# Supabase (new project, not personal)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # Server-only, NEVER expose to client

# Razorpay (test mode — no real money)
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
RAZORPAY_WEBHOOK_SECRET=xxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx   # safe: public key only

# Resend
RESEND_API_KEY=re_xxxx

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Keep Supabase alive (also set as GitHub repo secrets for the cron workflow)
# These are the same as SUPABASE_URL and SUPABASE_ANON_KEY above
```

---

## 11. Deployment Pipeline

### Setup Order (Do This Exactly)

```
1. Create fresh GitHub private repo (not your personal account — use a separate org or new account if required)
2. Create new Supabase project → run all SQL migrations → seed prize_pool_config
3. Create Razorpay account → test mode → create two Plans (monthly + yearly) → note Plan IDs
4. Create Resend account → verify domain OR use Resend's test domain for assessment
5. Create new Vercel account (not personal) → connect GitHub repo → add all env vars
6. Add GitHub Actions keep-alive workflow for Supabase
7. Set Razorpay webhook endpoint in dashboard: https://your-app.vercel.app/api/webhooks/razorpay
```

### Vercel Deployment Notes

- Framework: Next.js (auto-detected)
- Build command: `next build`
- Node.js version: 20.x
- Every `git push` to `main` auto-deploys
- Check "Vercel Hobby" fair use: assessment project with no real revenue = non-commercial ✅
- Do NOT collect real money during assessment period (test mode only)

### Razorpay Webhook Configuration

In Razorpay Dashboard → Settings → Webhooks:
- Add URL: `https://your-app.vercel.app/api/webhooks/razorpay`
- Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.halted`, `payment.failed`
- Copy webhook secret → `RAZORPAY_WEBHOOK_SECRET`

For local testing: use `ngrok http 3000` → use ngrok URL in Razorpay webhook dashboard during dev

---

## 12. Implementation Phases

### Phase 1 — Foundation (Days 1–3)
- [ ] Scaffold from `KolbySisk/next-supabase-stripe-starter`, remove Stripe files
- [ ] Run all SQL migrations in Supabase (all 10 tables + RLS policies)
- [ ] Seed: `prize_pool_config`, add 3–5 test charities
- [ ] Supabase Auth: email/password signup → auto-create profile row via DB trigger
- [ ] Middleware: session check, subscription status guard, admin role guard
- [ ] Deploy to Vercel, verify CI/CD pipeline works
- [ ] Add GitHub Actions keep-alive cron workflow

### Phase 2 — User Features (Days 4–7)
- [ ] Score entry Server Action (rolling-5 + date uniqueness + validation)
- [ ] Score display, edit, delete
- [ ] User dashboard page (all 5 dashboard modules from PRD §10)
- [ ] Charity directory (public page) + charity selector in dashboard
- [ ] Contribution percentage slider + persistence to `user_charity_selections`

### Phase 3 — Subscriptions & Payment (Days 7–10)
- [ ] Razorpay Plans created (monthly + yearly) in dashboard
- [ ] Server Action: `createSubscription()` → creates Razorpay subscription → returns checkout options
- [ ] Client: load Razorpay checkout JS, open modal with subscription_id
- [ ] Webhook handler at `/api/webhooks/razorpay` (all events + HMAC verify)
- [ ] Subscription status syncs to Supabase `subscriptions` table
- [ ] Resend emails: welcome + subscription confirmed

### Phase 4 — Draw Engine (Days 10–14)
- [ ] `generateRandomDraw()` implementation + unit test
- [ ] `generateAlgorithmicDraw()` (both modes) + unit test
- [ ] `calculatePrizePool()` + `calculateIndividualPrizes()`
- [ ] Admin draw configure UI (type + algo mode selection)
- [ ] Admin draw simulate (dry run, preview winners + amounts)
- [ ] Admin draw publish (freeze entries, detect winners, calculate prizes, jackpot rollover)
- [ ] Draw results page with animated number reveal
- [ ] Resend: draw results email to all subscribers

### Phase 5 — Admin Dashboard (Days 14–18)
- [ ] User management table (view, edit scores, manage subscription status)
- [ ] Charity CRUD (add, edit, delete, toggle featured/active)
- [ ] Winner verification panel (view proof, approve/reject, mark paid)
- [ ] Reports page with Recharts: subscriber count, prize pool trend, charity totals, draw stats
- [ ] Resend: winner notification, approval/rejection emails

### Phase 6 — Polish & QA (Days 18–21)
- [ ] Winner proof upload to Supabase Storage (with signed URL viewer for admin)
- [ ] All loading skeleton states
- [ ] All empty states (no scores, no draws, no charities)
- [ ] Mobile audit at 375px (iPhone SE)
- [ ] Error handling: invalid inputs, expired sessions, network failures
- [ ] Run full testing checklist (PRD §16)
- [ ] Final performance check: lazy images, deferred JS
- [ ] Verify all env vars correct in Vercel production settings

---

## 13. Testing Checklist (PRD §16 — Full Coverage)

### User Flow
- [ ] Signup → email arrives → login works
- [ ] Monthly subscription: Razorpay checkout → webhook fires → status = active → email received
- [ ] Yearly subscription: same flow, different plan
- [ ] Score entry: valid score + date → appears in list
- [ ] Score entry: score = 0 → rejected with error
- [ ] Score entry: score = 46 → rejected with error
- [ ] Score entry: 6th score → oldest auto-removed, list stays at 5
- [ ] Score entry: duplicate date → blocked with clear error
- [ ] Score edit: updates value correctly
- [ ] Score delete: removes from list
- [ ] Charity selection + contribution % saved correctly
- [ ] Dashboard shows: subscription status, 5 scores, charity, draw info, winnings

### Draw System
- [ ] Random draw: 5 unique numbers generated in [1–45]
- [ ] Algorithmic draw (most frequent): runs without error
- [ ] Algorithmic draw (least frequent): runs without error
- [ ] Simulate: shows correct winner preview without publishing
- [ ] Publish: draw_entries created for all active subscribers
- [ ] Publish: winners detected (5/4/3 match correctly)
- [ ] No 5-match winner: jackpot rolls over to next month's pool
- [ ] Multiple 5-match winners: prize split equally
- [ ] Draw results page: animated number reveal works
- [ ] Matched numbers highlighted in user's score display

### Admin Panel
- [ ] View/search all users
- [ ] Edit a user's golf score
- [ ] Manage subscription (cancel/reactivate)
- [ ] Add/edit/delete charity
- [ ] Toggle charity featured status
- [ ] Full draw workflow: configure → simulate → publish
- [ ] Winner list visible, filterable by status
- [ ] View winner proof image (signed URL works)
- [ ] Approve verification → email sent → status updates
- [ ] Reject verification → email with reason → status updates
- [ ] Mark payment as paid → email sent

### Technical
- [ ] Non-subscriber redirected from /dashboard to /settings
- [ ] Non-admin redirected from /admin to /dashboard
- [ ] Razorpay webhook: invalid signature rejected (400)
- [ ] Supabase RLS: user cannot read another user's scores via API
- [ ] Mobile (375px): all pages usable, touch targets ≥ 44px
- [ ] Desktop (1280px+): layout correct, no overflow
- [ ] Dark mode + light mode toggle works
- [ ] `prefers-reduced-motion`: animations disabled
- [ ] Error states shown for failed API calls
- [ ] Supabase keep-alive: project not paused after 7 days

---

## 14. Ambiguity Resolutions (PRD Gaps — Defined Here)

| Ambiguous Requirement | Decision |
|----------------------|----------|
| What % of subscription goes to prize pool? | Configurable in `prize_pool_config` table. Default: 30%. Admin can update. |
| When are draw entries frozen? | At publish time — Server Action snapshots each active subscriber's current 5 scores into `draw_entries`. Scores entered after publish do not count for that draw. |
| Can users change charity after signup? | Yes — `user_charity_selections` is updatable. Changes apply from next month. |
| What does "algorithmic draw" mean exactly? | Two sub-modes: (a) weighted toward most-frequent scores across all users, (b) weighted toward least-frequent. Admin selects per draw. |
| Currency? | GBP (£) assumed from PRD context (digitalheroes.co.in). Razorpay test mode in INR is fine for assessment — label amounts clearly in UI. |
| Independent donation (PRD §08)? | Separate "Donate" button on charity profile pages → Razorpay one-time payment order (not a subscription). |
| What if a user has fewer than 5 scores at draw time? | Include them in draw with however many scores they have. Match can only occur on values that exist. Flag in UI: "Enter all 5 scores to maximise your chances." |
| Admin score editing (PRD §11)? | Admin can edit any user's scores via the user management panel. Same validation rules (1–45, no future dates, no duplicate dates). |

---

## 15. Scalability Foundations (PRD §14)

All of these are achievable within the current schema with minor additions:

- **Multi-country expansion:** Add `currency` column to `prize_pool_config`. Use Razorpay's multi-currency support for international payments. i18n via `next-intl` library (free, lightweight).
- **Teams / corporate accounts:** Add `teams` table with `team_id uuid` foreign key on `profiles`. User can belong to one team. Team subscription covers all members.
- **Mobile app:** All data operations go through Server Actions today. When needed, expose these as Route Handlers (REST API) — React Native can consume the same Supabase instance directly.
- **Campaign module:** Add `campaigns` table with `start_at`, `end_at`, linked to `draws`. No schema changes needed to existing tables.
- **Codebase extensibility:** Keep draw engine and prize calculator as pure TypeScript functions with no framework coupling — they can be extracted to a shared library or edge function with zero refactoring.
