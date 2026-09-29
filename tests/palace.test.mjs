import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,startWave,makeEnemy,update,build,save,load,PREP_SECONDS,BREAK_SECONDS} from '../engine.mjs';
import {readPalace,buy,settle,scoreGame,tiers} from '../palace.mjs';
test('all maps share starting resources, production and short clocks; threat grows gradually',()=>{
 let last;
 for(let level=1;level<=6;level++){const g=createGame({level});assert.equal(g.breakTime,20);assert.deepEqual([g.wood,g.straw,g.brick,g.star],[125,50,35,35]);assert.deepEqual(g.units.map(u=>u.type),['sun','mill','mill','mill','garden','garden','garden','kiln','kiln','kiln']);startWave(g);const e=makeEnemy(g,'zombie',0,9);if(last){assert.ok(e.hp>last.hp);assert.ok(e.damage>last.damage);assert.ok(g.remaining>last.count)}last={hp:e.hp,damage:e.damage,count:g.remaining};g.remaining=0;g.enemies=[];update(g,0);assert.equal(g.breakTime,BREAK_SECONDS)}assert.equal(PREP_SECONDS,20);assert.equal(BREAK_SECONDS,12);
});
test('score rewards intact buildings and remaining resources without the previous eight-moon ceiling',()=>{const g=createGame();g.over='win';const s=scoreGame(g);g.units[0].hp/=2;assert.ok(scoreGame(g).buildings<s.buildings);g.wood=0;assert.ok(scoreGame(g).resources<s.resources);g.wood=g.star=g.straw=g.brick=999999;assert.ok(scoreGame(g).resources>200)});
test('moon wallet persists, settles once, pays only improved rewards and rejects invalid purchases',()=>{let p=readPalace(null);const g=createGame();g.over='win';const r=settle(p,g);assert.ok(r.earned>=4);assert.equal(settle(p,g).earned,0);p=readPalace(JSON.stringify(p));assert.equal(settle(p,g).earned,0);const old=p.moons;assert.equal(buy(p,'attack'),true);assert.equal(p.moons,old-4);assert.equal(buy(p,'unknown'),false);p.moons=99;for(let i=0;i<3;i++)buy(p,'attack');assert.equal(p.upgrades.attack,3);assert.equal(buy(p,'attack'),false);g.over='lose';assert.equal(settle(p,g).earned,0);g.over='win';g.creative=true;assert.equal(settle(p,g).earned,0)});
test('purchased boosts apply to new maps, buildings, production, combat and saves',()=>{
 const a=createGame(),b=createGame({upgrades:tiers({attack:1,armor:1,harvest:1,supplies:1})});assert.equal(b.wood,a.wood+20);assert.ok(b.core>a.core);assert.ok(b.units[0].maxHp>a.units[0].maxHp);assert.ok(build(b,'wall',9,8).maxHp>220);
 a.units=a.units.filter(u=>u.type==='mill');b.units=b.units.filter(u=>u.type==='mill');const aw=a.wood,bw=b.wood;update(a,1);update(b,1);assert.ok(b.wood-bw>a.wood-aw);
 const c=createGame(),d=createGame({upgrades:{attack:1}});for(const g of[c,d]){g.enemies=[{...makeEnemy(g,'zombie',8,9),hp:1000,maxHp:1000}];update(g,.1)}assert.ok(d.enemies[0].hp<c.enemies[0].hp);assert.deepEqual(load(save(b)).upgrades,b.upgrades);
});
