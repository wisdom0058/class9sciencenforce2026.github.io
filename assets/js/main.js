/* ===== Chapter 6 study site — shared behaviours ===== */
(function(){
  "use strict";

  /* ---------- tiny helpers ---------- */
  function $(s,ctx){return (ctx||document).querySelector(s)}
  function $$(s,ctx){return Array.prototype.slice.call((ctx||document).querySelectorAll(s))}
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- mobile nav / dropdown ---------- */
  function closeAll(){ $$('.drop').forEach(function(d){ d.classList.remove('open'); syncDrop(d); }); }
  function syncDrop(d){
    var b=d.querySelector('button[aria-expanded]');
    if(b){ b.setAttribute('aria-expanded', d.classList.contains('open') ? 'true':'false'); }
  }
  document.addEventListener('click',function(e){
    var dd=e.target.closest && e.target.closest('.drop');
    $$('.drop').forEach(function(d){ if(d!==dd){ d.classList.remove('open'); syncDrop(d); } });
    if(dd){
      e.preventDefault?e.preventDefault():0;
      dd.classList.toggle('open');
      syncDrop(dd);
    }
  });
  /* close the menu when a choice is tapped */
  document.addEventListener('click',function(e){
    var a=e.target.closest && e.target.closest('.drop-panel a');
    if(a){ closeAll(); }
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeAll(); } });
  window.addEventListener('resize',function(){
    if(window.innerWidth>980){ closeAll(); }
  });

  /* ---------- make wide tables scrollable on small screens ---------- */
  function wrapTables(scope){
    (scope||document).querySelectorAll('table').forEach(function(t){
      if(!t.parentElement || !t.parentElement.classList.contains('tscroll')){
        var w=document.createElement('div');
        w.className='tscroll';
        t.parentNode.insertBefore(w,t);
        w.appendChild(t);
      }
    });
  }
  document.addEventListener('DOMContentLoaded',function(){ wrapTables(document); });

  /* ---------- top progress + back to top ---------- */
  var bar=$('.progress'), btop=$('.back-top');
  function onScroll(){
    var h=document.documentElement;
    var sc=h.scrollTop||document.body.scrollTop;
    var max=h.scrollHeight-h.clientHeight;
    if(bar) bar.style.width=(max>0?(sc/max*100):0)+'%';
    if(btop) btop.classList.toggle('show', sc>600);
  }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(btop) btop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  /* ---------- reveal on scroll ---------- */
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:.06}):null;
  $$('.reveal').forEach(function(el){ if(io) io.observe(el); else el.classList.add('in'); });

  /* ---------- audio manager ---------- */
  var AudioMgr={
    current:null, currentBtn:null, unavailable:[],
    /* register button: tries file, disables gracefully if missing */
    initBtn:function(btn){
      var src=btn.getAttribute('data-src'); if(!src) return;
      var test=new Audio();
      test.preload='none';
      var failed=false;
      var timer=setTimeout(function(){ failed=true; test.src=''; }, 3000);
      test.addEventListener('error',function(){
        clearTimeout(timer);
        if(!failed){ failed=true; btn.classList.add('unavail');
          btn.querySelector('.lbl').textContent='Audio not added yet';
          btn.setAttribute('title','Audio clip not included in this build yet'); }
      });
      test.addEventListener('canplaythrough',function(){ clearTimeout(timer); });
      test.src=src;
    },
    toggle:function(btn){
      var src=btn.getAttribute('data-src');
      if(!src) return;
      if(this.current && this.currentBtn===btn && !this.current.paused){ this.stop(); return; }
      var aud=new Audio(src);
      var self=this;
      aud.addEventListener('error',function(){ btn.classList.add('unavail'); var l=btn.querySelector('.lbl'); if(l) l.textContent='Audio not added yet'; });
      this.stop();
      btn.classList.add('playing');
      aud.addEventListener('ended',function(){ btn.classList.remove('playing'); self.current=null; self.currentBtn=null; });
      aud.play().catch(function(){});
      this.current=aud; this.currentBtn=btn;
    },
    stop:function(){ if(this.current){ try{this.current.pause()}catch(e){} this.current=null; }
      if(this.currentBtn){ this.currentBtn.classList.remove('playing'); this.currentBtn=null; } }
  };
  window.stopAudio=function(){ AudioMgr.stop(); };

  /* audio buttons (both in FAQ & anywhere) */
  document.addEventListener('click',function(e){
    var btn=e.target.closest && e.target.closest('.aud-btn,.aud-big');
    if(btn){ if(!btn.classList.contains('unavail')) AudioMgr.toggle(btn); }
  });
  /* pre-register all existing audio buttons to detect missing files */
  $$('.aud-btn,.aud-big').forEach(function(b){ AudioMgr.initBtn(b); });

  /* ---------- quiz engine ---------- */
  function setupQuiz(box){
    if(!box || box._ready) return; box._ready=true;
    var items=$$('.q-item',box);
    items.forEach(function(it,idx){
      var correct=+it.getAttribute('data-ans');
      var opts=$$('.opt',it);
      var fb=$('.feedback',it);
      var rightKey='ABCD'[correct]||String.fromCharCode(65+correct);
      opts.forEach(function(o,i){
        o.addEventListener('click',function(){
          if(it.getAttribute('data-done')==='1') return;
          it.setAttribute('data-done','1');
          opts.forEach(function(x){x.disabled=true});
          var key='ABCD'[i]||String.fromCharCode(65+i);
          if(i===correct){ o.classList.add('right'); fb.className='feedback ok show'; fb.innerHTML='<i>&#10004; Correct!</i> '+(o.getAttribute('data-exp')||'Well done.') }
          else{
            o.classList.add('wrong');
            var ro=opts[correct]; ro.classList.add('right');
            fb.className='feedback no show'; fb.innerHTML='<i>&#10008; Not quite.</i> Correct answer: <b>'+rightKey+'. '+(ro.textContent||'').slice(0,90)+'</b>…<br>'+(o.getAttribute('data-exp')||'');
          }
        });
      });
    });
  }
  $$('.quizbox').forEach(function(b){setupQuiz(b)});
  window.setupQuiz=setupQuiz; /* usable after dynamic insert */

  /* retry whole quiz */
  document.addEventListener('click',function(e){
    var r=e.target.closest && e.target.closest('.quiz-reset');
    if(!r) return;
    var box=r.getAttribute('data-target'); if(!box) box=r.getAttribute('data-id');
    var scope=box?$('#'+box):r.closest('.quizbox');
    if(scope){
      $$('.q-item',scope).forEach(function(it){
        it.setAttribute('data-done','0');
        $$('.opt',it).forEach(function(o){o.disabled=false;o.classList.remove('right','wrong')});
        var fb=$('.feedback',it); if(fb){fb.className='feedback';}
      });
    }
  });

  /* ---------- hero quick buttons -> smooth scroll to matching card ---------- */
  var HERO_MAP={lesson:"",demo:"Demo Lab",quiz:"Quick Quiz",faq:"Ask & Understand",bookqa:"Book Questions"};
  $$('.hero-btns a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var key=a.getAttribute('href').slice(1);
      var needle=HERO_MAP[key];
      var el=document.getElementById(key);
      if(!el && needle!==undefined){
        if(key==='lesson'){ el=document.querySelector('.card'); }
        else{
          var heads=$$('.card h2');
          for(var i=0;i<heads.length;i++){
            if(heads[i].textContent.trim().indexOf(needle)===0){ el=heads[i].closest('.card'); break; }
          }
        }
      }
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* FAQ audio inside faq bodies already covered by delegation */
})();
