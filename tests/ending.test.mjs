import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,save} from '../engine.mjs';
// Run the real app event handlers with a minimal DOM and a saved final-wave state.
test('winning opens celebration, freezes combat, unlocks harder level and starts it fresh',async()=>{
 const context=new Proxy({}, {get:()=>()=>context});
 class Element{constructor(){this.hidden=false;this.disabled=false;this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.listeners={};this.children=[];this.firstElementChild={style:{}}}addEventListener(k,f){this.listeners[k]=f}click(){(this.onclick||this.listeners.click)?.({})}setAttribute(k,v){this[k]=v}append(...x){this.children.push(...x)}replaceChildren(){this.children=[]}getContext(){return context}getBoundingClientRect(){return {width:1024,height:650,left:0,top:0}}focus(){}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
 const nodes=new Map(),el=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
 globalThis.document={getElementById:el,createElement:()=>new Element(),querySelector:el,addEventListener(){}};globalThis.innerWidth=1024;globalThis.innerHeight=768;globalThis.devicePixelRatio=1;globalThis.matchMedia=()=>({matches:true});globalThis.window={innerWidth:1024,innerHeight:768,devicePixelRatio:1,addEventListener(){}};globalThis.Image=class{};globalThis.ResizeObserver=class{observe(){}};let frame;globalThis.requestAnimationFrame=f=>{frame=f};
 const data=new Map(),g=createGame({level:2});g.cleared=5;g.wave=6;g.waveActive=true;g.remaining=0;g.moon=0;g.star=0;g.enemies=[{id:999,kind:"boss",hp:0,x:11,y:9}];data.set('moonfall-save',save(g));globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const originalTimer=globalThis.setTimeout;globalThis.setTimeout=()=>0;
 try{await import('../app.mjs');el('resumeSave').click();assert.equal(el('ending').hidden,false);assert.equal(el('endingTrophy').textContent,'🏆');assert.equal(el('party').children.length,8);assert.equal(el('harder').hidden,false);assert.equal(data.get('moonfall-unlocked'),'3');assert.deepEqual(JSON.parse(data.get('moonfall-pieces')),[2]);assert.equal(data.has('moonfall-save'),false);assert.equal(el('pause').disabled,true);
 el('harder').click();const next=JSON.parse(data.get('moonfall-save'));assert.equal(next.level,3);assert.ok(el('music').src.endsWith('dh_04_what_it_sounds_like.mp4'));assert.ok(next.terrain.includes('ice'));assert.equal(next.wave,0);assert.equal(next.moon,0);assert.equal(next.over,null);assert.equal(el('ending').hidden,true);assert.equal(el('cinema').hidden,true);assert.equal(el('pause').disabled,false);
 // Defeat never offers the harder-level action.
 next.core=0;next.over=null;data.set('moonfall-save',save(next));el('resumeSave').click();frame(performance.now()+300);assert.equal(el('harder').hidden,true);assert.equal(el('endingTrophy').textContent,'💛 🛠️');assert.equal(data.get('moonfall-unlocked'),'3');el('retry').click();assert.equal(JSON.parse(data.get('moonfall-save')).level,3);
 // Existing five collected pieces plus a real final-wave win reaches the campfire.
 data.set('moonfall-pieces',JSON.stringify([1,2,3,4,5]));
 // Reload the app module to read persisted campaign progress.
 await import('../app.mjs?finale-test');
 const final=createGame({level:6});final.wave=6;final.cleared=6;data.set('moonfall-save',save(final));el('resumeSave').click();
 assert.deepEqual(JSON.parse(data.get('moonfall-pieces')),[1,2,3,4,5,6]);assert.equal(el('storyScene').hidden,false);assert.equal(el('party').hidden,true);assert.equal(el('endingTrophy').hidden,true);assert.equal(el('harder').hidden,false);assert.equal(el('endingStats').textContent,'🌙 6/6　🧩 +1');
 }finally{globalThis.setTimeout=originalTimer}
});
