const MUSIC='https://kunruiw1991.github.io/lumipop-kids-tv/videos/';
export const LEVELS=[
 {icon:'🌲',name:'月光森林',track:'dh_02_golden_lyrics.mp4',song:'Golden',sky:['#14212f','#1e343d'],ground:['#54725b','#4c6955','#486451'],edge:'#314b4b',tree:.17},
 {icon:'🌉',name:'星河三桥',track:'dh_01_soda_pop.mp4',song:'Soda Pop',sky:['#142c49','#245669'],ground:['#78997c','#60856c','#557b67'],edge:'#355969',tree:.11},
 {icon:'❄️',name:'冰河急袭',track:'dh_04_what_it_sounds_like.mp4',song:'What It Sounds Like',sky:['#253e64','#597c95'],ground:['#c9e0e0','#b4d0d6','#9dbec9'],edge:'#759cbb',tree:.08},
 {icon:'🏜️',name:'流沙虫洞',track:'dh_03_takedown_finale.mp4',song:'Takedown',sky:['#3b2535','#705047'],ground:['#c5a174','#b58f65','#a6805b'],edge:'#795d4e',tree:.06},
 {icon:'🌋',name:'浴火围攻',track:'dh_05_your_idol_stage.mp4',song:'Your Idol',sky:['#261d31','#4a2930'],ground:['#74636c','#635660','#564c5a'],edge:'#413442',tree:.05},
 {icon:'🏰',name:'暗夜双王城',track:'dh_08_golden_takedown.mp4',song:'Golden / Takedown',sky:['#17162d','#352e50'],ground:['#7e7696','#6d6785','#615c76'],edge:'#403e5b',tree:.07}
];
export const levelInfo=n=>LEVELS[((Math.max(1,Math.floor(n)||1)-1)%LEVELS.length)];
export const musicForLevel=n=>MUSIC+levelInfo(n).track;
export function makeTerrain(level){const type=(level-1)%6,cells=[];for(let y=0;y<18;y++)for(let x=0;x<22;x++){let tile=type===2?'snow':'grass';const safe=Math.hypot(x-11,y-9)<3.6,edge=x===0||y===0||x===21||y===17;
 if(!safe&&!edge){if(type===1&&(x===6||x===15))tile=[4,9,14].includes(y)?'bridge':'water';if(type===3&&((x*7+y*3)%17<3))tile='sand';if(type===4&&(x===5||x===16||y===4||y===13))tile='lava';if(type===5&&[5,8,14,17].includes(x)&&[4,7,11,14].includes(y))tile='rock'}if(type===2&&Math.hypot(x-11,y-9)>2.6&&(Math.abs(y-9)<=1||Math.abs(x-11)<=1))tile='ice';if(type===3&&[[3,6],[18,12],[11,2],[11,15]].some(([a,b])=>x===a&&y===b))tile='burrow';cells.push(tile)}return cells}
export const terrainAt=(g,x,y)=>g.terrain?.[Math.round(y)*22+Math.round(x)]||'grass';
export const walkable=(g,x,y)=>!['water','rock'].includes(terrainAt(g,x,y));
export const movementFactor=(g,e)=>terrainAt(g,e.x,e.y)==='ice'?1.7:terrainAt(g,e.x,e.y)==='sand'?1.12:1;
export const buildableTerrain=(g,x,y)=>walkable(g,x,y)&&!['ice','burrow','lava'].includes(terrainAt(g,x,y));
export const spawnGates=level=>(level-1)%6===2?[[0,9],[11,0],[21,9],[11,17]]:(level-1)%6===3?[[3,6],[18,12],[11,2],[11,15]]:[];
export function encounterKind(level,wave,n,fallback){
 if(level>=3){if(wave===6&&n===1)return 'boss';if(level>=6&&wave===6&&n===8)return 'boss';if(wave>=3&&n===8)return 'summoner';if(wave>=2&&n===4)return 'healer';if(n===5)return 'brute';if(n===7)return level>=4?'bomber':'spitter';if(wave>=2&&n===3)return 'spitter';}
 if(wave<=2)return fallback==='runner'?'runner':'zombie';
 if(wave===3)return n===5?'brute':fallback==='runner'?'runner':'zombie';
 if(wave===4)return n===6?'spitter':n===5?'brute':fallback==='runner'?'runner':'zombie';
 if(level>=6&&wave===6&&n===8)return 'boss';
 return fallback;
}
