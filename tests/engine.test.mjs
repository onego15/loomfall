import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,inside,polygonArea,UPGRADES,WORLD} from '../src/engine.js';
import {simulate} from '../tools/pilot.mjs';
test('a drawn domain damages only enclosed enemies and vacuums its XP',()=>{
  const g=new Game({seed:12});g.enemies=[];g.gems=[];
  const enemy=g.spawnEnemy('brute',0);Object.assign(enemy,{x:0,y:0,hp:1000,maxHp:1000});
  const outside=g.spawnEnemy('drifter',0);Object.assign(outside,{x:400,y:0,hp:1000,maxHp:1000});
  g.trail=[{x:-120,y:-120},{x:120,y:-120},{x:120,y:120}];g.player.x=-120;g.player.y=120;
  g.gems=[{x:10,y:10,value:2},{x:400,y:0,value:2}];g.grid.build(g.enemies);assert.equal(g.weave(),true);
  assert(enemy.hp<1000);assert.equal(outside.hp,1000);assert.equal(g.gems[0].vacuum,true);assert.equal(g.gems[1].vacuum,undefined);assert.equal(g.weaves,1);assert.equal(g.weave(),false);assert.equal(g.nets.length,1);
});
test('concave and crossed thread uses even-odd containment without NaN',()=>{
  const p=[{x:0,y:0},{x:100,y:0},{x:50,y:50},{x:100,y:100},{x:0,y:100}];assert(inside({x:20,y:50},p));assert(!inside({x:90,y:50},p));assert.equal(polygonArea(p),7500);
  const g=new Game({seed:4});g.trail=[{x:0,y:0},{x:100,y:100},{x:0,y:100}];g.player.x=100;g.player.y=0;g.weave();assert(Number.isFinite(g.damage));
});
test('stationary knot, zero input dash, invalid input and arena edge stay safe',()=>{
  const g=new Game({seed:2});g.grid.build(g.enemies);assert(g.weave());assert.equal(g.weaves,0);assert(g.dash({x:0,y:0}));for(let i=0;i<120;i++)g.update(1/30,{x:NaN,y:Infinity});assert(Number.isFinite(g.player.x));g.player.x=WORLD*4;g.update(.03,{x:1,y:0});assert(Math.hypot(g.player.x,g.player.y)<=WORLD-49.9);assert(g.trail.length<100);
});
test('level choices are distinct, ranks cap, and invalid actions cannot advance',()=>{
  const g=new Game({seed:9});g.xp=100;g.update(.03);assert.equal(g.state,'upgrade');assert.equal(new Set(g.choices.map(u=>u.id)).size,3);assert(!g.choose('invalid'));assert(!g.weave());assert(!g.dash({x:1,y:0}));const old=g.rerolls;assert(g.reroll());assert.equal(g.rerolls,old-1);const id=g.choices[0].id;assert(g.choose(id));assert.equal(g.rank(id),1);assert.equal(g.state,'playing');for(const u of UPGRADES)g.build[u.id]=u.max;g.offer();assert.equal(g.choices.length,0);
});
test('all upgrades together, mass enemies, echo, poison and chain remain bounded',()=>{
  const g=new Game({seed:84});for(const u of UPGRADES)g.build[u.id]=u.max;g.time=670;g.player.hp=g.player.maxHp=99999;
  for(let i=0;i<270;i++)g.spawnEnemy();g.trail=[{x:-600,y:-600},{x:600,y:-600},{x:600,y:600}];g.player.x=-600;g.player.y=600;g.grid.build(g.enemies);g.weave();
  for(let i=0;i<900;i++){if(g.state==='upgrade')g.choose(g.choices[0].id);g.update(1/30,{x:Math.cos(i*.02),y:Math.sin(i*.02)});g.popEvents()}
  assert(g.enemies.length<=240);assert(g.particles.length<=650);assert(g.gems.length<=500);assert(Number.isFinite(g.damage));for(const e of g.enemies)assert(Number.isFinite(e.hp));
});
test('defeat and a fresh retry have independent state',()=>{const g=new Game({seed:1});g.player.inv=0;g.hurt(1000,0,0);assert.equal(g.state,'lost');assert.equal(g.player.hp,0);const fresh=new Game({seed:1});assert.equal(fresh.state,'playing');assert.equal(fresh.level,1);assert.equal(fresh.weaves,0);assert.equal(fresh.kills,0)});
test('boss victory is reachable and emits ending once',()=>{const g=new Game({seed:1});const e=g.spawnBoss(2);g.attack(e,1e6,'net');assert.equal(g.state,'won');assert.equal(g.bossKills,1);const n=g.kills;g.attack(e,1e6,'net');assert.equal(g.kills,n);assert.equal(g.popEvents().filter(e=>e.type==='win').length,1)});
test('seeded control is reproducible',()=>{const a=simulate(Game,{seed:84,seconds:60}).summary,b=simulate(Game,{seed:84,seconds:60}).summary;delete a.simulationMs;delete b.simulationMs;assert.deepEqual(a,b)});
