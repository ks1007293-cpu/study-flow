/* My Study Planner production configuration.
 * Replace the placeholder values with your Firebase Web App config.
 * Firebase web config is safe to ship client-side; do not put service-account
 * private keys, Stripe/Razorpay secrets, or server credentials in this file.
 */
window.MSP_CONFIG = Object.freeze({
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
    measurementId: "YOUR_GA4_MEASUREMENT_ID"
  },
  app: {
    name: "My Study Planner",
    version: "2.0.0",
    guestMode: true,
    requireAuth: false,
    defaultVip: false
  }
});
