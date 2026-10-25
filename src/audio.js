// Original generative score: a slow pentatonic music box, silk harmonics and warm bass.
export class AudioGarden{
  constructor(){this.enabled=true;this.volume=.45;this.ctx=null;this.next=0;this.beat=0;this.running=false;this.lastSfx={}}
  init(){if(this.ctx){this.ctx.resume();return}try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();const c=this.ctx;this.master=c.createGain();this.master.gain.value=this.volume*.38;this.master.connect(c.destination);this.delay=c.createDelay(1);this.delay.delayTime.value=.375;const feedback=c.createGain();feedback.gain.value=.23;this.delay.connect(feedback);feedback.connect(this.delay);const wet=c.createGain();wet.gain.value=.24;this.delay.connect(wet);wet.connect(this.master);this.next=c.currentTime+.1}catch{this.enabled=false}}
  setVolume(n){this.volume=n;if(this.master)this.master.gain.setTargetAtTime(this.enabled?n*.38:0,this.ctx.currentTime,.1)}
  toggle(){this.enabled=!this.enabled;this.setVolume(this.volume);if(this.enabled)this.init();return this.enabled}
  tone(freq,duration=.3,type='sine',volume=.15,when=null,slide=0){if(!this.ctx||!this.enabled)return;const c=this.ctx,t=when??c.currentTime,o=c.createOscillator(),v=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(25,slide),t+duration);v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.015);v.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(v);v.connect(this.master);v.connect(this.delay);o.start(t);o.stop(t+duration+.05)}
  update(active,intensity=0){if(!this.ctx||!this.enabled)return;const now=this.ctx.currentTime;if(!active){this.next=now+.15;return}if(this.next<now-.2)this.next=now+.05;const melody=[0,7,12,10,7,3,5,7,0,3,7,15,12,10,7,5];while(this.next<now+.12){const n=melody[this.beat%melody.length],f=220*Math.pow(2,n/12);this.tone(f,1.3,'sine',.085,this.next);this.tone(f*2,.9,'sine',.018,this.next+.025);if(this.beat%4===0)this.tone(55*Math.pow(2,[0,3,5,0][Math.floor(this.beat/4)%4]/12),2.8,'sine',.13,this.next);if(intensity>.4&&this.beat%2===0)this.tone(110,.12,'triangle',.05,this.next+.32);this.beat++;this.next+=.56}}
  sfx(type){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;if(t-(this.lastSfx[type]||-1)<(type==='shoot'?.14:.06))return;this.lastSfx[type]=t;
    if(type==='shoot')this.tone(950,.07,'sine',.025,null,500);
    if(type==='weave'){this.tone(110,.5,'triangle',.28,null,55);for(let i=0;i<5;i++)this.tone(440*Math.pow(2,[0,3,7,12,15][i]/12),.65,'sine',.13,t+i*.035)}
    if(type==='knot')this.tone(170,.2,'triangle',.15,null,75);
    if(type==='dash')this.tone(500,.17,'sine',.08,null,120);
    if(type==='hurt'){this.tone(130,.16,'sawtooth',.1,null,60);this.tone(65,.25,'triangle',.18)}
    if(type==='level'||type==='choose'){[0,7,12,15].forEach((n,i)=>this.tone(440*Math.pow(2,n/12),.7,'sine',.15,t+i*.085))}
    if(type==='boss')this.tone(55,2.4,'triangle',.18,null,44);
    if(type==='bossKill'||type==='win'){[0,3,7,12,15,19,24].forEach((n,i)=>this.tone(220*Math.pow(2,n/12),1.6,'sine',.19,t+i*.12))}
    if(type==='lose'){[7,3,0,-5].forEach((n,i)=>this.tone(220*Math.pow(2,n/12),1,'sine',.15,t+i*.16))}
    if(type==='echo')this.tone(660,.5,'sine',.08,null,330);
  }
}
