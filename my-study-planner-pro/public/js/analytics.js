(function(){
  "use strict";
  const m=window.MSP_CONFIG?.firebase?.measurementId;
  if(!m || String(m).startsWith("YOUR_")) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  const s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(m);document.head.appendChild(s);
  gtag("js",new Date());gtag("config",m,{anonymize_ip:true});
  window.MSP_ANALYTICS={page(name){gtag("event","page_view",{page_title:name||document.title})},event(name,params){gtag("event",name,params||{})}};
})();
