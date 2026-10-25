// Pure deterministic simulation. Rendering, audio and DOM never influence combat.
export const WORLD=1550;
export const RUN_LENGTH=720;
export const TAU=Math.PI*2;
export const LOADOUTS=[
  {id:'silk',name:'翡翠の糸',en:'JADE SILK',glyph:'⌁',detail:'領域の威力 +25%',color:'#91e2c6'},
  {id:'ember',name:'朱の糸',en:'EMBER SILK',glyph:'✺',detail:'針の威力 +30%',color:'#edaa7d'},
  {id:'frost',name:'月白の糸',en:'MOON SILK',glyph:'❋',detail:'領域が敵を60%減速',color:'#a7ceec'}
];
export const UPGRADES=[
  {id:'needle',name:'月針',glyph:'↗',tag:'NEEDLE / 針',max:5,desc:'自動攻撃の威力 +35%。Lv.3で貫通、Lv.5で3体を貫通。',synergy:'刈り残しを、確実に仕留める。'},
  {id:'fork',name:'双子の梭',glyph:'⋔',tag:'NEEDLE / 分裂',max:3,desc:'同時に放つ針 +1。近くの敵へそれぞれ狙いを定める。',synergy:'月針・毒の刺繍と好相性。'},
  {id:'haste',name:'早織り',glyph:'»',tag:'RHYTHM / 速度',max:4,desc:'針の発射間隔 −14%。結びの再使用も −10%。',synergy:'小さな輪を、絶え間なく重ねる。'},
  {id:'thread',name:'金継ぎの糸',glyph:'⌘',tag:'THREAD / 糸',max:5,desc:'結びの威力 +30%。歩いた糸の継続ダメージも強化。',synergy:'狙って囲むほど、強くなる。'},
  {id:'length',name:'果てなき紡錘',glyph:'∞',tag:'THREAD / 長さ',max:3,desc:'残せる糸の長さ +30%。結びの威力 +20%。',synergy:'大きく囲めば、大きく収穫。'},
  {id:'bloom',name:'残響の花',glyph:'✿',tag:'DOMAIN / 残響',max:4,desc:'結んだ領域が +1.5秒残り、継続ダメージを与える。',synergy:'霜の繭で敵を長く留める。'},
  {id:'frost',name:'霜の繭',glyph:'❋',tag:'DOMAIN / 凍結',max:3,desc:'領域内の敵を減速。Lv.3で敵弾も遅くし、結び時に消去。',synergy:'残響の花・硝子の庭と好相性。'},
  {id:'venom',name:'毒の刺繍',glyph:'♧',tag:'ALCHEMY / 毒',max:4,desc:'針と糸が毒を付与。毎秒8ダメージ、4秒持続。倒すと近くへ毒が伝播。',synergy:'双子の梭で、庭中へ種をまく。'},
  {id:'chain',name:'雷の縫い目',glyph:'ϟ',tag:'ALCHEMY / 連鎖',max:3,desc:'領域内で敵を倒すと近くの敵3体へ雷が走る。',synergy:'大量の群れをひと結びで連鎖収穫。'},
  {id:'glass',name:'硝子の庭',glyph:'◇',tag:'DOMAIN / 結晶',max:3,desc:'結びの頂点から、内側の敵を狙う結晶針が飛び出す。',synergy:'月針の威力と貫通を引き継ぐ。'},
  {id:'leech',name:'命の縫い取り',glyph:'♡',tag:'LIFE / 再生',max:3,desc:'一度の結びで3体以上を倒すと生命を4回復。最大3段階。',synergy:'危険な大収穫が、生きる糧になる。'},
  {id:'magnet',name:'宵の引力',glyph:'◎',tag:'GROWTH / 収集',max:3,desc:'経験値を拾う範囲 +55%。収穫した経験値 +12%。',synergy:'領域で囲んだ経験値は、自動で回収。'},
  {id:'vital',name:'不滅の繭',glyph:'⬡',tag:'LIFE / 生命',max:3,desc:'最大生命 +25。生命を35回復し、接触ダメージを軽減。',synergy:'大きな輪を狙うための、余裕を。'},
  {id:'step',name:'風渡り',glyph:'≋',tag:'MOTION / 疾走',max:3,desc:'移動速度 +10%。すり抜けの再使用 −20%。',synergy:'長い糸を素早く張り、群れを導く。'},
  {id:'orbit',name:'衛星の繭',glyph:'☽',tag:'NEEDLE / 衛星',max:3,desc:'周囲を巡る刃の繭 +1。近づく敵を切り裂く。',synergy:'安全な懐が、美しい輪を生む。'},
  {id:'echo',name:'二重結び',glyph:'⧖',tag:'DOMAIN / 再演',max:2,desc:'結びの0.7秒後、同じ領域に威力40%の再収穫。Lv.2で70%。',synergy:'霜の繭で足止めし、もう一度。'}
];
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function polygonArea(points){let a=0;for(let i=0,j=points.length-1;i<points.length;j=i++)a+=points[j].x*points[i].y-points[i].x*points[j].y;return Math.abs(a)*.5}
export function inside(p,points){let c=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)c=!c}return c}
export function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)}
export function seeded(seed=1){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=Math.imul(s^(s>>>15),1|s);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
const domainBounds=new WeakMap();
export function inDomain(p,points){let b=domainBounds.get(points);if(!b){b={x0:Infinity,y0:Infinity,x1:-Infinity,y1:-Infinity};for(const v of points){b.x0=Math.min(b.x0,v.x);b.y0=Math.min(b.y0,v.y);b.x1=Math.max(b.x1,v.x);b.y1=Math.max(b.y1,v.y)}domainBounds.set(points,b)}const pad=(p.r||0)+34;if(p.x<b.x0-pad||p.x>b.x1+pad||p.y<b.y0-pad||p.y>b.y1+pad)return false;if(inside(p,points))return true;for(let i=0,j=points.length-1;i<points.length;j=i++)if(segmentDistance(p,points[j],points[i])<(p.r||0)+34)return true;return false}
const BOSS_NAMES=['茨の司祭','空蝉の女王','夜を喰むもの'];
class Grid{
  constructor(){this.cells=new Map();this.size=110}
  build(es){this.cells.clear();for(const e of es){if(e.dead)continue;const key=Math.floor(e.x/this.size)+','+Math.floor(e.y/this.size);let cell=this.cells.get(key);if(!cell)this.cells.set(key,cell=[]);cell.push(e)}}
  query(x,y,r){const result=[];for(let a=Math.floor((x-r)/this.size);a<=Math.floor((x+r)/this.size);a++)for(let b=Math.floor((y-r)/this.size);b<=Math.floor((y+r)/this.size);b++){const cell=this.cells.get(a+','+b);if(cell)for(const e of cell)result.push(e)}return result}
}
export class Game{
  constructor({seed=Date.now(),loadout='silk',meta={}}={}){
    this.rng=seeded(seed);this.seed=seed;this.loadout=loadout;this.time=0;this.state='playing';this.player={x:0,y:0,hp:100+(meta.heart||0)*8,maxHp:100+(meta.heart||0)*8,r:13,angle:-Math.PI/2,inv:1,dash:0,dashCD:0};
    this.meta=meta;this.enemies=[];this.bullets=[];this.shots=[];this.gems=[];this.nets=[];this.particles=[];this.floats=[];this.arcs=[];this.events=[];this.trail=[{x:0,y:0}];this.trailLength=0;this.trailTick=0;this.netCD=0;this.dashTrail=[];this.level=1;this.xp=0;this.nextXp=10;this.kills=0;this.weaves=0;this.biggest=0;this.damage=0;this.build={};this.choices=[];this.spawnCD=.3;this.fireCD=.2;this.orbitCD=0;this.combo=0;this.comboTimer=0;this.bossIndex=0;this.bossKills=0;this.shake=0;this.flash=0;this.lastArea=0;this.rerolls=2;this.grid=new Grid();this.uid=0;this.stats={netKills:0,needleKills:0,bigWeaves:0,dashes:0,damageTaken:0};this.rewarded=false;this.netHits=0;this.maxEnemies=0;
    for(let i=0;i<8;i++){const a=this.rng()*TAU,r=100+this.rng()*130;this.gems.push({x:Math.cos(a)*r,y:Math.sin(a)*r,value:1})}
    for(let i=0;i<12;i++)this.spawnEnemy('drifter',280+i*16);
  }
  rank(id){return this.build[id]||0}
  get speed(){return 188*(1+.1*this.rank('step')+.025*(this.meta.step||0))}
  get weaveCooldown(){return 3.2*Math.pow(.9,this.rank('haste'))}
  get maxThread(){return 1150*(1+.3*this.rank('length'))}
  get area(){return polygonArea([...this.trail,this.player])}
  get needleDamage(){return 15*(1+.35*this.rank('needle'))*(this.loadout==='ember'?1.3:1)*(1+Math.min(this.combo,20)*.025)}
  event(type,data={}){this.events.push({type,...data})}
  popEvents(){const e=this.events;this.events=[];return e}
  fx(x,y,color,count=10,power=1){for(let i=0;i<count;i++){if(this.particles.length>=650)break;const a=this.rng()*TAU,s=(20+this.rng()*120)*power;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35+this.rng()*.5,max:.85,color,size:1+this.rng()*3})}}
  float(x,y,text,color='#dae7bd',big=false){if(this.floats.length<55)this.floats.push({x,y,text,color,life:big?1.5:.8,max:big?1.5:.8,big})}
  spawnEnemy(type=null,radius=null){
    if(this.enemies.length>=240)return;
    const a=this.rng()*TAU,r=radius??(610+this.rng()*170);let x=this.player.x+Math.cos(a)*r,y=this.player.y+Math.sin(a)*r;
    if(Math.hypot(x,y)>WORLD-30){const l=Math.hypot(x,y);x=x/l*(WORLD-45);y=y/l*(WORLD-45)}
    if(!type){const n=this.rng();type=this.time>150&&n<.1?'lantern':this.time>70&&n<.24?'brute':this.time>25&&n<.51?'skitter':'drifter'}
    const spec={drifter:[23,52,13,6,2],skitter:[17,82,10,5,2],brute:[80,36,22,12,5],lantern:[42,37,17,8,4]}[type];
    const e={id:++this.uid,type,x,y,hp:spec[0]*(1+this.time/330),maxHp:spec[0]*(1+this.time/330),speed:spec[1]*(1+Math.min(this.time/1200,.6)),r:spec[2],damage:spec[3],xp:spec[4],phase:this.rng()*TAU,hit:0,slow:0,poison:0,poisonD:0,attackCD:2+this.rng()*2,dead:false};this.enemies.push(e);return e;
  }
  spawnBoss(index){
    const a=this.rng()*TAU,x=this.player.x+Math.cos(a)*390,y=this.player.y+Math.sin(a)*390;
    const hp=[2200,4800,10000][index];const e={id:++this.uid,type:'boss',boss:index,name:BOSS_NAMES[index],x,y,hp,maxHp:hp,speed:35+index*7,r:46+index*7,damage:24,xp:60,phase:0,hit:0,slow:0,poison:0,poisonD:0,attackCD:3,dead:false,charge:0,chargeA:0};this.enemies.push(e);this.event('boss',{name:e.name,index});this.fx(x,y,'#edaa7d',50,2);return e;
  }
  attack(e,amount,source='needle',noChain=false){
    if(!e||e.dead)return false;
    if(e.type==='brute'&&source==='needle')amount*=.55;
    e.hp-=amount;this.damage+=amount;e.hit=.12;
    if(this.rng()<.18||amount>55)this.float(e.x,e.y-e.r,Math.round(amount),source==='net'?'#a6e7ca':'#e2d7b2');
    if(this.rank('venom')&&source!=='poison'){e.poison=4;e.poisonD=8*this.rank('venom')}
    if(e.hp>0)return false;
    e.dead=true;this.kills++;this.stats[source==='net'?'netKills':'needleKills']++;this.combo++;this.comboTimer=5;
    const value=e.xp;this.gems.push({x:e.x,y:e.y,value,vacuum:source==='net'});this.fx(e.x,e.y,e.type==='boss'?'#e8bd7d':source==='net'?'#9fdfbd':'#c3876e',e.type==='boss'?80:7,e.type==='boss'?2:1);
    if(e.poison>0&&this.rank('venom')&&!noChain){const nearby=this.grid.query(e.x,e.y,115).filter(n=>n!==e&&!n.dead&&dist(n,e)<115).slice(0,6);for(const n of nearby){n.poison=4;n.poisonD=8*this.rank('venom');this.attack(n,10*this.rank('venom'),'poison',true)}this.fx(e.x,e.y,'#b9cd87',6)}
    if(source==='net'&&this.rank('chain')&&!noChain){const nearby=this.grid.query(e.x,e.y,160).filter(n=>n!==e&&!n.dead&&dist(n,e)<160).slice(0,3+this.rank('chain'));for(const n of nearby){this.arcs.push({x:e.x,y:e.y,tx:n.x,ty:n.y,life:.28});this.attack(n,24*this.rank('chain'),'net',true)}}
    if(e.type==='boss'){this.bossKills++;this.event('bossKill',{name:e.name});this.player.hp=Math.min(this.player.maxHp,this.player.hp+30);this.shake=12;this.flash=.25;for(let i=0;i<16;i++){const a=this.rng()*TAU;this.gems.push({x:e.x+Math.cos(a)*60,y:e.y+Math.sin(a)*60,value:3})}if(e.boss===2){this.state='won';this.event('win')}}
    return true;
  }
  dash(input){if(this.state!=='playing'||this.player.dashCD>0)return false;let x=input.x||0,y=input.y||0;const len=Math.hypot(x,y);if(len<.1){x=Math.cos(this.player.angle);y=Math.sin(this.player.angle)}else{x/=len;y/=len}this.player.dash=.2;this.player.dashCD=4*Math.pow(.8,this.rank('step'));this.player.inv=Math.max(this.player.inv,.42);this.player.dx=x;this.player.dy=y;this.stats.dashes++;this.event('dash');return true}
  weave(){
    if(this.state!=='playing'||this.netCD>0)return false;
    const points=this.trail.map(p=>({...p}));points.push({x:this.player.x,y:this.player.y});const area=polygonArea(points);this.lastArea=area;const big=area>45000;
    const power=(28+Math.sqrt(area)*.17)*(1+.3*this.rank('thread'))*(this.loadout==='silk'?1.25:1)*(1+this.rank('length')*.2)*(1+Math.min(20,this.combo)*.025);
    let hits=0,kills=0;const before=this.kills;
    if(area<1800||points.length<3){for(const e of this.grid.query(this.player.x,this.player.y,95))if(dist(e,this.player)<95){hits++;if(this.attack(e,24*(1+.3*this.rank('thread')),'net'))kills++}this.nets.push({points:[],x:this.player.x,y:this.player.y,r:95,life:.5,max:.5,power:0,tick:9,echo:0,small:true});this.netCD=1.4;this.event('knot');}
    else{
      this.weaves++;if(big)this.stats.bigWeaves++;this.biggest=Math.max(this.biggest,area);
      for(const e of this.enemies)if(!e.dead&&inDomain(e,points)){hits++;if(this.attack(e,power,'net'))kills++;e.slow=1}
      this.nets.push({points,life:2+1.5*this.rank('bloom'),max:2+1.5*this.rank('bloom'),power:power*.12,tick:.3,echo:this.rank('echo')?.7:0,echoPower:power*(this.rank('echo')===2?.7:.4),small:false});
      for(const g of this.gems)if(inside(g,points))g.vacuum=true;
      if(this.rank('glass')){const candidates=this.enemies.filter(e=>!e.dead&&inDomain(e,points));for(let i=0;i<points.length;i+=Math.max(1,Math.floor(points.length/(4+this.rank('glass')*2)))){const e=candidates[i%candidates.length];if(e)this.shoot(points[i],e,this.needleDamage*1.2,450)}}
      if(this.rank('frost')>=3)this.shots=this.shots.filter(s=>!inside(s,points));
      this.netCD=this.weaveCooldown;this.netHits=hits;this.shake=big?8:4;this.flash=.08;
      this.event('weave',{area,hits,kills:this.kills-before,big});
      if(hits>0)this.float(this.player.x,this.player.y-65,`${big?'大収穫':'結び'} · ${hits}体`,'#cfebbc',true);
    }
    if(this.kills-before>=3){this.player.hp=Math.min(this.player.maxHp,this.player.hp+5+Math.min(5,(this.kills-before)*.25)+4*this.rank('leech'));this.fx(this.player.x,this.player.y,'#badb91',18)}
    this.trail=[{x:this.player.x,y:this.player.y}];this.trailLength=0;return true;
  }
  shoot(from,to,damage,speed=570){const a=Math.atan2(to.y-from.y,to.x-from.x);this.bullets.push({x:from.x,y:from.y,px:from.x,py:from.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,damage,life:1.8,pierce:this.rank('needle')>=5?3:this.rank('needle')>=3?1:0,hitIds:new Set(),color:this.loadout==='ember'?'#efbf88':'#d8eac3'})}
  gainXp(value){this.xp+=value*(1+.12*this.rank('magnet')+.03*(this.meta.wisdom||0));}
  offer(){const pool=UPGRADES.filter(u=>this.rank(u.id)<u.max);const choices=[];while(pool.length&&choices.length<3){const i=Math.floor(this.rng()*pool.length);choices.push(pool.splice(i,1)[0])}this.choices=choices;if(!choices.length){this.player.hp=this.player.maxHp;this.event('heal');return}this.state='upgrade';this.event('level',{level:this.level});}
  choose(id){if(this.state!=='upgrade'||!this.choices.some(u=>u.id===id))return false;this.build[id]=(this.build[id]||0)+1;if(id==='vital'){this.player.maxHp+=25;this.player.hp=Math.min(this.player.maxHp,this.player.hp+35)}this.choices=[];this.state='playing';this.player.inv=Math.max(this.player.inv,.7);this.event('choose',{id});return true}
  reroll(){if(this.state!=='upgrade'||this.rerolls<=0)return false;this.rerolls--;this.offer();return true}
  hurt(damage,x,y){if(this.player.inv>0||this.state!=='playing')return;const d=damage*(1-.07*this.rank('vital'));this.player.hp-=d;this.stats.damageTaken+=d;this.player.inv=1.05;this.shake=7;this.event('hurt');this.fx(this.player.x,this.player.y,'#f2ae8c',12);const a=Math.atan2(this.player.y-y,this.player.x-x);this.player.x+=Math.cos(a)*15;this.player.y+=Math.sin(a)*15;if(this.player.hp<=0){this.player.hp=0;this.state='lost';this.event('lose')}}
  update(dt,input={x:0,y:0}){
    if(this.state!=='playing')return;
    dt=clamp(dt,0,.05);this.time+=dt;const p=this.player;
    this.comboTimer-=dt;if(this.comboTimer<0)this.combo=Math.max(0,this.combo-dt*4);
    this.netCD=Math.max(0,this.netCD-dt);p.inv=Math.max(0,p.inv-dt);p.dashCD=Math.max(0,p.dashCD-dt);p.dash=Math.max(0,p.dash-dt);this.shake=Math.max(0,this.shake-dt*22);this.flash=Math.max(0,this.flash-dt);
    const ix=Number.isFinite(input.x)?input.x:0,iy=Number.isFinite(input.y)?input.y:0,l=Math.hypot(ix,iy);if(l>.05){p.angle=Math.atan2(iy,ix);p.x+=ix/Math.max(1,l)*this.speed*dt;p.y+=iy/Math.max(1,l)*this.speed*dt}
    if(p.dash>0){p.x+=p.dx*this.speed*3*dt;p.y+=p.dy*this.speed*3*dt;if(this.dashTrail.length<15)this.dashTrail.push({x:p.x,y:p.y,angle:p.angle,life:.3})}
    const pr=Math.hypot(p.x,p.y);if(pr>WORLD-50){p.x*=((WORLD-50)/pr);p.y*=((WORLD-50)/pr)}
    const last=this.trail[this.trail.length-1];if(dist(p,last)>22){const n={x:p.x,y:p.y};this.trailLength+=dist(last,n);this.trail.push(n)}
    while(this.trailLength>this.maxThread&&this.trail.length>2){this.trailLength-=dist(this.trail[0],this.trail[1]);this.trail.shift()}
    this.grid.build(this.enemies);
    this.spawnCD-=dt;if(this.spawnCD<=0){this.spawnCD=Math.max(.1,.55-this.time*.0007);const count=2+Math.floor(this.time/170);for(let i=0;i<count;i++)this.spawnEnemy();}
    if(this.bossIndex<3&&this.time>=[210,420,660][this.bossIndex]){this.spawnBoss(this.bossIndex);this.bossIndex++}
    // Dawn is held until the final warden falls; surviving is never a soft lock.
    this.fireCD-=dt;if(this.fireCD<=0){this.fireCD=.7*Math.pow(.86,this.rank('haste'));const targets=this.grid.query(p.x,p.y,440).filter(e=>!e.dead&&dist(e,p)<440).sort((a,b)=>dist(a,p)-dist(b,p));for(let i=0;i<1+this.rank('fork');i++){const e=targets[i%targets.length];if(e)this.shoot(p,e,this.needleDamage)}if(targets.length)this.event('shoot')}
    this.trailTick-=dt;if(this.trailTick<=0){this.trailTick=.27;for(const e of this.enemies){if(e.dead)continue;for(let i=1;i<this.trail.length;i++)if(segmentDistance(e,this.trail[i-1],this.trail[i])<e.r+4){this.attack(e,(.7+this.rank('thread')*.8)*(1+Math.min(20,this.combo)*.025),'thread');e.slow=.8;break}}}
    this.orbitCD-=dt;if(this.orbitCD<=0&&this.rank('orbit')){this.orbitCD=.22;for(let i=0;i<this.rank('orbit');i++){const a=this.time*2.4+i*TAU/this.rank('orbit'),x=p.x+Math.cos(a)*70,y=p.y+Math.sin(a)*70;for(const e of this.grid.query(x,y,35))if(!e.dead&&Math.hypot(e.x-x,e.y-y)<e.r+15)this.attack(e,this.needleDamage*.65,'orbit')}}
    for(const n of this.nets){n.life-=dt;if(n.small)continue;n.tick-=dt;if(n.tick<=0){n.tick=.35;for(const e of this.enemies)if(!e.dead&&inDomain(e,n.points)){this.attack(e,n.power,'net');e.slow=.55+(this.loadout==='frost'||this.rank('frost')?this.rank('frost')*.15+.45:0)}}if(n.echo>0){n.echo-=dt;if(n.echo<=0){for(const e of this.enemies)if(!e.dead&&inDomain(e,n.points))this.attack(e,n.echoPower,'net');this.event('echo');this.arcs.push({points:n.points,life:.4})}}}
    for(const e of this.enemies){if(e.dead)continue;e.hit=Math.max(0,e.hit-dt);e.slow=Math.max(0,e.slow-dt);e.phase+=dt;if(e.poison>0){e.poison-=dt;this.attack(e,e.poisonD*dt,'poison');if(e.dead)continue}
      const a=Math.atan2(p.y-e.y,p.x-e.x),d=dist(e,p);let speed=e.speed*(e.slow>0?(this.loadout==='frost'?.4:clamp(.6-this.rank('frost')*.12,.2,.6)):1);
      if(e.type==='skitter')speed*=1+.35*Math.sin(e.phase*6);
      if(e.type==='lantern'&&d<340)speed*=d<260?-.45:0;
      if(e.type==='boss'){e.attackCD-=dt;e.charge=Math.max(0,e.charge-dt);if(e.attackCD<=0){e.attackCD=Math.max(2.3,4.5-e.boss*.6);const count=10+e.boss*5;for(let i=0;i<count;i++){const aa=i*TAU/count+e.phase*.5;this.shots.push({x:e.x,y:e.y,vx:Math.cos(aa)*(95+e.boss*23),vy:Math.sin(aa)*(95+e.boss*23),life:7,r:6,damage:9+e.boss*3})}e.charge=.9;e.chargeA=a;this.event('bossAttack');if(e.boss>0)for(let i=0;i<3;i++)this.spawnEnemy('skitter',400)}if(e.charge>.4){speed=0}else if(e.charge>0){e.x+=Math.cos(e.chargeA)*350*dt;e.y+=Math.sin(e.chargeA)*350*dt;speed=0}}
      if(e.type==='lantern'){e.attackCD-=dt;if(e.attackCD<=0&&d<650){e.attackCD=3.8;this.shots.push({x:e.x,y:e.y,vx:Math.cos(a)*155,vy:Math.sin(a)*155,life:5,r:5,damage:10})}}
      e.x+=Math.cos(a)*speed*dt;e.y+=Math.sin(a)*speed*dt;
      if(d<e.r+p.r)this.hurt(e.damage,e.x,e.y);
    }
    // Lightweight crowd separation prevents stacks from hiding the battlefield.
    for(const e of this.enemies){if(e.dead||e.type==='boss')continue;for(const n of this.grid.query(e.x,e.y,40)){if(n.id>=e.id||n.dead)continue;const dx=e.x-n.x,dy=e.y-n.y,d=Math.hypot(dx,dy),min=(e.r+n.r)*.8;if(d>0&&d<min){const f=(min-d)*dt*3;e.x+=dx/d*f;e.y+=dy/d*f;n.x-=dx/d*f;n.y-=dy/d*f}}}
    for(const b of this.bullets){b.px=b.x;b.py=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(const e of this.grid.query(b.x,b.y,80)){if(e.dead||b.hitIds.has(e.id))continue;if(segmentDistance(e,{x:b.px,y:b.py},b)<e.r+4){this.attack(e,b.damage,'needle');b.hitIds.add(e.id);if(b.pierce--<=0){b.life=0;break}}}}
    for(const s of this.shots){let slow=1;if(this.rank('frost')>=3)for(const n of this.nets)if(!n.small&&inside(s,n.points)){slow=.4;break}s.x+=s.vx*dt*slow;s.y+=s.vy*dt*slow;s.life-=dt;if(dist(s,p)<s.r+p.r){this.hurt(s.damage,s.x,s.y);s.life=0}}
    for(const gem of this.gems){const d=dist(gem,p),range=75*(1+.55*this.rank('magnet'));if(d<range||gem.vacuum){gem.vacuum=true;const v=Math.min(d,dt*(420+Math.max(0,220-d)));gem.x+=(p.x-gem.x)/(d||1)*v;gem.y+=(p.y-gem.y)/(d||1)*v;if(d<18){this.gainXp(gem.value);gem.dead=true}}}
    if(this.gems.length>500){const overflow=this.gems.splice(0,this.gems.length-450);const sum=overflow.reduce((v,g)=>v+(g.dead?0:g.value),0);if(sum)this.gems.push({x:p.x+100,y:p.y,value:sum,vacuum:false})}
    for(const s of this.particles){s.x+=s.vx*dt;s.y+=s.vy*dt;s.vx*=Math.exp(-dt*4);s.vy*=Math.exp(-dt*4);s.life-=dt}
    for(const f of this.floats){f.y-=dt*(f.big?15:32);f.life-=dt}
    for(const a of this.arcs)a.life-=dt;for(const d of this.dashTrail)d.life-=dt;
    this.enemies=this.enemies.filter(e=>!e.dead);this.bullets=this.bullets.filter(b=>b.life>0);this.shots=this.shots.filter(s=>s.life>0);this.gems=this.gems.filter(g=>!g.dead);this.nets=this.nets.filter(n=>n.life>0);this.particles=this.particles.filter(s=>s.life>0);this.floats=this.floats.filter(f=>f.life>0);this.arcs=this.arcs.filter(a=>a.life>0);this.dashTrail=this.dashTrail.filter(d=>d.life>0);this.maxEnemies=Math.max(this.maxEnemies,this.enemies.length);
    if(this.xp>=this.nextXp&&this.state==='playing'){this.xp-=this.nextXp;this.level++;this.nextXp=Math.floor(10+this.level*5.2+this.level*this.level*1.3);this.player.hp=Math.min(this.player.maxHp,this.player.hp+3);this.offer()}
  }
  reward(){return Math.floor(this.kills/65)+Math.floor(this.weaves/4)+Math.floor(this.time/60)+(this.state==='won'?25:0)}
  snapshot(){return{time:this.time,state:this.state,hp:this.player.hp,level:this.level,kills:this.kills,weaves:this.weaves,bossKills:this.bossKills,enemies:this.enemies.length,build:{...this.build},stats:{...this.stats},area:this.area,maxEnemies:this.maxEnemies,damage:this.damage}}
}
