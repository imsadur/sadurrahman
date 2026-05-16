/* sr.js — shared across all pages */
(function () {
  // ── THEME
  const html = document.documentElement;
  html.setAttribute('data-theme', localStorage.getItem('sr-theme') || 'dark');
  const toggle = document.getElementById('tt');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('sr-theme', next);
    });
    toggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle.click(); });
  }

  // ── CURSOR
  const cur = document.getElementById('sr-cur'), cuf = document.getElementById('sr-cuf');
  let mx = 0, my = 0, fx = 0, fy = 0;
  if (window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    });
    (function loop() { fx += (mx-fx)*.08; fy += (my-fy)*.08; if(cuf){cuf.style.left=fx+'px';cuf.style.top=fy+'px';} requestAnimationFrame(loop); })();
  }

  // ── NAV SCROLL
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), {passive:true});

  // ── MOBILE MENU
  const hbg = document.getElementById('hbg'), mob = document.getElementById('mob');
  if (hbg && mob) {
    hbg.addEventListener('click', () => { hbg.classList.toggle('open'); mob.classList.toggle('open'); document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : ''; });
  }
  window.closeMob = () => { if(hbg)hbg.classList.remove('open'); if(mob){mob.classList.remove('open');document.body.style.overflow='';} };

  // ── SCROLL REVEAL
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: .07 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── COUNTER ANIMATION
  const cobs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, t = parseInt(el.dataset.target); let s, d = 1400;
      const step = ts => { if(!s)s=ts; const p=Math.min((ts-s)/d,1); el.textContent=Math.floor((1-Math.pow(1-p,3))*t); if(p<1)requestAnimationFrame(step); else el.textContent=t; };
      requestAnimationFrame(step); cobs.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-target]').forEach(el => cobs.observe(el));

  // ── HERO PARALLAX
  if (window.matchMedia('(pointer:fine)').matches) {
    const bg = document.getElementById('hero-bg-img'), nm = document.getElementById('hero-name-block');
    if (bg || nm) {
      document.addEventListener('mousemove', e => {
        const cx=innerWidth/2, cy=innerHeight/2, dx=(e.clientX-cx)/cx, dy=(e.clientY-cy)/cy;
        if(bg) bg.style.transform=`scale(1.04) translate(${dx*7}px,${dy*5}px)`;
        if(nm) nm.style.transform=`translate(${dx*3}px,${dy*2}px)`;
      });
    }
  }

  // ── MAGNETIC BUTTONS
  document.querySelectorAll('.cta-btn,.nav-cta,.mag').forEach(btn => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    btn.addEventListener('mousemove', e => { const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.26}px,${(e.clientY-r.top-r.height/2)*.26}px)`; });
    btn.addEventListener('mouseleave', () => { btn.style.transition='transform .6s cubic-bezier(.16,1,.3,1),background .3s,box-shadow .3s'; btn.style.transform=''; });
    btn.addEventListener('mouseenter', () => { btn.style.transition='transform .1s,background .3s,box-shadow .3s'; });
  });

  // ── SHOWCASE CARDS
  document.querySelectorAll('.sc-card').forEach(card => {
    const slides=card.querySelectorAll('.sc-slide'), dots=card.querySelectorAll('.sc-dot'); let current=0, timer;
    function show(i){slides[current].classList.remove('active');if(dots[current])dots[current].classList.remove('on');current=i;slides[current].classList.add('active');if(dots[current])dots[current].classList.add('on');}
    function next(){show((current+1)%slides.length);}
    if(slides.length>1){slides[0].classList.add('active');if(dots[0])dots[0].classList.add('on');timer=setInterval(next,2200);card.addEventListener('mouseenter',()=>clearInterval(timer));card.addEventListener('mouseleave',()=>{timer=setInterval(next,2200);});dots.forEach((dot,i)=>dot.addEventListener('click',e=>{e.stopPropagation();clearInterval(timer);show(i);timer=setInterval(next,2200);}));}else if(slides[0])slides[0].classList.add('active');
  });

  // ── PAGE TRANSITIONS
  document.body.style.opacity='0'; document.body.style.transition='opacity .4s ease';
  setTimeout(()=>document.body.style.opacity='1',40);
  document.querySelectorAll('a[href]').forEach(link=>{
    if(link.hostname===location.hostname&&!link.href.includes('#')&&!link.target){
      link.addEventListener('click',e=>{e.preventDefault();const h=link.href;document.body.style.opacity='0';setTimeout(()=>location.href=h,360);});
    }
  });

  // ── FOOTER CLOCK IST
  function tick(){
    const ist=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
    const hh=String(ist.getHours()).padStart(2,'0'),mm=String(ist.getMinutes()).padStart(2,'0'),ss=String(ist.getSeconds()).padStart(2,'0');
    const d=document.getElementById('clockDisplay'); if(d)d.textContent=hh+':'+mm+':'+ss;
    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const cd=document.getElementById('clockDate'); if(cd)cd.textContent=days[ist.getDay()]+', '+months[ist.getMonth()]+' '+ist.getDate();
  }
  tick(); setInterval(tick,1000);

  // ── FOOTER NAME PARALLAX
  const fnTrack=document.getElementById('fnTrack'), fnName=document.getElementById('footerName');
  if(fnTrack&&fnName){
    fnTrack.style.opacity='0.12'; fnTrack.style.transform='scaleX(.18) scaleY(.35)'; fnTrack.style.transformOrigin='bottom left'; fnTrack.style.transition='none';
    const fObs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){window.addEventListener('scroll',onFnScroll,{passive:true});onFnScroll();}},{threshold:0});
    fObs.observe(fnName);
    function onFnScroll(){const rect=fnName.getBoundingClientRect(),wh=window.innerHeight,p=Math.max(0,Math.min(1,1-rect.top/wh));fnTrack.style.transform=`scaleX(${.18+p*.82}) scaleY(${.35+p*.65})`;fnTrack.style.opacity=Math.min(1,.12+p*.88);}
  }

})();

// ── SMOOTH HERO LETTER WAVE (called from page-specific script)
window.initHeroLetterEffect = function() {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  function splitLetters(el){const t=el.textContent;el.innerHTML='';[...t].forEach(ch=>{const s=document.createElement('span');s.className='letter';s.textContent=ch===' '?' ':ch;el.appendChild(s);});}
  ['nameWord1','nameWord2'].forEach(id=>{const el=document.getElementById(id);if(el)splitLetters(el);});
  document.querySelectorAll('.name-word').forEach(word=>{
    const letters=Array.from(word.querySelectorAll('.letter')); if(!letters.length)return;
    const states=letters.map(()=>({y:0,ty:0,c:0,tc:0})); let raf=null;
    function animate(){
      let active=false;
      states.forEach((s,i)=>{
        s.y+=(s.ty-s.y)*.11; s.c+=(s.tc-s.c)*.09;
        if(Math.abs(s.ty-s.y)>.05||Math.abs(s.tc-s.c)>.005)active=true;
        const l=letters[i];
        l.style.transform=`translateY(${-s.y}px) scaleX(${1+s.y*.005})`;
        l.style.color=s.c>.08?`rgba(201,168,76,${Math.min(1,s.c*1.2)})`:'';
      });
      raf=active?requestAnimationFrame(animate):null;
    }
    word.addEventListener('mousemove',e=>{
      letters.forEach((l,i)=>{
        const lr=l.getBoundingClientRect(),lx=lr.left+lr.width/2,dist=Math.abs(e.clientX-lx);
        const str=Math.pow(Math.max(0,1-dist/150),1.8);
        states[i].ty=str*28; states[i].tc=str;
      });
      if(!raf)raf=requestAnimationFrame(animate);
    });
    word.addEventListener('mouseleave',()=>{
      states.forEach(s=>{s.ty=0;s.tc=0;});
      if(!raf)raf=requestAnimationFrame(animate);
    });
  });
};
