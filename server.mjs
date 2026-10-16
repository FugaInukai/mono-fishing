import http from 'node:http';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {FISH,SHOP} from './data.mjs';
import {spawn,isWalkable,isWater,defaultTarget} from './world.mjs';
const players=new Map(), streams=new Map();
const savePath=new URL('./save/players.json',import.meta.url);
await mkdir(new URL('./save/',import.meta.url),{recursive:true});
try{for(const p of JSON.parse(await readFile(savePath,'utf8'))){p.online=false;p.castAt=0;if(!isWalkable(p.scene,p.position))p.position=spawn(p.scene,p.angle);players.set(p.token,p);}}catch(e){if(e.code!=='ENOENT')throw Error('保存データを読み込めません。save/players.json を確認してください。');}
let pendingSave=Promise.resolve();
function persist(){const data=JSON.stringify([...players.values()]);pendingSave=pendingSave.then(async()=>{await writeFile(new URL('./save/players.tmp',import.meta.url),data);await rename(new URL('./save/players.tmp',import.meta.url),savePath);});return pendingSave;}
const clean=(v,n=24)=>String(v??'').replace(/[\u0000-\u001f]/g,'').trim().slice(0,n);
function broadcast(){const data='data: '+JSON.stringify([...players.values()].map(({token,inventory,owned,castAt,...p})=>({...p,fishing:!!castAt})))+'\n\n';for(const s of streams.values())s.write(data);}
function publicPlayer(p){const {token,castAt,...data}=p;return {...data,developer:p.name==='かいはつ'};}
export const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 res.setHeader('Cache-Control','no-store');
 const json=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
 try{
 if(req.method==='GET'&&url.pathname==='/events'){
 const p=players.get(url.searchParams.get('token'));if(!p)return json({error:'もう一度入場してください'},401);
 res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive'});res.write(': connected\n\n');streams.get(p.token)?.end();streams.set(p.token,res);p.online=true;p.seen=Date.now();broadcast();
 const heartbeat=setInterval(()=>res.write(': heartbeat\n\n'),15000);req.on('close',()=>{clearInterval(heartbeat);if(streams.get(p.token)===res){streams.delete(p.token);p.online=false;broadcast();}});return;
 }
 if(req.method==='POST'&&url.pathname.startsWith('/api/')){
 let raw='';for await(const b of req){raw+=b;if(raw.length>10000)return json({error:'送信内容が長すぎます'},413);}let body;try{body=JSON.parse(raw);}catch{return json({error:'送信形式が不正です'},400);}
 if(url.pathname==='/api/join'){
 let p=players.get(body.token);if(!p){const token=randomUUID();p={token,id:randomUUID(),name:clean(body.name)||'釣り人',room:clean(body.room,16)||'pond',scene:0,angle:1.2,points:0,inventory:[],owned:['head-none','body-basic','feet-basic'],skin:{head:'none',body:'basic',feet:'basic'},decor:[],bubble:'',bubbleUntil:0,online:true};players.set(token,p);}else{p.name=clean(body.name)||p.name;p.room=clean(body.room,16)||p.room;}if(!isWalkable(p.scene,p.position))p.position=spawn(p.scene,p.angle);p.castAt=0;p.castTarget=null;p.seen=Date.now();await persist();broadcast();return json({token:p.token,player:publicPlayer(p)});
 }
 const p=players.get(body.token);if(!p)return json({error:'接続が切れました。再入場してください'},401);p.seen=Date.now();
 switch(url.pathname){
 case '/api/state':return json({player:publicPlayer(p)});
 case '/api/move':{
 const nextScene=[0,1,2].includes(body.scene)?body.scene:p.scene;
 const position=body.position||(nextScene!==p.scene?spawn(nextScene,p.angle):p.position);
 if(!isWalkable(nextScene,position))return json({error:'水の上には移動できません'},400);
 p.position={x:position.x,y:position.y};p.angle=Number.isFinite(body.angle)?body.angle:p.angle;p.scene=nextScene;p.castAt=0;p.castTarget=null;break;
 }
 case '/api/chat':if(Date.now()-(p.chatAt||0)<1000)return json({error:'少し待ってから送信してください'},429);p.chatAt=Date.now();p.bubble=clean(body.text,60);p.bubbleUntil=Date.now()+6000;break;
 case '/api/cast':{
 if(p.castAt)return json({error:'すでに釣り糸を投げています'},409);
 const target=body.target||defaultTarget(p.scene,p.position);if(!isWater(p.scene,target)||target.x<0||target.x>1||target.y<0||target.y>1)return json({error:'水面を選んでください。橋の上には投げられません'},400);
 p.castTarget={x:target.x,y:target.y};p.castAt=Date.now();p.biteAt=p.castAt+2000+Math.random()*3500;broadcast();return json({biteAt:p.biteAt,target:p.castTarget});
 }
 case '/api/reel':{
 if(!p.castAt)return json({error:'先に釣り糸を投げてください'},400);const good=Date.now()>=p.biteAt&&Date.now()<p.biteAt+3500;p.castAt=0;if(!good){broadcast();return json({miss:true});}
 const pool=FISH.filter(f=>f.scene===p.scene),weights=pool.map(f=>[18,10,5,2,0.65][f.rarity]);let r=Math.random()*weights.reduce((a,b)=>a+b,0),f=pool.at(-1);for(let i=0;i<pool.length;i++){r-=weights[i];if(r<=0){f=pool[i];break;}}
 const cm=+(f.min+Math.random()*(f.max-f.min)).toFixed(1),points=Math.round(f.points*(.8+cm/f.max*.5));const catchFish={uid:randomUUID(),fishId:f.id,cm,points,time:Date.now()};p.inventory.push(catchFish);p.points+=points;await persist();broadcast();return json({catch:catchFish,player:publicPlayer(p)});
 }
 case '/api/buy':{const item=SHOP.find(i=>i.id===body.item);if(!item)return json({error:'商品がありません'},400);if(!p.owned.includes(item.id)){if(p.name!=='かいはつ'){if(p.points<item.price)return json({error:'ポイントが足りません'},400);p.points-=item.price;}p.owned.push(item.id);}if(item.category==='decor'){if(!p.decor.includes(item.value))p.decor.push(item.value);}else p.skin[item.category]=item.value;break;}
 case '/api/equip':{const item=SHOP.find(i=>i.id===body.item);if(!item||!p.owned.includes(item.id))return json({error:'未購入のスキンです'},400);if(item.category==='decor')p.decor=p.decor.includes(item.value)?p.decor.filter(x=>x!==item.value):[...p.decor,item.value];else p.skin[item.category]=item.value;break;}
 default:return json({error:'操作が見つかりません'},404);
 }await persist();broadcast();return json({player:publicPlayer(p)});
 }
 if(req.method!=='GET')return json({error:'Method not allowed'},405);
 const routes={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/data.mjs':'data.mjs','/fish-profiles.mjs':'fish-profiles.mjs','/graphics.mjs':'graphics.mjs','/world.mjs':'world.mjs','/environment.mjs':'environment.mjs'};const file=routes[url.pathname];if(!file)return json({error:'Not found'},404);res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript; charset=utf-8'});res.end(await readFile(new URL(file,import.meta.url)));
 }catch(e){console.error(e);if(!res.headersSent)json({error:'サーバーでエラーが発生しました'},500);else res.end();}
});
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT)||3210;server.listen(port,'0.0.0.0',()=>console.log(`MONO FISHING: http://localhost:${port}`));}


