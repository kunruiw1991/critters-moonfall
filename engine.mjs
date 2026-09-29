import {tiers} from './palace.mjs?v=19';
import {levelInfo,makeTerrain,walkable,movementFactor,encounterKind,buildableTerrain,spawnGates,terrainAt} from './levels.mjs?v=19';
export const W=22,H=18,CENTER={x:11,y:9};
export const TYPES={
 sun:{name:'DogDay',icon:'☀️',portrait:'critter_05_dogday',role:'⚔️',wood:25,star:15,hp:140,range:4.3,damage:15,period:1.1,color:'#f4bc64'},
 rapid:{name:'KickinChicken',icon:'🏹',portrait:'critter_10_kickin',role:'⚔️',wood:15,star:24,hp:140,range:4.2,damage:7,period:.28,color:'#ffe597'},
 prism:{name:'CraftyCorn',icon:'💎',portrait:'critter_08_craftycorn',role:'⚔️',wood:10,star:25,hp:180,range:6.2,damage:28,period:1.6,splash:1.5,slow:.5,pierce:true,color:'#bca6f9'},
 wall:{name:'Mikey',icon:'🧱',portrait:'mikey',role:'🛡️',wood:10,star:0,hp:220,color:'#8bc98b'},
 spring:{name:'Hoppy',icon:'🌀',portrait:'critter_07_hoppy',role:'⚔️',wood:15,star:10,hp:100,range:1.8,damage:28,period:2.6,splash:1.8,color:'#8fddbc'},
 heal:{name:'Bobby BearHug',icon:'💗',portrait:'critter_06_bobby',role:'💗',wood:15,star:20,hp:115,range:3.4,heal:4,color:'#efa7bc'},
 mill:{name:'Bubba',icon:'🪵',portrait:'critter_09_bubba',role:'⚙️',wood:35,star:0,hp:110,produceWood:.65,color:'#9ebfe9'},
 garden:{name:'PickyPiggy',icon:'🌾',portrait:'critter_11_picky',role:'🌾↑',wood:25,star:0,hp:95,produceStraw:1.05,produceStar:0,color:'#edb8bb'},
 kiln:{name:'BabaChops',icon:'🧱',portrait:'critter_12_babachops',role:'🧱↑',wood:20,star:0,hp:100,produceBrick:.5,color:'#cc9672'},
 boost:{name:'JJ',icon:'⚡',portrait:'jj',role:'⚡',wood:10,star:25,hp:130,range:3.6,boost:1.25,color:'#c6e299'},
 shield:{name:'Luna Bat',icon:'🛡️',portrait:'critter_01_lunabat',role:'🛡️',wood:10,star:30,hp:160,range:3.3,shield:.65,color:'#ab9ddb'}
};
export const clampHeat=n=>Math.max(0,Math.min(10,Math.floor(Number(n)||0)));
export const heatFactor=g=>1+.2*clampHeat(g.heat);
export const MAX_UNIT_LEVEL=4;
export const FOOTPRINTS={prism:[[0,0],[1,0],[0,1],[1,1]],rapid:[[0,0],[1,0]],shield:[[0,0],[1,0],[0,1]]};
export const unitCells=u=>(u.cells||FOOTPRINTS[u.type]||[[0,0]]).map(([dx,dy])=>({x:u.x+dx,y:u.y+dy}));
export const distanceToUnit=(p,u)=>Math.min(...unitCells(u).map(c=>Math.hypot(p.x-c.x,p.y-c.y)));
export const unitCount=(g,type)=>g.units.filter(u=>u.type===type&&u.hp>0).length;
export const buildCost=(g,type)=>Object.fromEntries(MATERIALS.map(k=>[k,Math.max(0,Math.ceil((TYPES[type]?.[k]||0)*(1+.5*unitCount(g,type))*heatFactor(g)-1e-9))]));
export const buildReady=(g,type)=>!!TYPES[type]&&!g.over&&afford(g,buildCost(g,type));
export const MATERIALS=['wood','straw','brick','star','blueStar','goldStar'];
const recipes={sun:[15,0],rapid:[35,20],prism:[25,70],wall:[0,16],spring:[30,15],heal:[35,20],mill:[10,0],garden:[0,0],kiln:[25,5],boost:[30,35],shield:[20,55]};
for(const [type,t]of Object.entries(TYPES)){[t.straw,t.brick]=recipes[type];t.blueStar=['prism','shield'].includes(type)?2:type==='boost'?1:0;t.goldStar=type==='prism'?1:0}
export const afford=(g,c)=>g.creative||MATERIALS.every(k=>(g[k]||0)>=(c[k]||0));
function pay(g,c){if(!g.creative)for(const k of MATERIALS)g[k]=(g[k]||0)-(c[k]||0)}
export const repairCost={wood:10,straw:4,brick:3,star:0};
export const canRepair=(g,u)=>!!u&&u.hp<u.maxHp&&!g.over&&g.time>=(u.repairAt||0)&&g.time-(u.lastHit??-100)>=3&&afford(g,repairCost);
export const ENEMIES={
 zombie:{icon:'🧟',color:'#59c36a',size:1,hp:1,speed:.63,damage:7,armor:0},
 runner:{icon:'💨',color:'#f05655',size:.78,hp:.7,speed:1.12,damage:7,armor:0},
 brute:{icon:'🛡️',color:'#487bdf',size:1.75,hp:3.6,speed:.55,damage:14,armor:.8},
 spitter:{icon:'🫧',color:'#d5ed42',size:1.15,hp:.85,speed:.55,damage:8,armor:0},
 bomber:{icon:'💣',color:'#ff923f',size:1.3,hp:1.1,speed:.78,damage:10,armor:0},
 healer:{icon:'💚',color:'#46dfc4',size:1.05,hp:1.3,speed:.52,damage:5,armor:0},
 summoner:{icon:'🔮',color:'#b16eff',size:1.45,hp:1.5,speed:.48,damage:5,armor:0},
 mini:{icon:'🐾',color:'#f4d372',size:.55,hp:.35,speed:.95,damage:4,armor:0},
 boss:{icon:'🌘',color:'#9678ad',size:2.5,hp:20,speed:.38,damage:34,armor:.75}
};
export const enemyLoot=e=>{const base={zombie:[4,0,0],runner:[6,0,0],brute:[10,2,1],spitter:[8,1,0],bomber:[8,1,0],healer:[8,1,0],summoner:[10,2,1],mini:[0,0,0],boss:[30,4,3]}[e.kind]||[0,0,0];return{star:2*(base[0]+(e.ignited&&e.kind!=='mini'?1:0)),blueStar:base[1],goldStar:base[2]}};
export const enemyReward=e=>enemyLoot(e).star;
export const PREP_SECONDS=20,BREAK_SECONDS=12;
const perk=(g,key,step)=>1+(g.upgrades?.[key]||0)*step;
export function makeEnemy(g,kind,x,y){const t=ENEMIES[kind],d=levelNumber(g.level)-1,hp=(30+g.wave*6)*t.hp*(1+d*.08)*.6*heatFactor(g);return{id:g.nextId++,kind,x,y,hp,maxHp:hp,speed:t.speed*Math.min(1.35,1+d*.03),damage:t.damage*(1+d*.06)*.52*heatFactor(g),armor:t.armor,cool:0,slowTime:0,path:[],repath:0,summonClock:7,summons:0,fuse:null}}
export function enemyKind(wave,n){return n===1&&wave%6===0?'boss':wave>=5&&n===8?'summoner':wave>=4&&n%9===0?'healer':wave>=2&&n%7===0?'bomber':wave>=2&&n%6===0?'spitter':wave>=2&&n%5===0?'brute':wave>=1&&n%3===0?'runner':'zombie'}
const key=(x,y)=>y*W+x;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
export function random(g){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
export const levelNumber=n=>Number.isSafeInteger(n)&&n>0?n:1;
export function nextLevel(g){return g.over==='win'&&!g.creative?levelNumber(g.level)+1:null}
export function createGame({seed=731,creative=false,level=1,upgrades={},heat=0}={}){
 level=levelNumber(level);upgrades=tiers(upgrades);const bonus=upgrades.supplies;
 const g={version:1,terrainRevision:3,seed,creative,level,heat:clampHeat(heat),upgrades,time:0,wood:125+bonus*20,star:60+bonus*8,blueStar:0,goldStar:0,straw:50+bonus*15,brick:35+bonus*10,core:Math.round(700*(1+upgrades.armor*.12)),maxCore:Math.round(700*(1+upgrades.armor*.12)),moon:0,wave:0,cleared:0,waveActive:false,remaining:0,spawnClock:0,breakTime:PREP_SECONDS,units:[],enemies:[],trees:[],effects:[],terrain:makeTerrain(level),nextId:1,sunCooldown:0,over:null,kills:0,totalBuilt:0};
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(distance({x,y},CENTER)>5.5&&buildableTerrain(g,x,y)&&random(g)<levelInfo(level).tree)g.trees.push({x,y,hp:2});
 g.units.push(makeUnit(g,'sun',9,9));
 for(const [type,spots]of Object.entries({mill:[[10,8],[12,9],[10,10]],garden:[[11,8],[12,10],[10,9]],kiln:[[12,8],[11,10],[13,9]]}))for(const [x,y]of spots)g.units.push(makeUnit(g,type,x,y));
 return g;
}
function makeUnit(g,type,x,y){return{id:g.nextId++,type,x,y,level:1,paidCost:{},cells:(FOOTPRINTS[type]||[[0,0]]).map(p=>[...p]),hp:Math.round(TYPES[type].hp*perk(g,'armor',.12)),maxHp:Math.round(TYPES[type].hp*perk(g,'armor',.12)),cool:0}}
export function unitAt(g,x,y){return g.units.find(u=>u.hp>0&&unitCells(u).some(c=>c.x===x&&c.y===y))}
export function canBuild(g,type,x,y){return buildReady(g,type)&&unitCells({type,x,y}).every(c=>inside(c.x,c.y)&&buildableTerrain(g,c.x,c.y)&&c.x>0&&c.y>0&&c.x<W-1&&c.y<H-1&&distance(c,CENTER)>.8&&!unitAt(g,c.x,c.y)&&!g.trees.some(t=>t.x===c.x&&t.y===c.y)&&!g.enemies.some(e=>distance(e,c)<.65))}

export function build(g,type,x,y){if(!canBuild(g,type,x,y))return false;const cost=buildCost(g,type);pay(g,cost);const u=makeUnit(g,type,x,y);u.paidCost={...cost};g.units.push(u);g.totalBuilt++;g.effects.push({kind:'build',x,y,life:.8});return u}
export function harvest(g,x,y){const i=g.trees.findIndex(t=>t.x===x&&t.y===y);if(i<0||g.over)return false;g.trees[i].hp--;g.wood=Math.min(1e9,g.wood+4);g.effects.push({kind:'wood',x,y,life:.7});if(g.trees[i].hp<=0)g.trees.splice(i,1);return true}
export const UPGRADE_COST=Object.freeze({wood:25,straw:15,brick:15,star:20,blueStar:2,goldStar:1});
export const upgradeCost=()=>({...UPGRADE_COST});
export function upgrade(g,id){const u=g.units.find(u=>u.id===id);if(!u||u.level>=MAX_UNIT_LEVEL||g.over)return false;const cost=upgradeCost(u);if(!afford(g,cost))return false;pay(g,cost);const missing=u.maxHp-u.hp;u.level++;u.maxHp=Math.round(TYPES[u.type].hp*(1+.65*(u.level-1))*perk(g,'armor',.12));u.hp=u.maxHp-missing;return true}
export function repair(g,id){const u=g.units.find(u=>u.id===id);if(!canRepair(g,u))return false;pay(g,repairCost);u.hp=Math.min(u.maxHp,u.hp+u.maxHp*.15);u.repairAt=g.time+8;return true}
export function sell(g,id){const i=g.units.findIndex(u=>u.id===id);if(i<0||g.over)return false;const u=g.units[i];for(const k of MATERIALS)g[k]=Math.min(1e9,(g[k]||0)+Math.floor((u.paidCost?.[k]||0)*.5));g.units.splice(i,1);return true}
export const moonCost=g=>[40,60,80][g.moon]??0;
export function restoreMoon(g){if(g.over||g.moon>=3||(!g.creative&&g.star<moonCost(g)))return false;if(!g.creative)g.star-=moonCost(g);g.moon++;g.core=Math.min(g.maxCore,g.core+100);checkWin(g);return true}
function checkWin(g){if(!g.creative&&g.cleared>=6&&!g.waveActive&&g.remaining===0&&g.enemies.length===0&&g.core>0){g.moon=3;g.over='win'}}
export function finishCreative(g){if(!g.creative||g.over)return false;g.over='win';g.waveActive=false;g.remaining=0;g.enemies=[];g.moon=3;return true}
export function startWave(g){if(g.over||g.waveActive||(!g.creative&&g.wave>=6))return false;g.wave++;g.waveActive=true;g.remaining=5+g.wave*3+Math.min(12,(levelNumber(g.level)-1));g.spawnClock=.1;g.breakTime=0;return true}
export function sunburst(g){if(g.over||g.sunCooldown>0)return false;g.sunCooldown=30;g.effects.push({kind:'sun',...CENTER,life:1});for(const e of g.enemies)if(distance(e,CENTER)<6)e.hp-=65;g.core=Math.min(g.maxCore,g.core+25);return true}
function spawn(g){const wave=g.wave,n=g.remaining;const kind=encounterKind(g.level,wave,n,enemyKind(wave,n));const edge=wave<=2?0:Math.floor(random(g)*4);let x,y;if(edge===0){x=0;y=3+Math.floor(random(g)*(H-6))}else if(edge===1){x=W-1;y=3+Math.floor(random(g)*(H-6))}else if(edge===2){x=3+Math.floor(random(g)*(W-6));y=0}else{x=3+Math.floor(random(g)*(W-6));y=H-1}
 const gates=spawnGates(g.level);if(gates.length){const active=wave<=2?2:gates.length;[x,y]=gates[(n+wave)%active]}g.enemies.push(makeEnemy(g,kind,x,y));}
// Weighted shortest path: walls divert the horde but can always be broken.
function findPath(g,e){const sx=Math.round(e.x),sy=Math.round(e.y),start=key(sx,sy),goal=key(CENTER.x,CENTER.y),dist=new Float64Array(W*H).fill(Infinity),prev=new Int32Array(W*H).fill(-1),visited=new Uint8Array(W*H);dist[start]=0;
 const structures=new Map(g.units.flatMap(u=>unitCells(u).map(c=>[key(c.x,c.y),u])));const trees=new Set(g.trees.map(t=>key(t.x,t.y)));
 const heap=[];const push=(k,d)=>{let i=heap.length;heap.push([k,d]);while(i>0){const p=(i-1)>>1;if(heap[p][1]<=d)break;heap[i]=heap[p];i=p}heap[i]=[k,d]};const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1][1]<heap[c][1])c++;if(last[1]<=heap[c][1])break;heap[i]=heap[c];i=c}heap[i]=last}return first};push(start,0);
 while(heap.length){const [best,min]=pop();if(visited[best])continue;if(best===goal)break;visited[best]=1;const x=best%W,y=Math.floor(best/W);for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!inside(nx,ny)||!walkable(g,nx,ny))continue;const k=key(nx,ny),u=structures.get(k),cost=1+(u?Math.min(8,u.hp/(e.damage*4)):0)+(trees.has(k)?.7:0);if(dist[k]>min+cost){dist[k]=min+cost;prev[k]=best;push(k,dist[k])}}}
 const path=[];let k=goal;for(let n=0;n<W*H&&k!==start&&k!==-1;n++){path.push({x:k%W,y:Math.floor(k/W)});k=prev[k]}return k===start?path.reverse():[];}
function damage(g,u,amount){const p=u||CENTER;const sheltered=g.units.some(s=>TYPES[s.type].shield&&distance(s,p)<=TYPES[s.type].range);const value=amount*(sheltered?.65:1);if(u){u.hp-=value;u.lastHit=g.time;}else if(!g.creative)g.core-=value}
export function clearShot(g,a,b){const steps=Math.ceil(distance(a,b)*3);for(let i=1;i<steps;i++){const x=Math.round(a.x+(b.x-a.x)*i/steps),y=Math.round(a.y+(b.y-a.y)*i/steps);if(g.terrain?.[y*W+x]==='rock')return false}return true}
export function igniteEnemy(g,e){if(e.ignited||terrainAt(g,e.x,e.y)!=='lava')return false;e.ignited=true;e.maxHp*=1.3;e.hp*=1.3;e.damage*=1.25;e.speed*=1.15;g.effects.push({kind:'ignite',x:e.x,y:e.y,life:.8});return true}
export function update(g,dt){if(g.over)return;if(g.core<=0&&!g.creative){g.core=0;g.over='lose';return}dt=Math.min(.25,Math.max(0,dt));g.time+=dt;g.sunCooldown=Math.max(0,g.sunCooldown-dt);
 g.effects=g.effects.filter(f=>(f.life-=dt)>0);
 const repaired=new Set();
 for(const u of g.units){const t=TYPES[u.type],mult=1+.5*(u.level-1),production=(1+.15*(u.level-1))*perk(g,'harvest',.1);u.producing=false;g.wood=Math.min(1e9,g.wood+(t.produceWood||0)*production*dt);g.star=Math.min(1e9,g.star+(t.produceStar||0)*production*dt);u.cool-=dt;
  if(t.produceStraw)g.straw=Math.min(1e9,g.straw+t.produceStraw*production*dt);
  if(t.produceBrick){const amount=g.creative?t.produceBrick*production*dt:Math.min(t.produceBrick*production*dt,Math.max(0,g.wood-15)/.35,Math.max(0,g.straw-30)/.7);u.producing=amount>0;g.brick=Math.min(1e9,g.brick+amount);if(!g.creative){g.wood-=amount*.35;g.straw-=amount*.7}}
  if((t.produceWood||t.produceStraw||u.producing)&&g.time>=(u.outputAt||0)){u.outputAt=g.time+3;g.effects.push({kind:'output',resource:t.produceStraw?'🌾':t.produceBrick?'🧱':'🪵',x:u.x,y:u.y,life:1})}

  if(t.heal){const target=g.units.filter(a=>a.id!==u.id&&a.hp>0&&a.hp<a.maxHp&&!repaired.has(a.id)&&distanceToUnit(u,a)<=t.range).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(target){const amount=Math.min(t.heal*(1+.35*(u.level-1))*(g.time-(target.lastHit??-100)<3?.4:1)*dt,target.maxHp-target.hp,g.creative?Infinity:g.straw/.08,g.creative?Infinity:g.wood/.04);if(amount>0){target.hp+=amount;if(!g.creative){g.straw-=amount*.08;g.wood-=amount*.04;}repaired.add(target.id);if(g.time>=(u.healEffectAt||0)){u.healEffectAt=g.time+1;g.effects.push({kind:'mend',x:u.x,y:u.y,tx:target.x,ty:target.y,life:.35})}}}}
  if(t.damage&&u.cool<=0){const targets=g.enemies.filter(e=>e.hp>0&&distance(e,u)<=t.range&&(t.pierce||clearShot(g,u,e)));if(targets.length){const target=targets.reduce((a,b)=>distance(a,CENTER)<distance(b,CENTER)?a:b);u.cool=t.period;const boosted=g.units.some(b=>TYPES[b.type].boost&&distance(b,u)<=TYPES[b.type].range);const amount=t.damage*mult*(boosted?1.25:1)*perk(g,'attack',.08);for(const e of g.enemies)if(e===target||(t.splash&&distance(e,target)<=t.splash)){e.hp-=amount*(t.pierce?1:1-e.armor);if(t.slow)e.slowTime=2}g.effects.push({kind:'shot',x:u.x,y:u.y,tx:target.x,ty:target.y,color:t.color,life:.18})}}
 }
 if(g.waveActive){g.spawnClock-=dt;if(g.remaining>0&&g.spawnClock<=0){spawn(g);g.remaining--;g.spawnClock=1.65}}else if(!g.creative&&g.wave<6){g.breakTime-=dt;if(g.breakTime<=0)startWave(g)}
 const healed=new Set(),children=[];
 for(const e of g.enemies){if(e.hp<=0)continue;igniteEnemy(g,e);e.cool=Math.max(0,e.cool-dt);e.slowTime=Math.max(0,e.slowTime-dt);e.repath-=dt;
  if(e.kind==='healer')for(const ally of g.enemies)if(ally!==e&&ally.hp>0&&!healed.has(ally.id)&&distance(e,ally)<2.5){ally.hp=Math.min(ally.maxHp,ally.hp+3*dt);healed.add(ally.id)}
  if(e.kind==='summoner'&&(e.summons||0)<2){e.summonClock=(e.summonClock??7)-dt;if(e.summonClock<=0){e.summonClock=10;e.summons=(e.summons||0)+1;const child=makeEnemy(g,'mini',e.x,e.y);children.push(child);g.effects.push({kind:'summon',x:e.x,y:e.y,life:.8})}}
  if(e.kind==='bomber'){const close=distance(e,CENTER)<1.6||g.units.some(u=>u.hp>0&&distanceToUnit(e,u)<1.6);if(e.fuse!=null||close){e.fuse=(e.fuse??1.5)-dt;if(e.fuse<=0){for(const u of g.units)if(distanceToUnit(e,u)<1.9)damage(g,u,e.damage*(u.type==='wall'?12:7));if(distance(e,CENTER)<1.9)damage(g,null,e.damage*3);e.hp=0;g.effects.push({kind:'blast',x:e.x,y:e.y,life:.9})}continue}}
  if(e.kind==='spitter'&&e.cool<=0){const targets=g.units.filter(u=>u.hp>0&&distanceToUnit(e,u)<=5.5).sort((a,b)=>(TYPES[b.type].produceStraw||TYPES[b.type].produceBrick?2:0)-(TYPES[a.type].produceStraw||TYPES[a.type].produceBrick?2:0)||distance(e,a)-distance(e,b)),target=targets[0];if(target||distance(e,CENTER)<=5.5){const p=target||CENTER;damage(g,target||null,e.damage);for(const u of g.units)if(u!==target&&distance(u,p)<1.6)damage(g,u,e.damage*.7);e.cool=2.2;g.effects.push({kind:'spit',x:e.x,y:e.y,tx:p.x,ty:p.y,life:.35});continue}}
if(distance(e,CENTER)<.7){if(e.cool<=0){damage(g,null,e.damage);e.cool=1}continue}
  if(e.repath<=0||!e.path.length){e.path=findPath(g,e);e.repath=2.5+random(g)}
  const next=e.path[0];if(!next)continue;const obstacle=unitAt(g,next.x,next.y);
  if(obstacle&&distanceToUnit(e,obstacle)<1.15){if(e.cool<=0){damage(g,obstacle,e.damage);e.cool=1}continue}
  const d=distance(e,next),move=e.speed*movementFactor(g,e)*(e.slowTime>0?.5:1)*dt;if(d<=move){e.x=next.x;e.y=next.y;e.path.shift()}else{e.x+=(next.x-e.x)/d*move;e.y+=(next.y-e.y)/d*move}
 }
 for(const e of g.enemies)if(e.hp<=0){g.kills++;const loot=enemyLoot(e);for(const k of ['star','blueStar','goldStar'])g[k]=Math.min(1e9,(g[k]||0)+loot[k]);g.effects.push({kind:'output',resource:loot.goldStar?'🌟':loot.blueStar?'💎':'✦',x:e.x,y:e.y,life:.8});g.effects.push({kind:'poof',x:e.x,y:e.y,life:.5})}
 g.enemies=[...g.enemies.filter(e=>e.hp>0),...children];g.units=g.units.filter(u=>u.hp>0);if(g.core<=0&&!g.creative){g.core=0;g.over='lose';return}
 if(g.waveActive&&g.remaining===0&&g.enemies.length===0){g.waveActive=false;g.cleared=g.wave;g.breakTime=BREAK_SECONDS;g.wood=Math.min(1e9,g.wood+4);g.straw=Math.min(1e9,g.straw+8);g.brick=Math.min(1e9,g.brick+5);g.core=Math.min(g.maxCore,g.core+35);g.effects.push({kind:'clear',...CENTER,life:2})}checkWin(g);
}
export function save(g){return JSON.stringify({...g,effects:[]})}
export function load(raw){try{const g=JSON.parse(raw);if(g.version!==1||!Array.isArray(g.units)||!Array.isArray(g.enemies)||!Array.isArray(g.trees)||!Number.isFinite(g.core))return null;g.heat=clampHeat(g.heat);g.blueStar=Math.max(0,Number(g.blueStar)||0);g.goldStar=Math.max(0,Number(g.goldStar)||0);g.level=levelNumber(g.level);g.upgrades=tiers(g.upgrades);g.breakTime=Math.min(g.breakTime,g.wave===0?PREP_SECONDS:BREAK_SECONDS);g.straw=Number.isFinite(g.straw)?g.straw:50;g.brick=Number.isFinite(g.brick)?g.brick:35;if(!Array.isArray(g.terrain)||g.terrain.length!==W*H)g.terrain=Array(W*H).fill('grass');for(const u of g.units)if(!u.cells)u.cells=[[0,0]];if([2,3,4].includes((g.level-1)%6)&&g.terrainRevision!==3){g.terrain=makeTerrain(g.level);for(const u of g.units)for(const c of unitCells(u))if(!buildableTerrain(g,c.x,c.y))g.terrain[c.y*W+c.x]='bridge';g.trees=g.trees.filter(t=>buildableTerrain(g,t.x,t.y));for(const e of g.enemies){e.path=[];e.repath=0}g.terrainRevision=3}g.effects=[];return g}catch{return null}}
