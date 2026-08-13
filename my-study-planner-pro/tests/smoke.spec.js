/* Lightweight regression checklist. Run in a browser test runner after deployment. */
const checks = [
  ['landing exists', () => !!document.querySelector('#landing')],
  ['application exists', () => !!document.querySelector('#app')],
  ['auth gate exists', () => !!document.querySelector('#auth-gate')],
  ['search console tag exists', () => !!document.querySelector('meta[name="google-site-verification"]')],
  ['tasks navigation exists', () => !!document.querySelector('[data-view="tasks"]')],
  ['calendar navigation exists', () => !!document.querySelector('[data-view="calendar"]')],
  ['focus navigation exists', () => !!document.querySelector('[data-view="focus"]')],
  ['settings navigation exists', () => !!document.querySelector('[data-view="settings"]')],
  ['store loaded', () => !!window.MSP_STORE],
  ['features loaded', () => !!window.MSP_FEATURES],
  ['firebase bridge loaded', () => !!window.MSP_AUTH],
];
window.MSP_RUN_SMOKE_TESTS = function(){
  return checks.map(([name,fn])=>{try{return{name,ok:!!fn()}}catch(error){return{name,ok:false,error:String(error)}}});
};
