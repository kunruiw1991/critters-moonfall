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
 const data=new Map(),g=createGame({level:2});g.cleared=6;g.wave=6;g.moon=2;g.star=80;data.set('moonfall-save',save(g));globalThis.localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const originalTimer=globalThis.setTimeout;globalThis.setTimeout=()=>0;
 try{await import('../app.mjs');el('resumeSave').click();el('moon').click();assert.equal(el('ending').hidden,false);assert.equal(el('endingTrophy').textContent,'🏆');assert.equal(el('party').children.length,8);assert.equal(el('harder').hidden,false);assert.equal(data.get('moonfall-unlocked'),'3');assert.equal(data.has('moonfall-save'),false);assert.equal(el('pause').disabled,true);
 el('harder').click();const next=JSON.parse(data.get('moonfall-save'));assert.equal(next.level,3);assert.equal(next.wave,0);assert.equal(next.moon,0);assert.equal(next.over,null);assert.equal(el('ending').hidden,true);assert.equal(el('cinema').hidden,true);assert.equal(el('pause').disabled,false);
 // Defeat never offers the harder-level action.
 next.core=0;next.over=null;data.set('moonfall-save',save(next));el('resumeSave').click();frame(performance.now()+300);assert.equal(el('harder').hidden,true);assert.equal(el('endingTrophy').textContent,'💛 🛠️');assert.equal(data.get('moonfall-unlocked'),'3');el('retry').click();assert.equal(JSON.parse(data.get('moonfall-save')).level,3);
 }finally{globalThis.setTimeout=originalTimer}
});
