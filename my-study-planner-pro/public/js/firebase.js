(function () {
  "use strict";
  const cfg = window.MSP_CONFIG || {};
  const f = cfg.firebase || {};
  const configured = f.apiKey && !String(f.apiKey).startsWith("YOUR_") && f.projectId && !String(f.projectId).startsWith("YOUR_");
  window.MSP_FIREBASE = { configured: false, auth: null, db: null, functions: null, user: null };

  function init() {
    if (!configured || !window.firebase) return false;
    try {
      if (!firebase.apps.length) firebase.initializeApp(f);
      window.MSP_FIREBASE.auth = firebase.auth();
      window.MSP_FIREBASE.db = firebase.firestore();
      window.MSP_FIREBASE.functions = firebase.app().functions("asia-south1");
      window.MSP_FIREBASE.configured = true;
      window.MSP_FIREBASE.auth.onAuthStateChanged(function (user) {
        window.MSP_FIREBASE.user = user || null;
        window.dispatchEvent(new CustomEvent("msp:auth", { detail: user || null }));
      });
      return true;
    } catch (error) {
      console.error("Firebase initialization failed", error);
      return false;
    }
  }

  window.MSP_FIREBASE_INIT = init;

  window.MSP_AUTH = {
    async signIn(email, password) {
      if (!MSP_FIREBASE.configured) throw new Error("Firebase is not configured yet.");
      return MSP_FIREBASE.auth.signInWithEmailAndPassword(email, password);
    },
    async signUp(email, password, name) {
      if (!MSP_FIREBASE.configured) throw new Error("Firebase is not configured yet.");
      const result = await MSP_FIREBASE.auth.createUserWithEmailAndPassword(email, password);
      if (name) await result.user.updateProfile({ displayName: name });
      return result;
    },
    async google() {
      if (!MSP_FIREBASE.configured) throw new Error("Firebase is not configured yet.");
      return MSP_FIREBASE.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    },
    async signOut() {
      if (MSP_FIREBASE.configured) await MSP_FIREBASE.auth.signOut();
      window.localStorage.removeItem("msp_guest");
    }
  };

  init();
})();


window.MSP_ENTITLEMENT = {
  async refresh(){
    if(!window.MSP_FIREBASE?.configured || !window.MSP_FIREBASE.user || !window.MSP_FIREBASE.functions) return null;
    try {
      const call = window.MSP_FIREBASE.functions.httpsCallable("getMyEntitlement");
      const result = await call({});
      const data = result.data || {};
      const state = window.MSP_STORE.get();
      state.profile.vip = data.vip === true;
      state.profile.role = data.role || "student";
      state.profile.plan = data.plan || "free";
      await window.MSP_STORE.save();
      window.dispatchEvent(new CustomEvent("msp:entitlement", {detail:data}));
      return data;
    } catch (error) {
      console.warn("Entitlement check unavailable", error);
      return null;
    }
  }
};
