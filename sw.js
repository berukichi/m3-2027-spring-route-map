/* M3春2027 巡回マップ — offline support for the home-screen app.
 * Network first, so an update shows up on the next visit; the cached copy is used when the venue's signal drops
 * (or after 5 seconds without an answer). Only this site, the fonts and the QR code library are cached. */
const CACHE='m3-2027s-v1';
const CDN=/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('m3-2027s-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request, u=new URL(r.url), same=u.origin===location.origin;
  if(r.method!=='GET'||!(same||CDN.test(u.hostname))) return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const net=fetch(r).then(res=>{if(res.ok){const copy=res.clone(); e.waitUntil(c.put(r,copy))} return res});
    const first=await Promise.race([net.catch(()=>null),new Promise(ok=>setTimeout(ok,5000,null))]);
    if(first) return first;
    return (await c.match(r,{ignoreSearch:same}))||net;
  })());
});
