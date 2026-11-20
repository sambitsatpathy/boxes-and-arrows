/* ============================================================
   Boxes & Arrows — app
   A mobile-first, boxes-and-arrows rendering of the
   designed-to-scale system design course (40 lessons).
   Data lives in course.js (COURSE_UNITS / COURSE_LESSONS).
   ============================================================ */
(function(){
"use strict";

var KEY="boxes-and-arrows-v3";
var THEME_KEY="boxes-and-arrows-theme";
var UNITS=COURSE_UNITS, LESSONS=COURSE_LESSONS;

/* ---------- state ---------- */
function fresh(){return{done:{},last:null};}
function load(){
  try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&typeof o==="object")return Object.assign(fresh(),o);}}catch(e){}
  return fresh();
}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function ic(n){return'<svg class="ic" aria-hidden="true"><use href="#i-'+n+'"/></svg>';}

/* ---------- course index ---------- */
var FLAT=[];
UNITS.forEach(function(u,ui){u.lessons.forEach(function(l,li){FLAT.push({id:l.id,ui:ui,li:li});});});
function byId(id){return LESSONS[id];}
function unitOf(ui){return UNITS[ui];}
function doneCount(){return Object.keys(S.done).length;}
function nextLesson(){for(var i=0;i<FLAT.length;i++){if(!S.done[FLAT[i].id])return FLAT[i];}return null;}

var app=document.getElementById("app");
var view="home", curId=null, curUi=0, step=0;

/* ---------- theme ---------- */
function applyTheme(t){
  if(t==="dark")document.documentElement.setAttribute("data-theme","dark");
  else if(t==="light")document.documentElement.setAttribute("data-theme","light");
  else document.documentElement.removeAttribute("data-theme");
}
function initTheme(){
  var t="auto";
  try{t=localStorage.getItem(THEME_KEY)||"auto";}catch(e){}
  applyTheme(t);
  return t;
}
var theme=initTheme();
function toggleTheme(){
  var cur=document.documentElement.getAttribute("data-theme");
  var next=(cur==="dark")?"light":"dark";
  theme=next;applyTheme(next);
  try{localStorage.setItem(THEME_KEY,next);}catch(e){}
  if(view==="lesson")renderStep();else renderHome();
}

/* ---------- shared chrome ---------- */
function topBar(){
  var t=document.documentElement.getAttribute("data-theme");
  var icon=(t==="dark")?"sun":"moon";
  return'<div class="top"><div class="wrap topin">'+
    '<div class="brand"><span class="mark"><svg class="ic"><use href="#i-boxes"/></svg></span>'+
    '<span>Boxes &amp; Arrows<small>system design</small></span></div>'+
    '<span class="stat s-xp" title="Lessons complete">'+ic("check")+doneCount()+'/'+FLAT.length+'</span>'+
    '<button class="iconbtn" data-act="theme" aria-label="Toggle colour theme">'+ic(icon)+'</button>'+
  '</div></div>';
}

/* ---------- home ---------- */
function renderHome(){
  view="home";
  var dc=doneCount(),pct=Math.round(dc/FLAT.length*100);
  var nxt=nextLesson();
  var h=topBar()+'<div class="wrap hero">'+
    '<div><span class="eyebrow">A system design course</span>'+
    '<h1>Learn how systems really work.</h1>'+
    '<p>40 step-by-step lessons, from a single request to whole systems — drawn as boxes and arrows.</p></div>'+
    '<div class="progress"><div class="row"><span class="small">Your progress</span><b>'+dc+' / '+FLAT.length+' lessons</b></div>'+
    '<div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div></div>';
  if(nxt)h+='<button class="btn wide" data-act="continue">Continue: '+esc(byId(nxt.id).title)+'</button>';
  else h+='<p class="small">Course complete. Replay any lesson to keep it sharp.</p>';
  h+='</div>';

  h+='<div class="wrap">';
  UNITS.forEach(function(u,ui){
    var doneU=u.lessons.filter(function(l){return S.done[l.id];}).length;
    var p2=u.lessons.length?Math.round(doneU/u.lessons.length*100):0;
    h+='<section class="unit" style="--uc:var(--u'+(ui+1)+')">'+
      '<div class="unithd"><span class="num">'+u.num+'</span><h2>'+esc(u.title)+'</h2>'+
      '<span class="bar"><i style="width:'+p2+'%"></i></span><span class="count">'+doneU+'/'+u.lessons.length+'</span></div>'+
      '<div class="lessons">';
    u.lessons.forEach(function(l,li){
      var L=LESSONS[l.id];
      var done=!!S.done[l.id];
      var isnxt=nxt&&nxt.id===l.id;
      h+='<button class="lrow'+(done?" done":"")+(isnxt?" next":"")+'" data-act="open" data-id="'+l.id+'" data-ui="'+ui+'">'+
        '<span class="idx">'+(li+1)+'</span>'+
        '<span class="tt"><b>'+esc(L.title)+'</b><span>'+L.minutes+' min · '+L.level+' · '+L.steps.length+' steps</span></span>'+
        (done?ic("check"):'<svg class="ic caret"><use href="#i-next"/></svg>')+
      '</button>';
    });
    h+='</div></section>';
  });
  h+='</div>';

  h+='<div class="wrap foot"><p class="small">Progress is saved in this browser.</p></div>';
  app.innerHTML=h;
  window.scrollTo(0,0);
}

/* ---------- lesson ---------- */
function startLesson(id,ui){
  var L=byId(id);if(!L)return;
  curId=id;curUi=(ui===undefined?0:ui);step=0;view="lesson";
  S.last=id;save();
  renderStep();
}
function renderStep(){
  var L=byId(curId);if(!L){renderHome();return;}
  var st=L.steps[step],n=L.steps.length;
  var u=unitOf(curUi);
  var pct=Math.round(step/n*100);

  var h=topBar()+
    '<div class="lhead" style="--uc:var(--u'+(curUi+1)+')"><div class="wrap lheadin">'+
      '<button class="iconbtn" data-act="home" aria-label="Back to course">'+ic("back")+'</button>'+
      '<div class="who"><b>'+esc(L.title)+'</b><span>'+u.num+' · '+esc(u.title)+'</span></div>'+
      '<span class="stepcount">Step '+(step+1)+' / '+n+'</span>'+
    '</div><div class="wrap"><div class="ptrack"><i style="width:'+pct+'%"></i></div></div></div>';

  h+='<div class="wrap lbody" style="--uc:var(--u'+(curUi+1)+')">';
  h+='<div class="chiprow"><span class="chip k-'+(st.chapter||"setup")+'">'+ic(chIcon(st.chapter))+'<span>'+esc(chLabel(st.chapter))+'</span></span>'+
     '<span class="chip">'+ic("route")+'<span>Step '+(step+1)+' of '+n+'</span></span></div>';
  h+='<h1 class="ltitle">'+esc(st.title)+'</h1>';
  h+='<div class="lshort">'+esc(st.short)+'</div>';
  h+='<div class="prose">'+st.body.map(function(p){return"<p>"+p+"</p>";}).join("")+'</div>';

  if(st.callout){
    var k=st.callout.kind||"tip";
    h+='<div class="callout '+k+'"><div class="cl-hd">'+ic(chIcon(k))+'<span>'+esc(chLabel(k))+'</span></div><p>'+st.callout.text+'</p></div>';
  }
  if(st.changes&&st.changes.length){
    h+='<div class="changes"><span class="ch">What changed</span><ul>'+
      st.changes.map(function(c){return"<li>"+ic("plus")+esc(String(c).replace(/^\+\s*/,""))+"</li>";}).join("")+'</ul></div>';
  }
  if(st.scene&&st.scene.entities&&st.scene.entities.length){
    h+='<div class="diagram"><div class="dg-hd"><span class="ch">Diagram</span></div>'+diagramSVG(st.scene)+'<div class="dg-cap">Boxes are parts. Arrows are requests or data.</div></div>';
  }
  if(st.scene&&st.scene.entities){
    var panels=st.scene.entities.filter(function(e){return e.type==="panel";});
    if(panels.length){
      h+='<div class="panels">'+panels.map(function(pn){
        var lines=Array.isArray(pn.lines)?pn.lines:[];
        return '<div class="panelcard"><h3>'+esc(pn.title||"Note")+'</h3>'+
          (lines.length?'<p>'+lines.map(function(x){return esc(x);}).join("<br>")+'</p>':"")+'</div>';
      }).join("")+'</div>';
    }
  }
  h+='</div>';

  h+='<div class="lfoot"><div class="lfootin">'+
    '<button class="btn ghost" data-act="prev"'+(step===0?" disabled":"")+'>'+ic("back")+' Back</button>'+
    '<button class="btn'+(step+1===n?" good":"")+'" data-act="next">'+(step+1===n?"Finish":"Next step")+' '+ic("next")+'</button>'+
  '</div></div>';

  app.innerHTML=h;
  window.scrollTo(0,0);
}
function goNext(){
  var L=byId(curId);if(!L)return;
  if(step+1<L.steps.length){step++;renderStep();}
  else{S.done[curId]=true;save();renderHome();}
}
function goPrev(){if(step>0){step--;renderStep();}}

/* ---------- diagram ---------- */
var PALETTE={
  yellow:{f:"#fff4d6",s:"#c79100",t:"#5c4400"},
  blue:{f:"#e3f0ff",s:"#1c6ccc",t:"#0b3a72"},
  orange:{f:"#ffe8dd",s:"#c2532b",t:"#7a2f14"},
  green:{f:"#e2f5e6",s:"#2f8f4d",t:"#17592f"},
  violet:{f:"#efe9ff",s:"#6b4fd0",t:"#3a2686"},
  red:{f:"#fde5e3",s:"#c24444",t:"#7a1f1f"},
  teal:{f:"#dff6f4",s:"#169284",t:"#0b534c"},
  rose:{f:"#fde7f0",s:"#b9406f",t:"#732044"},
  sand:{f:"#f7ecd7",s:"#b98a2f",t:"#6b5218"},
  ink:{f:"#e8edf3",s:"#4a5a6c",t:"#22303f"}
};
function pal(e){return PALETTE[e.color]||PALETTE.ink;}
function labelOf(e){
  var l=e.label;
  if(Array.isArray(l))l=l.join(" ");
  l=String(l||"");
  if(!l&&e.title)l=String(e.title);
  return l;
}
function entCenter(e){
  if(typeof e.x==="number"&&typeof e.y==="number")return[e.x,e.y];
  if(typeof e.x0==="number"&&typeof e.x1==="number")return[(e.x0+e.x1)/2,(e.y0+e.y1)/2];
  return[0,0];
}
function splitLabel(s,n){
  s=String(s||"");
  if(s.length<=(n||12))return[s];
  var i=s.lastIndexOf(" ",n||12);
  if(i<4)i=s.indexOf(" ",n||12);
  if(i<4)return[s];
  return[s.slice(0,i),s.slice(i+1)];
}
function diagramSVG(scene){
  var ents=scene.entities||[],links=scene.links||[];
  if(!ents.length)return"";
  var plot=ents.filter(function(e){return e.type!=="panel";});
  if(!plot.length)return"";
  var W=360,H=258,pad=40;
  var centers=plot.map(entCenter);
  var minx=Infinity,miny=Infinity,maxx=-Infinity,maxy=-Infinity;
  function acc(x,y){if(x<minx)minx=x;if(y<miny)miny=y;if(x>maxx)maxx=x;if(y>maxy)maxy=y;}
  plot.forEach(function(e,i){
    acc(centers[i][0],centers[i][1]);
    if(typeof e.x0==="number"){acc(e.x0,e.y0);acc(e.x1,e.y1);}
  });
  if(!isFinite(minx)){minx=0;miny=0;maxx=1;maxy=1;}
  var bw=Math.max(maxx-minx,1),bh=Math.max(maxy-miny,1);
  var sc=Math.min((W-2*pad)/bw,(H-2*pad)/bh);
  var ox=(W-2*pad-bw*sc)/2,oy=(H-2*pad-bh*sc)/2;
  function X(x){return pad+ox+(x-minx)*sc;}
  function Y(y){return pad+oy+(y-miny)*sc;}

  var minD=Infinity;
  for(var i=0;i<centers.length;i++)for(var j=i+1;j<centers.length;j++){
    var dx=centers[i][0]-centers[j][0],dy=centers[i][1]-centers[j][1];
    var d=Math.sqrt(dx*dx+dy*dy);
    if(d>0.001&&d<minD)minD=d;
  }
  if(!isFinite(minD))minD=bw;
  var boxW=Math.max(46,Math.min(126,minD*sc*0.86));
  var boxH=Math.max(30,Math.min(48,boxW*0.4));

  var byK={};ents.forEach(function(e){byK[e.k]=e;});
  var h='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Boxes and arrows diagram">';
  h+='<defs>'+
    '<marker id="ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3.2" orient="auto" markerUnits="strokeWidth"><path d="M0 0L7.5 3.2L0 6.4z" fill="var(--muted)"/></marker>'+
    '<marker id="ahs" markerWidth="9" markerHeight="9" refX="1" refY="3.2" orient="auto" markerUnits="strokeWidth"><path d="M8 0L0.5 3.2L8 6.4z" fill="var(--muted)"/></marker>'+
  '</defs>';

  /* zones first (behind everything) */
  ents.forEach(function(e){
    if(e.type!=="zone")return;
    var x=X(e.x0),y=Y(e.y0),w=(X(e.x1)-X(e.x0)),hh=(Y(e.y1)-Y(e.y0));
    h+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="12" fill="none" stroke="var(--line-strong)" stroke-width="1.6" stroke-dasharray="6 5"/>';
    if(e.label)h+='<text x="'+(x+8)+'" y="'+(y+15)+'" font-size="9.5" font-family="var(--font-mono)" letter-spacing=".06em" fill="var(--muted)">'+esc(e.label)+'</text>';
  });

  /* links */
  links.forEach(function(l){
    var a=byK[l.from],b=byK[l.to];if(!a||!b)return;
    var ca=entCenter(a),cb=entCenter(b);
    var x1=X(ca[0]),y1=Y(ca[1]),x2=X(cb[0]),y2=Y(cb[1]);
    var mx=(x1+x2)/2,my=(y1+y2)/2;
    h+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="var(--muted)" stroke-width="2" marker-end="url(#ah)"'+(l.heads==="both"?' marker-start="url(#ahs)"':"")+'/>';
    if(l.label)h+='<text x="'+mx+'" y="'+(my-7)+'" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="var(--muted)">'+esc(l.label)+'</text>';
  });

  /* entities */
  plot.forEach(function(e){
    if(e.type==="zone")return;
    var c=entCenter(e),x=X(c[0]),y=Y(c[1]);
    var p=pal(e),label=labelOf(e);

    if(e.type==="panel"){
      var lines=Array.isArray(e.lines)?e.lines.slice(0,4).map(String):[];
      var title=String(e.title||"");
      var maxLen=Math.max(title.length,lines.reduce(function(a,b){return Math.max(a,b.length);},0));
      var w=Math.max(96,Math.min(220,maxLen*6.4+18));
      var hh=20+(title?15:0)+lines.length*12+8;
      h+='<g><rect x="'+(x-w/2)+'" y="'+(y-hh/2)+'" width="'+w+'" height="'+hh+'" rx="10" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="1.6"/>';
      var ty=y-hh/2+16;
      if(title)h+='<text x="'+x+'" y="'+ty+'" text-anchor="middle" font-size="10.5" font-weight="700" font-family="var(--font-display)" fill="var(--fg)">'+esc(title)+'</text>';
      ty+=(title?15:0);
      lines.forEach(function(ln){
        h+='<text x="'+x+'" y="'+ty+'" text-anchor="middle" font-size="8.5" font-family="var(--font-mono)" fill="var(--muted)">'+esc(ln)+'</text>';
        ty+=12;
      });
      h+='</g>';
      return;
    }

    var isCrowd=e.type==="crowd";
    var w=boxW,hh=boxH;
    if(isCrowd){w=Math.max(boxW,110);}
    var lines=splitLabel(label,Math.max(8,Math.floor(w/8)));
    var lh=12,startY=y-((lines.length-1)*lh)/2+4;
    h+='<g>'+
      '<rect x="'+(x-w/2)+'" y="'+(y-hh/2)+'" width="'+w+'" height="'+hh+'" rx="10" fill="'+p.f+'" stroke="'+p.s+'" stroke-width="2"'+(e.type==="ghost"||isCrowd?' stroke-dasharray="5 4"':"")+'/>'+
      '<text text-anchor="middle" font-family="var(--font-display)" font-weight="700" font-size="11" fill="'+p.t+'">'+
        lines.map(function(ln,i){return'<tspan x="'+x+'" y="'+(startY+i*lh)+'">'+esc(ln)+'</tspan>';}).join("")+
      '</text></g>';
    if(e.sub)h+='<text x="'+x+'" y="'+(y+hh/2+12)+'" text-anchor="middle" font-size="9" font-family="var(--font-mono)" fill="var(--muted)">'+esc(e.sub)+'</text>';
    if(e.tags&&e.tags.length){
      var ty2=y+hh/2+13;
      e.tags.slice(0,2).forEach(function(t,i){
        h+='<text x="'+x+'" y="'+(ty2+i*12)+'" text-anchor="middle" font-size="9.5" font-family="var(--font-mono)" fill="var(--muted)">'+esc(t.text)+'</text>';
      });
    }
  });
  h+='</svg>';
  return h;
}

/* ---------- labels ---------- */
var CH={problem:"Problem",solution:"Solution",technique:"Technique",tradeoff:"Trade-off",insight:"Insight",recap:"Recap",setup:"Setup",tip:"Tip"};
var CHICON={problem:"flag",solution:"check",technique:"plug",tradeoff:"layers",insight:"bolt",recap:"route",setup:"boxes",tip:"bolt"};
function chLabel(k){return CH[k]||"Note";}
function chIcon(k){return CHICON[k]||"boxes";}

/* ---------- events ---------- */
app.addEventListener("click",function(e){
  var t=e.target.closest("[data-act]");if(!t||!app.contains(t))return;
  var a=t.dataset.act;
  if(a==="theme"){toggleTheme();}
  else if(a==="home"){renderHome();}
  else if(a==="continue"){var n=nextLesson();if(n)startLesson(n.id,n.ui);}
  else if(a==="open"){startLesson(t.dataset.id,+t.dataset.ui);}
  else if(a==="next"){goNext();}
  else if(a==="prev"){goPrev();}
});
document.addEventListener("keydown",function(e){
  if(view!=="lesson")return;
  if(e.key==="ArrowRight"){e.preventDefault();goNext();}
  else if(e.key==="ArrowLeft"){e.preventDefault();goPrev();}
  else if(e.key==="Escape"){renderHome();}
});

renderHome();
})();
