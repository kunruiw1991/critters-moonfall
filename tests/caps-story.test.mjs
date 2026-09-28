import test from 'node:test';
import assert from 'node:assert/strict';
import {CAPS,TYPES,createGame,build,buildReady,unitCount,sell,save,load} from '../engine.mjs';
import {awardPiece,readPieces} from '../story.mjs';
test('every critter enforces its live cap, including starter units and creative mode',()=>{
 assert.deepEqual(Object.keys(CAPS).sort(),Object.keys(TYPES).sort());
 for(const type of Object.keys(TYPES)){
  const g=createGame({creative:true});g.trees=[];
  for(let y=2;y<16;y++)for(let x=2;x<20;x++)build(g,type,x,y);
  assert.equal(unitCount(g,type),CAPS[type],type);assert.equal(buildReady(g,type),false);
  const u=g.units.find(u=>u.type===type);sell(g,u.id);assert.equal(buildReady(g,type),true);assert.ok(build(g,type,u.x,u.y));
  g.units.find(u=>u.type===type).hp=0;assert.equal(buildReady(g,type),true);
  assert.equal(unitCount(load(save(g)),type),CAPS[type]-1);
 }
});
test('insufficient materials darken readiness independently of the cap',()=>{const g=createGame();assert.ok(buildReady(g,'wall'));g.brick=0;assert.equal(buildReady(g,'wall'),false);g.brick=12;assert.ok(buildReady(g,'wall'))});
test('each campaign map awards one unique piece; defeat and creative never award',()=>{
 let p=[];for(let level=1;level<=6;level++){const g={level,over:'win',creative:false};p=awardPiece(p,g);assert.equal(p.length,level);assert.deepEqual(awardPiece(p,g),p)}
 assert.deepEqual(awardPiece(p,{level:7,over:'win'}),p);assert.deepEqual(awardPiece([],{level:1,over:'lose'}),[]);assert.deepEqual(awardPiece([],{level:1,over:'win',creative:true}),[]);
 assert.deepEqual(readPieces(null,4),[1,2,3]);assert.deepEqual(readPieces('[2,2,7,-1,1]',7),[1,2]);assert.deepEqual(readPieces(JSON.stringify(p)),p);
});
