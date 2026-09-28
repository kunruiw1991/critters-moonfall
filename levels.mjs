const MUSIC='https://kunruiw1991.github.io/lumipop-kids-tv/videos/';
export const LEVELS=[
 {icon:'🌲',name:'月光森林',track:'dh_02_golden_lyrics.mp4',song:'Golden',sky:['#14212f','#1e343d'],ground:['#54725b','#4c6955','#486451'],edge:'#314b4b',tree:.17},
 {icon:'🌉',name:'星河三桥',track:'dh_01_soda_pop.mp4',song:'Soda Pop',sky:['#142c49','#245669'],ground:['#78997c','#60856c','#557b67'],edge:'#355969',tree:.11},
 {icon:'❄️',name:'冰晶原野',track:'dh_04_what_it_sounds_like.mp4',song:'What It Sounds Like',sky:['#253e64','#597c95'],ground:['#c9e0e0','#b4d0d6','#9dbec9'],edge:'#759cbb',tree:.08},
 {icon:'🏜️',name:'赤岩峡谷',track:'dh_03_takedown_finale.mp4',song:'Takedown',sky:['#3b2535','#705047'],ground:['#c5a174','#b58f65','#a6805b'],edge:'#795d4e',tree:.06},
 {icon:'🌋',name:'熔岩裂隙',track:'dh_05_your_idol_stage.mp4',song:'Your Idol',sky:['#261d31','#4a2930'],ground:['#74636c','#635660','#564c5a'],edge:'#413442',tree:.05},
 {icon:'🏰',name:'暗夜双王城',track:'dh_08_golden_takedown.mp4',song:'Golden / Takedown',sky:['#17162d','#352e50'],ground:['#7e7696','#6d6785','#615c76'],edge:'#403e5b',tree:.07}
];
export const levelInfo=n=>LEVELS[((Math.max(1,Math.floor(n)||1)-1)%LEVELS.length)];
export const musicForLevel=n=>MUSIC+levelInfo(n).track;
export function makeTerrain(level){const type=(level-1)%6,cells=[];for(let y=0;y<18;y++)for(let x=0;x<22;x++){let tile=type===2?'snow':'grass';const safe=Math.hypot(x-11,y-9)<3.6,edge=x===0||y===0||x===21||y===17;
 if(!safe&&!edge){if(type===1&&(x===6||x===15))tile=[4,9,14].includes(y)?'bridge':'water';if(type===2&&((x<8&&y>10)||(x>14&&y<7)))tile='ice';if(type===3&&(y===5||y===12))tile=[4,11,17].includes(x)?'bridge':'rock';if(type===4&&[[5,5],[16,5],[5,13],[16,13]].some(([a,b])=>Math.hypot(x-a,y-b)<2.2))tile='lava';if(type===5&&[5,8,14,17].includes(x)&&[4,7,11,14].includes(y))tile='rock'}cells.push(tile)}return cells}
export const terrainAt=(g,x,y)=>g.terrain?.[Math.round(y)*22+Math.round(x)]||'grass';
export const walkable=(g,x,y)=>!['water','rock','lava'].includes(terrainAt(g,x,y));
export const movementFactor=(g,e)=>terrainAt(g,e.x,e.y)==='ice'?1.25:terrainAt(g,e.x,e.y)==='snow'?.93:1;
export function encounterKind(level,wave,n,fallback){const map=(level-1)%6;if(level>=6&&wave===6&&n===8)return 'boss';if(map===1&&wave>=2&&n%7===0)return 'spitter';if(map===2&&wave>=2&&n%4===0)return 'runner';if(map===3&&wave>=3&&n%6===0)return 'bomber';if(map===4&&wave>=4&&n%8===0)return 'summoner';if(map===5&&wave>=4&&n%8===0)return 'healer';return fallback}
