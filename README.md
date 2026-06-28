# 🌿 Nourish Loop

> **"Kết nối mỗi bữa ăn thừa với một người cần."**
> *Connecting every surplus meal to someone in need.*

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Core Features](#-core-features)
- [Architecture & Tech Stack](#️-architecture--tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Run Instructions](#-run-instructions)
- [User Guide](#-user-guide)
- [AI Usage & Attribution](#-ai-usage--attribution)
- [Team](#-team)

---

## 🔥 Problem Statement

Every day in Ho Chi Minh City, **tons of edible food are discarded** by restaurants, F&B chains, and hotels — mostly at end-of-day when customer turnout is lower than expected. At the same time, community kitchens, rescue stations, and NGOs serving low-income workers and homeless people **face a daily shortage of stable food supply**.

Existing coordination (FoodBank Vietnam's Zalo/Facebook network) suffers from:

| Pain Point | Impact |
|---|---|
| No digital confirmation mechanism | Disputes, missed pickups, zero accountability |
| No data history | Cannot measure impact, cannot produce ESG reports |
| Cannot scale | Entirely dependent on personal networks |
| Receivers don't know what's available | Wasted travel time, missed opportunities |

**HMW:** How might we build a transparent, fast, and trustworthy digital coordination layer between food donors and charitable kitchens — so no edible food goes to waste?

---

## 💡 Solution Overview

**Nourish Loop** is a mobile-first web platform that closes the gap between food **Suppliers** (restaurants, F&B businesses) and food **Receivers** (charitable kitchens, NGOs, rescue stations) through a verified, real-time transaction loop.

### Core Transaction Loop

```
[Supplier] Post surplus food
        ↓
[System] Render on live Food Map
        ↓
[Receiver] Discover & Reserve
        ↓
[Supplier] Review profile & Approve
        ↓
[System] Generate cryptographic QR Code
        ↓
[Both parties] Meet at pickup point
        ↓
[Receiver] Scan QR → Transaction Completed ✅
        ↓
[Both parties] Rate each other → Trust Score updated
```

### Why it's different from Zalo/Facebook

| Criteria | Zalo / Facebook | Nourish Loop |
|---|---|---|
| Real-time visibility | ❌ | ✅ Live Food Map |
| Pickup confirmation | ❌ | ✅ QR-based handoff |
| History & reporting | ❌ | ✅ ESG Dashboard |
| Trust & accountability | ❌ | ✅ Trust Score system |
| Scale beyond personal network | ❌ | ✅ Open platform |

---

## 🧩 Core Features

### For Suppliers (Restaurants / F&B Businesses)

- **Post food listings** — name, category, weight/quantity, photo, pickup window, GPS location
- **Manage requests** — view applicant profiles with Trust Scores, approve/reject with one tap
- **QR Code handoff** — display auto-generated transaction QR at pickup
- **ESG Dashboard** — track total kg rescued, transaction count, estimated CO₂ saved (1 kg food = 2.5 kg CO₂)

### For Receivers (Charitable Kitchens / NGOs)

- **Live Food Map** — interactive map (Goong Maps) showing nearby active listings with distance and time remaining
- **Search & Filter** — by radius (2/5/10 km), food category, and pickup window
- **QR Scanner** — scan Supplier QR to confirm receipt and complete transaction
- **Impact Story** — post photos of rescued food being distributed to beneficiaries, tagged back to the Supplier's profile

### Shared

- **In-app Notifications** — new request alerts (Suppliers), approval/rejection alerts (Receivers), 30-min pickup reminders
- **Bi-directional Rating** — 1–5 star reviews with category tags (Punctual, Accurate Description, Clean Packaging)
- **Trust Score** — dynamic 0–100% score per user; accounts below 30% are restricted from posting/receiving

---

## 🏗️ Architecture & Tech Stack

### Frontend (this repository)

```
nourish-loop/
├── src/
│   ├── components/      # UI components (shadcn/ui + custom)
│   ├── routes/          # TanStack Router file-based routes
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions, API client
│   └── types/           # TypeScript type definitions
├── .env.example         # Environment variable template
├── package.json
└── vite.config.ts
```

| Layer | Technology | Purpose |
|---|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 | Full-stack React framework with file-based routing |
| Build Tool | Vite 8 | Lightning-fast dev server and bundler |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) | Utility-first CSS + accessible Radix UI components |
| Map | [@goongmaps/goong-js](https://goong.io) | Vietnamese map service (GL-compatible) |
| Data Fetching | TanStack Query v5 | Server state management and caching |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Charts | Recharts | ESG dashboard visualizations |
| Notifications | Sonner | Toast notification system |
| Language | TypeScript 5.8 | Static type safety |
| Package Manager | Bun | Fast JavaScript runtime & package manager |
| Dev Platform | [Lovable](https://lovable.dev) | AI-assisted fullstack development environment |

### Backend (separate repository / deployment)

| Layer | Technology |
|---|---|
| Runtime | Node.js + [NestJS](https://nestjs.com/) |
| Database | PostgreSQL + TypeORM |
| Auth | JWT (access: 1h, refresh: 7d) + Passport.js |
| File Storage | Cloudinary (food photos, impact stories) |
| QR | `qrcode` (generate) + `html5-qrcode` (scan) |
| Real-time | Socket.IO / Server-Sent Events (notifications) |
| Deployment | Railway (backend) + Vercel (frontend) |

---

## ✅ Prerequisites

Before running locally, make sure you have:

- **Node.js** ≥ 20 (LTS recommended) — [nodejs.org](https://nodejs.org)
- **Bun** ≥ 1.1 — [bun.sh](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)
- **Git**
- A **Goong Maps API key** — register at [goong.io](https://goong.io) (free tier available)
- A running backend instance (see Backend section above) or the deployed API URL

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ThoQuang21/nourish-loop.git
cd nourish-loop
```

### 2. Install dependencies

```bash
bun install
```

> If you prefer npm: `npm install`

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# URL of the backend API
VITE_API_URL="http://localhost:3000/api"

# Goong Maptiles key — required for the Food Map to render
# Get yours at https://goong.io
VITE_GOONG_MAPTILES_KEY="your_goong_key_here"
```

> ⚠️ **Security note:** Never commit your real `.env` file. The `.env.example` template is safe to push; your actual `.env` is in `.gitignore`.

---

## ▶️ Run Instructions

### Development server

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
bun run build
```

Static output will be in the `dist/` folder. Deploy to Vercel, Netlify, or any static host.

### Preview production build locally

```bash
bun run preview
```

### Lint & Format

```bash
bun run lint       # ESLint check
bun run format     # Prettier auto-format
```

---

## 📖 User Guide

### Getting Started

1. Open the app and click **Đăng ký (Sign Up)**
2. Choose your role:
   - **Nhà cung cấp (Supplier)** — if you are a restaurant or F&B business
   - **Đơn vị nhận (Receiver)** — if you are a charitable kitchen, NGO, or rescue station
3. Complete your organization profile (name, contact, address)

### As a Supplier — Posting Food

1. From the dashboard, tap **Đăng thực phẩm (Post Food)**
2. Fill in: food name, category, quantity + unit, photo, address (or use GPS pin), and pickup window
3. Tap **Đăng (Publish)** — your listing appears live on the Food Map immediately
4. When a Receiver applies, you'll receive a notification → go to **Quản lý đơn (Requests)** to review their profile and Trust Score
5. Tap **Chấp nhận (Accept)** → the system generates a QR Code for you
6. At pickup, show your QR Code on screen for the Receiver to scan
7. After the transaction completes, rate your Receiver

### As a Receiver — Finding Food

1. The app opens directly to the **Food Map**
2. Browse pins or use the bottom sheet list; use filters (distance, category) to narrow results
3. Tap a pin → view food details (photo, quantity, pickup address, Supplier Trust Score)
4. Tap **Đăng ký nhận (Reserve)** and wait for Supplier approval (you'll get a push notification)
5. Once approved, navigate to the pickup point and scan the Supplier's QR Code with your camera
6. After completion, rate your Supplier and optionally post an **Impact Story** with photos

### Trust Score

- Every user starts at **80%**
- Score increases with positive ratings; decreases with negative ratings or late cancellations
- Accounts below **30%** are restricted from posting or reserving food

---

## 🤖 AI Usage & Attribution

This project was developed with AI assistance. In compliance with Grab the Future Hackathon 2026 rules, we declare:

| Tool | Usage |
|---|---|
| **Lovable** (lovable.dev) | Primary AI-assisted development platform used to scaffold components, implement UI logic, and iterate on the food map and QR flow |
| **Claude (Anthropic)** | Business analysis document (`BA_FoodRescue.md`), data model design, API endpoint specification, and feature specifications in `features.md` |

All AI-generated code has been reviewed, understood, and modified by team members. Every contributor can explain the logic of the components they worked on.

Pre-existing open-source libraries used are listed in `package.json`. All packages are under MIT-compatible licenses.

---

## 👥 Team

Built at **Grab the Future Hackathon 2026** (27–28 June 2026), hosted by Grab Vietnam, UNDP Vietnam, NIC, and HCM International University.

| Role | Responsibility |
|---|---|
| Frontend Developer × 2 | React components, Food Map, QR flow, UI/UX |
| Backend Developer × 1 | NestJS API, PostgreSQL schema, auth, QR generation |
| Business Analyst / Designer | BA document, pitch deck, user research |
| Project Manager / Presenter | Product direction, timeline, pitching |

---

## 🌱 Alignment with Hackathon Themes

| Theme | How Nourish Loop addresses it |
|---|---|
| Thay đổi hành vi hướng tới lối sống bền vững | Gamified Trust Score and Impact Story incentivize consistent food-sharing behavior |
| Mở rộng tiếp cận bao trùm dịch vụ đô thị | Charitable kitchens gain reliable, structured access to food resources previously locked in personal networks |
| Ra quyết định dựa trên dữ liệu | ESG Dashboard provides Suppliers with quantified environmental impact metrics (kg rescued, CO₂ saved) |
| Thành phố chống chịu biến đổi khí hậu | Reducing food waste directly lowers methane emissions from organic landfill decomposition |

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

Third-party libraries retain their respective licenses. See `package.json` for the full dependency list.

---

*Grab the Future Hackathon 2026 | Submission deadline: 12:00, 28/06/2026*
