# VISIONPLUS LIBRARY

Premium website and seat-booking system for VISIONPLUS LIBRARY, Patan, Gujarat.

## Run locally

1. Copy `.env.example` to `.env` and set a strong `ADMIN_PASSWORD` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Start the site and API together: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173)
5. Admin dashboard: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

Default local credentials come from `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). Change them before any real deployment.

## Production

```bash
npm run build
npm start
```

The API serves the built frontend from `dist` when that folder exists.

## What the administrator must configure

The public site ships with verified business details only. These stay empty until the library owner publishes them:

- Facilities
- Membership plan names, durations, prices and benefits
- Seat grid, labels and total capacity
- Optional time slots
- Gallery photographs of this library
- Weekly opening hours (a notice currently states Google lists the library as open until 12 AM)
- Social media URLs
- Google Maps reviews URL if a more specific Place link is available

Until seats are configured, visitors can still send a WhatsApp or contact-form booking enquiry.

## Stack

React, TypeScript, Tailwind CSS, Framer Motion, Express, JSON file store (`data/db.json`).
