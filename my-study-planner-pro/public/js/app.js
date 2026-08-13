(function(){
  "use strict";
  const cfg=window.MSP_CONFIG||{};
  let mode="login";
  function configured(){return !!(window.MSP_FIREBASE&&MSP_FIREBASE.configured)}
  function gate(){
    const requireAuth=!!(cfg.app&&cfg.app.requireAuth);
    if(configured()){MSP_UI.showAuth(!MSP_FIREBASE.user);return}
    MSP_UI.showAuth(requireAuth&&!localStorage.getItem("msp_guest"));
  }
  function message(t,error){const e=document.getElementById("auth-message");if(e){e.textContent=t;e.className="auth-message"+(error?" error":" success")}}
  function tabs(){document.querySelectorAll("[data-auth-tab]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.authTab;document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.toggle("active",x===b));document.getElementById("auth-name").style.display=mode==="signup"?"block":"none";document.getElementById("auth-form").querySelector(".auth-submit")?.replaceChildren(document.createTextNode(mode==="signup"?"Create account":"Sign in"));message("") }));document.getElementById("auth-name").style.display="none"}
  async function submit(e){e.preventDefault();const email=document.getElementById("auth-email").value.trim();const pass=document.getElementById("auth-password").value;const name=document.getElementById("auth-name").value.trim();if(!configured()){localStorage.setItem("msp_guest","1");const s=MSP_STORE.get();s.profile.email=email;s.profile.name=name||email.split("@")[0]||"Guest";await MSP_STORE.save();MSP_UI.showAuth(false);MSP_UI.userChip();return}try{message("Signing in…");const r=mode==="signup"?await MSP_AUTH.signUp(email,pass,name):await MSP_AUTH.signIn(email,pass);const s=MSP_STORE.get();s.profile.email=r.user.email||email;s.profile.name=r.user.displayName||name||email.split("@")[0];await MSP_STORE.save();message("Success");}catch(err){message(err.message||"Authentication failed",true)}}
  function wire(){tabs();document.getElementById("auth-form")?.addEventListener("submit",submit);document.getElementById("google-auth")?.addEventListener("click",async()=>{try{if(!configured()){message("Add Firebase config in js/config.js first.",true);return}await MSP_AUTH.google()}catch(e){message(e.message,true)}});document.getElementById("guest-auth")?.addEventListener("click",()=>{if(!(cfg.app&&cfg.app.guestMode))return;localStorage.setItem("msp_guest","1");MSP_UI.showAuth(false);MSP_UI.userChip()})}
  window.addEventListener("msp:auth",async e=>{if(e.detail){MSP_STORE.load();const s=MSP_STORE.get();s.profile.email=e.detail.email||s.profile.email;s.profile.name=e.detail.displayName||s.profile.name;await MSP_STORE.save();gate();MSP_UI.userChip(); if(window.MSP_ENTITLEMENT) MSP_ENTITLEMENT.refresh();}else gate()});
  document.addEventListener("DOMContentLoaded",()=>{wire();setTimeout(()=>{gate();MSP_UI.userChip();if(window.MSP_ENTITLEMENT) MSP_ENTITLEMENT.refresh()},50)});
})();
