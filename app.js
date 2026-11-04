
(function(){
"use strict";

var KEY="boxes-and-arrows-v2";
var GOAL=30;
var RANKS=[[0,"Intern"],[80,"Junior engineer"],[250,"Mid-level engineer"],[500,"Senior engineer"],[800,"Staff engineer"],[1150,"Principal engineer"]];
var DX=[0,56,0,-56];

function fresh(){return{xp:0,streak:0,lastDay:null,daily:{},done:{},seen:{},lab:{best:0,bests:{}},cases:{},iv:{best:0,runs:0}};}
function load(){
  try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&typeof o==="object")return Object.assign(fresh(),o);}}catch(e){}
  return fresh();
}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function yesterdayKey(){var d=new Date();d.setDate(d.getDate()-1);return dayKey(d);}
function streakNow(){return(S.lastDay===dayKey()||S.lastDay===yesterdayKey())?S.streak:0;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function shuffleNot(a){var s,n=0;do{s=shuffle(a);n++;}while(n<8&&s.every(function(v,i){return v===a[i];}));return s;}
function ic(n){return'<svg class="ic" aria-hidden="true"><use href="#i-'+n+'"/></svg>';}
function pickOne(a){return a[Math.floor(Math.random()*a.length)];}

function shard(mood,size){
  var w=Math.round(size*0.86);
  var mouth=mood==="sad"?"M49 114q11-9 22 0":"M49 106q11 10 22 0";
  var brows=mood==="sad"?'<path d="M36 84l14 4M84 84l-14 4" stroke="var(--shard-ink)" stroke-width="3" stroke-linecap="round" fill="none"/>':"";
  return'<svg class="shard" width="'+w+'" height="'+size+'" viewBox="0 0 120 140" aria-hidden="true">'+
    '<ellipse cx="60" cy="133" rx="34" ry="6" fill="var(--shadow)"/>'+
    '<path d="M20 34v70c0 12 18 20 40 20s40-8 40-20V34z" fill="var(--accent)"/>'+
    '<path d="M20 62c0 12 18 20 40 20s40-8 40-20" fill="none" stroke="var(--accent-edge)" stroke-width="3"/>'+
    '<ellipse cx="60" cy="34" rx="40" ry="16" fill="var(--accent-hi)" stroke="var(--accent-edge)" stroke-width="3"/>'+
    '<circle cx="45" cy="97" r="8" fill="#fff"/><circle cx="75" cy="97" r="8" fill="#fff"/>'+
    '<circle cx="46" cy="98" r="4" fill="var(--shard-ink)"/><circle cx="76" cy="98" r="4" fill="var(--shard-ink)"/>'+
    brows+'<path d="'+mouth+'" fill="none" stroke="var(--shard-ink)" stroke-width="3.5" stroke-linecap="round"/></svg>';
}

function rank(){
  var i=0;RANKS.forEach(function(r,k){if(S.xp>=r[0])i=k;});
  var cur=RANKS[i],nx=RANKS[i+1];
  return{name:cur[1],pct:nx?Math.round((S.xp-cur[0])/(nx[0]-cur[0])*100):100,toNext:nx?nx[0]-S.xp:0,next:nx?nx[1]:null};
}
function unlocked(l){var k=FLAT.indexOf(l);return k===0||!!S.done[FLAT[k-1].id];}
function nextLesson(){for(var i=0;i<FLAT.length;i++){if(!S.done[FLAT[i].id])return FLAT[i];}return null;}
function byId(id){for(var i=0;i<FLAT.length;i++){if(FLAT[i].id===id)return FLAT[i];}return null;}

var app=document.getElementById("app");
var view="path",L=null,openId=null,resetArm=false;

/* ---------- Path ---------- */
function topBar(){
  return'<div class="top"><div class="inner topin"><div class="brand">'+shard("happy",34)+'<span>Boxes &amp; Arrows</span></div>'+
    '<div class="stats"><span class="stat s-flame" title="Day streak" aria-label="Day streak">'+ic("flame")+streakNow()+'</span>'+
    '<span class="stat s-xp" title="Total XP" aria-label="Total XP">'+ic("bolt")+S.xp+'</span></div></div></div>';
}
function popHtml(l,state){
  var total=UNITS[l.ui].lessons.length;
  var meta="Lesson "+(l.li+1)+" of "+total+" · "+(l.teach?l.teach.length+" concepts · ":"")+l.ex.length+"-question bank";
  if(state==="locked"){
    return'<div class="pop locked"><h3>'+esc(l.title)+'</h3><p>Finish the lesson before this one to unlock it.</p></div>';
  }
  var d=S.done[l.id];
  return'<div class="pop"><span class="eyebrow">'+meta+'</span><h3>'+esc(l.title)+'</h3><p>'+(d?"Best accuracy "+d.acc+"%. Practice again to earn more XP.":esc(l.sub))+'</p>'+
    '<button class="btn wide" data-act="start" data-id="'+l.id+'">'+(d?"Practice again":"Start lesson")+'</button>'+
    (l.teach?'<button class="btn wide" data-act="notes" data-id="'+l.id+'">Read the notes</button>':'')+'</div>';
}
function renderNotes(id){
  var l=byId(id);if(!l)return;
  view="notes";
  var h=topBar()+'<div class="inner main"><button class="linkbtn" data-act="notesback">&larr; Back to the path</button><header class="head"><span class="eyebrow">Unit '+(l.ui+1)+' · '+esc(UNITS[l.ui].title)+'</span><h1>'+esc(l.title)+'</h1></header><div class="stack-gap">';
  (l.teach||[]).forEach(function(c){
    h+='<section class="card notecard"><h2>'+esc(c.h)+'</h2><div class="prose">'+paras(c.p)+'</div>'+
      (c.pts&&c.pts.length?'<ul class="tpts">'+c.pts.map(function(x){return'<li>'+esc(x)+'</li>';}).join("")+'</ul>':'')+
      (c.key?'<div class="tkey"><span class="eyebrow">Remember</span><p>'+esc(c.key)+'</p></div>':'')+'</section>';
  });
  h+='<button class="btn wide" data-act="startq" data-id="'+id+'">Go to the questions</button></div></div>'+navBar();
  app.innerHTML=h;window.scrollTo(0,0);
}
function renderPath(){
  var rk=rank(),today=S.daily[dayKey()]||0,gp=Math.min(100,Math.round(today/GOAL*100));
  var nxt=nextLesson(),h=topBar()+'<div class="inner main">';
  h+='<section class="card" aria-label="Your progress"><div><span class="eyebrow">Your rank</span><h2 class="rank">'+rk.name+'</h2></div>'+
    '<div><div class="row"><span class="small">'+(rk.next?rk.toNext+" XP to "+rk.next:"Top rank reached")+'</span><b>'+S.xp+' XP</b></div><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+rk.pct+'"><i style="width:'+rk.pct+'%"></i></div></div>'+
    '<div><div class="row"><span class="small">Daily goal</span><b>'+Math.min(today,GOAL)+' / '+GOAL+' XP</b></div><div class="meter gold" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+gp+'"><i style="width:'+gp+'%"></i></div></div></section>';
  var n=0;
  UNITS.forEach(function(u,ui){
    var dc=u.lessons.filter(function(l){return S.done[l.id];}).length;
    h+='<section class="unit" data-u="'+(ui+1)+'"><header class="banner"><div><span class="eyebrow">Unit '+(ui+1)+'</span><h2>'+esc(u.title)+'</h2><p>'+esc(u.blurb)+'</p></div><span class="count" aria-label="'+dc+' of '+u.lessons.length+' lessons complete">'+dc+'/'+u.lessons.length+'</span></header><div class="trail">';
    u.lessons.forEach(function(l){
      var state=S.done[l.id]?"done":(nxt&&nxt.id===l.id?"active":(unlocked(l)?"active":"locked"));
      if(S.done[l.id])state="done";
      var icon=state==="done"?"check":(state==="locked"?"lock":u.icon);
      var label=l.title+(state==="done"?", complete":state==="locked"?", locked":"");
      h+='<div class="stop '+state+'"><div class="nodewrap" style="--dx:'+DX[n%4]+'px">'+
        (state==="active"&&nxt&&nxt.id===l.id?'<span class="start-tip">Start</span>':'')+
        '<button class="node" data-act="open" data-id="'+l.id+'" aria-expanded="'+(openId===l.id)+'" aria-label="'+esc(label)+'">'+ic(icon)+'</button>'+
        '<span class="nlabel">'+esc(l.title)+'</span></div>'+(openId===l.id?popHtml(l,state):'')+'</div>';
      n++;
    });
    h+='</div></section>';
  });
  if(!nxt){h+='<section class="card" style="margin-top:30px"><h2 class="rank">You finished the path</h2><p class="small">Replay any lesson to keep your streak alive and push your rank higher.</p></section>';}
  h+='<div class="foot"><span class="small">Progress is saved in this browser.</span><button class="linkbtn'+(resetArm?" armed":"")+'" data-act="reset">'+(resetArm?"Tap again to erase progress":"Reset progress")+'</button></div></div>'+navBar();
  app.innerHTML=h;
}
function scrollToActive(){
  try{var el=app.querySelector(".stop.active .node");if(el)el.scrollIntoView({block:"center"});}catch(e){}
}

/* ---------- Lesson ---------- */
function prep(src,retry){
  var ex={src:src,t:src.t,q:src.q,why:src.why,retry:!!retry};
  if(src.t==="mc"){ex.opts=shuffle(src.o.map(function(text,i){return{text:text,ok:i===0};}));ex.sel=null;}
  if(src.t==="order"){ex.items=src.items;ex.shuf=shuffleNot(src.items.map(function(_,i){return i;}));ex.ans=[];}
  if(src.t==="match"){var idx=src.pairs.map(function(_,i){return i;});ex.pairs=src.pairs;ex.left=shuffle(idx);ex.right=shuffle(idx);ex.matched={};ex.pick={l:null,r:null};ex.bad=null;ex.slipped=false;ex.lock=false;}
  return ex;
}
function cur(){return L.queue[L.i];}
var SET=10;
/* Draw a lesson's questions from its bank, unseen ones first so repeated practice covers everything */
function pickSet(l){
  var idx=[],i;for(i=0;i<l.ex.length;i++)idx.push(i);
  var seen=(S.seen&&S.seen[l.id])||[];
  var unseen=shuffle(idx.filter(function(k){return seen.indexOf(k)<0;}));
  var old=shuffle(idx.filter(function(k){return seen.indexOf(k)>=0;}));
  return shuffle(unseen.concat(old).slice(0,Math.min(SET,l.ex.length)));
}
function startLesson(id,skipTeach){
  var l=byId(id);if(!l)return;
  var drawn=pickSet(l);
  var teach=!skipTeach&&l.teach&&l.teach.length&&!(S.done[id]&&S.done[id].n>0&&S.skipRead);
  L={id:id,lesson:l,drawn:drawn,queue:drawn.map(function(k){return prep(l.ex[k],false);}),i:0,ti:0,hearts:5,total:drawn.length,done:0,first:0,mistakes:0,phase:teach?"teach":"ask",ok:false,slip:false,quit:false};
  view="lesson";openId=null;
  app.innerHTML='<div class="lesson" data-u="'+(l.ui+1)+'"><div class="lhead"><div class="inner lhin">'+
    '<button class="x" data-act="quit" aria-label="Quit lesson">'+ic("close")+'</button>'+
    '<div class="track" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="ptrack"><i id="pfill"></i></div>'+
    '<div class="hearts" id="hearts" aria-live="polite"></div></div></div>'+
    '<div class="lbody"><div class="inner" id="lq"></div></div>'+
    '<div class="lfoot" id="lfoot"><div class="inner" id="lfin"></div></div><div id="lov"></div></div>';
  window.scrollTo(0,0);
  updateHead();
  if(L.phase==="teach"){drawTeach();}else{drawQ();drawFoot();}
}
/* Teaching cards shown before the questions */
function paras(t){return String(t).split("\n\n").map(function(p){return"<p>"+esc(p)+"</p>";}).join("");}
function teachCard(c,k,n){
  var h='<div class="tdots" aria-hidden="true">'+L.lesson.teach.map(function(_,i){return'<i'+(i<=k?' class="on"':'')+'></i>';}).join("")+'</div>';
  h+='<p class="eyebrow">Concept '+(k+1)+' of '+n+'</p><h1 class="q">'+esc(c.h)+'</h1><div class="prose">'+paras(c.p)+'</div>';
  if(c.pts&&c.pts.length)h+='<ul class="tpts">'+c.pts.map(function(x){return'<li>'+esc(x)+'</li>';}).join("")+'</ul>';
  if(c.key)h+='<div class="tkey"><span class="eyebrow">Remember</span><p>'+esc(c.key)+'</p></div>';
  return h;
}
function drawTeach(){
  var T=L.lesson.teach,k=L.ti,last=k===T.length-1;
  document.getElementById("lq").innerHTML=teachCard(T[k],k,T.length);
  var f=document.getElementById("lfoot"),inn=document.getElementById("lfin");
  f.className="lfoot";
  inn.innerHTML='<button class="btn wide" data-act="tnext">'+(last?"Start questions":"Continue")+'</button>'+
    '<div class="trow">'+(k>0?'<button class="linkbtn" data-act="tback">Back</button>':'<span></span>')+'<button class="linkbtn" data-act="tskip">Skip to questions</button></div>';
  window.scrollTo(0,0);
}
function teachNext(){
  if(L.phase!=="teach")return;
  if(L.ti<L.lesson.teach.length-1){L.ti++;drawTeach();}else{teachSkip();}
}
function teachBack(){if(L.phase==="teach"&&L.ti>0){L.ti--;drawTeach();}}
function teachSkip(){if(L.phase!=="teach")return;L.phase="ask";drawQ();drawFoot();window.scrollTo(0,0);}
function updateHead(){
  var p=Math.round(L.done/L.total*100);
  var f=document.getElementById("pfill"),t=document.getElementById("ptrack"),h=document.getElementById("hearts");
  if(f)f.style.width=p+"%";
  if(t)t.setAttribute("aria-valuenow",p);
  if(h)h.innerHTML=ic("heart")+'<span aria-label="'+L.hearts+' hearts left">'+Math.max(0,L.hearts)+'</span>';
}
function drawQ(){
  var ex=cur(),q=document.getElementById("lq"),fb=L.phase==="fb",h="";
  if(ex.t==="mc"){
    h+='<p class="eyebrow">Choose the best answer</p><h1 class="q">'+esc(ex.q)+'</h1><div class="opts" role="group">';
    ex.opts.forEach(function(o,i){
      var c="";
      if(fb){if(o.ok)c="ok";else if(ex.sel===i)c="no";}
      else if(ex.sel===i)c="sel";
      h+='<button class="opt '+c+'" data-act="pick" data-i="'+i+'"'+(fb?" disabled":"")+' aria-pressed="'+(ex.sel===i)+'"><kbd>'+(i+1)+'</kbd><span>'+esc(o.text)+'</span></button>';
    });
    h+='</div>';
  }else if(ex.t==="order"){
    h+='<p class="eyebrow">Tap steps to build the sequence</p><h1 class="q">'+esc(ex.q)+'</h1><ol class="slots">';
    ex.items.forEach(function(_,k){
      var v=ex.ans[k],has=v!==undefined,c=has?"filled":"";
      if(fb&&has)c+=ex.ans[k]===k?" ok":" no";
      h+='<li class="slot '+c+'"><span class="num">'+(k+1)+'</span>'+(has?'<button class="chip" data-act="unplace" data-k="'+k+'"'+(fb?" disabled":"")+'>'+esc(ex.items[v])+'</button>':'')+'</li>';
    });
    h+='</ol>';
    var bank=ex.shuf.filter(function(i){return ex.ans.indexOf(i)<0;});
    if(bank.length){h+='<div class="bank">';bank.forEach(function(i){h+='<button class="chip" data-act="place" data-i="'+i+'">'+esc(ex.items[i])+'</button>';});h+='</div>';}
  }else{
    h+='<p class="eyebrow">Tap a term, then its match</p><h1 class="q">'+esc(ex.q)+'</h1><div class="mgrid"><div class="mcol">';
    ex.left.forEach(function(i){
      var c="term";if(ex.matched[i])c+=" matched";else if(ex.bad&&ex.bad.l===i)c+=" wrong";else if(ex.pick.l===i)c+=" picked";
      h+='<button class="mt '+c+'" data-act="mpick" data-side="l" data-i="'+i+'">'+esc(ex.pairs[i][0])+'</button>';
    });
    h+='</div><div class="mcol">';
    ex.right.forEach(function(i){
      var c="";if(ex.matched[i])c="matched";else if(ex.bad&&ex.bad.r===i)c="wrong";else if(ex.pick.r===i)c="picked";
      h+='<button class="mt '+c+'" data-act="mpick" data-side="r" data-i="'+i+'">'+esc(ex.pairs[i][1])+'</button>';
    });
    h+='</div></div>';
  }
  q.innerHTML=h;
}
function drawFoot(){
  var ex=cur(),f=document.getElementById("lfoot"),inn=document.getElementById("lfin");
  if(L.phase==="ask"){
    f.className="lfoot";
    var ready=ex.t==="mc"?ex.sel!==null:(ex.t==="order"?ex.ans.length===ex.items.length:false);
    inn.innerHTML='<button class="btn wide" data-act="check"'+(ready?"":" disabled")+'>'+(ex.t==="match"?"Match all pairs":"Check")+'</button>';
    return;
  }
  f.className="lfoot "+(L.ok?"good":"bad");
  var head,body="";
  if(L.ok){
    head=ex.t==="match"&&L.slip?"All matched, one heart lost":pickOne(["Correct","Nice one","Exactly","Right on"]);
    body="<p>"+esc(ex.why)+"</p>";
  }else{
    head="Not quite";
    if(ex.t==="mc"){var right=ex.opts.filter(function(o){return o.ok;})[0].text;body="<p>Answer: <b>"+esc(right)+"</b></p><p>"+esc(ex.why)+"</p>";}
    else{body="<p>Correct order:</p><ol>"+ex.items.map(function(s){return"<li>"+esc(s)+"</li>";}).join("")+"</ol><p>"+esc(ex.why)+"</p>";}
    if(L.hearts<=0)body+="<p><b>You are out of hearts.</b></p>";
  }
  inn.innerHTML='<div class="fb" role="status"><span class="fbicon">'+ic(L.ok?"check":"close")+'</span><div><h3>'+esc(head)+'</h3>'+body+'</div></div>'+
    '<button class="btn wide '+(L.ok?"good":"bad")+'" data-act="next">Continue</button>';
  var b=inn.querySelector('[data-act="next"]');if(b)b.focus({preventScroll:true});
}
function pick(i){var ex=cur();if(L.phase!=="ask"||ex.t!=="mc")return;ex.sel=i;drawQ();drawFoot();}
function place(i){var ex=cur();if(L.phase!=="ask"||ex.t!=="order"||ex.ans.indexOf(i)>=0||ex.ans.length>=ex.items.length)return;ex.ans.push(i);drawQ();drawFoot();}
function unplace(k){var ex=cur();if(L.phase!=="ask"||ex.t!=="order")return;ex.ans.splice(k,1);drawQ();drawFoot();}
function check(){
  var ex=cur();if(L.phase!=="ask")return;var ok;
  if(ex.t==="mc"){if(ex.sel===null)return;ok=ex.opts[ex.sel].ok;}
  else if(ex.t==="order"){if(ex.ans.length!==ex.items.length)return;ok=ex.ans.every(function(v,k){return v===k;});}
  else return;
  L.phase="fb";L.ok=ok;
  if(ok){L.done++;if(!ex.retry)L.first++;}
  else{L.hearts--;L.mistakes++;L.queue.push(prep(ex.src,true));}
  updateHead();drawQ();drawFoot();
}
function mpick(side,i){
  var ex=cur();if(L.phase!=="ask"||ex.t!=="match"||ex.lock||ex.matched[i])return;
  ex.pick[side]=(ex.pick[side]===i)?null:i;
  if(ex.pick.l!==null&&ex.pick.r!==null){
    if(ex.pick.l===ex.pick.r){
      ex.matched[ex.pick.l]=true;ex.pick={l:null,r:null};
      if(Object.keys(ex.matched).length===ex.pairs.length){
        L.done++;if(!ex.slipped)L.first++;
        L.phase="fb";L.ok=true;L.slip=ex.slipped;
        updateHead();drawQ();drawFoot();return;
      }
    }else{
      ex.bad={l:ex.pick.l,r:ex.pick.r};ex.lock=true;
      if(!ex.slipped){ex.slipped=true;L.hearts--;L.mistakes++;updateHead();}
      drawQ();
      var mine=L;
      setTimeout(function(){
        if(L!==mine||view!=="lesson"||cur()!==ex)return;
        ex.bad=null;ex.pick={l:null,r:null};ex.lock=false;
        if(L.hearts<=0){failed();return;}
        drawQ();
      },550);
      return;
    }
  }
  drawQ();
}
function next(){
  if(L.phase!=="fb")return;
  if(L.hearts<=0&&!L.ok){failed();return;}
  L.i++;
  if(L.i>=L.queue.length){complete();return;}
  L.phase="ask";L.slip=false;
  drawQ();drawFoot();window.scrollTo(0,0);
}
function drawOverlay(){
  var o=document.getElementById("lov");if(!o)return;
  o.innerHTML=L.quit?'<div class="sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="Quit lesson">'+shard("sad",90)+'<h2>Quit this lesson?</h2><p class="small">You will lose the progress you made in it.</p>'+
    '<button class="btn wide" data-act="keep">Keep learning</button><button class="btn wide endbtn" data-act="end">End session</button></div></div>':'';
  if(L.quit){var b=o.querySelector('[data-act="keep"]');if(b)b.focus();}
}

/* ---------- End screens ---------- */
function complete(){
  var acc=Math.round(L.first/L.total*100);
  var gain=10+L.first*2+(L.mistakes===0?5:0);
  var t=dayKey(),before=S.daily[t]||0;
  S.xp+=gain;S.daily[t]=before+gain;
  if(S.lastDay!==t){S.streak=(S.lastDay===yesterdayKey())?S.streak+1:1;S.lastDay=t;}
  var prev=S.done[L.id];
  S.done[L.id]={acc:Math.max(prev?prev.acc:0,acc),n:(prev?prev.n:0)+1};
  S.seen=S.seen||{};
  var sn=(S.seen[L.id]||[]).slice();
  L.drawn.forEach(function(k){if(sn.indexOf(k)<0)sn.push(k);});
  S.seen[L.id]=(sn.length>=L.lesson.ex.length)?[]:sn;
  var keys=Object.keys(S.daily).sort();while(keys.length>14){delete S.daily[keys.shift()];}
  save();
  var goalHit=before<GOAL&&S.daily[t]>=GOAL;
  view="complete";
  app.innerHTML='<div class="lesson"><div class="end"><div class="inner endin">'+shard("happy",150)+
    '<span class="eyebrow">Lesson complete</span><h1>'+esc(L.lesson.title)+'</h1>'+
    '<div class="tiles"><div class="tile t-xp"><div class="tl">XP</div><div class="tv">'+ic("bolt")+'+'+gain+'</div></div>'+
    '<div class="tile t-acc"><div class="tl">Accuracy</div><div class="tv">'+acc+'%</div></div>'+
    '<div class="tile t-hp"><div class="tl">Hearts</div><div class="tv">'+ic("heart")+L.hearts+'</div></div></div>'+
    '<span class="streakline">'+ic("flame")+streakNow()+(streakNow()===1?" day streak":" day streak")+'</span>'+
    (goalHit?'<p>Daily goal reached.</p>':'')+'</div></div>'+
    '<div class="lfoot"><div class="inner"><button class="btn wide good" data-act="home">Continue</button></div></div></div>';
  window.scrollTo(0,0);
  var b=app.querySelector('[data-act="home"]');if(b)b.focus({preventScroll:true});
}
function failed(){
  view="failed";
  app.innerHTML='<div class="lesson"><div class="end"><div class="inner endin">'+shard("sad",150)+
    '<h1>Out of hearts</h1><p>Mistakes are part of system design too. Review the idea and try the lesson again.</p></div></div>'+
    '<div class="lfoot"><div class="inner"><div class="stack"><button class="btn wide" data-act="retry">Try again</button><button class="btn wide ghost" data-act="end">Back to path</button></div></div></div></div>';
  window.scrollTo(0,0);
}
function toPath(scroll){view="path";L=null;renderPath();if(scroll)scrollToActive();else window.scrollTo(0,0);}

/* ---------- Events ---------- */
app.addEventListener("click",function(e){
  var t=e.target.closest("[data-act]");if(!t||!app.contains(t))return;
  var a=t.dataset.act;
  if(a==="open"){openId=(openId===t.dataset.id)?null:t.dataset.id;resetArm=false;renderPath();}
  else if(a==="start"){startLesson(t.dataset.id);}
  else if(a==="reset"){
    if(!resetArm){resetArm=true;renderPath();}
    else{S=fresh();save();resetArm=false;openId=null;renderPath();window.scrollTo(0,0);}
  }
  else if(a==="pick"){pick(+t.dataset.i);}
  else if(a==="place"){place(+t.dataset.i);}
  else if(a==="unplace"){unplace(+t.dataset.k);}
  else if(a==="mpick"){mpick(t.dataset.side,+t.dataset.i);}
  else if(a==="check"){check();}
  else if(a==="next"){next();}
  else if(a==="quit"){L.quit=true;drawOverlay();}
  else if(a==="keep"){L.quit=false;drawOverlay();}
  else if(a==="end"){toPath(false);}
  else if(a==="home"){toPath(true);}
  else if(a==="retry"){startLesson(L.id,true);}
  else if(a==="tnext"){teachNext();}
  else if(a==="tback"){teachBack();}
  else if(a==="tskip"){teachSkip();}
  else if(a==="notes"){renderNotes(t.dataset.id);}
  else if(a==="startq"){startLesson(t.dataset.id,true);}
  else if(a==="notesback"){go("path");}
  else{extra(a,t);}
});
document.addEventListener("keydown",function(e){
  if(view!=="lesson"||!L||L.quit)return;
  if(e.key==="Enter"){
    if(e.target&&e.target.closest&&e.target.closest("button"))return;
    e.preventDefault();if(L.phase==="teach")teachNext();else if(L.phase==="ask")check();else next();
  }else if(/^[1-4]$/.test(e.key)&&L.phase==="ask"){
    var ex=cur();if(ex.t==="mc"&&+e.key<=ex.opts.length)pick(+e.key-1);
  }
});



/* ====================== Tabs, Build, Cases, Interview, Progress ====================== */
var TABS=[["path","Learn","route"],["build","Build","build"],["cases","Cases","layers"],["interview","Interview","mic"],["progress","Progress","chart"]];
var MODEHELP={move:"Drag parts to arrange them.",connect:"Tap one part, then another, to draw a line between them.",erase:"Tap a part or a line to remove it."};

function navBar(){
  return'<nav class="nav" aria-label="Sections"><div class="inner navin">'+TABS.map(function(t){
    return'<button class="tab" data-act="tab" data-tab="'+t[0]+'"'+((view===t[0]||(view==="notes"&&t[0]==="path"))?' aria-current="page"':'')+'>'+ic(t[2])+'<span>'+t[1]+'</span></button>';
  }).join("")+'</div></nav>';
}
function refreshTop(){
  var t=app.querySelector(".top");if(!t)return;
  var d=document.createElement("div");d.innerHTML=topBar();t.replaceWith(d.firstElementChild);
}
function award(n){
  var t=dayKey(),before=S.daily[t]||0;
  S.xp+=n;S.daily[t]=before+n;
  if(S.lastDay!==t){S.streak=(S.lastDay===yesterdayKey())?S.streak+1:1;S.lastDay=t;}
  var ks=Object.keys(S.daily).sort();while(ks.length>14){delete S.daily[ks.shift()];}
}
function go(tab){
  stopTimer();view=tab;resetArm=false;
  if(tab==="path")renderPath();
  else if(tab==="build")renderBuild();
  else if(tab==="cases")renderCases();
  else if(tab==="interview")renderInterview();
  else renderProgress();
  window.scrollTo(0,0);
}


/* ---------- Build: architecture lab (several scenarios) ---------- */
var LAB={id:BUILDS[0].id,per:{},mode:"move",sel:null,clearArm:false};
function bOf(id){for(var i=0;i<BUILDS.length;i++){if(BUILDS[i].id===id)return BUILDS[i];}return BUILDS[0];}
function D(){
  if(!LAB.per[LAB.id])LAB.per[LAB.id]={nodes:[],edges:[],seq:0,res:null,seeded:false};
  return LAB.per[LAB.id];
}
function nodeById(id){var n=D().nodes;for(var i=0;i<n.length;i++){if(n[i].id===id)return n[i];}return null;}
function hasEdge(a,b){return D().edges.some(function(e){return(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a);});}
function nodesOf(t){return D().nodes.filter(function(n){return n.type===t;});}
function linked(a,b){
  var A=nodesOf(a),B=nodesOf(b);
  return D().edges.some(function(e){return A.some(function(x){return B.some(function(y){return(e[0]===x.id&&e[1]===y.id)||(e[0]===y.id&&e[1]===x.id);});});});
}
function addNode(t,x,y){
  var d=D(),cv=document.getElementById("cv"),cw=cv?cv.clientWidth:340,chh=cv?cv.clientHeight:380,i=d.nodes.length;
  var cols=Math.max(2,Math.floor((cw-8)/124));
  if(x===undefined){x=8+(i%cols)*124;y=12+Math.floor(i/cols)*58;}
  x=Math.max(0,Math.min(x,cw-112));y=Math.max(0,Math.min(y,chh-42));
  var n={id:++d.seq,type:t,x:x,y:y};d.nodes.push(n);return n;
}
function seedLab(){
  var cv=document.getElementById("cv"),d=D();if(!cv||d.seeded)return;
  var sc=bOf(LAB.id),w=Math.max(0,cv.clientWidth-122),made=[];
  sc.seed.nodes.forEach(function(n){made.push(addNode(n[0],Math.round(n[1]*w),n[2]));});
  sc.seed.edges.forEach(function(e){d.edges.push([made[e[0]].id,made[e[1]].id]);});
  d.seeded=true;
}
function touchLab(){D().res=null;LAB.clearArm=false;paintResult();}
function isConnected(){
  var d=D();
  return d.nodes.length>=2&&d.nodes.every(function(n){return d.edges.some(function(e){return e[0]===n.id||e[1]===n.id;});});
}
function needLink(a,b){
  if(!nodesOf(a).length)return"Add a "+a+" from the parts list.";
  if(!nodesOf(b).length)return"Add a "+b+" from the parts list.";
  return"Connect the "+a+" to the "+b+".";
}
function runCheck(c){
  var ok=true,fix="";
  (c.links||[]).forEach(function(l){if(!linked(l[0],l[1])){ok=false;if(!fix)fix=needLink(l[0],l[1]);}});
  if(c.any&&!c.any.some(function(l){return linked(l[0],l[1]);})){ok=false;if(!fix)fix=needLink(c.any[0][0],c.any[0][1]);}
  if(c.min){Object.keys(c.min).forEach(function(t){if(nodesOf(t).length<c.min[t]){ok=false;if(!fix)fix="Add "+(c.min[t]>1?"at least "+c.min[t]+" ":"a ")+t+(c.min[t]>1?" parts":"")+" from the parts list.";}});}
  if(c.connected&&!isConnected()){ok=false;if(!fix)fix="Connect every part, or erase the ones you do not need.";}
  return{pts:c.pts,ok:ok,title:c.title,why:c.why,fix:c.fix&&!ok?c.fix:fix};
}
function evalLab(){
  var d=D(),sc=bOf(LAB.id);
  if(!d.nodes.length){d.res={empty:true};paintResult();return;}
  var cs=sc.checks.map(runCheck),score=cs.reduce(function(a,c){return a+(c.ok?c.pts:0);},0);
  S.lab.bests=S.lab.bests||{};
  var before=S.lab.bests[sc.id]||0,gain=0;
  if(score>before){gain=Math.round((score-before)/2);S.lab.bests[sc.id]=score;if(gain>0)award(gain);}
  S.lab.best=Math.max(S.lab.best||0,score);
  d.res={score:score,checks:cs,gain:gain};save();paintResult();refreshTop();
}
function paintResult(){
  var el=document.getElementById("res");if(!el)return;
  var r=D().res,sc=bOf(LAB.id);
  if(!r){el.innerHTML="";return;}
  if(r.empty){el.innerHTML='<p class="small">Add some parts first, then review the design.</p>';return;}
  var best=(S.lab.bests&&S.lab.bests[sc.id])||0;
  var h='<div class="score" style="margin-top:6px"><b>'+r.score+'</b><span>out of 100 · best '+best+'</span></div>';
  if(r.gain)h+='<p class="small">+'+r.gain+' XP for a new best.</p>';
  h+='<div class="checks">'+r.checks.map(function(c){
    return'<div class="chk '+(c.ok?"ok":"no")+'"><span class="mark">'+ic(c.ok?"check":"close")+'</span><div><b>'+esc(c.title)+'</b><p>'+esc(c.ok?c.why:c.fix)+'</p></div><span class="pts">'+(c.ok?c.pts:0)+'/'+c.pts+'</span></div>';
  }).join("")+'</div>';
  h+='<details class="mine refd"><summary>Reference design and why it works</summary><div class="prose">'+sc.ref.map(function(x){return"<p><b>"+esc(x[0])+"</b> "+esc(x[1])+"</p>";}).join("")+'</div></details>';
  el.innerHTML=h;
}
function drawCanvas(){
  var cv=document.getElementById("cv");if(!cv)return;
  var d=D(),h='<svg class="wires" id="wires" aria-hidden="true"></svg>';
  d.nodes.forEach(function(n){
    h+='<div class="bnode'+(LAB.sel===n.id?" src":"")+'" data-id="'+n.id+'" style="left:'+n.x+'px;top:'+n.y+'px" role="button" tabindex="0" aria-label="'+esc(n.type)+'">'+esc(n.type)+'</div>';
  });
  if(!d.nodes.length)h+='<div class="hint">Tap a part below to add it, then drag it into place.</div>';
  cv.innerHTML=h;cv.className="canvas "+LAB.mode;
  drawWires();
}
function drawWires(){
  var s=document.getElementById("wires");if(!s)return;
  var h="";
  D().edges.forEach(function(e,i){
    var a=nodeById(e[0]),b=nodeById(e[1]);if(!a||!b)return;
    var p='x1="'+(a.x+56)+'" y1="'+(a.y+21)+'" x2="'+(b.x+56)+'" y2="'+(b.y+21)+'"';
    h+='<line class="wire" '+p+'/><line class="hit" data-edge="'+i+'" '+p+'/>';
  });
  s.innerHTML=h;
}
function nodeAct(id){
  var d=D();
  if(LAB.mode==="connect"){
    if(LAB.sel===null)LAB.sel=id;
    else if(LAB.sel===id)LAB.sel=null;
    else{if(!hasEdge(LAB.sel,id))d.edges.push([LAB.sel,id]);LAB.sel=null;touchLab();}
    drawCanvas();
  }else if(LAB.mode==="erase"){
    d.nodes=d.nodes.filter(function(n){return n.id!==id;});
    d.edges=d.edges.filter(function(e){return e[0]!==id&&e[1]!==id;});
    LAB.sel=null;touchLab();drawCanvas();
  }
}
function bindCanvas(){
  var cv=document.getElementById("cv");if(!cv)return;
  var drag=null;
  cv.addEventListener("pointerdown",function(e){
    if(LAB.mode!=="move")return;
    var el=e.target.closest(".bnode");if(!el)return;
    var n=nodeById(+el.dataset.id);if(!n)return;
    var r=cv.getBoundingClientRect();
    drag={id:n.id,el:el,dx:e.clientX-r.left-n.x,dy:e.clientY-r.top-n.y};
    try{el.setPointerCapture(e.pointerId);}catch(_){}
    e.preventDefault();
  });
  cv.addEventListener("pointermove",function(e){
    if(!drag)return;
    var r=cv.getBoundingClientRect(),n=nodeById(drag.id);if(!n)return;
    n.x=Math.round(Math.max(0,Math.min(r.width-112,e.clientX-r.left-drag.dx)));
    n.y=Math.round(Math.max(0,Math.min(r.height-42,e.clientY-r.top-drag.dy)));
    drag.el.style.left=n.x+"px";drag.el.style.top=n.y+"px";drawWires();
  });
  function up(){drag=null;}
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  cv.addEventListener("click",function(e){
    var w=e.target.closest("[data-edge]");
    if(w&&LAB.mode==="erase"){D().edges.splice(+w.dataset.edge,1);touchLab();drawCanvas();return;}
    var el=e.target.closest(".bnode");if(el)nodeAct(+el.dataset.id);
  });
  cv.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!==" ")return;
    var el=e.target.closest(".bnode");if(!el)return;
    e.preventDefault();nodeAct(+el.dataset.id);
    var again=cv.querySelector('.bnode[data-id="'+el.dataset.id+'"]');if(again)again.focus();
  });
}
function renderBuild(){
  var sc=bOf(LAB.id),bests=S.lab.bests||{};
  var h=topBar()+'<div class="inner main"><header class="head"><span class="eyebrow">Architecture lab</span><h1>'+esc(sc.title)+'</h1><p class="small">'+esc(sc.blurb)+'</p></header>';
  h+='<div class="chips" role="group" aria-label="Scenario">'+BUILDS.map(function(b){return'<button class="schip" data-act="lsc" data-id="'+b.id+'" aria-pressed="'+(LAB.id===b.id)+'">'+esc(b.short)+(bests[b.id]?' <span class="chipscore">'+bests[b.id]+'</span>':'')+'</button>';}).join("")+'</div>';
  h+='<section class="card"><div class="reqs">'+sc.reqs.map(function(r){return'<div class="req"><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span></div>';}).join("")+'</div>';
  h+='<div class="toolbar"><div class="seg" role="group" aria-label="Canvas mode">'+[["move","Move"],["connect","Connect"],["erase","Erase"]].map(function(m){return'<button data-act="lmode" data-mode="'+m[0]+'" aria-pressed="'+(LAB.mode===m[0])+'">'+m[1]+'</button>';}).join("")+'</div><button class="linkbtn" data-act="lclear">Clear canvas</button></div>';
  h+='<p class="small" id="modehelp">'+MODEHELP[LAB.mode]+'</p><div class="canvas '+LAB.mode+'" id="cv"></div>';
  h+='<div class="palette" role="group" aria-label="Parts">'+sc.parts.map(function(p){return'<button class="pchip" data-act="ladd" data-t="'+esc(p)+'">'+ic("plus")+esc(p)+'</button>';}).join("")+'</div>';
  h+='<button class="btn wide" data-act="lreview">Review design</button><div id="res"></div></section></div>'+navBar();
  app.innerHTML=h;
  bindCanvas();seedLab();drawCanvas();paintResult();
}

/* ---------- Cases: guided design walkthroughs, one decision at a time ---------- */
var CS={id:null,i:0,phase:"pick",sel:null,opts:null,right:0,log:[],gain:0,quitArm:false};
function caseOf(id){for(var i=0;i<CASES.length;i++){if(CASES[i].id===id)return CASES[i];}return null;}
function caseStep(){
  var c=caseOf(CS.id),st=c.steps[CS.i];
  CS.sel=null;CS.phase="ask";
  CS.opts=shuffle(st.o.map(function(text,k){return{text:text,ok:k===0};}));
}
function caseReqs(c){
  return'<div class="reqs">'+c.reqs.map(function(r){return'<div class="req"><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span></div>';}).join("")+'</div>';
}
function casePick(){
  var cs=S.cases||{};
  var h='<header class="head"><span class="eyebrow">Design cases</span><h1>Design it one decision at a time</h1><p class="small">Each case starts from requirements and asks you to choose the next building block. Every answer explains the trade-off, and the design grows as you go.</p></header><div class="stack-gap">';
  CASES.forEach(function(c){
    var d=cs[c.id];
    h+='<section class="card"><div class="row" style="margin:0"><h2>'+esc(c.title)+'</h2>'+(d?'<span class="tag">Best '+d.acc+'%</span>':'')+'</div><p class="small">'+esc(c.blurb)+'</p>'+caseReqs(c)+'<button class="btn wide" data-act="cstart" data-id="'+c.id+'">'+(d?"Design it again":"Start the case")+'</button></section>';
  });
  return h+'</div>';
}
function caseRun(){
  var c=caseOf(CS.id),st=c.steps[CS.i],n=c.steps.length,fb=CS.phase==="fb";
  var pct=Math.round((CS.i+(fb?1:0))/n*100);
  var h='<header class="head"><span class="eyebrow">'+esc(c.title)+' · decision '+(CS.i+1)+' of '+n+'</span><h1>'+esc(st.t)+'</h1></header>';
  h+='<div class="stack-gap"><div class="meter" role="progressbar" aria-label="Case progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div>'+caseReqs(c);
  if(CS.log.length){
    h+='<section class="card"><h2>Your design so far</h2><ul class="dsf">'+CS.log.map(function(x){return'<li><b>'+esc(x.t)+'</b><span>'+esc(x.adds)+'</span></li>';}).join("")+'</ul></section>';
  }
  h+='<section class="card"><p class="qtext">'+esc(st.q)+'</p><div class="opts" role="group">';
  CS.opts.forEach(function(o,i){
    var cls="";
    if(fb){if(o.ok)cls="ok";else if(CS.sel===i)cls="no";}else if(CS.sel===i)cls="sel";
    h+='<button class="opt '+cls+'" data-act="copt" data-i="'+i+'"'+(fb?" disabled":"")+' aria-pressed="'+(CS.sel===i)+'"><kbd>'+(i+1)+'</kbd><span>'+esc(o.text)+'</span></button>';
  });
  h+='</div>';
  if(!fb){
    h+='<button class="btn wide" data-act="ccheck"'+(CS.sel===null?" disabled":"")+'>Check my choice</button>';
  }else{
    var ok=CS.opts[CS.sel].ok;
    h+='<div class="casefb '+(ok?"good":"bad")+'" role="status"><b>'+(ok?"Good choice":"Not the best fit here")+'</b><p>'+esc(st.why)+'</p></div>'+
       '<button class="btn wide '+(ok?"good":"bad")+'" data-act="cnext">'+(CS.i+1<n?"Continue":"See the finished design")+'</button>';
  }
  h+='</section></div><div class="foot"><span></span><button class="linkbtn'+(CS.quitArm?" armed":"")+'" data-act="cquit">'+(CS.quitArm?"Tap again to leave the case":"Leave this case")+'</button></div>';
  return h;
}
function caseDone(){
  var c=caseOf(CS.id),n=c.steps.length,acc=Math.round(CS.right/n*100);
  var h='<header class="head"><span class="eyebrow">Case complete</span><h1>'+esc(c.title)+'</h1></header><div class="stack-gap"><section class="card"><div class="score"><b>'+acc+'%</b><span>'+CS.right+' of '+n+' decisions right on the first try'+(CS.gain?' · +'+CS.gain+' XP':'')+'</span></div></section>';
  h+='<section class="card"><h2>The finished design</h2><ul class="dsf">'+c.summary.map(function(x){return'<li><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></li>';}).join("")+'</ul></section>';
  h+='<section class="card"><h2>Trade-offs to say out loud in an interview</h2><ul class="bl">'+c.tradeoffs.map(function(x){return"<li>"+esc(x)+"</li>";}).join("")+'</ul></section>';
  h+='<button class="btn wide" data-act="cagain" data-id="'+c.id+'">Design it again</button><button class="btn wide ghost" data-act="cpick">Choose another case</button></div>';
  return h;
}
function renderCases(){
  var body=(!CS.id||CS.phase==="pick")?casePick():(CS.phase==="done"?caseDone():caseRun());
  app.innerHTML=topBar()+'<div class="inner main">'+body+'</div>'+navBar();
}
function caseStart(id){
  CS={id:id,i:0,phase:"ask",sel:null,opts:null,right:0,log:[],gain:0,quitArm:false};
  caseStep();renderCases();window.scrollTo(0,0);
}
function caseCheck(){
  if(CS.phase!=="ask"||CS.sel===null)return;
  var c=caseOf(CS.id),st=c.steps[CS.i];
  if(CS.opts[CS.sel].ok)CS.right++;
  CS.log.push({t:st.t,adds:st.adds});
  CS.phase="fb";renderCases();
  var b=app.querySelector('[data-act="cnext"]');if(b)b.focus({preventScroll:true});
}
function caseNext(){
  if(CS.phase!=="fb")return;
  var c=caseOf(CS.id);CS.quitArm=false;
  if(CS.i+1<c.steps.length){CS.i++;caseStep();renderCases();window.scrollTo(0,0);return;}
  var acc=Math.round(CS.right/c.steps.length*100);
  S.cases=S.cases||{};
  var prev=S.cases[c.id];
  CS.gain=prev?Math.round(CS.right/2):10+CS.right*3;
  S.cases[c.id]={acc:Math.max(prev?prev.acc:0,acc),n:(prev?prev.n:0)+1};
  award(CS.gain);save();
  CS.phase="done";renderCases();window.scrollTo(0,0);
}

/* ---------- Interview ---------- */
function newIV(){return{phase:"intro",id:null,i:0,ans:[],tick:[],draft:"",t0:0,secs:0,score:0,gain:0,quitArm:false};}
var IV=newIV(),tmr=null;
function ivOf(id){for(var i=0;i<INTERVIEWS.length;i++){if(INTERVIEWS[i].id===id)return INTERVIEWS[i];}return INTERVIEWS[0];}
function fmtT(s){var a=Math.abs(s),m=Math.floor(a/60),x=a%60;return(s<0?"+":"")+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0");}
function stopTimer(){if(tmr){clearInterval(tmr);tmr=null;}}
function tickT(){
  var el=document.getElementById("timer");if(!el)return;
  var rem=1200-Math.floor((Date.now()-IV.t0)/1000);
  el.className="timer"+(rem<0?" late":"");
  el.innerHTML=ic("clock")+fmtT(rem)+(rem<0?" over":"");
}
function startTimer(){stopTimer();tickT();tmr=setInterval(tickT,1000);}
function ivIntro(){
  return'<header class="head"><span class="eyebrow">Mock interview</span><h1>Twenty minutes, five stages</h1><p class="small">Answer in your own words, then check yourself against the points a strong answer covers.'+(S.iv.runs?" Best score so far: "+S.iv.best+"/100.":"")+'</p></header><div class="stackc">'+
    INTERVIEWS.map(function(iv){
      return'<section class="card"><h2>'+esc(iv.title)+'</h2><div class="reqs" style="margin:0">'+iv.facts.map(function(f){return'<div class="req"><b>'+esc(f[0])+'</b><span>'+esc(f[1])+'</span></div>';}).join("")+'</div><button class="btn wide" data-act="ivstart" data-id="'+iv.id+'">Start interview</button></section>';
    }).join("")+'</div>';
}
function ivRun(){
  var iv=ivOf(IV.id),st=iv.stages[IV.i],n=iv.stages.length,pct=Math.round((IV.i+(IV.phase==="check"?1:0))/n*100);
  var h='<header class="head"><div class="toolbar" style="margin:0"><span class="eyebrow">Stage '+(IV.i+1)+' of '+n+' · '+esc(iv.title)+'</span><span class="timer" id="timer"></span></div><h1>'+esc(st.t)+'</h1></header>';
  h+='<section class="card"><div class="meter" role="progressbar" aria-label="Interview progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div><p class="qtext">'+esc(st.q)+'</p>';
  if(IV.phase==="answer"){
    h+='<textarea class="answer" id="ivans" placeholder="Talk through your reasoning" aria-label="Your answer" style="margin:0"></textarea><button class="btn wide" data-act="ivsub">Submit answer</button>';
  }else{
    h+='<details class="mine" style="margin:0"><summary>Your answer</summary><p>'+esc(IV.ans[IV.i])+'</p></details><h2>A strong answer covers</h2><p class="small" style="margin-top:-6px">Tick each point your answer touched. Your score comes from these ticks.</p><div class="stackc">'+
      st.pts.map(function(p,k){return'<label class="pt"><input type="checkbox" data-act="ivtick" data-k="'+k+'"'+(IV.tick[IV.i][k]?" checked":"")+'><span>'+esc(p)+'</span></label>';}).join("")+'</div>';
    h+='<button class="btn wide good" data-act="ivnext">'+(IV.i+1<n?"Next stage":"See results")+'</button>';
  }
  h+='</section><div class="foot"><span></span><button class="linkbtn'+(IV.quitArm?" armed":"")+'" data-act="ivquit">'+(IV.quitArm?"Tap again to quit":"Quit interview")+'</button></div>';
  return h;
}
function ivDone(){
  var iv=ivOf(IV.id);
  var rows=iv.stages.map(function(s,i){var n=IV.tick[i].filter(Boolean).length;return{t:s.t,n:n,of:s.pts.length,pct:Math.round(n/s.pts.length*100)};});
  var strong=rows.filter(function(r){return r.pct>=67;}),weak=rows.filter(function(r){return r.pct<67;});
  var h='<header class="head"><span class="eyebrow">Interview complete</span><h1>'+esc(iv.title)+'</h1></header><section class="card"><div class="score"><b>'+IV.score+'</b><span>out of 100 · '+fmtT(IV.secs)+' · +'+IV.gain+' XP</span></div><div class="bars">'+
    rows.map(function(r){return'<div class="skill"><div class="row"><span>'+esc(r.t)+'</span><b>'+r.n+'/'+r.of+'</b></div><div class="meter"><i style="width:'+r.pct+'%;background:'+(r.pct>=67?"var(--good)":"var(--gold)")+'"></i></div></div>';}).join("")+'</div>';
  if(strong.length)h+='<p class="listh">Strong on</p><ul class="bl">'+strong.map(function(r){return"<li>"+esc(r.t)+"</li>";}).join("")+'</ul>';
  if(weak.length)h+='<p class="listh">Revisit</p><ul class="bl">'+weak.map(function(r){return"<li>"+esc(r.t)+"</li>";}).join("")+'</ul>';
  h+='<button class="btn wide" style="margin-top:8px" data-act="ivreset">Try another interview</button><button class="btn wide ghost" data-act="tab" data-tab="path">Back to lessons</button></section>';
  return h;
}
function renderInterview(){
  stopTimer();
  var h=topBar()+'<div class="inner main">'+(IV.phase==="intro"?ivIntro():(IV.phase==="done"?ivDone():ivRun()))+'</div>'+navBar();
  app.innerHTML=h;
  var box=document.getElementById("ivans");if(box)box.value=IV.draft;
  if(IV.phase==="answer"||IV.phase==="check")startTimer();
}
function finishIV(){
  var iv=ivOf(IV.id),tot=0,got=0;
  iv.stages.forEach(function(s,i){tot+=s.pts.length;got+=IV.tick[i].filter(Boolean).length;});
  IV.score=Math.round(got/tot*100);IV.secs=Math.floor((Date.now()-IV.t0)/1000);IV.gain=10+Math.round(IV.score/2);
  S.iv.runs=(S.iv.runs||0)+1;S.iv.best=Math.max(S.iv.best||0,IV.score);
  award(IV.gain);save();IV.phase="done";renderInterview();window.scrollTo(0,0);
}


/* ---------- Progress ---------- */
function unitMastery(ui){
  var u=UNITS[ui],sum=0;
  u.lessons.forEach(function(l){sum+=S.done[l.id]?S.done[l.id].acc:0;});
  return Math.round(sum/u.lessons.length);
}
function weakestPick(){
  var best=null;
  UNITS.forEach(function(u,ui){
    if(!u.lessons.some(unlocked))return;
    var m=unitMastery(ui);if(!best||m<best.m)best={ui:ui,m:m};
  });
  var u=UNITS[best.ui],cand=u.lessons.filter(unlocked);
  cand.sort(function(a,b){return(S.done[a.id]?S.done[a.id].acc:-1)-(S.done[b.id]?S.done[b.id].acc:-1);});
  return{unit:u,ui:best.ui,lesson:cand[0],m:best.m};
}
function renderProgress(){
  var rk=rank(),ids=Object.keys(S.done),accs=ids.map(function(k){return S.done[k].acc;});
  var avg=accs.length?Math.round(accs.reduce(function(a,b){return a+b;},0)/accs.length):0;
  var wk=weakestPick();
  var h=topBar()+'<div class="inner main"><header class="head"><span class="eyebrow">Progress</span><h1>'+rk.name+'</h1><p class="small">'+(rk.next?rk.toNext+" XP to "+rk.next+".":"You reached the top rank.")+'</p></header><div class="stackc">';
  h+='<div class="metrics"><div class="metric"><b>'+S.xp+'</b><span>Total XP</span></div><div class="metric"><b>'+streakNow()+'</b><span>Day streak</span></div><div class="metric"><b>'+ids.length+'/'+FLAT.length+'</b><span>Lessons done</span></div><div class="metric"><b>'+avg+'%</b><span>Average accuracy</span></div></div>';
  h+='<section class="card"><h2>Skill mastery</h2>'+UNITS.map(function(u,ui){
    var m=unitMastery(ui);
    return'<div class="skill"><div class="row"><span>'+esc(u.title)+'</span><b>'+m+'%</b></div><div class="meter" role="progressbar" aria-label="'+esc(u.title)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+m+'"><i style="width:'+m+'%;background:var(--u'+(ui+1)+')"></i></div></div>';
  }).join("")+'<p class="small">Mastery counts your best accuracy on each lesson. Lessons you have not finished count as zero.</p></section>';
  h+='<section class="card"><span class="eyebrow">Focus next</span><h2>'+esc(wk.unit.title)+'</h2><p class="small">'+(wk.m?"Your lowest unit so far, at "+wk.m+"%.":"No lessons finished here yet.")+' Try "'+esc(wk.lesson.title)+'".</p><button class="btn wide" data-act="start" data-id="'+wk.lesson.id+'">'+(S.done[wk.lesson.id]?"Practice again":"Start lesson")+'</button></section>';
  var lb=S.lab.bests||{},cs=S.cases||{};
  var labDone=BUILDS.filter(function(b){return lb[b.id]>0;}).length,caseDone_=CASES.filter(function(c){return cs[c.id];}).length;
  h+='<section class="card"><h2>Practice records</h2><div class="row"><span>Lab scenarios reviewed</span><b>'+labDone+'/'+BUILDS.length+'</b></div><div class="row"><span>Design cases finished</span><b>'+caseDone_+'/'+CASES.length+'</b></div><div class="row"><span>Best interview score</span><b>'+(S.iv.best||0)+'/100</b></div><div class="row"><span>Interviews finished</span><b>'+(S.iv.runs||0)+'</b></div></section>';
  h+='</div></div>'+navBar();
  app.innerHTML=h;
}


/* ---------- Click actions for the tabs ---------- */
function extra(a,t){
  if(a==="tab"){go(t.dataset.tab);}
  else if(a==="lsc"){LAB.id=t.dataset.id;LAB.sel=null;LAB.clearArm=false;renderBuild();}
  else if(a==="lmode"){
    LAB.mode=t.dataset.mode;LAB.sel=null;
    Array.prototype.forEach.call(app.querySelectorAll('[data-act="lmode"]'),function(b){b.setAttribute("aria-pressed",String(b.dataset.mode===LAB.mode));});
    var mh=document.getElementById("modehelp");if(mh)mh.textContent=MODEHELP[LAB.mode];
    drawCanvas();
  }
  else if(a==="ladd"){addNode(t.dataset.t);touchLab();drawCanvas();}
  else if(a==="lclear"){
    if(!LAB.clearArm){LAB.clearArm=true;t.textContent="Tap again to clear";t.classList.add("armed");}
    else{var d=D();d.nodes=[];d.edges=[];LAB.sel=null;touchLab();drawCanvas();t.textContent="Clear canvas";t.classList.remove("armed");}
  }
  else if(a==="lreview"){evalLab();}
  else if(a==="cstart"||a==="cagain"){caseStart(t.dataset.id);}
  else if(a==="copt"){if(CS.phase==="ask"){CS.sel=+t.dataset.i;renderCases();}}
  else if(a==="ccheck"){caseCheck();}
  else if(a==="cnext"){caseNext();}
  else if(a==="cpick"){CS.phase="pick";CS.id=null;renderCases();window.scrollTo(0,0);}
  else if(a==="cquit"){
    if(!CS.quitArm){CS.quitArm=true;renderCases();}
    else{CS.phase="pick";CS.id=null;CS.quitArm=false;renderCases();window.scrollTo(0,0);}
  }
  else if(a==="ivstart"){IV=newIV();IV.id=t.dataset.id;IV.phase="answer";IV.t0=Date.now();renderInterview();window.scrollTo(0,0);}
  else if(a==="ivsub"){
    var box=document.getElementById("ivans"),v=box?box.value.trim():"";
    if(!v){if(box)box.focus();return;}
    var iv=ivOf(IV.id);
    IV.ans[IV.i]=v;IV.tick[IV.i]=iv.stages[IV.i].pts.map(function(){return false;});
    IV.draft="";IV.quitArm=false;IV.phase="check";renderInterview();window.scrollTo(0,0);
  }
  else if(a==="ivtick"){IV.tick[IV.i][+t.dataset.k]=t.checked;}
  else if(a==="ivnext"){
    IV.quitArm=false;
    if(IV.i+1<ivOf(IV.id).stages.length){IV.i++;IV.phase="answer";IV.draft="";renderInterview();window.scrollTo(0,0);}
    else finishIV();
  }
  else if(a==="ivquit"){
    if(!IV.quitArm){IV.quitArm=true;renderInterview();}
    else{stopTimer();IV=newIV();renderInterview();window.scrollTo(0,0);}
  }
  else if(a==="ivreset"){IV=newIV();renderInterview();window.scrollTo(0,0);}
}
app.addEventListener("input",function(e){
  var t=e.target;
  if(t.id==="ivans")IV.draft=t.value;
});

renderPath();
})();

