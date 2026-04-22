# 🏌️‍♂️ Digital Heroes Golf

### *Play for a Purpose. Track with Precision. Win with Skill.*

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea043?style=for-the-badge)](https://golfheros.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2015%20|%20Supabase%20|%20Razorpay-d29922?style=for-the-badge)](#-tech-stack)

Digital Heroes Golf is a premium, subscription-based performance tracking and competition platform. This project was developed as part of the **Digital Heroes Full-Stack Assessment**, prioritizing "Game of Skill" compliance, data integrity, and high-fidelity UI/UX.

---

## 🔑 Test Credentials
*Reviewers can use the following credentials to access the functional modules:*

### **User Panel**
- **URL:** [https://golfheros.vercel.app/login](https://golfheros.vercel.app/login)
- **Email:** `hero@test.com` (or create a new account)
- **Password:** `password123`
- **Features:** Score entry (1-45 range), Charity selection, Subscription dashboard.

### **Admin Panel**
- **URL:** [https://golfheros.vercel.app/admin](https://golfheros.vercel.app/admin)
- **Email:** `admin@digitalheroes.co.in`
- **Password:** `admin123`
- **Features:** Draw execution logic (Random vs Algorithmic), Prize pool monitoring, User management.

---

## ✅ Mandatory Deliverables Checklist
- [x] **Live Website:** [golfheros.vercel.app](https://golfheros.vercel.app)
- [x] **User Panel:** Fully functional signup, login, and dashboard.
- [x] **Admin Panel:** Complete draw simulation and results publishing.
- [x] **Database:** Production Supabase instance with RLS and Stored Procedures.
- [x] **Source Code:** Clean, feature-modularized Next.js 15 structure.

---

## 🏗️ System Design & Architecture

### **1. Data Handling: The "Rolling-5" Index**
To meet the PRD requirement for performance tracking, I implemented the index calculation at the **Database Layer**.
- **The Logic:** A PostgreSQL procedure (`insert_score_rolling`) ensures that only the latest 5 scores are retained per user.
- **Why?** Offloading this to the DB ensures atomic updates and 100% data integrity, preventing race conditions during rapid score entries.

### **2. Game of Skill Engine**
The **Algorithmic Draw** logic is designed to be weighted by most/least frequent user scores. This ensures the reward system is legally distinct from luck-based lotteries, as winners are calculated based on performance metrics.

### **3. Scalability Thinking**
- **Multi-Country Support:** The schema includes `region` and `currency` flags, prepared for international expansion.
- **Mobile-First:** The "Emerald Vanguard" design is fully responsive, utilizing a custom Tailwind v4 configuration optimized for mobile interactions.

---

## ⚖️ Engineering Trade-offs
- **Razorpay Test Mode:** For this assessment, I utilized Razorpay's "Test Mode" to allow reviewers to experience the full payment flow without real financial transactions.
- **Client-Side Hydration:** I used React Server Components (RSC) for the dashboard to maximize SEO and performance, while using Client Components for interactive modals (Score Entry) to ensure a "snappy" feel.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, Lucide Icons.
- **Backend:** Supabase (PostgreSQL), Auth, RLS.
- **Payments:** Razorpay Node API.
- **Deployment:** Vercel (Edge Runtime).

---

## 🚀 Local Setup
1. `npm install`
2. Create `.env.local` using `.env.example`.
3. `npm run dev`

---
*Developed by Aryan Panwar (2026) for Digital Heroes.*
