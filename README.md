# Retiree Support LMS (Next.js + Prisma) — light & Vercel-friendly

This repository is a **light React (Next.js)** starter that matches the platform functions and UI design criteria described in **우리은행 퇴직자 통합지원 플랫폼 UI/UX 설계서 v2.0**:

### Core sections (aligned with the guideline’s menu / flow)
- **Home dashboard**: announcements + ongoing programs + “my status” summary + quick links
- **Programs**: list + apply + view application status
- **My Activity**: applications, consultation bookings, learning progress
- **Jobs**: postings + apply
- **Learning**: simple VOD courses + downloadable resources (not a complex LMS)
- **Support**: announcements, FAQ, 1:1 inquiry
- **Discussion / Q&A**
- **My Profile**
- **Instructor**: booking approval page
- **Admin**: users/roles + announcements + FAQ + inquiries

### Design system included (from the guideline)
- Primary color: **#0047BA**
- Background: **#FFFFFF**, Section background: **#F8F9FA**
- Text: **#333333**, Border: **#E5E5E5**
- Typography: **Pretendard / Noto Sans KR**, 14–16px body, bold headings
- Outline-style buttons + hover background

---

## 1) Local setup (with a DB)
1. Copy env
```bash
cp .env.example .env
```

2. Start Postgres locally
```bash
docker compose up -d
```

3. Install + migrate + seed
```bash
npm install
npm run prisma:migrate
npm run db:seed
```

4. Run
```bash
npm run dev
```

Open: http://localhost:3000

Login at: http://localhost:3000/login  
(Seeded demo users: `admin@demo.com`, `instructor@demo.com`, `user@demo.com`)

---

## 2) Deploy to Vercel (free / git-based)
1. Push this repo to GitHub.
2. In Vercel: **New Project → Import Git Repository**
3. Add env var:
- `DATABASE_URL` = your **Vercel Postgres** connection string

4. Deploy.

### Run migrations against production DB
From your laptop (recommended):
```bash
DATABASE_URL="YOUR_VERCEL_POSTGRES_URL" npx prisma migrate deploy
DATABASE_URL="YOUR_VERCEL_POSTGRES_URL" node prisma/seed.mjs
```

---

## Notes
- Authentication is implemented with **NextAuth (Credentials provider)** + Prisma (database sessions).
