# 🏌️‍♂️ Digital Heroes Golf

### *Play for a Purpose. Track with Precision. Win with Skill.*

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea043?style=for-the-badge)](https://golfheros.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2015%20|%20Supabase%20|%20Razorpay-d29922?style=for-the-badge)](#-tech-stack)

Digital Heroes Golf is a premium, subscription-based performance tracking and competition platform for golfers. Built with the **Emerald Vanguard** design system, it combines high-fidelity aesthetics with rigorous "Game of Skill" logic to deliver a state-of-the-art user experience.

---

## ✨ Key Features

### 🟢 Emerald Vanguard Design System
A dark-mode-first aesthetic utilizing a curated palette of **Deep Emerald**, **Burnished Gold**, and **Near-Black**. Designed for a premium, editorial feel that prioritizes visual excellence and smooth micro-interactions.

### 📊 Rolling-5 Performance Index
Unlike static averages, our platform utilizes a **Rolling-5 SQL logic**. Every gross score entry (restricted to 1–145) automatically triggers a PostgreSQL procedure that calculates your performance index based on your 5 most recent rounds, ensuring a dynamic and fair skill representation.

### 🏆 Algorithmic Draw Engine
To maintain legal standing as a **Game of Skill**, the platform features a weighted draw execution engine. The admin can trigger draws where winners are selected based on their Performance Index consistency rather than pure randomness.

### 💳 Razorpay Integration
Full subscription management lifecycle integrated with Razorpay (India). Includes secure server-side verification and automated subscription syncing.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Production-ready)
- **Database:** Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Logic:** PL/pgSQL Stored Procedures
- **Payments:** Razorpay Node SDK
- **Icons:** Lucide React

---

## 🏗️ Architectural Decisions

### 1. Game of Skill Compliance
The platform is architected to prioritize player performance data. Prize pools are distributed (40/35/25 tiering) based on verified score data, separating the platform from traditional "luck-based" lotteries.

### 2. Zero-Trust Security
Every table in the Supabase backend is protected by **Row-Level Security (RLS)**. Users can only access their own scores and subscription data, while the Admin panel is restricted via middleware-level role verification.

### 3. Automated Performance Tracking
By offloading the "Rolling-5" calculation to the database layer (`insert_score_rolling`), we ensure data integrity and high performance, even as the user base scales.

---

## 🚀 Getting Started

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/Aryanpanwar10005/golf-heroes-pro.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file based on `.env.example` with your Supabase and Razorpay keys.

4. **Run Locally:**
   ```bash
   npm run dev
   ```

---

## 📄 Documentation
Detailed technical specifications and PRD assessment requirements are available in the [docs/](file:///c:/Projects/golfheros/docs) folder.

---

**Developed for Digital Heroes Golf Performance Assessment (2026).**
