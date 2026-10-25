// QA-only controller. It uses the same movement speed, cooldowns and offered upgrades as a player.
export const BUILD_PRIORITIES={
  storm:['chain','thread','length','bloom','frost','echo','leech','vital','step','magnet','fork','haste','needle','glass','orbit','venom'],
  needles:['needle','fork','haste','venom','orbit','step','vital','leech','thread','magnet','frost','echo','chain','length','glass','bloom'],
  garden:['bloom','frost','glass','echo','thread','length','leech','step','vital','magnet','chain','haste','needle','fork','orbit','venom']
};
export function chooseFor(g,build='storm'){const prefs=BUILD_PRIORITIES[build];const offered=[...g.choices].sort((a,b)=>prefs.indexOf(a.id)-prefs.indexOf(b.id));g.choose(offered[0].id)}
export function pilot(g){
  const boss=g.enemies.find(e=>e.type==='boss');const center=boss||{x:0,y:0};const radius=boss?130:200,angular=boss?1.05:.82,angle=g.time*angular;
  const tx=center.x+Math.cos(angle)*radius,ty=center.y+Math.sin(angle)*radius;
  let x=tx-g.player.x,y=ty-g.player.y;let len=Math.hypot(x,y);x/=len||1;y/=len||1;
  if(g.netCD<=0&&g.trailLength>(boss?720:1050)&&g.area>1800)g.weave();
  if(g.player.dashCD<=0&&g.enemies.some(e=>Math.hypot(e.x-g.player.x,e.y-g.player.y)<e.r+33))g.dash({x,y});
  return{x,y};
}
export function simulate(Game,{seed=1,loadout='silk',build='storm',seconds=1000,meta={}}={}){
  const g=new Game({seed,loadout,meta});let steps=0;const start=performance.now();
  while(g.time<seconds&&steps++<seconds*60){if(g.state==='upgrade')chooseFor(g,build);if(g.state!=='playing')break;g.update(1/30,pilot(g));g.popEvents()}
  return{game:g,summary:{seed,loadout,strategy:build,...g.snapshot(),simulationMs:Math.round(performance.now()-start)}};
}
