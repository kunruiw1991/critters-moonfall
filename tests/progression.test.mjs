import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,mapCap,build,upgrade,upgradeCost,enemyLoot,makeEnemy,update,load,save,MAX_UNIT_LEVEL,MATERIALS,buildReady} from '../engine.mjs';
test('wave caps rise beyond twenty while an existing over-cap save stays intact',()=>{
 const g=createGame();assert.deepEqual([0,1,2,3,4,5,6].map(w=>(g.wave=w,mapCap(g))),[10,12,14,17,20,23,26]);
 g.wave=0;g.units=Array.from({length:20},(_,i)=>({...g.units[0],id:i}));assert.equal(buildReady(g,'wall'),false);const h=load(save(g));assert.equal(h.units.length,20);h.wave=5;h.brick=50;assert.equal(buildReady(h,'wall'),true);
});
test('elite rewards populate distinct currencies and old saves migrate without inventing rare stars',()=>{
 assert.deepEqual(enemyLoot({kind:'brute'}),{star:2,blueStar:2,goldStar:0});assert.deepEqual(enemyLoot({kind:'summoner'}),{star:2,blueStar:1,goldStar:1});assert.deepEqual(enemyLoot({kind:'mini',ignited:true}),{star:0,blueStar:0,goldStar:0});
 const g=createGame();g.wave=6;g.units=[];g.enemies=['brute','summoner','boss'].map(k=>({...makeEnemy(g,k,0,0),hp:0}));update(g,.1);assert.equal(g.blueStar,7);assert.equal(g.goldStar,4);assert.equal(load(save(g)).goldStar,4);delete g.blueStar;delete g.goldStar;const h=load(save(g));assert.equal(h.blueStar,0);assert.equal(h.goldStar,0);
});
test('upgrades spend all six material classes, work at map cap, and stop at level four',()=>{
 const g=createGame();g.trees=[];for(const k of MATERIALS)g[k]=999;const u=g.units[0];g.units=Array.from({length:mapCap(g)},(_,i)=>({...u,id:i+1}));const tower=g.units[0];
 g.blueStar=0;const wood=g.wood;assert.equal(upgrade(g,tower.id),false);assert.equal(g.wood,wood);g.blueStar=99;
 for(let tier=1;tier<MAX_UNIT_LEVEL;tier++){const before=Object.fromEntries(MATERIALS.map(k=>[k,g[k]])),cost=upgradeCost(tower);assert.equal(upgrade(g,tower.id),true);for(const k of MATERIALS)assert.equal(g[k],before[k]-(cost[k]||0))}
 assert.equal(tower.level,4);assert.equal(g.units.length,mapCap(g));assert.equal(upgrade(g,tower.id),false);
});
