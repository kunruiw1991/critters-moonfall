import {levelInfo,terrainAt,spawnGates} from './levels.mjs?v=13';
import {W,H,CENTER,TYPES,ENEMIES,canBuild,unitCells} from './engine.mjs?v=13';
import {catnap} from './intro.mjs?v=13';
import {TW,TH,iso as rotateIso,configureView,project,tileAt} from './camera.mjs?v=13';
export {configureView,project,tileAt} from './camera.mjs?v=13';
function ground(c,iso,x,y,color,sides=false){const corners=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([dx,dy])=>iso(x+dx,y+dy));if(sides)for(let i=0;i<4;i++){const a=corners[i],b=corners[(i+1)%4];c.fillStyle=i%2?'#24372f':'#2a3d36';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(b.x,b.y-15);c.lineTo(a.x,a.y-15);c.closePath();c.fill()}c.beginPath();corners.forEach((p,i)=>i?c.lineTo(p.x,p.y-15):c.moveTo(p.x,p.y-15));c.closePath();c.fillStyle=color;c.fill();c.strokeStyle='#172d2525';c.lineWidth=.7;c.stroke()}
function diamond(c,x,y,w,h,color){c.beginPath();c.moveTo(x,y-h/2);c.lineTo(x+w/2,y);c.lineTo(x,y+h/2);c.lineTo(x-w/2,y);c.closePath();c.fillStyle=color;c.fill()}
function block(c,x,y,z,width,height,colors){const w=TW*width,h=TH*width,base=y-z; c.fillStyle=colors[1];c.beginPath();c.moveTo(x-w/2,base);c.lineTo(x,base+h/2);c.lineTo(x,base+h/2-height);c.lineTo(x-w/2,base-height);c.fill();c.fillStyle=colors[2];c.beginPath();c.moveTo(x,base+h/2);c.lineTo(x+w/2,base);c.lineTo(x+w/2,base-height);c.lineTo(x,base+h/2-height);c.fill();diamond(c,x,base-height,w,h,colors[0]);}
function avatar(c,im,x,y,r=11){c.save();c.beginPath();c.arc(x,y,r+2,0,Math.PI*2);c.fillStyle='#f5e8b9';c.fill();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip();if(im?.complete&&im.naturalWidth)c.drawImage(im,x-r,y-r,r*2,r*2);c.restore()}
export function render(c,w,h,g,view,images,selectedType,selectedId,hover,time){
 const theme=levelInfo(g.level);const iso=(x,y)=>rotateIso(view,x,y);
 configureView(view,w,h);c.clearRect(0,0,w,h);const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,theme.sky[0]);sky.addColorStop(1,theme.sky[1]);c.fillStyle=sky;c.fillRect(0,0,w,h);for(let i=0;i<45;i++){c.fillStyle='#d3dfcf30';c.fillRect((i*197+29)%w,(i*87+17)%(h*.6),1.6,1.6)}
 c.save();c.translate(view.ox,view.oy);c.scale(view.scale,view.scale);
 const tiles=[];for(let x=0;x<W;x++)for(let y=0;y<H;y++)tiles.push({x,y,depth:iso(x,y).y});tiles.sort((a,b)=>a.depth-b.depth);for(const {x,y}of tiles){const p=iso(x,y),edge=x===0||y===0||x===W-1||y===H-1,noise=((x*31+y*67)%11)/11;const tile=terrainAt(g,x,y),color=tile==='water'?'#427ea1':tile==='lava'?'#d96d49':tile==='rock'?'#4a4653':tile==='bridge'?'#bb9d6c':tile==='ice'?'#61ddeb':tile==='burrow'?'#592b63':tile==='sand'?'#dda666':edge?theme.edge:noise>.65?theme.ground[0]:noise>.3?theme.ground[1]:theme.ground[2];ground(c,iso,x,y,color,edge);if(tile==='water'||tile==='lava'||tile==='ice'){c.strokeStyle=tile==='lava'?'#ffc288aa':'#d5f5ff66';c.lineWidth=2;c.beginPath();c.moveTo(p.x-8,p.y-17+Math.sin(time+x)*2);c.lineTo(p.x+8,p.y-17+Math.sin(time+x)*2);c.stroke()}if(tile==='ice'){c.strokeStyle='#f1fcff';c.lineWidth=2;c.beginPath();c.moveTo(p.x-7,p.y-17);c.lineTo(p.x,p.y-21);c.lineTo(p.x+7,p.y-17);c.stroke()}
 if(tile==='burrow'){const gate=spawnGates(g.level).findIndex(([a,b])=>a===x&&b===y),active=g.wave>2||gate<2;c.strokeStyle=active?'#ffbc82':'#946b9d';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y-15,20+Math.sin(time*3)*2,10,0,0,Math.PI*2);c.stroke();c.fillStyle=active?'#ffdcab':'#816487';for(let i=0;i<3;i++)c.fillRect(p.x-10+i*10,p.y-24-(time*15+i*13)%24,3,3)}
 if(!edge&&noise>.85){c.fillStyle='#a6af7550';c.fillRect(p.x-3,p.y-18,3,3)}}
 const selected=g.units.find(u=>u.id===selectedId),range=selected?TYPES[selected.type].range:selectedType?TYPES[selectedType].range:null,pos=selected||(hover&&selectedType?hover:null);
 if(pos&&range){const p=iso(pos.x,pos.y);c.fillStyle='#dce7c119';c.strokeStyle='#e8e9b677';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y-15,range*TW/Math.sqrt(2),range*TH/Math.sqrt(2),0,0,Math.PI*2);c.fill();c.stroke()}
 if(hover&&selectedType&&hover.x>0&&hover.y>0&&hover.x<W-1&&hover.y<H-1){const p=iso(hover.x,hover.y),valid=canBuild(g,selectedType,hover.x,hover.y);for(const cell of unitCells({type:selectedType,x:hover.x,y:hover.y}))ground(c,iso,cell.x,cell.y,valid?'#d8f7a480':'#ec9b9380')}
 const objects=[...tiles.filter(t=>terrainAt(g,t.x,t.y)==='rock').map(t=>({...t,kind:'rock'})),...g.trees.map(t=>({...t,kind:'tree'})),...g.units.map(u=>({...u,kind:'unit'})),...g.enemies.map(e=>({...e,enemyType:e.kind,kind:'enemy'})),{...CENTER,kind:'core'}].sort((a,b)=>iso(a.x,a.y).y-iso(b.x,b.y).y);
 for(const o of objects){const p=iso(o.x,o.y);p.y-=15;
 if(o.kind==='rock'){block(c,p.x,p.y,0,.86,22,['#8a8194','#5d556b','#4d485c']);continue}
 if(o.kind==='tree'){block(c,p.x,p.y,0,.17,28,['#97805a','#675b41','#594b37']);block(c,p.x,p.y,23,.8,18,['#72945d','#507248','#456640']);block(c,p.x,p.y,42,.55,16,['#86a365','#65874f','#547644']);continue}
 if(o.kind==='core'){block(c,p.x,p.y,0,1.3,24,['#a6b7b0','#637f80','#536d73']);block(c,p.x,p.y,24,.75,37,['#e0d0a6','#9d967a','#86806f']);for(const dx of[-22,22])block(c,p.x+dx,p.y,19,.23,40,['#d6d3b4','#8a9d91','#788b82']);c.save();c.shadowColor='#ffdc8c';c.shadowBlur=22;const yy=p.y-92+Math.sin(time*2)*3;c.fillStyle='#f5d78f';c.beginPath();c.moveTo(p.x-13,yy-11);c.lineTo(p.x+15,yy-7);c.lineTo(p.x+4,yy+15);c.lineTo(p.x-8,yy+5);c.closePath();c.fill();c.restore();c.fillStyle='#17282c';c.fillRect(p.x-27,p.y-112,54,5);c.fillStyle='#b6daa3';c.fillRect(p.x-27,p.y-112,54*g.core/g.maxCore,5);continue}
 if(o.kind==='unit'){for(const cell of unitCells(o)){const q=iso(cell.x,cell.y);block(c,q.x,q.y-15,0,.94,6,['#a5b4b1','#617778','#506566'])}const t=TYPES[o.type],uHeight=20+(o.level-1)*5;block(c,p.x,p.y,0,.82,10,['#899990','#566f68','#485e58']);
 switch(o.type){
 case 'wall':block(c,p.x,p.y,10,.9,28+(o.level-1)*10,['#a8b69c','#728772','#657b67']);for(let i=-1;i<=1;i++)block(c,p.x+i*14,p.y,38,.22,8,['#c3c9ac','#8c9b80','#778c74']);break;
 case 'mill':block(c,p.x,p.y,10,.65,26,['#b19b78','#817556','#706747']);block(c,p.x,p.y,36,.85,8,['#91aabd','#667c8b','#536c7c']);c.save();c.translate(p.x,p.y-43);c.rotate(time*1.7);c.strokeStyle='#e0cf9c';c.lineWidth=5;c.beginPath();c.moveTo(-19,0);c.lineTo(19,0);c.moveTo(0,-19);c.lineTo(0,19);c.stroke();c.restore();break;
 case 'kiln':block(c,p.x,p.y,10,.8,28,['#cf9876','#915d48','#714d43']);block(c,p.x+7,p.y,38,.22,22,['#d4a786','#956f5c','#725848']);c.fillStyle='#ffc075';c.fillRect(p.x-7,p.y-26,14,12);break;
 case 'garden':block(c,p.x,p.y,10,.75,8,['#77664d','#594e3e','#514438']);for(let i=-1;i<=1;i++){c.strokeStyle='#99be72';c.lineWidth=3;c.beginPath();c.moveTo(p.x+i*11,p.y-16);c.lineTo(p.x+i*11,p.y-32);c.stroke();for(let h=0;h<3;h++)diamond(c,p.x+i*11+(h%2?3:-3),p.y-29-h*4,7,4,'#f9d86c')}break;
 case 'heal':block(c,p.x,p.y,10,.65,uHeight,['#ddb8b5','#aa8490','#947583']);c.font='24px sans-serif';c.textAlign='center';c.fillStyle='#fff5db';c.fillText('♥',p.x,p.y-uHeight-16);break;
 case 'spring':block(c,p.x,p.y,10,.65,10,['#b1d9a8','#77a88a','#658f77']);c.strokeStyle='#d8eacc';c.lineWidth=4;c.beginPath();for(let i=0;i<5;i++){const xx=p.x+(i%2?-11:11),yy=p.y-23-i*4;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke();break;
 case 'prism':block(c,p.x,p.y,10,.5,22,['#acadc3','#7e84a0','#657388']);c.save();c.shadowColor=t.color;c.shadowBlur=13;diamond(c,p.x,p.y-53,22,35,t.color);c.restore();break;
 case 'boost':case 'shield':block(c,p.x,p.y,10,.55,26,['#b0c6bf','#738f8c','#617b7e']);c.strokeStyle=t.color;c.lineWidth=3;c.beginPath();c.arc(p.x,p.y-48,13,0,Math.PI*2);c.stroke();c.font='17px sans-serif';c.textAlign='center';c.fillStyle='#e9ead0';c.fillText(o.type==='boost'?'ϟ':'◇',p.x,p.y-42);break;
 default:block(c,p.x,p.y,10,.5,30,['#c9b891','#968663','#817350']);block(c,p.x,p.y,40,.75,9,[t.color,'#947c59','#7d674c']);c.fillStyle='#e6cf8f';c.fillRect(p.x-4,p.y-65,8,18);break;
 }
 avatar(c,images[t.portrait],p.x-20,p.y-10,9);if(o.hp<o.maxHp){c.fillStyle='#1a2c2f';c.fillRect(p.x-18,p.y-80,36,4);c.fillStyle='#abdaa3';c.fillRect(p.x-18,p.y-80,36*o.hp/o.maxHp,4)}if(o.id===selectedId){diamond(c,p.x,p.y+2,15,7,'#fff3af');c.fillStyle='#ffedab';c.font='12px sans-serif';c.textAlign='center';c.fillText('★'.repeat(o.level),p.x,p.y-84)}continue;
 }
 if(o.kind==='enemy'){if(o.ignited){c.strokeStyle='#ffae57';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y-2,22,11,0,0,Math.PI*2);c.stroke();for(let i=0;i<5;i++){const fx=p.x-18+i*9;c.fillStyle=i%2?'#ffe5a2':'#ff884c';c.beginPath();c.moveTo(fx-4,p.y);c.lineTo(fx+Math.sin(time*9+i)*3,p.y-13-(i%2)*9);c.lineTo(fx+4,p.y);c.fill()}}const enemyType=o.enemyType;const boss=enemyType==='boss',runner=enemyType==='runner',brute=enemyType==='brute';if(boss){catnap(c,p.x,p.y-26,.54,1,time);c.fillStyle='#182932';c.fillRect(p.x-30,p.y-100,60,5);c.fillStyle='#c7a3d8';c.fillRect(p.x-30,p.y-100,60*o.hp/o.maxHp,5)}else{const color=ENEMIES[enemyType]?.color||'#59c36a',width=brute?.48:enemyType==='bomber'?.42:.28;c.save();c.translate(p.x,p.y);const size=ENEMIES[enemyType]?.size||1;c.scale(size,size);heightZombie(c,0,0,time,o.id,color,width,enemyType);c.restore();if(o.fuse!=null){c.strokeStyle=Math.sin(time*18)>0?'#ffe0a0':'#f09b76';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y,1.9*TW/Math.sqrt(2),1.9*TH/Math.sqrt(2),0,0,Math.PI*2);c.stroke()}if(o.slowTime>0){c.strokeStyle='#c4b0f4';c.beginPath();c.ellipse(p.x,p.y,11,5,0,0,Math.PI*2);c.stroke()}}
 }
 }
 for(const f of g.effects){const p=iso(f.x,f.y);p.y-=15;c.globalAlpha=Math.min(1,f.life*3);if(f.kind==='shot'||f.kind==='spit'||f.kind==='mend'){const q=iso(f.tx,f.ty);c.strokeStyle=f.color||(f.kind==='mend'?'#edabc8':'#c8e576');c.lineWidth=2.5;c.beginPath();c.moveTo(p.x,p.y-51);c.lineTo(q.x,q.y-35);c.stroke()}else if(f.kind==='sun'){c.strokeStyle='#ffe29d';c.lineWidth=8;c.beginPath();c.ellipse(p.x,p.y,300*(1-f.life),150*(1-f.life),0,0,Math.PI*2);c.stroke()}else{c.font=f.kind==='clear'?'40px sans-serif':'22px sans-serif';c.fillStyle='#fff1c7';c.textAlign='center';c.fillText(f.kind==='output'?f.resource:f.kind==='wood'?'🪵':f.kind==='build'?'✦':f.kind==='clear'?'⭐':f.kind==='blast'?'💥':f.kind==='summon'?'🔮':'✧',p.x,p.y-40-(1-f.life)*15)}c.globalAlpha=1}
 c.restore();
}
function shade(hex,f){return '#'+hex.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*f).toString(16).padStart(2,'0')).join('')}
export function heightZombie(c,x,y,time,id,color,width,kind){
 c.save();c.translate(x,y);const walk=Math.sin(time*8+id)*4,colors=[color,shade(color,.73),shade(color,.56)];
 const oval=(x,y,rx,ry,fill)=>{c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
 const eyes=(x,y,gap=6)=>{for(const a of [-1,1]){oval(x+a*gap,y,4,5,'#fff7c8');oval(x+a*gap+1,y+1,2,3,'#22273b')}};
 // Separate meshes/silhouettes, not recolored versions of the same humanoid.
 if(kind==='runner'||kind==='mini'){
  for(const a of [-1,1]){block(c,a*13,walk*a,0,.12,18,colors);block(c,a*8+8,-3,0,.1,11,colors)}
  block(c,0,0,12,.49,12,colors);block(c,13,0,23,.31,15,colors);eyes(14,-32,5);c.fillStyle='#ffe4a0';c.beginPath();c.moveTo(-13,-20);c.lineTo(-31,-34);c.lineTo(-22,-10);c.fill();
 }else if(kind==='brute'){
  block(c,-8,0,0,.24,10,colors);block(c,8,walk*.3,0,.24,10,colors);block(c,0,0,10,.69,25,colors);
  for(const a of[-1,1]){block(c,a*21,walk*a*.3,8,.3,26,['#88aeff','#3e66ba','#2d4791']);block(c,a*22,0,5,.34,10,['#ced9ef','#91a4c7','#6c7f9d'])}
  block(c,0,0,37,.39,12,colors);block(c,0,0,49,.47,6,['#dce5f6','#8fa3ce','#6a81aa']);eyes(0,-46,6);c.fillStyle='#e4edf9';c.fillRect(-11,-28,22,5);
 }else if(kind==='spitter'){
  for(const a of[-1,1])oval(a*15,-3,9,5,shade(color,.55));oval(-3,-16,22,17,shade(color,.8));oval(-7,-23,15,13,color);
  block(c,17,0,15,.23,8,[color,shade(color,.8),shade(color,.6)]);oval(25,-18,7,8,'#294849');oval(26,-18,4,5,'#a3ed52');eyes(-4,-30,8);oval(-19,-19,5,6,'#eef995');
 }else if(kind==='bomber'){
  for(const a of[-1,1])block(c,a*10,walk*a*.4,0,.17,9,['#695a70','#473d55','#352d47']);oval(0,-24,21,23,'#d87132');oval(-3,-28,16,19,color);eyes(0,-30,7);
  c.strokeStyle='#513b4c';c.lineWidth=4;c.beginPath();c.moveTo(-18,-18);c.lineTo(18,-18);c.stroke();c.strokeStyle='#ffe8ad';c.lineWidth=3;c.beginPath();c.moveTo(2,-47);c.quadraticCurveTo(11,-61,17,-53);c.stroke();diamond(c,18,-54,9+Math.sin(time*16)*3,12,'#fff1a0');
 }else if(kind==='healer'){
  const bob=Math.sin(time*3+id)*3;c.translate(0,bob-7);oval(-18,-27,13,7,'#d7fff1');oval(18,-27,13,7,'#d7fff1');
  c.fillStyle=color;c.beginPath();c.moveTo(-14,-30);c.quadraticCurveTo(-21,-12,-13,0);c.lineTo(-5,-5);c.lineTo(3,1);c.lineTo(10,-5);c.lineTo(17,0);c.quadraticCurveTo(19,-15,14,-30);c.fill();oval(0,-33,17,16,color);eyes(0,-35);oval(-3,-7,5,5,'#fff2b5');
 }else if(kind==='summoner'){
  c.fillStyle='#7947c1';c.beginPath();c.moveTo(0,-45);c.lineTo(-22,0);c.quadraticCurveTo(0,8,22,0);c.closePath();c.fill();oval(0,-34,12,11,'#353455');eyes(0,-34,5);
  c.fillStyle=color;c.beginPath();c.moveTo(-22,-43);c.lineTo(-8,-52);c.lineTo(4,-75);c.lineTo(13,-48);c.lineTo(24,-41);c.closePath();c.fill();c.strokeStyle='#e3bc7e';c.lineWidth=4;c.beginPath();c.moveTo(25,0);c.lineTo(25,-53);c.stroke();diamond(c,25,-57,16,21,'#e9c1ff');
 }else{
  block(c,-6,0,0,.14,11,colors);block(c,6,walk,0,.14,11,colors);block(c,0,0,11,.35,20,colors);block(c,0,0,32,.4,15,colors);eyes(0,-42,6);
  block(c,-14,-2,18,.12,8,colors);block(c,14,-2,18,.12,8,colors);c.fillStyle='#304b53';c.fillRect(-9,-23,18,7);
 }
 c.restore();
}
