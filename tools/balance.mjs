import {Game} from '../src/engine.js';
import {simulate} from './pilot.mjs';
import fs from 'node:fs/promises';
const results=[];
for(const build of ['storm','needles','garden'])for(const seed of [12,84,219]){
  const {summary}=simulate(Game,{seed,loadout:build==='needles'?'ember':build==='garden'?'frost':'silk',build});
  results.push(summary);console.log(JSON.stringify(summary));
}
await fs.writeFile('docs/balance.json',JSON.stringify({date:new Date().toISOString(),results},null,2));
