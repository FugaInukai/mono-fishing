import http from 'node:http';
import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';

import {fileURLToPath} from 'node:url';
import {createPlayer,applyAction} from './game-core.mjs';
import {spawn,isWalkable} from './world.mjs';
const players=new Map(), streams=new Map();
const savePath=new URL('./save/players.json',import.meta.url);
await mkdir(new URL('./save/',import.meta.url),{recursive:true});
try{for(const p of JSON.parse(await readFile(savePath,'utf8'))){p.online=false;p.castAt=0;if(!isWalkable(p.scene,p.position))p.position=spawn(p.scene,p.angle);players.set(p.token,p);}}catch(e){if(e.code!=='ENOENT')throw Error('保存データを読み込めません。save/players.json を確認してください。');}
let pendingSave=Promise.resolve();
function persist(){const data=JSON.stringify([...players.values()]);pendingSave=pendingSave.then(async()=>{await writeFile(new URL('./save/players.tmp',import.meta.url),data);await rename(new URL('./save/players.tmp',import.meta.url),savePath);});return pendingSave;}
function broadcast(){const data='data: '+JSON.stringify([...players.values()].map(({token,inventory,owned,castAt,...p})=>({...p,fishing:!!castAt})))+'\n\n';for(const s of streams.values())s.write(data);}
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
 const action=url.pathname.slice(5);let p=players.get(body.token);
 if(action==='join'&&!p){p=createPlayer(body);players.set(p.token,p);}
 if(!p)return json({error:'接続が切れました。再入場してください'},401);
 const result=applyAction(action,body,p);
 if(result.status<400&&action!=='state'){await persist();broadcast();}
 return json(result.payload,result.status);

 }
 if(url.pathname==='/runtime.json')return json({transport:'sse'});
 if(req.method!=='GET')return json({error:'Method not allowed'},405);
 const routes={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/data.mjs':'data.mjs','/fish-profiles.mjs':'fish-profiles.mjs','/graphics.mjs':'graphics.mjs','/world.mjs':'world.mjs','/environment.mjs':'environment.mjs'};const file=routes[url.pathname];if(!file)return json({error:'Not found'},404);res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript; charset=utf-8'});res.end(await readFile(new URL(file,import.meta.url)));
 }catch(e){console.error(e);if(!res.headersSent)json({error:'サーバーでエラーが発生しました'},500);else res.end();}
});
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT)||3210;server.listen(port,'0.0.0.0',()=>console.log(`MONO FISHING: http://localhost:${port}`));}


