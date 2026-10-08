/*
 * Service worker that keeps the app working without a connection, for
 * example on a tablet with no Wi-Fi. Registered by src/lib/service-worker.ts
 * as /sw.js?v=<Next.js build id>, so every deployed build installs a fresh
 * copy with its own cache:
 *
 * - On install it downloads every page in /api/offline-pages with the
 *   scripts, styles, fonts and page data each one uses, plus all exam
 *   questions, so any exam works offline even if it was never opened.
 * - Pages and question files come from the network when it answers and
 *   from the cache when it doesn't, so online visitors always get the
 *   newest build. Build files (/_next/static) never change, so they come
 *   from the cache first.
 * - /api/ requests are never cached: the update notice needs the version
 *   the server is really running.
 */

const version = new URL(self.location.href).searchParams.get('v') || 'dev';
const cacheName = `azure-exams-${version}`;
const cachePrefix = 'azure-exams-';

/** How long to wait for the server before answering from the cache. */
const networkTimeout = 6000;

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((name) => name.startsWith(cachePrefix) && name !== cacheName).map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, { fallback: '/', store: false }));
  } else {
    event.respondWith(networkFirst(request, { store: true }));
  }
});

/** Downloads everything the app needs offline into this build's cache. */
async function precache() {
  const cache = await caches.open(cacheName);
  const res = await fetch('/api/offline-pages', { cache: 'no-store' });
  if (!res.ok) throw new Error(`offline-pages: HTTP ${res.status}`);
  const { pages, files } = await res.json();

  const assets = new Set(files);
  const dataUrls = new Set();
  await Promise.all(
    pages.map(async (page) => {
      const pageRes = await fetch(page, { cache: 'reload' });
      if (!pageRes.ok) throw new Error(`${page}: HTTP ${pageRes.status}`);
      const html = await pageRes.clone().text();
      await cache.put(page, pageRes);
      for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(match[1]);
      // Client-side navigation to pages with getStaticProps loads their props from here.
      const buildId = html.match(/"buildId":"([^"]+)"/)?.[1];
      if (buildId) dataUrls.add(`/_next/data/${buildId}${page === '/' ? '/index' : page}.json`);
    })
  );

  // Fonts are only referenced from the style sheets.
  const styleSheets = [...assets].filter((asset) => asset.endsWith('.css'));
  await Promise.all(
    styleSheets.map(async (sheet) => {
      const css = await (await fetch(sheet)).text();
      for (const match of css.matchAll(/url\((\/_next\/static\/[^)"']+)\)/g)) assets.add(match[1]);
    })
  );

  await cache.addAll([...assets]);
  // Pages without getStaticProps have no data file; skip those.
  await Promise.all(
    [...dataUrls].map(async (dataUrl) => {
      const dataRes = await fetch(dataUrl, { cache: 'reload' });
      if (dataRes.ok) await cache.put(dataUrl, dataRes);
      // An unread 404 body keeps its connection busy, and the browser only opens a few per server.
      else await dataRes.body?.cancel();
    })
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, res.clone());
  }
  return res;
}

/**
 * Asks the network first. When it fails, or takes longer than
 * networkTimeout while a cached copy exists, answers from the cache instead.
 * Query strings are ignored when looking in the cache, so
 * /exams/az-104?mode=review finds /exams/az-104.
 */
async function networkFirst(request, { fallback, store }) {
  const cached = (await caches.match(request, { ignoreSearch: true })) || (fallback && (await caches.match(fallback)));
  const network = fetch(request).then(async (res) => {
    if (store && res.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, res.clone());
    }
    return res;
  });
  if (!cached) return network;
  // The cache answers if the network fails late; don't report that as an error.
  network.catch(() => {});

  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(cached), networkTimeout);
  });
  try {
    return await Promise.race([network, timeout]);
  } catch {
    return cached;
  } finally {
    clearTimeout(timer);
  }
}
