import {peerPlayer} from '../game-core.mjs';
const CAS="if (redis.call('GET',KEYS[1]) or '') ~= ARGV[1] then return 0 end redis.call('SET',KEYS[1],ARGV[2]); return 1";
export class RedisStore{
 constructor({url=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN,fetcher=fetch}={}){this.url=url?.replace(/\/$/,'');this.token=token;this.fetcher=fetcher;}
 async command(command){if(!this.url||!this.token)throw Error('Vercel用データベースが未設定です。Upstash Redisを接続してください。');const response=await this.fetcher(this.url,{method:'POST',headers:{Authorization:'Bearer '+this.token,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('データベースに接続できません');const data=await response.json();if(data.error)throw Error('データベース処理に失敗しました');return data.result;}
 async get(token){return await this.command(['GET','mf:v1:player:'+token]);}
 async compareAndSet(token,previous,next){return (await this.command(['EVAL',CAS,1,'mf:v1:player:'+token,previous||'',JSON.stringify(next)]))===1;}
 async presence(p){const publicState=peerPlayer(p),room='mf:v1:room:'+p.room,now=Date.now();await this.command(['SET','mf:v1:presence:'+p.id,JSON.stringify(publicState),'EX',30]);await this.command(['ZADD',room,now,p.id]);await this.command(['ZREMRANGEBYSCORE',room,'-inf',now-30000]);}
 async list(p){await this.presence(p);const ids=await this.command(['ZRANGEBYSCORE','mf:v1:room:'+p.room,Date.now()-30000,'+inf','LIMIT',0,200]);if(!ids.length)return [];const data=await this.command(['MGET',...ids.map(id=>'mf:v1:presence:'+id)]);return data.filter(Boolean).map(s=>JSON.parse(s)).filter(other=>other.room===p.room);}
}
