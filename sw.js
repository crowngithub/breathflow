/**
 * 息道 AI Service Worker - 离线运行保障
 * 负责缓存网页资源及图标，实现类似原生 App 的秒开体验
 */

const CACHE_NAME = 'breathflow-ai-v15';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './apple-touch-icon.png'
];

// 1. 安装阶段：下载并缓存所有静态资源
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 正在预缓存资源...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 激活阶段：清理旧版本的缓存，释放空间
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // 确保 SW 立即接管页面控制权
  return self.clients.claim();
});

// 3. 拦截请求：优先尝试从缓存获取，如果缓存没有则请求网络
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
