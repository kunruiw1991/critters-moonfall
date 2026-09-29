import {run} from './stress.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,build,update,upgrade,TYPES} from '../engine.mjs';
import {encounterKind} from '../levels.mjs';
test('river introduces heavy enemies one role at a time',()=>{
 for(let wave=1;wave<=2;wave++)for(let n=1;n<=25;n++)for(const fallback of ['brute','spitter','bomber','runner'])assert.ok(['zombie','runner'].includes(encounterKind(2,wave,n,fallback)));
 assert.equal(encounterKind(2,3,5,'zombie'),'brute');
 assert.equal(encounterKind(2,4,6,'zombie'),'spitter');
 assert.equal(encounterKind(2,6,1,'boss'),'boss');
});
test('river supports slow fifteen-second building decisions with the starter economy',()=>{for(const seed of [17,731,922,42,2026]){const g=run(2,seed,150);assert.equal(g.result,'win',`seed ${seed}`)}});
