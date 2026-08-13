(function(){
  "use strict";
  const activityTypes=["task","exam","class","vacation","xtra"];
  function ensureActivityMethods(){
    window.MSP_FEATURES={
      addActivity(data){const s=MSP_STORE.get();s.activities=Array.isArray(s.activities)?s.activities:[];const item={id:crypto.randomUUID?crypto.randomUUID():Date.now()+"",type:data.type||"task",title:String(data.title||"").trim(),details:String(data.details||"").trim(),dueDate:data.dueDate||"",startTime:data.startTime||"",endTime:data.endTime||"",completed:false,createdAt:new Date().toISOString()};if(!activityTypes.includes(item.type))item.type="task";s.activities.unshift(item);MSP_STORE.save();return item},
      complete(id){const s=MSP_STORE.get();const x=s.activities.find(a=>a.id===id);if(x){x.completed=!x.completed;MSP_STORE.save()}return x},
      remove(id){const s=MSP_STORE.get();s.activities=s.activities.filter(a=>a.id!==id);return MSP_STORE.save()},
      stats(){const a=MSP_STORE.get().activities||[];const today=new Date().toISOString().slice(0,10);return{total:a.length,active:a.filter(x=>!x.completed).length,completed:a.filter(x=>x.completed).length,today:a.filter(x=>x.dueDate===today&&!x.completed).length,overdue:a.filter(x=>x.dueDate&&x.dueDate<today&&!x.completed).length}}
    };
  }
  ensureActivityMethods();
})();
