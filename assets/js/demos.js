/* ===== Interactive Demo Labs (pure CSS/JS animations, offline-safe) ===== */
(function(){
"use strict";

/* ---------- helper to build svg stage background floor ---------- */
function floorSVG(color){ return '<svg viewBox="0 0 300 90" style="width:100%;height:90px;display:block"><line x1="0" y1="86" x2="300" y2="86" stroke="'+color+'" stroke-width="2"/></svg>'; }

/* ---------------------------------------------------------------
   1) FORCE : push / pull / squeeze a block
----------------------------------------------------------------*/
function demoForce(stage){
  stage.innerHTML =
  '<div style="position:relative;width:100%;max-width:520px;height:230px">'+
    '<div style="position:absolute;left:0;right:0;bottom:6px;height:14px;border-radius:8px;background:linear-gradient(90deg,#2b2f7a,#5b4fb0)"></div>'+
    '<div id="fd-block" style="position:absolute;left:50%;bottom:20px;width:86px;height:86px;margin-left:-43px;border-radius:16px;background:linear-gradient(135deg,#ffd24d,#ff8a00);display:grid;place-items:center;font-size:34px;box-shadow:0 14px 26px -10px rgba(0,0,0,.5);transition:transform .05s linear,width .4s,height .4s,border-radius .4s">📦</div>'+
    '<div id="fd-arrR" style="position:absolute;right:14px;top:100px;font-size:44px;opacity:0;transition:opacity .2s">➡️</div>'+
    '<div id="fd-arrL" style="position:absolute;left:14px;top:100px;font-size:44px;opacity:0;transition:opacity .2s">⬅️</div>'+
    '<div id="fd-msg" style="position:absolute;top:2px;left:0;right:0;text-align:center;color:#ffd76b;font-weight:800;min-height:22px;font-size:15px"></div>'+
  '</div>'+
  '<div class="lab-bar">'+
    '<button class="lab-btn" data-a="R">Push ➡️</button>'+
    '<button class="lab-btn" data-a="L">Pull ⬅️</button>'+
    '<button class="lab-btn" data-a="SQ">Squeeze 🧃</button>'+
    '<button class="lab-btn" data-a="ST">Rest 🛑</button>'+
    '<span class="cap" style="margin:0 0 0 auto;flex:1;min-width:200px">A force can move, stop, change direction or change the shape of an object.</span>'+
  '</div>';
  var block=stage.querySelector('#fd-block'), msg=stage.querySelector('#fd-msg');
  var aR=stage.querySelector('#fd-arrR'), aL=stage.querySelector('#fd-arrL');
  var pos=0, timer=null, dir=0, squeezing=false;
  function resetArrows(){aR.style.opacity=0;aL.style.opacity=0;}
  stage.addEventListener('click',function(e){
    var b=e.target.closest && e.target.closest('[data-a]'); if(!b||!stage.contains(b)) return;
    var a=b.getAttribute('data-a');
    if(timer){clearInterval(timer);timer=null;}
    squeezing=false; resetArrows(); block.style.width='86px';block.style.height='86px';block.style.borderRadius='16px';
    if(a==='ST'){dir=0;msg.textContent='Object stays at rest — no net force.';return;}
    if(a==='R'){dir=1;aR.style.opacity=1;msg.textContent='Force (push) sets the box in motion ▶';}
    if(a==='L'){dir=-1;aL.style.opacity=1;msg.textContent='Force (pull) sets the box in motion ◀';}
    if(a==='SQ'){squeezing=true;msg.textContent='Force can change the SHAPE of an object!';block.style.width='116px';block.style.height='64px';block.style.borderRadius='40%';return;}
    if(a==='R'||a==='L'){
      var F=Math.min(Math.abs(pos),1)*3+1; (function(){var f=F;timer=setInterval(function(){pos+=dir*f;f+=0.25;block.style.transform='translateX('+pos+'px)';if(Math.abs(pos)>230){clearInterval(timer);timer=null;msg.textContent='Object moved. Click 🛑 then Push/Pull again.';}},28);})();
    }
  });
}

/* ---------------------------------------------------------------
   2) BALANCED / UNBALANCED : tug of war
----------------------------------------------------------------*/
function demoBalanced(stage){
  stage.innerHTML =
  '<div style="width:100%;max-width:560px">'+
    '<div style="display:flex;justify-content:space-between;font-weight:800;color:#9fe3ff;font-size:14px">'+
      '<span>Team A</span><span style="color:#ffd76b">Rope → movement depends on NET force</span><span>Team B</span></div>'+
    '<div style="position:relative;height:170px;margin-top:6px;overflow:hidden;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%)">'+
      '<div id="tw-A" style="position:absolute;top:70px;font-size:42px;transition:left .5s">🦸</div>'+
      '<div id="tw-B" style="position:absolute;top:70px;right:0;font-size:42px;transition:right .5s;transform:scaleX(-1)">🦸</div>'+
      '<div id="tw-mark" style="position:absolute;left:50%;top:18px;width:4px;height:120px;margin-left:-2px;background:#ffd76b;transition:left .5s"></div>'+
      '<div id="tw-rope" style="position:absolute;top:84px;left:0;right:0;height:6px;border-radius:4px;background:linear-gradient(90deg,#b98,#caa);transition:left .5s"></div>'+
      '<div id="tw-msg" style="position:absolute;top:150px;left:0;right:0;text-align:center;color:#fff;font-weight:800;font-size:14px"></div>'+
    '</div>'+
    '<div style="display:flex;gap:14px;margin-top:10px;align-items:center;flex-wrap:wrap">'+
      '<label style="flex:1;min-width:150px">Team A force <b id="tw-vA" style="color:#ffd76b"></b> N<br><input type="range" id="tw-sA" min="0" max="60" value="30" style="width:100%"></label>'+
      '<label style="flex:1;min-width:150px">Team B force <b id="tw-vB" style="color:#ffd76b"></b> N<br><input type="range" id="tw-sB" min="0" max="60" value="30" style="width:100%"></label>'+
      '<button class="lab-btn" id="tw-run">▶ Pull!</button>'+
    '</div>'+
  '</div>'+
  '<div class="cap" style="margin-top:8px">Equal forces = balanced (rope stays). Unequal = unbalanced → rope moves toward the larger force with net force = difference.</div>';
  var A=stage.querySelector('#tw-A'),B=stage.querySelector('#tw-B'),mark=stage.querySelector('#tw-mark'),rope=stage.querySelector('#tw-rope'),msg=stage.querySelector('#tw-msg');
  var sA=stage.querySelector('#tw-sA'),sB=stage.querySelector('#tw-sB'),vA=stage.querySelector('#tw-vA'),vB=stage.querySelector('#tw-vB');
  function upd(){vA.textContent=sA.value;vB.textContent=sB.value;msg.textContent='';}
  sA.addEventListener('input',upd);sB.addEventListener('input',upd);upd();
  stage.querySelector('#tw-run').addEventListener('click',function(){
    var fa=+sA.value, fb=+sB.value;
    var cx=stage.querySelector('#tw-sB').closest('div'); var half=(stage.clientWidth||540)/2;
    var mA=40, mB=half-90, mC=half; /* left start for team A */
    A.style.left='30px';B.style.right='30px';mark.style.left='50%';
    if(fa===fb){ msg.textContent='Balanced forces — net force = 0. Rope does NOT move. ⚖️'; }
    else{
      var diff=fa-fb; var d=Math.min(150,Math.abs(diff)*2.6)*(fa>fb?1:-1);
      msg.textContent='Net force = '+Math.abs(diff)+' N → rope moves '+(fa>fb?'towards Team A (left)':'towards Team B (right)');
      mark.style.left=(50-(d/ (stage.clientWidth||540)*100* (fa>fb?0.5:0)) )+'%';
      mark.style.left='calc(50% - '+d+'px)';
    }
  });
}

/* ---------------------------------------------------------------
   3) FRICTION : same push, different surfaces
----------------------------------------------------------------*/
function demoFriction(stage){
  var surfaces=[['Wooden table',26,60],['Cemented floor',34,42],['Polished marble',18,120],['Ice / very smooth',9,210]];
  stage.innerHTML =
  '<div style="width:100%;max-width:580px">'+
    '<div style="text-align:center;color:#c9cff5;font-weight:700">Rubber band pushes coin-stack with the SAME push each time</div>'+
    '<div style="position:relative;height:200px;margin:8px 0;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%);overflow:hidden">'+
      '<div id="fr-stack" style="position:absolute;left:6%;bottom:10px;font-size:40px;transition:left 2.6s cubic-bezier(.15,.6,.3,1)">🪙🪙🪙🪙</div>'+
      '<div id="fr-meter" style="position:absolute;left:0;right:0;bottom:0;height:4px;background:#ffd76b"></div>'+
      '<div id="fr-dist" style="position:absolute;top:6px;left:0;right:0;text-align:center;color:#fff;font-weight:800;min-height:20px"></div>'+
    '</div>'+
    '<div class="lab-bar">'+
      '<button class="lab-btn" id="fr-go">▶ Push on chosen surface</button>'+
      '<select class="lab-btn" id="fr-sur"></select>'+
    '</div>'+
    '<div class="cap">The rougher the surface → larger friction → the coin stack stops sooner (travels less distance). Friction opposes motion.</div>'+
  '</div>';
  var stack=stage.querySelector('#fr-stack'),dist=stage.querySelector('#fr-dist'),sel=stage.querySelector('#fr-sur');
  surfaces.forEach(function(s,i){var o=document.createElement('option');o.value=i;o.textContent=s[0];sel.appendChild(o);});
  stage.querySelector('#fr-go').addEventListener('click',function(){
    var s=surfaces[+sel.value]; var box=stage.querySelector('div').getBoundingClientRect();
    var avail=(stage.querySelector('#fr-meter').clientWidth||560)-70;
    stack.style.transition='none';stack.style.left='6%';
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      var target=Math.max(10,Math.min(92,(avail*s[2]/230)/avail*92+6));
      var pct=Math.min(92, 6+(s[2]*0.35));
      stack.style.transition='left 2.4s cubic-bezier(.2,.65,.4,1)';
      stack.style.left=pct+'%';
      dist.textContent=s[0]+' → friction ≈ '+s[1]+' N  •  travelled about '+s[2]+' cm before stopping';
    });});
  });
}

/* ---------------------------------------------------------------
   4) NEWTON'S FIRST LAW : ball with and without friction
----------------------------------------------------------------*/
function demoFirst(stage){
  stage.innerHTML =
  '<div style="width:100%;max-width:580px">'+
    '<div style="display:flex;justify-content:space-between;color:#c9cff5;font-size:13.5px;font-weight:700">'+
      '<span id="fl-fr-lab" style="color:#ff8d8d">Friction ON (real world)</span>'+
      '<span id="fl-v" style="color:#ffd76b">velocity: 0 m/s</span></div>'+
    '<div style="position:relative;height:170px;margin:8px 0;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%);overflow:hidden">'+
      '<div id="fl-ball" style="position:absolute;bottom:14px;left:4%;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffd76b,#ff8a00);box-shadow:0 8px 16px -6px rgba(0,0,0,.5)"></div>'+
    '</div>'+
    '<div class="lab-bar">'+
      '<button class="lab-btn" id="fl-start">▶ Give one push</button>'+
      '<button class="lab-btn" id="fl-fr">Friction: OFF</button>'+
      '<button class="lab-btn" id="fl-reset">Reset</button>'+
    '</div>'+
    '<div class="cap">First law: with NO net force (no friction), a moving object keeps moving with constant velocity forever. In real life friction is the net force that stops it.</div>'+
  '</div>';
  var ball=stage.querySelector('#fl-ball'),lab=stage.querySelector('#fl-fr'),labT=stage.querySelector('#fl-fr-lab'),vlab=stage.querySelector('#fl-v');
  var friction=true, x=4, v=0, timer=null;
  function show(){lab.textContent=friction?'Friction: OFF':'Friction: ON';labT.textContent=(friction?'Friction ON — will slow & stop':'Friction OFF — frictionless! keeps moving');labT.style.color=friction?'#ff8d8d':'#8dffb0';}
  function stopAnim(){if(timer){clearInterval(timer);timer=null;}}
  stage.querySelector('#fl-start').addEventListener('click',function(){
    stopAnim(); v=3.2; x=4; ball.style.transition='none';ball.style.left='4%';
    requestAnimationFrame(function(){requestAnimationFrame(function(){ timer=setInterval(function(){
      x+=v*0.5;
      if(friction){v=Math.max(0,v-0.09);}
      if(x>96||(friction&&v<=0)){ clearInterval(timer);timer=null; if(!friction){x=2;} v=friction?0:v; }
      ball.style.left=x+'%'; vlab.textContent='velocity: '+ (friction?v.toFixed(1):'constant')+' m/s';
      if(friction&&v<=0){vlab.textContent='velocity: 0 m/s — stopped by friction 🛑';}
    },30);});});
  });
  stage.querySelector('#fl-fr').addEventListener('click',function(){ friction=!friction; show(); if(friction){stopAnim();} });
  stage.querySelector('#fl-reset').addEventListener('click',function(){stopAnim();x=4;v=0;ball.style.left='4%';vlab.textContent='velocity: 0 m/s';});
  show();
}

/* ---------------------------------------------------------------
   5) NEWTON'S SECOND LAW : F = m a simulator
----------------------------------------------------------------*/
function demoSecond(stage){
  stage.innerHTML =
  '<div style="width:100%;max-width:580px">'+
    '<div style="text-align:center;color:#fff"><b style="font-size:20px">a = F ÷ m</b>  &nbsp;→&nbsp; live: <span id="sl-a" style="color:#ffd76b">0.0</span> m/s²</div>'+
    '<div style="position:relative;height:150px;margin:8px 0;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%);overflow:hidden">'+
      '<div id="sl-box" style="position:absolute;bottom:12px;left:5%;font-size:40px;width:56px">🛒</div>'+
      '<div id="sl-arrow" style="position:absolute;left:26%;top:52px;font-size:30px;opacity:0">➡️</div>'+
      '<div id="sl-track" style="position:absolute;left:0;right:0;bottom:6px;height:6px;background:#565db0;border-radius:4px"></div>'+
    '</div>'+
    '<div class="lab-bar" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+
      '<label style="grid-column:1">Force F = <b id="sl-F" style="color:#ffd76b">5</b> N<br><input id="sl-sF" type="range" min="1" max="60" value="5" style="width:100%"></label>'+
      '<label style="grid-column:2">Mass m = <b id="sl-m" style="color:#ffd76b">1</b> kg<br><input id="sl-sm" type="range" min="1" max="20" value="1" style="width:100%"></label>'+
      '<div style="grid-column:1 / -1;display:flex;gap:10px;align-items:center">'+
        '<button class="lab-btn" id="sl-go">▶ Push (apply force)</button><button class="lab-btn" id="sl-stop">🛑 Brake</button><span class="cap" style="margin:0">Keep F and change m, or keep m and change F — watch acceleration!</span></div>'+
    '</div>'+
  '</div>';
  var box=stage.querySelector('#sl-box'),arv=stage.querySelector('#sl-arrow'),lab=stage.querySelector('#sl-a');
  var sF=stage.querySelector('#sl-sF'),sm=stage.querySelector('#sl-sm'),lF=stage.querySelector('#sl-F'),lm=stage.querySelector('#sl-m');
  function upd(){lF.textContent=sF.value;lm.textContent=sm.value;var a=(+sF.value)/(+sm.value);lab.textContent=a.toFixed(1);arv.style.opacity=a>0?1:0;}
  sF.addEventListener('input',upd);sm.addEventListener('input',upd);upd();
  var x=5,v=0,timer=null;
  function anim(force){
    if(timer) clearInterval(timer);
    timer=setInterval(function(){
      var a=force/(+sm.value); v+=a*0.05; x+=v*0.7;
      if(x>88){x=5;v=0;}
      box.style.left=x+'%'; lab.textContent=(v*2.2).toFixed(1);
    },40);
  }
  stage.querySelector('#sl-go').addEventListener('click',function(){upd();anim(+sF.value);});
  stage.querySelector('#sl-stop').addEventListener('click',function(){if(timer)clearInterval(timer);timer=null;v=0;});
}

/* ---------------------------------------------------------------
   6) NEWTON'S THIRD LAW : rocket / balloon action-reaction
----------------------------------------------------------------*/
function demoThird(stage){
  stage.innerHTML =
  '<div style="width:100%;max-width:560px">'+
    '<div style="position:relative;height:230px;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%);overflow:hidden">'+
      '<div style="position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(90deg,#7a6a4f,#a9947a);border-radius:8px 8px 0 0"></div>'+
      '<div id="nt-rocket" style="position:absolute;left:50%;bottom:26px;width:56px;margin-left:-28px;transition:bottom 2.2s ease-out;font-size:52px;text-align:center">🚀</div>'+
      '<div id="nt-flame" style="position:absolute;left:50%;bottom:16px;width:18px;margin-left:-9px;height:0;background:linear-gradient(#ffd76b,#ff5e62);border-radius:0 0 10px 10px;opacity:0"> </div>'+
      '<div id="nt-gas" style="position:absolute;left:50%;bottom:40px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#9fb0ff;opacity:0"> </div>'+
      '<div id="nt-msg" style="position:absolute;top:8px;left:0;right:0;text-align:center;color:#fff;font-weight:800;min-height:22px"></div>'+
    '</div>'+
    '<div class="lab-bar"><button class="lab-btn" id="nt-go">🚀 Launch (gases down → rocket up)</button>'+
      '<button class="lab-btn" id="nt-rest">Reset</button></div>'+
    '<div class="cap">Engine pushes gas DOWN (action). Gas pushes rocket UP with equal force (reaction). The equal-opposite pair acts on two different bodies, so the rocket lifts!</div>'+
  '</div>';
  var ro=stage.querySelector('#nt-rocket'),msg=stage.querySelector('#nt-msg'),fl=stage.querySelector('#nt-flame'),gas=stage.querySelector('#nt-gas');
  function gasPuff(n){
    var g=gas.cloneNode();g.style.opacity=1;stage.querySelector('div').appendChild(g);g.style.transition='bottom 1s linear,opacity 1s linear';
    requestAnimationFrame(function(){ g.style.bottom='0px'; g.style.opacity=0; });
    setTimeout(function(){g.remove()},1100);
  }
  stage.querySelector('#nt-go').addEventListener('click',function(){
    msg.textContent='Action: exhaust gases rush DOWN ⬇   Reaction: rocket moves UP ⬆';
    fl.style.opacity=1;fl.style.height='26px';
    var n=0;var iv=setInterval(function(){gasPuff(n);n++;if(n>9)clearInterval(iv);},130);
    ro.style.bottom='168px';fl.style.opacity=0;
    setTimeout(function(){fl.style.opacity=0;ro.style.bottom='150px';msg.textContent='Lift-off complete! Balanced by... reset to try again.';},2300);
  });
  stage.querySelector('#nt-rest').addEventListener('click',function(){ro.style.transition='none';ro.style.bottom='26px';msg.textContent='';fl.style.opacity=0;requestAnimationFrame(function(){ro.style.transition='bottom 2.2s ease-out';});});
}

/* ---------------------------------------------------------------
   7) SYSTEM OF OBJECTS (+ momentum demo)
----------------------------------------------------------------*/
function demoSystem(stage){
  stage.innerHTML =
  '<div style="width:100%;max-width:560px">'+
    '<div style="position:relative;height:150px;margin:8px 0;border-radius:12px;background:radial-gradient(circle at 50% 130%,#3d4396,transparent 75%);overflow:hidden">'+
      '<div id="sy-s1" style="position:absolute;bottom:40px;left:8%;width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#7fd0ff,#2f80d0);display:grid;place-items:center;font-weight:900;color:#fff;box-shadow:0 6px 14px -6px rgba(0,0,0,.5)">m₁</div>'+
      '<div id="sy-s2" style="position:absolute;bottom:40px;left:32%;width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#8dffb0,#0ba360);display:grid;place-items:center;font-weight:900;color:#fff;box-shadow:0 6px 14px -6px rgba(0,0,0,.5)">m₂</div>'+
      '<div id="sy-f" style="position:absolute;left:70%;bottom:40px;font-size:30px;opacity:0;color:#ffd76b">➡️ F</div>'+
      '<div style="position:absolute;left:0;right:0;bottom:0;height:6px;background:#565db0;border-radius:4px"></div>'+
      '<div id="sy-msg" style="position:absolute;top:4px;left:0;right:0;text-align:center;color:#ffd76b;font-weight:800;font-size:14px">System (m₁ + m₂) pulled by force F</div>'+
    '</div>'+
    '<div class="lab-bar"><button class="lab-btn" id="sy-run">▶ Pull the system</button>'+
      '<button class="lab-btn" id="sy-mom">Ball collision: momentum conserved</button>'+
      '<button class="lab-btn" id="sy-reset">Reset</button></div>'+
  '</div>';
  var b1=stage.querySelector('#sy-s1'),b2=stage.querySelector('#sy-s2'),fv=stage.querySelector('#sy-f'),msg=stage.querySelector('#sy-msg');
  var timer=null;
  stage.querySelector('#sy-run').addEventListener('click',function(){
    if(timer)clearInterval(timer);fv.style.opacity=1;msg.textContent='a = F ÷ (m₁ + m₂) → both boxes accelerate together (tension = internal force)';
    var x=8,t=0;timer=setInterval(function(){x+=0.35+0.018*t;t++;b1.style.left=x+'%';b2.style.left=(x+24)+'%';if(x>55){clearInterval(timer);timer=null;msg.textContent='Whole system moves like ONE object of mass m₁+m₂ 🔗';fv.style.opacity=0;}},20);
  });
  stage.querySelector('#sy-mom').addEventListener('click',function(){
    if(timer)clearInterval(timer);fv.style.opacity=0;
    b1.style.left='8%';b2.style.left='32%';
    msg.textContent='Before: m₁ moving → hits m₂ … momentum transfers!';
    var x=8;timer=setInterval(function(){x+=0.8;b1.style.left=x+'%';if(x>=28){clearInterval(timer);timer=null;
      msg.textContent='Collision: m₁u₁ = m₁v₁ + m₂v₂ (momentum conserved) — equal & opposite forces during impact';
      var y=34;timer=setInterval(function(){y+=0.55;b1.style.left='28%';b2.style.left=y+'%';if(y>55){clearInterval(timer);timer=null;msg.textContent='After: momentum is shared/transferred — total stays the same ⚖️';}},20);}},20);
  });
  stage.querySelector('#sy-reset').addEventListener('click',function(){if(timer)clearInterval(timer);timer=null;b1.style.left='8%';b2.style.left='32%';fv.style.opacity=0;msg.textContent='System (m₁ + m₂) pulled by force F';});
}

/* registry */
var demos={
  demoForce:demoForce, demoBalanced:demoBalanced, demoFriction:demoFriction,
  demoFirst:demoFirst, demoSecond:demoSecond, demoThird:demoThird, demoSystem:demoSystem
};
document.addEventListener('DOMContentLoaded',function(){
  Object.keys(demos).forEach(function(k){
    var st=document.getElementById(k); if(st) demos[k](st);
  });
});
})();
