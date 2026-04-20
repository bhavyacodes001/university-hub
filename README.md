# SRM Sonipat — Student Portal

A modern, full-stack Student Portal for **SRM University, Sonipat (Delhi NCR)**.
Built with Vite + React + TypeScript + Tailwind, designed in the spirit of
Linear & Vercel: minimal, neutral, focused.

## Features (Phase 1)

**Student**
- Dashboard with CGPA, attendance, fees, today's classes, recent notices
- Weekly timetable
- Attendance with subject-wise chart and <75% flagging
- Results with SGPA trend & semester marksheets
- Fees breakdown with status badges and "Pay now" / receipt download
- Notice board with category filters
- Profile with editable contact info

**Admin**
- KPI dashboard with department-wise attendance chart
- Student management (search · add · delete · CSV export)
- Notice publishing
- Mark attendance per subject / date

**Auth**
- Login / Register / Forgot password
- Role-based routing (`student` vs `admin`)
- Persistent JWT-style session in `localStorage` (Zustand `persist`)

## Tech stack

- Vite + React 18 + TypeScript
- Tailwind CSS (custom design system, Inter font, indigo accent)
- React Router v6
- Zustand (auth store)
- React Hook Form + Zod (validated forms)
- Recharts (charts)
- Framer Motion (page transitions)
- Sonner (toasts)
- shadcn/ui primitives + Lucide icons

## Quick start

```bash
git clone <your-repo-url>
cd srm-sonipat-portal
npm install
npm run dev
```

Open http://localhost:5173.

### Demo accounts

Buttons on the login page auto-fill these credentials:

| Role    | Email                       | Password    |
|---------|-----------------------------|-------------|
| Student | `aarav.student@srm.demo`    | `demo1234`  |
| Student | `meera.student@srm.demo`    | `demo1234`  |
| Admin   | `admin@srm.demo`            | `admin1234` |

## Local mock data

The app runs **100% offline** out of the box. All data lives in
`src/lib/mockData.ts` and is served through `src/lib/api.ts`, which is the
single seam for swapping in a real backend.

## Connecting Supabase (optional)

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and fill in:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. Re-implement the methods in `src/lib/api.ts` to call Supabase.
   Pages and components do **not** depend on the data source.

## Project structure

```
src/
  components/     Shared UI (Sidebar, Layout, StatCard, StatusBadge…)
  pages/
    auth/         Login, Register, Forgot password
    student/      Dashboard, Timetable, Attendance, Results, Fees, Notices, Profile
    admin/        Dashboard, Students, Notices, Attendance
  lib/
    api.ts        Single API surface (mock today, Supabase tomorrow)
    mockData.ts   Seed data: students, admins, subjects, timetable, fees, notices
    utils.ts      cn() helper
  store/auth.ts   Zustand persisted auth store
  types/          TypeScript interfaces
  constants/      Routes & demo accounts
```

## Roadmap (Phase 2)

Library, Hostel, Transport, Examinations (hall tickets), Course Registration,
Support tickets, full Admin CRUD (courses, faculty, fees, exams, library),
CSV bulk import, analytics exports.

## License

MIT
