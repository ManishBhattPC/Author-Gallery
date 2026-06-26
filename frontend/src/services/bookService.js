import apiClient from "./apiClient.js";
import { apiCache } from "./cacheManager.js";

export const getBooks = async (params = {}) => {
  const cacheKey = `books:list:${JSON.stringify(params)}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/books", {
    params, // Search, genre, pagination filters
  });

  apiCache.set(cacheKey, response.data, 30); // Cache for 30s
  return response.data;
};

export const getMyBooks = async () => {
  const cacheKey = "books:my-books";
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/books/my-books");

  apiCache.set(cacheKey, response.data, 15); // Cache for 15s
  return response.data;
};

export const searchBooks = async (query) => {
  const cacheKey = `books:search:${query}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/books", {
    params: { search: query }, // Search by title
  });

  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

export const fetchBookById = async (id) => {
  const cacheKey = `books:id:${id}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get(`/api/books/${id}`);

  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

export const createBook = async (formData) => {
  const response = await apiClient.post(
    "/api/books",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Required for image + PDF upload
      },
    }
  );

  apiCache.invalidate("books:"); // Invalidate cached books
  return response.data;
};

export const updateBook = async (id, bookPayload) => {
  const response = await apiClient.put(
    `/api/books/${id}`,
    bookPayload
  );

  apiCache.invalidate("books:"); // Invalidate cached books
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/api/books/${id}`);

  apiCache.invalidate("books:"); // Invalidate cached books
  return response.data;
};

/*
Future Roadmap

1. Advanced Search
--------------------------------
- Search by author name
- Search by multiple genres
- Search by tags

2. Sorting
--------------------------------
- Newest books
- Oldest books
- Price low to high
- Price high to low

3. Analytics
--------------------------------
- Most viewed books
- Most downloaded books

4. Admin Features
--------------------------------
- Admin get all books
- Admin update any book
- Admin delete any book

5. API Improvements
--------------------------------
- Move query builders to separate utilities
- Add request caching
- Add optimistic UI updates
*/