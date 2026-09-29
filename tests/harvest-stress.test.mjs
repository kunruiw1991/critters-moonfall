import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,update,unitCells,upgradeCost,TYPES} from '../engine.mjs';
import {buildableTerrain} from '../levels.mjs';
test('every map starts with three of each producer surrounding the moon without overlap',()=>{
 for(let level=1;level<=6;level++){const g=createGame({level}),occupied=new Set();for(const type of ['mill','garden','kiln'])assert.equal(g.units.filter(u=>u.type===type).length,3);for(const u of g.units)for(const p of unitCells(u)){assert.ok(buildableTerrain(g,p.x,p.y));assert.ok(!occupied.has(`${p.x},${p.y}`));occupied.add(`${p.x},${p.y}`);assert.ok(Math.hypot(p.x-11,p.y-9)<=2.1)}}
});
test('three producers have bounded net output at base and maximum upgrades',()=>{
 for(const max of [false,true]){const g=createGame({upgrades:max?{harvest:3}:{}});g.wave=6;for(const u of g.units)u.level=max?4:1;const before={wood:g.wood,straw:g.straw,brick:g.brick};for(let i=0;i<480;i++)update(g,.25);const amounts=['wood','straw','brick'].map(k=>g[k]-before[k]);assert.ok(amounts.every(x=>x>=50&&x<=200),JSON.stringify({max,amounts}));assert.equal(g.star,35)}
});
test('kilns preserve a construction reserve instead of consuming the last straw and wood',()=>{const g=createGame();g.wave=6;g.units=g.units.filter(u=>u.type==='kiln');g.wood=15;g.straw=30;const brick=g.brick;for(let i=0;i<100;i++)update(g,.25);assert.equal(g.wood,15);assert.equal(g.straw,30);assert.equal(g.brick,brick)});
test('one fixed upgrade recipe applies to every building and level',()=>{const cost=upgradeCost();assert.deepEqual(cost,{wood:25,straw:15,brick:15,star:20,blueStar:2,goldStar:1});for(const type of Object.keys(TYPES))for(let level=1;level<=3;level++)assert.deepEqual(upgradeCost({type,level}),cost)});
