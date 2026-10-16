import {createPlayer,applyAction} from '../game-core.mjs';
import {RedisStore} from '../lib/redis-store.mjs';
export function createHandler(store){return async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 const send=(payload,status=200)=>{res.statusCode=status;res.end(JSON.stringify(payload));};
 if(req.method!=='POST')return send({error:'POSTを使用してください'},405);
 try{
 let body=req.body;if(body===undefined){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>10000)return send({error:'送信内容が長すぎます'},413);}try{body=JSON.parse(raw);}catch{return send({error:'送信形式が不正です'},400);}}
 if(typeof body==='string'){try{body=JSON.parse(body);}catch{return send({error:'送信形式が不正です'},400);}}
 if(!body||typeof body!=='object'||Array.isArray(body))return send({error:'送信形式が不正です'},400);
 const url=new URL(req.url,'http://localhost'),action=url.searchParams.get('action')||url.pathname.split('/').at(-1);
 if(!['join','state','players','move','chat','cast','reel','buy','equip'].includes(action))return send({error:'操作が見つかりません'},404);
 let token=typeof body.token==='string'&&/^[0-9a-f-]{36}$/i.test(body.token)?body.token:null;
 let raw=token?await store.get(token):null;
 if(action==='join'&&!raw){const fresh=createPlayer(body);token=fresh.token;raw=null;}
 if(!token||action!=='join'&&!raw)return send({error:'接続が切れました。再入場してください'},401);
 if(action==='players')return send({players:await store.list(JSON.parse(raw))});
 for(let attempt=0;attempt<5;attempt++){
 const p=raw?JSON.parse(raw):{...createPlayer(body),token};const result=applyAction(action,body,p);
 if(result.status>=400)return send(result.payload,result.status);
 if(action==='state')return send(result.payload);
 if(await store.compareAndSet(token,raw,p)){await store.presence(p).catch(()=>{});return send(result.payload,result.status);}
 raw=await store.get(token);if(!raw)return send({error:'再入場してください'},401);
 }
 return send({error:'同時操作が重なりました。もう一度操作してください'},409);
 }catch{return send({error:'データ保存に接続できません。VercelのRedis接続設定を確認してください。'},503);}
};}
export default createHandler(new RedisStore());
