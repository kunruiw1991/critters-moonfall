import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,build,upgrade,upgradeCost,enemyLoot,makeEnemy,update,load,save,MAX_UNIT_LEVEL,MATERIALS,buildReady} from '../engine.mjs';
test('elite rewards populate distinct currencies and old saves migrate without inventing rare stars',()=>{
 assert.deepEqual(enemyLoot({kind:'brute'}),{star:10,blueStar:2,goldStar:1});assert.deepEqual(enemyLoot({kind:'summoner'}),{star:10,blueStar:2,goldStar:1});assert.deepEqual(enemyLoot({kind:'mini',ignited:true}),{star:0,blueStar:0,goldStar:0});
 const g=createGame();g.wave=6;g.units=[];g.enemies=['brute','summoner','boss'].map(k=>({...makeEnemy(g,k,0,0),hp:0}));update(g,.1);assert.equal(g.blueStar,8);assert.equal(g.goldStar,5);assert.equal(load(save(g)).goldStar,5);delete g.blueStar;delete g.goldStar;const h=load(save(g));assert.equal(h.blueStar,0);assert.equal(h.goldStar,0);
});
test('upgrades spend all six material classes, work with more than thirty structures, and stop at level four',()=>{
 const g=createGame();g.trees=[];for(const k of MATERIALS)g[k]=999;const u=g.units[0];g.units=Array.from({length:40},(_,i)=>({...u,id:i+1}));const tower=g.units[0];
 g.blueStar=0;const wood=g.wood;assert.equal(upgrade(g,tower.id),false);assert.equal(g.wood,wood);g.blueStar=99;
 for(let tier=1;tier<MAX_UNIT_LEVEL;tier++){const before=Object.fromEntries(MATERIALS.map(k=>[k,g[k]])),cost=upgradeCost(tower);assert.equal(upgrade(g,tower.id),true);for(const k of MATERIALS)assert.equal(g[k],before[k]-(cost[k]||0))}
 assert.equal(tower.level,4);assert.equal(g.units.length,40);assert.equal(upgrade(g,tower.id),false);
});
