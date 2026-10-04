# Pragyam 2.0

Event management portal for Pragyam 2.0, the Department of Computer Science fest at Central University of Rajasthan. Built with Next.js (App Router), React, Tailwind CSS, MongoDB (Mongoose) and Resend.

Hosts propose events, admins approve or reject them, and participants register for approved events.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your own values
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `RESEND_API_KEY` | Resend API key for emails |
| `EMAIL_FROM` | Verified sender address |
| `ADMIN_SECRET` | Password for the admin dashboard |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used in emails |

Secrets live only in `.env.local` (git-ignored) or your hosting provider's settings. Never commit them.
