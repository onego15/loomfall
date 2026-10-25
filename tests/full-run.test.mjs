import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {simulate} from '../tools/pilot.mjs';
for(const [build,loadout,seed] of [['storm','silk',12],['needles','ember',219],['garden','frost',84]]){
  test(`full normal run: ${build}, seed ${seed}`,{timeout:120000},()=>{
    const {game:g}=simulate(Game,{build,loadout,seed});
    assert.equal(g.state,'won');assert.equal(g.bossKills,3);
    assert(g.time>=660&&g.time<900);assert(g.level>20&&g.level<50);
    assert(g.weaves>60);assert(g.kills>1000);assert(g.stats.damageTaken>0);
    assert(Object.keys(g.build).length<16,'Upgrade choices still create different final builds');
    assert(g.enemies.length<=240);assert(g.player.hp>0);
  });
}
