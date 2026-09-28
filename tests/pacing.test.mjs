import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,update,makeEnemy,enemyReward,build,TYPES,canBuild} from '../engine.mjs';
test('combat rewards reflect threat and summoned children cannot farm stars',()=>{
 const g=createGame();g.units=[];g.wave=6;const before=g.star;
 g.enemies=['zombie','runner','brute','spitter','bomber','healer','summoner','mini','boss'].map(k=>{const e=makeEnemy(g,k,0,0);e.hp=0;return e});
 const reward=g.enemies.reduce((n,e)=>n+enemyReward(e),0);update(g,.1);assert.equal(g.star-before,reward);assert.equal(reward,45);
 assert.equal(enemyReward({kind:'mini',ignited:true}),0);assert.equal(enemyReward({kind:'brute',ignited:true}),8);
});
test('waiting without combat does not produce stars and cannot fill the map in opening prep',()=>{
 const g=createGame();g.trees=[];const before=g.star;
 for(let i=0;i<80;i++)update(g,.25);
 assert.equal(g.star,before);
 // Even greedy cheapest-first construction with free choice of valid land remains at or below half the map cap.
 for(const type of Object.keys(TYPES).sort((a,b)=>TYPES[a].star-TYPES[b].star))for(let y=2;y<16;y++)for(let x=2;x<20;x++)if(canBuild(g,type,x,y))build(g,type,x,y);
 assert.ok(g.units.length<=10,`opening buildings ${g.units.length}`);
});
