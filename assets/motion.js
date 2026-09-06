/* ══════════════════════════════════════════════════════════════════
   Shared motion — Smeet Kataria
   No dependencies. Every behaviour is opt-in through markup, so a page
   only pays for what it actually uses, and every one is gated on
   prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var doc=document,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* one rAF pump for every scroll listener rather than each one racing */
var jobs=[],pending=false;
function onScroll(fn){jobs.push(fn);fn();}
function pump(){pending=false;for(var i=0;i<jobs.length;i++)jobs[i]();}
addEventListener('scroll',function(){if(!pending){pending=true;requestAnimationFrame(pump);}},{passive:true});
addEventListener('resize',function(){if(!pending){pending=true;requestAnimationFrame(pump);}});
/* A hidden tab suspends rAF, so a page opened in the background never runs the
   pump and its scroll-driven state is left wherever it started. Re-run once on
   the way back so nothing is stuck when the tab is finally looked at. */
addEventListener('visibilitychange',function(){
  if(!doc.hidden&&!pending){pending=true;requestAnimationFrame(pump);}
});

var yr=doc.getElementById('yr');
if(yr)yr.textContent=new Date().getFullYear();

/* ── CURTAIN ── */
(function(){
  var curt=doc.querySelector('.curtain');
  if(!curt){doc.body.classList.add('lit');return;}
  if(reduce){curt.remove();doc.body.classList.add('lit');return;}
  var bar=curt.querySelector('.curtain-rule i'),num=curt.querySelector('.curtain-num');
  var shown=0,lifted=false,t0=performance.now();
  doc.body.style.overflow='hidden';
  requestAnimationFrame(function(){curt.classList.add('go');});
  function lift(){
    if(lifted)return;lifted=true;
    if(num)num.textContent='100';
    if(bar)bar.style.width='100%';
    setTimeout(function(){
      curt.classList.add('up');doc.body.style.overflow='';doc.body.classList.add('lit');
      setTimeout(function(){if(curt.parentNode)curt.remove();},1000);
    },320);
  }
  (function count(t){
    var byTime=Math.min(1,(t-t0)/1250);
    var byLoad=doc.readyState==='complete'?1:doc.readyState==='interactive'?.72:.4;
    shown=Math.max(shown,Math.round(Math.min(byTime,Math.max(byTime*.55,byLoad))*100));
    if(num)num.textContent=shown;
    if(bar)bar.style.width=shown+'%';
    if(shown<100&&!lifted)requestAnimationFrame(count);else lift();
  })(t0);
  addEventListener('load',function(){setTimeout(lift,220);});
  setTimeout(lift,2000);                       /* hard ceiling — never traps the page */
})();

/* ── CURSOR ── */
(function(){
  var cur=doc.querySelector('.cursor');
  if(!cur)return;
  if(reduce||!matchMedia('(hover:hover) and (pointer:fine)').matches){cur.remove();return;}
  var cx=0,cy=0,tx=0,ty=0;
  addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
  (function spin(){
    cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;
    cur.style.transform='translate('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px) translate(-50%,-50%)';
    requestAnimationFrame(spin);
  })();
  doc.querySelectorAll('a,button').forEach(function(el){
    el.addEventListener('pointerenter',function(){
      var host=el.closest('[data-cursor]');
      var l=el.dataset.cursor||(host&&host.dataset.cursor);
      if(l){cur.dataset.label=l;cur.classList.add('label');}else cur.classList.add('big');
    });
    el.addEventListener('pointerleave',function(){cur.classList.remove('big','label');});
  });
})();

/* ── SMOOTH SCROLL ── wheel eased into the real scroll position, so sticky,
   IntersectionObserver and anchors all keep reading a genuine scrollY ── */
(function(){
  if(reduce||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var target=scrollY,current=scrollY,running=false,lastSet=-1;
  function maxScroll(){return Math.max(0,doc.documentElement.scrollHeight-innerHeight);}
  function nativeZone(node){
    for(var el=node;el&&el!==doc.body;el=el.parentElement){
      var s=getComputedStyle(el);
      if((s.overflowY==='auto'||s.overflowY==='scroll')&&el.scrollHeight>el.clientHeight+2)return true;
      if((s.overflowX==='auto'||s.overflowX==='scroll')&&el.scrollWidth>el.clientWidth+2)return true;
    }
    return false;
  }
  function run(){
    /* someone else moved the page — hand control back instead of fighting */
    if(lastSet>=0&&Math.abs(scrollY-lastSet)>2){target=current=scrollY;running=false;lastSet=-1;return;}
    var d=target-current;
    if(Math.abs(d)<.4){current=target;running=false;lastSet=-1;scrollTo(0,Math.round(current));return;}
    current+=d*.11;lastSet=Math.round(current);scrollTo(0,lastSet);requestAnimationFrame(run);
  }
  function start(){if(!running){running=true;lastSet=Math.round(scrollY);current=scrollY;requestAnimationFrame(run);}}
  addEventListener('wheel',function(e){
    if(e.ctrlKey||e.defaultPrevented||nativeZone(e.target))return;
    e.preventDefault();
    var dy=e.deltaY;
    if(e.deltaMode===1)dy*=16;else if(e.deltaMode===2)dy*=innerHeight;
    target=Math.max(0,Math.min(maxScroll(),target+dy));start();
  },{passive:false});
  addEventListener('scroll',function(){if(!running)target=current=scrollY;},{passive:true});
  addEventListener('resize',function(){target=current=scrollY;});
  doc.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href').slice(1);if(!id)return;
      var el=doc.getElementById(id);if(!el)return;
      e.preventDefault();doc.body.classList.remove('menu');
      target=Math.max(0,Math.min(maxScroll(),el.getBoundingClientRect().top+scrollY-70));start();
    });
  });
})();

/* ── NAV ── */
onScroll(function(){doc.body.classList.toggle('scrolled',scrollY>innerHeight*.5);});
(function(){
  var burger=doc.querySelector('.burger');
  if(burger)burger.addEventListener('click',function(){
    var open=doc.body.classList.toggle('menu');
    burger.setAttribute('aria-expanded',open?'true':'false');
  });
  doc.querySelectorAll('.mobile-menu a').forEach(function(a){
    a.addEventListener('click',function(){doc.body.classList.remove('menu');});
  });
  var map=new Map();
  doc.querySelectorAll('.nav-links a').forEach(function(l){
    var href=l.getAttribute('href')||'';
    if(href.charAt(0)!=='#')return;
    var sec=doc.getElementById(href.slice(1));
    if(sec)map.set(sec,l);
  });
  if(!map.size)return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var l=map.get(e.target);
      if(l)l.classList.toggle('active',e.isIntersecting);
    });
  },{rootMargin:'-28% 0px -62% 0px'});
  map.forEach(function(_,s){io.observe(s);});
})();

/* ── REVEAL ── observer plus a sweep, so a jump link or a fast flick can
   never strand a section parked at opacity 0 ── */
(function(){
  var revs=[].slice.call(doc.querySelectorAll('[data-rev]'));
  if(!revs.length)return;
  if(reduce){revs.forEach(function(el){el.classList.add('in');});return;}
  function show(el,stagger){
    if(el.dataset.shown)return;
    el.dataset.shown='1';
    if(el.hasAttribute('data-stagger'))
      Array.prototype.forEach.call(el.children,function(k,i){
        k.style.transitionDelay=(stagger?i*75:0)+'ms';k.classList.add('in');
      });
    el.classList.add('in');
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){show(e.target,true);io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -15% 0px',threshold:0});
  revs.forEach(function(el){io.observe(el);});
  /* Rescue only what is genuinely scrolled PAST — top above the viewport.
     An earlier version swept at 93% of viewport height, which fired while the
     element was still below the fold and pre-empted the observer on every
     ordinary scroll, so the entrance played off-screen and the reader only
     ever saw the finished state. */
  onScroll(function(){
    revs.forEach(function(el){
      if(el.dataset.shown)return;
      if(el.getBoundingClientRect().top<0){show(el,false);io.unobserve(el);}
    });
  });
})();

/* ── SPLIT TITLES ── split in script so the markup stays plain text for
   assistive tech until it runs; aria-label restores the reading.
   .sec-title is split automatically; anything else opts in with [data-split].
   The hero opts in, so the very first thing on the page is the letter wave
   rather than a whole line sliding as one block. ── */
(function(){
  var titles=[].slice.call(doc.querySelectorAll('.sec-title,[data-split]'));
  if(!titles.length||reduce)return;
  /* One masked box per WORD, not per text node. A .split is inline-block with
     overflow:hidden, so a whole line inside one box could never wrap and long
     headings ran off the edge; words are separate boxes with real spaces
     between them, so the line breaks normally and each word still masks its
     own letters. Nested markup (em, the hero's line spans) is walked, so the
     accent styling survives the split. */
  var n=0;
  function splitInto(host,text){
    text.split(/(\s+)/).forEach(function(part){
      if(!part)return;
      if(/^\s+$/.test(part)){host.appendChild(doc.createTextNode(part));return;}
      var wrap=doc.createElement('span');
      wrap.className='split';wrap.setAttribute('aria-hidden','true');
      part.split('').forEach(function(ch){
        var b=doc.createElement('b');
        b.textContent=ch;
        b.style.setProperty('--i',n++);
        wrap.appendChild(b);
      });
      host.appendChild(wrap);
    });
  }
  function walk(src,dest){
    [].slice.call(src.childNodes).forEach(function(node){
      if(node.nodeType===3){splitInto(dest,node.nodeValue);return;}
      if(node.nodeType!==1){return;}
      var clone=doc.createElement(node.nodeName);
      for(var i=0;i<node.attributes.length;i++)
        clone.setAttribute(node.attributes[i].name,node.attributes[i].value);
      dest.appendChild(clone);
      walk(node,clone);
    });
  }
  titles.forEach(function(t){
    var label=t.textContent.replace(/\s+/g,' ').trim();
    var src=t.cloneNode(true);
    t.textContent='';
    t.setAttribute('aria-label',label);
    n=0;
    walk(src,t);
  });
  function light(t){t.querySelectorAll('.split').forEach(function(s){s.classList.add('on');});}

  /* [data-split-now] plays on load rather than on scroll — the hero is already
     on screen, so waiting for an intersection would mean it never runs */
  var onLoad=titles.filter(function(t){return t.hasAttribute('data-split-now');});
  onLoad.forEach(function(t){
    var start=function(){setTimeout(function(){light(t);},260);};
    if(doc.body.classList.contains('lit'))start();
    else{
      var wait=setInterval(function(){
        if(doc.body.classList.contains('lit')){clearInterval(wait);start();}
      },80);
      setTimeout(function(){clearInterval(wait);light(t);},2600);  /* never stall */
    }
  });
  titles=titles.filter(function(t){return !t.hasAttribute('data-split-now');});
  if(!titles.length)return;
  /* A one-line heading is short, so a plain threshold is met the instant it
     peeks over the bottom edge and the letters rise off-screen. The negative
     bottom margin pulls the trigger line up to ~78% of the viewport, so the
     rise happens where it can be read. */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){light(e.target);io.unobserve(e.target);}});
  },{threshold:0,rootMargin:'0px 0px -22% 0px'});
  titles.forEach(function(t){io.observe(t);});
  /* same rule as the reveals: rescue only titles already scrolled past, and
     leave ordinary scrolling to the observer, which fires at 35% visible —
     where the letters actually rise in front of the reader */
  onScroll(function(){
    titles.forEach(function(t){
      if(t.querySelector('.split.on'))return;
      if(t.getBoundingClientRect().top<0){light(t);io.unobserve(t);}
    });
  });
})();

/* ── SECTION LABEL RULES ── */
(function(){
  var labels=[].slice.call(doc.querySelectorAll('.sec-label'));
  if(!labels.length)return;
  if(reduce){labels.forEach(function(l){l.classList.add('on');});return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}});
  },{threshold:0,rootMargin:'0px 0px -20% 0px'});
  labels.forEach(function(l){io.observe(l);});
  /* the raised trigger line means a fast scroll can jump the gap entirely, so
     these need the same already-passed rescue the reveals and titles have */
  onScroll(function(){
    labels.forEach(function(l){
      if(l.classList.contains('on'))return;
      if(l.getBoundingClientRect().top<0){l.classList.add('on');io.unobserve(l);}
    });
  });
})();

/* ── COUNT UP ── */
(function(){
  var nodes=[].slice.call(doc.querySelectorAll('[data-count]'));
  if(!nodes.length||reduce)return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target,goal=parseFloat(el.dataset.count),dec=parseInt(el.dataset.dec||'0',10);
      var t0=performance.now(),dur=1500;
      (function tick(now){
        var t=Math.min(1,(now-t0)/dur),k=1-Math.pow(1-t,3);
        el.textContent=(goal*k).toFixed(dec);
        if(t<1)requestAnimationFrame(tick);else el.textContent=goal.toFixed(dec);
      })(t0);
      io.unobserve(el);
    });
  },{threshold:.6});
  nodes.forEach(function(n){io.observe(n);});
})();

/* ── PROGRESS + BACK TO TOP ── */
(function(){
  var bar=doc.querySelector('.progress'),btn=doc.querySelector('.totop');
  var ring=btn&&btn.querySelector('circle');
  if(!bar&&!btn)return;
  onScroll(function(){
    var h=doc.documentElement,max=(h.scrollHeight||doc.body.scrollHeight)-h.clientHeight;
    var p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;
    if(bar)bar.style.transform='scaleX('+p.toFixed(4)+')';
    if(btn)btn.classList.toggle('on',scrollY>innerHeight*.85);
    if(ring)ring.style.strokeDashoffset=132*(1-p);
  });
  if(btn)btn.addEventListener('click',function(){
    if(reduce){scrollTo(0,0);return;}
    var start=scrollY,t0=performance.now(),dur=760;
    (function step(now){
      var t=Math.min(1,(now-t0)/dur),k=1-Math.pow(1-t,3);
      scrollTo(0,start*(1-k));if(t<1)requestAnimationFrame(step);
    })(t0);
  });
})();

/* ── TICKER ── runs with the scroll and speeds up with it ── */
(function(){
  var track=doc.querySelector('.ticker-track');
  if(!track||reduce)return;
  var x=0,half=0,base=.032,boost=0,dir=1,lastY=scrollY;
  function measure(){half=track.scrollWidth/2;}
  measure();addEventListener('resize',measure);addEventListener('load',measure);
  onScroll(function(){
    var dy=scrollY-lastY;
    if(Math.abs(dy)>2)dir=dy>0?1:-1;
    boost=Math.min(2.8,Math.abs(dy)/22);lastY=scrollY;
  });
  (function run(t,prev){
    var dt=prev?Math.min(48,t-prev):16;
    x-=dir*(base*(1+boost))*dt;boost*=.94;
    if(half){if(-x>=half)x+=half;else if(x>0)x-=half;}
    track.style.transform='translate3d('+x.toFixed(2)+'px,0,0)';
    requestAnimationFrame(function(n){run(n,t);});
  })(0,0);
})();

/* ── DIAGONAL BANDS ── two rows of images tilted off-axis and drifting in
   opposite directions, the tilt fixed in CSS and only the offset animated.
   Speed is scroll-reactive, so the bands shear apart as the page moves. ── */
(function(){
  var bands=[].slice.call(doc.querySelectorAll('.band-row'));
  if(!bands.length||reduce)return;
  var lastY=scrollY,boost=0;
  onScroll(function(){boost=Math.min(3.2,Math.abs(scrollY-lastY)/20);lastY=scrollY;});
  bands.forEach(function(row){
    var dir=row.dataset.dir==='rev'?-1:1;
    var speed=parseFloat(row.dataset.speed||'.035');
    var x=dir<0?-row.scrollWidth/2:0,half=0;
    function measure(){half=row.scrollWidth/2;}
    measure();addEventListener('resize',measure);addEventListener('load',measure);
    (function run(t,prev){
      var dt=prev?Math.min(48,t-prev):16;
      x-=dir*(speed*(1+boost))*dt;
      if(half){if(-x>=half)x+=half;else if(x>0)x-=half;}
      row.style.transform='translate3d('+x.toFixed(2)+'px,0,0)';
      requestAnimationFrame(function(n){run(n,t);});
    })(0,0);
  });
})();

/* ── BLOOM ── the light source behind the hero. Layered radial plumes drawn
   additively on a canvas: cheap enough to run at a fraction of the real pixel
   size and scaled up, which also gives the softness for free. It leans toward
   the pointer, drifts on its own, and dims as the hero scrolls away. */
(function(){
  var cv=doc.querySelector('[data-bloom]');
  if(!cv||!cv.getContext)return;
  var ctx=cv.getContext('2d'),W=0,H=0,live=true;
  var SCALE=7;                       /* draw small, upscale — the blur is free */

  var plumes=[
    {x:.42,y:.44,r:.62,c:'242,132,60',  a:.55,sx:.00019,sy:.00013,p:0},
    {x:.62,y:.52,r:.50,c:'255,161,92',  a:.42,sx:-.00015,sy:.00021,p:2.1},
    {x:.34,y:.62,r:.44,c:'124,92,255',  a:.30,sx:.00022,sy:-.00017,p:4.2},
    {x:.72,y:.34,r:.36,c:'242,192,124', a:.26,sx:-.00012,sy:-.00019,p:1.3},
    {x:.50,y:.70,r:.30,c:'226,80,60',   a:.24,sx:.00016,sy:.00011,p:3.4}
  ];
  var px=.5,py=.5,tx=.5,ty=.5;
  if(matchMedia('(hover:hover)').matches&&!reduce)
    addEventListener('pointermove',function(e){
      tx=e.clientX/innerWidth;ty=e.clientY/innerHeight;
    },{passive:true});

  function size(){
    W=cv.width=Math.max(1,Math.round(cv.clientWidth/SCALE));
    H=cv.height=Math.max(1,Math.round(cv.clientHeight/SCALE));
  }
  size();addEventListener('resize',size);

  function paint(t){
    px+=(tx-px)*.045;py+=(ty-py)*.045;      /* the lean lags the pointer */
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    for(var i=0;i<plumes.length;i++){
      var pl=plumes[i];
      var lean=(i%2?-1:1)*.05;
      var cx=(pl.x+Math.sin(t*pl.sx+pl.p)*.14+(px-.5)*lean)*W;
      var cy=(pl.y+Math.cos(t*pl.sy+pl.p)*.12+(py-.5)*lean)*H;
      var rad=pl.r*Math.max(W,H)*(.86+Math.sin(t*.00022+pl.p)*.14);
      var g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
      g.addColorStop(0,'rgba('+pl.c+','+pl.a+')');
      g.addColorStop(.45,'rgba('+pl.c+','+(pl.a*.35).toFixed(3)+')');
      g.addColorStop(1,'rgba('+pl.c+',0)');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
  }

  if(reduce){paint(0);return;}
  (function draw(t){if(live){paint(t);requestAnimationFrame(draw);}})(0);
  doc.addEventListener('visibilitychange',function(){
    live=!doc.hidden;
    if(live)requestAnimationFrame(function d(t){if(live){paint(t);requestAnimationFrame(d);}});
  });

  /* the bloom sinks and dims as the hero leaves, so it reads as a light source
     the page moves past rather than a texture stuck to the viewport */
  var host=cv.parentElement;
  onScroll(function(){
    var y=scrollY,vh=innerHeight;
    if(y>vh*1.25)return;
    var p=Math.min(1,y/vh);
    host.style.opacity=Math.max(0,1-p*.85).toFixed(3);
    host.style.transform='translateY('+(y*.32).toFixed(1)+'px) scale('+(1+p*.14).toFixed(3)+')';
  });
})();

/* ── SLICED REVEAL ── shutters built in script over anything [data-slices],
   lifting in sequence so the image behind builds in bands. The count comes
   from the attribute so a narrow tile can use fewer. */
(function(){
  var hosts=[].slice.call(doc.querySelectorAll('[data-slices]'));
  if(!hosts.length)return;
  hosts.forEach(function(host){
    var n=parseInt(host.dataset.slices,10)||8;
    var bar=doc.createElement('div');
    bar.className='slices';bar.setAttribute('aria-hidden','true');
    for(var i=0;i<n;i++){
      var s=doc.createElement('i');
      s.style.setProperty('--d',i);
      bar.appendChild(s);
    }
    host.appendChild(bar);
  });
  if(reduce){hosts.forEach(function(h){h.querySelector('.slices').classList.add('open');});return;}
  function open(h){
    var bar=h.querySelector('.slices');
    if(!bar.classList.contains('open'))bar.classList.add('open');
  }

  /* A tile in the work rail travels sideways inside a pinned viewport: it is
     vertically on screen the whole time, so a vertical trigger fires while it
     is still far off to the right and the shutters are long gone before anyone
     sees them. Those tiles are watched horizontally instead, and unshutter as
     they actually slide into frame. Everything else uses a normal observer. */
  var rail=doc.getElementById('railWrap');
  var inRail=[],outside=[];
  hosts.forEach(function(h){(rail&&rail.contains(h)?inRail:outside).push(h);});

  if(outside.length){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){open(e.target);io.unobserve(e.target);}});
    },{threshold:0,rootMargin:'0px 0px -12% 0px'});
    outside.forEach(function(h){io.observe(h);});
    onScroll(function(){
      outside.forEach(function(h){
        if(h.getBoundingClientRect().top<0)open(h);
      });
    });
  }

  if(inRail.length)onScroll(function(){
    inRail.forEach(function(h){
      var r=h.getBoundingClientRect();
      if(r.left<innerWidth*.92&&r.right>innerWidth*.06)open(h);
    });
  });
})();

/* ── SPLIT SCREEN ── the panel tears across the middle and the halves slide
   apart to uncover what is behind them */
(function(){
  var tears=[].slice.call(doc.querySelectorAll('.tear'));
  if(!tears.length)return;
  if(reduce){tears.forEach(function(t){t.classList.add('open');});return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target;
      setTimeout(function(){el.classList.add('open');},180);
      io.unobserve(el);
    });
  },{threshold:0,rootMargin:'0px 0px -28% 0px'});
  tears.forEach(function(t){io.observe(t);});
  onScroll(function(){
    tears.forEach(function(t){
      if(t.classList.contains('open'))return;
      if(t.getBoundingClientRect().top<0){t.classList.add('open');io.unobserve(t);}
    });
  });
})();

/* ── SCRAMBLE ── nav labels churn through glyphs before settling back.
   The original text is kept on the node so a half-finished run can always be
   restored, and each element runs at most one loop at a time. */
(function(){
  var targets=[].slice.call(doc.querySelectorAll('[data-scramble]'));
  if(!targets.length||reduce||!matchMedia('(hover:hover)').matches)return;
  var GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>*+-';
  targets.forEach(function(el){
    var real=el.textContent,timer=null;
    el.classList.add('scramble');
    el.addEventListener('pointerenter',function(){
      if(timer)clearInterval(timer);
      var frame=0,total=real.length*2+8;
      timer=setInterval(function(){
        frame++;
        var settled=Math.floor(frame/2);
        el.textContent=real.split('').map(function(ch,i){
          if(ch===' ')return ' ';
          if(i<settled)return ch;
          return GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
        }).join('');
        if(frame>=total){clearInterval(timer);timer=null;el.textContent=real;}
      },28);
    });
    el.addEventListener('pointerleave',function(){
      if(timer){clearInterval(timer);timer=null;}
      el.textContent=real;
    });
  });
})();

/* ── WORDMARK ── the oversized name drifts, and reverses with scroll direction */
(function(){
  var track=doc.querySelector('.wordmark-track');
  if(!track||reduce)return;
  var x=0,half=0,base=.028,boost=0,dir=1,lastY=scrollY;
  function measure(){half=track.scrollWidth/2;}
  measure();addEventListener('resize',measure);addEventListener('load',measure);
  onScroll(function(){
    var dy=scrollY-lastY;
    if(Math.abs(dy)>2)dir=dy>0?1:-1;
    boost=Math.min(3.4,Math.abs(dy)/18);lastY=scrollY;
  });
  (function run(t,prev){
    var dt=prev?Math.min(48,t-prev):16;
    x-=dir*(base*(1+boost))*dt;boost*=.93;
    if(half){if(-x>=half)x+=half;else if(x>0)x-=half;}
    track.style.transform='translate3d('+x.toFixed(2)+'px,0,0)';
    requestAnimationFrame(function(n){run(n,t);});
  })(0,0);
})();

/* ── PARALLAX ── */
(function(){
  var pars=[].slice.call(doc.querySelectorAll('[data-par]'));
  if(!pars.length||reduce)return;
  onScroll(function(){
    var vh=innerHeight;
    pars.forEach(function(el){
      var b=el.getBoundingClientRect();
      if(b.bottom<-200||b.top>vh+200)return;         /* offscreen costs nothing */
      var mid=(b.top+b.height/2-vh/2)/vh;
      el.style.transform='translateY('+(mid*(parseFloat(el.dataset.par)||16)).toFixed(1)+'px)';
    });
  });
})();

/* ── WORD WARM-UP ── */
(function(){
  var hosts=[].slice.call(doc.querySelectorAll('[data-warm]'));
  if(!hosts.length)return;
  var all=[];
  hosts.forEach(function(host){
    host.classList.add('warm');
    var walk=doc.createTreeWalker(host,NodeFilter.SHOW_TEXT),nodes=[],n;
    while((n=walk.nextNode()))nodes.push(n);
    nodes.forEach(function(node){
      if(!node.nodeValue.trim())return;
      var frag=doc.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function(part){
        if(!part.trim()){frag.appendChild(doc.createTextNode(part));return;}
        var s=doc.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag,node);
    });
    all=all.concat([].slice.call(host.querySelectorAll('.w')));
  });
  if(reduce){all.forEach(function(w){w.classList.add('on');});return;}
  onScroll(function(){
    var vh=innerHeight;
    all.forEach(function(w){
      var p=(vh-w.getBoundingClientRect().top)/(vh*.62);
      w.classList.toggle('on',p>0&&p<2.6);
    });
  });
})();

/* ── MAGNETIC BUTTONS ── */
(function(){
  if(reduce||!matchMedia('(hover:hover)').matches)return;
  doc.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect();
      var dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;
      b.style.transform='translate('+(dx*9).toFixed(1)+'px,'+(dy*6).toFixed(1)+'px)';
    });
    b.addEventListener('pointerleave',function(){b.style.transform='';});
  });
})();

/* ── POINTER GLOW ── any [data-glow] gets a cursor-tracked wash ── */
doc.querySelectorAll('[data-glow]').forEach(function(el){
  el.addEventListener('pointermove',function(e){
    var r=el.getBoundingClientRect();
    el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* ── DRAWN SVG ── any .draw inside a [data-draw] runs once, in view ── */
(function(){
  var hosts=[].slice.call(doc.querySelectorAll('[data-draw]'));
  if(!hosts.length)return;
  hosts.forEach(function(h){
    h.querySelectorAll('.draw').forEach(function(p){
      try{p.style.setProperty('--len',Math.ceil(p.getTotalLength()));}catch(e){}
    });
  });
  if(reduce){hosts.forEach(function(h){h.classList.add('seen');});return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target);}});
  },{threshold:.25});
  hosts.forEach(function(h){io.observe(h);});
})();

window.__motion={onScroll:onScroll,reduce:reduce};
})();
