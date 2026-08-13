(function(){
  "use strict";
  function notice(message,kind){let n=document.querySelector(".msp-notice");if(!n){n=document.createElement("div");n.className="msp-notice";document.body.appendChild(n)}n.textContent=message;n.classList.add("show");clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove("show"),3500)}
  function userChip(){let c=document.querySelector(".msp-user-chip");if(!c){c=document.createElement("div");c.className="msp-user-chip";c.innerHTML='<span class="dot"></span><span class="label">Guest</span><button type="button">Sign out</button>';document.body.appendChild(c);c.querySelector("button").onclick=()=>window.MSP_AUTH.signOut().then(()=>location.reload())}const u=window.MSP_FIREBASE&&MSP_FIREBASE.user;const s=MSP_STORE.get();const label=u?(u.displayName||u.email||"Student"):(s.profile.email||"Guest");c.querySelector(".label").textContent=label+(s.profile.vip?" · VIP":"");c.classList.toggle("vip",!!s.profile.vip)}
  window.MSP_UI={notice,userChip,showAuth:(show)=>{const g=document.getElementById("auth-gate");if(!g)return;g.classList.toggle("hidden",!show);g.setAttribute("aria-hidden",String(!show))}};
})();
