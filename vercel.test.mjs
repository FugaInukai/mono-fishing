import {test} from 'node:test';import assert from 'node:assert/strict';import http from 'node:http';
import {createHandler} from './api/game.mjs';import {RedisStore} from './lib/redis-store.mjs';
function redisFixture(){const strings=new Map(),sets=new Map();let calls=0;return {strings,get calls(){return calls;},async fetcher(url,options){calls++;const command=JSON.parse(options.body),[op,...a]=command;assert.equal(options.headers.Authorization,'Bearer test-only');let result;
 switch(op){case 'GET':result=strings.get(a[0])??null;break;
 case 'EVAL':{await new Promise(r=>setImmediate(r));const key=a[2],previous=a[3],next=a[4];if((strings.get(key)||'')===previous){strings.set(key,next);result=1;}else result=0;break;}
 case 'SET':strings.set(a[0],a[1]);result='OK';break;
 case 'ZADD':{const set=sets.get(a[0])||new Map();set.set(a[2],Number(a[1]));sets.set(a[0],set);result=1;break;}
 case 'ZREMRANGEBYSCORE':{for(const [key,value]of sets.get(a[0])||[])if(value<=Number(a[2]))sets.get(a[0]).delete(key);result=0;break;}
 case 'ZRANGEBYSCORE':result=[...(sets.get(a[0])||[])].filter(([,score])=>score>=Number(a[1])).map(([id])=>id);break;
 case 'MGET':result=a.map(k=>strings.get(k)??null);break;
 default:throw Error('Unimplemented fixture command: '+op);}
 return {ok:true,async json(){return {result};}};}};}
test('Vercel API keeps cross-instance state, isolates rooms and prevents concurrent duplicate rewards',async()=>{
 const redis=redisFixture(),store=new RedisStore({url:'https://redis.example.invalid',token:'test-only',fetcher:redis.fetcher});
 // Separate handlers model two Vercel function instances sharing only Redis.
 const handlers=[createHandler(store),createHandler(new RedisStore({url:'https://redis.example.invalid',token:'test-only',fetcher:redis.fetcher}))];let instance=0;
 const server=http.createServer((req,res)=>handlers[(instance++)%2](req,res));await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const post=async(action,body)=>{const r=await fetch(base+'/api/game?action='+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
 try{
 const a=(await post('join',{name:'Alpha',room:'one'})).data,b=(await post('join',{name:'Beta',room:'one'})).data,other=(await post('join',{name:'Other',room:'two'})).data;
 assert.equal((await post('state',{token:a.token})).data.player.name,'Alpha');
 const peers=(await post('players',{token:a.token})).data.players;assert.equal(peers.length,2);assert.ok(!JSON.stringify(peers).includes(a.token));assert.ok(!JSON.stringify(peers).includes(other.player.name));assert.equal(peers[0].inventory,undefined);
 assert.equal((await post('buy',{token:a.token,item:'decor-atlantis'})).status,400);
 const dev=(await post('join',{name:'かいはつ',room:'one'})).data;const purchases=await Promise.all([1,2].map(()=>post('buy',{token:dev.token,item:'decor-atlantis'})));assert.ok(purchases.every(r=>r.status===200));const owned=(await post('state',{token:dev.token})).data.player;assert.equal(owned.points,0);assert.equal(owned.owned.filter(i=>i==='decor-atlantis').length,1);
 await post('cast',{token:a.token,target:{x:.5,y:.5}});const key='mf:v1:player:'+a.token,p=JSON.parse(redis.strings.get(key));p.biteAt=Date.now()-100;redis.strings.set(key,JSON.stringify(p));
 const reels=await Promise.all([1,2].map(()=>post('reel',{token:a.token})));assert.equal(reels.filter(r=>r.status===200).length,1);assert.equal(reels.filter(r=>r.status===400).length,1);assert.equal((await post('state',{token:a.token})).data.player.inventory.length,1);
 assert.equal((await post('state',{})).status,401);assert.equal((await post('join',null)).status,400);assert.equal((await post('invalid',{token:a.token})).status,404);assert.ok(redis.calls>10);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
test('missing Redis configuration fails explicitly instead of using temporary server memory',async()=>{
 const store=new RedisStore({url:'',token:''});await assert.rejects(store.get('test'),/未設定/);
});
test('Vercel build exposes only allowlisted browser files',async()=>{
 const {readdir}=await import('node:fs/promises');await import('./scripts/build.mjs');const files=await readdir(new URL('./public/',import.meta.url));assert.equal(files.length,9);assert.ok(files.includes('runtime.json'));for(const forbidden of ['save','server.mjs','game-core.mjs','.env','lib','api'])assert.ok(!files.includes(forbidden));
});
