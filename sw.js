const C='bf-v2',A=['./','index.html','logo.png','sydneywater.svg','signature.png','icon-192.png','icon-512.png','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// network first (so updates arrive straight away), but give up after 4s and use the saved copy so it opens with no/poor signal
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!='GET'||u.origin!=location.origin)return;
 e.respondWith((async()=>{const c=await caches.open(C);try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),4000);const r=await fetch(e.request,{signal:ctl.signal});clearTimeout(t);if(r.ok)c.put(e.request,r.clone());return r}
  catch(_){return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('index.html'))||(await c.match('./'))}})())});
