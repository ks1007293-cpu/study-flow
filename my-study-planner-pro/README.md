# My Study Planner — Production Upgrade

This package is a structured upgrade of the uploaded My Study Planner codebase.
The original planner is preserved under `legacy/` and the upgraded static application is under `public/`.

## What is upgraded

- Professional landing page retained from the existing planner.
- Existing dashboard, profile/marks calculator, calendar, tasks, exams, classes, vacations, Xtra activities and Pomodoro flow retained.
- Search Console verification meta tag retained from the uploaded source.
- Professional SEO metadata and Open Graph metadata added.
- Firebase Authentication integration prepared for email/password and Google sign-in.
- Per-user local persistence namespace so guest/user data is not mixed in one browser key.
- Firestore-ready user entitlement model.
- Server-side VIP entitlement function; VIP is not trusted from a client-side email check.
- Admin-only callable functions for changing VIP status and user role.
- Audit logging for VIP/plan changes.
- Responsive auth gate and user status chip.
- Optional GA4 loader that uses the Measurement ID you provide in `public/js/config.js`.
- No Firebase service-account private key is placed in the browser.

## Important: Google Analytics

The uploaded legacy source contains the Google Search Console verification tag, but no GA4 Measurement ID was found in the source. Therefore this package does **not** invent one.

Put your real `G-XXXXXXXXXX` value in `public/js/config.js` under `measurementId`.

## Firebase setup

1. Create/select your Firebase project.
2. Enable Authentication → Email/Password and Google.
3. Create a Web App and copy its Firebase config.
4. Paste that config into `public/js/config.js`.
5. Create Firestore in production mode.
6. Install Firebase CLI and run `firebase login`.
7. From this project folder run `firebase use YOUR_PROJECT_ID`.
8. Install functions dependencies: `cd functions && npm install`.
9. Set `ADMIN_UIDS` for the Cloud Functions deployment environment to a comma-separated list of trusted admin UIDs.
10. Deploy hosting, Firestore rules and functions.

## VIP

The frontend never decides that a person is VIP merely because an email matches a hardcoded string. The entitlement is read from the server-side `users/{uid}` document through the callable function.

To grant VIP, an authenticated admin calls the `setVipStatus` callable function. This prevents visitors from opening DevTools and simply changing a `vip=true` flag to unlock protected features.

For paid VIP subscriptions, connect the same entitlement model to your chosen payment provider webhook. Do not put payment-provider secret keys in `public/`.

## Gift Hub

If Gift Hub is static hosting only, upload the contents of `public/` as the web root. The Firebase Functions and Firestore rules must be deployed through Firebase (or another supported backend) separately. Uploading JavaScript files to a static host does not execute Node.js server functions.

## Security

- Never upload a Firebase service-account JSON file.
- Never put Stripe/Razorpay secret keys in `public/`.
- Keep admin UID configuration server-side.
- Review Firestore rules before production launch.
- Replace placeholder Firebase config values before enabling authentication.
