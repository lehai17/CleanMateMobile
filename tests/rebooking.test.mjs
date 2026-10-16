import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source=await readFile(new URL('../src/utils/rebooking.js',import.meta.url),'utf8');
const {rebookingDraft}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const user={id:12,fullName:'Current user',phoneNumber:'0901111111',email:'current@example.test',address:'Current profile address'};
const services={cleaning:{name:'Renamed current service',price:81000,minHours:1,maxHours:3}};
const template={ownerId:12,sourceId:31,serviceKey:'cleaning',durationHours:2,contactName:'Original Contact',contactPhone:'0907777777',address:'Booking address',notes:'Private booking notes'};

test('repeat drafts preserve booking contact and key while excluding price, schedule and cleaner state',()=>{
  const draft=rebookingDraft({...template,price:1,date:'2000-01-01',startTime:'2000-01-01',time:'09:00',cleanerId:99,paidAt:'2000-01-01',requestId:'old',status:'Completed'},services,user);
  assert.equal(draft.selectedKey,'cleaning');assert.equal(draft.duration,2);assert.equal(draft.customerInfo.name,'Original Contact');assert.equal(draft.customerInfo.phone,'0907777777');assert.equal(draft.customerInfo.address,'Booking address');assert.equal(draft.customerInfo.notes,'Private booking notes');assert.equal(draft.customerInfo.paymentMethod,'cash');assert.equal(draft.customerInfo.email,user.email);
  for(const field of ['price','date','startTime','time','cleanerId','paidAt','requestId','status'])assert.equal(Object.hasOwn(draft,field),false);
});
test('current duration bounds replace incompatible old hours',()=>{
  assert.equal(rebookingDraft({...template,durationHours:8},services,user).duration,3);
  assert.equal(rebookingDraft({...template,durationHours:0},services,user).duration,1);
  assert.equal(rebookingDraft({...template,durationHours:8},services,user).durationChanged,true);
});
test('missing or removed services require a new choice without guessing from a name or prototype',()=>{
  for(const serviceKey of [null,'retired','constructor','__proto__']){
    const draft=rebookingDraft({...template,serviceKey},services,user);assert.equal(draft.selectedKey,null);assert.equal(draft.unavailable,true);assert.equal(draft.customerInfo.address,template.address);
  }
});
test('another account, logout and invalid source cannot restore a private draft',()=>{
  assert.equal(rebookingDraft(template,services,{...user,id:99}),null);assert.equal(rebookingDraft(template,services,null),null);
  for(const sourceId of [0,-1,'31',null,Infinity])assert.equal(rebookingDraft({...template,sourceId},services,user),null);
  assert.equal(rebookingDraft(undefined,services,user),null);
});
