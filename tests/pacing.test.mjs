import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,update,makeEnemy,enemyReward,build,TYPES,canBuild} from '../engine.mjs';
test('combat rewards reflect threat and summoned children cannot farm stars',()=>{
 const g=createGame();g.units=[];g.wave=6;const before=g.star;
 g.enemies=['zombie','runner','brute','spitter','bomber','healer','summoner','mini','boss'].map(k=>{const e=makeEnemy(g,k,0,0);e.hp=0;return e});
 const reward=g.enemies.reduce((n,e)=>n+enemyReward(e),0);update(g,.1);assert.equal(g.star-before,reward);assert.equal(reward,84);
 assert.equal(enemyReward({kind:'mini',ignited:true}),0);assert.equal(enemyReward({kind:'brute',ignited:true}),11);
});
test('fast production does not generate monster currencies without combat',()=>{const g=createGame();g.wave=6;const before=g.star;for(let i=0;i<80;i++)update(g,.25);assert.equal(g.star,before);assert.equal(g.blueStar,0);assert.equal(g.goldStar,0)});
