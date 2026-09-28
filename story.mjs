export const PIECES=6;
export function readPieces(raw,unlocked=1){try{const a=JSON.parse(raw);if(Array.isArray(a))return [...new Set(a.filter(n=>Number.isInteger(n)&&n>=1&&n<=PIECES))].sort((a,b)=>a-b)}catch{}return Array.from({length:Math.min(PIECES,Math.max(0,unlocked-1))},(_,i)=>i+1)}
export function awardPiece(pieces,g){return !g.creative&&g.over==='win'&&g.level<=PIECES?[...new Set([...pieces,g.level])].sort((a,b)=>a-b):[...pieces]}
export function drawMoon(c,x,y,r,pieces,t=10,newPiece=0){
 c.save();c.translate(x,y);c.fillStyle='#26384c';c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();
 for(let i=0;i<PIECES;i++){const a=-Math.PI/2+i*Math.PI/3,b=a+Math.PI/3,owned=pieces.includes(i+1),p=i+1===newPiece?Math.max(0,1-t/2):0;c.save();c.translate(Math.cos((a+b)/2)*p*r*1.5,Math.sin((a+b)/2)*p*r*1.5);c.beginPath();c.moveTo(0,0);c.arc(0,0,r,a,b);c.closePath();c.fillStyle=owned?'#ffe8a6':'#26384c';c.fill();c.strokeStyle='#9f976b';c.lineWidth=1;c.stroke();c.restore()}
 c.restore();
}
export function drawStoryEnding(c,w,h,t,pieces,portraits,types,newPiece=0){
 c.clearRect(0,0,w,h);const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#0b142a');sky.addColorStop(1,'#243e49');c.fillStyle=sky;c.fillRect(0,0,w,h);
 for(let i=0;i<42;i++){c.fillStyle='#eee0ac';c.beginPath();c.arc((i*137+19)%w,(i*47+11)%(h*.6),i%3===0?1.7:1,0,7);c.fill()}
 const complete=pieces.length===PIECES;drawMoon(c,w/2,h*.25,Math.min(58,h*.19),pieces,t,newPiece);
 if(!complete){c.fillStyle='#ffedbc';c.font='24px system-ui';c.textAlign='center';c.fillText(`${pieces.length} / 6`,w/2,h*.58);return}
 c.fillStyle='#203e39';c.beginPath();c.ellipse(w/2,h*.91,w*.6,h*.27,0,0,7);c.fill();
 const cx=w/2,cy=h*.79;c.fillStyle='#9a6949';c.save();c.translate(cx,cy+13);for(const a of [-.4,.4]){c.save();c.rotate(a);c.fillRect(-29,-5,58,10);c.restore()}c.restore();
 const glow=c.createRadialGradient(cx,cy,3,cx,cy,85);glow.addColorStop(0,'#ffb45777');glow.addColorStop(1,'#ffb45700');c.fillStyle=glow;c.fillRect(cx-85,cy-85,170,170);
 for(let i=0;i<3;i++){const size=1-i*.23;c.fillStyle=['#f88744','#ffc765','#fff0a7'][i];c.beginPath();c.moveTo(cx-23*size,cy+8);c.quadraticCurveTo(cx-35*size,cy-10,cx+Math.sin(t*5)*8,cy-58*size);c.quadraticCurveTo(cx+8*size,cy-18,cx+23*size,cy+8);c.fill()}
 types.forEach((u,i)=>{const a=Math.PI*2*i/types.length,x=cx+Math.cos(a)*w*.34,y=cy+Math.sin(a)*h*.13,s=Math.min(47,w*.075),im=portraits[u.portrait];c.save();c.beginPath();c.arc(x,y,s/2,0,7);c.fillStyle='#dfcf99';c.fill();c.clip();if(im?.complete&&im.naturalWidth)c.drawImage(im,x-s/2,y-s/2,s,s);c.restore()});
}
