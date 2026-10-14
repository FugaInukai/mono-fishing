export const WATER={cx:.5,cy:.5,rx:.28,ry:.265};
export const BRIDGES=[.18,.82];
export function riverBanks(y){const bend=Math.sin(y*Math.PI*2)*.028;return {left:.335+bend,right:.665+bend};}
export function isBridge(p){return BRIDGES.some(y=>Math.abs(p.y-y)<=.045)&&p.x>=.285&&p.x<=.715;}
export function isWater(scene,p){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;if(scene===2){const b=riverBanks(p.y);return p.x>b.left&&p.x<b.right&&!isBridge(p);}return ((p.x-WATER.cx)/WATER.rx)**2+((p.y-WATER.cy)/WATER.ry)**2<1;}
export function isWalkable(scene,p){return !!p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=.045&&p.x<=.955&&p.y>=.085&&p.y<=.93&&!isWater(scene,p);}
export function spawn(scene,angle=1.2){return scene===2?{x:.26,y:.5}:{x:.5+Math.cos(angle)*.35,y:.5+Math.sin(angle)*.34};}
export function defaultTarget(scene,p){return scene===2?{x:.5,y:Math.max(.29,Math.min(.70,p?.y||.5))}:{x:.5+(p?.x-.5||0)*.4,y:.5+(p?.y-.5||0)*.4};}
export function movePosition(scene,p,dx,dy){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.006));let next={...p};for(let i=0;i<steps;i++){const both={x:next.x+dx/steps,y:next.y+dy/steps};if(isWalkable(scene,both))next=both;else{const x={x:next.x+dx/steps,y:next.y};if(isWalkable(scene,x))next=x;const y={x:next.x,y:next.y+dy/steps};if(isWalkable(scene,y))next=y;}}return next;}
