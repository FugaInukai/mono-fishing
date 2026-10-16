import {randomUUID} from 'node:crypto';
import {FISH,SHOP} from './data.mjs';
import {spawn,isWalkable,isWater,defaultTarget} from './world.mjs';
const clean=(v,n=24)=>String(v??'').replace(/[\u0000-\u001f]/g,'').trim().slice(0,n);
const reply=(payload,status=200)=>({payload,status});
export function publicPlayer(p){const {token,castAt,...data}=p;return {...data,developer:p.name==='かいはつ'};}
export function peerPlayer(p){const {token,inventory,owned,castAt,...data}=p;return {...data,fishing:!!castAt,online:true};}
export function createPlayer(body){return {token:randomUUID(),id:randomUUID(),name:clean(body.name)||'釣り人',room:clean(body.room,16)||'pond',scene:0,angle:1.2,position:spawn(0),points:0,inventory:[],owned:['head-none','body-basic','feet-basic'],skin:{head:'none',body:'basic',feet:'basic'},decor:[],bubble:'',bubbleUntil:0,online:true,seen:Date.now()};}
export function applyAction(action,body,p){
 p.seen=Date.now();
 if(action==='join'){p.name=clean(body.name)||p.name;p.room=clean(body.room,16)||p.room;if(!isWalkable(p.scene,p.position))p.position=spawn(p.scene,p.angle);p.castAt=0;p.castTarget=null;return reply({token:p.token,player:publicPlayer(p)});}
 switch("/api/"+action){
 case '/api/state':return reply({player:publicPlayer(p)});
 case '/api/move':{
 const nextScene=[0,1,2].includes(body.scene)?body.scene:p.scene;
 const position=body.position||(nextScene!==p.scene?spawn(nextScene,p.angle):p.position);
 if(!isWalkable(nextScene,position))return reply({error:'水の上には移動できません'},400);
 p.position={x:position.x,y:position.y};p.angle=Number.isFinite(body.angle)?body.angle:p.angle;p.scene=nextScene;p.castAt=0;p.castTarget=null;break;
 }
 case '/api/chat':if(Date.now()-(p.chatAt||0)<1000)return reply({error:'少し待ってから送信してください'},429);p.chatAt=Date.now();p.bubble=clean(body.text,60);p.bubbleUntil=Date.now()+6000;break;
 case '/api/cast':{
 if(p.castAt)return reply({error:'すでに釣り糸を投げています'},409);
 const target=body.target||defaultTarget(p.scene,p.position);if(!isWater(p.scene,target)||target.x<0||target.x>1||target.y<0||target.y>1)return reply({error:'水面を選んでください。橋の上には投げられません'},400);
 p.castTarget={x:target.x,y:target.y};p.castAt=Date.now();p.biteAt=p.castAt+2000+Math.random()*3500;return reply({biteAt:p.biteAt,target:p.castTarget});
 }
 case '/api/reel':{
 if(!p.castAt)return reply({error:'先に釣り糸を投げてください'},400);const good=Date.now()>=p.biteAt&&Date.now()<p.biteAt+3500;p.castAt=0;if(!good){return reply({miss:true});}
 const pool=FISH.filter(f=>f.scene===p.scene),weights=pool.map(f=>[18,10,5,2,0.65][f.rarity]);let r=Math.random()*weights.reduce((a,b)=>a+b,0),f=pool.at(-1);for(let i=0;i<pool.length;i++){r-=weights[i];if(r<=0){f=pool[i];break;}}
 const cm=+(f.min+Math.random()*(f.max-f.min)).toFixed(1),points=Math.round(f.points*(.8+cm/f.max*.5));const catchFish={uid:randomUUID(),fishId:f.id,cm,points,time:Date.now()};p.inventory.push(catchFish);p.points+=points;return reply({catch:catchFish,player:publicPlayer(p)});
 }
 case '/api/buy':{const item=SHOP.find(i=>i.id===body.item);if(!item)return reply({error:'商品がありません'},400);if(!p.owned.includes(item.id)){if(p.name!=='かいはつ'){if(p.points<item.price)return reply({error:'ポイントが足りません'},400);p.points-=item.price;}p.owned.push(item.id);}if(item.category==='decor'){if(!p.decor.includes(item.value))p.decor.push(item.value);}else p.skin[item.category]=item.value;break;}
 case '/api/equip':{const item=SHOP.find(i=>i.id===body.item);if(!item||!p.owned.includes(item.id))return reply({error:'未購入のスキンです'},400);if(item.category==='decor')p.decor=p.decor.includes(item.value)?p.decor.filter(x=>x!==item.value):[...p.decor,item.value];else p.skin[item.category]=item.value;break;}
 default:return reply({error:'操作が見つかりません'},404);

 }
 return reply({player:publicPlayer(p)});
}
