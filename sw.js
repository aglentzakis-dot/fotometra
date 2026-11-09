/* ΦωτοΜέτρα — service worker */
/* ΚΑΝΟΝΑΣ GlenApps (10/11/2026): η εφαρμογή ανοίγει αμέσως από τη συσκευή· δίκτυο το πολύ 3″ — ΜΗΝ αφαιρεθεί.
   gaNet(δίκτυο, αποθήκη, συμβάν): αν το δίκτυο δεν απαντήσει σε 3″ και υπάρχει αποθηκευμένο αντίγραφο, δίνεται αυτό
   (το δίκτυο συνεχίζει στο παρασκήνιο και ενημερώνει την αποθήκη)· μετά από καθυστέρηση, για 30″ όλα κατευθείαν από τη συσκευή.
   Σφάλμα διακομιστή (5xx) δεν αντικαθιστά το αποθηκευμένο. Οι αναβαθμίσεις έρχονται όπως πριν (νέο όνομα αποθήκης σε κάθε έκδοση). */
var GA_MS=3000,gaSlow=0;
function gaNet(net,fromCache,ev){var p=Promise.resolve(net);try{ev&&ev.waitUntil&&ev.waitUntil(p.catch(function(){}))}catch(x){}
  function fc(){try{return Promise.resolve(fromCache()).catch(function(){})}catch(x){return Promise.resolve()}}
  if(Date.now()<gaSlow)return fc().then(function(c){return c||p});
  return new Promise(function(ok){var done=false,t;function fin(r){if(!done){done=true;clearTimeout(t);ok(r)}}
    t=setTimeout(function(){fc().then(function(c){if(c){gaSlow=Date.now()+30000;fin(c)}})},GA_MS);
    p.then(function(r){if(r&&r.status>=500)fc().then(function(c){fin(c||r)});else fin(r)},function(){fc().then(function(c){fin(c||Response.error())})});});}
const V = 'fotometra-2.9.10';
const FILES = [
  './', './index.html','./plaisio.js', './efarmoges-mas.js', './metafora-rythmisi.js', './metafora-lipsi.js', './manifest.json',
  './embed.js', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(gaNet(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(V).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      ,() => caches.match(e.request).then(r => r || caches.match('./index.html')),e));
});
