import apiClient from "./apiClient.js";
import { apiCache } from "./cacheManager.js";
import { getBooks } from "./bookService.js";

/**
 * Fetch Paginated Audiobooks with Fallback to All MongoDB Books
 * @param {object} params { page, limit, search, genre, sortBy }
 */
export const getAudiobooks = async (params = {}) => {
  const cacheKey = `audiobooks:list:${JSON.stringify(params)}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    // 1. Try dedicated audiobooks endpoint
    const response = await apiClient.get("/api/audiobooks", { params });
    if (response.data && response.data.audiobooks && response.data.audiobooks.length > 0) {
      apiCache.set(cacheKey, response.data, 30);
      return response.data;
    }
  } catch (err) {
    console.warn("Audiobook API endpoint notice, falling back to books API:", err);
  }

  try {
    // 2. Fallback to /api/books to fetch ALL author books directly from MongoDB
    const booksData = await getBooks(params);
    if (booksData) {
      const booksArray = Array.isArray(booksData) ? booksData : (booksData.books || []);
      const formattedResult = {
        audiobooks: booksArray,
        currentPage: booksData.currentPage || params.page || 1,
        totalPages: booksData.totalPages || 1,
        totalAudiobooks: booksData.totalBooks || booksArray.length,
      };
      apiCache.set(cacheKey, formattedResult, 30);
      return formattedResult;
    }
  } catch (err) {
    console.error("Error fetching fallback books for audiobooks:", err);
  }

  return null;
};

/**
 * Fetch Single Audiobook Details by ID
 */
export const getAudiobookById = async (id) => {
  const cacheKey = `audiobooks:id:${id}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await apiClient.get(`/api/audiobooks/${id}`);
    apiCache.set(cacheKey, response.data, 30);
    return response.data;
  } catch (err) {
    // Fallback to /api/books/:id
    const response = await apiClient.get(`/api/books/${id}`);
    apiCache.set(cacheKey, response.data, 30);
    return response.data;
  }
};

/**
 * Publish New Audiobook
 */
export const createAudiobook = async (audiobookData) => {
  const response = await apiClient.post("/api/audiobooks", audiobookData);
  apiCache.invalidate("audiobooks:");
  return response.data;
};
