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
test('river supports slow basic building with upgrades but without repairs or special abilities',()=>{
 for(const seed of [17,731,922,42,2026]){
  const g=createGame({seed,level:2});
  assert.ok(g.units.some(u=>u.type==='garden'));assert.ok(g.units.some(u=>u.type==='kiln'));
  const plan=[['sun',10,8],['sun',12,8],['garden',14,11],['mill',9,12],['kiln',14,10],['prism',7,7],['rapid',8,11],['sun',12,11],['heal',11,11],['spring',13,9],['prism',12,6]];let index=0;
  // One build attempt every 15 seconds. No harvesting, abilities, selling or repair micro; use the upgrade cards from wave three.
  for(let i=0;i<12000&&!g.over;i++){if(i%150===0){if(plan[index]&&build(g,...plan[index]))index++;if(g.wave>=3)for(const u of g.units.filter(u=>TYPES[u.type].damage&&u.level<3))if(upgrade(g,u.id))break}update(g,.1)}
  assert.equal(g.over,'win',`seed ${seed}, wave ${g.wave}`);assert.equal(g.cleared,6);assert.equal(g.moon,3);
 }
});
