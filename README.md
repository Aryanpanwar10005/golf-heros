# Digital Heroes Golf | Full-Stack Assessment

![Digital Heroes Banner](https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1200)

## 🏌️‍♂️ Project Overview
Digital Heroes is a premium, subscription-driven web application that bridges the gap between competitive golf tracking and global charitable impact. This project was developed as a technical assessment for the Full-Stack Developer selection process at **Digital Heroes**.

The platform enables golfers to track their performance, participate in monthly prize pools, and contribute to world-class charities—all through a modern, "Prestige-First" digital interface that deliberately avoids traditional golf clichés.

---

## 🚀 Core Features

### 1. Subscription & Payment Engine
- **Flexible Plans:** Support for Monthly and discounted Yearly subscription tiers.
- **Razorpay Integration:** Seamless, PCI-compliant payment processing (Test Mode enabled).
- **Lifecycle Management:** Automated handling of renewals, cancellations, and state-based access control.

### 2. Intelligent Score Management
- **Stableford Tracking:** Support for scores ranging from 1–45.
- **Rolling-5 Logic:** A custom database-level engine that retains only the latest 5 scores, automatically rotating out the oldest entries to maintain performance index integrity.
- **Historical Accuracy:** Single-entry-per-date validation and reverse-chronological visualization.

### 3. Custom Draw & Reward System
- **Multi-Tier Winning:** Support for 5-Number, 4-Number, and 3-Number matches.
- **Dual Draw Logic:**
    *   **Random:** Standard high-transparency lottery generation.
    *   **Algorithmic:** Weighted random generation based on community score frequencies (most/least frequent).
- **Jackpot Rollover:** Built-in logic to carry forward the 5-Match pool if no winner is found.

### 4. Charity Impact System
- **Purpose-Driven Play:** Minimum 10% of all subscriptions are diverted to user-selected charities.
- **Transparency:** Direct visualization of the user's total charitable impact on their dashboard.
- **Independent Donations:** Support for one-time contributions outside of the subscription model.

### 5. Unified Dashboards
- **User Panel:** Real-time subscription status, score entry/edit interface, and upcoming draw participation summary.
- **Admin Command Center:** High-privilege area for user management, draw simulation/execution, and winner verification.

---

## 🛠️ Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Emerald Vanguard Design System)
- **Database:** Supabase (PostgreSQL) with RLS and native PL/pgSQL functions.
- **Auth:** NextAuth.js / Supabase Auth
- **Icons:** Lucide React
- **Payments:** Razorpay SDK

---

## 🎨 Design Philosophy
The platform adheres to an **"Editorial Prestige"** aesthetic:
- **Feel:** Clean, modern, and motion-enhanced.
- **Avoidance:** Strictly prohibits traditional golf clichés (plaid, fairways, golf clubs as icons).
- **Color Palette:**
    *   **Emerald Green (#2ea043):** Symbolizing growth and charitable impact.
    *   **Gold (#d29922):** Highlighting reward and achievement.
    *   **Near-Black (#0d1117):** Providing a premium, cinematic backdrop.

---

## 📦 Mandatory Deliverables Checklist
- [x] **Live Website:** Fully deployed and accessible via Vercel.
- [x] **Database Schema:** Robust PostgreSQL structure with RLS.
- [x] **Functional User Panel:** Signup/Login, Score Entry, Impact Tracking.
- [x] **Admin Controls:** Winner verification and Draw execution workflows.
- [x] **Source Code:** Clean, modular, and well-documented codebase.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project
- Razorpay API Keys (Test Mode)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/golfheros.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (.env.local):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   RAZORPAY_KEY_ID=your_id
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---
*Developed for the Digital Heroes Selection Process — March 2026*
