# Deployment

## Static web root

Deploy the contents of `public/` to your static web host. `index.html` remains the entry point.

## Firebase backend

Deploy `functions/` with the Firebase CLI and apply `firestore/rules` using the root `firebase.json`.

## Domain / Search Console

The uploaded verification meta tag is retained. If the domain changes, verify the new property in Search Console as well.

## Analytics

Add your existing GA4 Measurement ID to `public/js/config.js`. The loader is disabled when the value still starts with `YOUR_`.
