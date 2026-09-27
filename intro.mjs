export const INTRO_SECONDS=10;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}
export function catnap(c,x,y,size,nightmare=0,time=0){
 c.save();c.translate(x,y);c.scale(size,size);const m=nightmare,sway=Math.sin(time*4)*2;
 // The same silhouette stretches into a long-limbed nightmare form.
 ellipse(c,0,62,64+15*m,12,'#00000044');
 c.strokeStyle=m>.5?'#39284f':'#7553a1';c.lineWidth=18-7*m;c.lineCap='round';
 for(const sign of [-1,1]){c.beginPath();c.moveTo(sign*22,5);c.lineTo(sign*(42+30*m),30-15*m);c.lineTo(sign*(38+60*m),61+sway*m);c.stroke();c.beginPath();c.moveTo(sign*18,35);c.lineTo(sign*(29+9*m),68);c.stroke()}
 ellipse(c,0,18,33-10*m,44+12*m,m>.5?'#43305c':'#8760b8');
 const hy=-35-20*m;
 poly(c,[[-36,hy+3],[-41-8*m,hy-61-14*m],[-7,hy-26]],'#76509e');poly(c,[[36,hy+3],[41+8*m,hy-61-14*m],[7,hy-26]],'#76509e');
 ellipse(c,0,hy,45+4*m,37-4*m,m>.5?'#543a6c':'#8e67bc');
 poly(c,[[-29,hy-25],[-34,hy-49],[-15,hy-28]],'#b88caf');poly(c,[[29,hy-25],[34,hy-49],[15,hy-28]],'#b88caf');
 for(const sign of [-1,1]){ellipse(c,sign*18,hy-4,8+3*m,10-6*m,m>.4?'#ffc789':'#fff3db');ellipse(c,sign*18,hy-4,3,7-3*m,'#191125')}
 ellipse(c,0,hy+14,14+16*m,8+13*m,'#201226');if(m>.15){for(let i=-2;i<=2;i++)poly(c,[[i*9-3,hy+4],[i*9+3,hy+4],[i*9,hy+13+5*m]],'#f4e8c9');for(let i=-1;i<=1;i++)poly(c,[[i*12-3,hy+28],[i*12+3,hy+28],[i*12,hy+19]],'#f4e8c9')}
 ellipse(c,0,hy+40,12,13,'#e2c77a');ellipse(c,5,hy+36,10,12,m>.5?'#43305c':'#8760b8');
 c.restore();
}
function rocket(c,x,y,angle,scale,t){c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);poly(c,[[-14,20],[0,-44],[14,20]],'#e3d4bd');c.fillStyle='#a07b8d';c.fillRect(-11,-12,22,35);poly(c,[[-10,8],[-27,30],[-8,24]],'#805e84');poly(c,[[10,8],[27,30],[8,24]],'#805e84');ellipse(c,0,-7,6,8,'#badbda');poly(c,[[-9,26],[0,70+Math.sin(t*30)*10],[9,26]],'#f4bb71');poly(c,[[-4,26],[0,52],[4,26]],'#fff0b3');c.restore()}
export function drawIntro(c,w,h,t,portraits){
 c.clearRect(0,0,w,h);c.fillStyle='#050911';c.fillRect(0,0,w,h);const scale=Math.min(w/1280,h/800);c.save();c.translate((w-1280*scale)/2,(h-800*scale)/2);c.scale(scale,scale);
 const sky=c.createLinearGradient(0,0,0,800);sky.addColorStop(0,'#081021');sky.addColorStop(1,'#303644');c.fillStyle=sky;c.fillRect(0,0,1280,800);
 for(let i=0;i<80;i++)ellipse(c,(i*167+83)%1280,(i*79+33)%520,1+(i%2),1,'#d7ddce88');
 for(let i=0;i<5;i++){const x=((i*350-t*(22+i*5))%1600+1600)%1600-180;ellipse(c,x,130+i*68,150,28,'#66738415');ellipse(c,x+65,110+i*68,98,38,'#66738415')}
 const gone=ease((t-6.6)/.5);if(gone<1){c.globalAlpha=1-gone;ellipse(c,1010,170,92,92,'#eaddb6');ellipse(c,978,141,16,15,'#b7bba866');ellipse(c,1046,191,22,20,'#b7bba855');c.globalAlpha=1;}
 if(t>6.6){const p=clamp((t-6.6)/1.2);for(let i=0;i<35;i++){const a=i*2.4,r=p*(70+(i%5)*35);c.globalAlpha=(1-p)*.9;poly(c,[[1010+Math.cos(a)*r,170+Math.sin(a)*r],[1020+Math.cos(a)*r,178+Math.sin(a)*r],[1003+Math.cos(a)*r,183+Math.sin(a)*r]],'#e8dbac')}c.globalAlpha=1;ellipse(c,1010,170,92+gone*20,92+gone*20,'#070d1733')}
 poly(c,[[0,555],[150,460],[350,570],[570,490],[770,565],[1040,435],[1280,530],[1280,800],[0,800]],'#122229');poly(c,[[0,665],[170,603],[370,650],[590,585],[920,640],[1100,580],[1280,610],[1280,800],[0,800]],'#1d302f');
 for(let i=0;i<22;i++){const x=i*65;c.fillStyle=i%2?'#2e4240':'#293b3a';c.fillRect(x,697+(i%3)*7,66,104);c.fillStyle='#63826733';c.fillRect(x,697+(i%3)*7,66,7)}
 const morph=ease((t-2.1)/1.7),zoom=1+ease(t/2)*.07;
 if(t<8.7){const fade=1-ease((t-8)/.7);c.globalAlpha=fade;catnap(c,475,600,1.75*zoom,morph,t);c.globalAlpha=1;}
 if(t>1.9&&t<4.5){for(let i=0;i<14;i++){const p=(t*.5+i*.17)%1;ellipse(c,475+Math.sin(i*5+t)*80,690-p*290,15+20*p,11+12*p,'#a16ccb20')}}
 c.fillStyle='#3c4f52';c.fillRect(607,627,85,70);poly(c,[[597,627],[648,589],[702,627]],'#566762');
 if(t<4.5)rocket(c,649,573,0,1.3,t);else if(t<6.7){const p=ease((t-4.5)/2.2),x=649+(1010-649)*p,y=573+(170-573)*p;for(let i=0;i<9;i++)ellipse(c,x-i*5,y+i*8,9+i*2,9+i*2,'#cfc8a215');rocket(c,x,y,.63,1.3-.7*p,t)}
 if(t>7.15){const rise=ease((t-7.15)/1.2);for(let i=0;i<8;i++){const x=140+i*153,y=720+(1-rise)*70;c.fillStyle='#122724';c.fillRect(x-17,y-65,34,44);c.fillStyle='#789876';c.fillRect(x-20,y-95,40,32);c.fillStyle='#d9c876';c.fillRect(x-13,y-86,6,5);c.fillRect(x+7,y-86,6,5);c.fillStyle='#203735';c.fillRect(x-15,y-20,10,25);c.fillRect(x+5,y-20,10,25)}}
 if(t>8.7){const p=ease((t-8.7)/1);const list=['critter_05_dogday','critter_08_craftycorn','critter_06_bobby','critter_07_hoppy','critter_09_bubba','mikey','jj'];list.forEach((id,i)=>{const im=portraits[id],x=280+i*120,y=530+(1-p)*230+Math.sin(i+t*4)*5;c.save();ellipse(c,x,y+66,40,10,'#00000055');ellipse(c,x,y,49,49,'#eddb9d');c.beginPath();c.arc(x,y,43,0,Math.PI*2);c.clip();if(im?.complete&&im.naturalWidth)c.drawImage(im,x-43,y-43,86,86);c.restore()})}
 // Letterbox framing keeps the ten-second story readable at any screen shape.
 c.fillStyle='#030710';c.fillRect(0,0,1280,28);c.fillRect(0,775,1280,25);c.restore();
}
