const CACHE='flip-and-guess-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('flip-and-guess-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    const requested=new URL(req.url);const scope=new URL(self.registration.scope);
    if(requested.pathname===scope.pathname||requested.pathname===new URL('index.html',scope).pathname){
      event.respondWith(fetch(req).then(async response=>{if(response.ok){try{await (await caches.open(CACHE)).put('./index.html',response.clone());}catch{}}return response;}).catch(()=>caches.match('./index.html')));return;
    }
  }
  const known=ASSETS.slice(1).some(path=>new URL(path,self.registration.scope).href===req.url);
  if(known)event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
