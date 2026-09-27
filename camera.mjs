export const TW=52,TH=26;
const CX=10.5,CY=8.5;
export function iso(view,x,y){const a=view.rotation||0,c=Math.cos(a),s=Math.sin(a),dx=x-CX,dy=y-CY,rx=dx*c-dy*s+CX,ry=dx*s+dy*c+CY;return{x:(rx-ry)*TW/2,y:(rx+ry)*TH/2}}
export function configureView(view,w,h){view.scale=Math.min(w/1110,h/655)*view.zoom;view.ox=w/2-52*view.scale+view.panX;view.oy=h/2-245*view.scale+view.panY}
export function project(view,x,y,z=0){const p=iso(view,x,y);return{x:p.x*view.scale+view.ox,y:(p.y-z)*view.scale+view.oy}}
export function worldAt(view,px,py){const x=(px-view.ox)/view.scale,y=(py-view.oy)/view.scale+15,rx=x/TW+y/TH-CX,ry=y/TH-x/TW-CY,a=view.rotation||0,c=Math.cos(a),s=Math.sin(a);return{x:rx*c+ry*s+CX,y:-rx*s+ry*c+CY}}
export function tileAt(view,px,py){const p=worldAt(view,px,py);return{x:Math.round(p.x)+0,y:Math.round(p.y)+0}}
export function createGestures(view,refresh,onTap){
 const pointers=new Map();let drag=null,pinch=null,blocked=false;
 const pair=()=>{const [a,b]=[...pointers.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.max(1,Math.hypot(b.x-a.x,b.y-a.y)),angle:Math.atan2(b.y-a.y,b.x-a.x)}};
 function rebase(){pinch=null;drag=null;if(pointers.size>=2){refresh();const p=pair();pinch={...p,zoom:view.zoom,rotation:view.rotation||0,anchor:worldAt(view,p.x,p.y)};blocked=true}else if(pointers.size===1){const p=[...pointers.values()][0];drag={...p,panX:view.panX,panY:view.panY,moved:blocked}}}
 return {down(id,p){if(!pointers.size)blocked=false;pointers.set(id,p);rebase()},move(id,p){if(!pointers.has(id))return;pointers.set(id,p);if(pinch&&pointers.size>=2){const q=pair(),delta=Math.atan2(Math.sin(q.angle-pinch.angle),Math.cos(q.angle-pinch.angle));view.rotation=pinch.rotation+delta;view.zoom=Math.max(.75,Math.min(2.5,pinch.zoom*q.distance/pinch.distance));refresh();const anchor=project(view,pinch.anchor.x,pinch.anchor.y,15);view.panX+=q.x-anchor.x;view.panY+=q.y-anchor.y;refresh()}else if(drag){const dx=p.x-drag.x,dy=p.y-drag.y;if(Math.hypot(dx,dy)>8)drag.moved=true;if(drag.moved){view.panX=drag.panX+dx;view.panY=drag.panY+dy;refresh()}}},up(id,p,cancel=false){if(!pointers.has(id))return;if(!cancel&&!blocked&&pointers.size===1&&drag&&!drag.moved)onTap(p);if(cancel)blocked=true;pointers.delete(id);rebase()},reset(){pointers.clear();drag=pinch=null;blocked=false}};
}
