/* M3春2027 巡回マップ — color themes (shared by the map pages and the manual)
 * Each theme sets the accent pair and tints the neutrals with one hue, for both light and dark.
 * "sakura" is the page's built-in palette, so it adds no overrides.
 * The choice is remembered per browser under KEY and applied before first paint. */
(function(){
  var KEY='m3-2027s-route-color';
  // a / b: accent and secondary accent [light, dark]; h / s: hue and saturation scale for the neutrals
  var THEMES=[
    {id:'sakura', name:'さくら',     a:['#c2346d','#ff6c9f'], b:['#3b58d4','#7f96ff']},
    {id:'ocean',  name:'オーシャン', a:['#1d64c8','#5aa2ff'], b:['#d9730d','#ffa94d'], h:215, s:1},
    {id:'mint',   name:'ミント',     a:['#0d8a66','#3fd3a3'], b:['#6b48c8','#ab92ff'], h:165, s:.9},
    {id:'berry',  name:'ベリー',     a:['#b8326f','#ff7aae'], b:['#2a8a74','#5fd3b5'], h:330, s:.9},
    {id:'sage',   name:'セージ',     a:['#4c7663','#8fc4ac'], b:['#b0583a','#ee9a7c'], h:150, s:.5},
    {id:'sky',    name:'スカイ',     a:['#0a78ad','#4cc3f2'], b:['#c2346d','#ff7aa8'], h:200, s:1},
    {id:'sunset', name:'サンセット', a:['#c45f12','#ffa25a'], b:['#2f66b0','#7fb2ff'], h:28,  s:.8},
    {id:'lavender',name:'ラベンダー',a:['#5b4fc9','#a99cff'], b:['#c2346d','#ff7ab0'], h:250, s:1},
    {id:'night',  name:'ナイト',     a:['#9b36d1','#d38bff'], b:['#23838a','#5fd0d6'], h:285, s:1.1},
    {id:'mono',   name:'モノクロ',   a:['#2b2b2b','#8e8e8e'], b:['#7a7a7a','#bdbdbd'], h:0,   s:0}
  ];
  function hsl(h,s,l){return 'hsl('+h+','+Math.round(s)+'%,'+l+'%)'}
  function vars(t,dark){
    var i=dark?1:0, h=t.h, k=t.s, v={'--accent':t.a[i],'--p1':t.a[i],'--p2':t.b[i]};
    if(dark){
      v['--bg']=hsl(h,22*k,9); v['--surface']=hsl(h,22*k,14); v['--raise']=hsl(h,20*k,19); v['--ink']=hsl(h,30*k,94);
      v['--muted']=hsl(h,15*k,69); v['--line']=hsl(h,20*k,25); v['--desk']=hsl(h,20*k,20); v['--desk-ink']=hsl(h,12*k,48);
      v['--hall']=hsl(h,25*k,78); v['--p3']=hsl(h,12*k,60);
    }else{
      v['--bg']=hsl(h,25*k,97); v['--surface']='#ffffff'; v['--raise']=hsl(h,25*k,93); v['--ink']=hsl(h,30*k,15);
      v['--muted']=hsl(h,12*k,45); v['--line']=hsl(h,22*k,86); v['--desk']=hsl(h,20*k,92); v['--desk-ink']=hsl(h,12*k,64);
      v['--hall']=hsl(h,22*k,28); v['--p3']=hsl(h,10*k,58);
    }
    return Object.keys(v).map(function(n){return n+':'+v[n]}).join(';');
  }
  function css(t){
    if(t.h==null) return ''; // sakura = built-in palette
    var L=vars(t,false), D=vars(t,true);
    return ':root{'+L+'}'
      +'@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){'+D+'}}'
      +':root[data-theme="dark"]{'+D+'}';
  }
  function find(id){for(var i=0;i<THEMES.length;i++) if(THEMES[i].id===id) return THEMES[i]; return THEMES[0]}
  function current(){try{return find(localStorage.getItem(KEY)).id}catch(e){return THEMES[0].id}}
  function apply(id){
    var t=find(id), el=document.getElementById('m3-color-theme');
    if(!el){el=document.createElement('style'); el.id='m3-color-theme';}
    el.textContent=css(t);
    // keep it last in <head> so it overrides the page's own tokens
    (document.head||document.documentElement).appendChild(el);
    document.documentElement.setAttribute('data-color',t.id);
    return t.id;
  }
  function set(id){var v=apply(id); try{localStorage.setItem(KEY,v)}catch(e){} return v}
  window.M3Theme={themes:THEMES,apply:apply,set:set,current:current};
  apply(current());
  // another tab changed the theme
  window.addEventListener('storage',function(e){if(e.key===KEY) apply(current())});
})();
