import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FISH,SHOP,compareFish} from './data.mjs';
import {isWater,isWalkable,movePosition,spawn,defaultTarget} from './world.mjs';
test('land movement blocks water and both river bridges allow crossing',()=>{
 for(let scene=0;scene<3;scene++){assert.ok(isWalkable(scene,spawn(scene)));assert.ok(isWater(scene,defaultTarget(scene,spawn(scene))));assert.ok(!isWalkable(scene,{x:.5,y:.5}));}
 const blocked=movePosition(2,{x:.27,y:.5},.45,0);assert.ok(blocked.x<.335);for(const y of [.18,.82]){const crossed=movePosition(2,{x:.25,y},.50,0);assert.ok(crossed.x>.74);assert.ok(!isWater(2,{x:.5,y}));}
 const edge=movePosition(0,{x:.10,y:.12},-1,-1);assert.ok(edge.x>=.045&&edge.y>=.085);assert.equal(isWalkable(0,{x:NaN,y:.5}),false);
});
test('100 species with unique IDs and all three scenes',()=>{assert.equal(FISH.length,100);assert.equal(new Set(FISH.map(f=>f.id)).size,100);for(let i=0;i<3;i++)assert.ok(FISH.filter(f=>f.scene===i).length>=33);});
test('every fish has photographic family traits and book grows in size and rarity',()=>{
 const sorted=[...FISH].sort(compareFish);for(const [i,f]of sorted.entries()){assert.ok(f.visual?.family);assert.ok(f.visual.back.startsWith('#'));assert.ok(f.min>0&&f.max>f.min);if(i){assert.ok(f.max>=sorted[i-1].max);assert.ok(f.rarity>=sorted[i-1].rarity);}}
 assert.equal(sorted[0].name,'メダカ');assert.equal(sorted.at(-1).name,'リュウグウノツカイ');assert.equal(FISH.find(f=>f.name==='ニジマス').visual.pattern,'rainbow');
 const decors=SHOP.filter(i=>i.category==='decor');assert.equal(decors.length,13);assert.equal(Math.min(...decors.map(i=>i.price)),60);assert.equal(Math.max(...decors.map(i=>i.price)),1000000);
});
test('multiplayer, catches and shop are server controlled',async()=>{
 // Tests launch an isolated copy so production saves are untouched.
 const {mkdtemp,copyFile,rm,mkdir,writeFile,readFile}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {pathToFileURL}=await import('node:url');
 const dir=await mkdtemp(join(tmpdir(),'mono-fishing-test-'));for(const f of ['server.mjs','data.mjs','fish-profiles.mjs','world.mjs'])await copyFile(new URL(f,import.meta.url),join(dir,f));
 await mkdir(join(dir,'save'));await writeFile(join(dir,'save','players.json'),JSON.stringify([{token:'funded-test',id:'funded-player',name:'一般',room:'test',scene:0,angle:1,points:1000,inventory:[],owned:[],skin:{},decor:[],seen:Date.now()}]));
 const {server}=await import(pathToFileURL(join(dir,'server.mjs')));await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const streams=[];
 const post=async(action,data)=>{const res=await fetch(base+'/api/'+action,{method:'POST',body:JSON.stringify(data)});return {status:res.status,data:await res.json()};};
 try{
 const a=(await post('join',{name:'Alpha',room:'test'})).data,b=(await post('join',{name:'Beta',room:'test'})).data;assert.notEqual(a.token,b.token);
 assert.ok(isWalkable(0,a.player.position));assert.equal((await post('move',{token:a.token,position:{x:.5,y:.5}})).status,400);assert.equal((await post('cast',{token:a.token,target:{x:.1,y:.1}})).status,400);
 await post('move',{token:b.token,scene:2});assert.equal((await post('move',{token:b.token,position:{x:.5,y:.5}})).status,400);assert.equal((await post('move',{token:b.token,position:{x:.5,y:.18}})).status,200);assert.equal((await post('cast',{token:b.token,target:{x:.5,y:.18}})).status,400);
 const riverCast=(await post('cast',{token:b.token,target:{x:.55,y:.45}})).data;assert.deepEqual(riverCast.target,{x:.55,y:.45});await post('reel',{token:b.token});await post('move',{token:b.token,scene:0});
 const ctrl=new AbortController();streams.push(ctrl);const response=await fetch(base+'/events?token='+b.token,{signal:ctrl.signal});const reader=response.body.getReader();let buffer='';while(!buffer.includes('data: '))buffer+=new TextDecoder().decode((await reader.read()).value);assert.ok(buffer.includes('Alpha'));assert.ok(buffer.includes('Beta'));assert.ok(!buffer.includes(a.token));ctrl.abort();
 assert.equal((await post('reel',{token:a.token})).status,400);assert.equal((await post('buy',{token:a.token,item:'head-cat'})).status,400);assert.equal((await post('equip',{token:a.token,item:'head-cat'})).status,400);
 const paid=(await post('buy',{token:'funded-test',item:'decor-driftwood'})).data.player;assert.equal(paid.points,150);assert.ok(paid.owned.includes('decor-driftwood'));assert.equal((await post('buy',{token:'funded-test',item:'decor-driftwood'})).data.player.points,150);
 const dev=(await post('join',{name:'かいはつ',room:'test'})).data;assert.equal(dev.player.developer,true);
 const luxury=(await post('buy',{token:dev.token,item:'decor-atlantis'})).data.player;assert.equal(luxury.points,0);assert.ok(luxury.owned.includes('decor-atlantis'));assert.ok(luxury.decor.includes('atlantis'));
 for(const item of SHOP){const purchased=(await post('buy',{token:dev.token,item:item.id}));assert.equal(purchased.status,200);assert.equal(purchased.data.player.points,0);}
 const again=(await post('buy',{token:dev.token,item:'decor-atlantis'})).data.player;assert.equal(again.owned.filter(i=>i==='decor-atlantis').length,1);
 const fake=(await post('join',{name:'かいはつさん',room:'test'})).data;assert.equal(fake.player.developer,false);assert.equal((await post('buy',{token:fake.token,item:'decor-atlantis',developer:true,name:'かいはつ'})).status,400);
 const renamed=(await post('join',{token:dev.token,name:'一般プレイヤー',room:'test'})).data;assert.equal(renamed.player.developer,false);assert.equal(renamed.player.points,0);
 await post('move',{token:a.token,scene:1,angle:2});const cast=(await post('cast',{token:a.token,target:{x:.55,y:.55}})).data;assert.deepEqual(cast.target,{x:.55,y:.55});assert.equal((await post('cast',{token:a.token})).status,409);
 await new Promise(r=>setTimeout(r,Math.max(0,cast.biteAt-Date.now()+30)));const caught=(await post('reel',{token:a.token})).data;assert.ok(caught.catch.cm>0);assert.equal(FISH.find(f=>f.id===caught.catch.fishId).scene,1);assert.equal(caught.player.points,caught.catch.points);assert.equal(caught.player.inventory.length,1);assert.equal((await post('reel',{token:a.token})).status,400);
 const free=(await post('buy',{token:a.token,item:'head-none'})).data;assert.equal(free.player.points,caught.player.points);assert.equal(free.player.owned.filter(x=>x==='head-none').length,1);
 const balance=caught.player.points;const affordable=SHOP.filter(i=>i.category==='decor'&&i.price<=balance&&!free.player.owned.includes(i.id)).sort((a,b)=>a.price-b.price)[0];if(affordable){const bought=(await post('buy',{token:a.token,item:affordable.id})).data.player;assert.equal(bought.points,balance-affordable.price);assert.ok(bought.owned.includes(affordable.id));assert.equal((await post('buy',{token:a.token,item:affordable.id})).data.player.points,bought.points);}
 await post('chat',{token:a.token,text:'hello'});assert.equal((await post('chat',{token:a.token,text:'spam'})).status,429);
 const state=(await post('state',{token:a.token})).data.player;assert.equal(state.bubble,'hello');assert.equal(state.inventory.length,1);
 const saved=JSON.parse(await readFile(join(dir,'save','players.json'),'utf8'));assert.ok(saved.find(p=>p.token===dev.token).owned.includes('decor-atlantis'));assert.equal(saved.find(p=>p.token==='funded-test').points,150);
 }finally{for(const c of streams)c.abort();server.closeAllConnections();await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
