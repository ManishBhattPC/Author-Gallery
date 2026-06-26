class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached item if it exists and is not expired
   * @param {string} key 
   * @returns {any|null}
   */
  get(key) {
    if (!this.cache.has(key)) return null;

    const item = this.cache.get(key);
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set cache item with specific TTL (Time To Live)
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds 
   */
  set(key, value, ttlSeconds = 30) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Invalidate all keys matching a specific prefix
   * @param {string} prefix 
   */
  invalidate(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}

export const apiCache = new CacheManager();
export default apiCache;
