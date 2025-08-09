# Letzter Anruf – PRO

**Stand:** 2025-08-09

## Schnellstart
1) `.env` aus `.env.example` füllen (in Vercel als Environment Variables).
2) `npm i`
3) `npx prisma migrate dev --name init`
4) `npm run dev`

## Deploy (Vercel)
- Repo importieren → ENV Variablen setzen (siehe unten) → Deploy.
- Domain als `NEXT_PUBLIC_BASE_URL` eintragen.
- Stripe Webhook: `https://DEINE-DOMAIN/api/webhook` (Event: `checkout.session.completed`).
- Cron Job: `*/1 * * * *` → GET `https://DEINE-DOMAIN/api/admin/cron`.

## ENV Variablen
- `NEXT_PUBLIC_BASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_5M`, `STRIPE_PRICE_ID_10M`, `STRIPE_PRICE_ID_20M`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- `DATABASE_URL`
- (optional) `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET`
- `ADMIN_PASSWORD`

## Admin
- Login: `/admin/login`
- Dashboard: `/admin`

## Rechtliches
- Nutzung nur mit dokumentierter Einwilligung der Stimme. IP/Time-Stamp werden gespeichert.
- Takedown möglich; Missbrauch = Sperre (Blocklist).
