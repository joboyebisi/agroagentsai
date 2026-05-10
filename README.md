# 🌾 AgroAgents — Nokia Network-as-Code Outgrower Platform

> **Zero-fraud input distribution for smallholder farmers, powered by Nokia Network-as-Code (CAMARA APIs) and Agentic AI.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-green?logo=supabase)](https://supabase.com)
[![Nokia NaC](https://img.shields.io/badge/Nokia-Network--as--Code-blue)](https://network-as-code.nokia.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🎯 What AgroAgents Does

AgroAgents solves the **trust gap** that blocks 33 million+ Nigerian smallholder farmers from accessing formal agricultural inputs and credit. Outgrower scheme managers can't verify:

- **Who** the farmer really is (identity fraud)
- **Where** their farm actually is (ghost plots)
- **Whether** inputs reached the right person (diversion fraud)

AgroAgents replaces paper-based, fraud-prone processes with **network-level verification** using Nokia's CAMARA APIs:

| Problem | Nokia NaC Solution |
|---|---|
| Fake farmer registrations | **Number Verification API** — SIM-based identity, unforgeable |
| Ghost farm plots | **Device Location Verification API** — agent must be at the farm |
| Diverted seed/fertilizer | **Geofencing API** — distributor must be within 100m of farm |
| SIM card fraud | **SIM Swap API** — blocks recent SIM swaps before payout |

---

## ✨ Key Features

### 🏢 Scheme Manager Control Room
- **Live Demo Guide** — 3-step orchestrated demo for judges and training
- **Nokia NaC API Console** — real-time terminal showing every CAMARA API call as it fires
- **Agentic AI Planting Schedules** — auto-calculated inputs per farmer (25kg seed/ha, 100kg NPK/ha, 1.5h tractor/ha)
- **Live Verification Stream** — every NaC event (onboard, distribution, delivery) streams to a live table
- **Multi-tenant isolation** — each scheme manager sees only their own data via `tenant_id`

### 📱 Field Agent Mobile App
- Onboard farmers with Nokia NaC **Number Verification** (SIM-based, not SMS OTP)
- Capture farm geofence coordinates
- Photo ID capture
- Real-time verification feedback with "Network Verified" certificate

### 🚚 Distributor App
- Receives delivery assignments in real-time via Supabase Realtime
- Nokia NaC **Geofencing** check — must be within 100m of farm
- Nokia NaC **SIM Swap** check — anti-fraud before accepting code
- One-time delivery code verification from Farmer App
- Photo proof of handover

### 👨‍🌾 Farmer App
- Receives delivery code via simulated SMS (Supabase Realtime push)
- Shows order details (seed quantity, fertilizer, tractor hours)
- Payment confirmation on delivery

### 💰 Financier Portal
- View verified farmer portfolios for credit underwriting decisions
- NaC-verified trust scores per farmer

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 15 App                    │
│                                                      │
│  /admin      → Scheme Manager Control Room           │
│  /agent      → Field Agent Mobile Simulator          │
│  /farmer     → Farmer App Simulator                  │
│  /distributor → Distributor App Simulator            │
│  /financier  → Financier/Lender Portal               │
│                                                      │
│  /api/verify-onboarding  → Nokia NaC Number Verify   │
│  /api/verify-delivery    → Nokia NaC Location + SIM  │
│  /api/assign-order       → NaC Geofence Subscribe    │
└──────────────┬──────────────────────────┬────────────┘
               │                          │
    ┌──────────▼──────────┐   ┌───────────▼──────────┐
    │  Nokia Network-as-  │   │  Supabase             │
    │  Code CAMARA APIs   │   │  • Postgres DB        │
    │                     │   │  • Realtime streams   │
    │  • Number Verify    │   │  • RLS per tenant     │
    │  • Location Verify  │   │                       │
    │  • SIM Swap Check   │   │  Tables:              │
    │  • Geofencing       │   │  farmers, orders,     │
    └─────────────────────┘   │  api_logs, farm_plots │
                              └───────────────────────┘
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Nokia Network-as-Code](https://network-as-code.nokia.com) API key (via RapidAPI)

### 1. Clone & Install
```bash
git clone https://github.com/joboyebisi/agroagentsai.git
cd agroagentsai/agro-agents-ai
npm install
```

### 2. Environment Variables
Create `.env.local` in the `agro-agents-ai` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NOKIA_NETWORK_AS_CODE_API_KEY=your_nokia_nac_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key   # optional, for AI advisory
```

### 3. Database Setup
Run these SQL scripts in your Supabase SQL Editor **in order**:

```
1. database_schema.sql        → Creates all tables
2. demo_multi_tenant_patch.sql → Adds tenant_id, api_logs table, drops unique phone constraint
3. demo_rls_policies.sql       → RLS policies + Realtime publication
```

### 4. Enable Supabase Realtime
In your Supabase Dashboard → **Database → Tables**, enable Realtime for:
- `farmers`
- `orders`  
- `api_logs`

Or run in SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.farmers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_logs;
```

### 5. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🎬 Demo Flow (for Judges)

### Nokia NaC Test Numbers
| Number | Behaviour |
|---|---|
| `+99999991001` | ✅ Farmer — Number verification **passes** |
| `+99999991002` | ✅ Distributor — Location/SIM checks **pass** |
| `+99999991000` | ❌ Fraud test — verification **fails**, fraud counter increments |

### Step-by-Step
1. **Register** as a Scheme Manager at `/register`
2. **Admin Control Room** (`/admin`) → Click **"Launch Field Agent Sim"**
3. **Field Agent App** — Form is pre-filled with `Farouq Yusuf / +99999991001`. Capture location → tap "Verify & Create ID"
4. Watch the **Nokia NaC Console** populate with live API calls
5. Back in Admin — farmer appears in **Planting Schedules**. Click to expand and see AI-calculated inputs
6. Click **"Initiate Seed Distribution for Farouq Yusuf"**
7. Open **Distributor Sim** — order appears automatically. Click "Arrive at Farm"
8. Open **Farmer Sim** — delivery code appears. Copy it
9. Enter code in Distributor App → **Verify via Nokia NaC**
10. Admin **Live Verification Stream** updates: `LOC: MATCH · SIM: SECURE · Payment Triggered`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (Postgres CDC) |
| Network APIs | Nokia Network-as-Code (CAMARA) |
| AI | DeepSeek API (advisory) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🌍 Deployment (Vercel)

1. Import this repo at [vercel.com/new](https://vercel.com/new)
2. Set root directory to `agro-agents-ai`
3. Add all 5 environment variables from the table above
4. Deploy — no backend server needed. Next.js API routes handle all server-side logic.

---

## 📁 Project Structure

```
agro-agents-ai/
├── src/
│   ├── app/
│   │   ├── admin/          # Scheme Manager Control Room
│   │   ├── agent/          # Field Agent Mobile App
│   │   ├── farmer/         # Farmer App Simulator
│   │   ├── distributor/    # Distributor App Simulator
│   │   ├── financier/      # Lender/Financier Portal
│   │   ├── register/       # Onboarding registration
│   │   └── api/            # Nokia NaC API routes (server-side)
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client (anon + admin)
│   │   └── camara.ts       # Nokia NaC API wrapper
│   └── components/
│       └── layout/         # Sidebar, navigation
├── database_schema.sql          # Initial DB schema
├── demo_multi_tenant_patch.sql  # Phase 6 multi-tenant migration
├── demo_rls_policies.sql        # RLS policies for all tables
└── vercel.json                  # Vercel deployment config
```

---

## 👥 Team

Built for the GSMA Africa Ignite Nokia Network-as-Code Hackathon.

**AgroAgents** — Bridging the trust gap in African smallholder agriculture with network-level verification.

---

*Licensed under MIT*
