const {onCall,HttpsError} = require('firebase-functions/v2/https');
const {onDocumentCreated,onDocumentUpdated} = require('firebase-functions/v2/firestore');
const {setGlobalOptions} = require('firebase-functions/v2');
const admin=require('firebase-admin');
admin.initializeApp();
setGlobalOptions({region:'asia-south1',maxInstances:10});
const db=admin.firestore();
const ADMIN_UIDS=(process.env.ADMIN_UIDS||'').split(',').map(x=>x.trim()).filter(Boolean);
function isAdmin(uid){return !!uid&&ADMIN_UIDS.includes(uid)}
exports.health=onCall(()=>({ok:true,service:'my-study-planner',version:'2.0.0'}));
exports.getMyEntitlement=onCall(async(req)=>{if(!req.auth)throw new HttpsError('unauthenticated','Sign in required');const ref=db.collection('users').doc(req.auth.uid);const snap=await ref.get();const data=snap.exists?snap.data():{};return{uid:req.auth.uid,role:data.role||'student',vip:data.vip===true,plan:data.plan||'free'}});
exports.setVipStatus=onCall(async(req)=>{if(!req.auth||!isAdmin(req.auth.uid))throw new HttpsError('permission-denied','Admin access required');const uid=String(req.data&&req.data.uid||'');const vip=Boolean(req.data&&req.data.vip);if(!uid)throw new HttpsError('invalid-argument','uid is required');await db.collection('users').doc(uid).set({vip,plan:vip?'vip':'free',updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});return{ok:true,uid,vip}});
exports.setUserRole=onCall(async(req)=>{if(!req.auth||!isAdmin(req.auth.uid))throw new HttpsError('permission-denied','Admin access required');const uid=String(req.data&&req.data.uid||'');const role=String(req.data&&req.data.role||'student');if(!uid||!['student','admin','moderator'].includes(role))throw new HttpsError('invalid-argument','Invalid user role');await db.collection('users').doc(uid).set({role,updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});return{ok:true,uid,role}});
exports.bootstrapUser=onDocumentCreated('users/{uid}',async(event)=>{const snap=event.data;if(!snap)return;await snap.ref.set({role:'student',vip:false,plan:'free',createdAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});});
exports.auditVipChanges=onDocumentUpdated('users/{uid}',async(event)=>{const before=event.data.before.data()||{};const after=event.data.after.data()||{};if(before.vip===after.vip&&before.plan===after.plan)return;await db.collection('auditLogs').add({uid:event.params.uid,before:{vip:!!before.vip,plan:before.plan||'free'},after:{vip:!!after.vip,plan:after.plan||'free'},createdAt:admin.firestore.FieldValue.serverTimestamp()});});
