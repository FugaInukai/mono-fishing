const cache=new Map();
const poly=(c,p,fill,stroke)=>{c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}};
const oval=(c,x,y,rx,ry,fill)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();};
const stroke=(c,p,color,width=1)=>{c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();};
const rect=(c,x,y,w,h,r,fill)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();};
function gradient(c,x1,y1,x2,y2,colors){const g=c.createLinearGradient(x1,y1,x2,y2);colors.forEach((s,i)=>g.addColorStop(i/(colors.length-1),s));return g;}
function fin(c,p,color,root){poly(c,p,color,'#26383240');if(root)for(let i=1;i<p.length;i++)stroke(c,[root,p[i]],'#edf4e655',.55);}
function bodyPath(c,v){const h=42*v.height,f=v.family;c.beginPath();
 if(f==='sturgeon'){c.moveTo(-44,0);c.bezierCurveTo(-18,-h,18,-h,31,-h*.5);c.lineTo(58,-2);c.lineTo(39,3);c.quadraticCurveTo(7,h*.8,-44,0);}
 else if(f==='flatfish'){c.moveTo(-43,0);c.bezierCurveTo(-26,-h*1.2,11,-h*1.5,45,-5);c.bezierCurveTo(57,0,28,h*1.5,-15,h);c.quadraticCurveTo(-38,h*.6,-43,0);}
 else if(f==='sunfish'){c.moveTo(-27,-3);c.bezierCurveTo(-25,-40,21,-40,43,-7);c.quadraticCurveTo(55,4,43,14);c.bezierCurveTo(20,41,-27,39,-27,-3);}
 else if(f==='mahi'){c.moveTo(-44,0);c.quadraticCurveTo(-12,-h,31,-h*1.15);c.lineTo(40,-h*.8);c.lineTo(45,1);c.quadraticCurveTo(25,h,-8,h*.8);c.quadraticCurveTo(-33,h*.3,-44,0);}
 else if(f==='catfish'||f==='sculpin'||f==='goby'){c.moveTo(-44,0);c.bezierCurveTo(-12,-h*.7,30,-h*1.2,47,-h*.1);c.quadraticCurveTo(54,7,39,h*.8);c.quadraticCurveTo(-5,h,-44,0);}
 else{c.moveTo(-44,0);c.bezierCurveTo(-27,-h*.35,-6,-h*1.25,22,-h*.8);c.quadraticCurveTo(37,-h*.48,48,-1);c.quadraticCurveTo(49,2,44,4);c.bezierCurveTo(23,h*1.2,-15,h*.8,-44,0);}
 c.closePath();}
function specialBody(c,f){const v=f.visual,kind=v.family,g=gradient(c,-10,-35,10,35,[v.back,v.side,v.belly]);
 if(['eel','loach','ribbon','oarfish'].includes(kind)){
 const height=kind==='loach'?6:kind==='eel'?5:4.5;const p=new Path2D();p.moveTo(-55,0);p.bezierCurveTo(-28,-height-3,23,-height-1,48,-height/2);p.quadraticCurveTo(59,0,48,height*.7);p.bezierCurveTo(20,height+3,-20,height,-55,0);c.fillStyle=g;c.fill(p);
 if(kind==='oarfish'){fin(c,[[-51,-2],[-36,-12],[-5,-10],[28,-10],[47,-6],[34,-3]],'#b74748',[-25,-4]);stroke(c,[[45,-3],[46,-30],[51,-41]],'#c6474c',1.5);stroke(c,[[48,-4],[52,-26],[58,-34]],'#d45d58',1);stroke(c,[[40,3],[44,26],[50,30]],'#d06157',1);}
 if(kind==='ribbon')fin(c,[[-52,-2],[-20,-8],[40,-9],[46,-4]],'#aebcc990',[-10,-3]);
 c.save();c.clip(p);for(let i=-45;i<45;i+=4)stroke(c,[[i,-5],[i+1,6]],'#ffffff22',.45);if(kind==='loach')for(let i=0;i<16;i++)oval(c,-40+i*5,Math.sin(i*4)*3,2.5,1.5,'#4d4a3970');c.restore();eye(c,47,-1,2.1);if(kind==='loach')for(let i=0;i<3;i++)stroke(c,[[52,1],[57+i*3,7+i*2]],'#68694d',.7);return true;
 }
 if(kind==='octopus'){for(let i=0;i<8;i++){c.beginPath();c.moveTo(-5+i*3,8);c.bezierCurveTo(-20+i*5,23,-28+i*9,37,-38+i*11,23);c.strokeStyle=v.fin;c.lineWidth=4.8;c.lineCap='round';c.stroke();for(let j=0;j<4;j++)oval(c,-12+i*5-j,15+j*3,.9,.9,'#edc6a5');}oval(c,2,-5,15,22,g);for(let i=0;i<23;i++)oval(c,Math.sin(i*6)*11,-5+Math.cos(i*3)*16,.6,.6,'#5e38293d');eye(c,10,3,2.5);return true;}
 if(kind==='squid'){poly(c,[[-47,-2],[9,-23],[38,-7],[15,19]],'#b99e7899');poly(c,[[-48,-2],[12,-13],[42,0],[14,12]],g);for(let i=0;i<10;i++)stroke(c,[[33,(i-5)*1.2],[47+i%3*2,(i-5)*2],[60+i%4*2,(i-5)*1.8]],v.fin,1.8);for(let i=0;i<35;i++)oval(c,-35+(i*9.31)%67,Math.sin(i*2.1)*6,.7,.5,'#76513988');eye(c,32,0,3.5);return true;}
 if(kind==='crab'){for(let side of [-1,1]){for(let i=0;i<4;i++)stroke(c,[[side*11,i*4-6],[side*(29+i),i*6-10],[side*(35-i),i*8-3]],v.fin,2.2);stroke(c,[[side*12,-4],[side*23,-17],[side*31,-15]],v.fin,4);oval(c,side*31,-17,7,5,g);stroke(c,[[side*32,-17],[side*35,-21]],'#713f2c',1);}oval(c,0,0,19,13,g);stroke(c,[[-10,-9],[-7,-15]],v.back,2);stroke(c,[[10,-9],[7,-15]],v.back,2);eye(c,-7,-14,1.4);eye(c,7,-14,1.4);for(let i=0;i<20;i++)oval(c,Math.sin(i*3)*15,Math.cos(i*5)*8,.6,.6,'#efb49466');return true;}
 if(kind==='shrimp'){for(let i=0;i<9;i++){oval(c,-35+i*7,Math.sin(i*.25)*6,6,5,gradient(c,0,-7,0,9,[v.back,v.belly]));stroke(c,[[-35+i*7,4],[-38+i*7,15],[-33+i*7,19]],v.fin,.7);}poly(c,[[-42,0],[-55,-8],[-49,0],[-55,10]],'#a9b597');for(let i=0;i<3;i++)stroke(c,[[25,-2],[45+i*3,-10+i*8],[62,-18+i*16]],v.fin,.6);stroke(c,[[17,4],[36,20],[50,21]],v.back,1);eye(c,25,-5,2);return true;}
 return false;
}
function eye(c,x,y,r){oval(c,x,y,r+1,r+1,'#473d25');oval(c,x,y,r,r,'#c7b57a');oval(c,x+.35,y,r*.65,r*.72,'#14272b');oval(c,x+r*.2,y-r*.3,r*.25,r*.25,'#f7ffff');}
function renderBody(c,f){const v=f.visual,h=42*v.height,k=v.family;if(specialBody(c,f))return;
 const dorsal=['carp','mahi','rockfish','bass','goby','sculpin'].includes(k)?[[-26,-h*.45],[-22,-h*1.28],[-14,-h*1.5],[-2,-h*1.35],[20,-h*.8]]:[[-17,-h*.7],[-9,-h*1.65],[4,-h*.9],[13,-h*.8]];
 if(k==='hammerhead')fin(c,[[-16,-9],[-8,-36],[5,-12]],v.fin,[-7,-10]);
 else if(k==='sunfish'){fin(c,[[-1,-26],[7,-53],[17,-25]],v.fin,[8,-24]);fin(c,[[0,24],[4,53],[17,24]],v.fin,[9,22]);}
 else fin(c,dorsal,v.fin,[-2,-h*.5]);
 if(k==='flatfish'){fin(c,[[-37,-6],[-17,-h*1.38],[18,-h*1.28],[38,-12]],v.fin,[0,-5]);fin(c,[[-37,4],[-14,h*1.15],[18,h*1.2],[40,8]],v.fin,[0,4]);}
 else fin(c,[[-16,h*.4],[-9,h*1.52],[4,h*.74]],v.fin,[-8,h*.3]);
 const g=gradient(c,0,-h,0,h*1.15,[v.back,v.side,v.belly]);bodyPath(c,v);c.fillStyle=g;c.fill();
 c.save();bodyPath(c,v);c.clip();
 if(['carp','bream','minnow','bass','bluegill','trout','salmon','silver','seabass'].includes(k))for(let row=-4;row<5;row++)for(let col=-8;col<9;col++){c.beginPath();c.arc(col*5+(row%2)*2.5,row*4,2.7,-1.1,1.1);c.strokeStyle=row<0?'#e6efe725':'#28393622';c.lineWidth=.4;c.stroke();}
 if(['spots','lightspots','rainbow','parr','mottle'].includes(v.pattern)){for(let i=0;i<85;i++){const x=-36+((i*43.7+f.id*7.1)%72),y=-h+((i*19.3)% (h*1.75));const r=v.pattern==='mottle'?1.3+(i%4)*.8:.7+i%3*.3;oval(c,x,y,r,r*.7,v.pattern==='lightspots'?'#efdbae':'#263c3670');}}
 if(v.pattern==='rainbow'){c.fillStyle=gradient(c,0,-4,0,7,['#dca4b000','#cd8597a0','#dca4b000']);c.fillRect(-43,-4,90,11);}
 if(v.pattern==='parr')for(let i=-30;i<20;i+=9)oval(c,i,0,3.2,h*.55,'#415b6760');
 if(v.pattern==='bars')for(let i=-28;i<22;i+=9){c.fillStyle='#334d4060';c.fillRect(i,-h,3,h*1.8);}
 if(v.pattern==='stripe')stroke(c,[[-41,0],[-20,1],[14,1],[35,-1]],'#314c3190',3);
 if(v.pattern==='yellowline')stroke(c,[[-42,-1],[-15,0],[18,-1],[40,-2]],'#d9c660b0',2.5);
 if(v.pattern==='bellylines')for(let i=0;i<5;i++)stroke(c,[[-33,4+i*2],[29,5+i]],'#314e6577',1);
 if(v.pattern==='waves')for(let i=-35;i<25;i+=5){c.beginPath();c.moveTo(i,-h);c.bezierCurveTo(i-5,-h*.7,i+6,-h*.3,i-1,-2);c.strokeStyle='#163c5f';c.lineWidth=1.3;c.stroke();}
 if(v.pattern==='koi'){for(let i=0;i<6;i++)oval(c,-25+i*10,Math.sin(i*6)*h*.5,7+i%2*3,6+i%3*2,i%3===0?'#262c2c':'#cd5035');}
 if(v.pattern==='armor')for(let i=-35;i<30;i+=8)poly(c,[[i,-4],[i+4,-10],[i+7,-4],[i+3,0]],'#ced2ba','#344f4b');
 // A narrow specular band gives scales the sheen seen in reference photographs.
 c.fillStyle=gradient(c,0,-h*.5,0,h*.3,['#ffffff00','#ffffff45','#ffffff00']);c.fillRect(-44,-h*.5,90,h*.8);
 c.restore();
 if(k==='tuna'||k==='mackerel')for(let i=0;i<5;i++){poly(c,[[-20-i*4,-6+i*.5],[-22-i*4,-12+i*.9],[-24-i*4,-5+i*.5]],'#c6b74c');poly(c,[[-20-i*4,6-i*.5],[-22-i*4,12-i*.9],[-24-i*4,5-i*.5]],'#c6b74c');}
 if(k==='puffer')for(let i=0;i<24;i++){const a=i/24*Math.PI*2;stroke(c,[[Math.cos(a)*33,Math.sin(a)*h*.9],[Math.cos(a)*38,Math.sin(a)*h*1.15]],'#8c7953',.65);}
 if(k==='catfish')for(let i=0;i<3;i++)stroke(c,[[46,3],[57+i*2,10+i*5],[62+i*2,8+i*5]],'#6c7350',.8);
 if(['コイ','ニシキゴイ'].includes(f.name))for(let i=0;i<2;i++)stroke(c,[[46,3],[52+i*2,8+i*4],[51+i*3,11+i*3]],'#8c8557',.6);
 if(k==='sturgeon')for(let i=0;i<4;i++)stroke(c,[[36+i*3,3],[35+i*3,8]],'#848f79',.7);
 if(k==='bass')stroke(c,[[27,3],[40,7],[47,1]],'#34473490',.85);
 if(k==='hammerhead'){oval(c,43,-1,10,7,v.side);eye(c,49,-5,2);eye(c,49,4,1.4);}else if(k==='flatfish'){eye(c,35,-7,2.1);eye(c,40,-2,1.8);}else eye(c,36,-h*.25,k==='minnow'?3.1:2.4);
 if(k!=='flatfish'){c.beginPath();c.moveTo(26,-h*.55);c.quadraticCurveTo(19,1,27,h*.6);c.strokeStyle='#273d3855';c.lineWidth=.7;c.stroke();}
 stroke(c,[[43,3],[47,2]],'#354d4766',.7);
 if(!['flatfish','sunfish'].includes(k))fin(c,[[23,3],[7,h*.95],[14,2]],v.fin+'bb',[23,3]);
 if(k==='bluegill')oval(c,25,-2,3,4,'#20373d');
}
function sprite(f,silhouette){const key=f.id+(silhouette?'s':'c');if(cache.has(key))return cache.get(key);const canvas=document.createElement('canvas');canvas.width=300;canvas.height=200;const c=canvas.getContext('2d');c.translate(150,100);c.scale(2,2);renderBody(c,f);if(silhouette){c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-in';c.fillStyle='#111111';c.fillRect(0,0,300,200);}cache.set(key,canvas);return canvas;}
export function drawFish(c,f,x,y,size=60,dir=1,t=0,silhouette=false){c.save();c.translate(x,y);c.scale(dir*size/100,size/100);const v=f.visual,k=v.family;
 if(!['eel','loach','ribbon','oarfish','octopus','squid','crab','shrimp','sunfish'].includes(k)){
 c.save();c.translate(-43,0);c.rotate(Math.sin(t*4+f.id)*.13);const tail=['hammerhead','sturgeon'].includes(k)?[[-1,0],[-22,-23],[-15,-1],[-17,13]]:[[-1,0],[-22,-16],[-16,0],[-22,16]];if(silhouette)poly(c,tail,'#111111');else fin(c,tail,v.fin,[-1,0]);c.restore();
 }
 if(k==='sunfish'){const tail=[[-24,-20],[-34,-16],[-32,20],[-22,24]];if(silhouette)poly(c,tail,'#111111');else fin(c,tail,v.fin,[-25,0]);}
 if(['eel','loach','ribbon','oarfish'].includes(k)){c.save();c.translate(-52,0);c.rotate(Math.sin(t*3+f.id)*.2);poly(c,[[0,0],[-18,-3],[-13,2],[-18,5]],silhouette?'#111111':v.fin);c.restore();}
 c.drawImage(sprite(f,silhouette),-75,-50,150,100);c.restore();}

// Decoration geometry stays monochrome; depth comes from material grain and light.
function rock(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);const g=gradient(c,-20,-35,25,0,['#cacaca','#9a9a9a','#666666']);poly(c,[[-36,-1],[-29,-24],[-10,-39],[12,-34],[32,-17],[37,0]],g);poly(c,[[-29,-24],[-10,-39],[12,-34],[4,-15]],'#bcbcbc');for(let i=0;i<38;i++)oval(c,-26+(i*17.13)%53,-27+(i*7.33)%24,.6,.6,i%2?'#eeeeee50':'#44444450');c.restore();}
function leaves(c,x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);for(let i=0;i<8;i++){const sway=Math.sin(t*.8+i)*4,xx=(i-3.5)*7,tip=-45-i%3*22;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(xx-13,-27,xx-13+sway,tip,xx+sway,tip-10);c.bezierCurveTo(xx+8+sway,tip+4,xx+11,-22,0,0);c.fillStyle=gradient(c,-20,-80,20,0,['#aaaaaa','#777777','#444444']);c.fill();stroke(c,[[0,0],[xx,-30],[xx+sway,tip-8]],'#c5c5c570',.55);}c.restore();}
function pillar(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);rect(c,-13,-7,26,7,2,'#898989');rect(c,-9,-76,18,69,2,gradient(c,-9,0,9,0,['#777777','#d0d0d0','#8a8a8a']));rect(c,-13,-82,26,8,1,'#bcbcbc');for(let i=-6;i<8;i+=4)stroke(c,[[i,-72],[i,-12]],'#69696950',.6);for(let i=0;i<4;i++)stroke(c,[[-7,-22-i*13],[-1,-26-i*13],[1,-33-i*13]],'#64646480',.6);c.restore();}
function palace(c){for(let i=-2;i<=2;i++)pillar(c,i*25,-2,1);poly(c,[[-75,-90],[0,-120],[75,-90]],gradient(c,0,-120,0,-85,['#e8e8e8','#9b9b9b']));rect(c,-72,-88,144,9,1,'#bebebe');rect(c,-75,-2,150,9,1,'#8e8e8e');rect(c,-83,7,166,7,1,'#ababab');for(let i=0;i<4;i++)stroke(c,[[-55+i*29,-90],[-20+i*10,-110]],'#ffffff60',.7);}
export function drawDecor(c,type,x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);oval(c,0,2,type==='atlantis'?80:40,5,'#00000019');
 switch(type){
 case 'plant':case 'fern':leaves(c,0,0,type==='fern'?1.15:.8,t);if(type==='fern'){leaves(c,-25,0,.75,t+1);leaves(c,25,0,.7,t+2);}break;
 case 'rock':rock(c,-5,0);rock(c,30,0,.55);break;
 case 'moss':rock(c,0,0);for(let i=0;i<40;i++){const xx=-20+(i*13.37)%43,yy=-24+(i*8.91)%20;oval(c,xx,yy,2.3,1.5,i%3?'#666666':'#959595');}break;
 case 'pebbles':for(let i=0;i<12;i++){const xx=-38+(i*13.2)%78,yy=-2-(i*8.7)%12;oval(c,xx,yy,4+i%4,2+i%3,gradient(c,xx,yy-5,xx+2,yy+3,['#dddddd','#898989']));}break;
 case 'shells':for(let i=0;i<5;i++){c.save();c.translate(-27+i*14,-(i%2)*5);c.rotate(i*.55);poly(c,[[0,0],[-10,-8],[-7,-15],[0,-19],[8,-15],[11,-7]],gradient(c,0,-20,0,0,['#efefef','#a9a9a9']));for(let j=-7;j<8;j+=3)stroke(c,[[0,0],[j,-15]],'#8e8e8e80',.5);c.restore();}break;
 case 'driftwood':c.save();c.rotate(-.13);stroke(c,[[-50,-4],[-13,-14],[12,-31],[45,-34]],'#4f4f4f',14);stroke(c,[[-12,-15],[-28,-47],[-27,-61]],'#626262',7);stroke(c,[[4,-27],[22,-53],[39,-59]],'#666666',6);for(let i=0;i<6;i++)stroke(c,[[-47,-8+i*.9],[-12,-18+i*.9],[14,-35+i],[43,-38+i]],i%2?'#8b8b8b':'#393939',.7);c.restore();break;
 case 'cave':rock(c,-20,0,1.1);rock(c,25,0,1.3);oval(c,2,-12,19,22,'#444444');rock(c,2,-34,.95);poly(c,[[-16,0],[-14,-22],[0,-29],[14,-24],[19,0]],gradient(c,0,-30,0,0,['#303030','#646464']));break;
 case 'ruins':pillar(c,-19,0);c.save();c.translate(22,0);c.rotate(-.36);pillar(c,0,0,.7);c.restore();rock(c,25,0,.3);break;
 case 'castle':for(const side of [-1,1]){rect(c,side*24-9,-70,18,70,1,gradient(c,side*24-9,0,side*24+9,0,['#818181','#c8c8c8','#8e8e8e']));poly(c,[[side*24-13,-70],[side*24,-92],[side*24+13,-70]],'#737373');}rect(c,-25,-48,50,48,2,'#afafaf');rect(c,-10,-28,20,28,10,'#595959');for(let yy=-43;yy<-5;yy+=9)stroke(c,[[-23,yy],[23,yy]],'#888888',.6);for(let i=-17;i<20;i+=12)stroke(c,[[i,-43],[i,-8]],'#dadada60',.6);break;
 case 'shipwreck':c.save();c.rotate(-.09);poly(c,[[-65,-8],[-48,5],[44,5],[68,-25],[52,-18],[-60,-22]],gradient(c,0,-25,0,8,['#a5a5a5','#525252']));for(let i=-58;i<60;i+=8)stroke(c,[[i,-18],[i+6,3]],'#33333370',.7);stroke(c,[[-6,-12],[-6,-95]],'#707070',3);stroke(c,[[-35,-60],[25,-60]],'#717171',2);poly(c,[[-6,-89],[25,-65],[13,-33],[-6,-45]],'#c6c6c6');for(let i=-45;i<40;i+=15)oval(c,i,-9,3,3,'#313131');stroke(c,[[-6,-88],[-52,-17]],'#888888',.5);stroke(c,[[-6,-88],[52,-15]],'#888888',.5);c.restore();break;
 case 'atlantis':palace(c);rock(c,-72,10,.4);rock(c,77,12,.3);for(let i=0;i<10;i++){const xx=Math.sin(i*21+t*.2)*60,yy=-((t*8+i*19)%135);oval(c,xx,yy,.9,.9,'#fafafa90');}break;
 case 'bubbles':rect(c,-22,-9,44,9,3,gradient(c,0,-9,0,0,['#9e9e9e','#4d4d4d']));for(let i=0;i<12;i++){const yy=-((t*25+i*23)%240);c.beginPath();c.arc(Math.sin(i+t)*12,yy,2+i%4,0,Math.PI*2);c.strokeStyle='#ffffffa0';c.lineWidth=.7;c.stroke();}break;
 }c.restore();}
