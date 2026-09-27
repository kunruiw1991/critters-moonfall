export const W=22,H=18,CENTER={x:11,y:9};
export const TYPES={
 sun:{name:'DogDay',icon:'☀️',portrait:'critter_05_dogday',role:'⚔️',wood:45,star:15,hp:140,range:4.3,damage:15,period:1.1,color:'#f4bc64'},
 rapid:{name:'KickinChicken',icon:'🏹',portrait:'critter_10_kickin',role:'⚔️',wood:60,star:10,hp:105,range:4.2,damage:7,period:.28,color:'#ffe597'},
 prism:{name:'CraftyCorn',icon:'💎',portrait:'critter_08_craftycorn',role:'⚔️',wood:70,star:35,hp:115,range:4.3,damage:18,period:1.6,splash:1.5,slow:.5,pierce:true,color:'#bca6f9'},
 wall:{name:'Mikey',icon:'🧱',portrait:'mikey',role:'🛡️',wood:18,star:0,hp:320,color:'#8bc98b'},
 spring:{name:'Hoppy',icon:'🌀',portrait:'critter_07_hoppy',role:'⚔️',wood:35,star:10,hp:100,range:1.8,damage:28,period:2.6,splash:1.8,color:'#8fddbc'},
 heal:{name:'Bobby BearHug',icon:'💗',portrait:'critter_06_bobby',role:'💗',wood:50,star:20,hp:115,range:3.5,heal:6,color:'#efa7bc'},
 mill:{name:'Bubba',icon:'🪵',portrait:'critter_09_bubba',role:'⚙️',wood:55,star:0,hp:110,produceWood:1.1,color:'#9ebfe9'},
 garden:{name:'PickyPiggy',icon:'🌱',portrait:'critter_11_picky',role:'⚙️',wood:35,star:15,hp:95,produceStar:.45,color:'#edb8bb'},
 boost:{name:'JJ',icon:'⚡',portrait:'jj',role:'⚡',wood:50,star:25,hp:130,range:3.6,boost:1.25,color:'#c6e299'},
 shield:{name:'Luna Bat',icon:'🛡️',portrait:'critter_01_lunabat',role:'🛡️',wood:60,star:30,hp:160,range:3.3,shield:.65,color:'#ab9ddb'}
};
const key=(x,y)=>y*W+x;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
export function random(g){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
export function createGame({seed=731,creative=false}={}){
 const g={version:1,seed,creative,time:0,wood:170,star:50,core:700,maxCore:700,moon:0,wave:0,cleared:0,waveActive:false,remaining:0,spawnClock:0,breakTime:30,units:[],enemies:[],trees:[],effects:[],nextId:1,sunCooldown:0,over:null,kills:0,totalBuilt:0};
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(distance({x,y},CENTER)>5.5&&random(g)<.17)g.trees.push({x,y,hp:2});
 g.units.push(makeUnit(g,'sun',9,9),makeUnit(g,'mill',12,10));return g;
}
function makeUnit(g,type,x,y){return{id:g.nextId++,type,x,y,level:1,hp:TYPES[type].hp,maxHp:TYPES[type].hp,cool:0}}
export function unitAt(g,x,y){return g.units.find(u=>u.x===x&&u.y===y)}
export function canBuild(g,type,x,y){return !g.over&&Boolean(TYPES[type])&&inside(x,y)&&x>0&&y>0&&x<W-1&&y<H-1&&distance({x,y},CENTER)>.8&&!unitAt(g,x,y)&&!g.trees.some(t=>t.x===x&&t.y===y)&&!g.enemies.some(e=>distance(e,{x,y})<.65)&&(g.creative||(g.wood>=TYPES[type].wood&&g.star>=TYPES[type].star))}
export function build(g,type,x,y){if(!canBuild(g,type,x,y))return false;const t=TYPES[type];if(!g.creative){g.wood-=t.wood;g.star-=t.star}const u=makeUnit(g,type,x,y);g.units.push(u);g.totalBuilt++;g.effects.push({kind:'build',x,y,life:.8});return u}
export function harvest(g,x,y){const i=g.trees.findIndex(t=>t.x===x&&t.y===y);if(i<0||g.over)return false;g.trees[i].hp--;g.wood=Math.min(999,g.wood+10);g.effects.push({kind:'wood',x,y,life:.7});if(g.trees[i].hp<=0)g.trees.splice(i,1);return true}
export function upgradeCost(u){return{wood:Math.ceil(TYPES[u.type].wood*.7*u.level),star:Math.max(8,Math.ceil(TYPES[u.type].star*.7*u.level))}}
export function upgrade(g,id){const u=g.units.find(u=>u.id===id);if(!u||u.level>=3||g.over)return false;const cost=upgradeCost(u);if(!g.creative&&(g.wood<cost.wood||g.star<cost.star))return false;if(!g.creative){g.wood-=cost.wood;g.star-=cost.star}u.level++;u.maxHp=Math.round(TYPES[u.type].hp*(1+.5*(u.level-1)));u.hp=u.maxHp;return true}
export function repair(g,id){const u=g.units.find(u=>u.id===id);if(!u||u.hp>=u.maxHp||g.over||(!g.creative&&g.wood<10))return false;if(!g.creative)g.wood-=10;u.hp=Math.min(u.maxHp,u.hp+u.maxHp*.5);return true}
export function sell(g,id){const i=g.units.findIndex(u=>u.id===id);if(i<0||g.over)return false;const u=g.units[i];g.wood=Math.min(999,g.wood+Math.floor(TYPES[u.type].wood*.5));g.units.splice(i,1);return true}
export const moonCost=g=>[40,60,80][g.moon]??0;
export function restoreMoon(g){if(g.over||g.moon>=3||(!g.creative&&g.star<moonCost(g)))return false;if(!g.creative)g.star-=moonCost(g);g.moon++;g.core=Math.min(g.maxCore,g.core+100);checkWin(g);return true}
function checkWin(g){if(!g.creative&&g.cleared>=6&&g.moon===3&&g.core>0)g.over='win'}
export function startWave(g){if(g.over||g.waveActive||(!g.creative&&g.wave>=6))return false;g.wave++;g.waveActive=true;g.remaining=5+g.wave*3;g.spawnClock=.1;g.breakTime=0;return true}
export function sunburst(g){if(g.over||g.sunCooldown>0)return false;g.sunCooldown=30;g.effects.push({kind:'sun',...CENTER,life:1});for(const e of g.enemies)if(distance(e,CENTER)<6)e.hp-=65;g.core=Math.min(g.maxCore,g.core+25);return true}
function spawn(g){const wave=g.wave,n=g.remaining;let kind=n===1&&wave%6===0?'boss':wave>=3&&n%5===0?'brute':wave>=2&&n%3===0?'runner':'zombie';const edge=wave<=2?0:Math.floor(random(g)*4);let x,y;if(edge===0){x=0;y=3+Math.floor(random(g)*(H-6))}else if(edge===1){x=W-1;y=3+Math.floor(random(g)*(H-6))}else if(edge===2){x=3+Math.floor(random(g)*(W-6));y=0}else{x=3+Math.floor(random(g)*(W-6));y=H-1}
 const hp=(30+wave*6)*(kind==='boss'?20:kind==='brute'?3.6:kind==='runner'?.7:1);
 g.enemies.push({id:g.nextId++,kind,x,y,hp,maxHp:hp,speed:kind==='runner'?1.12:kind==='boss'?.38:.63,damage:kind==='boss'?34:kind==='brute'?14:7,armor:kind==='boss'?.75:kind==='brute'?.8:0,cool:0,slowTime:0,path:[],repath:0});}
// Weighted shortest path: walls divert the horde but can always be broken.
function findPath(g,e){const sx=Math.round(e.x),sy=Math.round(e.y),start=key(sx,sy),goal=key(CENTER.x,CENTER.y),dist=new Float64Array(W*H).fill(Infinity),prev=new Int32Array(W*H).fill(-1),visited=new Uint8Array(W*H);dist[start]=0;
 const structures=new Map(g.units.map(u=>[key(u.x,u.y),u]));const trees=new Set(g.trees.map(t=>key(t.x,t.y)));
 for(let n=0;n<W*H;n++){let best=-1,min=Infinity;for(let i=0;i<dist.length;i++)if(!visited[i]&&dist[i]<min){best=i;min=dist[i]}if(best<0||best===goal)break;visited[best]=1;const x=best%W,y=Math.floor(best/W);for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!inside(nx,ny))continue;const k=key(nx,ny),u=structures.get(k),cost=1+(u?Math.min(8,u.hp/(e.damage*4)):0)+(trees.has(k)?.7:0);if(dist[k]>min+cost){dist[k]=min+cost;prev[k]=best}}}
 const path=[];let k=goal;for(let n=0;n<W*H&&k!==start&&k!==-1;n++){path.push({x:k%W,y:Math.floor(k/W)});k=prev[k]}return k===start?path.reverse():[];}
function damage(g,u,amount){const p=u||CENTER;const sheltered=g.units.some(s=>TYPES[s.type].shield&&distance(s,p)<=TYPES[s.type].range);const value=amount*(sheltered?.65:1);if(u)u.hp-=value;else if(!g.creative)g.core-=value}
export function update(g,dt){if(g.over)return;dt=Math.min(.25,Math.max(0,dt));g.time+=dt;g.sunCooldown=Math.max(0,g.sunCooldown-dt);g.wood=Math.min(999,g.wood+.22*dt);g.star=Math.min(999,g.star+.1*dt);
 g.effects=g.effects.filter(f=>(f.life-=dt)>0);
 for(const u of g.units){const t=TYPES[u.type],mult=1+.5*(u.level-1);g.wood=Math.min(999,g.wood+(t.produceWood||0)*mult*dt);g.star=Math.min(999,g.star+(t.produceStar||0)*mult*dt);u.cool-=dt;
  if(t.heal){for(const a of g.units)if(distance(a,u)<=t.range)a.hp=Math.min(a.maxHp,a.hp+t.heal*mult*dt);if(distance(u,CENTER)<=t.range)g.core=Math.min(g.maxCore,g.core+t.heal*.3*mult*dt)}
  if(t.damage&&u.cool<=0){const targets=g.enemies.filter(e=>e.hp>0&&distance(e,u)<=t.range);if(targets.length){const target=targets.reduce((a,b)=>distance(a,CENTER)<distance(b,CENTER)?a:b);u.cool=t.period;const boosted=g.units.some(b=>TYPES[b.type].boost&&distance(b,u)<=TYPES[b.type].range);const amount=t.damage*mult*(boosted?1.25:1);for(const e of g.enemies)if(e===target||(t.splash&&distance(e,target)<=t.splash)){e.hp-=amount*(t.pierce?1:1-e.armor);if(t.slow)e.slowTime=2}g.effects.push({kind:'shot',x:u.x,y:u.y,tx:target.x,ty:target.y,color:t.color,life:.18})}}
 }
 if(g.waveActive){g.spawnClock-=dt;if(g.remaining>0&&g.spawnClock<=0){spawn(g);g.remaining--;g.spawnClock=1.65}if(g.remaining===0&&g.enemies.length===0){g.waveActive=false;g.cleared=g.wave;g.breakTime=25;g.wood=Math.min(999,g.wood+25);g.star=Math.min(999,g.star+15);g.core=Math.min(g.maxCore,g.core+35);g.effects.push({kind:'clear',...CENTER,life:2});checkWin(g)}}else if(!g.creative&&g.wave<6){g.breakTime-=dt;if(g.breakTime<=0)startWave(g)}
 for(const e of g.enemies){if(e.hp<=0)continue;e.cool=Math.max(0,e.cool-dt);e.slowTime=Math.max(0,e.slowTime-dt);e.repath-=dt;if(distance(e,CENTER)<.7){if(e.cool<=0){damage(g,null,e.damage);e.cool=1}continue}
  if(e.repath<=0||!e.path.length){e.path=findPath(g,e);e.repath=2.5+random(g)}
  const next=e.path[0];if(!next)continue;const obstacle=unitAt(g,next.x,next.y);
  if(obstacle&&distance(e,obstacle)<1.15){if(e.cool<=0){damage(g,obstacle,e.damage);e.cool=1}continue}
  const d=distance(e,next),move=e.speed*(e.slowTime>0?.5:1)*dt;if(d<=move){e.x=next.x;e.y=next.y;e.path.shift()}else{e.x+=(next.x-e.x)/d*move;e.y+=(next.y-e.y)/d*move}
 }
 for(const e of g.enemies)if(e.hp<=0){g.kills++;g.wood=Math.min(999,g.wood+3);g.star=Math.min(999,g.star+(e.kind==='boss'?25:2));g.effects.push({kind:'poof',x:e.x,y:e.y,life:.5})}
 g.enemies=g.enemies.filter(e=>e.hp>0);g.units=g.units.filter(u=>u.hp>0);if(g.core<=0&&!g.creative){g.core=0;g.over='lose'}
}
export function save(g){return JSON.stringify({...g,effects:[]})}
export function load(raw){try{const g=JSON.parse(raw);if(g.version!==1||!Array.isArray(g.units)||!Array.isArray(g.enemies)||!Array.isArray(g.trees)||!Number.isFinite(g.core))return null;g.effects=[];return g}catch{return null}}
