import {TAU,WORLD,seeded,clamp,LOADOUTS} from './engine.js';
const COL={mint:'#98e8cb',gold:'#d5c38f',ink:'#0b2027',ivory:'#eee6c8',red:'#d9876d'};
function canvas(w,h=w){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function path(c,pts,fill,stroke,width=1){c.beginPath();for(let i=0;i<pts.length;i++)i?c.lineTo(...pts[i]):c.moveTo(...pts[i]);c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}}
function ellipse(c,x,y,rx,ry,angle,fill,stroke){c.beginPath();c.ellipse(x,y,rx,ry,angle,0,TAU);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function line(c,x,y,tx,ty,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(tx,ty);c.stroke()}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function makePlayer(){const cv=canvas(120),c=cv.getContext('2d');c.translate(60,60);glow(c,0,0,52,'#99e9c51c');
  // Layered silk mantle, asymmetric hems, gilded seams, ivory moth mask.
  const g=c.createLinearGradient(-22,-5,22,36);g.addColorStop(0,'#6ba696');g.addColorStop(.5,'#d5dec1');g.addColorStop(1,'#446f68');
  path(c,[[-10,-8],[-21,6],[-29,32],[-14,27],[-6,38],[3,29],[14,35],[24,27],[18,7],[10,-8]],g,'#b6c8a0',1.3);
  for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*3,-4);c.quadraticCurveTo(i*8,15,i*9,29+Math.sin(i)*4);c.strokeStyle=i%2?'#f5ecc57a':'#2d5a5b88';c.lineWidth=1.2;c.stroke()}
  path(c,[[-8,-5],[-13,8],[0,17],[13,8],[8,-5]],'#183c40','#aebc8d');
  ellipse(c,0,-13,12,15,0,'#e7dec0','#978d6b');
  path(c,[[-10,-17],[-16,-27],[-5,-23],[0,-12],[5,-23],[16,-27],[10,-17],[5,-5],[0,0],[-5,-5]],'#ede6cd','#c3b38e');
  ellipse(c,-5,-15,3,5,-.3,'#10292c');ellipse(c,5,-15,3,5,.3,'#10292c');line(c,0,-8,0,-3,'#8b967e');
  c.strokeStyle='#e4d6a5';c.lineWidth=1.3;c.beginPath();c.moveTo(-4,-24);c.quadraticCurveTo(-8,-38,-17,-35);c.moveTo(4,-24);c.quadraticCurveTo(8,-38,17,-35);c.stroke();
  line(c,15,7,33,-11,'#e8dcb4',2);line(c,33,-11,38,-17,'#b7efd2',1);ellipse(c,31,-8,3,4,.6,'#c5d9b2');glow(c,37,-16,10,'#b4ffdb77');return cv;
}
function makeEnemy(type){const s=type==='boss'?240:96,cv=canvas(s),c=cv.getContext('2d');c.translate(s/2,s/2);
  if(type==='drifter'){
    for(const sign of [-1,1]){c.save();c.scale(sign,1);const g=c.createLinearGradient(0,-20,30,15);g.addColorStop(0,'#c9a480');g.addColorStop(.45,'#aa6a55');g.addColorStop(1,'#503f44');c.beginPath();c.moveTo(0,-9);c.bezierCurveTo(16,-37,38,-30,30,-8);c.bezierCurveTo(44,5,18,21,6,15);c.lineTo(0,2);c.fillStyle=g;c.fill();c.strokeStyle='#d3a482';c.lineWidth=.8;c.stroke();for(let j=0;j<3;j++)line(c,3,-5,27-j*6,-18+j*12,'#e7be8d66',.7);ellipse(c,19,-13,5,7,-.7,'#473b3e','#bc8b70');ellipse(c,19,-14,2,3,0,'#d6a978');c.restore()}
    ellipse(c,0,4,4,17,0,'#54423e','#bc8b70');ellipse(c,0,-10,6,7,0,'#d6c297');ellipse(c,-2,-11,1.4,2,0,'#482c34');ellipse(c,2,-11,1.4,2,0,'#482c34');line(c,-3,-15,-10,-25,'#c1ad85');line(c,3,-15,10,-25,'#c1ad85');
  }else if(type==='skitter'){
    for(const sign of [-1,1])for(let i=0;i<3;i++){c.beginPath();c.moveTo(sign*5,-10+i*9);c.lineTo(sign*(23+i*2),-20+i*15);c.lineTo(sign*(32-i*4),-9+i*15);c.strokeStyle='#8e8973';c.lineWidth=2;c.stroke();ellipse(c,sign*(23+i*2),-20+i*15,2,2,0,'#c6ac7a')}
    const g=c.createLinearGradient(0,-20,0,22);g.addColorStop(0,'#c58e70');g.addColorStop(1,'#4b4d48');ellipse(c,0,3,12,20,0,g,'#c59b7b');for(let i=-1;i<=2;i++)line(c,-10,i*6,10,i*6,'#e5b38977');path(c,[[-10,-13],[-6,-23],[0,-18],[6,-23],[10,-13],[0,-5]],'#d8b788','#b28363');ellipse(c,-5,-13,2,2,0,'#ec675d');ellipse(c,5,-13,2,2,0,'#ec675d');
  }else if(type==='brute'){
    for(const sign of [-1,1])for(let i=0;i<3;i++){line(c,sign*13,-7+i*10,sign*29,-13+i*13,'#a08c68',3);line(c,sign*29,-13+i*13,sign*32,-3+i*11,'#716654',2)}
    const g=c.createLinearGradient(-24,0,24,0);g.addColorStop(0,'#666d56');g.addColorStop(.48,'#b4aa79');g.addColorStop(.5,'#566954');g.addColorStop(1,'#283e3d');ellipse(c,0,6,23,30,0,g,'#b3a476');line(c,0,-16,0,34,'#c2b887');for(let i=0;i<4;i++){line(c,-18,-8+i*9,-3,-3+i*9,'#8f9a7288');line(c,18,-8+i*9,3,-3+i*9,'#8f9a7288')}ellipse(c,0,-19,15,13,0,'#8e9270','#c2b887');path(c,[[-8,-24],[-14,-40],[-3,-32],[0,-22],[3,-32],[14,-40],[8,-24]],'#bcb48b','#ece0b1');ellipse(c,-7,-20,3,2,0,'#efaa76');ellipse(c,7,-20,3,2,0,'#efaa76');
  }else if(type==='lantern'){
    glow(c,0,0,42,'#efb47d29');for(let i=0;i<6;i++){c.save();c.rotate(i*TAU/6);ellipse(c,0,-13,9,20,0,'#ab7d7766','#c6a086');line(c,0,-30,0,-2,'#d1b28c88');c.restore()}ellipse(c,0,0,12,16,0,'#b66d5b','#dcb393');glow(c,0,0,17,'#eab177bb');ellipse(c,0,-1,4,8,0,'#ffe4ac');for(const sign of [-1,1]){c.beginPath();c.moveTo(sign*5,15);c.bezierCurveTo(sign*20,23,sign*5,30,sign*14,39);c.strokeStyle='#ce9c8188';c.stroke()}
  }else{
    glow(c,0,0,110,'#d6a77818');for(const sign of [-1,1]){c.save();c.scale(sign,1);const g=c.createLinearGradient(0,-80,80,70);g.addColorStop(0,'#c5b38c');g.addColorStop(.45,'#876a62');g.addColorStop(1,'#263c42');c.beginPath();c.moveTo(5,-20);c.bezierCurveTo(40,-110,118,-105,97,-34);c.bezierCurveTo(120,-4,94,36,51,29);c.bezierCurveTo(80,73,30,102,13,54);c.lineTo(2,7);c.closePath();c.fillStyle=g;c.fill();c.strokeStyle='#cfbd92';c.lineWidth=1.5;c.stroke();for(let i=0;i<6;i++)line(c,5,-5,87-i*8,-65+i*19,'#d5c79644',1);ellipse(c,64,-37,18,22,-.6,'#263b40','#b8a97e');ellipse(c,64,-37,10,14,-.6,'#c88b6d','#e7c58f');ellipse(c,64,-37,5,7,0,'#efcc95');ellipse(c,34,54,9,13,-.4,'#b6876e','#d2bc8b');c.restore()}
    ellipse(c,0,17,12,46,0,'#394b48','#c7b989');for(let i=0;i<6;i++)line(c,-8,4+i*8,8,4+i*8,'#a59d78');path(c,[[-17,-37],[-20,-57],[-8,-48],[0,-60],[8,-48],[20,-57],[17,-37],[8,-14],[0,-5],[-8,-14]],'#dcd0a9','#a89e7b',2);ellipse(c,-8,-34,5,8,-.2,'#172e35');ellipse(c,8,-34,5,8,.2,'#172e35');glow(c,-8,-34,8,'#f6bd8466');glow(c,8,-34,8,'#f6bd8466');for(const sign of [-1,1]){c.beginPath();c.moveTo(sign*8,-50);c.bezierCurveTo(sign*7,-81,sign*40,-91,sign*44,-73);c.strokeStyle='#d4c79e';c.lineWidth=2;c.stroke()}
  }return cv;
}
function plantSprite(flower=false){const cv=canvas(160),c=cv.getContext('2d');c.translate(80,98);const rng=seeded(flower?39:76);for(let j=0;j<9;j++){const a=-Math.PI/2+(rng()-.5)*2.4,l=25+rng()*48,ex=Math.cos(a)*l,ey=Math.sin(a)*l;line(c,0,0,ex,ey,'#365b4a',1.4);for(let i=1;i<6;i++){const k=i/6,x=ex*k,y=ey*k;for(const s of [-1,1]){c.save();c.translate(x,y);c.rotate(a+s*.8);ellipse(c,9,0,10,3.7,0,j%2?'#325c50':'#244d45','#54775a44');c.restore()}}}
  if(flower){for(let j=0;j<3;j++){const x=(j-1)*30,y=-40-(j%2)*32;line(c,0,0,x,y,'#536954',1.5);c.save();c.translate(x,y);for(let i=0;i<6;i++){c.rotate(TAU/6);const g=c.createLinearGradient(0,-22,0,0);g.addColorStop(0,'#b8c7a1');g.addColorStop(1,'#506c58');ellipse(c,0,-11,6,15,.2,g,'#b2c2a244')}ellipse(c,0,0,5,5,0,'#dbbc75');c.restore()}}return cv;
}
export class Renderer{
  constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.w=innerWidth;this.h=innerHeight;this.cx=0;this.cy=0;this.zoom=1;this.reduced=false;this.clock=0;this.meshes=new WeakMap();this.sprites={player:makePlayer(),drifter:makeEnemy('drifter'),skitter:makeEnemy('skitter'),brute:makeEnemy('brute'),lantern:makeEnemy('lantern'),boss:makeEnemy('boss'),fern:plantSprite(),flower:plantSprite(true)};this.floor=this.makeFloor();this.pattern=this.c.createPattern(this.floor,'repeat');this.decor=[];const rng=seeded(101);for(let i=0;i<230;i++){const a=rng()*TAU,r=280+rng()*1200;this.decor.push({x:Math.cos(a)*r,y:Math.sin(a)*r,scale:.55+rng()*.65,type:rng()<.27?'flower':'fern',angle:rng()*.8-.4})}this.motes=Array.from({length:65},()=>({x:rng()*3200-1600,y:rng()*3200-1600,p:rng()*TAU,s:1+rng()*2}));this.resize();this.stage=this.makeStage();addEventListener('resize',()=>this.resize())}
  resize(){this.w=innerWidth;this.h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.6);this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);this.dpr=dpr;this.zoom=this.w<600?.7:this.w<1000?.85:1;this.c.setTransform(dpr,0,0,dpr,0,0)}
  makeFloor(){const cv=canvas(384),c=cv.getContext('2d'),rng=seeded(151);c.fillStyle='#10272c';c.fillRect(0,0,384,384);for(let i=0;i<10000;i++){const v=Math.floor(23+rng()*18);c.fillStyle=`rgba(${v},${v+25},${v+25},${rng()*.18})`;c.fillRect(rng()*384,rng()*384,1+rng()*2,1+rng()*2)}
    for(let row=0;row<4;row++)for(let col=-1;col<5;col++){const x=col*96+(row%2)*48,y=row*96;path(c,[[x+2,y+2],[x+92,y+2],[x+93,y+92],[x+2,y+93]],row%2?'#152e3022':'#18313433','#8db18c0b');line(c,x+3,y+3,x+91,y+3,'#7b9e7c0c');if(rng()<.5){line(c,x+50,y+2,x+43,y+15,'#061b2066');line(c,x+43,y+15,x+53,y+23,'#061b2066')}}
    for(let i=0;i<100;i++){const x=rng()*384,y=rng()*384;ellipse(c,x,y,2+rng()*5,1+rng()*2,rng()*TAU,'#719c6b12')}return cv;
  }
  makeStage(){const cv=canvas(3400),prev={c:this.c,w:this.w,h:this.h,zoom:this.zoom,visible:this.visible};this.c=cv.getContext('2d');this.w=this.h=3400;this.zoom=1;this.visible=()=>true;this.c.translate(1700,1700);this.drawGarden();Object.assign(this,prev);return cv}
  drawGarden(){const c=this.c;
    c.fillStyle=this.pattern;c.fillRect(this.cx-this.w/this.zoom/2-20,this.cy-this.h/this.zoom/2-20,this.w/this.zoom+40,this.h/this.zoom+40);
    // The garden is a single continuous engraved arena, with a visible boundary.
    for(const r of [213,225,235,640,654,1100,1110,WORLD-10,WORLD])this.ring(0,0,r,r>1500?'#b3b38b44':'#75987920',r===213?3:1);
    if(this.visible(0,0,250)){for(let i=0;i<24;i++){const a=i*TAU/24,x=Math.cos(a)*226,y=Math.sin(a)*226;line(c,Math.cos(a)*214,Math.sin(a)*214,Math.cos(a)*234,Math.sin(a)*234,'#91aa8528');if(i%3===0){c.save();c.translate(x,y);c.rotate(a);path(c,[[0,-4],[7,0],[0,4],[-7,0]],'#a5af782b');c.restore()}}for(let i=0;i<6;i++){c.save();c.rotate(i*TAU/6);c.beginPath();c.ellipse(0,-72,36,85,0,0,TAU);c.strokeStyle='#8da88413';c.stroke();c.restore()}this.ring(0,0,32,'#b8c49020');this.ring(0,0,40,'#b8c49020')}
    for(const d of this.decor)if(this.visible(d.x,d.y))this.sprite(d.type,d.x,d.y,d.scale,d.angle,d.type==='flower'?.38:.6);
    for(let i=0;i<16;i++){const a=i*TAU/16,x=Math.cos(a)*1490,y=Math.sin(a)*1490;if(!this.visible(x,y))continue;c.save();c.translate(x,y);c.rotate(a);path(c,[[-20,-30],[18,-34],[23,22],[-17,28]],'#233a38','#82907244');path(c,[[-24,-33],[23,-37],[18,-25],[-20,-20]],'#3c5145','#9da17a55');glow(c,0,-20,35,'#c7bf6a17');c.restore()}
  }
  worldToScreen(p){return{x:(p.x-this.cx)*this.zoom+this.w/2,y:(p.y-this.cy)*this.zoom+this.h/2}}
  visible(x,y,r=100){return Math.abs(x-this.cx)<this.w/this.zoom/2+r&&Math.abs(y-this.cy)<this.h/this.zoom/2+r}
  sprite(name,x,y,s=1,angle=0,alpha=1){if(!this.visible(x,y,140*s))return;const c=this.c,im=this.sprites[name];c.save();c.translate(x,y);if(angle)c.rotate(angle);c.globalAlpha=alpha;c.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);c.restore()}
  ring(x,y,r,color,width=1){const c=this.c;c.beginPath();c.arc(x,y,r,0,TAU);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
  trace(points){const c=this.c;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath()}
  netMesh(n){let mesh=this.meshes.get(n);if(mesh)return mesh;const x=Math.floor(Math.min(...n.points.map(p=>p.x)))-4,y=Math.floor(Math.min(...n.points.map(p=>p.y)))-4,w=Math.ceil(Math.max(...n.points.map(p=>p.x))-x)+4,h=Math.ceil(Math.max(...n.points.map(p=>p.y))-y)+4;const im=canvas(w,h),c=im.getContext('2d');c.translate(-x,-y);c.beginPath();n.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle='#63d8ae1c';c.fill('evenodd');c.strokeStyle='#b8f2c2bb';c.lineWidth=1.8;c.stroke();c.clip('evenodd');c.strokeStyle='#8edcad33';c.lineWidth=.65;for(let xx=x-h;xx<x+w+h;xx+=27){line(c,xx,y,xx+h,y+h,'#8edcad33',.65);line(c,xx,y,xx-h,y+h,'#8edcad33',.65)}mesh={image:im,x,y};this.meshes.set(n,mesh);return mesh}
  render(game,dt){
    const c=this.c,g=game;this.clock+=dt;const t=g?.time??this.clock;const target=g?.player||{x:0,y:0};const smooth=this.reduced?1:1-Math.exp(-dt*8);this.cx+=(target.x-this.cx)*smooth;this.cy+=(target.y-this.cy)*smooth;
    c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle='#0b2027';c.fillRect(0,0,this.w,this.h);c.save();c.translate(this.w/2,this.h/2);c.scale(this.zoom,this.zoom);const shake=g&&!this.reduced?g.shake:0;c.translate(-this.cx+Math.sin(this.clock*79)*shake*.4,-this.cy+Math.cos(this.clock*91)*shake*.35);
    c.fillStyle='#0b2027';c.fillRect(this.cx-this.w/this.zoom/2-20,this.cy-this.h/this.zoom/2-20,this.w/this.zoom+40,this.h/this.zoom+40);
    const left=Math.max(-1700,this.cx-this.w/this.zoom/2-10),top=Math.max(-1700,this.cy-this.h/this.zoom/2-10),right=Math.min(1700,this.cx+this.w/this.zoom/2+10),bottom=Math.min(1700,this.cy+this.h/this.zoom/2+10);if(right>left&&bottom>top)c.drawImage(this.stage,left+1700,top+1700,right-left,bottom-top,left,top,right-left,bottom-top);
    if(g){
      for(const n of g.nets){const age=1-n.life/n.max;if(n.small){this.ring(n.x,n.y,n.r*(.4+age*.8),`rgba(175,232,194,${(1-age)*.8})`,2);continue}const mesh=this.netMesh(n);c.globalAlpha=Math.min(1,n.life/.9);c.drawImage(mesh.image,mesh.x,mesh.y);c.globalAlpha=1;if(age<.25){this.trace(n.points);c.lineWidth=4*(1-age*4);c.strokeStyle='#e9f7cb';c.globalAlpha=1-age*4;c.stroke();c.globalAlpha=1}}
      // XP jewels have a distinct diamond silhouette, never confused with bullets.
      c.save();for(const gem of g.gems){if(!this.visible(gem.x,gem.y,12))continue;c.translate(gem.x,gem.y);const s=gem.value>3?5:3;path(c,[[0,-s*1.5],[s,0],[0,s*1.5],[-s,0]],gem.value>3?'#e9cf8b':'#78bba4','#b5e1b4',.5);c.translate(-gem.x,-gem.y)}c.restore();
      const pts=[...g.trail,g.player],color=LOADOUTS.find(l=>l.id===g.loadout).color;
      if(pts.length>2){c.save();this.trace(pts);if(g.area>1800){c.fillStyle=g.netCD>0?'#87d5bc03':'#87d5bc0c';c.fill('evenodd')}c.setLineDash([4,7]);c.strokeStyle='#a3d1a942';c.lineWidth=1;c.beginPath();c.moveTo(g.player.x,g.player.y);c.lineTo(pts[0].x,pts[0].y);c.stroke();c.restore()}
      c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.strokeStyle=color;c.lineWidth=1.8;c.shadowColor=color;c.shadowBlur=8;c.stroke();c.shadowBlur=0;c.lineWidth=.6;c.strokeStyle='#eaf4d6';c.stroke();c.restore();
      if(g.trail.length>2){const anchor=pts[0];this.ring(anchor.x,anchor.y,8+Math.sin(t*3),color+'77',1);path(c,[[anchor.x,anchor.y-11],[anchor.x+4,anchor.y],[anchor.x,anchor.y+5],[anchor.x-4,anchor.y]],COL.ivory);for(let i=5;i<g.trail.length;i+=8){const p=g.trail[i];ellipse(c,p.x,p.y,2.2,2.2,0,color)}}
      for(const d of g.dashTrail)this.sprite('player',d.x,d.y,.7,0,d.life*.6);
      // Depth sort gives the creatures a grounded, illustrated presence.
      const actors=[...g.enemies,{...g.player,type:'player',id:-1}].sort((a,b)=>a.y-b.y);
      for(const e of actors){if(!this.visible(e.x,e.y,160))continue;const isBoss=e.type==='boss';ellipse(c,e.x,e.y+e.r*.9,e.r*(isBoss?1.2:1.1),e.r*.4,0,'#020f1859');const wobble=this.reduced?0:Math.sin(t*(e.type==='skitter'?12:5)+(e.phase||0));const scale=e.type==='player'?.7:isBoss?1+e.boss*.12:e.type==='brute'?.85:e.type==='skitter'?.62:.65;
        if(e.type==='boss'&&e.charge>.4){c.save();c.translate(e.x,e.y);c.rotate(e.chargeA);c.fillStyle='#e2ac7130';c.fillRect(0,-e.r*.8,290,e.r*1.6);line(c,0,0,300,0,'#efb77688',1);c.restore()}
        this.sprite(e.type,e.x,e.y+(e.type==='lantern'?Math.sin(t*2+e.phase)*5:wobble),scale, e.type==='player'?Math.sin(t*2)*.025:Math.sin(t*2+e.phase)*.06, e.type==='player'&&e.inv>0?.65+Math.sin(t*35)*.2:1);
        if(e.poison>0){ellipse(c,e.x+e.r,e.y-7,2,3,0,'#aec480');ellipse(c,e.x-e.r,e.y+5,2,3,0,'#92b77a')}
        if(e.hit>0){this.ring(e.x,e.y,e.r*1.1,'#f4e6ba77',1.4)}
        if(e.type!=='player'&&e.hp<e.maxHp&&!isBoss){c.fillStyle='#193039';c.fillRect(e.x-13,e.y-e.r-13,26,2);c.fillStyle='#d7b18b';c.fillRect(e.x-13,e.y-e.r-13,26*e.hp/e.maxHp,2)}
      }
      for(let i=0;i<g.rank('orbit');i++){const a=t*2.4+i*TAU/g.rank('orbit'),x=g.player.x+Math.cos(a)*70,y=g.player.y+Math.sin(a)*70;this.ring(g.player.x,g.player.y,70,'#b0d7ac11');c.save();c.translate(x,y);c.rotate(a);path(c,[[-5,-13],[7,0],[-5,13],[0,0]],'#dcdfb7','#a5dfc0');c.restore()}
      for(const b of g.bullets){if(!this.visible(b.x,b.y,20))continue;const a=Math.atan2(b.vy,b.vx);line(c,b.x-Math.cos(a)*19,b.y-Math.sin(a)*19,b.x,b.y,b.color,1.8);ellipse(c,b.x,b.y,2.5,2.5,0,'#fff5d5')}
      for(const s of g.shots){if(!this.visible(s.x,s.y,20))continue;ellipse(c,s.x,s.y,s.r+3,s.r+3,0,'#dc805c22');ellipse(c,s.x,s.y,s.r,s.r,0,'#d87f62','#f1c099');ellipse(c,s.x-1,s.y-1,2,2,0,'#ffe5b3')}
      for(const a of g.arcs){c.save();c.globalAlpha=a.life*3;if(a.points){this.trace(a.points);c.strokeStyle='#d2f4cf';c.lineWidth=3;c.stroke()}else{const dx=a.tx-a.x,dy=a.ty-a.y;c.beginPath();c.moveTo(a.x,a.y);for(let i=1;i<6;i++)c.lineTo(a.x+dx*i/6+Math.sin(i*8+t)*9,a.y+dy*i/6+Math.cos(i*8)*9);c.lineTo(a.tx,a.ty);c.strokeStyle='#c8f5d4';c.lineWidth=1.5;c.stroke()}c.restore()}
      for(const p of g.particles){if(!this.visible(p.x,p.y,10))continue;c.globalAlpha=clamp(p.life/p.max,0,1);c.fillStyle=p.color;c.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size)}c.globalAlpha=1;
      for(const f of g.floats){c.globalAlpha=clamp(f.life/.3,0,1);c.font=f.big?'15px "Yu Mincho", Georgia, serif':'10px Georgia';c.textAlign='center';c.fillStyle=f.color;c.shadowColor='#09181d';c.shadowBlur=0;c.fillText(f.text,f.x,f.y);c.shadowBlur=0}c.globalAlpha=1;
      // Dash readiness sits under the player, close to the decision.
      if(g.player.dashCD>0){c.beginPath();c.arc(g.player.x,g.player.y+30,13,-Math.PI/2,-Math.PI/2+TAU*(1-g.player.dashCD/(4*Math.pow(.8,g.rank('step')))));c.strokeStyle='#c9d6b655';c.lineWidth=1.3;c.stroke()}
    }
    for(const m of this.motes){if(!this.visible(m.x,m.y,30))continue;const a=.15+Math.sin(t+m.p)*.12;ellipse(c,m.x+Math.sin(t*.3+m.p)*12,m.y+Math.cos(t*.2+m.p)*15,m.s*.6,m.s*.6,0,`rgba(199,220,148,${a})`)}
    c.restore();if(g){if(g.flash>0&&!this.reduced){c.fillStyle=`rgba(192,239,193,${g.flash*.22})`;c.fillRect(0,0,this.w,this.h)}const boss=g.enemies.find(e=>e.type==='boss');if(boss){const s=this.worldToScreen(boss);if(s.x<40||s.x>this.w-40||s.y<60||s.y>this.h-70){const a=Math.atan2(s.y-this.h/2,s.x-this.w/2),rr=Math.min(this.w*.43,this.h*.4),x=this.w/2+Math.cos(a)*rr,y=this.h/2+Math.sin(a)*rr;c.save();c.translate(x,y);c.rotate(a);path(c,[[9,0],[-5,-5],[-2,0],[-5,5]],'#d9b184');c.restore()}}}
  }
}
