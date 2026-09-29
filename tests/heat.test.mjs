import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,buildCost,build,makeEnemy,sell,save,load,upgradeCost,MATERIALS,heatFactor} from '../engine.mjs';
test('heat is bounded and scales costs and enemy health/attack linearly by twenty percent',()=>{
 const base=createGame();base.units=[];const normal=makeEnemy(base,'brute',0,0),cost=buildCost(base,'rapid');
 for(let heat=0;heat<=10;heat++){const g=createGame({heat});g.units=[];const e=makeEnemy(g,'brute',0,0),c=buildCost(g,'rapid');assert.ok(Math.abs(e.hp/normal.hp-(1+.2*heat))<1e-9);assert.ok(Math.abs(e.damage/normal.damage-(1+.2*heat))<1e-9);for(const k of MATERIALS)assert.equal(c[k],Math.ceil(cost[k]*(1+.2*heat)-1e-9)||0);assert.deepEqual(upgradeCost({type:'sun',level:3}),upgradeCost())}
 assert.equal(createGame({heat:99}).heat,10);assert.equal(createGame({heat:-2}).heat,0);
});
test('repeat construction raises actual prices and destruction immediately lowers them',()=>{
 const g=createGame();g.units=[];g.trees=[];for(const k of MATERIALS)g[k]=1e6;const cost=buildCost(g,'wall');const a=build(g,'wall',7,7);assert.equal(g.wood,1e6-cost.wood);const second=buildCost(g,'wall');assert.equal(second.wood,15);assert.ok(second.brick>cost.brick);const b=build(g,'wall',8,7);assert.equal(buildCost(g,'wall').wood,20);a.hp=0;assert.deepEqual(buildCost(g,'wall'),second);b.hp=0;assert.deepEqual(buildCost(g,'wall'),cost);
});
test('sale refunds the paid price, not a later inflated market price; free starters cannot mint resources',()=>{
 const g=createGame();g.trees=[];for(const k of MATERIALS)g[k]=1000;const a=build(g,'wall',8,7),paid={...a.paidCost};build(g,'wall',8,8);const before=g.wood;sell(g,a.id);assert.equal(g.wood-before,Math.floor(paid.wood/2));const producer=g.units.find(u=>u.type==='mill'),w=g.wood;sell(g,producer.id);assert.equal(g.wood,w);
});
test('saved heat persists and old saves default to easy',()=>{const g=createGame({heat:7});assert.equal(load(save(g)).heat,7);delete g.heat;assert.equal(load(save(g)).heat,0)});
