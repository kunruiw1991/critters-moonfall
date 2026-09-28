import {createGame,build,canBuild,update,sunburst,restoreMoon,moonCost,TYPES,upgrade} from '../engine.mjs';
import {scoreGame,readPalace,settle} from '../palace.mjs';
for(const level of [1,2,3,4,5,6]){
 const seed=731,g=createGame({seed,level,upgrades:level>=5?{attack:2,armor:2,harvest:2,supplies:1}:{}});
 const plan=[['sun',10,7],['sun',13,8],['garden',12,11],['kiln',14,11],['prism',7,7],['rapid',12,6],['heal',11,11],['prism',13,12],['mill',9,11],['shield',9,12],['boost',12,8],['spring',8,11],['rapid',14,8],['sun',8,12]];
 let index=0;
 for(let i=0;i<10000&&!g.over;i++){
  if(i%10===0){const p=plan[index];if(p){let spots=[];for(let y=3;y<15;y++)for(let x=3;x<19;x++)if(canBuild({...g,creative:true},p[0],x,y))spots.push({x,y,d:Math.hypot(x-p[1],y-p[2])});spots.sort((a,b)=>a.d-b.d);const q=spots[0];if(q&&build(g,p[0],q.x,q.y))index++}
   if(index>=plan.length){for(const u of g.units.filter(u=>u.level<3&&TYPES[u.type].damage))if(upgrade(g,u.id))break}
   if(g.enemies.filter(e=>Math.hypot(e.x-11,e.y-9)<6).length>=3)sunburst(g);if(g.star>=moonCost(g)+45)restoreMoon(g)
  }update(g,.1)
 }
 console.log(JSON.stringify({level,seed,result:g.over,time:Math.round(g.time),core:Math.round(g.core),units:g.units.length,builds:index,wood:Math.round(g.wood),star:Math.round(g.star),straw:Math.round(g.straw),brick:Math.round(g.brick),score:scoreGame(g).total,reward:settle(readPalace(null),g).earned}));
}
