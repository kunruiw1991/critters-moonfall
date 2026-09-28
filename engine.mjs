import {levelInfo,makeTerrain,walkable,movementFactor,encounterKind} from './levels.mjs?v=8';
export const W=22,H=18,CENTER={x:11,y:9};
export const TYPES={
 sun:{name:'DogDay',icon:'☀️',portrait:'critter_05_dogday',role:'⚔️',wood:45,star:15,hp:140,range:4.3,damage:15,period:1.1,color:'#f4bc64'},
 rapid:{name:'KickinChicken',icon:'🏹',portrait:'critter_10_kickin',role:'⚔️',wood:60,star:10,hp:105,range:4.2,damage:7,period:.28,color:'#ffe597'},
 prism:{name:'CraftyCorn',icon:'💎',portrait:'critter_08_craftycorn',role:'⚔️',wood:70,star:35,hp:115,range:6.2,damage:18,period:1.6,splash:1.5,slow:.5,pierce:true,color:'#bca6f9'},
 wall:{name:'Mikey',icon:'🧱',portrait:'mikey',role:'🛡️',wood:10,star:0,hp:220,color:'#8bc98b'},
 spring:{name:'Hoppy',icon:'🌀',portrait:'critter_07_hoppy',role:'⚔️',wood:35,star:10,hp:100,range:1.8,damage:28,period:2.6,splash:1.8,color:'#8fddbc'},
 heal:{name:'Bobby BearHug',icon:'💗',portrait:'critter_06_bobby',role:'💗',wood:50,star:20,hp:115,range:2.8,heal:1,color:'#efa7bc'},
 mill:{name:'Bubba',icon:'🪵',portrait:'critter_09_bubba',role:'⚙️',wood:55,star:0,hp:110,produceWood:1.1,color:'#9ebfe9'},
 garden:{name:'PickyPiggy',icon:'🌾',portrait:'critter_11_picky',role:'🌾↑',wood:35,star:0,hp:95,produceStraw:.8,produceStar:.2,color:'#edb8bb'},
 kiln:{name:'BabaChops',icon:'🧱',portrait:'critter_12_babachops',role:'🧱↑',wood:45,star:0,hp:100,produceBrick:.45,color:'#cc9672'},
 boost:{name:'JJ',icon:'⚡',portrait:'jj',role:'⚡',wood:50,star:25,hp:130,range:3.6,boost:1.25,color:'#c6e299'},
 shield:{name:'Luna Bat',icon:'🛡️',portrait:'critter_01_lunabat',role:'🛡️',wood:60,star:30,hp:160,range:3.3,shield:.65,color:'#ab9ddb'}
};
export const CAPS={sun:6,rapid:4,prism:6,wall:8,spring:4,heal:2,mill:3,garden:3,kiln:3,boost:2,shield:2};
export const unitCount=(g,type)=>g.units.filter(u=>u.type===type&&u.hp>0).length;
export const buildReady=(g,type)=>!!TYPES[type]&&!g.over&&unitCount(g,type)<CAPS[type]&&afford(g,TYPES[type]);
export const MATERIALS=['wood','straw','brick','star'];
const recipes={sun:[10,0],rapid:[18,0],prism:[0,22],wall:[0,12],spring:[16,0],heal:[20,8],mill:[0,0],garden:[0,0],kiln:[15,0],boost:[12,12],shield:[0,25]};
for(const [type,t]of Object.entries(TYPES)){[t.straw,t.brick]=recipes[type]}
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
// The river map introduces materials and split lanes without a siege difficulty spike.
const riverLesson=g=>g.level===2;
export function makeEnemy(g,kind,x,y){const t=ENEMIES[kind],d=levelNumber(g.level)-1,hp=(30+g.wave*6)*t.hp*(1+d*.18)*(riverLesson(g)?.8:1);return{id:g.nextId++,kind,x,y,hp,maxHp:hp,speed:t.speed*Math.min(1.35,1+d*.03),damage:t.damage*(1+d*.1)*(riverLesson(g)?.7:1),armor:t.armor,cool:0,slowTime:0,path:[],repath:0,summonClock:7,summons:0,fuse:null}}
export function enemyKind(wave,n){return n===1&&wave%6===0?'boss':wave>=5&&n===8?'summoner':wave>=4&&n%9===0?'healer':wave>=2&&n%7===0?'bomber':wave>=2&&n%6===0?'spitter':wave>=2&&n%5===0?'brute':wave>=1&&n%3===0?'runner':'zombie'}
const key=(x,y)=>y*W+x;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
export function random(g){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
export const levelNumber=n=>Number.isSafeInteger(n)&&n>0?n:1;
export function nextLevel(g){return g.over==='win'&&!g.creative?levelNumber(g.level)+1:null}
export function createGame({seed=731,creative=false,level=1}={}){
 level=levelNumber(level);const bonus=Math.min(10,level-1);
 const g={version:1,seed,creative,level,time:0,wood:170+bonus*20,star:50+bonus*5,straw:50+bonus*5,brick:35+bonus*3,core:700,maxCore:700,moon:0,wave:0,cleared:0,waveActive:false,remaining:0,spawnClock:0,breakTime:30,units:[],enemies:[],trees:[],effects:[],terrain:makeTerrain(level),nextId:1,sunCooldown:0,over:null,kills:0,totalBuilt:0};
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(distance({x,y},CENTER)>5.5&&walkable(g,x,y)&&random(g)<levelInfo(level).tree)g.trees.push({x,y,hp:2});
 g.units.push(makeUnit(g,'sun',9,9),makeUnit(g,'mill',12,10));
 if(riverLesson(g)){g.wood+=60;g.straw+=30;g.brick+=25;g.star+=25;g.breakTime=55;g.units.push(makeUnit(g,'garden',14,11),makeUnit(g,'kiln',14,12))}
 return g;
}
function makeUnit(g,type,x,y){return{id:g.nextId++,type,x,y,level:1,hp:TYPES[type].hp,maxHp:TYPES[type].hp,cool:0}}
export function unitAt(g,x,y){return g.units.find(u=>u.x===x&&u.y===y)}
export function canBuild(g,type,x,y){return !g.over&&buildReady(g,type)&&inside(x,y)&&walkable(g,x,y)&&x>0&&y>0&&x<W-1&&y<H-1&&distance({x,y},CENTER)>.8&&!unitAt(g,x,y)&&!g.trees.some(t=>t.x===x&&t.y===y)&&!g.enemies.some(e=>distance(e,{x,y})<.65)&&afford(g,TYPES[type])}
export function build(g,type,x,y){if(!canBuild(g,type,x,y))return false;const t=TYPES[type];pay(g,t);const u=makeUnit(g,type,x,y);g.units.push(u);g.totalBuilt++;g.effects.push({kind:'build',x,y,life:.8});return u}
export function harvest(g,x,y){const i=g.trees.findIndex(t=>t.x===x&&t.y===y);if(i<0||g.over)return false;g.trees[i].hp--;g.wood=Math.min(999,g.wood+10);g.effects.push({kind:'wood',x,y,life:.7});if(g.trees[i].hp<=0)g.trees.splice(i,1);return true}
export function upgradeCost(u){return{wood:Math.ceil(TYPES[u.type].wood*.7*u.level),star:Math.max(8,Math.ceil(TYPES[u.type].star*.7*u.level)),straw:Math.ceil(TYPES[u.type].straw*.7*u.level),brick:Math.max(5,Math.ceil(TYPES[u.type].brick*.7*u.level))}}
export function upgrade(g,id){const u=g.units.find(u=>u.id===id);if(!u||u.level>=3||g.over)return false;const cost=upgradeCost(u);if(!afford(g,cost))return false;pay(g,cost);const missing=u.maxHp-u.hp;u.level++;u.maxHp=Math.round(TYPES[u.type].hp*(1+.5*(u.level-1)));u.hp=u.maxHp-missing;return true}
export function repair(g,id){const u=g.units.find(u=>u.id===id);if(!canRepair(g,u))return false;pay(g,repairCost);u.hp=Math.min(u.maxHp,u.hp+u.maxHp*.15);u.repairAt=g.time+8;return true}
export function sell(g,id){const i=g.units.findIndex(u=>u.id===id);if(i<0||g.over)return false;const u=g.units[i];for(const k of MATERIALS)g[k]=Math.min(999,(g[k]||0)+Math.floor((TYPES[u.type][k]||0)*.5));g.units.splice(i,1);return true}
export const moonCost=g=>[40,60,80][g.moon]??0;
export function restoreMoon(g){if(g.over||g.moon>=3||(!g.creative&&g.star<moonCost(g)))return false;if(!g.creative)g.star-=moonCost(g);g.moon++;g.core=Math.min(g.maxCore,g.core+100);checkWin(g);return true}
function checkWin(g){if(!g.creative&&g.cleared>=6&&!g.waveActive&&g.remaining===0&&g.enemies.length===0&&g.core>0){g.moon=3;g.over='win'}}
export function finishCreative(g){if(!g.creative||g.over)return false;g.over='win';g.waveActive=false;g.remaining=0;g.enemies=[];g.moon=3;return true}
export function startWave(g){if(g.over||g.waveActive||(!g.creative&&g.wave>=6))return false;g.wave++;g.waveActive=true;g.remaining=5+g.wave*3+Math.min(12,(levelNumber(g.level)-1)*2);if(riverLesson(g))g.remaining=Math.max(6,Math.ceil(g.remaining*.75));g.spawnClock=.1;g.breakTime=0;return true}
export function sunburst(g){if(g.over||g.sunCooldown>0)return false;g.sunCooldown=30;g.effects.push({kind:'sun',...CENTER,life:1});for(const e of g.enemies)if(distance(e,CENTER)<6)e.hp-=65;g.core=Math.min(g.maxCore,g.core+25);return true}
function spawn(g){const wave=g.wave,n=g.remaining;const kind=encounterKind(g.level,wave,n,enemyKind(wave,n));const edge=wave<=2?0:Math.floor(random(g)*4);let x,y;if(edge===0){x=0;y=3+Math.floor(random(g)*(H-6))}else if(edge===1){x=W-1;y=3+Math.floor(random(g)*(H-6))}else if(edge===2){x=3+Math.floor(random(g)*(W-6));y=0}else{x=3+Math.floor(random(g)*(W-6));y=H-1}
 g.enemies.push(makeEnemy(g,kind,x,y));}
// Weighted shortest path: walls divert the horde but can always be broken.
function findPath(g,e){const sx=Math.round(e.x),sy=Math.round(e.y),start=key(sx,sy),goal=key(CENTER.x,CENTER.y),dist=new Float64Array(W*H).fill(Infinity),prev=new Int32Array(W*H).fill(-1),visited=new Uint8Array(W*H);dist[start]=0;
 const structures=new Map(g.units.map(u=>[key(u.x,u.y),u]));const trees=new Set(g.trees.map(t=>key(t.x,t.y)));
 for(let n=0;n<W*H;n++){let best=-1,min=Infinity;for(let i=0;i<dist.length;i++)if(!visited[i]&&dist[i]<min){best=i;min=dist[i]}if(best<0||best===goal)break;visited[best]=1;const x=best%W,y=Math.floor(best/W);for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!inside(nx,ny)||!walkable(g,nx,ny))continue;const k=key(nx,ny),u=structures.get(k),cost=1+(u?Math.min(8,u.hp/(e.damage*4)):0)+(trees.has(k)?.7:0);if(dist[k]>min+cost){dist[k]=min+cost;prev[k]=best}}}
 const path=[];let k=goal;for(let n=0;n<W*H&&k!==start&&k!==-1;n++){path.push({x:k%W,y:Math.floor(k/W)});k=prev[k]}return k===start?path.reverse():[];}
function damage(g,u,amount){const p=u||CENTER;const sheltered=g.units.some(s=>TYPES[s.type].shield&&distance(s,p)<=TYPES[s.type].range);const value=amount*(sheltered?.65:1);if(u){u.hp-=value;u.lastHit=g.time;}else if(!g.creative)g.core-=value}
export function clearShot(g,a,b){const steps=Math.ceil(distance(a,b)*3);for(let i=1;i<steps;i++){const x=Math.round(a.x+(b.x-a.x)*i/steps),y=Math.round(a.y+(b.y-a.y)*i/steps);if(g.terrain?.[y*W+x]==='rock')return false}return true}
export function update(g,dt){if(g.over)return;if(g.core<=0&&!g.creative){g.core=0;g.over='lose';return}dt=Math.min(.25,Math.max(0,dt));g.time+=dt;g.sunCooldown=Math.max(0,g.sunCooldown-dt);g.wood=Math.min(999,g.wood+.22*dt);g.star=Math.min(999,g.star+.1*dt);
 g.effects=g.effects.filter(f=>(f.life-=dt)>0);
 const repaired=new Set();
 for(const u of g.units){const t=TYPES[u.type],mult=1+.5*(u.level-1);u.producing=false;g.wood=Math.min(999,g.wood+(t.produceWood||0)*mult*dt);g.star=Math.min(999,g.star+(t.produceStar||0)*mult*dt);u.cool-=dt;
  if(t.produceStraw)g.straw=Math.min(999,g.straw+t.produceStraw*mult*dt);
  if(t.produceBrick){const amount=g.creative?t.produceBrick*mult*dt:Math.min(t.produceBrick*mult*dt,g.wood/1,g.straw/.7);u.producing=amount>0;g.brick=Math.min(999,g.brick+amount);if(!g.creative){g.wood-=amount;g.straw-=amount*.7}}
  if((t.produceWood||t.produceStraw||u.producing)&&g.time>=(u.outputAt||0)){u.outputAt=g.time+3;g.effects.push({kind:'output',resource:t.produceStraw?'🌾':t.produceBrick?'🧱':'🪵',x:u.x,y:u.y,life:1})}

  if(t.heal){const target=g.units.filter(a=>a.id!==u.id&&a.hp>0&&a.hp<a.maxHp&&!repaired.has(a.id)&&g.time-(a.lastHit??-100)>=3&&distance(a,u)<=t.range).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];if(target){const amount=Math.min(t.heal*(1+.25*(u.level-1))*dt,target.maxHp-target.hp,g.creative?Infinity:g.straw/.3);if(amount>0){target.hp+=amount;if(!g.creative)g.straw-=amount*.3;repaired.add(target.id);if(g.time>=(u.healEffectAt||0)){u.healEffectAt=g.time+1;g.effects.push({kind:'mend',x:u.x,y:u.y,tx:target.x,ty:target.y,life:.35})}}}}
  if(t.damage&&u.cool<=0){const targets=g.enemies.filter(e=>e.hp>0&&distance(e,u)<=t.range&&(t.pierce||clearShot(g,u,e)));if(targets.length){const target=targets.reduce((a,b)=>distance(a,CENTER)<distance(b,CENTER)?a:b);u.cool=t.period;const boosted=g.units.some(b=>TYPES[b.type].boost&&distance(b,u)<=TYPES[b.type].range);const amount=t.damage*mult*(boosted?1.25:1);for(const e of g.enemies)if(e===target||(t.splash&&distance(e,target)<=t.splash)){e.hp-=amount*(t.pierce?1:1-e.armor);if(t.slow)e.slowTime=2}g.effects.push({kind:'shot',x:u.x,y:u.y,tx:target.x,ty:target.y,color:t.color,life:.18})}}
 }
 if(g.waveActive){g.spawnClock-=dt;if(g.remaining>0&&g.spawnClock<=0){spawn(g);g.remaining--;g.spawnClock=riverLesson(g)?2.4:1.65}}else if(!g.creative&&g.wave<6){g.breakTime-=dt;if(g.breakTime<=0)startWave(g)}
 const healed=new Set(),children=[];
 for(const e of g.enemies){if(e.hp<=0)continue;e.cool=Math.max(0,e.cool-dt);e.slowTime=Math.max(0,e.slowTime-dt);e.repath-=dt;
  if(e.kind==='healer')for(const ally of g.enemies)if(ally!==e&&ally.hp>0&&!healed.has(ally.id)&&distance(e,ally)<2.5){ally.hp=Math.min(ally.maxHp,ally.hp+3*dt);healed.add(ally.id)}
  if(e.kind==='summoner'&&(e.summons||0)<2){e.summonClock=(e.summonClock??7)-dt;if(e.summonClock<=0){e.summonClock=10;e.summons=(e.summons||0)+1;const child=makeEnemy(g,'mini',e.x,e.y);children.push(child);g.effects.push({kind:'summon',x:e.x,y:e.y,life:.8})}}
  if(e.kind==='bomber'){const close=distance(e,CENTER)<1.6||g.units.some(u=>u.hp>0&&distance(e,u)<1.6);if(e.fuse!=null||close){e.fuse=(e.fuse??1.5)-dt;if(e.fuse<=0){for(const u of g.units)if(distance(e,u)<1.9)damage(g,u,e.damage*(u.type==='wall'?12:7));if(distance(e,CENTER)<1.9)damage(g,null,e.damage*3);e.hp=0;g.effects.push({kind:'blast',x:e.x,y:e.y,life:.9})}continue}}
  if(e.kind==='spitter'&&e.cool<=0){const targets=g.units.filter(u=>u.hp>0&&distance(e,u)<=5.5).sort((a,b)=>(TYPES[b.type].produceStraw||TYPES[b.type].produceBrick?2:0)-(TYPES[a.type].produceStraw||TYPES[a.type].produceBrick?2:0)||distance(e,a)-distance(e,b)),target=targets[0];if(target||distance(e,CENTER)<=5.5){const p=target||CENTER;damage(g,target||null,e.damage);for(const u of g.units)if(u!==target&&distance(u,p)<1.6)damage(g,u,e.damage*.7);e.cool=2.2;g.effects.push({kind:'spit',x:e.x,y:e.y,tx:p.x,ty:p.y,life:.35});continue}}
if(distance(e,CENTER)<.7){if(e.cool<=0){damage(g,null,e.damage);e.cool=1}continue}
  if(e.repath<=0||!e.path.length){e.path=findPath(g,e);e.repath=2.5+random(g)}
  const next=e.path[0];if(!next)continue;const obstacle=unitAt(g,next.x,next.y);
  if(obstacle&&distance(e,obstacle)<1.15){if(e.cool<=0){damage(g,obstacle,e.damage);e.cool=1}continue}
  const d=distance(e,next),move=e.speed*movementFactor(g,e)*(e.slowTime>0?.5:1)*dt;if(d<=move){e.x=next.x;e.y=next.y;e.path.shift()}else{e.x+=(next.x-e.x)/d*move;e.y+=(next.y-e.y)/d*move}
 }
 for(const e of g.enemies)if(e.hp<=0){g.kills++;g.wood=Math.min(999,g.wood+(e.kind==='mini'?1:3));g.star=Math.min(999,g.star+(e.kind==='boss'?25:e.kind==='mini'?1:2));g.effects.push({kind:'poof',x:e.x,y:e.y,life:.5})}
 g.enemies=[...g.enemies.filter(e=>e.hp>0),...children];g.units=g.units.filter(u=>u.hp>0);if(g.core<=0&&!g.creative){g.core=0;g.over='lose';return}
 if(g.waveActive&&g.remaining===0&&g.enemies.length===0){g.waveActive=false;g.cleared=g.wave;g.breakTime=riverLesson(g)?45:25;g.wood=Math.min(999,g.wood+25+5*(levelNumber(g.level)-1));g.star=Math.min(999,g.star+15+2*(levelNumber(g.level)-1));g.straw=Math.min(999,g.straw+8);g.brick=Math.min(999,g.brick+5);g.core=Math.min(g.maxCore,g.core+(riverLesson(g)?65:15));g.effects.push({kind:'clear',...CENTER,life:2})}checkWin(g);
}
export function save(g){return JSON.stringify({...g,effects:[]})}
export function load(raw){try{const g=JSON.parse(raw);if(g.version!==1||!Array.isArray(g.units)||!Array.isArray(g.enemies)||!Array.isArray(g.trees)||!Number.isFinite(g.core))return null;g.level=levelNumber(g.level);g.straw=Number.isFinite(g.straw)?g.straw:50;g.brick=Number.isFinite(g.brick)?g.brick:35;if(!Array.isArray(g.terrain)||g.terrain.length!==W*H)g.terrain=Array(W*H).fill('grass');g.effects=[];return g}catch{return null}}
