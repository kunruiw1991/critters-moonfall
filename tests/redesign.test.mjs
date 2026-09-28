import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,build,startWave,update,save,load} from '../engine.mjs';
import {spawnGates,terrainAt,encounterKind,movementFactor} from '../levels.mjs';
import {scoreGame,settle,readPalace} from '../palace.mjs';
test('ice highways connect all attack entrances and cannot be sealed by buildings',()=>{const g=createGame({level:3,creative:true});for(const [x,y]of [[5,9],[11,4],[17,9],[11,14]]){assert.equal(terrainAt(g,x,y),'ice');assert.equal(build(g,'wall',x,y),false);assert.equal(movementFactor(g,{x,y}),1.7)}for(const u of g.units)assert.notEqual(terrainAt(g,u.x,u.y),'ice')});
test('desert contains no protective rock walls and enemies emerge from marked internal gates',()=>{const g=createGame({level:4});assert.equal(g.terrain.includes('rock'),false);for(const [x,y]of spawnGates(4)){assert.equal(terrainAt(g,x,y),'burrow');assert.equal(build(g,'wall',x,y),false)}startWave(g);update(g,.1);assert.ok(spawnGates(4).some(([x,y])=>Math.hypot(g.enemies[0].x-x,g.enemies[0].y-y)<.2))});
test('maps three and four introduce distinctive functional enemies from the first wave',()=>{assert.equal(encounterKind(3,1,5,'zombie'),'brute');assert.equal(encounterKind(3,1,7,'zombie'),'spitter');assert.equal(encounterKind(4,1,7,'zombie'),'bomber');assert.equal(encounterKind(4,2,4,'zombie'),'healer');assert.equal(encounterKind(4,3,8,'zombie'),'summoner')});
test('existing desert saves receive the new terrain without deleting buildings or perks',()=>{const g=createGame({level:4});delete g.terrainRevision;g.terrain=Array(396).fill('rock');const old=g.units.map(u=>u.id),h=load(save(g));assert.equal(h.terrain.includes('rock'),false);assert.deepEqual(h.units.map(u=>u.id),old)});
test('coins vary with surviving buildings, resources, pace and stage, and can exceed eight',()=>{const a=createGame();a.over='win';a.time=500;const b=load(save(a));b.level=4;b.time=250;b.wood+=400;b.brick+=150;const ra=settle(readPalace(null),a),rb=settle(readPalace(null),b);assert.ok(rb.earned>ra.earned);assert.ok(rb.earned>8);assert.ok(scoreGame(b).pace>scoreGame(a).pace)});

test('the real map renderer keeps enemy subtype instead of drawing every enemy as a walker',async()=>{
 const {render}=await import('../render.mjs');const {makeEnemy,ENEMIES}=await import('../engine.mjs');const fills=[];
 const c=new Proxy({},{get:(o,k)=>k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{},set:(o,k,v)=>{if(k==='fillStyle')fills.push(v);o[k]=v;return true}});
 const g=createGame({creative:true});g.units=[];g.trees=[];g.enemies=['runner','brute','spitter','bomber','healer','summoner','boss'].map((k,i)=>makeEnemy(g,k,5+i,6));
 render(c,1024,768,g,{rotation:0,zoom:1,panX:0,panY:0},{},null,null,null,0);
 assert.ok(fills.includes('#543a6c'),'CatNap boss uses the nightmare mesh');
 for(const k of ['runner','brute','spitter','bomber','healer','summoner'])assert.ok(fills.includes(ENEMIES[k].color),`${k} must retain its actual mesh palette on the map`);
});
