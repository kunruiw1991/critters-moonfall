export const GOODS={attack:{icon:'⚔️',label:'月刃',effect:'⚔️ +8%',step:.08},armor:{icon:'🛡️',label:'玉甲',effect:'💚 +12%',step:.12},harvest:{icon:'🌾',label:'桂树',effect:'🌾🪵🧱 +10%',step:.1},supplies:{icon:'🎁',label:'玉兔行囊',effect:'🪵20 🌾15 🧱10 ✦8'}};
export const tiers=u=>Object.fromEntries(Object.keys(GOODS).map(k=>[k,Math.max(0,Math.min(3,Math.floor(Number(u?.[k])||0)))]));
export function readPalace(raw){try{const p=JSON.parse(raw);return {moons:Math.max(0,Math.floor(Number(p?.moons)||0)),upgrades:tiers(p?.upgrades),best:p?.best&&typeof p.best==='object'?p.best:{}}}catch{return {moons:0,upgrades:tiers(),best:{}}}}
export const price=(p,k)=>4+2*(p.upgrades[k]||0);
export function buy(p,k){if(!GOODS[k]||p.upgrades[k]>=3||p.moons<price(p,k))return false;p.moons-=price(p,k);p.upgrades[k]++;return true}
export function scoreGame(g){
 const clamp=(v,max)=>Math.max(0,Math.min(max,v));
 const buildings=Math.round(g.units.filter(u=>u.hp>0).reduce((sum,u)=>sum+24*(u.hp/u.maxHp)*(1+.65*(u.level-1)),0));
 const resources=Math.round(((g.wood||0)+(g.straw||0)+(g.brick||0)*2+(g.star||0)*2+(g.blueStar||0)*10+(g.goldStar||0)*30)/6);
 const health=Math.round(clamp(g.core/g.maxCore*160,160)),clear=g.over==='win'?120:0;
 const pace=g.over==='win'?Math.max(0,180-Math.floor((g.time||0)/3)):0;
 const challenge=g.over==='win'?Math.max(1,g.level)*25:0;
 return {buildings,resources,health,clear,pace,challenge,total:buildings+resources+health+clear+pace+challenge};
}
export function settle(p,g){const score=scoreGame(g);if(g.creative||g.over!=='win')return {...score,earned:0};const reward=2+Math.floor(score.total/90),previous=Math.max(0,Number(p.best[g.level])||0),earned=Math.max(0,reward-previous);p.best[g.level]=Math.max(previous,reward);p.moons+=earned;return {...score,earned}}
