// cacheUtils.js

const CACHE_PREFIX = 'myAppCache_';
const CACHE_TIMEOUT = 3600000; // 5 minutes

export const getCachedData = (key) => {
  const cached = localStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;

  const parsed = JSON.parse(cached);
  const now = new Date().getTime();

  if (now - parsed.timestamp > CACHE_TIMEOUT) {
    localStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }

  return parsed.data;
};

export const setCachedData = (key, data) => {
  const now = new Date().getTime();
  const cacheEntry = {
    timestamp: now,
    data,
  };

  localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheEntry));
};

export const clearCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
};
