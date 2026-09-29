import {createGame,build,canBuild,update,sunburst,restoreMoon,moonCost,TYPES,upgrade,MAX_UNIT_LEVEL,unitCells,afford,upgradeCost,MATERIALS} from '../engine.mjs';
export function run(level,seed=731,interval=10){
 const g=createGame({seed,level,upgrades:level>=5?{attack:2,armor:2,harvest:2,supplies:1}:{}});
 const plan=[['sun',10,7],['sun',13,8],['rapid',8,10],['prism',7,7],['heal',11,11],['shield',13,11],['prism',13,6],['spring',8,12],['boost',12,12],['rapid',14,8],['wall',8,8],['sun',9,12]];
 let index=0,upgrades=0,starBlocked=0,attempts=0,peak=10;const snapshots=[];
 for(let i=0;i<6500&&!g.over;i++){
  if(i%interval===0){for(const type of ['garden','kiln','mill'])if(g.units.filter(u=>u.type===type).length<2){const spots=[];for(let y=7;y<=12;y++)for(let x=9;x<=14;x++)if(canBuild(g,type,x,y))spots.push({x,y,d:Math.hypot(x-11,y-9)});spots.sort((a,b)=>a.d-b.d);if(spots[0])build(g,type,spots[0].x,spots[0].y)}const p=plan[index];if(p){const spots=[];for(let y=3;y<15;y++)for(let x=3;x<19;x++)if(canBuild({...g,creative:true},p[0],x,y))spots.push({x,y,d:Math.hypot(x-p[1],y-p[2])});spots.sort((a,b)=>a.d-b.d);const q=spots[0];if(q){attempts++;if(g.star<TYPES[p[0]].star)starBlocked++;if(build(g,p[0],q.x,q.y))index++}}
   if(g.wave>=3&&index>=3)for(const u of g.units.filter(u=>TYPES[u.type].damage&&u.level<(index>=8?MAX_UNIT_LEVEL:2)).sort((a,b)=>a.level-b.level))if(upgrade(g,u.id)){upgrades++;break}
   if(g.enemies.filter(e=>Math.hypot(e.x-11,e.y-9)<6).length>=3)sunburst(g);if(g.star>=moonCost(g)+60)restoreMoon(g)
  }
  const before=g.cleared;update(g,.1);peak=Math.max(peak,g.units.length);if(g.cleared!==before)snapshots.push({wave:g.cleared,wood:Math.round(g.wood),straw:Math.round(g.straw),brick:Math.round(g.brick),star:Math.round(g.star),diamond:g.blueStar,gold:g.goldStar,units:g.units.length});
 }
 return{level,seed,interval,result:g.over,seconds:Math.round(g.time),core:Math.round(g.core),builds:index,upgrades,peak,starBlocked,attempts,snapshots};
}
if(process.argv[1]?.endsWith('stress.mjs')){for(const level of[1,2,3,4,5,6])for(const seed of[17,731,922,42,2026])console.log(JSON.stringify(run(level,seed,level===2?150:20)))}
