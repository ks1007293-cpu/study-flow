(function(){
  "use strict";
  const KEY="msp-v2-state";
  const defaults={profile:{name:"Student",email:"",vip:false},activities:[],preferences:{dark:false},focus:{minutes:0,sessions:0}};
  const clone=o=>JSON.parse(JSON.stringify(o));
  function localKey(){const u=window.MSP_FIREBASE&&MSP_FIREBASE.user;return u?KEY+":"+u.uid:KEY+":guest";}
  function load(){try{return {...clone(defaults),...JSON.parse(localStorage.getItem(localKey())||"{}")}}catch{return clone(defaults)}}
  let state=load();
  async function save(){localStorage.setItem(localKey(),JSON.stringify(state));return state}
  function set(p,v){state[p]=v;return save()}
  function patch(p,v){state[p]={...(state[p]||{}),...v};return save()}
  window.MSP_STORE={get:()=>state,load:()=>{state=load();return state},save,set,patch,reset:async()=>{state=clone(defaults);return save()}};
})();
