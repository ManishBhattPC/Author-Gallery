import apiClient from "./apiClient.js";
import { apiCache } from "./cacheManager.js";

/**
 * Fetch Paginated Audiobooks
 * @param {object} params { page, limit, search, genre, sortBy }
 */
export const getAudiobooks = async (params = {}) => {
  const cacheKey = `audiobooks:list:${JSON.stringify(params)}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await apiClient.get("/api/audiobooks", { params });
    apiCache.set(cacheKey, response.data, 30); // Cache for 30 seconds
    return response.data;
  } catch (err) {
    console.warn("Audiobook API endpoint fallback to local dataset:", err);
    return null;
  }
};

/**
 * Fetch Single Audiobook Details by ID
 */
export const getAudiobookById = async (id) => {
  const cacheKey = `audiobooks:id:${id}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get(`/api/audiobooks/${id}`);
  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

/**
 * Publish New Audiobook
 */
export const createAudiobook = async (audiobookData) => {
  const response = await apiClient.post("/api/audiobooks", audiobookData);
  apiCache.invalidate("audiobooks:");
  return response.data;
};
