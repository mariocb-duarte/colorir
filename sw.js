// Service worker do Colorir: guarda o app e a biblioteca de IA para uso offline.
// O modelo (~17 MB) é guardado pela própria página no cache "colorir-modelo-v1";
// aqui ele não é duplicado. Ao mudar arquivos do app, aumente a versão abaixo.
const VERSION = 'colorir-app-v1';
const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.10.0/dist/';
const APP = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const CDN = [ORT + 'ort.js', ORT + 'ort-wasm-simd.wasm', ORT + 'ort-wasm.wasm'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(APP);
    // Biblioteca de IA: melhor esforço (se falhar, é guardada no primeiro uso)
    await Promise.all(CDN.map(u => c.add(new Request(u, { mode: 'cors' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys())
      if (k.startsWith('colorir-app-') && k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Modelo no Hugging Face: a página já cuida do cache dele
  if (url.hostname.endsWith('huggingface.co') || url.hostname.endsWith('hf.co')) return;

  // Página: tenta a rede primeiro (pega atualizações) e cai para o cache sem internet
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        const c = await caches.open(VERSION);
        c.put('./index.html', r.clone());
        return r;
      } catch {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Demais arquivos (do app, CDN da IA, fontes): cache primeiro, rede se faltar
  const same = url.origin === self.location.origin;
  const cdn = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname);
  if (!same && !cdn) return;
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreVary: true });
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok || r.type === 'opaque') {
      const c = await caches.open(VERSION);
      c.put(req, r.clone()).catch(() => {});
    }
    return r;
  })());
});
